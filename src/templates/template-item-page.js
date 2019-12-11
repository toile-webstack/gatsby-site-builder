import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import Moment from 'react-moment'

import { rhythm } from '../utils/typography'
// import {
//   addLayoutOptions,
//   gridLayout,
//   listItemStyle,
// } from '../utils/computeGrid'

import Html from '../atoms/Html'

import { metadata as siteMetadata } from '../utils/siteSettings.json'

import { Gallery } from '../blocks'

import { SEO, Scripts } from '../atoms'
import { mapStyle } from '../utils/processCss'
import { colors as colorsLib, useColors, internalJson } from '../utils'

import Layout from '../layouts/Layout'

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
  } = collectionItem
  // TODO: Page Metadata. Watch out for duplicates. Use the same canonical url
  const metadata = internalJson(metadataData)
  const options = internalJson(optionsData)
  const style = mapStyle(internalJson(styleData))

  const colors = useColors({ options, colorsLib })
  const { classicCombo, contrastCombo, funkyCombo, funkyContrastCombo } = colors

  const isSSR = typeof window === 'undefined'
  // const isLandingPage = options.isLandingPage || /\/landing\//.test(path)

  const { lang, hideFeaturedImage, hideTitle, hideDate, hideGallery } = options

  const galleryOptions = options.gallery || {}
  galleryOptions.layout = galleryOptions.layout || {}
  galleryOptions.layout.columns = galleryOptions.layout.columns ||
    galleryOptions.columns || ['1/3']

  const blockGallery = {
    gallery: collectionItem.gallery,
    options: galleryOptions,
    style: {},
  }

  return (
    <Layout {...{ location, isSSR }}>
      <SEO
        {...{
          lang: lang || pageLocale,
          name: siteMetadata.name,
          title: collectionItem.name,
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
          '> div': {
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
          {collectionItem.featuredImage && !hideFeaturedImage && (
            <Img
              css={{
                // width: `1000px`,
                // maxWidth: `400px`,
                maxHeight: `300px`,
              }}
              title={collectionItem.featuredImage.title}
              sizes={collectionItem.featuredImage.fluid}
            />
          )}
          <h1
            css={{
              marginBottom: 0,
            }}
          >
            {collectionItem.name}
          </h1>
          {collectionItem.datePublished && (
            <Moment
              locale={collectionItem.fields.locale}
              format="Do MMM YYYY"
              css={
                {
                  // ...scale(-0.2),
                  // lineHeight: rhythm(1 / 2),
                  // marginBottom: rhythm(1 / 2),
                  // padding: rhythm(1 / 2),
                }
              }
            >
              {collectionItem.datePublished}
            </Moment>
          )}
          <hr
            css={{
              width: `100%`,
              height: 2,
              background: colors[funkyCombo].border,
              // margin: `${rhythm(2)}`
            }}
          />
          <div
            css={{
              display: `flex`,
              flexFlow: `row wrap`,
            }}
          >
            {collectionItem.categories &&
              collectionItem.categories[0] &&
              collectionItem.categories.map((cat, i) => {
                return (
                  <div
                    key={i}
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
        </div>
        <Html
          html={collectionItem?.content?.childMarkdownRemark?.html}
          className="collectionItem--content"
        />
        {collectionItem.gallery && !hideGallery && (
          <Gallery
            block={blockGallery}
            colors={colors}
            location={location}
            // passCSS={}
          />
        )}
      </div>
    </Layout>
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
      categories
      content {
        id
        childMarkdownRemark {
          id
          html
        }
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
