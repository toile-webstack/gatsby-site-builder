// exports.onCreateNode = ({ node, actions }) => {
//   if (node.internal.type.match(/contentful|Contentful/)) {
//     // if (node.internal.mediaType === 'application/json') {
//     // if (node.internal.type.match(/form|Form/)) {
//     if (node.internal.type.match('JsonNode')) {
//       // console.log(node)
//     }
//   }
// }

// exports.sourceNodes = function sourceNodes({ actions }) {
//   const { createTypes, ...rest } = actions
//   console.log(rest)
//   createTypes(`
//     type contentfulBlockFormFormJsonNode implements Node @dontInfer {
//       id: ID!
//       fields: String
//     }
//     type contentfulTestimonialsOptionsJsonNode implements Node @dontInfer {
//       id: ID!
//     }

//   `)
// }

// exports.createSchemaCustomization = ({ actions, schema }) => {
//   const { createTypes } = actions

//   const typeDefs = [
//     `
//     type contentfulBlockFormFormJsonNode implements Node @dontInfer {
//       id: ID!
//     }
//     type ContentfulCollectionItem implements Node @infer {
//       author: String!
//       datePublished: Date! @dateformat
//       dateLastEdit: Date! @dateformat
//       categories: [String!]!
//     }
//     type ContentfulScript implements Node @infer {
//         name: String!
//         type: String!
//         src: String!
//         charset: String!
//     }
//     `,
//   ]

//   createTypes(typeDefs)
// }

// exports.createSchemaCustomization = ({ actions, schema }) => {
//   const { createFieldExtension, createTypes } = actions

//   createFieldExtension({
//     name: 'translations',
//     extend(options, prevFieldConfig) {
//       return {
//         resolve(source, args, context, info) {
//           // TODO: there must be a better way to get the previous value
//           const { fieldName } = info
//           const prevValue = source[fieldName]

//           const getTranslation = (word, lang = 'English') =>
//             context.nodeModel
//               .getAllNodes({ type: 'Translation' })
//               .find(t => t[lang] === word)

//           return Array.isArray(prevValue)
//             ? prevValue.map(val => getTranslation(val))
//             : getTranslation(prevValue)
//         },
//       }
//     },
//   })

//   const typeDefs = [
//     `
//       type Exhibitor implements Node @infer {
//         animations: [Animation] @link(by: "recordId")
//         boardgames: [Boardgame] @link(by: "recordId")
//         guests: [Guest]! @link(by: "recordId")

//         # category: Translation @translations
//         place: String
//       }

//       type Animation implements Node @infer {
//         exhibitors: [Exhibitor] @link(by: "recordId")
//         boardgames: [Boardgame] @link(by: "recordId")
//         guests: [Guest]! @link(by: "recordId")
//         complexSchedule: [ComplexSchedule] @link(by: "recordId")
//         # Categories: [Translation] @translations
//         # Days: [Translation] @translations
//         # TournamentRules: [Translation] @translations
//       }
//       type ComplexSchedule implements Node @infer {
//         Animations: [Animation]! @link(by: "recordId")
//       }
//       type Boardgame implements Node @infer {
//         exhibitors: [Exhibitor] @link(by: "recordId")
//         animations: [Animation] @link(by: "recordId")
//         # authors: [Guest] @link(by: "recordId")
//         # illustrators: [Guest] @link(by: "recordId")
//       }
//       type Guest implements Node @infer {
//         exhibitors: [Exhibitor] @link(by: "recordId")
//         animations: [Animation] @link(by: "recordId")
//         authorsOf: [Guest] @link(by: "recordId")
//         illustratorsOf: [Guest] @link(by: "recordId")
//       }
//       type Translation implements Node @infer {
//         identifier: String!
//       }
//       `,

//     // type Translation implements Node @infer {
//     //   animations: [Animation] @link(by: "categories")
//     // }

//     // schema.buildObjectType({
//     //   name: 'Animation',
//     //   interfaces: ['Node'],
//     //   extensions: {
//     //     infer: true,
//     //   },
//     //   fields: {
//     //     cats: {
//     //       type: '[Translation]',
//     //       resolve: (source, args, context, info) => {
//     //         const { Categories = [] } = source

//     //         return Categories.map(cat =>
//     //           context.nodeModel
//     //             .getAllNodes({ type: 'Translation' })
//     //             .find(t => t.English === cat),
//     //         )
//     //       },
//     //     },
//     //   },
//     // }),

//     // schema.buildObjectType({
//     //   name: 'Exhibitor',
//     //   interfaces: ['Node'],
//     //   // extensions: {
//     //   //     // While in SDL we have two different directives, @infer and @dontInfer to
//     //   //    // control inference behavior, Gatsby Type Builders take a single `infer`
//     //   //    // extension which accepts a Boolean
//     //   //    infer: false
//     //   //  },
//     //   fields: {
//     //     PeoplesId: {
//     //       type: 'Guest',
//     //       resolve: (source, args, context, info) => {
//     //         console.log(source)
//     //         // If we were linking by ID, we could use `getNodeById` to
//     //         // find the correct author:
//     //         return context.nodeModel.getNodeById({
//     //           id: source.PeoplesId___NODE,
//     //           type: 'Guest',
//     //         })
//     //         // But since we are using the author email as foreign key,
//     //         // we can use `runQuery`, or simply get all author nodes
//     //         // with `getAllNodes` and manually find the linked author
//     //         // node:
//     //         // return context.nodeModel
//     //         //   .getAllNodes({ type: 'AuthorJson' })
//     //         //   .find(author => author.email === source.author)
//     //       },
//     //     },
//     //   },
//     // }),
//     // schema.buildObjectType({
//     //   name: 'Animation',
//     //   interfaces: ['Node'],
//     //   fields: {
//     //     PeoplesId: {
//     //       type: 'Guest',
//     //       resolve: (source, args, context, info) => {
//     //         console.log(source)
//     //         return context.nodeModel.getNodeById({
//     //           id: source.PeoplesId___NODE,
//     //           type: 'Guest',
//     //         })
//     //       },
//     //     },
//     //   },
//     // }),
//   ]
//   createTypes(typeDefs)
// }
