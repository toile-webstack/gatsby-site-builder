import React from 'react'
import { rhythm } from '../utils/typography'

export const LFreeText = ({ className, ...props }) => (
  <div
    {...{
      className: `block blockFreeText ${className || ''}`,
      css: {
        padding: rhythm(1),
        display: `flex`,
        flexFlow: 'row wrap',
        justifyContent: `center`,
        alignItems: `center`,
        width: `100%`,
        maxWidth: `1000px`,
        margin: `0 auto`,
        // ...passCSS,
        // ...(isColored ? colors[classicCombo].style : {}),
        // ...style,
      },
      ...props,
    }}
  />
)

export const Dumb = {}
