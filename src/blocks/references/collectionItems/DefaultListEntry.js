import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import Moment from 'react-moment'

import { rhythm, scale } from '../../../utils/typography'
// import colors from "../utils/colors"
import {
  addLayoutOptions,
  gridLayout,
  listItemStyle,
} from '../../../utils/computeGrid'

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
  const { classicCombo, contrastCombo, funkyCombo, funkyContrastCombo } = colors
  const image = collectionItem.featuredImage
  const { name, datePublished, author } = collectionItem
  const { showDatePublished: _showDatePublished, showAuthor: _showAuthor } =
    blockOptionsData.layout || {}
  const showDatePublished = _showDatePublished && datePublished
  const showAuthor = _showAuthor && author

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

  const inner = (
    <div
      css={{
        padding: `0 ${rhythm(1 / 2)}`,
        width: '100%',
        // ...imageStyle, // mess things up
      }}
    >
      <Img
        title={image.title}
        className="image"
        sizes={image.fluid}
        key="image"
        css={{
          height: `200px`,
        }}
      />
      <h3 key="title">{name}</h3>
      {(showDatePublished || showAuthor) && (
        <div
          css={{
            ...colors[funkyCombo].style,
            ...scale(-0.2),
            // lineHeight: rhythm(1 / 2),
            fontWeight: 'normal',
            '& > * + *': {
              marginLeft: '0.5em',
            },
          }}
        >
          {showAuthor && <span>{author}</span>}
          {showDatePublished && showAuthor && <span>-</span>}
          {showDatePublished && (
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
              {datePublished}
            </Moment>
          )}
        </div>
      )}
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
  // (
  //   <Link
  //     to={collectionItem.path}
  //     className="collectionItem stylishLink"
  //     css={{
  //       " h3, h4, h5, h6": {
  //         color: `inherit`,
  //         textAlign: `left`,
  //         marginBottom: 0,
  //       },
  //       padding: rhythm(1 / 4),
  //       ...passCSS,
  //       // ...colors[classicCombo].style,
  //       // ...styleData
  //     }}
  //   >
  //     <Img
  //       title={image.title}
  //       className="image"
  //       fluid={image.fluid}
  //       css={{
  //         // width: `100%`,
  //         // height: `100%`,
  //         " img": {
  //           objectFit: `cover`,
  //         },
  //         // border: `solid 2px ${colors[classicCombo].border}`
  //       }}
  //     />
  //     <h3>{collectionItem.name}</h3>
  //     {collectionItem.momentPublished && (
  //       <h6
  //         css={{
  //           lineHeight: rhythm(1 / 3),
  //         }}
  //       >
  //         {collectionItem.momentPublished}
  //       </h6>
  //     )}
  //   </Link>
  // )
}
