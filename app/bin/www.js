const { typeDefs, resolvers } = require("../src/config/schema");
const startApolloServer = require("../app");

startApolloServer("4000", typeDefs, resolvers);
