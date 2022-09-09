const { gql } = require("apollo-server-core");

const typeDefs = gql`
  type Mutation {
    postJjong(input: postJjongInput!): Jjong!
    editJjong(id: Int!, input: editJjongInput, point: Point): Jjong!
    deleteJjong(id: Int!): Jjong

    # postAchievement(id: String!, subject: String!, grade: [String!]!, text: String!): Achievement!

    auth(token: String): String
  }
`;

module.exports = typeDefs;
