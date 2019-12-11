import React from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'

export default props => {
  const {
    classicCombo,
    contrastCombo,
    funkyCombo,
    funkyContrastCombo,
  } = props.colors
  return (
    <nav
      css={{
        ...props.colors[funkyCombo].style,
        position: `fixed`,
        top: rhythm(1.7),
        right: rhythm(1),
        border: `solid 1px`,
        borderTop: 'none',
        listStyleType: `none`,
        margin: 0,
        // padding: `0 ${rhythm(1)}`,
        zIndex: 99,
        textAlign: `center`,
        display: props.open ? `block` : `none`,
        ...props.passCSS,
      }}
    >
      <div
        css={{
          display: `flex`,
          borderBottom: `solid 1px ${props.colors[funkyContrastCombo].border}`,
          '> *': {
            flexGrow: 1,
          },
        }}
      />
      {props.currentMenu.map(page => {
        return (
          <Link
            key={page.path}
            className="unstyledLink"
            onClick={() => {
              props.close()
            }}
            to={page.path}
          >
            <li
              css={{
                margin: 0,
                padding: `${rhythm(1 / 4)} ${rhythm(1)}`,
                ':hover': {
                  ...props.colors[funkyContrastCombo].style,
                },
              }}
            >
              {page.name}
            </li>
          </Link>
        )
      })}
    </nav>
  )
}
