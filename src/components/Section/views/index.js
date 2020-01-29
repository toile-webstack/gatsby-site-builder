import React from 'react'

const def = ({ Tag, children }) => {
  return <Tag css={{ border: 'solid 1px red' }}>{children}</Tag>
}

export default {
  default: def,
}
