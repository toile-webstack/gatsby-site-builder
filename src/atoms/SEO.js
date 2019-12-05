import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({
  children,
  property,
  name,
  content,
  rel,
  href,
  tag: Tag = 'meta',
  ...props
}) => {
  if (!children && !content && !href) {
    console.log(`No content to SEO tag ${name || property || rel}`)
    return null
  }
  return <Tag {...{ children, property, name, content, rel, href, ...props }} />
}

// Object type: https://developers.facebook.com/docs/reference/opengraph#object-type
const SEO = ({
  defer = false,
  defaultTitle,
  titleTemplate,
  // charSet = 'utf-8',
  lang,
  name,
  title,
  description,
  canonicalUrl,
  ogType,
  favicon,
  socialImage,
  children,
}) => (
  <Helmet
    {...{
      defer,
      defaultTitle,
      titleTemplate,
    }}
  >
    {lang && <html lang={lang} />}
    <Meta {...{ tag: 'title' }}>{title}</Meta>
    <Meta {...{ property: 'og:title', content: `${title} | ${name}` }} />
    <Meta {...{ property: 'og:site_name', content: name }} />
    <Meta {...{ name: 'description', content: description }} />
    <Meta {...{ property: 'og:description', content: description }} />
    <Meta {...{ tag: 'link', rel: 'canonical', href: canonicalUrl }} />
    <Meta {...{ property: 'og:url', content: canonicalUrl }} />
    <Meta
      {...{
        tag: 'link',
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: favicon,
      }}
    />
    <Meta {...{ property: 'og:image', content: socialImage }} />
    <Meta {...{ property: 'og:type', content: ogType }} />
    {/* {title && <title>{title}</title>} */}
    {/* {title && <meta property="og:title" content={`${title} | ${name}`} />} */}
    {/* {description && <meta name="description" content={description} />} */}
    {/* {description && <meta property="og:description" content={description} />} */}
    {/* {canonicalUrl && <link rel="canonical" href={canonicalUrl} />} */}
    {/* {canonicalUrl && <meta property="og:url" content={canonicalUrl} />} */}
    {/* ogType && <meta property="og:type" content={ogType} />} */}

    {children}
  </Helmet>
)

export default SEO
