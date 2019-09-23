const _ = require(`lodash`)
const Promise = require(`bluebird`)
const path = require(`path`)
const parseFilepath = require(`parse-filepath`)
const fs = require(`fs-extra`)
const slash = require(`slash`)
const slugify = require("slugify")
const crypto = require(`crypto`)
// const {
//   GraphQLObjectType,
//   GraphQLList,
//   GraphQLString,
//   GraphQLInt,
//   GraphQLEnumType
// } = require(`graphql`)

exports.onCreateNode = ({ node, boundActionCreators }) => {
  const { createNode, createNodeField } = boundActionCreators
  if (node.internal.type === "ContentfulSettings") {
    // console.log(node)
  }
  // if (node.path.match(/IGNORE/)) {
  //   console.log(node)
  // }
}
