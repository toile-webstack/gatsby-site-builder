import React from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'

const LinkOrNotCollectionItem = ({
  blockOptionsData,
  optionsData,
  collectionItem,
  children,
  passCSS,
  colors,
}) => {
  const { classicCombo, funkyCombo } = colors

  const linkTo = blockOptionsData && blockOptionsData.linkTo
  const internalLink = collectionItem.path

  const externalLink = optionsData && optionsData.linkTo
  const { lang } = optionsData

  const css = {
    display: `flex`,
    flexFlow: `row wrap`,
    justifyContent: `center`,
    textAlign: `left`,
    ' h2, h3, h4, h5, h6': {
      // color: `inherit`,
      // textAlign: `left`,
      margin: 0,
    },
    ' .gatsby-image-wrapper': {
      width: `100%`,
    },
    ' img': {
      objectFit: `cover`,
    },
    padding: `${rhythm(1)} 0`,

    ...colors[classicCombo].style,
    ':hover': {
      ...colors[linkTo === `none` ? classicCombo : funkyCombo].style,
      color: `${colors[linkTo === `none` ? classicCombo : funkyCombo].body}!important`,
    },
    ...passCSS,
    // ...colors[classicCombo].style,
    // ...styleData
  }

  switch (linkTo) {
    case `external`:
      return (
        <a
          {...{ ...(lang && { lang }) }}
          href={externalLink}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="collectionItem stylishLink"
          css={css}
        >
          {children}
        </a>
      )
    case `none`:
      return (
        <div
          {...{ ...(lang && { lang }) }}
          className="collectionItem"
          css={css}
        >
          {children}
        </div>
      )
    case `page`:
    default:
      return (
        <Link
          {...{ ...(lang && { lang }) }}
          to={internalLink}
          className="collectionItem stylishLink"
          css={css}
        >
          {children}
        </Link>
      )
  }
}

export default LinkOrNotCollectionItem
