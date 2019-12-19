import React from 'react'
import Img from 'gatsby-image'
import Moment from 'react-moment'

import { rhythm, scale } from '../../../utils/typography'
// import colors from "../utils/colors"
import { addLayoutOptions } from '../../../utils/computeGrid'

// import Html from '../../../atoms/Html'
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
  const {
    datePublished,
    dateLastEdit,
    fields: { locale: collectionItemLocale },
  } = collectionItem

  const showDateLastEdit = dateLastEdit && dateLastEdit !== datePublished
  const showDatePublishedTime =
    !!datePublished.slice(11) && datePublished.slice(11) !== '00:00'
  const showDateLastEditTime =
    !!dateLastEdit.slice(11) && dateLastEdit.slice(11) !== '00:00'

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
      {/* <h3 key="title">{collectionItem.name}</h3>
      {collectionItem.momentPublished && (
        <Moment
          key="date"
          locale={collectionItem.fields.locale}
          format="Do MMM YYYY"
          css={{
            ...scale(-0.2),
            lineHeight: rhythm(1 / 2),
            // marginBottom: rhythm(1 / 2),
            // padding: rhythm(1 / 2),
          }}
        >
          {collectionItem.datePublished}
        </Moment>
      )} */}
      <h4
        css={{
          ...scale(0.4),
          // color: `inherit`,
        }}
      >
        {collectionItem.name}
      </h4>
      {datePublished && (
        <Moment
          locale={collectionItemLocale}
          format="Do MMM YYYY"
          css={{
            ...scale(-0.2),
            lineHeight: rhythm(1 / 2),
            marginBottom: rhythm(1 / 2),
            // padding: rhythm(1 / 2),
          }}
        >
          {datePublished}
        </Moment>
      )}
      {showDatePublishedTime && (
        <>
          <span>{` - `}</span>
          <Moment
            locale={collectionItemLocale}
            format="HH:mm"
            css={{
              ...scale(-0.2),
              lineHeight: rhythm(1 / 2),
              marginBottom: rhythm(1 / 2),
              // padding: rhythm(1 / 2),
              ...altColor,
            }}
          >
            {datePublished}
          </Moment>
        </>
      )}
      {datePublished && (showDateLastEdit || showDateLastEditTime) && (
        <span {...{ css: { ...altColor } }}>{` > `}</span>
      )}
      {showDateLastEdit && (
        <Moment
          locale={collectionItemLocale}
          format="Do MMM YYYY"
          css={{
            ...scale(-0.2),
            lineHeight: rhythm(1 / 2),
            marginBottom: rhythm(1 / 2),
            // padding: rhythm(1 / 2),
          }}
        >
          {dateLastEdit}
        </Moment>
      )}
      {showDateLastEditTime && (
        <>
          {showDateLastEdit && <span>{` - `}</span>}
          <Moment
            locale={collectionItemLocale}
            format="HH:mm"
            css={{
              ...scale(-0.2),
              lineHeight: rhythm(1 / 2),
              marginBottom: rhythm(1 / 2),
              // padding: rhythm(1 / 2),
              ...altColor,
            }}
          >
            {dateLastEdit}
          </Moment>
        </>
      )}
      <hr
        css={{
          flexShrink: 0,
          width: `100%`,
          marginBottom: rhythm(1 / 2),
          height: 1,
          backgroundColor: colors[funkyCombo].body,
        }}
      />
      <Img
        title={image.title}
        className="image"
        sizes={image.fluid}
        key="image"
        css={{
          height: `200px`,
        }}
      />
    </div>
  )

  const innerr = [
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
      )}
      <hr
        css={{
          flexShrink: 0,
          width: `100%`,
          marginBottom: rhythm(1 / 2),
          height: 1,
          backgroundColor: colors[funkyCombo].body,
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
  // linkToPage ? (
  //   <Link
  //     to={collectionItem.path}
  //     className="collectionItem stylishLink"
  //     css={{
  //       display: `flex`,
  //       flexFlow: `row wrap`,
  //       justifyContent: `center`,
  //       textAlign: `left`,
  //       " h2, h3, h4, h5, h6, p": {
  //         color: `inherit`,
  //         textAlign: `left`,
  //         margin: 0,
  //       },
  //       padding: `${rhythm(1)} 0`,
  //       // ...passCSS
  //       // ...colors[classicCombo].style,
  //       // ...styleData
  //     }}
  //   >
  //     {inner}
  //   </Link>
  // ) : (
  //   <div
  //     className="collectionItem stylishLink"
  //     css={{
  //       display: `flex`,
  //       flexFlow: `row wrap`,
  //       justifyContent: `center`,
  //       textAlign: `left`,
  //       " h2, h3, h4, h5, h6, p": {
  //         color: `inherit`,
  //         textAlign: `left`,
  //         margin: 0,
  //       },
  //       padding: `${rhythm(1)} 0`,
  //       // ...passCSS
  //       // ...colors[classicCombo].style,
  //       // ...styleData
  //     }}
  //   >
  //     {inner}
  //   </div>
  // )
}
