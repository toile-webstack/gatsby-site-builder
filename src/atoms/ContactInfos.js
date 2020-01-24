import React from 'react'

export default ({ name, email, phone }) =>
  typeof window !== `undefined` ? (
    <p
      css={{
        display: `flex`,
        flexFlow: `row wrap`,
        justifyContent: `center`,
        '> *:not(:last-child):after': {
          content: `"-"`,
          margin: `0 3px`,
          fontWeight: `normal`,
        },
      }}
    >
      {name && <span>{name}</span>}
      {email}
      {phone}
    </p>
  ) : null
