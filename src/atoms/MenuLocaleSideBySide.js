import React from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'

export default ({ menu, location }) => {
  // if multiple locales. let user choose

  return (
    <div
      css={{
        '> *:not(:last-child)': {
          marginRight: rhythm(1 / 4),
        },
      }}
    >
      {Object.keys(menu).map(locale => {
        // const highlighted = locale === props.currentLocale
        const lang = locale.split('-')[0].toUpperCase()
        const regex = /^\/..\//
        const link = location.pathname.replace(regex, `/${locale}/`)
        return (
          <Link
            key={locale}
            className="unstyledLink"
            to={link}
            rel="alternate"
            hrefLang={locale}
            activeStyle={{
              fontWeight: `bold`,
            }}
            // partiallyActive={true}
            // css={{ fontWeight: highlighted ? `bold` : `normal` }}
          >
            {lang}
          </Link>
        )
      })}
    </div>
  )
}
