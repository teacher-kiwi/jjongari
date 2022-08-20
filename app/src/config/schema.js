const query = require("../controller/_queries");
const jjongs = require("../controller/jjongs");

const typeDefs = [query, jjongs.typeDefs];
const resolvers = [jjongs.resolvers];

module.exports = { typeDefs, resolvers };
