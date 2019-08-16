// const _ = require(`lodash`)
// const Promise = require(`bluebird`)
// const path = require(`path`)
// const parseFilepath = require(`parse-filepath`)
// const fs = require(`fs-extra`)
// const slash = require(`slash`)
// const slugify = require("slugify")
// const {
//   GraphQLObjectType,
//   GraphQLList,
//   GraphQLString,
//   GraphQLInt,
//   GraphQLEnumType
// } = require(`graphql`)
//
// const destFile = "src/utils/siteSettings.json"
//
// function camelize(str) {
//   return str
//     .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
//       return index == 0 ? letter.toLowerCase() : letter.toUpperCase()
//     })
//     .replace(/\s+/g, "")
// }
//
// const createPath = path => {
//   const splitted = path.split("/")
//   const slugged = splitted.map(split => slugify(split.toLowerCase()))
//   return slugged.join("/")
// }
//
// // Create empty node if a content type has no instance in contentful
// // exports.onCreateNode = ({ node, boundActionCreators }) => {
// //   const { createNode, createNodeField } = boundActionCreators
// //   if (node.internal.type === `ContentfulContentType`) {
// //     console.log(node)
// //     let newNodeType
// //     if (node.id === `Block - Form`) {
// //       newNodeType = `ContentfulBlockForm`
// //     }
// //     createNode({
// //       // Data for the node.
// //       // field1: `a string`,
// //       // field2: 10,
// //       // field3: true,
// //       // ...arbitraryOtherData,
// //       [node.displayField]: `mock ref`,
// //
// //       // Required fields.
// //       id: `mock-${node.name}-id`,
// //       parent: node.name, // or null if it's a source node without a parent
// //       children: [],
// //       internal: {
// //         type: newNodeType,
// //         contentDigest: `0`
// //         // contentDigest: crypto
// //         //   .createHash(`md5`)
// //         //   .update(JSON.stringify(fieldData))
// //         //   .digest(`hex`),
// //         // mediaType: `text/markdown`, // optional
// //         // content: JSON.stringify(fieldData), // optional
// //       }
// //     })
// //   } else if (node.internal.type === `ContentfulBlockForm`) {
// //     console.log(node)
// //   }
// // }
//
// // Add SLUG to PAGES
// // const { createFilePath } = require(`gatsby-source-filesystem`)
// //
// // exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
// //   const { createNodeField } = boundActionCreators
// //   if (node.internal.type === `ContentfulPage`) {
// //     console.log(node.id, "\n", node.internal.type)
// //
// //     const slug = createFilePath({ node, getNode, basePath: `pages` })
// //     console.log("SLUG: ", slug)
// //     // createNodeField({
// //     //   node,
// //     //   name: `slug`,
// //     //   value: slug,
// //     // })
// //   }
// // }
//
// // exports.setFieldsOnGraphQLNodeType = ({ type }) => {
// //   if (type.name !== `ContentfulPage`) {
// //     return {}
// //   }
// //   console.log(type)
// //
// //   return {
// //     otherId: {
// //       type: GraphQLString,
// //       resolve(node) {
// //         console.log(node)
// //         return `other` + node.id
// //       }
// //     }
// //   }
// //
// //   // if (type.name !== `TypeToModify`) {
// //   //   return {}
// //   // }
// //   //
// //   // return {
// //   //   greeter: {
// //   //     type: GraphQLString,
// //   //     args: {
// //   //       name: {
// //   //         type: GraphQLString,
// //   //         defaultValue: "Bob",
// //   //       },
// //   //     },
// //   //     resolve(node, { name }) {
// //   //       return `Hi ${name}!`
// //   //     },
// //   //   },
// //   // }
// // }
//
// // GENERATE JSON SETTINGS & CREATE PAGES
// exports.createPages = ({ graphql, boundActionCreators }) => {
//   const { createPage } = boundActionCreators
//   return new Promise((resolve, reject) => {
//     const pageTemplate = path.resolve(`src/templates/template-page.js`)
//     const blogPageTemplate = path.resolve(`src/templates/template-list-page.js`)
//     const blogPostTemplate = path.resolve(`src/templates/template-item-page.js`)
//     resolve(
//       graphql(
//         `
//         {
//           settings: allContentfulSettings {
//             edges {
//               node {
//                 id
//                 name
//                 node_locale
//                 menu {
//                   id
//                   path
//                   metadata {
//                     _json_
//                   }
//                 }
//                 metadata {
//                   _json_
//                 }
//                 colors {
//                   _json_
//                 }
//                 fonts {
//                   _json_
//                 }
//                 contact {
//                   _json_
//                 }
//                 favicon {
//                   id
//                   resize (
//                     width: 32
//                     height: 32
//                     quality: 100
//                     toFormat: PNG
//                     resizingBehavior: PAD
//                     jpegProgressive: false
//                     cropFocus: LEFT
//                   ) {
//                     src
//                   }
//                 }
//                 facebookImage {
//                   id
//                   responsiveSizes {
//                     src
//                   }
//                 }
//                 gaTrackingId
//               }
//             }
//           }
//
//           defaultIndex: contentfulPage(path: { regex: "/index/i" }, id: { regex: "/^[^_]*$/i" }) {
//             id
//             path
//             node_locale
//           }
//
//           contentfulPages: allContentfulPage (
//             filter: {path: {ne: "IGNORE"}}
//           ) {
//             edges {
//               node {
//                 id
//                 path
//                 node_locale
//                 metadata {
//                   _json_
//                 }
//               }
//             }
//           }
//
//           contentfulBlogPosts: allContentfulBlogPost (
//             filter: {name: {ne: "IGNORE"}}
//           ) {
//             edges {
//               node {
//                 id
//                 name
//                 node_locale
//               }
//             }
//           }
//
//         }
//         `
//       ).then(result => {
//         if (result.errors) {
//           reject(result.errors)
//         }
//
//         const defaultLocale = result.data.defaultIndex.node_locale
//
//         // Create array of locales. Returns e.g. ['en-BE', 'fr-BE']
//         let locales = [defaultLocale]
//         result.data.contentfulPages.edges.forEach(({ node }) => {
//           if (_.indexOf(locales, node.node_locale) < 0) {
//             locales.push(node.node_locale)
//           }
//         })
//
//         // Handle Common Settings Data
//         let {
//           settingsName,
//           metadata,
//           colors,
//           fonts,
//           contact,
//           gaTrackingId
//         } = result.data.settings.edges[0].node
//         const favicon = `https:${result.data.settings.edges[0].node.favicon
//           .resize.src}`
//         const socialImageUrl = `https:${result.data.settings.edges[0].node
//           .facebookImage.responsiveSizes.src}`
//
//         // Website main metadata
//         metadata = JSON.parse(metadata._json_)
//         metadata.url = process.env.URL
//         metadata.name = metadata.name || settingsName
//         metadata.title = metadata.title || metadata.name
//         metadata.description = metadata.description || ""
//         // Default colors
//         colors = JSON.parse(colors._json_)
//         colors.mainCombo = colors.mainCombo || "classic"
//         colors.menuCombo = colors.menuCombo || "classic"
//         colors.footerCombo = colors.footerCombo || "contrast"
//         colors.palettes = colors.palettes || [
//           {
//             name: `B&W`,
//             neutral: `#FFF`,
//             primary: `#000`,
//             secondary: `#888`
//           }
//         ]
//         // Default fonts
//         fonts = JSON.parse(fonts._json_)
//         fonts.body = fonts.body
//           ? fonts.body.concat(["Open Sans"])
//           : ["Open Sans"]
//         fonts.header = fonts.header
//           ? fonts.header.concat(["Open Sans"])
//           : ["Open Sans"]
//         // contact infos
//         contact = JSON.parse(contact._json_)
//
//         const settings = {
//           defaultLocale,
//           locales,
//           favicon,
//           socialImageUrl,
//           metadata,
//           colors,
//           fonts,
//           contact,
//           menu: {}
//         }
//
//         // Localized data
//         if (locales.length === 1) {
//           // Create pages without locales
//           result.data.contentfulPages.edges.forEach(edge => {
//             const path = createPath(edge.node.path)
//             if (path !== "index") {
//               createPage({
//                 path: `/${path}/`, // required
//                 component: slash(pageTemplate),
//                 context: {
//                   id: edge.node.id
//                 }
//               })
//             } else if (path === `index`) {
//               createPage({
//                 path: `/`, // required
//                 component: slash(pageTemplate),
//                 context: {
//                   id: edge.node.id
//                 }
//               })
//             }
//           })
//
//           // Create menu without locales in path
//           settings.menu[defaultLocale] =
//             result.data.settings.edges[0].node.menu.map(pageInfo => {
//               const path = createPath(pageInfo.path)
//               const pageMetadata = JSON.parse(pageInfo.metadata._json_)
//               let backupName = pageInfo.path.split("/")
//               backupName = backupName[backupName.length - 1]
//               const name = pageMetadata.name || backupName
//               if (path === "index") {
//                 return {
//                   path: `/`,
//                   name
//                 }
//               } else {
//                 return {
//                   path: `/${path}/`,
//                   name
//                 }
//               }
//             }) || []
//
//           // Check if we query the blogposts
//           if (
//             typeof result.data.contentfulBlogPosts !== "undefined" &&
//             result.data.contentfulBlogPosts
//           ) {
//             // Create Blog Page without locales
//             createPage({
//               path: `/blog/`, // required
//               component: slash(blogPageTemplate),
//               context: {
//                 locale: defaultLocale,
//                 locales
//               }
//             })
//             // Create Blog Posts Pages without locales
//             result.data.contentfulBlogPosts.edges.forEach(({ node }) => {
//               const path = createPath(node.name)
//               createPage({
//                 path: `/blog/${path}/`, // required
//                 component: slash(blogPostTemplate),
//                 context: {
//                   id: node.id
//                 }
//               })
//             })
//             // If at least one blog post. Add Blog page to menu
//             if (result.data.contentfulBlogPosts.edges) {
//               settings.menu[defaultLocale].push({
//                 path: `/blog/`,
//                 name: `Blog`
//               })
//             }
//           }
//
//           // TODO: add index page if not present ??
//         } else {
//           // Create pages with localized paths
//           result.data.contentfulPages.edges.forEach(edge => {
//             const locale = edge.node.node_locale
//             const path = createPath(edge.node.path)
//             const metadata = JSON.parse(edge.node.metadata._json_)
//             const menuName = metadata.name || path
//             if (path !== "index") {
//               createPage({
//                 path: `/${locale}/${path}/`, // required
//                 component: slash(pageTemplate),
//                 menuName,
//                 context: {
//                   id: edge.node.id
//                 }
//               })
//             } else if (path === `index`) {
//               createPage({
//                 path: `/${locale}/`, // required
//                 component: slash(pageTemplate),
//                 menuName,
//                 context: {
//                   id: edge.node.id
//                 }
//               })
//             }
//             // Create index page
//             if (locale === defaultLocale && path === `index`) {
//               createPage({
//                 path: `/`, // required
//                 component: slash(pageTemplate),
//                 context: {
//                   id: edge.node.id
//                 }
//               })
//             }
//           })
//           // Create menu with locales in paths
//           result.data.settings.edges.forEach(({ node }) => {
//             const locale = node.node_locale
//             settings.menu[locale] =
//               node.menu.map(pageInfo => {
//                 const path = createPath(pageInfo.path)
//                 const pageMetadata = JSON.parse(pageInfo.metadata._json_)
//                 let backupName = pageInfo.path.split("/")
//                 backupName = backupName[backupName.length - 1]
//                 const name = pageMetadata.name || backupName
//                 if (path === "index") {
//                   return {
//                     path: `/${locale}/`,
//                     name
//                   }
//                 } else {
//                   return {
//                     path: `/${locale}/${path}/`,
//                     name
//                   }
//                 }
//               }) || []
//             // Check if we query the blogposts
//             if (
//               typeof result.data.contentfulBlogPosts !== "undefined" &&
//               result.data.contentfulBlogPosts
//             ) {
//               // Create Blog Page with locales
//               locales.forEach(locale => {
//                 createPage({
//                   path: `/${locale}/blog/`, // required
//                   component: slash(blogPageTemplate),
//                   context: {
//                     locale,
//                     locales
//                   }
//                 })
//               })
//               // Create blog post pages with localized paths
//               result.data.contentfulBlogPosts.edges.forEach(({ node }) => {
//                 const locale = node.node_locale
//                 const path = createPath(node.name)
//                 createPage({
//                   path: `/${locale}/blog/${path}/`, // required
//                   component: slash(blogPostTemplate),
//                   context: {
//                     id: node.id
//                   }
//                 })
//               })
//               // If at least one blog post. Add Blog page to menu
//               if (result.data.contentfulBlogPosts.edges) {
//                 settings.menu[locale].push({
//                   path: `/${locale}/blog/`,
//                   name: `Blog`
//                 })
//               }
//             }
//           })
//         }
//
//         // settings.menu is now like {
//         //   en-BE: [
//         //     {name: 'Homepage', path: '/en-BE/index/'},
//         //     {name: 'Contact', path: '/en-BE/contact/'}
//         //   ],
//         //   fr-BE: [
//         //     {name: 'Accueil', path: '/fr-BE/index/'},
//         //     {name: 'Contacte-moi', path: '/fr-BE/contact/'}
//         //   ]
//         // }
//
//         // Write Settings to a JSON file
//         let outputString = JSON.stringify(settings)
//         fs.writeFile(destFile, outputString, function(err) {
//           if (err) {
//             return console.log(err)
//           } else {
//             console.log("! Site Settings Saved !")
//           }
//         })
//
//         return
//       })
//     )
//   })
// }
//
// // TODO: create index page from contentful if only one locale ?
// // Implement the Gatsby API “onCreatePage”. This is
// // called after every page is created.
// // exports.onCreatePage = ({ page, boundActionCreators }) => {
// //   const { createPage, deletePage } = boundActionCreators
// //
// //   return new Promise((resolve, reject) => {
// //     // Remove trailing slash
// //     const oldPath = page.path
// //     // Removing '/' would result in a path that's
// //     // an empty string which is invalid
// //     page.path = (page.path === `/`) ? page.path : page.path.replace(/\/$/, ``)
// //     if (page.path !== oldPath) {
// //
// //       // Remove the old page
// //       deletePage({ path: oldPath })
// //
// //       // Add the new page
// //       createPage(page)
// //     }
// //
// //     resolve()
// //   })
// // }
//
// // IDEA: copy assets locally ??
// // exports.onPostBuild = () => {
// //   fs.copySync(
// //     `../docs/blog/2017-02-21-1-0-progress-update-where-came-from-where-going/gatsbygram.mp4`,
// //     `./public/gatsbygram.mp4`
// //   )
// // }
