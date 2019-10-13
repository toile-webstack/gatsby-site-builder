const _ = require(`lodash`)
const Promise = require(`bluebird`)
const path = require(`path`)
// const parseFilepath = require(`parse-filepath`)
// const fs = require(`fs-extra`)
const slash = require(`slash`)
// const slugify = require("slugify")
const { canonize } = require(`../../utils/utils.js`)

// function camelize(str) {
//   return str
//     .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
//       return index == 0 ? letter.toLowerCase() : letter.toUpperCase()
//     })
//     .replace(/\s+/g, "")
// }

// TODO: if / in name, menuName is the last part
exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions
  // Add menuName field to contentfulPages
  if (node.internal.type.match(/ContentfulPageInfo/)) {
    // const locale = node.node_locale.split('-')[0]
    const locale = node.node_locale
    // console.log(node)
    const nodePath = canonize(node.path)
    const shortPath = /^index$|^\/$/.test(node.path) ? `/` : `/${nodePath}/`
    const localizedPath =
      node.path === /^index$|^\/$/.test(node.path)
        ? `/${locale}/`
        : `/${locale}/${nodePath}/`
    const metadata =
      (node.metadata && JSON.parse(node.metadata.internal.content)) || {}
    // to account for pages created with subpaths
    const childLevel = node.path.split(`/`).length - 1
    const menuName = metadata.name || node.path.split('/')[childLevel] || ``

    createNodeField({
      node,
      name: `menuName`,
      value: menuName,
    })
    createNodeField({
      node,
      name: `shortPath`,
      value: shortPath,
    })
    createNodeField({
      node,
      name: `localizedPath`,
      value: localizedPath,
    })
    createNodeField({
      node,
      name: `locale`,
      value: locale,
    })
  }

  // Add fields to sitePages
  if (node.internal.type.match(/SitePage/)) {
    const { menuName, locale, defaultLocale, path: sitePagePath } = node

    createNodeField({
      node,
      name: `menuName`,
      value: menuName || '',
    })
    createNodeField({
      node,
      name: `locale`,
      value: locale || '',
    })
    createNodeField({
      node,
      name: `defaultLocale`,
      value: defaultLocale || '',
    })
    createNodeField({
      node,
      name: `fullPath`,
      value: sitePagePath,
    })
  }
}

// CREATE NORMAL PAGES
exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions
  return new Promise((resolve, reject) => {
    const pageTemplate = path.resolve(`src/templates/template-page.js`)
    resolve(
      graphql(
        `
          {
            localesData: allContentfulSettings {
              nodes {
                node_locale
                fields {
                  defaultLocale
                  locale
                }
              }
            }
            contentfulPages: allContentfulPageInfo(
              filter: { path: { ne: "IGNORE" } }
            ) {
              nodes {
                id
                path
                node_locale
                menuName
                metaTitle
                metaDescription {
                  id
                  metaDescription
                }
                socialImage {
                  id
                }
                metadata {
                  id
                  internal {
                    content
                  }
                }

                fields {
                  shortPath
                  localizedPath
                  locale
                }
              }
            }
          }
        `,
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }
        if (!result.data || !result.data.contentfulPages) {
          console.log('PROBLEM WITH pages QUERY')
          return
        }
        console.log('pages QUERY SUCCESSFUL')

        const { localesData, contentfulPages } = result.data

        const { defaultLocale } = localesData.nodes[0].fields
        const locales = localesData.nodes.map(
          ({ fields: { locale } }) => locale,
        )

        contentfulPages.nodes.forEach(
          ({
            menuName,
            path: pagePath,
            fields: { shortPath, localizedPath, locale },
            id,
          }) => {
            const chosenPath = locales.length === 1 ? shortPath : localizedPath

            const pageContext = { id }
            const pageComponent = slash(pageTemplate)

            createPage({
              path: chosenPath, // required
              component: pageComponent,
              menuName,
              locale,
              defaultLocale,
              context: pageContext,
            })

            // Redirect index page
            if (
              locales.length !== 1 &&
              locale === defaultLocale &&
              // path === `index`
              /index|^\/$/.test(pagePath)
            ) {
              createRedirect({
                fromPath: '/',
                toPath: `/${defaultLocale}/`,
                isPermanent: true,
                redirectInBrowser: true,
              })
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
          },
        )

        // return
      }),
    )
  })
}
