const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getEndPoints } = require("./controllers/api.controllers");
const { getArticles } = require("./controllers/articles.controllers");
const {
  customErrorHandler,
  psqlErrorHandler,
  serverErrorHandler,
} = require("./error-handlers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndPoints);

app.get("/api/articles/:article_id", getArticles);

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
