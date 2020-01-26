import React from 'react'
import ReactMd from 'react-markdown/with-html'
// import { graphql } from 'gatsby'

// import { mapStyle } from '../utils/processCss'
// import { internalJson, useColors } from '../utils'

import Html from '../atoms/Html'

import View from '../../libs/nuds-view-component'

const useFreeText = ({ block, colors: colorsLib, ...rest }) => {
  // console.log(block)
  const { options = {}, style } = block

  // const colors = useColors({ options, colorsLib })
  // const { isColored, classicCombo } = colors
  const { id, name } = options

  return {
    ...rest,
    ...block,
    style,
    // isColored,
    // colors,
    // classicCombo,
    id,
    name,
  }
}

const Markup = ({
  id,
  name,
  className,
  // isColored,
  // colors,
  // classicCombo,
  style,
  main,
  shortCodeMatchees,
  cookieButton,
}) => (
  <div
    {...{
      id,
      name,
      className: `block blockFreeText ${className || ''}`,
      css: {
        // ...(isColored ? colors[classicCombo].style : {}),
        ...style,
        //
        // " a.button:hover": {
        //   ...this.colors[funkyContrastCombo].style,
        //   borderColor: this.colors[classicCombo].border
        // }
      },
    }}
  >
    <ReactMd
      {...{
        source: main,
        escapeHtml: false,
      }}
    />
    {/* <Html
      html={main && main.childMarkdownRemark.html}
      shortCodeMatchees={shortCodeMatchees}
    /> */}
    {cookieButton &&
      cookieButton({
        // style: colors[classicCombo].style
      })}
  </div>
)

const FreeText = ({ ...data }) => (
  <View
    {...{
      data,
      useData: useFreeText,
      Markup,
    }}
  />
)

export default FreeText

// export const blockFreeTextFragment = graphql`
//   fragment BlockFreeText on ContentfulBlockFreeText {
//     id
//     name
//     __typename
//     main {
//       id
//       childMarkdownRemark {
//         id
//         html
//         excerpt
//         timeToRead
//       }
//     }
//     options {
//       internal {
//         content
//       }
//       # colorPalettes
//       # colorCombo
//     }
//     style {
//       internal {
//         content
//       }
//     }
//   }
// `
