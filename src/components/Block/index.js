import { customHug } from '../../core'
import Views from './views'

export const useBlock = ({ options = {}, style, ...rest }) => {
  const { tag } = options
  return {
    Tag: tag || 'div',
    data: {
      ...rest,
      options,
      style,
    },
  }
}

const Block = ({ data, children }) => {
  return customHug({ Views, data, children, useData: useBlock })
}

export default Block
