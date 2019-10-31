import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"

export default props => {
  // if multiple locales. let user choose

  return (
    <div
      css={{
        "> *:not(:last-child)": {
          marginRight: props.open ? rhythm(1 / 4) : 0
        }
      }}
    >
      {Object.keys(props.menu).map((locale, i, locales) => {
        const highlighted = locale === props.currentLocale
        const lang = locale.split("-")[0].toUpperCase()
        let link = props.location.pathname.split("/")
        link[1] = locale
        link = link.join("/")
        return (
          <Link
            key={locale}
            className="unstyledLink"
            to={link}
            css={{
              fontWeight: highlighted ? `bold` : `normal`,
              display: highlighted || props.open ? `inline` : `none`
            }}
            onClick={() => {
              props.toggleOpen()
            }}
          >
            {lang}
          </Link>
        )
      })}
    </div>
  )
}
