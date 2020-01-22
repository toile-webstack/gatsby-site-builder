import React from 'react'
import { For } from 'react-loops'

import { metadata as siteMetadata } from '../utils/siteSettings.json'

import { Block, Section, FreeText, Form, Gallery, References } from '../blocks'

import { SEO, Scripts } from '../atoms'
import { mapStyle } from '../utils/processCss'
import { colors as colorsLib, useColors, internalJson } from '../utils'

import View from '../../libs/nuds-view-component'

// import Layout from '../layouts/Layout'

const usePage = ({ data, path, ...rest }) => {
  const {
    metadata: metadataData,
    options: optionsData,
    style: styleData,
    scripts,
    node_locale: pageLocale,
  } = data
  // TODO: Page Metadata. Watch out for duplicates. Use the same canonical url
  const metadata = internalJson(metadataData)
  const options = internalJson(optionsData)
  const style = mapStyle(internalJson(styleData))

  const colors = useColors({ options, colorsLib })
  const { classicCombo } = colors

  // const isSSR = typeof window === 'undefined'
  const isLandingPage = options.isLandingPage || /\/landing\//.test(path)

  return {
    ...data,
    scripts,
    pageLocale,
    metadata,
    options,
    style,
    colors,
    classicCombo,
    isLandingPage,
    pathData: data.path,
    path,
    ...rest,
  }
}

const Markup = ({
  pageLocale,
  metadata,
  path,
  scripts,
  pathData,
  colors,
  classicCombo,
  blocks,
  style,
  location,
}) => (
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
          idPrefix: pathData,
        }}
      />
    </SEO>
    <div
      data-component="page"
      css={
        {
          // ...colors[classicCombo].style,
          // ...style,
        }
      }
    >
      <For
        of={blocks}
        as={block => {
          // switch (block.__typename) {
          //   case `ContentfulSection`:
          //   // return <Section {...{ block }} />
          //   case `ContentfulBlockFreeText`:
          //   case `ContentfulBlockForm`:
          //   case `ContentfulBlockGallery`:
          //   case `ContentfulBlockReferences`:
          //     return <Block {...{ block }} />
          //   default:
          //     return null
          // }
          switch (block.__typename) {
            case `ContentfulSection`:
              return <Section {...{ block, colors, location }} />
            case `ContentfulBlockFreeText`:
              return <FreeText {...{ block, colors, location }} />
            case `ContentfulBlockForm`:
              return <Form {...{ block, colors, location }} />
            case `ContentfulBlockGallery`:
              return <Gallery {...{ block }} />
            case `ContentfulBlockReferences`:
              return <References {...{ block, colors, location }} />
            default:
              return null
          }
        }}
      />
    </div>
  </>
)

const Page = ({ data, location, path }) => (
  <View
    {...{
      data: { data, location, path },
      useData: usePage,
      Markup,
    }}
  />
)

export default Page
