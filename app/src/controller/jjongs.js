const { gql } = require("apollo-server-core");
const { jjong, achievement } = require("../config/prisma");

const typeDefs = gql`
  type Jjong {
    id: Int
    subject: String
    grade: String
    semester: String
    text: String

    achievementId: String
    achievement: Achievement

    usages: Int
    likes: Int
    reports: Int
  }

  input postJjongInput {
    subject: String!
    grade: String!
    semester: String
    text: String!
    achievementId: String
  }

  input editJjongInput {
    subject: String
    grade: String
    semester: String
    text: String
    achievementId: String
  }
`;

const resolvers = {
  Query: {
    jjong: async (_, { id }) => await jjong.findUnique({ where: { id } }),

    jjongs: async (_, { id, subject, grade, semester, achievementId, text, sort }) => {
      try {
        let filterOpt = {};
        if (id) filterOpt.id = { in: id };
        if (subject) filterOpt.subject = subject;
        if (grade) filterOpt.grade = grade;
        if (semester) filterOpt.semester = semester;
        if (achievementId) filterOpt.achievementId = achievementId;

        let sortOpt = [];
        if (sort) sortOpt.push({ [sort]: "desc" });
        sortOpt.push({ id: "desc" });

        return await jjong.findMany({
          where: filterOpt,
          orderBy: sortOpt,
          include: { achievement: true },
        });
      } catch (err) {
        console.log(err);
      }
    },
  },

  Mutation: {
    postJjong: async (_, { input }, { author }) => {
      try {
        if (!author) throw new Error("토큰을 삭제해주세요.");
        return await jjong.create({ data: { ...input, author }, include: { achievement: true } });
      } catch (err) {
        throw err;
      }
    },

    editJjong: async (_, { id, input, point }, { author }) => {
      try {
        if (input) {
          if (point === "unlikes") input.likes = { increment: -1 };
          else if (point) input[point] = { increment: 1 };

          const { author: checkAuth } = await jjong.findUnique({ where: { id } });
          if (author === checkAuth) return await jjong.update({ where: { id }, data: input });
          else throw Error("수정 권한이 없습니다.");
        } else {
          if (point === "unlikes") input = { likes: { increment: -1 } };
          else if (point) input = { [point]: { increment: 1 } };
          return await jjong.update({ where: { id }, data: input });
        }
      } catch (err) {
        throw err;
      }
    },

    deleteJjong: async (_, { id }, { author }) => {
      try {
        const { author: checkAuth } = await jjong.findUnique({ where: { id } });
        if (author === checkAuth) return await jjong.delete({ where: { id } });
        else throw Error("삭제 권한이 없습니다.");
      } catch (err) {
        throw err;
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
