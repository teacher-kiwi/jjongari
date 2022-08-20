const { gql } = require("apollo-server-core");

const typeDefs = gql`
  type Jjong {
    _id: ID
  }
`;

const resolvers = {
  Query: {
    jjongs: () => ({ _id: "test" }),
  },
};

module.exports = { typeDefs, resolvers };
