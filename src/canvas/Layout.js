import React from 'react'
import { Stack } from '../../libs/layout-primitives'

const Layout = props => {
  return (
    <div
      className="layout"
      css={{
        display: `flex`,
        flexFlow: `column`,
        minHeight: `100vh`,
        width: `100%`,
        // paddingTop: rhythm(1.6)
        ...this.styleData,
      }}
    >
      <Helmet
        defaultTitle={metadata.name}
        titleTemplate={`%s | ${metadata.name}`}
        title={metadata.title}
        // meta={[
        //   // { name: `twitter:site`, content: `@gatsbyjs` },
        //   // { property: `og:type`, content: `website` },
        //   // { property: `og:site_name`, content: metadata.name },
        //   { name: `description`, content: metadata.description }
        // ]}
      >
        <meta name="description" content={metadata.description} />
        <link rel="canonical" href={metadata.url} />
        {scripts &&
          !isSSR &&
          scripts.map(
            ({
              id,
              name,
              type = 'text/javascript',
              content: { content },
              // charset, // src,
              ...srcAndCharset
            }) => {
              const scriptProps = {
                id: `${name}`,
                type,
              }
              Object.entries(srcAndCharset).forEach(([attr, a]) => {
                if (a) scriptProps[attr] = a
              })
              return (
                <script
                  // defer
                  async
                  {...{
                    key: id,
                    ...scriptProps,
                  }}
                >
                  {`${content}`}
                </script>
              )
            },
          )}
      </Helmet>

      {isLandingPage ? null : (
        <Menu
          icon={favicon}
          name={metadata.name}
          menu={menu}
          currentLocale={this.state.currentLocale}
          location={this.props.location}
          passCss={{
            position: `fixed`,
            top: 0,
            left: 0,
          }}
        />
      )}
      {isLandingPage ? null : (
        <Menu
          icon={favicon}
          name={metadata.name}
          currentLocale={this.state.currentLocale}
          location={this.props.location}
          passCss={{ visibility: `hidden` }}
        />
      )}
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
                  paddingTop: rhythm(2),
                },
                ':last-child': {
                  paddingBottom: rhythm(2),
                },
              },
            },
          }}
        >
          {this.props.children}
        </main>
      </div>
      {isLandingPage ? null : <Footer section={footer} />}
      {!cookieAlert ? null : <CookieAlert section={cookieAlert} />}
    </div>
  )
}

export default Layout
