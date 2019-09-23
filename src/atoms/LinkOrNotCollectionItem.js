import React from 'react'
import Link from 'gatsby-link'

import { rhythm, scale } from '../utils/typography'

const LinkOrNotCollectionItem = ({
  blockOptionsData,
  collectionItem,
  children,
  passCSS,
  colors,
}) => {
  const { classicCombo, contrastCombo, funkyCombo, funkyContrastCombo } = colors

  const linkTo = blockOptionsData && blockOptionsData.linkTo
  const internalLink = collectionItem.path

  const optionsData = JSON.parse(collectionItem.options._json_)
  const externalLink = optionsData && optionsData.linkTo

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
          href={externalLink}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="collectionItem stylishLink"
          css={css}
        >
          {children}
        </a>
      )
      break
    case `none`:
      return (
        <div className="collectionItem" css={css}>
          {children}
        </div>
      )
      break
    case `page`:
    default:
      return (
        <Link
          to={internalLink}
          className="collectionItem stylishLink"
          css={css}
        >
          {children}
        </Link>
      )
  }
  // return linkToPage ? (
  //   <Link to={to} className="collectionItem stylishLink" css={css}>
  //     {children}
  //   </Link>
  // ) : (
  //   <div className="collectionItem" css={css}>
  //     {children}
  //   </div>
  // )
}

export default LinkOrNotCollectionItem
