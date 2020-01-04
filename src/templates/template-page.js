import React from 'react'
// import { graphql } from 'gatsby'
import { For } from 'react-loops'

import { metadata as siteMetadata } from '../utils/siteSettings.json'

import { Section, FreeText, Form, Gallery, References } from '../blocks'

import { SEO, Scripts } from '../atoms'
import { mapStyle } from '../utils/processCss'
import { colors as colorsLib, useColors, internalJson } from '../utils'

// import Layout from '../layouts/Layout'

const getBlockType = b => b?.sys?.contentType?.sys?.id

const TemplatePage = ({
  // data: { contentfulPage: page } = {},
  pageContext: { page: pageData } = {},
  location,
  // children,
  path,
}) => {
  // if (!page.path) return null
  const page = JSON.parse(pageData)
  const { sys, fields } = page
  const { locale: pageLocale } = sys
  const {
    metadata = {},
    options = {},
    style = {},
    scripts,
    blocks,
    // node_locale: pageLocale,
  } = fields
  // TODO: Page Metadata. Watch out for duplicates. Use the same canonical url
  // const metadata = internalJson(metadataData)
  // const options = internalJson(optionsData)
  // const style = mapStyle(internalJson(styleData))

  const colors = useColors({ options, colorsLib })
  const { classicCombo } = colors

  // const isSSR = typeof window === 'undefined'
  const isLandingPage = options.isLandingPage || /\/landing\//.test(path)

  console.log(blocks)

  return (
    // <Layout {...{ location, isLandingPage }}>
    <>
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
      <div
        data-component="page"
        css={{
          ...colors[classicCombo].style,
          ...style,
        }}
      >
        <For
          of={blocks}
          as={block => {
            const blockType = getBlockType(block)
            switch (blockType) {
              case `section`:
                return <Section {...{ block, colors, location }} />
              case `blockFreeText`:
                return <FreeText {...{ block, colors, location }} />
              case `blockForm`:
                return <Form {...{ block, colors, location }} />
              case `blockGallery`:
                return <Gallery {...{ block, colors, location }} />
              case `blockReferences`:
                return <References {...{ block, colors, location }} />
              default:
                return null
            }
          }}
        />
      </div>
    </>
  )
}

export default TemplatePage

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
//       blocks {
//         ...BlockFreeText
//         ...BlockForm
//         ...BlockGallery
//         ...BlockReferences
//         ...Section
//       }
//       options {
//         internal {
//           content
//         }
//         # colorPalettes
//         # colorCombo
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
