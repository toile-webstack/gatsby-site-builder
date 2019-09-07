import React from "react";
import GatsbyLink from "gatsby-link";

// import { renderSchema } from '../core/functions'

// Since DOM elements <a> cannot receive activeClassName,
// destructure the prop here and pass it only to GatsbyLink
const Link = ({
  children,
  to,
  tag: Tag = "div",
  activeClassName,
  ...props
}) => {
  if (!to) {
    return <Tag {...props}>{children}</Tag>;
  }
  // Tailor the following test to your environment.
  // This example assumes that any internal link (intended for Gatsby)
  // will start with exactly one slash, and that anything else is external.
  const isInternal = /^\/(?!\/)/.test(to);
  const isMailto = /^mailto/.test(to);
  const isFile = /\.[0-9a-z]+$/i.test(to) && !isMailto;
  const isSSR = typeof window === "undefined";

  if (isFile) {
    return <a {...{ href: to, ...props, target: "_blank" }}>{children}</a>;
  }
  // Use Gatsby Link for internal links, and <a> for others
  if (isInternal) {
    return (
      <GatsbyLink
        {...{
          to,
          // activeClassName, // Not yet in gatsby v1 Link
          ...props
        }}
      >
        {children}
      </GatsbyLink>
    );
  }
  return isMailto && isSSR ? null : (
    <a {...{ href: to, ...props, target: "_blank" }}>{children}</a>
  );
};

export default Link;

// export default ({children, to, activeClassName, ...other}) => {
//   const isInternal = /^\/(?!\/)/.test(to)
//   const isMailto = /^mailto/.test(to)
//   const isFile = /\.[0-9a-z]+$/i.test(to) && !isMailto
//   const isSSR = typeof window === 'undefined'
//
//   let schema = {}
//   if (isFile) {
//     schema = {
//       component: 'a',
//       href: to,
//       target: '_blank',
//       ...other,
//       children,
//     }
//   }
//   // Use Gatsby Link for internal links, and <a> for others
//   if (isInternal) {
//     schema = {
//       component: GatsbyLink,
//       to,
//       activeClassName,
//       ...other,
//       children
//     }
//   }
//   if (!(isMailto && isSSR)) {
//     schema = {
//       component: 'a',
//       href: to,
//       target: '_blank',
//       ...other,
//       children
//     }
//   }
//
//   return renderSchema({
//     schema
//   })
// }
