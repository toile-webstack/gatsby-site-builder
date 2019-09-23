// TODO: Extract in a plugin

import { rhythm, scale } from "./typography"

const mapStyle = style => {
  if (Object.keys(style).length < 1) return style

  let processedStyle = scaleAndRhythm(style)

  Object.keys(processedStyle).forEach((objKey, i, keysArray) => {
    if (typeof processedStyle[objKey] === "object") {
      // check if sub object name starts with " " or "@" or ":"
      if (objKey.substring(0, 1).match(/ |:|@|&|>/)) {
        processedStyle[objKey] = mapStyle(style[objKey])
      } else {
        processedStyle[` ${objKey}`] = processedStyle[objKey]
        delete processedStyle[objKey]
        // recursively call mapStyle on sub sub objects...
        processedStyle[` ${objKey}`] = mapStyle(style[` ${objKey}`])
      }
      // processedStyle[objKey] = mapStyle(style[objKey])
    }
  })
  return processedStyle
}
export { mapStyle }

const scaleAndRhythm = style => {
  if (Object.keys(style).length < 1) return style

  let processedStyle = style
  // replace the "scale" property with Typography scale
  if (processedStyle.scale) {
    let scaleParams = eval(processedStyle.scale)
    scaleParams = scale(scaleParams)
    delete processedStyle.scale
    processedStyle = { ...scaleParams, ...processedStyle }
  }

  Object.keys(processedStyle).forEach((objKey, i, keysArray) => {
    if (
      typeof processedStyle[objKey] === `string` &&
      processedStyle[objKey].match(/rhythm/)
    ) {
      if (processedStyle[objKey][0] === `-`) {
        let val = processedStyle[objKey].substring(
          8,
          processedStyle[objKey].length - 1
        )
        val = eval(val)
        val = rhythm(val)
        processedStyle[objKey] = `-${val}`
      } else {
        let val = processedStyle[objKey].substring(
          7,
          processedStyle[objKey].length - 1
        )
        val = eval(val)
        val = rhythm(val)
        processedStyle[objKey] = val
      }
    }
  })
  return processedStyle
}
export { scaleAndRhythm }
