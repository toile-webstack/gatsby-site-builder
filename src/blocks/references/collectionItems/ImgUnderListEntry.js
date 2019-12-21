import React from 'react'
import Img from 'gatsby-image'

import { rhythm, scale } from '../../../utils/typography'
// import colors from "../utils/colors"
import { addLayoutOptions } from '../../../utils/computeGrid'

// import Html from '../../../atoms/Html'
import LinkOrNotCollectionItem from '../../../atoms/LinkOrNotCollectionItem'
import EventDates from '../../../molecules/EventDates'

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
  const {
    datePublished,
    dateLastEdit,
    fields: { locale: collectionItemLocale },
  } = collectionItem

  // image, name and time in the 1st column
  const layoutList = [{}]
  const childrenColumns = (layout &&
    layout.children &&
    layout.children.columns) || ['1']
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
  const { imageStyle, itemStyle } = childrenList[0][0]

  const altColor = { color: colors[funkyCombo].body }

  const inner = (
    <div
      css={{
        padding: `0 ${rhythm(1 / 2)}`,
      }}
    >
      <h4
        css={{
          ...scale(0.4),
          lineHeight: 1.2,
          // color: `inherit`,
        }}
      >
        {collectionItem.name}
      </h4>
      <EventDates
        {...{
          start: datePublished,
          end: dateLastEdit,
          locale: collectionItemLocale,
          altColor,
        }}
      />
      <hr
        css={{
          flexShrink: 0,
          width: `100%`,
          // marginBottom: rhythm(1 / 2),
          height: 6,
          backgroundColor: colors[funkyCombo].body,
        }}
      />
      <Img
        title={image.title}
        className="image"
        sizes={image.fluid}
        key="image"
        css={{
          height: `100px`,
        }}
      />
    </div>
  )

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
