import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import { Helmet } from "react-helmet";
import moment from "moment";
import Moment from "react-moment";

import { mapStyle } from "../utils/processCss";
import { metadata as siteMetadata } from "../utils/siteSettings.json";
import { rhythm, scale } from "../utils/typography";
import colors from "../utils/colors";
import {
  addLayoutOptions,
  gridLayout,
  listItemStyle
} from "../utils/computeGrid";

import BlockFreeText from "../blocks/FreeText";
import BlockGallery from "../blocks/Gallery";
import Html from "../atoms/Html";
// import TextNode from "../molecules/TextNode"

class ItemPageTemplate extends React.Component {
  constructor(props) {
    super(props);
    // _json_ fields
    this.metadata = JSON.parse(props.data.collectionItem.metadata.internal.content);
    this.optionsData = JSON.parse(props.data.collectionItem.options.internal.content);
    // console.log(this.optionsData)
    this.styleData = mapStyle(
      JSON.parse(props.data.collectionItem.style.internal.content)
    );
    // Colors
    let { colorPalettes, colorCombo } = this.optionsData;
    // colorCombo = colorCombo && colors[`${colorCombo}Combo`]
    colorCombo = colorCombo
      ? colors[`${colorCombo}Combo`]
      : colors.classicCombo;
    const newColors = colors.computeColors(colorPalettes, colorCombo);
    this.colors = { ...colors, ...newColors };
  }

  render() {
    const {
      classicCombo,
      contrastCombo,
      funkyCombo,
      funkyContrastCombo
    } = this.colors;
    const collectionItem = this.props.data.collectionItem;
    const metadata = this.metadata;

    if (!collectionItem.featuredImage || !collectionItem.name) {
      return null;
    }

    // const locale = collectionItem.node_locale
    // const date = !collectionItem.datePublished
    //   ? ""
    //   : moment(collectionItem.datePublished)
    //       .locale(locale)
    //       .format("Do MMM YYYY")
    // console.log("TEMPLATE PROPS", this.props)
    // TODO: Page Metadata. Watch out for duplicates. Use the same canonical url

    const {
      hideFeaturedImage,
      hideTitle,
      hideDate,
      hideGallery
    } = this.optionsData;

    let galleryOptions = this.optionsData.gallery || {};
    // console.log(galleryOptions)
    galleryOptions.layout = galleryOptions.layout || {};
    galleryOptions.layout.columns = galleryOptions.layout.columns ||
      galleryOptions.columns || ["1/3"];

    const blockGallery = {
      gallery: collectionItem.gallery,
      options: galleryOptions,
      style: {}
    };

    const { scripts } = this.props.data.collectionItem;

    return (
      <div
        className="page page-collectionItem"
        css={{
          // textAlign: `left`
          // " h1, h2, h3, h4, h5, h6": {
          //   color: `inherit`,
          //   marginBottom: 0
          // }
          "> div": {
            width: `100%`,
            maxWidth: `1000px`,
            margin: `auto`,
            padding: rhythm(1),
            flexGrow: 1
          },
          ...this.colors[classicCombo].style,
          ...this.styleData
        }}
      >
        <Helmet>
          <html lang={collectionItem.node_locale} />
          <title>{collectionItem.name}</title>
          <meta
            property="og:title"
            content={`${collectionItem.name} | ${siteMetadata.name}`}
          />
          {metadata.description && (
            <meta name="description" content={metadata.description} />
          )}
          {metadata.description && (
            <meta property="og:description" content={metadata.description} />
          )}
          {this.props.location && (
            <link
              rel="canonical"
              href={siteMetadata.url + this.props.location.pathname}
            />
          )}
          {this.props.location && (
            <meta
              property="og:url"
              content={siteMetadata.url + this.props.location.pathname}
            />
          )}
          {// Object type: https://developers.facebook.com/docs/reference/opengraph#object-type
          metadata.ogType && (
            <meta property="og:type" content={metadata.ogType} />
          )}
          {scripts &&
            scripts.map(
              ({
                id,
                name,
                type = "text/javascript",
                content: { content },
                // charset, // src,
                ...srcAndCharset
              }) => {
                const scriptProps = { id: name, type };
                Object.entries(srcAndCharset).forEach(([attr, a]) => {
                  if (a) scriptProps[attr] = a;
                });
                return (
                  <script
                    defer
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
        <div
          css={{
            display: `flex`,
            flexFlow: `column`,
            alignItems: `flex-start`,
            " .gatsby-image-wrapper": {
              width: `100%`
            }
          }}
        >
          {collectionItem.featuredImage && !hideFeaturedImage && (
            <Img
              css={{
                // width: `1000px`,
                // maxWidth: `400px`,
                maxHeight: `300px`
              }}
              title={collectionItem.featuredImage.title}
              sizes={collectionItem.featuredImage.fluid}
            />
          )}
          <h1
            css={{
              marginBottom: 0
            }}
          >
            {collectionItem.name}
          </h1>
          {collectionItem.datePublished && (
            <Moment
              locale={collectionItem.fields.locale}
              format="Do MMM YYYY"
              css={
                {
                  // ...scale(-0.2),
                  // lineHeight: rhythm(1 / 2),
                  // marginBottom: rhythm(1 / 2),
                  // padding: rhythm(1 / 2),
                }
              }
            >
              {collectionItem.datePublished}
            </Moment>
          )}
          <hr
            css={{
              width: `100%`,
              height: 2,
              background: colors[funkyCombo].border
              // margin: `${rhythm(2)}`
            }}
          />
          <div
            css={{
              display: `flex`,
              flexFlow: `row wrap`
            }}
          >
            {collectionItem.categories &&
              collectionItem.categories[0] &&
              collectionItem.categories.map((cat, i) => {
                return (
                  <div
                    key={i}
                    css={{
                      margin: `${rhythm(1 / 4)} ${rhythm(1 / 8)}`,
                      padding: `${rhythm(1 / 8)} ${rhythm(1 / 4)}`,
                      ...colors[funkyContrastCombo].style
                    }}
                  >
                    {cat}
                  </div>
                );
              })}
          </div>
        </div>
        <Html
          html={collectionItem.content.childMarkdownRemark.html}
          className="collectionItem--content"
        />
        {collectionItem.gallery && !hideGallery && (
          <BlockGallery
            block={blockGallery}
            colors={this.colors}
            location={this.props.location}
            // passCSS={}
          />
        )}
      </div>
    );
  }
}

export default ItemPageTemplate;

// TODO: query for metadata, style, options

export const itemPageQuery = graphql`
  query ItemPageTemplate($id: String!) {
    collectionItem: contentfulCollectionItem(id: { eq: $id }) {
      id
      type
      name
      featuredImage {
        id
        title
        description
        fluid(maxWidth: 1000, maxHeight: 1000, quality: 80) {
          base64
          aspectRatio
          src
          srcSet
          sizes
        }
      }
      datePublished
      dateLastEdit
      categories
      content {
        id
        childMarkdownRemark {
          id
          html
        }
      }
      gallery {
        id
        title
        description
        fluid(maxWidth: 1000, maxHeight: 1000, quality: 80) {
          base64
          aspectRatio
          src
          srcSet
          sizes
        }
      }
      metadata {
        internal {
          content
        }
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
      node_locale
      fields {
        menuName
        shortPath
        localizedPath
        locale
      }
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
`;
