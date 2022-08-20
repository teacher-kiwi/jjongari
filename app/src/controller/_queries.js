const { gql } = require("apollo-server-core");

const typeDefs = gql`
  type Query {
    jjongs: [Jjong]
  }
`;

module.exports = typeDefs;
