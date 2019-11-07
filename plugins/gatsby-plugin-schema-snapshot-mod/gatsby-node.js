const fs = require("fs");

exports.createSchemaCustomization = ({ actions }) => {
  // by default saves to `schema.gql`
  // const options = {
  // path: `typedefs.graphql`,
  // exclude: { types: [`TypeWeDontWant`] },
  //   }
  //
  // Save the schema
  actions.printTypeDefinitions({
    path: `schema.gql`
  });
  // Use an existing schema
  actions.createTypes(fs.readFileSync(`schema.gql`, { encoding: `utf-8` }));
};

// -----------------------------------

// const fs = require(`fs`);
// const path = require(`path`);

// exports.createSchemaCustomization = ({ actions, reporter }, options = {}) => {
//   const { createTypes, printTypeDefinitions } = actions;

//   if (!printTypeDefinitions) {
//     reporter.error(
//       `\`gatsby-plugin-schema-snapshot\` needs Gatsby v2.13.55 or above.`
//     );
//     return;
//   }

//   const filePath = path.resolve(options.path || `schema.gql`);

//   try {
//     if (fs.existsSync(filePath)) {
//       reporter.info(`Reading GraphQL type definitions from ${filePath}`);
//       const schema = fs.readFileSync(filePath, { encoding: `utf-8` });

//       createTypes(schema, { name: `default-site-plugin` });

//       if (options.update) {
//         fs.unlinkSync(filePath);
//         printTypeDefinitions(options);
//       }
//     } else {
//       printTypeDefinitions(options);
//     }
//   } catch (error) {
//     reporter.error(
//       `The plugin \`gatsby-plugin-schema-snapshot\` encountered an error`,
//       error
//     );
//   }
// };
