import React from 'react'
// import { graphql } from 'gatsby'

// import Page from '../Site/Page'
import PageTree from '../components/PageTree'
// import Site from '../Site'

const TemplatePage = ({
  // data: { contentfulPage: page } = {},
  location,
  // children,
  path,
  pageContext: {
    settings: settingsJson,
    page: pageJson,
    locale: { code: locale },
    locales,
  } = {},
}) => {
  const page = JSON.parse(pageJson)
  const settings = JSON.parse(settingsJson)

  if (!page?.path) return null
  return <PageTree {...{ page, settings, locale, locales, location, path }} />
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
