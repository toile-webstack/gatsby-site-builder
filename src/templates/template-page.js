import React from 'react'
import { graphql } from 'gatsby'
import { For } from 'react-loops'

import { mapStyle } from '../utils/processCss'
import { metadata as siteMetadata } from '../utils/siteSettings.json'
// import { rhythm, scale } from '../utils/typography'
import colorsLib from '../utils/colors'
import internalJson from '../utils/internalJson'

// import DefaultLayout from '../layouts'
import BlockFreeText from '../blocks/FreeText'
import BlockForm from '../blocks/Form'
import BlockGallery from '../blocks/Gallery'
import BlockReferences from '../blocks/References'
import Section from '../blocks/Section'

import { SEO, Scripts, Main } from '../canvas'
import Layout from '../canvas/Layout'
import { useColors } from '../logic'

const TemplatePage = ({
  data: { contentfulPage: page = {} } = {},
  location,
  // children,
  path,
}) => {
  if (!page) return null

  const {
    metadata: metadataData,
    options: optionsData,
    style: styleData,
    scripts,
    node_locale: pageLocale,
  } = page
  // TODO: Page Metadata. Watch out for duplicates. Use the same canonical url
  const metadata = internalJson(metadataData)
  const options = internalJson(optionsData)
  const style = mapStyle(internalJson(styleData))

  const colors = useColors({ options, colorsLib })
  const { classicCombo } = colors

  return (
    <Layout
      {...{
        currentLocale: pageLocale,
        path,
        location,
      }}
    >
      <SEO
        {...{
          lang: pageLocale,
          name: siteMetadata.name,
          title: metadata.title,
          description: metadata.description,
          canonicalUrl: siteMetadata.url + path,
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
        css={{
          ...colors[classicCombo].style,
          ...style,
        }}
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
    contentfulPage(id: { eq: $id }) {
      id
      node_locale
      path
      metadata {
        internal {
          content
        }
        # name
        # title
        # description
      }
      blocks {
        ...BlockFreeText
        ...BlockForm
        ...BlockGallery
        ...BlockReferences
        ...Section
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
        type
        src
        charset
        content {
          id
          content
        }
      }
    }
  }
`
