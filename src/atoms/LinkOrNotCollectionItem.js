import React from 'react'
// import { Link } from 'gatsby'
import { LinkWrapper } from './Link'

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

  const { linkTo: linkToGlobal } = blockOptionsData || {}
  // in blockRef, linkTo can be 'none', 'external', 'page' (default)
  const noLink = linkToGlobal === `none`
  const linkIsExternal = linkToGlobal === `external`

  const internalLink = noLink ? null : collectionItem.path
  const { linkTo: externalLink, lang } = optionsData
  const to = linkIsExternal ? externalLink : internalLink

  const className = `collectionItem${noLink ? '' : ' stylishLink'}`
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
      ...colors[noLink ? classicCombo : funkyCombo].style,
      color: `${colors[noLink ? classicCombo : funkyCombo].body}!important`,
    },
    ...passCSS,
    // ...colors[classicCombo].style,
    // ...styleData
  }

  return (
    <LinkWrapper
      {...{
        ...(lang && { lang }),
        to,
        className,
        css,
      }}
    >
      {children}
    </LinkWrapper>
  )

  // switch (linkToGlobal) {
  //   case `external`:
  //     return (
  //       <a
  //         {...{ ...(lang && { lang }) }}
  //         href={externalLink}
  //         target="_blank"
  //         rel="nofollow noopener noreferrer"
  //         className="collectionItem stylishLink"
  //         css={css}
  //       >
  //         {children}
  //       </a>
  //     )
  //   case `none`:
  //     return (
  //       <div
  //         {...{ ...(lang && { lang }) }}
  //         className="collectionItem"
  //         css={css}
  //       >
  //         {children}
  //       </div>
  //     )
  //   case `page`:
  //   default:
  //     return (
  //       <Link
  //         {...{ ...(lang && { lang }) }}
  //         to={internalLink}
  //         className="collectionItem stylishLink"
  //         css={css}
  //       >
  //         {children}
  //       </Link>
  //     )
  // }
}

export default LinkOrNotCollectionItem
