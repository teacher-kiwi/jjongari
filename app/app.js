const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } = require("apollo-server-core");
const express = require("express");
const http = require("http");

async function startApolloServer(port, typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();

  server.applyMiddleware({ app });

  app.get("/", (req, res) => {
    res.send("hello wolrd!!");
  });
  app.get("*", (req, res) => {
    res.send("page not found");
  });
  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

module.exports = startApolloServer;
