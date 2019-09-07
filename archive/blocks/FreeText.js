import React from 'react'

import { mapStyle } from '../utils/processCss'
import { rhythm, scale } from '../utils/typography'
// import colors from "../utils/colors"

import Html from '../atoms/Html'

class BlockFreeText extends React.Component {
  constructor(props) {
    super(props)
    // _json_ fields
    this.optionsData = JSON.parse(props.block.options._json_)
    this.styleData = mapStyle(JSON.parse(props.block.style._json_))
    // Colors
    let { colorPalettes, colorCombo } = this.optionsData
    this.isColored = !!colorPalettes || !!colorCombo
    colorCombo = colorCombo
      ? props.colors[`${colorCombo}Combo`]
      : props.colors.classicCombo
    colorPalettes = colorPalettes || props.colors.colorPalettes
    const newColors = props.colors.computeColors(colorPalettes, colorCombo)
    this.colors = { ...props.colors, ...newColors }
  }

  render() {
    // console.log(this.props)
    const {
      classicCombo,
      contrastCombo,
      funkyCombo,
      funkyContrastCombo,
    } = this.colors

    const block = this.props.block
    if (Object.keys(block).length < 1) {
      return null
    }

    const { shortCodeMatchees } = this.props
    const { id: htmlId, name: htmlName } = this.optionsData

    return block.main ? (
      <div
        id={htmlId}
        name={htmlName}
        className="block blockFreeText"
        css={{
          padding: rhythm(1),
          display: `flex`,
          flexFlow: 'row wrap',
          justifyContent: `center`,
          alignItems: `center`,
          width: `100%`,
          maxWidth: `1000px`,
          margin: `0 auto`,
          ...this.props.passCSS,
          ...(this.isColored ? this.colors[classicCombo].style : {}),
          // ...this.colors[classicCombo].style,
          ...this.styleData,
          // " a.button:hover": {
          //   ...this.colors[funkyContrastCombo].style,
          //   borderColor: this.colors[classicCombo].border
          // }
        }}
      >
        <Html
          html={block.main.childMarkdownRemark.html}
          shortCodeMatchees={shortCodeMatchees}
        />
        {this.props.cookieButton &&
          this.props.cookieButton({ style: this.colors[classicCombo].style })}
      </div>
    ) : null
  }
}

export default BlockFreeText

export const blockFreeTextFragment = graphql`
  fragment BlockFreeText on ContentfulBlockFreeText {
    id
    name
    internal {
      type
    }
    main {
      id
      childMarkdownRemark {
        id
        html
        excerpt
        timeToRead
      }
    }
    options {
      # _json_
      internal {
        content
      }
      # colorPalettes
      # colorCombo
    }
    style {
      # _json_
      internal {
        content
      }
    }
  }
`
// blocks {
//   id
//   name
//   internal {
//     type
//   }
//   main {
//     id
//     childMarkdownRemark {
//       id
//       html
//       excerpt
//       timeToRead
//     }
//   }
//   options {
//     colorCombo
//   }
// }

// TODO: to implement when we can filter blocks in the compounded page query
// export const blockFreeTextFragment = graphql`
//   fragment BlockFreeTextFragment on ContentfulBlockFreeText {
//     id
//     main {
//       id
//       childMarkdownRemark {
//         id
//         html
//       }
//     }
//   }
// `
