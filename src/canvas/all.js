import React from 'react'
import { Stack } from '../../libs/layout-primitives'
import { rhythm, scale } from '../utils/typography'

export const Page = ({ children, ...props }) => (
  <Stack {...{ children, ...props }} />
)

export const Layout = ({ children }) => {
  return children
}

export const Menu = () => {
  return null
}

export const Footer = () => {
  return null
}

export const Main = ({ children }) => {
  return children
}

export const Section = () => {
  return null
}

export const Column = ({ children, ...props }) => {
  return (
    <div
      css={{
        display: `flex`,
        flexFlow: `column`,
        width: `100%`,
        // "> div": {
        //   ...this.colors[classicCombo].style,
        //   ":hover": {
        //     ...this.colors[funkyCombo].style,
        //   },
        // },
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export const Block = ({ children, ...props }) => {
  return (
    <div
      {...{
        css: {
          // FREETEXT
          padding: '1rem',
          //   padding: rhythm(1),
          display: `flex`,
          flexFlow: 'row wrap',
          justifyContent: `center`,
          alignItems: `center`,
          width: `100%`,
          maxWidth: `1000px`,
          margin: `0 auto`,

          // REFERENCES
          //   width: `100%`,
          //   maxWidth: `1000px`,
          //   margin: `auto`,
          //   flexGrow: 1,
          //   display: `flex`,
          //   flexFlow: `column`,
        },
        ...props,
      }}
    >
      {children}
    </div>
  )
}

export const BlockMain = ({ children, ...props }) => (
  <div
    css={{
      padding: rhythm(1),
      display: `flex`,
      flexFlow: `row wrap`,
      justifyContent: [`space-around`, `space-evenly`],
      alignItems: `flex-start`,
      width: `100%`,
      margin: `0 auto`,
      // "> a": {
      //   width: `100%`,
      //   maxWidth:
      //     block.references.length < 3
      //       ? `calc((1000px - ${rhythm(2)}) / ${block.references.length})`
      //       : `calc((1000px - ${rhythm(2)}) / 3)`,
      //   // margin: `auto`,
      //   padding: `${rhythm(1 / 2)} ${rhythm(1 / 8)}`
      // },
      ' .image': {
        // height: `200px` // TODO: check if it does not scew up block references but wes posing problem for Testimonials
      },
      ' h3': {
        marginTop: 0,
      },
      // " a.button:hover": {
      //   ...this.colors[funkyContrastCombo].style,
      //   borderColor: this.colors[classicCombo].border
      // }
    }}
    {...props}
  >
    {children}
  </div>
)

export const ListCategories = ({ children, ...props }) => (
  <div
    css={{
      display: `flex`,
      flexFlow: `row wrap`,
      justifyContent: `center`,
      ' > *': {
        margin: `${rhythm(1 / 4)} ${rhythm(1 / 4)}`,
        padding: `${rhythm(1 / 8)} ${rhythm(1 / 4)}`,
        cursor: `pointer`,
        border: `solid 1px`,
      },
    }}
    {...props}
  >
    {children}
  </div>
)
