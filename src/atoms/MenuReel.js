import React, { useState } from 'react'
import { For } from 'react-loops'
import { MdClose, MdMenu } from 'react-icons/md'
import {
  // Reel,
  Box,
  // Stack,
  layoutStyles,
} from '@bit/marccoet.toile.nuds-layout-primitives'
import { lateralShadowStyles } from '../../nuds-styles'

import { rhythm } from '../utils/typography'
import colorsLib from '../utils/colors'
import { Link } from './Link'
// import MenuLocale from '../atoms/MenuLocaleSideBySide'

const activeStyle = {
  fontWeight: `bold`,
}

const MenuMain = ({ menu, close, openMenu, className }) => (
  <div {...{ className }}>
    <For
      of={menu}
      as={({ name: pageName, path: to }) => (
        <li>
          <Link
            {...{
              to,
              activeStyle,
              ...(close && { onClick: close }),
              onFocus: openMenu,
            }}
          >
            {pageName}
          </Link>
        </li>
      )}
    />
  </div>
)

const MenuReel = ({ icon, name, menu, currentLocale, location }) => {
  const [open, setOpen] = useState(false)
  const openMenu = () => {
    setOpen(true)
  }
  const close = () => {
    setOpen(false)
  }
  const toggleOpen = () => {
    setOpen(prev => !prev)
  }
  const currentMenu = menu && menu[currentLocale]
  const { pathname } = location
  const locales = menu && Object.keys(menu).map(locale => locale.split('-')[0])
  const showLocalesMenu = locales && locales.length > 1

  // Colors
  const colorCombo = colorsLib.menuCombo
  const newColors = colorsLib.computeColors([1], colorCombo)
  const colors = { ...colorsLib, ...newColors }
  const { classicCombo } = colors

  // Try to guess the right breakpoint for name to disapear
  // const wordLengthApprox = 60
  // const aroundApprox = 280 // indexLink, locales and padding
  // const breakpointApprox = wordLengthApprox * currentMenu.length + aroundApprox

  const menuCharsLength = currentMenu.map(({ name: n }) => n).join('').length
  const localesLength = locales.length
  const langsLength = localesLength > 1 ? localesLength * 2 : 0
  const dimensionsApprox = {
    // left and right = 6ch /* + 3 between left and right */ + 3 between main menu and lang if lang
    componentP: 6 + (langsLength > 0 ? 3 : 0),
    logo: 4,
    name: name.length,
    leftElP: 0.6,
    menu: menuCharsLength,
    menuP: (currentMenu.length - 1) * 3,
    lang: langsLength,
    langP: (localesLength - 1) * 0.6,
  }
  const fullDimensionApprox = Object.values(dimensionsApprox).reduce(
    (accu, curr) => accu + curr,
    0
  )

  const MenuIcon = open ? MdClose : MdMenu

  return (
    <>
      <Box
        as="nav"
        padding={`${rhythm(1 / 4)} ${rhythm(1)}`}
        css={{
          ...colors[classicCombo].style,
          // POSITION
          position: `sticky`,
          display: 'flex',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          // SHADOW
          boxShadow: `0 2px 10px rgba(0, 0, 0, .2)`,
          '& a': {
            color: 'inherit',
            textDecoration: 'inherit',
            display: 'inline-block',
            paddingTop: rhythm(1 / 4),
            paddingBottom: rhythm(1 / 4),
          },
          ' ul': {
            width: '100%',
            margin: 0,
            padding: 0,
            ' > .menu--wrapper-top': {
              ...layoutStyles.stack({
                horizontal: true,
                splitAfter: 1,
              }),
              alignItems: 'center',
            },
          },
          // LATERAL STACKS
          ' .menu--langs, .menu--logo-name': {
            ...layoutStyles.stack({
              horizontal: true,
              space: [rhythm(1 / 4), '0.6ch'],
            }),
          },
          // MOBILE MENU
          maxHeight: open ? rhythm(2 * currentMenu.length) : rhythm(2),
          transition: 'max-height .5s',
          overflow: 'hidden',
          ' .menu--main__mobile': {
            textAlign: 'right',
          },
          ' .menu--mobile-button, .menu--main__mobile': {
            display: 'none',
          },
          // LARGE SCREEN MENU
          ' .menu--main__large': {
            ...layoutStyles.reel({
              noBar: true,
              // space: rhythm(1),
              space: [rhythm(1), '3ch'],
            }),
            ...lateralShadowStyles,
          },
          // In case ch unit or js are not supported, we use max-width because menyReel is mobile friendly
          // and the prefered choice. The burger menu being progressive enhancement.
          [`@media only screen and (max-width: ${fullDimensionApprox}ch)`]: {
            ' .menu--main__large': {
              display: 'none',
            },
            ' .menu--main__mobile': {
              display: 'block',
            },
            ' .menu--mobile-button': {
              display: 'inline-block',
            },
          },
        }}
      >
        <ul
          {...{
            style: {
              // in 'style' because it would have lower specificity than the same rule specified in the cms settings
              listStyleType: 'none',
            },
            css: {},
          }}
        >
          <div className="menu--wrapper-top">
            <li css={{ flexShrink: 0 }}>
              <Link
                {...{
                  to: '/',
                  className: 'menu--logo-name',
                  onClick: close,
                  onFocus: openMenu,
                }}
              >
                <img
                  src={icon}
                  alt={`${name} icon`}
                  css={{
                    maxHeight: rhythm(1),
                    // maxWidth: rhythm(1),
                    width: 'fit-content',
                  }}
                />
                <span
                  css={
                    {
                      // [`@media only screen and (max-width: ${breakpointApprox}px)`]: {
                      //   display: 'none',
                      // },
                    }
                  }
                >
                  {name}
                </span>
              </Link>
            </li>
            <MenuMain
              {...{
                menu: currentMenu,
                close,
                className: 'menu--main menu--main__large',
              }}
            />
            {showLocalesMenu && (
              <div className="menu--langs">
                <For
                  of={locales}
                  as={locale => {
                    // const highlighted = locale === props.currentLocale
                    const lang = locale.toUpperCase()
                    const regex = /^\/..\//
                    const to = pathname.replace(regex, `/${locale}/`)

                    return (
                      <Link
                        {...{
                          to,
                          rel: 'alternate',
                          hrefLang: locale,
                          activeStyle,
                        }}
                        // partiallyActive={true}
                        // css={{ fontWeight: highlighted ? `bold` : `normal` }}
                      >
                        {lang}
                      </Link>
                    )
                  }}
                />
              </div>
            )}
            <MenuIcon
              size={rhythm(1.2)}
              type="button"
              role="button"
              onClick={() => {
                toggleOpen()
              }}
              onKeyUp={() => {
                toggleOpen()
              }}
              className="menu--mobile-button"
            />
          </div>
          <MenuMain
            {...{
              menu: currentMenu,
              close,
              openMenu,
              className: 'menu--main menu--main__mobile',
            }}
          />
        </ul>
      </Box>
    </>
  )
}

export default MenuReel
