import React from 'react'
// import { graphql } from 'gatsby'

import Page from '../Site/Page'

const TemplatePage = ({
  // data: { contentfulPage: page } = {},
  location,
  // children,
  path,
  pageContext: {
    // settings: settingsData,
    page: pageData,
    locale: { code: locale },
    locales,
  } = {},
}) => {
  const page = JSON.parse(pageData)

  if (!page.path) return null
  return <Page {...{ data: page, locale, locales, location, path }} />
}

export default TemplatePage

// export const pageQuery = graphql`
//   query PageTemplate($id: String!) {
//     contentfulPage(id: { eq: $id }) {
//       id
//       node_locale
//       path
//       metadata {
//         internal {
//           content
//         }
//         # name
//         # title
//         # description
//       }
//       blocks {
//         ...BlockFreeText
//         ...BlockForm
//         ...BlockGallery
//         ...BlockReferences
//         ...Section
//       }
//       options {
//         internal {
//           content
//         }
//         # colorPalettes
//         # colorCombo
//       }
//       style {
//         internal {
//           content
//         }
//       }
//       scripts {
//         id
//         name
//         type
//         src
//         charset
//         content {
//           id
//           content
//         }
//       }
//     }
//   }
// `
