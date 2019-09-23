import React from 'react'
import { graphql } from 'gatsby'

import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

const Bold = ({ children }) => <span className="bold">{children}</span>
const Text = ({ children }) => <p className="align-center">{children}</p>

const CustomComponent = ({ name }) => {
  return (
    <div>
      <h2>{name['en-US']}</h2>
    </div>
  )
}

const options = {
  renderMark: {
    [MARKS.BOLD]: text => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
    [BLOCKS.EMBEDDED_ENTRY]: node => {
      const { target } = node?.data
      const { name } = target?.fields
      const contentType = target?.sys?.contentType?.sys?.id
      console.log(contentType)
      return <CustomComponent {...{ name }} />
    },
  },
}

const IndexPage = props => {
  const jsonData = props.pageResources.json.data
  console.log(jsonData)

  const docs = props.data.allContentfulDocument.nodes.map(doc => {
    // console.log(doc)
    const content =
      doc.content &&
      doc.content.json &&
      documentToReactComponents(doc.content.json, options)
    return {
      ...doc,
      content,
    }
  })
  return <div>{docs.map(doc => doc.content)}</div>
  //   return 'hello'
}

export default IndexPage

export const pageQuery = graphql`
  query IndexPage {
    contentfulDocument(pageInfo: { path: { eq: "/" } }) {
      id
      content {
        content
        json
      }
    }
  }
`
