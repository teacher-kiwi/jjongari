const { gql } = require("apollo-server-core");

const typeDefs = gql`
  enum Point {
    usages
    likes
    unlikes
    reports
  }
`;

module.exports = typeDefs;
