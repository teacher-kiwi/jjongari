const { gql } = require("apollo-server-core");

const typeDefs = gql`
  type Query {
    jjong(id: Int!): Jjong
    jjongs(
      id: [Int]
      subject: String
      grade: String
      semester: String
      achievementId: String
      text: String
      sort: Point
    ): [Jjong]

    achievement(id: String!): Achievement
    achievements(grade: String, subject: String): [Achievement]
  }
`;

module.exports = typeDefs;
