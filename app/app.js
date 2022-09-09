const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } = require("apollo-server-core");
const express = require("express");
const http = require("http");
const path = require("path");

const jwt = require("jsonwebtoken");

async function startApolloServer(port, typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    context: async ({ req }) => {
      try {
        const token = req.headers.authorization;
        return await jwt.verify(token, process.env.JWT_KEY);
      } catch (err) {
        return { author: null };
      }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();

  server.applyMiddleware({ app });

  app.use(express.static(path.join(__dirname, "src/views/jjongari-front/build")));

  app.get("/", (req, res) => {
    console.log(req.get("Referrer"));
    res.sendFile(path.join(__dirname, "src/views/jjongari-front/build/index.html"));
  });
  app.get("*", (req, res) => {
    res.send("page not found");
  });
  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

module.exports = startApolloServer;
