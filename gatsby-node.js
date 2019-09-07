const fs = require('fs')

exports.createSchemaCustomization = ({ actions }) => {
  // by default saves to `schema.gql`
  // options: {
  // path: `typedefs.graphql`,
  // exclude: { types: [`TypeWeDontWant`] },
  //   }

  //   actions.printTypeDefinitions({})
  actions.createTypes(fs.readFileSync(`schema.gql`, { encoding: `utf-8` }))
}
