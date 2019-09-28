/** @jsx jsx */
import { jsx } from '@emotion/core'

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

const layoutStyles = {
  stack: ({
    space = '1rem', // The space (margin) between successive sibling elements
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
    padding = '1rem', // The amount by with the Box is padded on all sides
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
      outline: `${borderWidth} solid transparent`,
      outlineOffset: `calc(${borderWidth} * -1)`,
    }),

    // " *": {
    //   color: "inherit",
    // },
  }),

  center: ({
    max = '65ch', // The maximum width of the centered element
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
    space = '1rem', // The space (margin) between each of the clustered elements
  } = {}) => ({
    overflow: 'hidden',
    '> *': {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: justify,
      alignItems: align,
      margin: `calc(${space} / 2 * -1)`,
    },
    '> * > *': {
      margin: `calc(${space} / 2)`,
    },
  }),

  sidebar: ({
    side = 'left', // Whether the sidebar element is the :last-child or :first-child
    sideWidth = null, // The width of the sidebar (empty means not set; defaults to the content width)
    contentMin = '50%', // The narrowest the content (main) element can be before wrapping. Should be a percentage.
    space = '1rem', // The space (margin) between the sidebar and non-sidebar
    noStretch = false, // Make the adjacent elements adopt their natural height
  } = {}) => ({
    overflow: 'hidden',
    '> *': {
      display: 'flex',
      flexWrap: 'wrap',
      margin: `calc(${space} / 2 * -1)`,
      ...(noStretch && { alignItems: 'flex-start' }),
    },
    '> * > *': {
      margin: `calc(${space} / 2)`,
      flexGrow: 1,
      ...(sideWidth && { flexBasis: sideWidth }),
    },
    [side === 'right' ? '> * > :first-child' : '> * > :last-child']: {
      flexBasis: 0,
      flexGrow: 999,
      minWidth: `calc(${contentMin} - ${space})`,
    },
  }),

  switcher: ({
    treshold = '65ch', // The container width at which the component switches between a horizontal and vertical layout
    space = '1rem', // The space (margin) between the (child) elements
    limit = 4, // The maximum number of elements allowed to appear in the horizontal configuration
  } = {}) => ({
    display: 'block',
    '> *': {
      display: 'flex',
      flexWrap: 'wrap',
      overflow: 'hidden',
      margin: `calc(${space} / 2) * -1)`,
    },
    '> * > *': {
      flexBasis: `calc((${treshold} - (100 % - ${space})) * 999)`,
      flexGrow: 1,
      margin: `calc(${space} / 2)`,
    },
    [`& > * > :nth-last-child(n + ${limit +
      1}), & > * > :nth-last-child(n + ${limit + 1}) ~ *`]: {
      flexBasis: '100%',
    },
  }),

  cover: ({
    centered = 'h1', // The element that should be towards the vertical center of the space. Identify with a simple selector like h2 or .centered
    space = '1rem', // The minimum space between and around the child elements
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
    space = '1rem', // The space (grid-gap) between the grid children / cells
  } = {}) => ({
    display: 'grid',
    gridGap: space,
    alignContent: 'start',
    gridTemplateColumns: '100%',
    '&.aboveMin': {
      // TODO: this is probably not working without the observer function
      gridTemplateColumns: `repeat(auto-fill, minmax(${min}, 1fr))`,
    },
    [`@supports (width: min(${min}, 100%))`]: {
      gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}, 100%), 1fr))`,
    },
  }),

  frame: ({
    ratio = '16:9', // The element's aspect ratio
  } = {}) => {
    const [num, den] = ratio.split(':')
    return {
      display: 'block',
      position: 'relative',
      paddingBottom: `calc(${num} / ${den} * 100%)`,
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
    space = '1rem', // The space between each child element, and between the child elements and the scrollbar
    noBar = false, // Whether to display the scrollbar
    trackColor = '#000',
    thumbColor = '#fff',
    noJS = false, // Wether the observer has been setup to manage the "overflowing" classname
  } = {}) => ({
    display: 'flex',
    height,
    overflowX: 'auto',
    overflowY: 'hidden',
    ...(noBar && {
      scrollbarWidth: 'none',
    }),

    '& > *': {
      flex: `0 0 ${itemWidth}`,
    },
    '& > img, & > .img, & > .image': {
      height: '100%',
      flexBasis: 'auto',
      width: 'auto',
    },
    '& > * + *': {
      marginLeft: `${space}`,
    },

    [noJS ? '&' : '&.overflowing']: {
      // if we setup the observer, className will change
      ...(!noBar && {
        paddingBottom: `${space}`,
      }),
    },

    '&::-webkit-scrollbar': {
      height: '1rem',
      ...(noBar && {
        display: 'none',
      }),
    },

    scrollbarColor: `${thumbColor} ${trackColor}`,
    '&::-webkit-scrollbar-track': {
      backgroundColor: `${trackColor}`,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: `${trackColor}`,
      backgroundImage: `linear-gradient(${trackColor} 0, ${trackColor} 0.25rem, ${thumbColor} 0.25rem, ${thumbColor} 0.75rem, ${trackColor} 0.75rem)`,
    },
  }),
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

export const Grid = ({ min, space, ...rest }) =>
  jsxHelper({
    layoutComp: 'grid',
    layoutProps: {
      min,
      space,
    },
    ...rest,
  })

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
