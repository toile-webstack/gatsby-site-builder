const hasProperty = (prop, obj) =>
  Object.prototype.hasOwnProperty.call(obj, prop)

const isEmpty = obj => !Object.keys(obj)[0]

module.exports = {
  hasProperty,
  isEmpty,
}
