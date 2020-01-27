import React from 'react'
import { For } from 'react-loops'

import { metadata as siteMetadata } from '../utils/siteSettings.json'

import { Block, Section, FreeText, Form, Gallery, References } from '../blocks'

// import { mapStyle } from '../utils/processCss'
// import { colors as colorsLib, useColors, internalJson } from '../utils'
// import { layoutStyles } from '../../libs/nuds-layout-primitives'
import { LPage } from '../t-layouts'
import Head from './Head'

import View from '../../libs/nuds-view-component'

// import Layout from '../layouts/Layout'

const usePage = ({ data, locale, locales, path, ...rest }) => {
  const { metadata, options, style, scripts } = data
  // TODO: Page Metadata. Watch out for duplicates. Use the same canonical url

  // const colors = useColors({ options, colorsLib })
  // const { classicCombo } = colors

  // const isSSR = typeof window === 'undefined'
  const isLandingPage = options?.isLandingPage || /\/landing\//.test(path)

  return {
    ...data,
    scripts,
    locale,
    metadata,
    options,
    style,
    // colors,
    // classicCombo,
    isLandingPage,
    pathData: data.path,
    path,
    ...rest,
  }
}

const Markup = ({
  locale,
  metadata,
  path,
  scripts,
  pathData,
  // colors,
  // classicCombo,
  blocks,
  style,
  location,
}) => (
  <>
    <Head
      {...{
        lang: locale,
        name: siteMetadata.name,
        title: metadata.title,
        description: metadata.description,
        canonicalUrl: siteMetadata.url + path,
        // IDEA: use fullPath in sitePage fields for canonical url
        ogType: metadata.ogType,
        //
        scripts,
        async: true,
        dynamicOnly: true,
        scriptsPrefix: pathData,
      }}
    />
    <LPage
      data-component="page"
      className="page"
      css={
        {
          // ...colors[classicCombo].style,
          // ...layoutStyles.stack({}),
          // ...style,
        }
      }
    >
      <div {...{ className: 'sections' }}>
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
            switch (block.contentType) {
              case `section`:
                return <Section {...{ block, location, locale }} />
              case `blockFreeText`:
                return <FreeText {...{ block, location }} />
              case `blockForm`:
                return <Form {...{ block, location }} />
              case `blockGallery`:
                return <Gallery {...{ block }} />
              case `blockReferences`:
                return <References {...{ block, location, locale }} />
              default:
                return null
            }
          }}
        />
      </div>
    </LPage>
  </>
)

const Page = ({ data, locale, locales, location, path }) => (
  <View
    {...{
      data: { data, locale, locales, location, path },
      useData: usePage,
      Markup,
    }}
  />
)

export default Page
