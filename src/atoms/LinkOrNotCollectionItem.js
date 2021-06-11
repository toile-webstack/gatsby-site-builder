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

  const { linkTo, linkText, linkInNewTab } = blockOptionsData || {}
  const internalLink = collectionItem.path

  const externalLink = optionsData && optionsData.linkTo
  const { lang } = optionsData

  const { props: userProps } = blockOptionsData

  const cssBlock = {
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
    ...passCSS,
    // ...colors[classicCombo].style,
    // ...styleData
  }

  const cssBlockLink = {
    display: `flex`,
    flexFlow: `row wrap`,
    justifyContent: `center`,
    ...cssBlock,
    ':hover': {
      ...colors[linkTo === `none` ? classicCombo : funkyCombo].style,
      color: `${colors[linkTo === `none` ? classicCombo : funkyCombo].body}!important`,
    },
  }
  const cssLinkInBlock = {
    ...colors[linkTo === `none` ? classicCombo : funkyCombo].style,
  }

  switch (linkTo) {
    case `external`:
      return linkText ? (
        <div className="collectionItem" css={cssBlock}>
          {children}
          <a
            {...{ ...(lang && { lang }) }}
            href={externalLink}
            // target="_blank"
            {...{ ...(linkInNewTab === false ? {} : { target: '_blank' }) }}
            rel="nofollow noopener noreferrer"
            // className="stylishLink"
            css={cssLinkInBlock}
            {...userProps}
          >
            {linkText}
          </a>
        </div>
      ) : (
        <a
          {...{ ...(lang && { lang }) }}
          href={externalLink}
          // target="_blank"
          {...{ ...(linkInNewTab === false ? {} : { target: '_blank' }) }}
          rel="nofollow noopener noreferrer"
          className="collectionItem stylishLink"
          css={cssBlockLink}
          {...userProps}
        >
          {children}
        </a>
      )
    case `none`:
      return (
        <div
          {...{ ...(lang && { lang }) }}
          className="collectionItem"
          css={cssBlock}
          {...userProps}
        >
          {children}
        </div>
      )
    case `page`:
    default:
      const LinkComp = localProps =>
        linkInNewTab ? (
          <a
            // className="stylishLink"
            {...{
              href: internalLink,
              ...(lang && { lang }),
              ...(linkInNewTab === false ? {} : { target: '_blank' }),
              rel: 'nofollow noopener noreferrer',
              ...localProps,
              ...userProps,
            }}
          ></a>
        ) : (
          <Link
            {...{
              to: internalLink,
              ...(lang && { lang }),
              ...localProps,
              ...userProps,
            }}
          ></Link>
        )

      return linkText ? (
        <div className="collectionItem" css={cssBlock}>
          {children}
          <LinkComp css={cssLinkInBlock}>{linkText}</LinkComp>
        </div>
      ) : (
        <LinkComp className="collectionItem stylishLink" css={cssBlockLink}>
          {children}
        </LinkComp>
      )
  }
}

export default LinkOrNotCollectionItem
