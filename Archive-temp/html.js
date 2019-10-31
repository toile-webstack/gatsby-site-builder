import React, { Component } from "react"
import * as PropTypes from "prop-types"
import { TypographyStyle, GoogleFont } from "react-typography"

import typography from "./utils/typography"
import {
  favicon,
  socialImageUrl,
  metadata,
  colors,
  fonts,
  contact
} from "./utils/siteSettings.json"

let stylesStr
if (process.env.NODE_ENV === `production`) {
  try {
    stylesStr = require("!raw-loader!../public/styles.css")
  } catch (e) {
    console.log(e)
  }
}

const propTypes = {
  headComponents: PropTypes.node.isRequired,
  body: PropTypes.node.isRequired,
  postBodyComponents: PropTypes.node.isRequired
}

// TODO: Change icon url
// TODO: fix socialImageUrl url with &amp;

class Html extends Component {
  render() {
    let css
    if (process.env.NODE_ENV === `production`) {
      css = (
        <style
          id="gatsby-inlined-css"
          dangerouslySetInnerHTML={{ __html: stylesStr }}
        />
      )
    }

    return (
      <html>
        <head>
          {this.props.headComponents}
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <meta property="og:image" content={`${socialImageUrl}`} />
          <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
          <meta property="og:type" content="website" />
          {metadata.name && (
            <meta property="og:site_name" content={`${metadata.name}`} />
          )}

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

          <TypographyStyle typography={typography} />
          <GoogleFont typography={typography} />
          {/*
            {
              console.log('LOG', fonts);
              if (fonts.fontHeader !== '/') { // check for user defined fonts
              console.log('GOOGLE FONTS');
                return (<GoogleFont typography={typography} />)
              }
            }
          */}
          {css}
        </head>
        <body>
          <div
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    )
  }
}

Html.propTypes = propTypes

module.exports = Html
