import React from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'

export default props => {
  // if multiple locales. let user choose

  return (
    <div
      css={{
        '> *:not(:last-child)': {
          marginRight: rhythm(1 / 4),
        },
      }}
    >
      {Object.keys(props.menu).map((locale, i, locales) => {
        // const highlighted = locale === props.currentLocale
        const lang = locale.split('-')[0].toUpperCase()
        const regex = /^\/..\//
        const link = props.location.pathname.replace(regex, `/${locale}/`)
        return (
          <Link
            key={locale}
            className="unstyledLink"
            to={link}
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
