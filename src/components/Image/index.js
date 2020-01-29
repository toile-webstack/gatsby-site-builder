import { customHug } from '../../core'
import Views from './views'

const convertShapeToRatio = shape => {
  switch (shape) {
    case 'square':
      return '1'
    case 'landscape':
      return '16/9'
    case 'portrait':
      return '9/16'
    default:
      return undefined
  }
}

export const useImage = ({ gallery, ...rest }) => {
  const { options } = gallery || {}
  const { fit, columns, layout, popup } = options || {}
  const shape = options?.shape || layout?.shape
  const ratio = options?.ratio || convertShapeToRatio(shape)

  return {
    ratio,
    fit,
    data: {
      ...rest,
      options,
    },
  }
}

const ImageHug = ({ data, children }) => {
  return customHug({ Views, data, children, useData: useImage })
}

export default ImageHug
