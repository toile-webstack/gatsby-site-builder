import React from 'react'

const def = ({ Tag, children }) => {
  return <Tag css={{ border: 'solid 3px green' }}>{children}</Tag>
}

export default {
  default: def,
}
