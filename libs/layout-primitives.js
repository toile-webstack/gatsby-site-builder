/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useEffect, useState, useRef } from 'react'
import useResizeObserver from '../src/utils/useResizeObserver'

export const useGridObserver = ({ min, defaultWidth, defaultHeight } = {}) => {
  const [ref, width, height] = useResizeObserver({
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

  return { ref, width, height, isWide }
}

const modernCssReset = {
  // Credits -> Andy Bell at https://hankchizljaw.com/wrote/a-modern-css-reset/
  /* Box sizing rules */
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },
  /* Remove default padding */
  'ul[class], ol[class]': {
    padding: 0,
  },
  /* Remove default margin */
  'body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd': {
    margin: 0,
  },
  /* Set core body defaults */
  body: {
    minHeight: '100vh',
    scrollBehavior: 'smooth',
    textRendering: 'optimizeSpeed',
    lineHeight: 1.5,
  },
  /* Remove list styles on ul, ol elements with a class attribute */
  'ul[class],ol[class]': {
    listStyle: 'none',
  },
  /* A elements that don't have a class get default styles */
  'a:not([class])': {
    textDecorationSkipInk: 'auto',
  },
  /* Make images easier to work with */
  img: {
    maxWidth: '100%',
    display: 'block',
  },
  /* Natural flow and rhythm in articles by default */
  'article > * + *': {
    marginTop: '1em',
  },
  /* Inherit fonts for inputs and buttons */
  'input,button,textarea,select': {
    font: 'inherit',
  },
  /* Remove all animations and transitions for people that prefer not to see them */
  '@media (prefers-reduced-motion: reduce)': {
    '*': {
      animationDuration: '0.01ms !important',
      animationIterationCount: '1 !important',
      transitionDuration: '0.01ms !important',
      scrollBehavior: 'auto !important',
    },
  },
}

const root = {
  '--font-plain': 'Helvetica Neue, Helvetica, Arial, sans-serif',
  '--font-special': 'Barlow Condensed, Helvetica, sans-serif',
  '--font-mono': 'Menlo, Courier, Courier New, Andale Mono, monospace',

  '--color-dark': 'hsl(0, 0 %, 2 %)',
  '--color-darkish': 'hsl(0, 0 %, 25 %)',
  '--color-lightish': 'hsl(0, 0 %, 90 %)',
  '--color-light': 'hsl(0, 0 %, 98 %)',
  '--color-mid': 'hsl(0, 0 %, 50 %)',

  '--ratio': '1.4',
  '--s-5':
    'calc(var(--s0) / var(--ratio) / var(--ratio) / var(--ratio) / var(--ratio) / var(--ratio))',
  '--s-4':
    'calc(var(--s0) / var(--ratio) / var(--ratio) / var(--ratio) / var(--ratio))',
  '--s-3': 'calc(var(--s0) / var(--ratio) / var(--ratio) / var(--ratio))',
  '--s-2': 'calc(var(--s0) / var(--ratio) / var(--ratio))',
  '--s-1': 'calc(var(--s0) / var(--ratio))',
  '--s0': '1rem',
  '--s1': 'calc(var(--s0) * var(--ratio))',
  '--s2': 'calc(var(--s0) * var(--ratio) * var(--ratio))',
  '--s3': 'calc(var(--s0) * var(--ratio) * var(--ratio) * var(--ratio))',
  '--s4':
    'calc(var(--s0) * var(--ratio) * var(--ratio) * var(--ratio) * var(--ratio))',
  '--s5':
    'calc(var(--s0) * var(--ratio) * var(--ratio) * var(--ratio) * var(--ratio) * var(--ratio))',
  '--measure': '65ch',
  '--line-height': 'var(--ratio)',
  '--line-height-small': 'calc(0.8 * var(--ratio))',
  '--border-thin': 'var(--s-5)',
  '--border-thick': 'var(--s-2)',

  lineHeight: 'var(--ratio)',
  fontSize: 'calc(0.333vw + 1em)',
  fontFamily: 'var(--font-plain)',
  backgroundColor: 'var(--color-light)',
  color: 'var(--color-dark)',

  '@media(prefers-reduced-motion: no-preference)': {
    scrollBehavior: 'smooth',
  },
}

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

const layoutStyles = {
  stack: ({
    space = ['1rem', 'var(--s0, 1rem)'], // The space (margin) between successive sibling elements
    recursive = false, // Whether the spaces apply recursively (i.e. regardless of nesting level)
    splitAfter = null, // The element index after which to split the stack. Leave empty for no splitting
  } = {}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    [recursive ? ' *' : '> *']: {
      marginTop: 0,
      marginBottom: 0,
    },
    [recursive ? ' * + *' : '> * + *']: {
      marginTop: space,
    },
    ...(typeof splitAfter === 'number' && {
      [`> :nth- child(${splitAfter})`]: {
        marginBottom: 'auto',
      },
    }),
  }),

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
    max = ['65ch', 'var(--measure, 65ch)'], // The maximum width of the centered element
    andText = false, // Whether to apply text-align: center too
    gutters = 0, // The minimum space on either side of the content
    intrinsic = false, // Center child elements based on their content width. e.g. center a button
  }) => ({
    display: 'block',
    boxSizing: 'content-box',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: max,
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
    justify = 'center', // The justify-content value (for horizontal alignment)
    align = 'center', // The align-items value (for vertical alignment)
    space = ['1rem', 'var(--s0, 1rem)'], // The space (margin) between each of the clustered elements
  } = {}) => ({
    overflow: 'hidden',
    '> *': {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: justify,
      alignItems: align,
      margin: mapIfArray(space, s => `calc(${s} / 2 * -1)`),
    },
    '> * > *': {
      margin: mapIfArray(space, s => `calc(${s} / 2)`),
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
        margin: mapIfArray(space, s => `calc(${s} / 2) * -1)`),
      },
      '> * > *': {
        flexBasis: mapIfArray(
          g,
          o => `calc((${o.main} - (100 % - ${o.second})) * 999)`,
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

  // TODO: Javascript observer ?
  grid: ({
    min = '250px', // A CSS length value representing x in minmax(min(x, 100%), 1fr)
    space = ['1rem', 'var(--s0, 1rem)'], // The space (grid-gap) between the grid children / cells
  } = {}) => ({
    display: 'grid',
    gridGap: space,
    alignContent: 'start',
    gridTemplateColumns: '100%',
    '&.aboveMin': {
      // TODO: this is probably not working without the observer function
      gridTemplateColumns: mapIfArray(
        min,
        m => `repeat(auto-fill, minmax(${m}, 1fr))`,
      ),
    },
    // the min() function has limited support but allows this to work without JS
    [`@supports (width: min(${min[0] || min}, 100%))`]: {
      gridTemplateColumns: mapIfArray(
        min,
        m => `repeat(auto-fit, minmax(min(${m}, 100%), 1fr))`,
      ),
    },
  }),

  frame: ({
    ratio = '16:9', // The element's aspect ratio
  } = {}) => {
    return {
      display: 'block',
      position: 'relative',
      paddingBottom: mapIfArray(ratio, r => {
        const [num, den] = r.split(':')
        return `calc(${num} / ${den} * 100%)`
      }),
      '> *': {
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
        height: '100%',
        width: '100%',
        objectFit: 'cover',
      },
    }
  },

  // TODO: Javascript observer for scrollbar ?
  // TODO: ? implement background attachment local for affordance. http://lea.verou.me/2012/04/background-attachment-local/
  reel: ({
    itemWidth = 'auto', // The width of each child element
    height = 'auto', // The height of the parent (Reel) element
    space = ['1rem', 'var(--s0, 1rem)'], // The space between each child element, and between the child elements and the scrollbar
    noBar = false, // Whether to display the scrollbar
    trackColor = ['#000', 'var(--color-text, #000)'],
    thumbColor = ['#fff', 'var(--color-background, #fff)'],
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
        flex: mapIfArray(itemWidth, iw => `0 0 ${iw}`),
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
            `linear-gradient(${o.second} 0, ${o.second} 0.25rem, ${o.main} 0.25rem, ${o.main} 0.75rem, ${o.second} 0.75rem)`,
        ),
      },
    }
  },
}

export default layoutStyles

// ---------------COMPONENTS------------------- //

const jsxHelper = ({ children, layoutProps, layoutComp, as, ...props }) =>
  jsx(
    as || 'div',
    {
      css: { ...layoutStyles[layoutComp](layoutProps) },
      ...props,
    },
    children,
  )

export const Stack = ({ space, recursive, splitAfter, ...rest }) =>
  jsxHelper({
    layoutComp: 'stack',
    layoutProps: {
      space,
      recursive,
      splitAfter,
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

export const Center = ({ max, andText, gutters, intrinsic, ...rest }) =>
  jsxHelper({
    layoutComp: 'center',
    layoutProps: {
      max,
      andText,
      gutters,
      intrinsic,
    },
    ...rest,
  })

export const Cluster = ({ justify, align, space, ...rest }) =>
  jsxHelper({
    layoutComp: 'cluster',
    layoutProps: {
      justify,
      align,
      space,
    },
    ...rest,
  })

export const Sidebar = ({
  children,
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
    children: <div>{children}</div>,
    ...rest,
  })

export const Switcher = ({ children, treshold, space, limit, ...rest }) =>
  jsxHelper({
    layoutComp: 'switcher',
    layoutProps: {
      treshold,
      space,
      limit,
    },
    children: <div>{children}</div>,
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
  children,
  as,
  className,
  ...props
}) => {
  const { ref, isWide } = useGridObserver({ min })

  return jsx(
    as || 'div',
    {
      ref,
      className: [className, isWide && 'aboveMin'].filter(c => c).join(' '),
      css: {
        ...layoutStyles.grid({
          min,
          space,
        }),
      },
      ...props,
    },
    children,
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
