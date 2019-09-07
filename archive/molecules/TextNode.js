import React from "react"
import { rhythm, scale } from "../utils/typography"

class TextNode extends React.Component {
  render() {
    return (
      <div
        css={{
          ...scale(-0.2),
          lineHeight: rhythm(0.8),
          margin: `auto`,
          display: `flex`,
          flexFlow: `column`,
          "> div": {
            display: `flex`,
            flexFlow: `row wrap`,
            justifyContent: `center`,
            " > *": {
              margin: `0 5px`
            }
          }
        }}
      >
        HELLO
      </div>
    )
  }
}

export default TextNode

// export const itemPageQuery = graphql`
//   query TextNode($id: String!) {
//     collectionItem: toileCollectionItem(id: { eq: $id }) {
//
//   }
// `
