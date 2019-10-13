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

export const dumb = {}
