require('dotenv').config()
// const settings = require("./src/utils/siteSettings.json");

const analyticsId = process.env.analyticsTrackingId

module.exports = {
  siteMetadata: {
    siteUrl: process.env.URL,
  },
  plugins: [
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.contentfulSpaceID,
        accessToken: process.env.contentfulAccessToken,
      },
    },
    `gatsby-plugin-layout`,
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        // color: `tomato`,
        // Disable the loading spinner.
        showSpinner: false,
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          // {
          //   resolve: `gatsby-remark-images`,
          //   options: {
          //     // It's important to specify the maxWidth (in pixels) of
          //     // the content container as this plugin uses this as the
          //     // base for generating different widths of each image.
          //     maxWidth: 500,
          //     // backgroundColor: `transparent`,
          //     quality: 100,
          //     // Remove the default behavior of adding a link to each
          //     // image.
          //     linkImagesToOriginal: false
          //   }
          // },
          // {
          //   resolve: `gatsby-remark-responsive-iframe`,
          //   options: {
          //     wrapperStyle: `margin-bottom: 1.05rem`
          //   }
          // },
          // `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          // `gatsby-remark-autolink-headers`,
          `gatsby-remark-emoji`,
          {
            resolve: 'gatsby-remark-external-links',
            // options: {
            //   target: "_blank",
            //   rel: "nofollow noopener noreferrer"
            // }
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-emotion`,
      options: {
        // Accepts all options defined by `babel-plugin-emotion` plugin.
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-catch-links`,
    {
      resolve: `gatsby-plugin-sitemap`,
    },
    ...(analyticsId
      ? [
          {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
              trackingId: analyticsId,
            },
          },
        ]
      : []),
    // `toile-ignores`,
    `toile-siteSettings`,
    `toile-pages`,
    `toile-customContentType`,
    {
      resolve: `gatsby-plugin-schema-snapshot`,
      options: {
        path: `schema.gql`,
        update: process.env.GATSBY_UPDATE_SCHEMA_SNAPSHOT,
      },
    },
    // `gatsby-plugin-netlify-cache`,
    `gatsby-plugin-remove-fingerprints`,
    // `gatsby-plugin-netlify`,
  ],
}
