export const backgroundImageWithCover = ({
  url,
  background,
  coverColor = 'rgba(255,255,255,0.7)',
  zIndex = -1,
  css: { ':before': before, ...css } = {},
}) =>
  (background || url) && {
    ':before': {
      content: "''",
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex,
      background: background || `url(${url}) center center / cover no-repeat`,
      // background: bgColor bgImage bgX bgY/bgWidth bgHeight bgRepeat bgOrigin bgClip bgAttachment initial|inherit,
      // background: [
      //   bgColor,
      //   bgImage,
      //   bgX,
      //   bgY,
      //   '/',
      //   bgWidth,
      //   bgHeight,
      //   bgRepeat,
      //   bgOrigin,
      //   bgClip,
      //   bgAttachment,
      // ]
      //   .filter(p => p)
      //   .join(' ')
      ...before,
    },
    position: 'relative',
    ...(coverColor && { background: coverColor }),
    ...css,
  }

// As seen on https://hankchizljaw.com/wrote/creating-an-aspect-ratio-css-utility/
/* Needs to wrap the element like
<div class="aspect-ratio-square">
    <img src="" alt="" loading="lazy" />
</div>
*/
export const aspectRatio = ({ ratio = 1 }) => {
  return {
    display: 'block',
    position: 'relative',
    paddingTop:
      typeof ratio === 'string' && ratio.test(/%/)
        ? ratio
        : `${parseFloat(ratio) * 100}%`,
    '& > *': {
      display: 'block',
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '0',
      left: '0',
    },
  }
}

// As seen on https://hankchizljaw.com/wrote/create-a-responsive-grid-layout-with-no-media-queries-using-css-grid/
export const wrapper = ({ maxWidth = '65ch', space = '1rem' }) => ({
  maxWidth,
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: `0 ${space}`,
})

// As seen on https://hankchizljaw.com/wrote/create-a-responsive-grid-layout-with-no-media-queries-using-css-grid/
/* Use it with the wrapper like
<div class="wrapper">
  <ul class="auto-grid">
    <!-- items go here -->
  </ul>
</div>
*/
export const autoGrid = ({
  maxWidthFallback = '400px',
  min = '25ch',
  space = '1rem',
}) => ({
  '& > *': {
    maxWidth: maxWidthFallback,
  },
  '& > * + *': {
    marginTop: space,
  },

  '@supports (display: grid)': {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${min}, 1fr))`,
    gridGap: space,
    '& > *': {
      maxWidth: 'unset',
    },
    '& > * + *': {
      marginTop: 'unset',
    },
  },
})
