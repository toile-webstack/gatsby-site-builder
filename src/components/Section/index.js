import { customHug } from '../../core'
import Views from './views'

export const useSection = ({ options = {}, style, ...rest }) => {
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

const Section = ({ data, children }) => {
  return customHug({ Views, data, children, useData: useSection })
}

export default Section
