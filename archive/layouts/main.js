import React from 'react'

const MainLayout = ({ children }) => (
  <>
    {/* <meta property="og:image" content={`${socialImageUrl}`} />
    <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
    <meta property="og:type" content="website" />
    {metadata.name && (
      <meta property="og:site_name" content={`${metadata.name}`} />
    )} */}

    {/*
          <title>{`${metadata.title} | ${metadata.name}`}</title>
          <meta
            property="og:title"
            content={`${metadata.title} | ${metadata.name}`}
          />
          <meta name="description" content={`${metadata.description}`} />
          <meta property="og:description" content={`${metadata.description}`} />
          <link rel="canonical" href={`${metadata.url}`} />
          <meta property="og:url" content={`${metadata.url}`} /> */}

    {/* <GoogleFont typography={typography} /> */}
    {children}
  </>
)

export default MainLayout
