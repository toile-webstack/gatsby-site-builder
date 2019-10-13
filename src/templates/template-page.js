import React from 'react'
import { graphql } from 'gatsby'
import { For } from 'react-loops'
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { flatten, unflatten } from 'flat'

import renderSchema from '../../libs/render-schema'
import { mapStyle } from '../utils/processCss'
import { metadata as siteMetadata } from '../utils/siteSettings.json'
// import { rhythm, scale } from '../utils/typography'
import colorsLib from '../utils/colors'
import internalJson from '../utils/internalJson'
// import { removeFirst } from '../utils'

import {
  Layout,
  Page,
  Menu,
  Footer,
  Main,
  // HeaderOfMain,
  // Sections,
} from '../canvas'
import { useColors } from '../logic'
import {
  SEO,
  Scripts,
  Header,
  Sections,
  Section,
  Articles,
  Article,
  Collection,
  BlockFreeText,
  BlockForm,
  BlockGallery,
  BlockReferences,
  BlockCta,
} from '../organisms'

// const transformRtAsset = ({ asset, locale }) => {
//   if (!asset) return null

//   const {
//     fields: {
//       file: {
//         [locale]: {
//           contentType: fileType,
//           details: { image: { width, height } = {}, size } = {},
//           fileName,
//           url,
//         } = {},
//       } = {},
//       title: { [locale]: title } = {},
//     } = {},
//     // sys,
//   } = asset

//   return {
//     title,
//     fileType,
//     width,
//     height,
//     size,
//     fileName,
//     url,
//   }
// }

const mapRtFieldsLocalized = ({ fields, locale, recursive = false }) => {
  if (!fields) return null

  return Object.entries(fields).reduce((acc, [key, value]) => {
    const valueLocalized = value && value[locale]
    // const { nodeType } = valueLocalized || {}
    return {
      ...acc,
      [key]:
        // Account for nested rich text fields
        (recursive &&
          valueLocalized.fields &&
          mapRtFieldsLocalized({
            fields: valueLocalized.fields,
            locale,
            recursive,
          })) ||
        // Account for arrays of values
        (recursive &&
          Array.isArray(valueLocalized) &&
          valueLocalized.map(({ fields: itemFields }) =>
            mapRtFieldsLocalized({
              fields: itemFields,
              locale,
              recursive,
            }),
          )) ||
        // If valueLocalized is typeof boolean false, we want to know
        (typeof valueLocalized !== 'undefined' ? valueLocalized : value),
    }
  }, {})
}

// const transformRtLayout = ({ layout, locale }) => {
//   return mapRtFieldsLocalized({ fields: layout?.fields, locale })
// }

const Bold = ({ children }) => <p className="bold">{children}</p>

const Text = ({ children }) => <p className="align-center">{children}</p>

const CustomComponent = ({ name }) => {
  return name ? (
    <div data-name={name} css={{ border: `solid 2px red` }}>
      <h3>CUSTOM: {name}</h3>
    </div>
  ) : null
}

const richTextOptions = ({
  locale,
  parent: { id: parentId } = { type: '', id: '' },
}) => ({
  // renderMark: {
  //   [MARKS.BOLD]: text => <Bold>{text}</Bold>,
  // },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => {
      return children && children.filter(c => c)[0] ? (
        <Text>{children}</Text>
      ) : null
    },
    [INLINES.ENTRY_HYPERLINK]: (node, children) => {
      const { path } = mapRtFieldsLocalized({
        fields: node.data.target.fields,
        locale,
      })
      return <a href={path}>{children}</a>
    },
    [BLOCKS.EMBEDDED_ENTRY]: ({
      // nodeType, // is "embedded-entry-block"
      // content,
      data: { target },
    }) => {
      const {
        sys: {
          contentType: {
            sys: {
              id: contentType,
              // linkType, // is "ContentType"
              // type, // is "Link"
            },
          },
          id: blockId,
          // createdAt,
          // updatedAt,
          // space: {sys: {…}},
          // type, // is "Entry",
        },
        fields: targetFields,
      } = target

      const fields = mapRtFieldsLocalized({
        fields: target?.fields,
        locale,
        recursive: true,
      })
      const {
        name,
        content,
        previewContent, // TODO:
        // Header
        featuredImage,
        layoutHeader,
        main,
        options,
        style,
        // SECTION
        backgroundImage,
        layoutSection,
        semanticSection,
        // COLLECTION
        documents,
        layoutPage,
        layoutPreview,
        // ARTICLE
        semanticArticle,
        layoutArticle,
        // FORM
        form,
        success: successMessage,
        error: errorMessage,
        // GALLERY
        gallery,
        // REFERENCES
        references,
        // CTA
        callToAction,
      } = fields

      if (!fields) return null
      // console.log(contentType)

      // const colors = useColors({ options, colorsLib })
      // const { isColored, classicCombo } = colors
      // const { id, name } = options

      switch (contentType) {
        case 'header':
          return (
            <Header
              {...{
                key: blockId,
                fields: {
                  featuredImage,
                  layout: layoutHeader,
                  main: documentToReactComponents(
                    main,
                    richTextOptions({
                      locale,
                      parent: { type: 'header', id: blockId },
                    }),
                  ),
                  options,
                  style,
                },
                meta: {
                  name,
                  id: blockId,
                },
              }}
            />
          )
        case 'section':
          return (
            <Section
              {...{
                key: blockId,
                meta: { name, id: blockId },
                fields: {
                  backgroundImage,
                  content: documentToReactComponents(
                    content,
                    richTextOptions({
                      locale,
                      parent: { type: 'section', id: blockId },
                    }),
                  ),
                  layoutSection,
                  name,
                  options,
                  semanticSection,
                  style,
                },
              }}
            />
          )
        case 'collection':
          return (
            <Collection
              {...{
                key: blockId,
                meta: { name, id: blockId },
                fields: {
                  documents:
                    documents &&
                    documents
                      .filter(d => d)
                      .map(d => ({
                        ...d,
                        content: documentToReactComponents(
                          d.content,
                          richTextOptions({
                            locale,
                            parent: { type: 'collection', id: blockId },
                          }),
                        ),
                      })),
                  layoutPage,
                  layoutPreview,
                  layoutSection,
                },
              }}
            />
          )
        case 'article':
          // console.log(target.sys, targetFields, fields)
          return (
            <Article
              {...{
                key: blockId,
                meta: { name, id: blockId },
                fields: {
                  backgroundImage,
                  content: documentToReactComponents(
                    content,
                    richTextOptions({
                      locale,
                      parent: { type: 'article', id: blockId },
                    }),
                  ),
                  layoutArticle,
                  name,
                  options,
                  semanticArticle,
                  style,
                },
              }}
            />
          )
        case 'blockFreeText':
          // console.log(parent)
          return (
            <BlockFreeText
              {...{
                key: blockId,
                meta: { name, id: blockId },
                fields: {
                  content: documentToReactComponents(
                    content,
                    richTextOptions({
                      locale,
                      parent: { type: 'blockFreeText', id: blockId },
                    }),
                  ),
                  options,
                  style,
                },
              }}
            />
          )
        case 'blockForm':
          return (
            <BlockForm
              {...{
                key: blockId,
                meta: { name, id: blockId },
                fields: {
                  form,
                  successMessage: documentToReactComponents(
                    successMessage,
                    richTextOptions({
                      locale,
                      parent: { type: 'blockForm', id: blockId },
                    }),
                  ),
                  errorMessage: documentToReactComponents(
                    errorMessage,
                    richTextOptions({
                      locale,
                      parent: { type: 'blockForm', id: blockId },
                    }),
                  ),
                  options,
                  style,
                },
              }}
            />
          )
        case 'blockGallery':
          return (
            <BlockGallery
              {...{
                key: blockId,
                meta: { name, id: blockId },
                fields: {
                  gallery: gallery && gallery.filter(i => i != null),
                  options,
                  style,
                },
              }}
            />
          )
        case 'blockReferences':
          return (
            <BlockReferences
              {...{
                key: blockId,
                meta: { name, id: blockId },
                fields: {
                  references:
                    references &&
                    references
                      .filter(r => r)
                      .map(ref => ({
                        ...ref,
                        content: documentToReactComponents(
                          ref.content,
                          richTextOptions({
                            locale,
                            parent: { type: 'blockReferences', id: blockId },
                          }),
                        ),
                      })),
                  options,
                  style,
                },
              }}
            />
          )
        case 'blockCta':
          return (
            <BlockCta
              {...{
                key: blockId,
                meta: { name, id: blockId },
                fields: {
                  callToAction: documentToReactComponents(
                    callToAction,
                    richTextOptions({
                      locale,
                      parent: { type: 'blockCta', id: blockId },
                    }),
                  ),
                  options,
                  style,
                },
              }}
            />
          )

        default:
          // return null
          return <CustomComponent {...{ name }} />
      }

      // console.log(contentType)
      // console.log(fields)
    },
  },
})

const View = ({ data, layout, map }) => {
  const schema = unflatten(
    Object.entries(data).reduce((acc, [key, val]) => {
      const path = map[key]
      if (!path) return acc
      return {
        ...acc,
        [path]: val,
      }
    }, flatten(layout)),
  )

  return renderSchema({
    schema,
  })
}

const TemplatePage = ({
  data: { contentfulPageInfo: pageInfo = {} } = {},
  location,
  // children,
}) => {
  const {
    node_locale: pageLocale,
    metadata: metadataData,
    options: optionsData,
    style: styleData,
    scripts,
    id: pageInfoId,
  } = pageInfo
  const contentRich = pageInfo?.document && pageInfo.document[0]?.content?.json

  const content = documentToReactComponents(
    contentRich,
    richTextOptions({
      locale: pageLocale,
      parent: { type: 'page', id: pageInfoId },
    }),
  )

  // TODO: Page Metadata. Watch out for duplicates. Use the same canonical url
  const metadata = internalJson(metadataData)
  const options = internalJson(optionsData)
  const style = mapStyle(internalJson(styleData))

  const colors = useColors({ options, colorsLib })
  const { classicCombo } = colors

  // TODO: process page blocks to group blocks that are not in a setion
  // const sections = page.blocks

  // return (
  //   <View
  //     {...{
  //       data: {
  //         title: 'Yeaahhh! A title. :)',
  //         text: 'some awesome text to go inside a pragraph',
  //       },
  //       layout: {
  //         component: 'div',
  //         children: [
  //           {
  //             component: 'h1',
  //             children: '{{title}}',
  //           },
  //           {
  //             component: 'p',
  //             children: 'hello there',
  //           },
  //         ],
  //       },
  //       map: {
  //         title: 'children.0.children',
  //         text: 'children.1.children',
  //       },
  //     }}
  //   />
  // )
  const contentLength = content?.length
  const contentSorted =
    Array.isArray(content) &&
    contentLength &&
    content.reduce(
      (acc, elem, i) => {
        const isLastElem = i === contentLength - 1
        const elemType = elem?.type?.name || elem?.type

        const header = i === 0 && elemType === 'Header' && elem
        const section = elemType === 'Section' && elem
        const nonSectionned = !header && !section && elem

        const currentNonSectionned = [
          ...acc.nonSectionnedAccu,
          ...(nonSectionned ? [nonSectionned] : []),
        ]

        const sectionFromAccu = (isLastElem || section || header) &&
          !!currentNonSectionned.length && (
            <Section
              key={currentNonSectionned[0]?.key}
              fields={{
                content: [
                  <Article
                    key={currentNonSectionned[0]?.key}
                    fields={{ content: currentNonSectionned }}
                  />,
                ],
              }}
            />
          )

        // TODO: account for collections as well

        return {
          ...acc,
          ...(header && { header }),
          sections: [
            ...acc.sections,
            ...(sectionFromAccu ? [sectionFromAccu] : []),
            ...(section ? [section] : []),
          ],
          nonSectionnedAccu: sectionFromAccu ? [] : currentNonSectionned,
        }
      },
      { nonSectionnedAccu: [], header: null, sections: [] },
    )

  // console.log(contentSorted)

  const { header: headerOfMain, sections } = contentSorted
  // const headerOfMain =
  //   content && content[0]?.type?.name === 'Header' ? content[0] : null
  // const sections = headerOfMain ? removeFirst(content) : content

  return (
    <Page>
      <SEO
        {...{
          lang: pageInfo.node_locale,
          name: siteMetadata.name,
          title: metadata.title,
          description: metadata.description,
          canonicalUrl: siteMetadata.url + location.pathname,
          // IDEA: use fullPath in sitePage fields for canonical url
          ogType: metadata.ogType,
        }}
      >
        <Scripts
          {...{
            scripts,
            async: true,
            dynamicOnly: true,
            idPrefix: pageInfo.path,
          }}
        />
      </SEO>
      <Menu />
      <Main>
        {headerOfMain}
        <Sections>
          <For of={sections}>
            {section => {
              return section
            }}
          </For>
        </Sections>
      </Main>
    </Page>
  )

  return (
    <Page>
      <Menu />
      <Sidebar>
        <Main>
          <HeaderOfMain></HeaderOfMain>
          <Sections>
            <For of={sections}>
              {section => (
                <Section>
                  <HeaderSection></HeaderSection>
                </Section>
              )}
            </For>
          </Sections>
        </Main>
        <Aside></Aside>
      </Sidebar>
      <Footer />
    </Page>
  )

  return (
    <Layout>
      <SEO
        {...{
          lang: page.node_locale,
          name: siteMetadata.name,
          title: metadata.title,
          description: metadata.description,
          canonicalUrl: siteMetadata.url + location.pathname,
          // IDEA: use fullPath in sitePage fields for canonical url
          ogType: metadata.ogType,
        }}
      >
        <Scripts
          {...{
            scripts,
            async: true,
            dynamicOnly: true,
            idPrefix: page.path,
          }}
        />
      </SEO>
      <Main
        css={
          {
            // ...colors[classicCombo].style,
            // ...style,
          }
        }
      >
        <For
          of={page.blocks}
          as={block => {
            switch (block.internal.type) {
              case `ContentfulSection`:
                return <Section {...{ block, colors, location }} />
              case `ContentfulBlockFreeText`:
                return <BlockFreeText {...{ block, colors, location }} />
              case `ContentfulBlockForm`:
                return <BlockForm {...{ block, colors, location }} />
              case `ContentfulBlockGallery`:
                return <BlockGallery {...{ block, colors, location }} />
              case `ContentfulBlockReferences`:
                return <BlockReferences {...{ block, colors, location }} />
              default:
                return null
            }
          }}
        />
      </Main>
    </Layout>
  )
}

// class PageTemplate extends React.Component {
//   constructor(props) {
//     super(props)
//     if (!props.data) return

//     const { metadata, options, style } = props.data.contentfulPage
//     // _json_ fields
//     // this.metadata = JSON.parse(props.data.contentfulPage.metadata._json_)
//     this.metadata = internalJson(metadata)

//     this.optionsData = internalJson(options)
//     this.styleData = mapStyle(internalJson(style))
//     // Colors
//     let { colorPalettes, colorCombo } = this.optionsData
//     colorCombo = colorCombo
//       ? colorsLib[`${colorCombo}Combo`]
//       : colorsLib.classicCombo
//     colorPalettes = colorPalettes || colorsLib.colorPalettes
//     const newColors = colorsLib.computeColors(colorPalettes, colorCombo)
//     this.colors = { ...colorsLib, ...newColors }
//   }

//   render() {
//     // console.log("PAGE TEMPLATE PROPS", this.props)
//     const {
//       classicCombo,
//       contrastCombo,
//       funkyCombo,
//       funkyContrastCombo,
//     } = this.colors
//     // console.log(this.colors[classicCombo].style)
//     const page = this.props.data.contentfulPage
//     const metadata = this.metadata
//     // TODO: Page Metadata. Watch out for duplicates. Use the same canonical url
//     const { scripts } = page

//     return (
//       <DefaultLayout location={this.props.location}>
//         <div
//           className="page"
//           css={{
//             ...this.colors[classicCombo].style,
//             ...this.styleData,
//           }}
//         >
//           <SEO
//             {...{
//               lang: page.node_locale,
//               name: siteMetadata.name,
//               title: metadata.title,
//               description: metadata.description,
//               canonicalUrl: siteMetadata.url + this.props.location.pathname,
//               // IDEA: use fullPath in sitePage fields for canonical url
//               ogType: metadata.ogType,
//             }}
//           >
//             <Scripts
//               {...{
//                 scripts,
//                 async: true,
//                 dynamicOnly: true,
//                 idPrefix: page.path,
//               }}
//             />
//           </SEO>

//           {page.blocks &&
//             page.blocks.map((block, i) => {
//               if (Object.keys(block).length < 1) {
//                 return null
//               }

//               switch (block.internal.type) {
//                 case `ContentfulSection`:
//                   return (
//                     <Section
//                       key={i}
//                       block={block}
//                       // customContentTypeList={this.props.data.customContentType}
//                       colors={this.colors}
//                       location={this.props.location}
//                     />
//                   )
//                   break
//                 case `ContentfulBlockFreeText`:
//                   return (
//                     <BlockFreeText
//                       key={block.id || i}
//                       block={block}
//                       colors={this.colors}
//                       location={this.props.location}
//                     />
//                   )
//                   break
//                 case `ContentfulBlockForm`:
//                   return (
//                     <BlockForm
//                       key={block.id || i}
//                       block={block}
//                       colors={this.colors}
//                       location={this.props.location}
//                     />
//                   )
//                   break
//                 case `ContentfulBlockGallery`:
//                   return (
//                     <BlockGallery
//                       key={block.id || i}
//                       block={block}
//                       colors={this.colors}
//                       location={this.props.location}
//                     />
//                   )
//                   break
//                 case `ContentfulBlockReferences`:
//                   return (
//                     <BlockReferences
//                       key={block.id || i}
//                       block={block}
//                       colors={this.colors}
//                       location={this.props.location}
//                     />
//                   )
//                   break
//                 default:
//               }
//             })}
//         </div>
//       </DefaultLayout>
//     )
//   }
// }

export default TemplatePage

export const pageQuery = graphql`
  query PageTemplate($id: String!) {
    contentfulPageInfo(id: { eq: $id }) {
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
      scripts {
        id
        name
        src
        type
        charset
        content {
          id
          content
        }
      }

      document {
        id
        name
        collection {
          id
          name
          layoutPage {
            id
          }
        }
        structuredInfo {
          id
        }
        content {
          json
        }
        previewContent {
          previewContent
        }
        options {
          id
          internal {
            content
          }
        }
      }
    }
  }
`

// export const pageQuery = graphql`
//   query PageTemplate($id: String!) {
//     contentfulPage(id: { eq: $id }) {
//       id
//       node_locale
//       path
//       metadata {
//         internal {
//           content
//         }
//         # name
//         # title
//         # description
//       }
//       # blocks {
//       #   ...BlockFreeText
//       #   ...BlockForm
//       #   ...BlockGallery
//       #   ...BlockReferences
//       #   ...Section
//       # }
//       options {
//         internal {
//           content
//         }
//       }
//       style {
//         internal {
//           content
//         }
//       }
//       scripts {
//         id
//         name
//         type
//         src
//         charset
//         content {
//           id
//           content
//         }
//       }
//     }
//   }
// `
