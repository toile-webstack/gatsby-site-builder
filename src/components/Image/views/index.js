import React from 'react'

import Image from '../../../atoms/Image'
import { layoutStyles } from '../../../../libs/nuds-layout-primitives'

const def = ({ data, ratio, fit }) => {
  return (
    <div
      {...{
        css: {
          ...(ratio &&
            layoutStyles.ratio({
              ratio,
              fit,
            })),
        },
      }}
    >
      <Image {...data} />
    </div>
  )
}

export default {
  default: def,
}
