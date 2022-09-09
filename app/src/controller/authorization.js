const { gql } = require("apollo-server-core");
const { achievement } = require("../config/prisma");
const jwt = require("jsonwebtoken");
const { v4: id } = require("uuid");

const resolvers = {
  Mutation: {
    auth: async (_, { token }, { author }) => {
      if (token) return token;
      const newToken = jwt.sign({ author: id() }, process.env.JWT_KEY);
      return newToken;
    },
  },
};

module.exports = { resolvers };
