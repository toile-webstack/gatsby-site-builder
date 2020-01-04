const _ = require(`lodash`)
const Promise = require(`bluebird`)
const pathLib = require(`path`)
const parseFilepath = require(`parse-filepath`)
const fs = require(`fs-extra`)
const slash = require(`slash`)
const slugify = require('slugify')
const { createPath } = require(`../../utils/utils.js`)

require('dotenv').config()
const contentful = require('contentful')
const util = require('util')

function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase()
    })
    .replace(/\s+/g, '')
}
// TODO: si / dans nom, menuName is the last part
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNode, createNodeField } = actions
  // Add menuName field to contentfulPages
  if (node.internal.type.match(/ContentfulPage/)) {
    const locale = node.node_locale.split('-')[0]
    // console.log(node)
    const path = createPath(node.path)
    const shortPath = node.path === `index` ? `/` : `/${path}/`
    const localizedPath =
      node.path === `index` ? `/${locale}/` : `/${locale}/${path}/`
    const metadata = node.metadata___NODE && getNode(node.metadata___NODE)
    // const metadata =
    //   (node.metadata && JSON.parse(node.metadata.internal.content)) || {}
    // to account for pages created with subpaths
    const childLevel = node.path.split(`/`).length - 1
    const menuName =
      (metadata && metadata.name) || node.path.split('/')[childLevel] || ``

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
    const { menuName, locale, defaultLocale, path } = node

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
      value: path,
    })
  }
}

const getCircularReplacer = () => {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }
      seen.add(value)
    }
    return value
  }
}

/**
 * Gets all the existing entities based on pagination parameters.
 * The first call will have no aggregated response. Subsequent calls will
 * concatenate the new responses to the original one.
 */
const pagedGet = (
  client,
  method,
  query = {},
  skip = 0,
  pageLimit = 1000,
  aggregatedResponse = null
) => {
  return client[method]({
    ...query,
    skip,
    limit: pageLimit,
    order: `sys.createdAt`,
  }).then(response => {
    if (!aggregatedResponse) {
      aggregatedResponse = response
    } else {
      aggregatedResponse.items = aggregatedResponse.items.concat(response.items)
    }
    if (skip + pageLimit <= response.total) {
      return pagedGet(
        client,
        method,
        query,
        skip + pageLimit,
        pageLimit,
        aggregatedResponse
      )
    }
    return aggregatedResponse
  })
}

const fetchContentfulPages = async () => {
  const {
    contentfulSpaceID: spaceId,
    contentfulAccessToken: accessToken,
  } = process.env

  const contentfulClientOptions = {
    space: spaceId,
    accessToken,
    // host: pluginConfig.get(`host`),
    // environment: pluginConfig.get(`environment`),
    // proxy: pluginConfig.get(`proxy`),
  }

  const client = contentful.createClient(contentfulClientOptions)

  const space = await client.getSpace()
  const locales = await client.getLocales().then(response => response.items)
  const defaultLocale = locales.reduce((acc, curr) => {
    return (curr.default && curr.code) || acc
  }, '')
  const contentTypes = await pagedGet(client, `getContentTypes`)
  const contentTypeItems = contentTypes.items
  //   const contentTypeItems = contentTypes.items.map(c => normalize.fixIds(c))
  const entries = await pagedGet(client, `getEntries`)
  const entriesItems = entries.items
  const entriesItemsSys = entries.items.map(e => e.sys)
  const entriesItemsFields = entries.items.map(e => e.fields)
  const pages = entries.items.filter(e => e.sys.contentType.sys.id === 'page')
  // .map(e => {
  //   return e
  // })
  // const pageBlocks = pages[0].blocks
  // const pageBlocksSys = pages[0].blocks.map(b => b.sys)
  // const pageBlocksFields = pages[0].blocks.map(b => b.fields)
  // const assets = await client.getAssets()

  // console.log({ space, locales, defaultLocale, contentTypes, contentTypeItems })
  // console.log({ pageBlocksSys, pageBlocksFields })

  return pages
}

// CREATE NORMAL PAGES
exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions
  return new Promise((resolve, reject) => {
    const pageTemplate = pathLib.resolve(`src/templates/template-page.js`)
    resolve(
      // graphql(
      //   `
      //     {
      //       locales: allContentfulSettings {
      //         edges {
      //           node {
      //             node_locale
      //             fields {
      //               defaultLocale
      //               locale
      //             }
      //           }
      //         }
      //       }
      //       contentfulPages: allContentfulPage(
      //         filter: { path: { ne: "IGNORE" } }
      //       ) {
      //         edges {
      //           node {
      //             id
      //             path
      //             node_locale
      //             metadata {
      //               internal {
      //                 content
      //               }
      //             }
      //             fields {
      //               menuName
      //               shortPath
      //               localizedPath
      //               locale
      //             }
      //           }
      //         }
      //       }
      //     }
      //   `
      // )
      fetchContentfulPages().then(pages => {
        pages.forEach(page => {
          const { fields } = page
          const path = createPath(fields.path)
          // const shortPath = node.path === `index` ? `/` : `/${path}/`
          // const localizedPath =
          //   node.path === `index` ? `/${locale}/` : `/${locale}/${path}/`

          const pageData = JSON.stringify(page, getCircularReplacer())
          const context = { page: pageData }
          const pageComponent = slash(pageTemplate)

          createPage({
            path, // required
            component: pageComponent,
            // menuName,
            // locale,
            // defaultLocale,
            context,
          })
        })

        return null

        // -------------END------------------

        if (result.errors) {
          reject(result.errors)
        }
        if (!result.data || !result.data.contentfulPages) {
          console.log('PROBLEM WITH pages QUERY')
          return
        }
        console.log('pages QUERY SUCCESSFUL')

        const defaultLocale =
          result.data.locales.edges[0].node.fields.defaultLocale
        const locales = result.data.locales.edges.map(({ node }) => {
          return node.fields.locale
        })

        result.data.contentfulPages.edges.forEach(({ node }) => {
          const contentfulPage = node
          const {
            menuName,
            shortPath,
            localizedPath,
            locale,
          } = contentfulPage.fields
          const path = locales.length === 1 ? shortPath : localizedPath

          const pageContext = { id: contentfulPage.id }
          const pageComponent = slash(pageTemplate)

          createPage({
            path, // required
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
            contentfulPage.path === `index`
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
        })

        return
      })
    )
  })
}
