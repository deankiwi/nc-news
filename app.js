const express = require("express");

const { getTopics } = require("./controllers/topics.controllers");
const { getEndPoints } = require("./controllers/api.controllers");
const {
  getArticleById,
  getArticles,
  getCommentsForArticle,
  postCommentToArticleId,
  patchArticlesVotes,
} = require("./controllers/articles.controllers");
const { deleteComment } = require("./controllers/comments.controllers");

const {
  customErrorHandler,
  psqlErrorHandler,
  serverErrorHandler,
} = require("./error-handlers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndPoints);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticlesVotes);

app.get("/api/articles/:article_id/comments", getCommentsForArticle);

app.post("/api/articles/:article_id/comments", postCommentToArticleId);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
