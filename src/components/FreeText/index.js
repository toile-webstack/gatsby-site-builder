import ReactMd from 'react-markdown/with-html'

import { customHug } from '../../core'
import Views from './views'

export const useFreeText = ({ options = {}, style, main, ...rest }) => {
  const children = ReactMd({ source: main, escapeHtml: false })

  return {
    children,
    data: {
      ...rest,
      options,
      style,
      main,
    },
  }
}

const FreeText = ({ data, children }) => {
  return customHug({ Views, data, children, useData: useFreeText })
}

export default FreeText
