import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import _ from 'lodash'

// import * as themes from "./typography-themes"
// importAll themes from
// const themes = require.context(
//   './typography-themes',
//   true,
//   /^\.\/typography-theme.*\/src\/index.js$/
// )
// const typographyTheme = require("./typography-themes/typography-theme-alton/src/index.js")
// console.log(themes)
import { mapStyle } from '../utils/processCss'
import {
  defaultLocale,
  locales,
  metadata,
  favicon,
  socialImageUrl,
  menu,
  // pages,
  // colors,
  // fonts,
  // contact,
} from '../utils/siteSettings.json'
import internalJson from '../utils/internalJson'
import useMomentLocaleImport from '../utils/useMomentLocaleImport'
// import Menu from '../molecules/Menu'
import MenuReel from '../atoms/MenuReel'
import ColorPalettesDemo from '../molecules/ColorPalettesDemo'
// import ContactInfos from '../molecules/ContactInfos'
// import FooterFeed from '../molecules/FooterFeed'
import Footer from '../molecules/Footer'
import CookieAlert from '../atoms/CookieAlert'
// import Sidebar from '../molecules/Sidebar'

import { SEO, Scripts } from '../atoms'
import { LLayout } from '../t-layouts'

// TODO: Handle Contact page differently
// siteMapping.push({
//   name: "Contact",
//   path: "contact",
// })

const getCurrentLocale = pathname => {
  const firstPath = pathname.match(/^\/..\//) || []
  const localeFromPath = firstPath[0] && firstPath[0].replace(/\//g, '')
  const currentLocale =
    locales.some(l => l === localeFromPath) && localeFromPath
  return currentLocale
}

const DefaultLayout = ({
  data: { settings, cookieAlert, footer } = {},
  location,
  children,
  // isSSR,
  isLandingPage: islp,
}) => {
  const { pathname } = location || {}
  const { options: optionsData, style: styleData, scripts } = settings
  const options = internalJson(optionsData)
  const style = mapStyle(internalJson(styleData))

  // const landingRE = new RegExp(/\/landing\//)
  const currentLocale = getCurrentLocale(pathname) || defaultLocale
  useMomentLocaleImport({ locale: currentLocale })
  const isLandingPage =
    islp || options.isLandingPage || /\/landing\//.test(pathname)

  const isSSR = typeof window === 'undefined'

  const envIsDev =
    process.env.NODE_ENV === 'development' ||
    (!isSSR && window.location.href.match(/localhost|dev--.*netlify.com/gi))

  // const colors = useColors({ options, colorsLib })
  // const { isColored, classicCombo } = colors

  return (
    <LLayout
      data-component="layout"
      className="layout"
      css={{
        ...style,
      }}
    >
      <SEO
        {...{
          defer: false,
          defaultTitle: metadata.name,
          titleTemplate: `%s | ${metadata.name}`,
          title: metadata.title,
          name: metadata.name,
          //
          lang: currentLocale,
          description: metadata.description,
          canonicalUrl: metadata.url,
          favicon,
          socialImage: socialImageUrl,
          // IDEA: use fullPath in sitePage fields for canonical url
          ogType: metadata.ogType || 'website',
        }}
      >
        {/* From HTML.js */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* TODO: Check if what is up here is not already implemented */}
        {/* End from HTML.js */}
        <Scripts
          {...{
            scripts,
            async: true,
            dynamicOnly: true,
            idPrefix: 'layout',
          }}
        />
      </SEO>

      {isLandingPage ? null : (
        <MenuReel
          icon={favicon}
          name={metadata.name}
          menu={menu}
          currentLocale={currentLocale}
          location={location}
        />
      )}
      {/* {isLandingPage ? null : (
        <Menu
          icon={favicon}
          name={metadata.name}
          menu={menu}
          currentLocale={currentLocale}
          location={location}
        />
      )} */}
      {envIsDev && <ColorPalettesDemo />}
      <div className="layout-wrapper">
        {/* wrapper was useful for sidebar */}
        <main className="layout-main">{children}</main>
      </div>
      {isLandingPage ? null : <Footer section={footer} />}
      {!cookieAlert ? null : <CookieAlert section={cookieAlert} />}
    </LLayout>
  )
}

// class DefaultLayoutt extends React.Component {
//   constructor(props) {
//     // console.log(props)
//     super(props)

//     const { options, style } = props.data.settings.edges[0].node
//     // this.metadata = JSON.parse(props.data.contentfulPage.metadata.internal.content)
//     this.optionsData = internalJson(options)
//     this.styleData = mapStyle(internalJson(style))

//     // menu is like {
//     //   en-BE: [
//     //     {name: 'Homepage', path: '/en-BE/'},
//     //     {name: 'Contact', path: '/en-BE/contact/'}
//     //   ],
//     //   fr-BE: [
//     //     {name: 'Accueil', path: '/fr-BE/'},
//     //     {name: 'Contacte-moi', path: '/fr-BE/contact/'}
//     //   ]
//     // }
//     this.landingRE = new RegExp(/\/landing\//)

//     this.state = {
//       // defaultLocale,
//       currentLocale: defaultLocale,
//       isLandingPage: Boolean(props.location.pathname.match(this.landingRE)),
//     }
//   }

//   componentDidMount() {
//     this.updateState()
//   }

//   componentWillReceiveProps(nextProps) {
//     this.updateState(nextProps)
//     if (nextProps.location.pathname !== this.props.location.pathname) {
//       this.setState({
//         isLandingPage: !!nextProps.location.pathname.match(this.landingRE),
//       })
//     }
//   }

//   updateState(props = this.props) {
//     // TODO: Problem if a locale name happend to be in the page slug itself
//     locales.forEach(locale => {
//       const re = new RegExp(`/${locale}/`, 'gi')
//       if (props.location.pathname.match(re)) {
//         this.setState({ currentLocale: locale })
//       }
//     })
//   }

//   render() {
//     const { isLandingPage } = this.state
//     const { footer, cookieAlert, settings } = this.props.data

//     const { scripts } = this.props.data.settings.edges[0].node
//     const isSSR = typeof window === 'undefined'

//     return (
//       <div
//         className="layout"
//         css={{
//           display: `flex`,
//           flexFlow: `column`,
//           minHeight: `100vh`,
//           width: `100%`,
//           // paddingTop: rhythm(1.6)
//           ...this.styleData,
//         }}
//       >
//         <Helmet
//           defaultTitle={metadata.name}
//           titleTemplate={`%s | ${metadata.name}`}
//           title={metadata.title}
//           defer={false}
//           // meta={[
//           //   // { name: `twitter:site`, content: `@gatsbyjs` },
//           //   // { property: `og:type`, content: `website` },
//           //   // { property: `og:site_name`, content: metadata.name },
//           //   { name: `description`, content: metadata.description }
//           // ]}
//         >
//           {/* From HTML.js */}
//           <meta charSet="utf-8" />
//           <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
//           <meta
//             name="viewport"
//             content="width=device-width, initial-scale=1.0"
//           />
//           {/* TODO: Check if what is up here is not already implemented */}
//           <meta property="og:image" content={`${socialImageUrl}`} />
//           <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
//           <meta property="og:type" content="website" />
//           {metadata.name && (
//             <meta property="og:site_name" content={`${metadata.name}`} />
//           )}
//           {/* End from HTML.js */}

//           <meta name="description" content={metadata.description} />
//           <link rel="canonical" href={metadata.url} />
//           {scripts &&
//             !isSSR &&
//             scripts.map(
//               ({
//                 id,
//                 name,
//                 type = 'text/javascript',
//                 content: { content },
//                 // charset, // src,
//                 ...srcAndCharset
//               }) => {
//                 const scriptProps = {
//                   id: `${name}`,
//                   type,
//                 }
//                 Object.entries(srcAndCharset).forEach(([attr, a]) => {
//                   if (a) scriptProps[attr] = a
//                 })
//                 return (
//                   <script
//                     // defer
//                     async
//                     {...{
//                       key: id,
//                       ...scriptProps,
//                     }}
//                   >
//                     {`${content}`}
//                   </script>
//                 )
//               }
//             )}
//         </Helmet>

//         {isLandingPage ? null : (
//           <Menu
//             icon={favicon}
//             name={metadata.name}
//             menu={menu}
//             currentLocale={this.state.currentLocale}
//             location={this.props.location}
//             passCss={{
//               position: `fixed`,
//               top: 0,
//               left: 0,
//             }}
//           />
//         )}
//         {isLandingPage ? null : (
//           <Menu
//             icon={favicon}
//             name={metadata.name}
//             currentLocale={this.state.currentLocale}
//             location={this.props.location}
//             passCss={{ visibility: `hidden` }}
//           />
//         )}
//         {process.env.NODE_ENV === 'development' ||
//         (typeof window !== 'undefined' &&
//           window.location.href.match(/localhost|dev--.*netlify.com/gi)) ? (
//           <ColorPalettesDemo />
//         ) : null}
//         <div
//           css={{
//             margin: `auto`,
//             display: `flex`,
//             flexGrow: 1,
//             flexFlow: `column`,
//             justifyContent: `center`,
//             width: `100%`,
//             // for sidebar layout
//             // "@media(min-width: 800px)": {
//             //   flexFlow: `row`,
//             //   "> .layout-main": {
//             //     maxWidth: 1000,
//             //   },
//             //   "> .sidebar": {
//             //     width: 250,
//             //     marginLeft: rhythm(1 / 2),
//             //   },
//             // },
//             // "@media(min-width: 1270px)": {
//             //   "> .layout-main": {
//             //     maxWidth: 1000,
//             //   },
//             //   "> .sidebar": {
//             //     width: 250,
//             //     marginLeft: rhythm(1 / 2),
//             //   },
//             // },
//           }}
//         >
//           <main
//             className="layout-main"
//             css={{
//               flexGrow: 1,
//               display: `flex`,
//               flexFlow: `column`,
//               width: `100%`,
//               '> div': {
//                 // pages
//                 flexGrow: `1`,
//                 display: `flex`,
//                 flexFlow: `column`,
//                 justifyContent: `center`,
//                 padding: 0,
//                 // padding: `${rhythm(1)} ${rhythm(1 / 2)}`,
//                 position: `relative`,
//                 '> div': {
//                   // 1st line blocks OR blog article
//                   ':first-child': {
//                     paddingTop: rhythm(2),
//                   },
//                   ':last-child': {
//                     paddingBottom: rhythm(2),
//                   },
//                 },
//               },
//             }}
//           >
//             {this.props.children}
//           </main>
//         </div>
//         {isLandingPage ? null : <Footer section={footer} />}
//         {!cookieAlert ? null : <CookieAlert section={cookieAlert} />}
//       </div>
//     )
//   }
// }

// TODO: query for global styles and options in settings
const QUERY = graphql`
  query Layout {
    settings: contentfulSettings {
      id
      name
      style {
        # _json_
        internal {
          content
        }
      }
      options {
        # _json_
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
        # _json_
        internal {
          content
        }
      }
      style {
        # _json_
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
        # _json_
        internal {
          content
        }
      }
      style {
        # _json_
        internal {
          content
        }
      }
    }
  }
`

export default props => (
  <StaticQuery
    query={QUERY}
    render={data => <DefaultLayout {...{ ...props, data }} />}
  />
)
