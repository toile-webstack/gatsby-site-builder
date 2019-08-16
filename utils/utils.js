const slugify = require("slugify")

const createPath = path => {
  return slugify(path, {
    replacement: "-",
    remove: /[$*_+~.()'"!\:@?]/g,
    lower: true
  })
}

module.exports = { createPath }

// const mapStyle = obj => {
//   if (Object.keys(obj).length < 1) return obj
//
//   Object.keys(obj).forEach((objKey, i, keysArray) => {
//     // console.log(typeof obj[objKey])
//     if (typeof obj[objKey] === "object") {
//       // check if sub object name starts with " "
//       if (objKey.substring(0, 1) !== " ") {
//         obj[` ${objKey}`] = obj[objKey]
//         delete obj[objKey]
//         // recursively call mapStyle on sub sub objects...
//         mapStyle(obj[` ${objKey}`])
//       } else {
//         mapStyle(obj[objKey])
//       }
//     }
//   })
//   return obj
// }
// module.exports = { createPath, mapStyle }
