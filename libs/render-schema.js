/* eslint-disable no-use-before-define */

import { Fragment } from 'react'
import { jsx } from '@emotion/core'
// import * as CoreLibrary from '../../components'
// import { Short, Long, Image, BgImage, LayoutGlobal, List, Main, Page, Section, Layouts }
// import { spreadCss } from '..'

const hasProperty = (prop, obj) =>
  Object.prototype.hasOwnProperty.call(obj, prop)

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
// const randomKey = () => Math.random()

// NOTE: WEAK
const isReactElem = level =>
  Boolean(level && typeof level === 'object' && level.$$typeof)
// NOTE: better
// if (React.isValidElement(result) && !result.props.hasOwnProperty('key')) {
//   return React.cloneElement(result, { key: String(key) })
// }
const isElem = level =>
  level &&
  typeof level === 'object' &&
  (hasProperty('children', level) ||
    hasProperty('component', level) ||
    hasProperty('tag', level) ||
    hasProperty('css', level))
// const isFunction = level => typeof level === 'function'
const isArray = level => Array.isArray(level)
// const isNamedList = level =>
//   level && typeof level === 'object' && !isElem(level)
// const isList = level => isArray(level) || isNamedList(level)

// ----------------------------------------------------------------------------
// RENDER SCHEMA
// ----------------------------------------------------------------------------
const renderSchema = ({
  // to allow any way to pass the schema with or without other parameters and with nested schema prop
  schema,
  createElement = jsx,
  library,
}) => {
  const Lib = {
    //   ...CoreLibrary,
    ...library,
  }
  const determineComponent = ({ component: comp, tag }) => {
    const compFromLib = !!Lib && !!comp && Lib[comp]
    // if (!compFromLib)
    //   // eslint-disable-next-line no-console
    //   console.log(`component is not in Lib: `, comp && comp.name)

    return compFromLib || comp || tag || 'div'
  }
  // const determineComponent = comp => {
  //   const tc = typeof comp
  //   // eslint-disable-next-line no-console
  //   console.log(tc)
  //   if (!!Lib && tc === 'string' && Lib[comp]) {
  //     return Lib[comp]
  //   }
  //   if (tc === 'object' && comp.componentFromObject) {
  //     // eslint-disable-next-line no-console
  //     console.log(comp)
  //     return renderElement(comp.componentFromObject)
  //   }
  //
  //   return comp || 'div'
  // }

  // ----------------------------------------------------------------------------
  // Renderers
  // ----------------------------------------------------------------------------
  const renderElement = ({ component, children, css, ...props }) => {
    const { key, id, tag /* title, text, value, name */ } = props || {}
    const Comp = determineComponent({ component, tag })
    // if (typeof Comp === 'function') {
    //   // eslint-disable-next-line no-console
    //   // console.log(Comp.name)
    //   // TODO: find a way to only call renderSchema once so we have the whole lib
    //   // In that case children are functions and we can spread the result of running that function
    // }
    // const key = () => {
    //   const { key: k, name, tag, className, src, id } = props || {}
    //   return k || `${name || ''}${tag || ''}`
    // }

    const altKey = () => {
      if (typeof component === 'string') {
        return component
      }
      if (typeof component === 'function') {
        return component.name || component.toString()
      }
      return JSON.stringify(props)
    }
    // : [title, text, value, name, tag, Comp.name]
    //     .filter(v => v)
    //     .map(v => (v.length > 30 ? v.substring(v.length - 30) : v))
    //     .join('')
    // NOTE: We could just stringify props (or the 5 first attr)...?
    // TODO: Weak and hard to debug for end user. Use DB ids when we have
    // Moreover, if one of those values change dynamicaly, we wil rerender
    // NOTE: Use this if to find elements where altKey is used
    // if (!(key || id) && props.length) {
    //   // eslint-disable-next-line no-console
    //   console.error(`using fallback key in array element ${Comp.name}`)
    // }
    // ------------------------------------------------------------------------

    return createElement(
      Comp,
      {
        // NOTE: not a good id to provide random key because of optimization. React will rerender unnecerely
        key: key || id || altKey(),
        // createElement, Not ok to pass props that react does not recognize because we create components on the fly
        // we should think of prviding some common functions or values to all comps (with a context provider ??)
        // ...spreadCss(css),
        ...props,
      },
      children ? dispatchToRender(children) : null,
    )
  }

  const renderArray = array => array.map(s => dispatchToRender(s))

  // const renderNamedList = list =>
  //   list
  //     ? Object.entries(list).map(([component, rest]) => {
  //         if (!component) {
  //           // eslint-disable-next-line no-console
  //           console.error('component of named list is falsy. list: ', list)
  //           return null
  //         }
  //         const tr = typeof rest
  //         if (isArray(rest) || isNamedList(rest) || tr === 'string') {
  //           return renderElement({ component, children: rest })
  //         }
  //         if (tr === 'object') {
  //           return dispatchToRender({ component, ...rest })
  //         }
  //
  //         // eslint-disable-next-line no-console
  //         console.error(
  //           'rest of named list is not an elem or a list. rest: ',
  //           rest,
  //           'list: ',
  //           list,
  //         )
  //
  //         return null
  //       })
  //     : null

  // ----------------------------------------------------------------------------
  // dispatcher
  // ----------------------------------------------------------------------------
  const dispatchToRender = (something, isFirstIteration) => {
    // ------------------------------------------------------------------------
    // Element could be
    // - A React Element (meaning that we don't need to `createElement`. It is already done)
    // - A function == A Component
    // - A string that reveals a component from lib OR an HTML tag
    // - An object representing a component
    // Element could NOT be
    // - A random string (but children can)
    // - A list == Array OR Named List (but children can)
    // ------------------------------------------------------------------------
    const t = typeof something

    if (!something) return null

    if (isReactElem(something)) return something

    if (t === 'function') return renderElement({ component: something })

    if (isElem(something)) return renderElement(something)

    if (t === 'string') {
      // NOTE: Don't do that. If the string correspond to the name of a LibComp, then it will render de comp even if it sould not.
      // We dispatch from the 'children' prop so it we should not pass a component directly without wrapping it in an obj with 'component' prop
      // const LibComp = Lib && Lib[something]
      // if (LibComp) {
      //   return renderElement({ component: LibComp })
      // }
      if (isFirstIteration) {
        return renderElement({ component: 'span', children: something })
      }
      return something
    }

    // NOTE: this only concerns objects and arrays. That is why we check it here
    if (isFirstIteration)
      return renderElement({ component: Fragment, children: something })

    if (isArray(something)) return renderArray(something)

    // we already check that something is not an elem so any object is considered a NamedList
    // if (t === 'object') return renderNamedList(something)

    // eslint-disable-next-line no-console
    console.error(
      'unhandled case in dispatchToRender. something: ',
      something,
      'schema: ',
      schema,
    )

    return null
  }

  return dispatchToRender(schema, true)
}

export default renderSchema
