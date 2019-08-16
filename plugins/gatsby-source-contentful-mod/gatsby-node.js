"use strict";

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step("next", value);
            },
            function(err) {
              step("throw", err);
            }
          );
        }
      }
      return step("next");
    });
  };
}

var _ = require("lodash");

var normalize = require("./normalize");
var fetchData = require("./fetch");

var conflictFieldPrefix = "contentful";

// restrictedNodeFields from here https://www.gatsbyjs.org/docs/node-interface/
var restrictedNodeFields = ["id", "children", "parent", "fields", "internal"];

exports.setFieldsOnGraphQLNodeType = require("./extend-node-type").extendNodeType;

/***
 * Localization algorithm
 *
 * 1. Make list of all resolvable IDs worrying just about the default ids not
 * localized ids
 * 2. Make mapping between ids, again not worrying about localization.
 * 3. When creating entries and assets, make the most localized version
 * possible for each localized node i.e. get the localized field if it exists
 * or the fallback field or the default field.
 */

exports.sourceNodes = (function() {
  var _ref = _asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee(_ref2, _ref3) {
      var boundActionCreators = _ref2.boundActionCreators,
        getNodes = _ref2.getNodes,
        hasNodeChanged = _ref2.hasNodeChanged,
        store = _ref2.store;
      var spaceId = _ref3.spaceId,
        accessToken = _ref3.accessToken,
        host = _ref3.host;

      var createNode,
        deleteNodes,
        touchNode,
        setPluginStatus,
        syncToken,
        _ref4,
        currentSyncData,
        contentTypeItems,
        defaultLocale,
        locales,
        entryList,
        existingNodes,
        assets,
        nextSyncToken,
        resolvable,
        foreignReferenceMap,
        newOrUpdatedEntries;

      return regeneratorRuntime.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                (createNode = boundActionCreators.createNode),
                  (deleteNodes = boundActionCreators.deleteNodes),
                  (touchNode = boundActionCreators.touchNode),
                  (setPluginStatus = boundActionCreators.setPluginStatus);

                host = host || "cdn.contentful.com";
                // Get sync token if it exists.
                syncToken = void 0;

                if (
                  store.getState().status.plugins &&
                  store.getState().status.plugins["gatsby-source-contentful"]
                ) {
                  syncToken = store.getState().status.plugins[
                    "gatsby-source-contentful"
                  ].status.syncToken;
                }

                _context.next = 6;
                return fetchData({
                  syncToken: syncToken,
                  spaceId: spaceId,
                  accessToken: accessToken,
                  host: host
                });

              case 6:
                _ref4 = _context.sent;
                currentSyncData = _ref4.currentSyncData;
                contentTypeItems = _ref4.contentTypeItems;
                defaultLocale = _ref4.defaultLocale;
                locales = _ref4.locales;
                entryList = normalize.buildEntryList({
                  currentSyncData: currentSyncData,
                  contentTypeItems: contentTypeItems
                });

                // Remove deleted entries & assets.
                // TODO figure out if entries referencing now deleted entries/assets
                // are "updated" so will get the now deleted reference removed.

                deleteNodes(
                  currentSyncData.deletedEntries.map(function(e) {
                    return e.sys.id;
                  })
                );
                deleteNodes(
                  currentSyncData.deletedAssets.map(function(e) {
                    return e.sys.id;
                  })
                );

                existingNodes = getNodes().filter(function(n) {
                  return n.internal.owner === "gatsby-source-contentful";
                });

                existingNodes.forEach(function(n) {
                  return touchNode(n.id);
                });

                assets = currentSyncData.assets;

                console.log("Updated entries ", currentSyncData.entries.length);
                console.log(
                  "Deleted entries ",
                  currentSyncData.deletedEntries.length
                );
                console.log("Updated assets ", currentSyncData.assets.length);
                console.log(
                  "Deleted assets ",
                  currentSyncData.deletedAssets.length
                );
                console.timeEnd("Fetch Contentful data");

                // Update syncToken
                nextSyncToken = currentSyncData.nextSyncToken;

                // Store our sync state for the next sync.
                // TODO: we do not store the token if we are using preview, since only initial sync is possible there
                // This might change though
                // TODO: Also we should think about not overriding tokens between host

                if (host !== "preview.contentful.com") {
                  setPluginStatus({
                    status: {
                      syncToken: nextSyncToken
                    }
                  });
                }

                // Create map of resolvable ids so we can check links against them while creating
                // links.
                resolvable = normalize.buildResolvableSet({
                  existingNodes: existingNodes,
                  entryList: entryList,
                  assets: assets,
                  defaultLocale: defaultLocale,
                  locales: locales
                });

                // Build foreign reference map before starting to insert any nodes

                foreignReferenceMap = normalize.buildForeignReferenceMap({
                  contentTypeItems: contentTypeItems,
                  entryList: entryList,
                  resolvable: resolvable,
                  defaultLocale: defaultLocale,
                  locales: locales
                });
                newOrUpdatedEntries = [];

                entryList.forEach(function(entries) {
                  entries.forEach(function(entry) {
                    newOrUpdatedEntries.push(entry.sys.id);
                  });
                });

                // Update existing entry nodes that weren't updated but that need reverse
                // links added.
                Object.keys(foreignReferenceMap);
                existingNodes
                  .filter(function(n) {
                    return _.includes(newOrUpdatedEntries, n.id);
                  })
                  .forEach(function(n) {
                    if (foreignReferenceMap[n.id]) {
                      foreignReferenceMap[n.id].forEach(function(
                        foreignReference
                      ) {
                        // Add reverse links
                        if (n[foreignReference.name]) {
                          n[foreignReference.name].push(foreignReference.id);
                          // It might already be there so we'll uniquify after pushing.
                          n[foreignReference.name] = _.uniq(
                            n[foreignReference.name]
                          );
                        } else {
                          // If is one foreign reference, there can always be many.
                          // Best to be safe and put it in an array to start with.
                          n[foreignReference.name] = [foreignReference.id];
                        }
                      });
                    }
                  });

                contentTypeItems.forEach(function(contentTypeItem, i) {
                  normalize.createContentTypeNodes({
                    contentTypeItem: contentTypeItem,
                    restrictedNodeFields: restrictedNodeFields,
                    conflictFieldPrefix: conflictFieldPrefix,
                    entries: entryList[i],
                    createNode: createNode,
                    resolvable: resolvable,
                    foreignReferenceMap: foreignReferenceMap,
                    defaultLocale: defaultLocale,
                    locales: locales
                  });
                });

                assets.forEach(function(assetItem) {
                  normalize.createAssetNodes({
                    assetItem: assetItem,
                    createNode: createNode,
                    defaultLocale: defaultLocale,
                    locales: locales
                  });
                });

                return _context.abrupt("return");

              case 33:
              case "end":
                return _context.stop();
            }
          }
        },
        _callee,
        undefined
      );
    })
  );

  return function(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

// TODO: move this somewhere else but problem with types
// CUSTOM TYPE
exports.onCreateNode = ({ node, boundActionCreators }) => {
  const { createNode, deleteNode } = boundActionCreators;
  // TODO: check if I exclude and include all the good types minuscule, majuscule...
  // console.log(node.internal.type)
  // contentfulCollectionItemContentTextNode
  if (
    node.internal.type.match(
      /ContentfulBlockReferences|ContentfulBlockGallery|ContentfulCollectionItem|ContentfulCollectionItemContentTextNode|SitePage|SitePlugin|Site|ContentfulContentType|ContentfulSettings|ContentfulBlockFreeText|ContentfulPage|ContentfulBlockForm|ContentfulSection|ContentfulCustomContentType|ContentfulAsset|contentfulBlockFreeTextMainTextNode|contentfulCollectionItemContentTextNode|MarkdownRemark|contentfulBlockFormSuccessMessageTextNode|contentfulBlockFormErrorMessageTextNode|ContentfulScript|contentfulScriptContentTextNode/
    )
  ) {
    return;
  }

  // ContentfulBlogPost
  // ContentfulCollectionItem
  if (node.internal.type.match(/ContentTextNode/)) {
    deleteNode(node.id, node);
    // const { name, datePublished, dateLastEdit,
    // categories,
    // metadata,
    // style,
    // options,
    // featuredImage___NODE,
    // content___NODE,
    // id,
    // parent,
    // children}
    node.internal.type = `contentfulCollectionItemContentTextNode`;
    node.internal.owner = ``;
    // console.log(node)
    // { id: 'c2KylvkKCeskG8oO4ciWYwS___fr-BEcontentTextNode',
    //   parent: 'c2KylvkKCeskG8oO4ciWYwS___fr-BE',
    //   children:
    //    [ 'c2KylvkKCeskG8oO4ciWYwS___fr-BEcontentTextNode >>> MarkdownRemark' ],
    //   content: '# I\'ll have a title\n\n![toile-io 500px-04](//images.contentful.com/unj9ak9zbmaz/6EW8Is6nwAAEAW0MYWUQwe/045aef3f0fb9a247dfa0affb687d8bcd/toile-io_500px-04.png)\n\nAnd some text',
    //   internal:
    //    { type: 'ToileCollectionItemContentTextNode',
    //      mediaType: 'text/markdown',
    //      content: '# I\'ll have a title\n\n![toile-io 500px-04](//images.contentful.com/unj9ak9zbmaz/6EW8Is6nwAAEAW0MYWUQwe/045aef3f0fb9a247dfa0affb687d8bcd/toile-io_500px-04.png)\n\nAnd some text',
    //      contentDigest: 'd8bd49b7009d713941615d9484028092',
    //      owner: '' } }

    createNode(node);
    return;
  }
  deleteNode(node.id, node);
  node.type = node.type || node.parent;
  node.internal.type = `ContentfulCollectionItem`;
  node.internal.owner = ``;
  // console.log(node)
  // { name: 'Music 1',
  // type: 'music',
  // datePublished: '2017-09-29',
  // dateLastEdit: '2017-09-29',
  // categories: [ '' ],
  // metadata: { _json_: '{}' },
  // style: { _json_: '{}' },
  // options: { _json_: '{}' },
  // featuredImage___NODE: 'c6h7OmzO7jGWoIUCgiwOm4E___fr-BE',
  // section___NODE: [ 'c3cb3xxbGnK40oWmoe4aaiq___fr-BE' ],
  // content___NODE: 'c2E5NRXrTEMGWwSWgSU6cW___fr-BEcontentTextNode',
  // id: 'c2E5NRXrTEMGWwSWgSU6cW___fr-BE',
  // parent: 'Collection Item',
  // children: [ 'c2E5NRXrTEMGWwSWgSU6cW___fr-BEcontentTextNode' ],
  // internal:
  //  { type: 'ToileCollectionItem',
  //    contentDigest: '964862368e4e11e837e8109fa2bc7d46',
  //    owner: '' },
  // node_locale: 'fr-BE' }

  createNode(node);

  // SitePage
  // SitePlugin
  // Site
  // ContentfulContentType
  // ContentfulSettings
  // ContentfulBlockFreeText
  // ContentfulPage
  // ContentfulBlockForm
  // ContentfulSection
  // ContentfulCustomContentType
  // ContentfulAsset
  // contentfulBlockFreeTextMainTextNode
  //
  // ContentfulBlogPost
  // contentfulBlogPostContentTextNode
  //
  // ContentfulCollectionItem
  // contentfulCollectionItemContentTextNode
  // MarkdownRemark
};

// // TODO: do it also for settings
// // IDEA: put default asset id for every unset image in any node
// let getFirstAssetId = false
// let getFirstContentTextId = false
// exports.onCreateNode = ({ node, boundActionCreators }) => {
//   const { createNode } = boundActionCreators
//   console.log(node.internal.type)
//   if (node.internal.type === "ContentfulAsset" && !getFirstAssetId) {
//     getFirstAssetId = true
//     collectionItemNode.featuredImage___NODE = node.id
//     collectionItemNode.gallery___NODE = [node.id]
//
//     settingsNode.favicon___NODE = node.id
//     settingsNode.facebookImage___NODE = node.id
//
//     createNode(settingsNode)
//     return
//   }
//   if (
//     node.internal.type === "contentfulCollectionItemContentTextNode" &&
//     !getFirstContentTextId
//   ) {
//     getFirstContentTextId = true
//     collectionItemNode.content___NODE = node.id
//
//     // createNode(collectionItemMarkdownRemarkNode)
//     createNode(collectionItemContentTextNode)
//     createNode(collectionItemNode)
//     return
//   }
//   // if (node.internal.type === "MarkdownRemark") {
//   //   console.log(node)
//   //
//   //   return
//   // }
// }
// exports.onPreBootstrap = ({ boundActionCreators }) => {
//   const { createNode } = boundActionCreators
//   return new Promise((resolve, reject) => {
//     // createNode(blockFreeTextMarkdownRemarkNode)
//     createNode(blockFreeTextMainTextNode)
//     createNode(blockFreeTextNode)
//     createNode(blockFormNode)
//     createNode(sectionNode)
//     createNode(pageNode)
//
//   }).then() => {
//     resolve()
//   }
// }
//
// let settingsNode = {
//   name: "IGNORE",
//   metadata: { _json_: "{}" },
//   colors: { _json_: "{}" },
//   fonts: { _json_: "{}" },
//   contact: { _json_: "{}" },
//   style: { _json_: "{}" },
//   gaTrackingId: "",
//   options: { _json_: "{}" },
//   menu___NODE: ["pageNodeIgnore"],
//   favicon___NODE: "",
//   facebookImage___NODE: "",
//   id: "settingsNodeIgnore",
//   parent: "Settings",
//   children: [],
//   internal: {
//     type: "ContentfulSettings",
//     contentDigest: "---"
//   },
//   node_locale: "en-BE"
// }
// const pageNode = {
//   path: "IGNORE",
//   metadata: { _json_: "{}" },
//   style: { _json_: "{}" },
//   options: { _json_: "{}" },
//   blocks___NODE: [
//     "sectionNodeIgnore",
//     "blockFreeTextNodeIgnore",
//     "blockFormNodeIgnore"
//   ],
//   settings___NODE: ["settingsNodeIgnore"],
//   id: "pageNodeIgnore",
//   parent: "Page",
//   children: [],
//   internal: {
//     type: "ContentfulPage",
//     contentDigest: "---"
//   },
//   node_locale: "en-BE"
// }
//
// let collectionItemNode = {
//   name: "IGNORE",
//   type: "",
//   datePublished: "",
//   dateLastEdit: "",
//   categories: [""],
//   metadata: { _json_: "{}" },
//   style: { _json_: "{}" },
//   options: { _json_: "{}" },
//   featuredImage___NODE: "",
//   section___NODE: ["c3cb3xxbGnK40oWmoe4aaiq"],
//   content___NODE: "collectionItemNodeIgnorecontentTextNode",
//   gallery___NODE: [""],
//   id: "collectionItemNodeIgnore",
//   parent: "Collection Item",
//   children: ["collectionItemNodeIgnorecontentTextNode"],
//   internal: {
//     type: "ContentfulCollectionItem",
//     contentDigest: "---"
//   },
//   node_locale: "en-BE"
// }
// const collectionItemContentTextNode = {
//   id: "collectionItemNodeIgnorecontentTextNode",
//   parent: "collectionItemNodeIgnore",
//   children: ["collectionItemNodeIgnorecontentTextNode >>> MarkdownRemark"],
//   content: " ",
//   internal: {
//     type: "contentfulCollectionItemContentTextNode",
//     mediaType: "text/markdown",
//     content: " ",
//     contentDigest: "---"
//   }
// }
// const collectionItemMarkdownRemarkNode = {
//   id: "collectionItemNodeIgnorecontentTextNode >>> MarkdownRemark",
//   children: [],
//   parent: "collectionItemNodeIgnorecontentTextNode",
//   internal: {
//     content: " ",
//     type: "MarkdownRemark",
//     contentDigest: "---"
//   },
//   frontmatter: {
//     title: "",
//     _PARENT: "collectionItemNodeIgnorecontentTextNode",
//     parent: "collectionItemNodeIgnorecontentTextNode"
//   }
// }
// const blockFreeTextNode = {
//   name: "IGNORE",
//   style: { _json_: "{}" },
//   options: { _json_: "{}" },
//   page___NODE: ["pageNodeIgnore"],
//   section___NODE: ["sectionNodeIgnore"],
//   main___NODE: "blockFreeTextNodeIgnoremainTextNode",
//   id: "blockFreeTextNodeIgnore",
//   parent: "Block - Free Text",
//   children: ["blockFreeTextNodeIgnoremainTextNode"],
//   internal: {
//     type: "ContentfulBlockFreeText",
//     contentDigest: "---"
//   },
//   node_locale: "en-BE"
// }
// // { name: 'IGNORE',
// //   style: { none: '', _json_: '{"none":""}' },
// //   options: { none: '', _json_: '{"none":""}' },
// //   page___NODE: [ 'c1lBpIm4gscEsu4IGImAIwK___fr-BE' ],
// //   section___NODE: [ 'c1B5NSvr8ksqgOIuEgAkWIO___fr-BE' ],
// //   main___NODE: 'c2yFuwhdYPe02qyU0YW6yOE___fr-BEmainTextNode',
// //   id: 'c2yFuwhdYPe02qyU0YW6yOE___fr-BE',
// //   parent: 'Block - Free Text',
// //   children: [ 'c2yFuwhdYPe02qyU0YW6yOE___fr-BEmainTextNode' ],
// //   internal:
// //    { type: 'ContentfulBlockFreeText',
// //      contentDigest: '8bb03ba9f6b113dcacd8f65ae0128559',
// //      owner: 'gatsby-source-contentful-mod' },
// //   node_locale: 'fr-BE' }
// const blockFreeTextMainTextNode = {
//   id: "blockFreeTextNodeIgnoremainTextNode",
//   parent: "blockFreeTextNodeIgnore",
//   children: ["blockFreeTextNodeIgnoremainTextNode >>> MarkdownRemark"],
//   main: " ",
//   internal: {
//     type: "contentfulBlockFreeTextMainTextNode",
//     mediaType: "text/markdown",
//     content: " ",
//     contentDigest: "---"
//   }
// }
// const blockFreeTextMarkdownRemarkNode = {
//   id: "blockFreeTextNodeIgnoremainTextNode >>> MarkdownRemark",
//   children: [],
//   parent: "blockFreeTextNodeIgnoremainTextNode",
//   internal: {
//     content: " ",
//     type: "MarkdownRemark",
//     contentDigest: "---"
//   },
//   frontmatter: {
//     title: "",
//     _PARENT: "blockFreeTextNodeIgnoremainTextNode",
//     parent: "blockFreeTextNodeIgnoremainTextNode"
//   }
// }
// const blockFormNode = {
//   name: "IGNORE",
//   form: { _json_: "{}" },
//   style: { _json_: "{}" },
//   options: { _json_: "{}" },
//   page___NODE: ["pageNodeIgnore"],
//   section___NODE: ["sectionNodeIgnore"],
//   id: "blockFormNodeIgnore",
//   parent: "Block - Form",
//   children: [],
//   internal: {
//     type: "ContentfulBlockForm",
//     contentDigest: "---"
//   },
//   node_locale: "en-BE"
// }
// // { name: 'IGNORE',
// //   form:
// //    { fields: [ [Object] ],
// //      _json_: '{"fields":[{"name":"","rows":"","type":"","label":"","value":"","required":"","placeholder":""}]}' },
// //   style: { none: '', _json_: '{"none":""}' },
// //   options: { colorCombo: '', _json_: '{"colorCombo":""}' },
// //   page___NODE: [ 'c1lBpIm4gscEsu4IGImAIwK___fr-BE' ],
// //   section___NODE: [ 'c1B5NSvr8ksqgOIuEgAkWIO___fr-BE' ],
// //   id: 'c2LRA32wCVOIegUCE0gEKyY___fr-BE',
// //   parent: 'Block - Form',
// //   children: [],
// //   internal:
// //    { type: 'ContentfulBlockForm',
// //      contentDigest: '6d4009bc22daaa26d635b5ee4757f3ec',
// //      owner: 'gatsby-source-contentful-mod' },
// //   node_locale: 'fr-BE' }
// const sectionNode = {
//   name: "IGNORE",
//   options: { _json_: "{}" },
//   style: { _json_: "{}" },
//   blocks___NODE: [
//     "blockFormNodeIgnore",
//     "blockFormNodeIgnore",
//     "collectionItemNodeIgnore"
//   ],
//   page___NODE: ["pageNodeIgnore"],
//   id: "sectionNodeIgnore",
//   parent: "Section",
//   children: [],
//   internal: {
//     type: "ContentfulSection",
//     contentDigest: "---"
//   },
//   node_locale: "en-BE"
// }
// // { name: 'IGNORE',
// //   options: { _json_: '{}' },
// //   style: { _json_: '{}' },
// //   blocks___NODE:
// //    [ 'c2LRA32wCVOIegUCE0gEKyY___fr-BE',
// //      'c2yFuwhdYPe02qyU0YW6yOE___fr-BE' ],
// //   page___NODE: [ 'c1lBpIm4gscEsu4IGImAIwK___fr-BE' ],
// //   id: 'c1B5NSvr8ksqgOIuEgAkWIO___fr-BE',
// //   parent: 'Section',
// //   children: [],
// //   internal:
// //    { type: 'ContentfulSection',
// //      contentDigest: '9ec4de7f29e22b664123552d84ac23e1',
// //      owner: 'gatsby-source-contentful-mod' },
// //   node_locale: 'fr-BE' }
