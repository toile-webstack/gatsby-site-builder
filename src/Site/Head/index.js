import React from 'react'
import { SEO, Scripts } from '../../atoms'

const Head = ({
  children,
  lang,
  name,
  defer,
  defaultTitle,
  titleTemplate,
  title,
  description,
  canonicalUrl,
  favicon,
  socialImage,
  ogType,
  //
  scripts,
  async,
  dynamicOnly,
  scriptsPrefix,
}) => (
  <SEO
    {...{
      lang,
      name,
      defer,
      defaultTitle,
      titleTemplate,
      title,
      description,
      canonicalUrl,
      favicon,
      socialImage,
      // IDEA: use fullPath in sitePage fields for canonical url
      ogType,
    }}
  >
    {children}
    <Scripts
      {...{
        scripts,
        async: async || true,
        dynamicOnly: dynamicOnly || true,
        idPrefix: scriptsPrefix,
      }}
    />
  </SEO>
)

export default Head
