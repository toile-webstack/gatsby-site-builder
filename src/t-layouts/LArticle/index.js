import React from 'react'
import Img from 'gatsby-image'
import Moment from 'react-moment'

import { rhythm, scale } from '../../utils/typography'
import { LinkWrapper } from '../../atoms/Link'

import { addLayoutOptions } from '../../utils/computeGrid'
import Html from '../../atoms/Html'

export const LArticleLink = ({
  // colors,
  // passCSS,
  to,
  lang,
  className,
  children,
}) => {
  // const { classicCombo, funkyCombo } = colors

  const css = {
    display: `flex`,
    flexFlow: `row wrap`,
    justifyContent: `center`,
    textAlign: `left`,
    ' h2, h3, h4, h5, h6': {
      // color: `inherit`,
      // textAlign: `left`,
      margin: 0,
    },
    ' .gatsby-image-wrapper': {
      width: `100%`,
    },
    ' img': {
      objectFit: `cover`,
    },
    padding: `${rhythm(1)} 0`,

    // ...colors[classicCombo].style,
    // ':hover': {
    //   ...colors[!to ? classicCombo : funkyCombo].style,
    //   color: `${colors[!to ? classicCombo : funkyCombo].body}!important`,
    // },
    // ...passCSS,
  }

  return (
    <LinkWrapper
      {...{
        ...(lang && { lang }),
        to,
        className,
        css,
      }}
    >
      {children}
    </LinkWrapper>
  )
}

export const LArticleClassicRow = ({
  colors,
  article: collectionItem,
  layout,
  parentMaxWidth = 1000,
}) => {
  const { funkyCombo } = colors
  const image = collectionItem.featuredImage
  // const { excerpt, html } = collectionItem.content.childMarkdownRemark

  // Image on the 1st column
  // title date and excerpt in the 2nd column
  const layoutList = [{}, {}]
  const childrenColumns = (layout &&
    layout.children &&
    layout.children.columns) || ['1/3', '2/3']
  const layoutOptionsData = {
    columns: childrenColumns,
    shape: layout.shape,
    align: layout.align,
  }
  const { layout: childLayout, list: childrenList } = addLayoutOptions(
    layoutOptionsData,
    parentMaxWidth,
    layoutList
  )
  const { imageStyle } = childrenList[0][0]
  const { itemStyle } = childrenList[1][0]

  return (
    <>
      <div
        key="leftCol"
        css={{
          ...imageStyle,
        }}
      >
        <Img title={image.title} className="image" sizes={image.fluid} />
      </div>
      <div
        key="rightCol"
        css={{
          ...itemStyle,
          display: `flex`,
          flexFlow: `column`,
          // maxHeight: imageStyle[` .image`].height,
          padding: `0 ${rhythm(1 / 2)}`,
          overflow: `hidden`,
        }}
      >
        <h4
          css={{
            ...scale(0.4),
            // color: `inherit`,
          }}
        >
          {collectionItem.name}
        </h4>
        {collectionItem.datePublished && (
          <Moment
            locale={collectionItem.fields.locale}
            format="Do MMM YYYY"
            css={{
              ...scale(-0.2),
              lineHeight: rhythm(1 / 2),
              marginBottom: rhythm(1 / 2),
              // padding: rhythm(1 / 2),
            }}
          >
            {collectionItem.datePublished}
          </Moment>

          // <small
          //   css={{
          //     lineHeight: rhythm(1 / 3),
          //     marginBottom: rhythm(1 / 2),
          //   }}
          // >
          //   {collectionItem.momentPublished}
          // </small>
        )}
        {/* <p>{excerpt}</p> */}
        <hr
          css={{
            flexShrink: 0,
            width: `100%`,
            marginBottom: rhythm(1 / 2),
            height: 1,
            backgroundColor: colors[funkyCombo].body,
          }}
        />
        <Html
          html={excerpt}
          css={{
            // height: `61.8%`,
            overflow: `hidden`,
          }}
        />
      </div>
    </>
  )
}

export const LArticleDefault = () => null

export const LArticleEvent = () => null

export const LArticleTestimonial = () => null

const LArticle = ({
  article: collectionItem,
  blockOptions,
  options,
  style,
  to,
  className,
  lang,
  colors,
  layout,
  passCSS,
}) => {
  return (
    <LArticleLink {...{ colors, passCSS, to, lang, className }}>
      {/* <LArticleClassicRow
        {...{
          colors,
          article: collectionItem,
          layout,
          parentMaxWidth: passCSS && passCSS.maxWidth,
        }}
      /> */}
    </LArticleLink>
  )
}

export default LArticle
