const _ = require(`lodash`)
const Promise = require(`bluebird`)
// const path = require(`path`)
// const parseFilepath = require(`parse-filepath`)
const fs = require(`fs-extra`)
// const slash = require(`slash`)
// const slugify = require('slugify')
// const crypto = require(`crypto`)
// const { createPath } = require(`../../utils/utils.js`)
// const {
//   GraphQLObjectType,
//   GraphQLList,
//   GraphQLString,
//   GraphQLInt,
//   GraphQLEnumType
// } = require(`graphql`)

const destFile = 'src/utils/siteSettings.json'

let defaultLocale = ''
// let locales = []

// ADD DEFAULT LOCALE AND LOCALES ARRAY IN EACH SETTINGS NODE
exports.onCreateNode = ({ node, actions }) => {
  const { createNode, createNodeField } = actions

  if (node.internal.type === `ContentfulSettings`) {
    // const locale = node.node_locale.split('-')[0]
    const locale = node.node_locale
    // check if id has the locale in it
    if (node.id.match(node.node_locale)) {
    } else {
      // set defaultLocale as self node_locale
      defaultLocale = locale
    }
    createNodeField({
      node,
      name: `defaultLocale`,
      value: defaultLocale,
    })
    createNodeField({
      node,
      name: `locale`,
      value: locale,
    })
    // locales.push(locale)
  }
}

// GENERATE JSON SETTINGS in a file
exports.createPagesStatefully = ({ graphql }) => {
  // const { createPage, createNodeField } = actions;
  return new Promise((resolve, reject) => {
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
            settings: allContentfulSettings(
              filter: { name: { ne: "IGNORE" } }
            ) {
              nodes {
                id
                name
                menu {
                  fields {
                    menuName
                    shortPath
                    localizedPath
                    locale
                  }
                }
                metaTitle
                metaDescription {
                  metaDescription
                }
                socialImage {
                  fluid {
                    src
                  }
                }
                metadata {
                  internal {
                    content
                  }
                }
                mainColorPalette {
                  name
                  text {
                    name
                    colorReference
                  }
                  background {
                    name
                    colorReference
                  }
                  primary {
                    name
                    colorReference
                  }
                  secondary {
                    name
                    colorReference
                  }
                  accent {
                    name
                    colorReference
                  }
                  muted {
                    name
                    colorReference
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
                node_locale

                # gaTrackingId
                fields {
                  defaultLocale
                  locale
                }
              }
            }
            sitePages: allSitePage(
              filter: { id: { ne: "SitePage /dev-404-page/" } }
            ) {
              nodes {
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
        `,
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }
        if (!result.data) {
          console.log('PROBLEM WITH siteSettings QUERY')
          return
        }
        console.log('siteSettings QUERY SUCCESSFUL')

        const { localesData, settings, sitePages } = result.data

        const { defaultLocale } = localesData.nodes[0].fields
        const locales = localesData.nodes.map(
          ({ fields: { locale } }) => locale,
        )

        // Handle Common Settings Data
        const {
          name,
          favicon: icon,
          metaTitle,
          metaDescription: { metaDescription },
          socialImage,
          metadata: {
            internal: { content: metaD },
          },
          // colors: {
          //   internal: { content: colorsJSON },
          // },
          fonts: {
            internal: { content: fontsJSON },
          },
          contact: {
            internal: { content: contactJSON },
          },
          options: {
            internal: { content: optionsJSON },
          },
          style: {
            internal: { content: styleJSON },
          },
          gaTrackingId,
        } = settings.nodes[0]
        const favicon = `https:${icon.resize.src}`
        const socialImageUrl = `https:${socialImage.fluid.src}`

        // Settings Name
        const settingsName = name
        // Website main metadata
        const metadata = {
          name: settingsName,
          ...JSON.parse(metaD),
          url: process.env.URL,
          ...(metaTitle && { title: metaTitle }),
          ...(metaDescription && { description: metaDescription }),
        }
        // Default colors
        // TODO: change system of colors
        const colors = {
          mainCombo: 'classic',
          menuCombo: 'classic',
          footerCombo: 'contrast',
          sidebarCombo: 'classic',
          palettes: [
            {
              name: `B&W`,
              neutral: `#FFF`,
              primary: `#000`,
              secondary: `#888`,
            },
          ],
        }
        // Default fonts
        const fonts = JSON.parse(fontsJSON)
        fonts.body = fonts.body
          ? fonts.body.concat(['Open Sans'])
          : ['Open Sans']
        fonts.header = fonts.header
          ? fonts.header.concat(['Open Sans'])
          : ['Open Sans']
        // contact infos
        const contact = JSON.parse(contactJSON)
        // Options
        const options = JSON.parse(optionsJSON)
        const { typography } = options
        // Style
        const style = JSON.parse(styleJSON)

        // MENU
        // Array of site pages
        const pages = sitePages.nodes.map(({ fields }) => {
          if (!fields) return null
          const { menuName, fullPath, locale } = fields
          return {
            menuName,
            fullPath,
            locale,
          }
        })
        // Isolate setting according to locale
        const settingsByLocale = {}
        settings.nodes.forEach(node => {
          settingsByLocale[node.fields.locale] = node
        })
        // create menu
        const menu = {}
        locales.forEach(locale => {
          // first line in menu is the locale
          menu[locale] = []
          settingsByLocale[locale].menu.forEach((menuEntry, i) => {
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

        const settingsOutput = {
          defaultLocale,
          locales,
          favicon,
          socialImageUrl,
          metadata,
          gaTrackingId,
          colors,
          fonts,
          contact,
          typography,
          style,
          pages,
          menu,
        }

        // Write Settings to a JSON file
        const outputString = JSON.stringify(settingsOutput)
        fs.writeFile(destFile, outputString, err => {
          if (err) {
            // eslint-disable-next-line no-console
            console.log(err)
          } else {
            // eslint-disable-next-line no-console
            console.log('\n! Site Settings Saved !')
          }
        })
      }),
    )
  })
}
