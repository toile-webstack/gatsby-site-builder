// TODO: Extract in a plugin
import ReactDOMServer from 'react-dom/server'

// import SocialIcons from "../atoms/SocialIcons";
// import ContactInfos from "../atoms/ContactInfos";
// import Attribution from "../atoms/Attribution";

// find labels ( <<...>> ) inside html.
const replaceShortCodes = (htmlString, shortCodeMatchees) => {
  // const codeRegex = /\<\<.+\>\>/
  const codeRegex = /&#x3C;toile:.+?>/g
  let newHtml = htmlString
  // Place all shortcodes in an array
  const shortCodes = htmlString.match(codeRegex)
  if (shortCodes) {
    shortCodes.forEach(sc => {
      const [a, matcher] = sc.split(/&#x3C;toile:|>/)

      const compString =
        shortCodeMatchees &&
        shortCodeMatchees[matcher] &&
        ReactDOMServer.renderToStaticMarkup(shortCodeMatchees[matcher])

      if (compString) {
        newHtml = newHtml.replace(sc, compString)
      }
    })
    // Values is the mirror of shortCodes with the values to be used instead of the shortCodes
    // let values = []
    // values = shortCodes.map(shortCode => {
    //   let value = shortCode.substring(2, shortCode.length - 2)
    //   // Check if shortcode is an email address
    //   if (isEmail(value)) {
    //     value = replaceEmail(value)
    //   }
    //   // Directly replace in the HTML string
    //   newHtml = newHtml.replace(shortCode, value)
    //   return value
    // })
  }
  return newHtml
}

// const isEmail = string => {
//   const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
//   if (string.match(regex)) {
//     return true
//   } else {
//     return false
//   }
// }
//
// const replaceEmail = email => {
//   return typeof window !== "undefined"
//     ? `<a href=mailto:${email} target="_top">${email}</a>`
//     : ""
// }

export { replaceShortCodes }

// TODO: Find a better solution for this
// rip off new lines if after a block html tag
const withSimpleLineBreaks = htmlString => {
  // Matches the ending tag and \n e.g. "</h2>\n"
  const codeRegex = new RegExp('[A-Za-z_0-9]+?>\\n', 'g')
  const regexForInlineElems = /strong\>|em\>|a\>|small\>|code\>/
  let newHtml = htmlString
  newHtml = newHtml.replace(codeRegex, match => {
    if (match.match(regexForInlineElems)) {
      // Dont remove \n if it is an inline elem
      return match
      // } else if (match.match(regexForInlineElems)) {
      //   // Strange \n at beginning of ul
      //   return match.substring(0, match.length - 1)
    } else {
      return match.substring(0, match.length - 1)
    }
  })
  return newHtml
}
export { withSimpleLineBreaks }

const protectEmail = htmlString => {
  const win = typeof window !== 'undefined'
  const codeRegex = new RegExp('<a href="mailto:.+?</a>', 'g')
  let newHtml = htmlString
  // const matches = newHtml.match(codeRegex)
  newHtml = newHtml.replace(codeRegex, match => {
    return win ? match : ''
  })
  return newHtml
}
export { protectEmail }

const targetBlank = htmlString => {
  const codeRegex = new RegExp('<a href="http.+?</a>', 'g')
  const targetAttr = ` target="_blank" rel="noopener noreferrer"`
  let newHtml = htmlString
  // const matches = newHtml.match(codeRegex)
  newHtml = newHtml.replace(codeRegex, match => {
    return [match.slice(0, 2), targetAttr, match.slice(2)].join('')
  })
  return newHtml
}
export { targetBlank }

const processHtml = (h, shortCodeMatchees, isWindow) => {
  let html = protectEmail(h, isWindow)
  html = withSimpleLineBreaks(html)
  // html = targetBlank(html)
  html = replaceShortCodes(html, shortCodeMatchees)
  return html
}

export default processHtml
