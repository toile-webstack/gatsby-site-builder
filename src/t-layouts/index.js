import React from 'react'
import { rhythm } from '../utils/typography'

const blockCss = {
  padding: rhythm(1),
  display: `flex`,
  flexFlow: 'row wrap',
  justifyContent: [`space-around`, `space-evenly`],
  alignItems: `center`,
  width: `100%`,
  maxWidth: `1000px`,
  margin: `0 auto`,
}

export const LBlock = ({ ...props }) => (
  <div {...{ css: { ...blockCss }, ...props }} />
)

export const LBlockFreeText = LBlock

export const LBlockGallery = LBlock

export const LBlockForm = ({ ...props }) => {
  return (
    <div
      {...{
        css: {
          ...blockCss,
          '> div': {
            width: `100%`,
            maxWidth: `1000px`,
            margin: `auto`,
          },
        },
        ...props,
      }}
    />
  )
}

export const LBlockReferences = ({ ...props }) => {
  return (
    <div
      {...{
        css: {
          ...blockCss,
          alignItems: `flex-start`,
          ' h3': {
            marginTop: 0,
          },
        },
        ...props,
      }}
    />
  )
}
