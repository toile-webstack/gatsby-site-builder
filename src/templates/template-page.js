import React from 'react'
import { graphql } from 'gatsby'
import { For } from 'react-loops'

import { metadata as siteMetadata } from '../utils/siteSettings.json'

import { Section, FreeText, Form, Gallery, References } from '../blocks'

import { SEO, Scripts } from '../atoms'
import { mapStyle } from '../utils/processCss'
import { colors as colorsLib, useColors, internalJson } from '../utils'

import Layout from '../layouts/Layout'

const TemplatePage = ({
  data: { contentfulPage: page = {} } = {},
  location,
  // children,
  path,
}) => {
  if (!page) return null

  console.log(page)

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

  const isSSR = typeof window === 'undefined'
  const isLandingPage =
    options.isLandingPage || /\/landing\//.test(location.pathname)

  return (
    <Layout {...{ location }}>
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
          of={page.blocks}
          as={block => {
            switch (block.__typename) {
              case `ContentfulSection`:
                return <Section {...{ block, colors, location }} />
              case `ContentfulBlockFreeText`:
                return <FreeText {...{ block, colors, location }} />
              case `ContentfulBlockForm`:
                return <Form {...{ block, colors, location }} />
              case `ContentfulBlockGallery`:
                return <Gallery {...{ block, colors, location }} />
              case `ContentfulBlockReferences`:
                return <References {...{ block, colors, location }} />
              default:
                return null
            }
          }}
        />
      </div>
    </Layout>
  )
}

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
        # colorPalettes
        # colorCombo
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
