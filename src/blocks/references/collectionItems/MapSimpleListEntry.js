import React, { useState } from 'react'
import * as MdIcons from 'react-icons/md'
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
import Html from '../../../atoms/Html'

export default ({
  collectionItem,
  colors,
  styleData,
  layout,
  blockOptionsData,
  optionsData,
  passCSS,
  mapElementSelected,
  selectMapElem,
}) => {
  // handle card opening and closing
  const currentId = collectionItem.id
  const isSelected = mapElementSelected === currentId
  const toggleOpen = e => {
    e.stopPropagation()
    selectMapElem(isSelected ? null : currentId)
  }

  const { classicCombo, contrastCombo, funkyCombo, funkyContrastCombo } = colors
  const image = collectionItem.featuredImage
  const { excerpt, html } = collectionItem?.content?.childMarkdownRemark || {}

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
        // padding: `0 ${rhythm(1 / 4)}`,
        width: '100%',
      }}
    >
      <p
        {...{
          css: {
            fontSize: '0.8rem',
          },
        }}
      >
        <strong>{collectionItem.name}</strong>
      </p>
      <Html
        html={excerpt}
        passCSS={{
          fontSize: '0.7rem',
          fontWeight: 'normal',
        }}
      />
    </div>
  )
  // copied from default entry
  // const inner = (
  //   <div
  //     css={{
  //       padding: `0 ${rhythm(1 / 2)}`,
  //       width: '100%',
  //     }}
  //   >
  //     <Img
  //       title={image.title}
  //       className="image"
  //       sizes={image.fluid}
  //       key="image"
  //       css={{
  //         height: `200px`,
  //       }}
  //     />
  //     <h3 key="title">{collectionItem.name}</h3>
  //     {collectionItem.momentPublished && (
  //       <Moment
  //         key="date"
  //         locale={collectionItem.fields.locale}
  //         format="Do MMM YYYY"
  //         css={{
  //           ...scale(-0.2),
  //           lineHeight: rhythm(1 / 2),
  //           // marginBottom: rhythm(1 / 2),
  //           // padding: rhythm(1 / 2),
  //         }}
  //       >
  //         {collectionItem.datePublished}
  //       </Moment>

  //       // <h6
  //       //   css={{
  //       //     lineHeight: rhythm(1 / 3),
  //       //   }}
  //       // >
  //       //   {collectionItem.momentPublished}
  //       // </h6>
  //     )}
  //   </div>
  // )

  // chose icon from this list: https://react-icons.github.io/react-icons/icons?name=md
  const icon = optionsData?.icon || blockOptionsData?.map?.icons || 'MdPlace'
  const IconComp = MdIcons[icon] || MdIcons.MdPlace
  // Translate Y only if we don't use the MdPlace icon
  const shouldTranslateY = IconComp !== MdIcons.MdPlace

  // // should we link to somewhere. An option on the block allows us to avoid that
  // const linkTo = blockOptionsData?.linkTo
  // const doNotLink = linkTo === `none`

  return (
    <div
      {...{
        css: {
          position: 'absolute',
          bottom: 0,
          zIndex: 10,
          width: '500px',
        },
      }}
    >
      <IconComp
        onClick={toggleOpen}
        css={{
          fontSize: rhythm(1.5),
          textAlign: `right`,
          cursor: `pointer`,
          color: colors[colors.classicCombo].body,
          transform: `translateX(-50%)${
            shouldTranslateY ? ' translateY(50%)' : ''
          }`,
          ':hover': {
            color: colors[colors.classicCombo].linkHover,
          },
        }}
      />
      {isSelected ? (
        <LinkOrNotCollectionItem
          blockOptionsData={blockOptionsData}
          optionsData={optionsData}
          collectionItem={collectionItem}
          colors={colors}
          passCSS={{
            position: 'absolute',
            padding: `${rhythm(1 / 2)} ${rhythm(1 / 2)} ${rhythm(1 / 4)}`,
          }}
        >
          {inner}
        </LinkOrNotCollectionItem>
      ) : null}
    </div>
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
