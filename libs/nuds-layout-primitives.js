/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useEffect, useState, useRef } from 'react'
import useResizeObserver from './useResizeObserver'

export const useGridObserver = ({ min, defaultWidth, defaultHeight } = {}) => {
  const { ref, width, height, hasSupport } = useResizeObserver({
    min,
    defaultWidth,
    defaultHeight,
  })
  const minToPixels = useRef(null)
  const [isWide, setIsWide] = useState(false)

  useEffect(() => {
    const element = ref.current

    // Create a proxy element to measure and convert
    // the `min` value (which might be em, rem, etc) to `px`
    const test = document.createElement('div')
    test.style.width = min
    element.appendChild(test)
    minToPixels.current = test.offsetWidth
    element.removeChild(test)
    setIsWide(width > parseInt(minToPixels.current, 10))
  }, [ref.current])

  return { ref, width, height, isWide, hasSupport }
}

// usefull to pass an array of values.
// Mostly in case custom css properties are not supported.
const mapIfArray = (val, stringFunc) => {
  return Array.isArray(val) ? val.map(v => stringFunc(v)) : stringFunc(val)
}
const groupTwoParams = (main, second) => {
  return Array.isArray(main)
    ? main.map((m, i) => {
        return {
          main: m,
          second: Array.isArray(second) ? second[i] || second[0] : second,
        }
      })
    : {
        main,
        second: Array.isArray(second) ? second[0] : second,
      }
}

export const layoutStyles = {
  stack: ({
    space = ['1rem', 'var(--s0, 1rem)'], // The space (margin) between successive sibling elements
    recursive = false, // Whether the spaces apply recursively (i.e. regardless of nesting level)
    splitAfter = null, // The element index after which to split the stack. Leave empty for no splitting
    horizontal = false, // To make it flow horizontally and not wrapping.
  } = {}) => {
    const marginStart = horizontal ? 'marginLeft' : 'marginTop'
    const marginEnd = horizontal ? 'marginRight' : 'marginBottom'
    return {
      display: 'flex',
      flexDirection: horizontal ? 'row' : 'column',
      justifyContent: 'flex-start',
      [recursive ? ' *' : '> *']: {
        [marginStart]: 0,
        [marginEnd]: 0,
      },
      [recursive ? ' * + *' : '> * + *']: {
        [marginStart]: space,
      },
      ...(typeof splitAfter === 'number' && {
        [`> :nth-child(${splitAfter})`]: {
          [marginEnd]: 'auto',
        },
      }),
    }
  },

  box: ({
    padding = ['1rem', 'var(--s0, 1rem)'], // The amount by with the Box is padded on all sides
    borderWidth = '0', // The width of the (solid) border. If empty or 0, the transparent outline is instated for high contrast mode
  } = {}) => ({
    display: 'block',
    padding,
    borderWidth,
    borderStyle: 'solid',
    // color: "var(--color-dark)",
    // backgroundColor: "var(--color-light)",
    ...(!borderWidth && {
      /* ↓ For high contrast mode */
      outline: mapIfArray(borderWidth, bw => `${bw} solid transparent`),
      outlineOffset: mapIfArray(borderWidth, bw => `calc(${bw} * -1)`),
    }),

    // " *": {
    //   color: "inherit",
    // },
  }),

  center: ({
    maxWidth = ['65ch', 'var(--measure, 65ch)'], // The maximum width of the centered element
    andText = false, // Whether to apply text-align: center too
    gutters = 0, // The minimum space on either side of the content
    intrinsic = false, // Center child elements based on their content width. e.g. center a button
  }) => ({
    display: 'block',
    boxSizing: 'content-box',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth,
    ...(andText && { textAlign: 'center' }),
    ...(gutters && {
      paddingLeft: gutters,
      paddingRight: gutters,
    }),
    ...(intrinsic && {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }),
  }),

  cluster: ({
    justifyContent = 'center', // The justify-content value (for horizontal alignment)
    alignItems = 'center', // The align-items value (for vertical alignment)
    alignContent = 'stretch', // The align-content value (for vertical alignment)
    space = ['1rem', 'var(--s0, 1rem)'], // The space (margin) between each of the clustered elements
  } = {}) => ({
    overflow: 'hidden',
    '> *': {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent,
      alignItems,
      alignContent,
      margin: mapIfArray(space, s => `calc(${s} / 2 * -1)`),
      '> *': {
        margin: mapIfArray(space, s => `calc(${s} / 2)`),
      },
    },
  }),

  sidebar: ({
    side = 'left', // Whether the sidebar element is the :last-child or :first-child
    sideWidth = null, // The width of the sidebar (empty means not set; defaults to the content width)
    contentMin = '50%', // The narrowest the content (main) element can be before wrapping. Should be a percentage.
    space = ['1rem', 'var(--s0, 1rem)'], // The space (margin) between the sidebar and non-sidebar
    noStretch = false, // Make the adjacent elements adopt their natural height
  } = {}) => {
    // g is groupedArrayForMinWidth
    const g = groupTwoParams(space, contentMin)

    return {
      overflow: 'hidden',
      '> *': {
        display: 'flex',
        flexWrap: 'wrap',
        margin: mapIfArray(space, s => `calc(${s} / 2 * -1)`),
        ...(noStretch && { alignItems: 'flex-start' }),
      },
      '> * > *': {
        margin: mapIfArray(space, s => `calc(${s} / 2)`),
        flexGrow: 1,
        ...(sideWidth && { flexBasis: sideWidth }),
      },
      [side === 'right' ? '> * > :first-child' : '> * > :last-child']: {
        flexBasis: 0,
        flexGrow: 999,
        // minWidth: `calc(${contentMin} - ${space})`,
        minWidth: mapIfArray(g, o => `calc(${o.second} - ${o.main})`),
      },
    }
  },

  switcher: ({
    treshold = ['30ch', 'calc(var(--measure, 65ch) / 2)'], // The container width at which the component switches between a horizontal and vertical layout
    space = ['1rem', 'var(--s0, 1rem)'], // The space (margin) between the (child) elements
    limit = 4, // The maximum number of elements allowed to appear in the horizontal configuration
  } = {}) => {
    const g = groupTwoParams(treshold, space)
    return {
      display: 'block',
      '> *': {
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
        margin: mapIfArray(space, s => `calc(${s} / 2 * -1)`),
      },
      '> * > *': {
        flexBasis: mapIfArray(
          g,
          o => `calc((${o.main} - (100% - ${o.second})) * 999)`
        ),
        flexGrow: 1,
        margin: mapIfArray(space, s => `calc(${s} / 2)`),
      },
      [`& > * > :nth-last-child(n + ${limit +
        1}), & > * > :nth-last-child(n + ${limit + 1}) ~ *`]: {
        flexBasis: '100%',
      },
    }
  },

  cover: ({
    centered = 'h1', // The element that should be towards the vertical center of the space. Identify with a simple selector like h2 or .centered
    space = ['1rem', 'var(--s0, 1rem)'], // The minimum space between and around the child elements
    minHeight = '100vh', // The minimum height of the parent element, before it grows to accommodate its content
    noPad = false, // Whether to remove the padding from the parent element
  } = {}) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight,
    ...(!noPad && { padding: space }),
    '> *': {
      marginTop: space,
      marginBottom: space,
    },
    [`> :first-child:not(${centered})`]: {
      marginTop: 0,
    },
    [`> : last - child: not(${centered})`]: {
      marginBottom: 0,
    },
    [`> ${centered}`]: {
      marginTop: 'auto',
      marginBottom: 'auto',
    },
  }),

  grid: ({
    min = '250px', // A CSS length value representing x in minmax(min(x, 100%), 1fr)
    space = ['1rem', 'var(--s0, 1rem)'], // The space (grid-gap) between the grid children / cells
    applyAnyway = false,
    flexboxInstead,
    flexBasis,
  } = {}) => {
    const gtc = {
      gridTemplateColumns: mapIfArray(
        min,
        m => `repeat(auto-fill, minmax(${m}, 1fr))`
      ),
    }

    return flexboxInstead
      ? {
          overflow: 'hidden',
          '> *': {
            display: 'flex',
            flexWrap: 'wrap',
            margin: mapIfArray(space, s => `calc(${s} / 2 * -1)`),
            '> *': {
              flex: `1 1`,
              flexBasis: flexBasis || min,
              margin: mapIfArray(space, s => `calc(${s} / 2)`),
            },
          },
        }
      : {
          display: 'grid',
          gridGap: space,
          alignContent: 'start',
          gridTemplateColumns: '100%',
          '&.aboveMin': {
            // TODO: this depends on the observer function
            ...gtc,
          },
          // BEST CASE SCENARIO
          // the min() function has limited support but allows this to work without JS
          [`@supports (width: min(${min[0] || min}, 100%))`]: {
            gridTemplateColumns: mapIfArray(
              min,
              m => `repeat(auto-fit, minmax(min(${m}, 100%), 1fr))`
            ),
          },
          ...(applyAnyway && gtc),
        }
  },

  frame: ({
    ratio = '16/9', // The element's aspect ratio
  } = {}) => {
    return {
      display: 'block',
      position: 'relative',
      paddingBottom: mapIfArray(ratio, r => {
        const [num, den] = r.split('/')
        return `calc(${den} / ${num} * 100%)`
      }),
      '& > *': {
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      '& > img, & > video': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
    }
  },

  ratio: ({
    ratio = '16/9', // The element's aspect ratio
  }) => ({
    position: 'relative',
    '& > :first-child': {
      width: '100%',
    },
    '& > img': {
      height: 'auto',
    },
    '&::before': {
      content: '""',
      display: 'block',
      paddingBottom: mapIfArray(ratio, r => {
        const [num, den] = r.split('/')
        return `calc(100% / (${den} / ${num}))`
      }),
    },
    '& > :first-child': {
      position: 'absolute',
      top: '0',
      left: '0',
      height: '100%',
    },
  }),

  // TODO: Javascript observer for scrollbar ?
  // TODO: ? implement background attachment local for affordance. http://lea.verou.me/2012/04/background-attachment-local/
  reel: ({
    itemWidth = 'auto', // The width of each child element
    height = 'auto', // The height of the parent (Reel) element
    space = ['1rem', 'var(--s0, 1rem)'], // The space between each child element, and between the child elements and the scrollbar
    noBar = false, // Whether to display the scrollbar
    trackColor = 'currentcolor',
    thumbColor = 'white',
    noJS = false, // Wether the observer has been setup to manage the "overflowing" classname
  } = {}) => {
    const g = groupTwoParams(thumbColor, trackColor)

    return {
      display: 'flex',
      height,
      overflowX: 'auto',
      overflowY: 'hidden',
      ...(noBar && {
        scrollbarWidth: 'none',
      }),

      '& > *': {
        // flex: mapIfArray(itemWidth, iw => `0 0 ${iw}`),
        flex: '0 0',
        flexBasis: itemWidth,
      },
      '& > img, & > .img, & > .image': {
        height: '100%',
        flexBasis: 'auto',
        width: 'auto',
      },
      '& > * + *': {
        marginLeft: space,
      },

      [noJS ? '&' : '&.overflowing']: {
        // if we setup the observer, className will change
        ...(!noBar && {
          paddingBottom: space,
        }),
      },

      '&::-webkit-scrollbar': {
        height: '1rem',
        ...(noBar && {
          display: 'none',
        }),
      },

      scrollbarColor: mapIfArray(g, o => `${o.main} ${o.second}`),
      '&::-webkit-scrollbar-track': {
        backgroundColor: trackColor,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: trackColor,
        backgroundImage: mapIfArray(
          g,
          o =>
            `linear-gradient(${o.second} 0, ${o.second} 0.25rem, ${o.main} 0.25rem, ${o.main} 0.75rem, ${o.second} 0.75rem)`
        ),
      },
    }
  },
}

export default layoutStyles

// ---------------COMPONENTS------------------- //

const jsxHelper = ({ children, layoutProps, layoutComp, as, css, ...props }) =>
  jsx(
    as || 'div',
    {
      css: [{ ...layoutStyles[layoutComp](layoutProps) }, css],
      'data-layout-primitive': layoutComp,
      ...props,
    },
    children
  )

export const Stack = ({ space, recursive, splitAfter, horizontal, ...rest }) =>
  jsxHelper({
    layoutComp: 'stack',
    layoutProps: {
      space,
      recursive,
      splitAfter,
      horizontal,
    },
    ...rest,
  })

export const Box = ({ padding, borderWidth, ...rest }) =>
  jsxHelper({
    layoutComp: 'box',
    layoutProps: {
      padding,
      borderWidth,
    },
    ...rest,
  })

export const Center = ({ maxWidth, andText, gutters, intrinsic, ...rest }) =>
  jsxHelper({
    layoutComp: 'center',
    layoutProps: {
      maxWidth,
      andText,
      gutters,
      intrinsic,
    },
    ...rest,
  })

export const Cluster = ({
  children,
  css,
  justifyContent,
  alignItems,
  alignContent,
  space,
  ...rest
}) =>
  jsxHelper({
    layoutComp: 'cluster',
    layoutProps: {
      justifyContent,
      alignItems,
      alignContent,
      space,
    },
    children: jsx('div', { css }, children),
    ...rest,
  })

export const Sidebar = ({
  children,
  css,
  side,
  sideWidth,
  contentMin,
  space,
  noStretch,
  ...rest
}) =>
  jsxHelper({
    layoutComp: 'sidebar',
    layoutProps: {
      side,
      sideWidth,
      contentMin,
      space,
      noStretch,
    },
    children: jsx('div', { css }, children),
    ...rest,
  })

export const Switcher = ({ children, css, treshold, space, limit, ...rest }) =>
  jsxHelper({
    layoutComp: 'switcher',
    layoutProps: {
      treshold,
      space,
      limit,
    },
    children: jsx('div', { css }, children),
    ...rest,
  })

export const Cover = ({ centered, space, minHeight, noPad, ...rest }) =>
  jsxHelper({
    layoutComp: 'cover',
    layoutProps: {
      centered,
      space,
      minHeight,
      noPad,
    },
    ...rest,
  })

export const Grid = ({
  min = '250px',
  space = ['1rem', 'var(--s0, 1rem)'],
  applyAnyway = false,
  flexboxInstead: fi = false,
  flexboxFallback = false,
  flexBasis = null,
  children,
  css,
  as,
  className,
  ...props
}) => {
  const { ref, isWide, hasSupport: supportsResizeObserver } = useGridObserver({
    min,
  })

  const flexboxInstead =
    fi || (!applyAnyway && flexboxFallback && !supportsResizeObserver)

  return jsx(
    as || 'div',
    {
      ref,
      className: [className, isWide && 'aboveMin'].filter(c => c).join(' '),
      'data-layout-primitive': 'grid',
      css: [
        {
          ...layoutStyles.grid({
            min,
            space,
            applyAnyway,
            flexboxInstead,
            flexBasis,
          }),
        },
        css,
      ],
      ...props,
    },
    flexboxInstead ? <div>{children}</div> : children
  )
  // return jsxHelper({
  //   layoutComp: 'grid',
  //   layoutProps: {
  //     min,
  //     space,
  //   },
  //   ...rest,
  // })
}

export const Frame = ({ ratio, ...rest }) =>
  jsxHelper({
    layoutComp: 'frame',
    layoutProps: {
      ratio,
    },
    ...rest,
  })

export const Reel = ({
  itemWidth,
  height,
  space,
  noBar,
  trackColor,
  thumbColor,
  noJS,
  ...rest
}) =>
  jsxHelper({
    layoutComp: 'reel',
    layoutProps: {
      itemWidth,
      height,
      space,
      noBar,
      trackColor,
      thumbColor,
      noJS,
    },
    ...rest,
  })
