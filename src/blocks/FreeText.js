import React from 'react'
import { graphql } from 'gatsby'

import { mapStyle } from '../utils/processCss'
import { internalJson, useColors } from '../utils'

import { LBlockFreeText } from '../t-layouts'

import Html from '../atoms/Html'

const FreeText = ({
  block,
  colors: colorsLib,
  // location,
  shortCodeMatchees,
  className = '',
  cookieButton,
  passCSS,
}) => {
  if (!block.main) return null

  const { options: optionsData, style: styleData } = block
  const options = internalJson(optionsData)
  const style = mapStyle(internalJson(styleData))

  const colors = useColors({ options, colorsLib })
  const { isColored, classicCombo } = colors
  const { id, name } = options

  return (
    <LBlockFreeText
      {...{
        id,
        name,
        className: `block blockFreeText ${className || ''}`,
        css: {
          ...passCSS,
          ...(isColored ? colors[classicCombo].style : {}),
          // ...this.colors[classicCombo].style,
          ...style,
          // " a.button:hover": {
          //   ...this.colors[funkyContrastCombo].style,
          //   borderColor: this.colors[classicCombo].border
          // }
        },
      }}
    >
      <Html
        html={block.main.childMarkdownRemark.html}
        shortCodeMatchees={shortCodeMatchees}
      />
      {cookieButton && cookieButton({ style: colors[classicCombo].style })}
    </LBlockFreeText>
  )
}

export default FreeText

export const blockFreeTextFragment = graphql`
  fragment BlockFreeText on ContentfulBlockFreeText {
    id
    name
    __typename
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
