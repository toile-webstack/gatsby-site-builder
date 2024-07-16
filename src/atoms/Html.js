import React, { useMemo, useState } from 'react'
import parse from 'html-react-parser'
import obfuscateEmail from '../utils/emailObfuscate'

import {
  // replaceShortCodes,
  withSimpleLineBreaks,
  // protectEmail,
  // targetBlank,
} from '../utils/processHtml'

// import useRerenderOnHydrate from '../utils/useRerenderOnHydrate'

const ProtectedEmail = ({ children: innerRaw, ...attrs }) => {
  // const win = useRerenderOnHydrate()
  // TODO: account for query params in href
  const email = attrs.href.replace('mailto:', '')
  const { href, inner: innerComputed } = obfuscateEmail(email)
  const inner = innerRaw === email ? innerComputed : innerRaw
  const attributes = {
    target: '_blank',
    ...attrs,
    href,
  }
  const attributesStr = Object.entries(attrs).reduce((accu, [key, val]) => {
    return `${accu} ${key}="${val}"`
  }, '')
  const element = `<a ${attributesStr}>${inner}</a>`

  return (
    <span
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: element,
      }}
    />
  )

  // Old buggy implementation
  // const win = typeof window !== 'undefined'
  // return win ? <a {...attrs}>{children}</a> : <a> </a>
}

export default ({ html: htmlInput, passCSS, shortCodeMatchees, ...rest }) => {
  if (!htmlInput) return null
  const [h, setH] = useState()

  useMemo(() => {
    const html = withSimpleLineBreaks(htmlInput)
    setH(
      parse(html, {
        replace: domNode => {
          switch (true) {
            case domNode?.name === 'a' &&
              /^mailto:.+?/.test(domNode?.attribs?.href):
              return (
                <ProtectedEmail {...domNode?.attribs}>
                  {domNode.children[0].data}
                </ProtectedEmail>
              )
            case domNode?.name === 'p' &&
              /^<toile:/.test(domNode?.children[0]?.data): {
              const childString = domNode?.children[0]?.data
              const [__, matcher] = childString.split(/<toile:|>/)

              const Comp = shortCodeMatchees && shortCodeMatchees[matcher]
              return Comp
            }
            default:
              break
          }
        },
      })
    )
  }, [htmlInput])

  // let html = protectEmail(htmlInput)
  // html = withSimpleLineBreaks(html)
  // // html = targetBlank(html)
  // html = replaceShortCodes(html, shortCodeMatchees)

  return (
    <div
      {...rest}
      css={{
        width: `100%`,
        whiteSpace: `pre-line`,
        // whiteSpace: `pre-wrap`,
        ...passCSS,
      }}
      // dangerouslySetInnerHTML={{
      //   __html: html,
      // }}
    >
      {h || <p> </p>}
    </div>
  )
}
