import React from 'react'
import { Link as GatsbyLink, navigate } from 'gatsby'

// TODO: should create own function that uses gatsby's navigate or window.open(`https://url`, '_blank') if external link
export { navigate }

// Since DOM elements <a> cannot receive activeClassName,
// destructure the prop here and pass it only to GatsbyLink
export const LinkSmart = ({
  text,
  children = text,
  href,
  target = '_blank',
  rel,
  // Gatsby Link props
  to = href,
  activeStyle,
  activeClassName,
  partiallyActive,
  getProps,
  state,
  replace,
  // end
  ...props
}) => {
  if (!to) {
    return text || children || null
  }
  // Tailor the following test to your environment.
  // This example assumes that any internal link (intended for Gatsby)
  // will start with exactly one slash, and that anything else is external.
  const isInternal = /^\/(?!\/)/.test(to)
  const isExternal = /^(http|www)/.test(to)
  // const isScroll = /^#/.test(to) // Does not work. Leads to infinite loop or memory leak on dev server
  const isMailto = /^mailto/.test(to)
  const isFile = /\.[0-9a-z]+$/i.test(to) && !isMailto
  const isSSR = typeof window === 'undefined'

  // if (isScroll) {
  //   return <Link {...{ to, ...props }}>{text || children}</Link>
  // }

  if (isFile) {
    return (
      <a {...{ href: to, target, ...(rel && { rel }), ...props }}>{children}</a>
    )
  }
  if (isExternal) {
    return (
      <a
        {...{
          href: to,
          target,
          rel: rel || 'noopener noreferrer',
          ...props,
        }}
      >
        {children}
      </a>
    )
  }
  // Use Gatsby Link for internal links, and <a> for others
  const gatsbyLinkProps = {
    to,
    activeStyle,
    activeClassName,
    partiallyActive,
    getProps,
    state,
    replace,
  }
  if (isInternal) {
    return (
      <GatsbyLink {...{ ...gatsbyLinkProps, ...props }}>{children}</GatsbyLink>
    )
  }

  return isMailto && isSSR ? null : (
    <a {...{ href: to, ...props }}>{children}</a>
  )
}

export const LinkWrapper = ({
  tag: Tag,
  to,
  text,
  children = text,
  download,
  href,
  hrefLang,
  media,
  ping,
  rel,
  target,
  type,
  ...props
}) => {
  const commonLinkProps = {
    ...(to && { to }),
    ...(download && { download }),
    ...(href && { href }),
    ...(hrefLang && { hrefLang }),
    ...(media && { media }),
    ...(ping && { ping }),
    ...(rel && { rel }),
    ...(target && { target }),
    ...(type && { type }),
  }

  // If it is not a link, should only return a wrapper
  // We use this if we don't know if a component (e.g. an article)
  // should link to a page or not
  if (!to && !href) {
    const Comp = Tag || 'div'
    return (
      <Comp
        {...{
          ...(children && { children }),
          ...props,
        }}
      />
    )
  }

  // otherwise, render the tag inside the link
  // we us this if we are not sure if we will need something else than a 'a' tag
  return Tag ? (
    <LinkSmart {...commonLinkProps}>
      <Tag
        {...{
          ...(children && { children }),
          ...props,
        }}
      />
    </LinkSmart>
  ) : (
    <LinkSmart
      {...{
        ...commonLinkProps,
        children,
        ...props,
      }}
    />
  )
}

export default GatsbyLink
