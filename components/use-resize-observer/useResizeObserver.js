import { useEffect, useState, useRef } from 'react'
// import ResizeObserver from 'resize-observer-polyfill'

// From https://github.com/ZeeCoder/use-resize-observer
const useResizeObserver = ({ defaultWidth = 1, defaultHeight = 1 } = {}) => {
  const { ResizeObserver } = typeof window !== 'undefined' ? window : {}
  const hasSupport = typeof ResizeObserver !== 'undefined'

  const ref = useRef(null)
  const [width, changeWidth] = useState(defaultWidth)
  const [height, changeHeight] = useState(defaultHeight)

  useEffect(() => {
    if (!ResizeObserver) {
      return
    }

    const element = ref.current

    const resizeObserver = new ResizeObserver(entries => {
      if (!Array.isArray(entries)) {
        return
      }

      // Since we only observe the one element, we don't need to loop over the
      // array
      if (!entries.length) {
        return
      }

      const entry = entries[0]

      changeWidth(entry.contentRect.width)
      changeHeight(entry.contentRect.height)
    })

    resizeObserver.observe(element)

    // eslint-disable-next-line consistent-return
    return () => resizeObserver.unobserve(element)
  }, [])

  return { ref, width, height, hasSupport }
}

export default useResizeObserver
