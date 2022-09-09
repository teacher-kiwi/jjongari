const enums = require("../controller/_enums");
const queries = require("../controller/_queries");
const mutations = require("../controller/_mutations");
const jjongs = require("../controller/jjongs");
const achievement = require("../controller/achievements");
const auth = require("../controller/authorization");

const typeDefs = [enums, queries, mutations, jjongs.typeDefs, achievement.typeDefs];
const resolvers = [jjongs.resolvers, achievement.resolvers, auth.resolvers];

module.exports = { typeDefs, resolvers };
