import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import { For } from 'react-loops'
// import 'moment/locale/fr'

import { rhythm } from '../utils/typography'
// import {
//   addLayoutOptions,
//   gridLayout,
//   listItemStyle,
// } from '../utils/computeGrid'

import { Section, FreeText, Form, Gallery, References } from '../blocks'

import Html from '../atoms/Html'

import { metadata as siteMetadata } from '../utils/siteSettings.json'

import { SEO, Scripts } from '../atoms'
import { mapStyle } from '../utils/processCss'
import { colors as colorsLib, useColors, internalJson } from '../utils'

// import Layout from '../layouts/Layout'
import EventDates from '../molecules/EventDates'

const ItemPageTemplate = ({
  data: { collectionItem = {} } = {},
  location,
  // children,
  path,
}) => {
  if (!collectionItem.name) return null

  const {
    metadata: metadataData,
    options: optionsData,
    style: styleData,
    scripts,
    node_locale: pageLocale,
    categories: categoriesRaw,
    featuredImage,
    name,
    datePublished: datePublishedRaw,
    dateLastEdit: dateLastEditRaw,
    author,
    gallery,
    content,
  } = collectionItem

  // TODO: Page Metadata. Watch out for duplicates. Use the same canonical url
  const metadata = internalJson(metadataData)
  const options = internalJson(optionsData)
  const style = mapStyle(internalJson(styleData))

  const colors = useColors({ options, colorsLib })
  const { classicCombo, contrastCombo, funkyCombo, funkyContrastCombo } = colors

  const categories = (categoriesRaw || []).map(raw => {
    if (!/:/.test(raw)) {
      return {
        label: raw,
        raw,
        family: 'main',
        familyIndex: null,
      }
    }
    const [famIndexed, label] = raw.split(':')
    const [family, familyIndex] = famIndexed.split('|')
    return { label, raw, family, familyIndex }
  })

  // const isSSR = typeof window === 'undefined'
  // const isLandingPage = options.isLandingPage || /\/landing\//.test(path)

  const {
    lang,
    hideFeaturedImage,
    hideTitle,
    hideDate,
    showTime,
    hideAuthor,
    hideGallery,
    hideCategories,
    hideContent,
    blocksOnly,
  } = options
  const showFeaturedImage = !blocksOnly && !hideFeaturedImage && featuredImage
  const showTitle = !blocksOnly && !hideTitle
  const showDate = !blocksOnly && !hideDate
  const showAuthor = !blocksOnly && !hideAuthor && author
  const showGallery = !blocksOnly && !hideGallery && gallery
  const showCategories = !hideCategories
  const showContent = !blocksOnly && !hideContent && content

  let datePublished = datePublishedRaw
  let dateLastEdit = dateLastEditRaw
  switch (showTime) {
    // If showTime is true, leave datePublishedRaw as is
    case true:
      break
    // If showTime is false, remove time even if it is not midnight
    case false:
      // NOTE: && allows to assign the raw value if it is nullish (null or undefined) and only replace if value is not nullish
      datePublished = datePublishedRaw && datePublishedRaw.replace(/T.+$/, '')
      dateLastEdit = dateLastEditRaw && dateLastEditRaw.replace(/T.+$/, '')
      break
    // If showTime is undefined, remove time if it is midnight
    case undefined:
    default:
      datePublished =
        datePublishedRaw && datePublishedRaw.replace(/T00:00.+$/, '')
      dateLastEdit = dateLastEditRaw && dateLastEditRaw.replace(/T00:00.+$/, '')
      // datePublished = datePublishedRaw (/T00:00/.test(datePublishedRaw) ? new Date(new Date().toDateString()))
      break
  }

  const galleryOptions = options.gallery || {}
  galleryOptions.layout = galleryOptions.layout || {}
  galleryOptions.layout.columns = galleryOptions.layout.columns ||
    galleryOptions.columns || ['1/3']

  const blockGallery = {
    gallery,
    options: galleryOptions,
    style: {},
  }

  return (
    // <Layout {...{ location }}>
    <>
      <SEO
        {...{
          lang: lang || pageLocale,
          name: siteMetadata.name,
          title: name,
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
            idPrefix: path,
          }}
        />
      </SEO>
      <div
        className="page page-collectionItem"
        css={{
          // textAlign: `left`
          // " h1, h2, h3, h4, h5, h6": {
          //   color: `inherit`,
          //   marginBottom: 0
          // }
          '> div:not(.section)': {
            width: `100%`,
            maxWidth: `1000px`,
            margin: `auto`,
            padding: rhythm(1),
            flexGrow: 1,
          },
          ...colors[classicCombo].style,
          ...style,
        }}
      >
        {(showFeaturedImage || showTitle || showDate || showCategories) && (
          <div
            css={{
              display: `flex`,
              flexFlow: `column`,
              alignItems: `flex-start`,
              ' .gatsby-image-wrapper': {
                width: `100%`,
              },
            }}
          >
            {showFeaturedImage && (
              <Img
                css={{
                  // width: `1000px`,
                  // maxWidth: `400px`,
                  maxHeight: `300px`,
                }}
                title={featuredImage.title}
                sizes={featuredImage.fluid}
              />
            )}
            {showTitle && (
              <h1
                css={{
                  marginBottom: 0,
                }}
              >
                {name}
              </h1>
            )}
            {(showDate || showAuthor) && (
              <div
                css={{
                  // ...colors[funkyCombo].style,
                  // ...scale(-0.2),
                  // // lineHeight: rhythm(1 / 2),
                  // fontWeight: "normal",
                  '& > * + *': {
                    marginLeft: '0.5em',
                  },
                }}
              >
                {showAuthor && <span>{author}</span>}
                {showDate && showAuthor && <span>-</span>}
                {showDate && (
                  <span
                    {...{
                      css: {
                        '& time': {},
                        '& .eventdates-time, & .eventdates-chevron': {
                          color: colors[funkyCombo].body,
                        },
                      },
                    }}
                  >
                    <EventDates
                      {...{
                        locale: pageLocale,
                        start: datePublished,
                        end: dateLastEdit,
                      }}
                    />
                  </span>
                )}
              </div>
            )}
            {(showFeaturedImage || showTitle || showDate || showCategories) && (
              <hr
                css={{
                  width: `100%`,
                  height: 2,
                  background: colors[funkyCombo].border,
                  // margin: `${rhythm(2)}`
                }}
              />
            )}
            {showCategories && (
              <div
                css={{
                  display: `flex`,
                  flexFlow: `row wrap`,
                }}
              >
                {categories.map(({ label: cat, raw }) => {
                  return (
                    <div
                      key={raw}
                      css={{
                        margin: `${rhythm(1 / 4)} ${rhythm(1 / 8)}`,
                        padding: `${rhythm(1 / 8)} ${rhythm(1 / 4)}`,
                        ...colors[funkyContrastCombo].style,
                      }}
                    >
                      {cat}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
        {showContent && (
          <Html
            html={collectionItem?.content?.childMarkdownRemark?.html}
            className="collectionItem--content"
          />
        )}
        {collectionItem?.blocks && (
          <For
            of={collectionItem?.blocks}
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
        )}
        {showGallery && (
          <Gallery
            block={blockGallery}
            colors={colors}
            location={location}
            // passCSS={}
          />
        )}
      </div>
    </>
  )
}

export default ItemPageTemplate

export const itemPageQuery = graphql`
  query ItemPageTemplate($id: String!) {
    collectionItem: contentfulCollectionItem(id: { eq: $id }) {
      id
      type
      name
      featuredImage {
        id
        title
        description
        fluid(maxWidth: 1000, maxHeight: 1000, quality: 80) {
          base64
          aspectRatio
          src
          srcSet
          sizes
        }
      }
      datePublished
      dateLastEdit
      author
      data {
        internal {
          content
        }
      }
      categories
      content {
        id
        childMarkdownRemark {
          id
          html
        }
      }
      blocks {
        ...BlockFreeText
        ...BlockForm
        ...BlockGallery
        ...BlockReferences
        ...Section
      }
      gallery {
        id
        title
        description
        fluid(maxWidth: 1000, maxHeight: 1000, quality: 80) {
          base64
          aspectRatio
          src
          srcSet
          sizes
        }
      }
      metadata {
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
      node_locale
      fields {
        menuName
        shortPath
        localizedPath
        locale
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
