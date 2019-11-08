// const fs = require("fs");

// exports.createSchemaCustomization = ({ actions }) => {
//   // by default saves to `schema.gql`
//   // const options = {
//   // path: `typedefs.graphql`,
//   // exclude: { types: [`TypeWeDontWant`] },
//   //   }
//   //
//   // Save the schema
//   //   actions.printTypeDefinitions({
//   //     path: "schema.gql",
//   //     exclude: {
//   //       plugins: ["gatsby-transformer-sharp"]
//   //     }
//   //   });
//   // Use an existing schema
//   actions.createTypes(fs.readFileSync(`schema.gql`, { encoding: `utf-8` }));
// };

// exports.onCreateNode = ({ node, actions }) => {
//   if (!/^ContentfulCollectionItem$|^ContentfulEvent$/.test(node.internal.type))
//     return null

//   const { createNode, deleteNode } = actions

//   const newNode = { ...node }
//   newNode.internal.type = 'CollectionItem'
//   // newNode.id = createNodeId(`airtable-${node.recordId}`)
//   // newNode.contentDigest = createContentDigest(nodeData)
//   delete newNode.internal.owner
//   delete newNode.fields

//   createNode(newNode)
//   deleteNode({ node })
// }

// exports.createResolvers = ({ createResolvers }) => {
//   const resolvers = {
//     Query: {
//       collectionItems: {
//         type: ['ContentfulCollectionItem'],
//         resolve(source, args, context, info) {
//           return context.nodeModel.runQuery({
//             query: {
//               filter: {
//                 receivedSwag: { eq: true },
//               },
//             },
//             type: 'ContributorJson',
//             firstOnly: false,
//           })
//         },
//       },
//     },
//   }
//   createResolvers(resolvers)
// }
