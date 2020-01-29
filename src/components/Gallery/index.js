import { customHug } from '../../core'
import Views from './views'

export const useGallery = ({ options = {}, style, gallery, ...rest }) => {
  return {
    data: {
      ...rest,
      options,
      style,
      gallery,
    },
  }
}

const Gallery = ({ data, children }) => {
  return customHug({ Views, data, children, useData: useGallery })
}

export default Gallery
