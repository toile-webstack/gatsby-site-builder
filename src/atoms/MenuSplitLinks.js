import React from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'

import MenuDrawer from './MenuDrawerTop'

export default props => {
  const {
    classicCombo,
    contrastCombo,
    funkyCombo,
    funkyContrastCombo,
  } = props.colors
  return (
    <nav
      className="menuLinks"
      css={{
        // ...props.colors[funkyCombo].style,
        // position: `fixed`,
        // top: rhythm(1.5),
        // right: rhythm(1),
        // border: `solid 1px`,
        // margin: 0,
        // // padding: `0 ${rhythm(1)}`,
        // zIndex: 99,
        // textAlign: `center`,
        // display: props.open ? `block` : `none`,
        position: `absolute`,
        top: 0,
        right: 0,
        maxWidth: `100%`,
        maxHeight: `100%`,
        // flexShrink: 1,
        // overflow: `hidden`,
        display: `flex`,
        listStyleType: `none`,
        visibility: props.show ? `visible` : `hidden`,
        ...props.passCSS,
      }}
    >
      {props.currentMenu.map(page => {
        const highlighted =
          typeof window === 'undefined'
            ? false
            : page.homepage
            ? page.path === props.location.pathname
            : props.location.pathname.match(page.path)
        return (
          <div
            key={page.path}
            css={
              {
                // position: `relative`
              }
            }
          >
            <Link
              className="unstyledLink"
              // onClick={() => {
              //   props.close()
              // }}
              to={page.path}
              css={{
                display: `block`,
                color:
                  props.colors[classicCombo][
                    highlighted ? 'linkHover' : 'body'
                  ],
                fontWeight: `bold`,
              }}
            >
              <li
                css={{
                  margin: 0,
                  padding: `0 ${rhythm(1 / 2)}`,
                  // ":hover": {
                  //   ...props.colors[funkyContrastCombo].style
                  // }
                }}
              >
                {props.show ? page.name : ''}
              </li>
            </Link>
            {/* {!!page.children.length && (
              <div
                css={{
                  position: `absolute`,
                  right: 0,
                  left: 0,
                  // top: rhythm(1),
                  background: `red`
                }}
              >
                <MenuDrawer
                  currentMenu={page.children}
                  open={true}
                  colors={props.colors}
                  close={() => {
                    this.setState({ open: false })
                  }}
                  passCSS={{
                    // right: rhythm(1 / 2),
                    // left: rhythm(1 / 2)
                  }}
                />
              </div>
            )} */}
          </div>
        )
      })}
    </nav>
  )
}
