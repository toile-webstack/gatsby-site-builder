const _ = require(`lodash`);
const Promise = require(`bluebird`);
const path = require(`path`);
const parseFilepath = require(`parse-filepath`);
const fs = require(`fs-extra`);
const slash = require(`slash`);
const slugify = require("slugify");
const { createPath } = require(`../../utils/utils.js`);

function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/\s+/g, "");
}
// TODO: si / dans nom, menuName is the last part
exports.onCreateNode = ({ node, actions }) => {
  const { createNode, createNodeField } = actions;
  // Add menuName field to contentfulPages
  if (node.internal.type.match(/ContentfulPage/)) {
    const locale = node.node_locale.split("-")[0];
    // console.log(node)
    const path = createPath(node.path);
    const shortPath = node.path === `index` ? `/` : `/${path}/`;
    const localizedPath =
      node.path === `index` ? `/${locale}/` : `/${locale}/${path}/`;
    const metadata =
      (node.metadata && JSON.parse(node.metadata.internal.content)) || {};
    // to account for pages created with subpaths
    const childLevel = node.path.split(`/`).length - 1;
    const menuName = metadata.name || node.path.split("/")[childLevel] || ``;

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

  // Add fields to sitePages
  if (node.internal.type.match(/SitePage/)) {
    const { menuName, locale, defaultLocale, path } = node;

    createNodeField({
      node,
      name: `menuName`,
      value: menuName || ""
    });
    createNodeField({
      node,
      name: `locale`,
      value: locale || ""
    });
    createNodeField({
      node,
      name: `defaultLocale`,
      value: defaultLocale || ""
    });
    createNodeField({
      node,
      name: `fullPath`,
      value: path
    });
  }
};

// CREATE NORMAL PAGES
exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;
  return new Promise((resolve, reject) => {
    const pageTemplate = path.resolve(`src/templates/template-page.js`);
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
            contentfulPages: allContentfulPage(
              filter: { path: { ne: "IGNORE" } }
            ) {
              edges {
                node {
                  id
                  path
                  node_locale
                  metadata {
                    internal {
                      content
                    }
                  }
                  fields {
                    menuName
                    shortPath
                    localizedPath
                    locale
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors);
        }
        if (!result.data || !result.data.contentfulPages) {
          console.log("PROBLEM WITH pages QUERY");
          return;
        }
        console.log("pages QUERY SUCCESSFUL");

        const defaultLocale =
          result.data.locales.edges[0].node.fields.defaultLocale;
        const locales = result.data.locales.edges.map(({ node }) => {
          return node.fields.locale;
        });

        result.data.contentfulPages.edges.forEach(({ node }) => {
          const contentfulPage = node;
          const {
            menuName,
            shortPath,
            localizedPath,
            locale
          } = contentfulPage.fields;
          const path = locales.length === 1 ? shortPath : localizedPath;

          const pageContext = { id: contentfulPage.id };
          const pageComponent = slash(pageTemplate);

          createPage({
            path, // required
            component: pageComponent,
            menuName,
            locale,
            defaultLocale,
            context: pageContext
          });

          // Redirect index page
          if (
            locales.length !== 1 &&
            locale === defaultLocale &&
            contentfulPage.path === `index`
          ) {
            createRedirect({
              fromPath: "/",
              toPath: `/${defaultLocale}/`,
              isPermanent: true,
              redirectInBrowser: true
            });
            // createPage({
            //   path: `/`, // required
            //   component: slash(pageTemplate),
            //   menuName,
            //   locale,
            //   defaultLocale,
            //   context: {
            //     id: edge.node.id
            //   }
            // })
            //   }
          }
        });

        return;
      })
    );
  });
};
