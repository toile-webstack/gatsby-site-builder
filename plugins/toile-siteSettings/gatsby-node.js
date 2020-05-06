// const _ = require(`lodash`)
const Promise = require(`bluebird`)
// const path = require(`path`)
// const parseFilepath = require(`parse-filepath`)
const fs = require(`fs-extra`)
// const slash = require(`slash`)
// const slugify = require('slugify')
// const crypto = require(`crypto`)
// const { createPath } = require(`../../utils/utils.js`)
const internalJson = require(`../../src/utils/internalJson.js`)
// const {
//   GraphQLObjectType,
//   GraphQLList,
//   GraphQLString,
//   GraphQLInt,
//   GraphQLEnumType
// } = require(`graphql`)

const destFile = 'src/utils/siteSettings.json'

let globalDefaultLocale = ''
let globalLocales = []

// ADD DEFAULT LOCALE AND LOCALES ARRAY IN EACH SETTINGS NODE
exports.onCreateNode = ({ node, actions }) => {
  const { createNode, createNodeField } = actions

  if (node.internal.type === `ContentfulSettings`) {
    const locale = node.node_locale.split('-')[0]
    // check if id has the locale in it
    if (node.id.match(node.node_locale)) {
    } else {
      // set defaultLocale as self node_locale
      globalDefaultLocale = locale
    }
    createNodeField({
      node,
      name: `defaultLocale`,
      value: globalDefaultLocale,
    })
    createNodeField({
      node,
      name: `locale`,
      value: locale,
    })
    globalLocales.push(locale)
  }
}

// GENERATE JSON SETTINGS in a file
exports.createPagesStatefully = ({ graphql, actions }) => {
  const { createPage, createNodeField } = actions
  return new Promise((resolve, reject) => {
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
            settings: allContentfulSettings(
              filter: { name: { ne: "IGNORE" } }
            ) {
              edges {
                node {
                  id
                  name
                  menu {
                    ...Page
                  }
                  metadata {
                    internal {
                      content
                    }
                  }
                  colors {
                    internal {
                      content
                    }
                  }
                  fonts {
                    internal {
                      content
                    }
                  }
                  contact {
                    internal {
                      content
                    }
                  }
                  options {
                    internal {
                      content
                    }
                  }
                  style {
                    internal {
                      content
                    }
                  }
                  favicon {
                    id
                    resize(
                      width: 32
                      height: 32
                      quality: 100
                      toFormat: PNG
                      resizingBehavior: PAD
                      jpegProgressive: false
                      cropFocus: LEFT
                    ) {
                      src
                    }
                  }
                  facebookImage {
                    id
                    fluid {
                      src
                    }
                  }
                  # gaTrackingId
                  node_locale
                  fields {
                    defaultLocale
                    locale
                  }
                }
              }
            }
            sitePages: allSitePage(
              filter: { id: { ne: "SitePage /dev-404-page/" } }
            ) {
              edges {
                node {
                  id
                  fields {
                    menuName
                    locale
                    defaultLocale
                    fullPath
                  }
                }
              }
            }
          }

          fragment Page on ContentfulPage {
            id
            fields {
              menuName
              shortPath
              localizedPath
              locale
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }
        if (!result.data) {
          console.log('PROBLEM WITH siteSettings QUERY')
          return
        }
        console.log('siteSettings QUERY SUCCESSFUL')

        const defaultLocale =
          result.data.locales.edges[0].node.fields.defaultLocale
        const locales = result.data.locales.edges.map(({ node }) => {
          return node.fields.locale
        })

        // Handle Common Settings Data
        let {
          name,
          metadata,
          colors,
          fonts,
          contact,
          options,
          style,
          // gaTrackingId
        } = result.data.settings.edges[0].node
        const favicon = `https:${result.data.settings.edges[0].node.favicon.resize.src}`
        const socialImageUrl = `https:${result.data.settings.edges[0].node.facebookImage.fluid.src}`

        // Settings Name
        let settingsName = name
        // Website main metadata
        metadata = internalJson(metadata)
        metadata.url = process.env.URL
        metadata.name = metadata.name || settingsName
        metadata.title = metadata.title || metadata.name
        metadata.description = metadata.description || ''
        // Default colors
        colors = internalJson(colors)
        colors.mainCombo = colors.mainCombo || 'classic'
        colors.menuCombo = colors.menuCombo || 'classic'
        colors.footerCombo = colors.footerCombo || 'contrast'
        colors.sidebarCombo = colors.sidebarCombo || 'classic'
        colors.palettes = colors.palettes || [
          {
            name: `B&W`,
            neutral: `#FFF`,
            primary: `#000`,
            secondary: `#888`,
          },
        ]
        // Default fonts
        fonts = JSON.parse(fonts.internal.content)
        fonts.body = fonts.body
          ? fonts.body.concat(['Open Sans'])
          : ['Open Sans']
        fonts.header = fonts.header
          ? fonts.header.concat(['Open Sans'])
          : ['Open Sans']
        // contact infos
        contact = JSON.parse(contact.internal.content)
        // Options
        options = JSON.parse(options.internal.content)
        const { typography } = options
        // Style
        style = internalJson(style)

        // MENU
        // Array of site pages
        const pages = result.data.sitePages.edges.map(({ node }) => {
          if (!node.fields) return
          const { menuName, fullPath, locale } = node.fields
          return {
            menuName,
            fullPath,
            locale,
          }
        })
        // Isolate setting according to locale
        let settingsByLocale = {}
        result.data.settings.edges.forEach(({ node }) => {
          settingsByLocale[node.fields.locale] = node
        })
        // create menu
        let menu = {}
        locales.forEach(locale => {
          // first line in menu is the locale
          menu[locale] = []
          const localeMenu = settingsByLocale[locale].menu || []
          localeMenu.forEach((menuEntry, i) => {
            const {
              menuName,
              shortPath,
              localizedPath,
              locale,
            } = menuEntry.fields
            if (menuName === 'IGNORE') return
            const path = locales.length > 1 ? localizedPath : shortPath

            // If this is a child of the previous entry, put it as child
            const childLevel = shortPath.split('/').length - 3
            const menuLength = menu[locale].length
            if (childLevel > 0 && menuLength > 0) {
              const previousEntryPath = menu[locale][menuLength - 1].path
              // check that entry is indeed the child of its parent
              if (path.match(previousEntryPath)) {
                menu[locale][menuLength - 1].children.push({
                  name: menuName,
                  path,
                })
                return
              }
            }
            // // Find the good page from all pages according to menuName and locale
            // const sitePage = _.find(pages, { menuName: name, locale: locale })
            menu[locale].push({
              name: menuName,
              path,
              homepage: shortPath === '/',
              children: [],
            })
          })
        })
        // TODO: if / in path, check if this is not a child menu

        const settings = {
          defaultLocale,
          locales,
          favicon,
          socialImageUrl,
          metadata,
          // gaTrackingId,
          colors,
          fonts,
          contact,
          typography,
          style,
          pages,
          menu,
        }

        // Write Settings to a JSON file
        let outputString = JSON.stringify(settings)
        fs.writeFile(destFile, outputString, function(err) {
          if (err) {
            return console.log(err)
          } else {
            console.log('\n! Site Settings Saved !')
          }
        })

        return
      })
    )
  })
}
