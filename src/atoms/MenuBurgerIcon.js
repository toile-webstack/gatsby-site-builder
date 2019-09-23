import React from 'react'
// import Link from "gatsby-link"
import { MdMenu, MdClose } from 'react-icons/md'

import { rhythm, scale } from '../utils/typography'

export default props => {
  return props.open ? (
    <MdClose
      onClick={() => {
        props.toggleOpen()
      }}
      css={{
        fontSize: rhythm(1),
        textAlign: `right`,
        cursor: `pointer`,
        ':hover': {
          color: props.colors[props.colors.classicCombo].linkHover,
        },
      }}
    />
  ) : (
    <MdMenu
      onClick={() => {
        props.toggleOpen()
      }}
      css={{
        fontSize: rhythm(1),
        textAlign: `right`,
        cursor: `pointer`,
        ':hover': {
          color: props.colors[props.colors.classicCombo].linkHover,
        },
      }}
    />
  )
}
