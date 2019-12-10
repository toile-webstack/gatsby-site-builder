import React from 'react'
import Img from 'gatsby-image'
import Moment from 'react-moment'

import { rhythm, scale } from '../../../utils/typography'
// import colors from "../utils/colors"
import { addLayoutOptions } from '../../../utils/computeGrid'

import Html from '../../../atoms/Html'
import LinkOrNotCollectionItem from '../../../atoms/LinkOrNotCollectionItem'

export default ({
  collectionItem,
  colors,
  styleData,
  layout,
  blockOptionsData,
  optionsData,
  passCSS,
}) => {
  const { funkyCombo } = colors
  const image = collectionItem.featuredImage
  const { excerpt, html } = collectionItem.content.childMarkdownRemark
  // TODO: delete and replace by linkTo
  const linkToPage = blockOptionsData.linkToPage !== false

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
  const parentMaxWidth = (passCSS && passCSS.maxWidth) || 1000
  const { layout: childLayout, list: childrenList } = addLayoutOptions(
    layoutOptionsData,
    parentMaxWidth,
    layoutList
  )
  const { imageStyle } = childrenList[0][0]
  const { itemStyle } = childrenList[1][0]

  const inner = [
    <div
      key="leftCol"
      css={{
        ...imageStyle,
      }}
    >
      <Img title={image.title} className="image" sizes={image.fluid} />
    </div>,
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
    </div>,
  ]

  return (
    <LinkOrNotCollectionItem
      blockOptionsData={blockOptionsData}
      optionsData={optionsData}
      collectionItem={collectionItem}
      colors={colors}
    >
      {inner}
    </LinkOrNotCollectionItem>
  )
}
