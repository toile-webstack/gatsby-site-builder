import React from 'react'

const def = ({ Tag, children }) => {
  return <Tag css={{ border: 'solid 3px blue' }}>{children}</Tag>
}

export default {
  default: def,
}
