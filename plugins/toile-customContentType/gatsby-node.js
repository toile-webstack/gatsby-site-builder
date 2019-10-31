const _ = require(`lodash`);
const Promise = require(`bluebird`);
const path = require(`path`);
const parseFilepath = require(`parse-filepath`);
const fs = require(`fs-extra`);
const slash = require(`slash`);
const slugify = require("slugify");
const { createPath } = require(`../../utils/utils.js`);
// const {
//   GraphQLObjectType,
//   GraphQLList,
//   GraphQLString,
//   GraphQLInt,
//   GraphQLEnumType
// } = require(`graphql`)

// const destFile = "src/utils/siteSettings.json"

// exports.onCreateNode = ({ node, actions }) => {
//   const { createNode, createNodeField } = actions
//   if (
//     node.internal.type.match(
//       /SitePage|SitePlugin|Site|ContentfulContentType|ContentfulSettings|ContentfulBlockFreeText|ContentfulPage|ContentfulBlockForm|ContentfulSection|ContentfulCustomContentType|ContentfulAsset|contentfulBlockFreeTextMainTextNode|contentfulCollectionItemContentTextNode|MarkdownRemark/
//     )
//   ) {
//     return
//   }
//
//   // ContentfulBlogPost
//   // ContentfulCollectionItem
//   if (node.internal.type.match(/ContentTextNode/)) {
//     // const { name, datePublished, dateLastEdit,
//     // categories,
//     // metadata,
//     // style,
//     // options,
//     // featuredImage___NODE,
//     // content___NODE,
//     // id,
//     // parent,
//     // children}
//     node.internal.type = `ToileCollectionItemContentTextNode`
//     node.internal.owner = ``
//     // console.log(node)
//     // { id: 'c2KylvkKCeskG8oO4ciWYwS___fr-BEcontentTextNode',
//     //   parent: 'c2KylvkKCeskG8oO4ciWYwS___fr-BE',
//     //   children:
//     //    [ 'c2KylvkKCeskG8oO4ciWYwS___fr-BEcontentTextNode >>> MarkdownRemark' ],
//     //   content: '# I\'ll have a title\n\n![toile-io 500px-04](//images.contentful.com/unj9ak9zbmaz/6EW8Is6nwAAEAW0MYWUQwe/045aef3f0fb9a247dfa0affb687d8bcd/toile-io_500px-04.png)\n\nAnd some text',
//     //   internal:
//     //    { type: 'ToileCollectionItemContentTextNode',
//     //      mediaType: 'text/markdown',
//     //      content: '# I\'ll have a title\n\n![toile-io 500px-04](//images.contentful.com/unj9ak9zbmaz/6EW8Is6nwAAEAW0MYWUQwe/045aef3f0fb9a247dfa0affb687d8bcd/toile-io_500px-04.png)\n\nAnd some text',
//     //      contentDigest: 'd8bd49b7009d713941615d9484028092',
//     //      owner: '' } }
//
//     createNode(node)
//     return
//   }
//   node.type =
//     node.internal.type === `ContentfulCollectionItem` ? node.type : node.parent
//   node.internal.type = `ToileCollectionItem`
//   node.internal.owner = ``
//   // console.log(node)
//   // { name: 'Music 1',
//   // type: 'music',
//   // datePublished: '2017-09-29',
//   // dateLastEdit: '2017-09-29',
//   // categories: [ '' ],
//   // metadata: { _json_: '{}' },
//   // style: { _json_: '{}' },
//   // options: { _json_: '{}' },
//   // featuredImage___NODE: 'c6h7OmzO7jGWoIUCgiwOm4E___fr-BE',
//   // section___NODE: [ 'c3cb3xxbGnK40oWmoe4aaiq___fr-BE' ],
//   // content___NODE: 'c2E5NRXrTEMGWwSWgSU6cW___fr-BEcontentTextNode',
//   // id: 'c2E5NRXrTEMGWwSWgSU6cW___fr-BE',
//   // parent: 'Collection Item',
//   // children: [ 'c2E5NRXrTEMGWwSWgSU6cW___fr-BEcontentTextNode' ],
//   // internal:
//   //  { type: 'ToileCollectionItem',
//   //    contentDigest: '964862368e4e11e837e8109fa2bc7d46',
//   //    owner: '' },
//   // node_locale: 'fr-BE' }
//
//   createNode(node)
//
//   // SitePage
//   // SitePlugin
//   // Site
//   // ContentfulContentType
//   // ContentfulSettings
//   // ContentfulBlockFreeText
//   // ContentfulPage
//   // ContentfulBlogPost
//   // ContentfulBlockForm
//   // ContentfulSection
//   // ContentfulCustomContentType
//   // ContentfulCollectionItem
//   // ContentfulAsset
//   // contentfulBlockFreeTextMainTextNode
//   // contentfulBlogPostContentTextNode
//   // contentfulCollectionItemContentTextNode
//   // MarkdownRemark
// }

exports.onCreateNode = ({ node, actions }) => {
  const { createNode, createNodeField } = actions;
  // Add menuName field to contentfulPages
  if (node.internal.type.match(/ContentfulCollectionItem/)) {
    const locale = node.node_locale.split("-")[0];
    const path = createPath(`${node.type}/${node.name}`);
    const shortPath = `/${path}/`;
    const localizedPath = `/${locale}/${path}/`;
    const metadata =
      (node.metadata && JSON.parse(node.metadata.internal.content)) || {};
    const menuName = metadata.name || node.name || ``;

    createNodeField({
      node,
      name: `menuName`,
      value: menuName
    });
    createNodeField({
      node,
      name: `shortPath`,
      value: shortPath
    });
    createNodeField({
      node,
      name: `localizedPath`,
      value: localizedPath
    });
    createNodeField({
      node,
      name: `locale`,
      value: locale
    });
  }
};

// CREATE PAGES for collection items
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    const pageTemplate = path.resolve(`src/templates/template-page.js`);
    const listPageTemplate = path.resolve(
      `src/templates/template-list-page.js`
    );
    const itemPageTemplate = path.resolve(
      `src/templates/template-item-page.js`
    );
    resolve(
      graphql(
        `
          {
            locales: allContentfulSettings {
              edges {
                node {
                  node_locale
                  fields {
                    defaultLocale
                    locale
                  }
                }
              }
            }
            collectionItems: allContentfulCollectionItem(
              filter: { name: { ne: "IGNORE" } }
            ) {
              edges {
                node {
                  id
                  type
                  name
                  fields {
                    menuName
                    shortPath
                    localizedPath
                    locale
                  }
                  options {
                    internal {
                      content
                    }
                  }
                  node_locale
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors);
        }

        if (
          typeof result.data === "undefined" ||
          typeof result.data.collectionItems === "undefined" ||
          !result.data.collectionItems
        ) {
          console.log("PROBLEM WITH customContentType QUERY");
          return;
        }
        console.log("customContentType QUERY SUCCESSFUL");

        const defaultLocale =
          result.data.locales.edges[0].node.fields.defaultLocale;
        const locales = result.data.locales.edges.map(({ node }) => {
          return node.fields.locale;
        });

        result.data.collectionItems.edges.forEach(({ node }) => {
          const collectionItem = node;
          const {
            menuName,
            shortPath,
            localizedPath,
            locale
          } = collectionItem.fields;
          const path = locales.length === 1 ? shortPath : localizedPath;
          // const options = JSON.parse(collectionItem.options.internal.content)
          // TODO: 'Master' option to determine styles and options for the whole collection
          const pageContext = { id: collectionItem.id };
          const pageComponent = slash(itemPageTemplate);

          createPage({
            path, // required
            component: pageComponent,
            menuName,
            locale,
            defaultLocale,
            context: pageContext
          });
        });

        return;
      })
    );
  });
};
