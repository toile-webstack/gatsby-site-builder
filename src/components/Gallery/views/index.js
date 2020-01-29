import React from 'react'

import { layoutStyles } from '../../../../libs/nuds-layout-primitives'

const def = ({ children, data = {} }) => {
  const { options = {} } = data
  const { grid } = options
  return (
    <div
      {...{
        css: {
          ...layoutStyles.grid({
            useFlexbox: true,
            ...grid,
            // flexGrow: 0,
            // justifyContent: 'center',
          }),
        },
      }}
    >
      <div>{children}</div>
    </div>
  )
}

export default {
  default: def,
}
