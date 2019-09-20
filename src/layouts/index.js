import React from "react";
import Link from "gatsby-link";
import Helmet from "react-helmet";
import _ from "lodash";
// Load font CSS
import "typeface-open-sans";
import "typeface-montserrat";
import "typeface-bellefair";
import "typeface-quicksand";
import "typeface-yanone-kaffeesatz";
import "typeface-dosis";
import "typeface-josefin-sans";
import "typeface-noto-sans";
import "typeface-raleway";
import "typeface-didact-gothic";

// import * as themes from "./typography-themes"
// importAll themes from
// const themes = require.context(
//   './typography-themes',
//   true,
//   /^\.\/typography-theme.*\/src\/index.js$/
// )
// const typographyTheme = require("./typography-themes/typography-theme-alton/src/index.js")
// console.log(themes)
import { mapStyle } from "../utils/processCss";
import { rhythm, scale } from "../utils/typography";
import {
  defaultLocale,
  locales,
  metadata,
  favicon,
  pages,
  menu
} from "../utils/siteSettings.json";

import Menu from "../molecules/Menu";
import ColorPalettesDemo from "../molecules/ColorPalettesDemo";
import ContactInfos from "../molecules/ContactInfos";
import FooterFeed from "../molecules/FooterFeed";
import Footer from "../molecules/Footer";
import CookieAlert from "../atoms/CookieAlert";
import Sidebar from "../molecules/Sidebar";

// TODO: Handle Contact page differently
// siteMapping.push({
//   name: "Contact",
//   path: "contact",
// })

class DefaultLayout extends React.Component {
  constructor(props) {
    // console.log(props)
    super(props);
    // _json_ fields
    // this.metadata = JSON.parse(props.data.contentfulPage.metadata._json_)
    this.optionsData = JSON.parse(
      props.data.settings.edges[0].node.options._json_
    );
    this.styleData = mapStyle(
      JSON.parse(props.data.settings.edges[0].node.style._json_)
    );
    // menu is like {
    //   en-BE: [
    //     {name: 'Homepage', path: '/en-BE/'},
    //     {name: 'Contact', path: '/en-BE/contact/'}
    //   ],
    //   fr-BE: [
    //     {name: 'Accueil', path: '/fr-BE/'},
    //     {name: 'Contacte-moi', path: '/fr-BE/contact/'}
    //   ]
    // }
    this.landingRE = new RegExp(/\/landing\//);

    this.state = {
      defaultLocale: defaultLocale,
      currentLocale: defaultLocale,
      isLandingPage: Boolean(props.location.pathname.match(this.landingRE))
    };
  }
  componentWillMount() {
    this.updateState();
  }
  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        isLandingPage: !!nextProps.location.pathname.match(this.landingRE)
      });
    }
  }
  updateState(props = this.props) {
    // TODO: Problem if a locale name happend to be in the page slug itself
    locales.forEach(locale => {
      const re = new RegExp(`/${locale}/`, "gi");
      if (props.location.pathname.match(re)) {
        this.setState({ currentLocale: locale });
      }
    });
  }
  render() {
    const { isLandingPage } = this.state;
    const { footer, cookieAlert, settings } = this.props.data;

    const { scripts } = this.props.data.settings.edges[0].node;
    const isSSR = typeof window === "undefined";

    return (
      <div
        className="layout"
        css={{
          display: `flex`,
          flexFlow: `column`,
          minHeight: `100vh`,
          width: `100%`,
          // paddingTop: rhythm(1.6)
          ...this.styleData
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
                type = "text/javascript",
                content: { content },
                // charset, // src,
                ...srcAndCharset
              }) => {
                const scriptProps = {
                  id: `${name}`,
                  type
                };
                Object.entries(srcAndCharset).forEach(([attr, a]) => {
                  if (a) scriptProps[attr] = a;
                });
                return (
                  <script
                    // defer
                    async
                    {...{
                      key: id,
                      ...scriptProps
                    }}
                  >
                    {`${content}`}
                  </script>
                );
              }
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
              left: 0
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
        {process.env.NODE_ENV === "development" ||
        (typeof window !== "undefined" &&
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
            width: `100%`
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
              "> div": {
                // pages
                flexGrow: `1`,
                display: `flex`,
                flexFlow: `column`,
                justifyContent: `center`,
                padding: 0,
                // padding: `${rhythm(1)} ${rhythm(1 / 2)}`,
                position: `relative`,
                "> div": {
                  // 1st line blocks OR blog article
                  ":first-child": {
                    paddingTop: rhythm(2)
                  },
                  ":last-child": {
                    paddingBottom: rhythm(2)
                  }
                }
              }
            }}
          >
            {this.props.children()}
          </main>
        </div>
        {isLandingPage ? null : <Footer section={footer} />}
        {!cookieAlert ? null : <CookieAlert section={cookieAlert} />}
      </div>
    );
  }
}

export default DefaultLayout;

// TODO: query for global styles and options in settings
export const pageQuery = graphql`
  query IndexLayout {
    settings: allContentfulSettings(limit: 2) {
      edges {
        node {
          id
          name
          style {
            _json_
          }
          options {
            _json_
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
        _json_
      }
      style {
        _json_
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
        _json_
      }
      style {
        _json_
      }
    }
  }
`;
