import { customHug } from '../../core'
import Views from './views'

export const usePage = ({ options = {}, style, path, ...rest }) => {
  const { tag: Tag = 'div' } = options
  // const isLandingPage = options?.isLandingPage || /\/landing\//.test(path)
  return {
    Tag,
    // isLandingPage,
    data: {
      ...rest,
      options,
      style,
      path,
    },
  }
}

const Page = ({ data, children }) => {
  return customHug({ Views, data, children, useData: usePage })
}

export default Page
