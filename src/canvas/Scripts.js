import React from 'react'

const randomNumber = () => Math.round(Math.random() * 10000)

const Scripts = ({
  scripts,
  dynamicOnly = false,
  idPrefix,
  async = false,
  defer = false,
}) => {
  if (!scripts || !Array.isArray(scripts) || !scripts.length) {
    console.log('no scripts')
    return null
  }
  const isSSR = typeof window === 'undefined'
  if (dynamicOnly && isSSR) {
    return null
  }

  return scripts.map(
    ({
      id,
      name,
      type = 'text/javascript',
      content: { content },
      // charset, // src,
      ...srcAndCharset
    }) => {
      const scriptProps = {
        // id: name,
        id: `${idPrefix}-${name}-${randomNumber()}`,
        type,
      }
      Object.entries(srcAndCharset).forEach(([attr, a]) => {
        if (a) scriptProps[attr] = a
      })
      return (
        <script
          {...{
            defer,
            async,
            key: id,
            ...scriptProps,
          }}
        >
          {`${content}`}
        </script>
      )
    },
  )
}

export default Scripts
