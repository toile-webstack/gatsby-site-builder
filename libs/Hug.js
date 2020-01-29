// import { isValidElement } from 'react'

import { string, object } from 'json-templater' // https://www.npmjs.com/package/json-templater

import renderSchema from './render-schema'

// const Hug = ({ Markup, useData, data, components }) => {
//     const d = useData(data)
//     return Markup({ ...d })
//   }

// A Hug combines Data, Markup, Styles and Functionality.
const Hug = ({
  Markup, // The markup described as a JSON object. Can have {{variables}} to be replaced by data.
  // Markup can be a React component, then we pass the data in and don't need to parse
  components, // An object of named components to be used in the markup. Classic html elements do nt have to be passed on.
  data: rawData = {}, // The data needed to fill in the slots
  useData, // TO DO: functions to be used on slot values. E.g. {{html:longText}} will use the html function to parse the `longText` data field
  children,
}) => {
  const d = {
    ...(useData ? useData(rawData) : rawData),
    ...(children && { children }),
  }

  //   if (isValidElement(Markup) || typeof Markup === 'function') {
  if (typeof Markup === 'function') {
    return Markup({ ...d })
  }

  const schema = object(Markup, d, (value, data, key) => {
    // Handler function gets three arguments:
    //    value: value which is about to be handled
    //    data: initial template data object
    //    key: key corresponding to the value

    return string(value, data /* , functions */)
  })

  return renderSchema({
    schema,
    library: components,
    children,
  })
  // TODO: use unifiedJS or mobiledoc (transform schema into the correct format)
}

export default Hug
