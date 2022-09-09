const { gql } = require("apollo-server-core");
const { achievement } = require("../config/prisma");

const typeDefs = gql`
  type Achievement {
    id: String!
    subject: String!
    grade: [String!]!
    text: String!
  }
`;

const resolvers = {
  Query: {
    achievement: async (_, { id }) => await achievement.findUnique({ where: { id } }),
    achievements: async (_, { grade, subject }) => {
      if (grade && subject)
        return await achievement.findMany({ where: { grade: { has: grade }, subject }, orderBy: [{ id: "asc" }] });
      else if (grade) return await achievement.findMany({ where: { grade: { has: grade } } });
      else if (subject) return await achievement.findMany({ where: { subject } });
      else return await achievement.findMany();
    },
  },

  // Mutation: {
  //   postAchievement: async (_, { id, subject, grade, text }) =>
  //     await achievement.create({ data: { id, subject, grade, text } }),
  // },
};

module.exports = { typeDefs, resolvers };
