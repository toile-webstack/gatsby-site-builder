import React from 'react'

export default ({ name, email, phone }) => (
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
    {typeof window !== `undefined` ? (
      <>
        {name && <span>{name}</span>}
        {email}
        {phone}
      </>
    ) : (
      ''
    )}
  </p>
)
