import React, { Fragment } from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";

import { mapStyle } from "../utils/processCss";
import { metadata as siteMetadata } from "../utils/siteSettings.json";
import { rhythm, scale } from "../utils/typography";
import colors from "../utils/colors";
import internalJson from "../utils/internalJson";

import BlockFreeText from "../blocks/FreeText";
import BlockForm from "../blocks/Form";
import BlockGallery from "../blocks/Gallery";
import BlockReferences from "../blocks/References";
import Section from "../blocks/Section";

const randomNumber = () => Math.round(Math.random() * 10000);

// const Script = ({ script }) => {
//   const {
//     id,
//     name,
//     type = "text/javascript",
//     content: { content },
//     // charset, // src,
//     src,
//     charset: charSet
//     // ...srcAndCharset
//   } = script;
//
//   const scriptProps = {
//     id: `${name}-${randomNumber()}`,
//     type
//   };
//   // let scriptPropsString = `type="${type}" id="${name}-${randomNumber()}"`;
//   Object.entries({ src, charSet }).forEach(([attr, a]) => {
//     if (a) {
//       scriptProps[attr] = a;
//       // scriptPropsString += ` ${attr === "charSet" ? "charset" : attr}="${a}"`;
//     }
//   });
//   return (
//     <script
//       // defer
//       async
//       {...{
//         key: id,
//         ...scriptProps
//       }}
//     >
//       {`${content}`}
//     </script>
//   );
//   // return (
//   //   <script
//   //     async
//   //     {...{
//   //       ...scriptProps
//   //     }}
//   //     dangerouslySetInnerHTML={{
//   //       __html: `${content}`
//   //     }}
//   //   />
//   // );
//   // return (
//   //   <div
//   //     dangerouslySetInnerHTML={{
//   //       __html: `
//   //         <script ${scriptPropsString}>
//   //           ${content}
//   //         </script>
//   //         `
//   //     }}
//   //   />
//   // );
// };

class PageTemplate extends React.Component {
  constructor(props) {
    super(props);
    if (!props.data) return;
    // _json_ fields
    const {
      metadata: metadataData,
      options: optionsData,
      style: styleData,
      scripts,
      node_locale: pageLocale
    } = props.data.contentfulPage;

    this.metadata = internalJson(metadataData);
    this.optionsData = internalJson(optionsData);
    this.styleData = mapStyle(internalJson(styleData));

    // Colors
    let { colorPalettes, colorCombo } = this.optionsData;
    colorCombo = colorCombo
      ? colors[`${colorCombo}Combo`]
      : colors.classicCombo;
    colorPalettes = colorPalettes || colors.colorPalettes;
    const newColors = colors.computeColors(colorPalettes, colorCombo);
    this.colors = { ...colors, ...newColors };
  }

  render() {
    // console.log("PAGE TEMPLATE PROPS", this.props)
    const {
      classicCombo,
      contrastCombo,
      funkyCombo,
      funkyContrastCombo
    } = this.colors;
    // console.log(this.colors[classicCombo].style)
    const page = this.props.data.contentfulPage;
    const metadata = this.metadata;
    // TODO: Page Metadata. Watch out for duplicates. Use the same canonical url
    const { scripts } = page;

    const isSSR = typeof window === "undefined";

    return (
      <div
        className="page"
        css={{
          ...this.colors[classicCombo].style,
          ...this.styleData
        }}
      >
        <Helmet>
          <html lang={page.node_locale} />
          {metadata.title && <title>{metadata.title}</title>}
          {metadata.title && (
            <meta
              property="og:title"
              content={`${metadata.title} | ${siteMetadata.name}`}
            />
          )}
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
          )
          // IDEA: use fullPath in sitePage fields for canonical url
          }
          {// Object type: https://developers.facebook.com/docs/reference/opengraph#object-type
          metadata.ogType && (
            <meta property="og:type" content={metadata.ogType} />
          )}
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
                  // id: name,
                  id: `${page.path}-${name}-${randomNumber()}`,
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

        {page.blocks &&
          page.blocks.map((block, i) => {
            if (Object.keys(block).length < 1) {
              return null;
            }

            switch (block.__typename) {
              case `ContentfulSection`:
                return (
                  <Section
                    key={i}
                    block={block}
                    // customContentTypeList={this.props.data.customContentType}
                    colors={this.colors}
                    location={this.props.location}
                  />
                );
                break;
              case `ContentfulBlockFreeText`:
                return (
                  <BlockFreeText
                    key={block.id || i}
                    block={block}
                    colors={this.colors}
                    location={this.props.location}
                  />
                );
                break;
              case `ContentfulBlockForm`:
                return (
                  <BlockForm
                    key={block.id || i}
                    block={block}
                    colors={this.colors}
                    location={this.props.location}
                  />
                );
                break;
              case `ContentfulBlockGallery`:
                return (
                  <BlockGallery
                    key={block.id || i}
                    block={block}
                    colors={this.colors}
                    location={this.props.location}
                  />
                );
                break;
              case `ContentfulBlockReferences`:
                return (
                  <BlockReferences
                    key={block.id || i}
                    block={block}
                    colors={this.colors}
                    location={this.props.location}
                  />
                );
                break;
              default:
            }
          })}

        {/* {scripts &&
          scripts.map(script => <Script {...{ key: script.id, script }} />)} */}
      </div>
    );
  }
}

export default PageTemplate;

export const pageQuery = graphql`
  query PageTemplate($id: String!) {
    contentfulPage(id: { eq: $id }) {
      id
      node_locale
      path
      metadata {
        internal {
          content
        }
        # name
        # title
        # description
      }
      blocks {
        ...BlockFreeText
        ...BlockForm
        ...BlockGallery
        ...BlockReferences
        ...Section
      }
      options {
        internal {
          content
        }
        # colorPalettes
        # colorCombo
      }
      style {
        internal {
          content
        }
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

// blocks {
//   id
//   name
//   internal {
//     type
//   }
//   main {
//     id
//     childMarkdownRemark {
//       id
//       html
//       excerpt
//       timeToRead
//     }
//   }
//   options {
//     colorCombo
//   }
// }

// export const pageQuery = graphql`
//   query PageTemplate($slug: String!) {
//     markdownRemark(fields: { slug: { eq: $slug } }) {
//       html
//       excerpt
//       timeToRead
//       fields {
//         slug
//       }
//       frontmatter {
//         title
//         excerpt
//         date(formatString: "MMM D, YYYY")
//         rawDate: date
//         image {
//           childImageSharp {
//             resize(width: 1500, height: 1500) {
//               src
//             }
//           }
//         }
//         author {
//           id
//           bio
//           twitter
//           avatar {
//             childImageSharp {
//               responsiveResolution(width: 63, height: 63, quality: 75) {
//                 src
//                 srcSet
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `
