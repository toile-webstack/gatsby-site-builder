import React from 'react'
import { graphql } from 'gatsby'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import { mapStyle } from '../utils/processCss'
// import { rhythm, scale } from '../utils/typography'
// import colors from "../utils/colors"
import internalJson from '../utils/internalJson'
import { useColors } from '../logic'
import { Block } from '../canvas'

// import Html from '../atoms/Html'

const BlockFreeText = ({
  block,
  colors: colorsLib,
  location,
  shortCodeMatchees,
  className = '',
  cookieButton,
  // passCSS,
}) => {
  if (!block.main) return null

  // const { options: optionsData, style: styleData } = block
  // const options = internalJson(optionsData)
  // const style = mapStyle(internalJson(styleData))

  // const colors = useColors({ options, colorsLib })
  // const { isColored, classicCombo } = colors
  // const { id, name } = options

  return (
    <Block
      {...{
        // id,
        // name,
        className: `block blockFreeText ${className}`,
      }}
      css={
        {
          // ...(isColored ? colors[classicCombo].style : {}),
          // ...style,
        }
      }
    >
      {/* <Html
        html={block.main.childMarkdownRemark.html}
        shortCodeMatchees={shortCodeMatchees}
      /> */}
      {/* {cookieButton && cookieButton({ style: colors[classicCombo].style })} */}
    </Block>
  )
}

// class BlockFreeTex extends React.Component {
//   constructor(props) {
//     super(props)
//     // internal.content fields
//     const { options, style } = props.block
//     this.optionsData = internalJson(options)
//     this.styleData = mapStyle(internalJson(style))
//     // Colors
//     let { colorPalettes, colorCombo } = this.optionsData
//     this.isColored = !!colorPalettes || !!colorCombo
//     colorCombo = colorCombo
//       ? props.colors[`${colorCombo}Combo`]
//       : props.colors.classicCombo
//     colorPalettes = colorPalettes || props.colors.colorPalettes
//     const newColors = props.colors.computeColors(colorPalettes, colorCombo)
//     this.colors = { ...props.colors, ...newColors }
//   }

//   render() {
//     // console.log(this.props)
//     const {
//       classicCombo,
//       contrastCombo,
//       funkyCombo,
//       funkyContrastCombo,
//     } = this.colors

//     const block = this.props.block
//     if (Object.keys(block).length < 1) {
//       return null
//     }

//     const { shortCodeMatchees } = this.props
//     const { id: htmlId, name: htmlName } = this.optionsData

//     return block.main ? (
//       <div
//         id={htmlId}
//         name={htmlName}
//         className="block blockFreeText"
//         css={{
//           padding: rhythm(1),
//           display: `flex`,
//           flexFlow: 'row wrap',
//           justifyContent: `center`,
//           alignItems: `center`,
//           width: `100%`,
//           maxWidth: `1000px`,
//           margin: `0 auto`,
//           ...this.props.passCSS,
//           ...(this.isColored ? this.colors[classicCombo].style : {}),
//           // ...this.colors[classicCombo].style,
//           ...this.styleData,
//           // " a.button:hover": {
//           //   ...this.colors[funkyContrastCombo].style,
//           //   borderColor: this.colors[classicCombo].border
//           // }
//         }}
//       >
//         <Html
//           html={block.main.childMarkdownRemark.html}
//           shortCodeMatchees={shortCodeMatchees}
//         />
//         {this.props.cookieButton &&
//           this.props.cookieButton({ style: this.colors[classicCombo].style })}
//       </div>
//     ) : null
//   }
// }

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
      internal {
        content
      }
      # colorPalettes
      # colorCombo
    }
    style {
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
