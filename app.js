const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getEndPoints } = require("./controllers/api.controllers");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controllers");
const {
  customErrorHandler,
  psqlErrorHandler,
  serverErrorHandler,
} = require("./error-handlers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndPoints);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
