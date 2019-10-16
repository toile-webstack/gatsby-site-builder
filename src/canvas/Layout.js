import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import { mapStyle } from '../utils/processCss'
import internalJson from '../utils/internalJson'
import { Stack } from '../../libs/layout-primitives'

import {
  defaultLocale,
  locales,
  metadata,
  favicon,
  pages,
  menu,
} from '../utils/siteSettings.json'

import { SEO, Scripts } from '.'
import Menu from '../molecules/Menu'
import ColorPalettesDemo from '../molecules/ColorPalettesDemo'
import ContactInfos from '../molecules/ContactInfos'
import FooterFeed from '../molecules/FooterFeed'
import Footer from '../molecules/Footer'
import CookieAlert from '../atoms/CookieAlert'
import Sidebar from '../molecules/Sidebar'

import colorsLib from '../utils/colors'
import { useColors } from '../logic'

const QUERY = graphql`
  query DefaultLayout {
    settings: contentfulSettings {
      id
      name
      style {
        internal {
          content
        }
      }
      options {
        internal {
          content
        }
      }
      node_locale
      scripts {
        id
        name
        type
        src
        charset
        content {
          id
          content
        }
      }
    }
    footer: contentfulSection(name: { eq: "--footer" }) {
      id
      name
      internal {
        type
      }
      blocks {
        ...BlockFreeText
        ...BlockForm
        ...BlockGallery
        ...BlockReferences
      }
      options {
        internal {
          content
        }
      }
      style {
        internal {
          content
        }
      }
    }
    cookieAlert: contentfulSection(name: { eq: "--cookie" }) {
      id
      name
      internal {
        type
      }
      blocks {
        ...BlockFreeText
        ...BlockForm
        ...BlockGallery
        ...BlockReferences
      }
      options {
        internal {
          content
        }
      }
      style {
        internal {
          content
        }
      }
    }
  }
`

const landingRE = new RegExp(/\/landing\//)

const Layout = ({ children, currentLocale, path, location }) => {
  const { settings, footer, cookieAlert } = useStaticQuery(QUERY)

  const {
    id: idSettings,
    // metadata: metadataData,
    options: optionsData,
    style: styleData,
    scripts,
  } = settings

  // const metadata = internalJson(metadataData) // is already in local JSON file
  const options = internalJson(optionsData)
  const style = mapStyle(internalJson(styleData))

  const isLandingPage = landingRE.test(path)
  const isSSR = typeof window === 'undefined'

  const colors = useColors({ options, colorsLib })
  const { classicCombo } = colors

  return (
    <div
      className="layout"
      css={{
        display: `flex`,
        flexFlow: `column`,
        minHeight: `100vh`,
        width: `100%`,
        // paddingTop: rhythm(1.6)
        ...style,
      }}
    >
      <SEO
        {...{
          lang: defaultLocale, // must be overwritten on page
          name: metadata.name,
          title: metadata.title,
          description: metadata.description,
          canonicalUrl: metadata.url + path,
          // IDEA: use fullPath in sitePage fields for canonical url
          ogType: metadata.ogType || 'website',
        }}
      >
        <Scripts
          {...{
            scripts,
            async: true,
            dynamicOnly: true,
            idPrefix: idSettings,
          }}
        />
      </SEO>
      {isLandingPage ? null : (
        <Menu
          icon={favicon}
          name={metadata.name}
          menu={menu}
          currentLocale={currentLocale}
          location={location}
          passCss={{
            // position: `fixed`,
            // left: 0,
            position: `sticky`,
            top: 0,
            zIndex: 999,
          }}
        />
      )}
      {/* {isLandingPage ? null : (
        <Menu
          icon={favicon}
          name={metadata.name}
          currentLocale={currentLocale}
          location={location}
          passCss={{ visibility: `hidden` }}
        />
      )} */}
      {process.env.NODE_ENV === 'development' ||
      (typeof window !== 'undefined' &&
        window.location.href.match(/localhost|dev--.*netlify.com/gi)) ? (
        <ColorPalettesDemo />
      ) : null}
      <div
        css={{
          margin: `auto`,
          display: `flex`,
          flexGrow: 1,
          flexFlow: `column`,
          justifyContent: `center`,
          width: `100%`,
          // for sidebar layout
          // "@media(min-width: 800px)": {
          //   flexFlow: `row`,
          //   "> .layout-main": {
          //     maxWidth: 1000,
          //   },
          //   "> .sidebar": {
          //     width: 250,
          //     marginLeft: rhythm(1 / 2),
          //   },
          // },
          // "@media(min-width: 1270px)": {
          //   "> .layout-main": {
          //     maxWidth: 1000,
          //   },
          //   "> .sidebar": {
          //     width: 250,
          //     marginLeft: rhythm(1 / 2),
          //   },
          // },
        }}
      >
        <main
          className="layout-main"
          css={{
            flexGrow: 1,
            display: `flex`,
            flexFlow: `column`,
            width: `100%`,
            '> div': {
              // pages
              flexGrow: `1`,
              display: `flex`,
              flexFlow: `column`,
              justifyContent: `center`,
              padding: 0,
              // padding: `${rhythm(1)} ${rhythm(1 / 2)}`,
              position: `relative`,
              '> div': {
                // 1st line blocks OR blog article
                ':first-child': {
                  paddingTop: '2rem',
                },
                ':last-child': {
                  paddingBottom: '2rem',
                },
              },
            },
          }}
        >
          {children}
        </main>
      </div>
      {isLandingPage ? null : <Footer section={footer} />}
      {!cookieAlert ? null : <CookieAlert section={cookieAlert} />}
    </div>
  )
}

export default Layout
