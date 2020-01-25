import React, { useMemo, useState } from 'react'
import parse from 'html-react-parser'

import {
  // replaceShortCodes,
  withSimpleLineBreaks,
  // protectEmail,
  // targetBlank,
} from '../utils/processHtml'

// import useRerenderOnHydrate from '../utils/useRerenderOnHydrate'

const ProtectedEmail = ({ children, ...attrs }) => {
  // const win = useRerenderOnHydrate()
  const win = typeof window !== 'undefined'
  return win ? <a {...attrs}>{children}</a> : <a> </a>
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
