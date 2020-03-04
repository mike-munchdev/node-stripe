'use strict';
require('dotenv').config();

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const helment = require('helmet');
const bodyParser = require('body-parser');
const http = require('http');

(async () => {
  const app = express();
  app.use(helment());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const typeDefs = require('./schemas/index');
  const resolvers = require('./resolvers/index');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true
  });

  server.applyMiddleware({ app, cors: false });

  const httpServer = http.createServer(app);

  const PORT = Number(process.env.PORT) || 4003;

  httpServer.listen({ port: PORT }, async () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();
