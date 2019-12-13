import React from 'react'
import { For } from 'react-loops'
import {
  Reel,
  Box,
  Stack,
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

const MenuReel = ({ icon, name, menu, currentLocale, location }) => {
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
  const wordLengthApprox = 60
  const aroundApprox = 280 // indexLink, locales and padding
  const breakpointApprox = wordLengthApprox * currentMenu.length + aroundApprox

  return (
    <Box
      as="nav"
      padding={`${rhythm(1 / 4)} ${rhythm(1)}`}
      css={{
        ...colors[classicCombo].style,
        position: `sticky`,
        display: 'flex',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        boxShadow: `0 2px 10px rgba(0, 0, 0, .2)`,
        '& a': {
          color: 'inherit',
          textDecoration: 'inherit',
        },
      }}
    >
      <ul
        {...{
          style: {
            // in 'style' because it would have lower specificity than the same rule specified in the cms settings
            listStyleType: 'none',
          },
          css: {
            ...layoutStyles.stack({ horizontal: true, splitAfter: 1 }),
            width: '100%',
            margin: 0,
            padding: 0,
          },
        }}
      >
        <li>
          <Stack
            {...{
              as: Link,
              to: '/',
              horizontal: true,
              space: rhythm(1 / 4),
            }}
          >
            <img
              src={icon}
              alt={`${name} icon`}
              css={{ maxHeight: rhythm(1), width: 'fit-content' }}
            />
            <span
              css={{
                [`@media only screen and (max-width: ${breakpointApprox}px)`]: {
                  display: 'none',
                },
              }}
            >
              {name}
            </span>
          </Stack>
        </li>
        <Reel
          {...{
            noBar: true,
            space: rhythm(1),
            css: { ...lateralShadowStyles },
          }}
        >
          <For
            of={currentMenu}
            as={({ name: pageName, path: to }) => (
              <li>
                <Link
                  {...{
                    to,
                    activeStyle,
                  }}
                >
                  {pageName}
                </Link>
              </li>
            )}
          />
        </Reel>
        {showLocalesMenu && (
          <Stack {...{ horizontal: true, space: rhythm(1 / 4) }}>
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
          </Stack>
        )}
      </ul>
    </Box>
  )
}

export default MenuReel
