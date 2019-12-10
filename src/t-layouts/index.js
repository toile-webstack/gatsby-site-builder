import React from 'react'
import { rhythm } from '../utils/typography'

export {
  LArticleDefault,
  LArticleClassicRow,
  LArticleEvent,
  LArticleTestimonial,
} from './LArticle'

export const LLayout = ({ ...props }) => (
  <div
    {...{
      css: {
        position: 'relative',
        display: `flex`,
        flexFlow: `column`,
        minHeight: `100vh`,
        width: `100%`,
        // paddingTop: rhythm(1.6)
        '& > .layout-wrapper': {
          margin: `auto`,
          display: `flex`,
          flexGrow: 1,
          flexFlow: `column`,
          justifyContent: `center`,
          width: `100%`,
          // for sidebar layout
          // "@media(min-width: 800px)": {
          //   flexFlow: `row`,
          //   "> .layout-main": {
          //     maxWidth: 1000,
          //   },
          //   "> .sidebar": {
          //     width: 250,
          //     marginLeft: rhythm(1 / 2),
          //   },
          // },
          // "@media(min-width: 1270px)": {
          //   "> .layout-main": {
          //     maxWidth: 1000,
          //   },
          //   "> .sidebar": {
          //     width: 250,
          //     marginLeft: rhythm(1 / 2),
          //   },
          // },
          '& > .layout-main': {
            flexGrow: 1,
            display: `flex`,
            flexFlow: `column`,
            width: `100%`,
            '& > div': {
              // pages
              flexGrow: `1`,
              display: `flex`,
              flexFlow: `column`,
              justifyContent: `center`,
              padding: 0,
              // padding: `${rhythm(1)} ${rhythm(1 / 2)}`,
              position: `relative`,
              '> div': {
                // 1st line blocks OR blog article
                ':first-child': {
                  paddingTop: rhythm(2),
                },
                ':last-child': {
                  paddingBottom: rhythm(2),
                },
              },
            },
          },
        },
      },
      ...props,
    }}
  />
)

export const LSection = ({ ...props }) => (
  <div
    {...{
      css: {
        position: `relative`,
        width: `100%`,
        padding: `${rhythm(1)} 0`,
        '& > div': {
          display: `flex`,
          flexFlow: `row wrap`,
          justifyContent: [`space-around`, `space-evenly`],
          margin: `auto`,
          maxWidth: `1000px`,
          padding: `0 ${rhythm(1)}`,
          '& .section-column': {
            position: `relative`,
            display: `flex`,
            flexFlow: `column`,
            width: `100%`,
            // width: itemStyle.width,

            // justifyContent: `space-around`,
            // justifyContent: `space-evenly`,
            // alignItems: layout.align || `baseline`,
            // margin: `auto`,
            // maxWidth: `1000px`,
            // padding: `0 ${rhythm(1)}`
          },
        },
      },
      ...props,
    }}
  />
)

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
