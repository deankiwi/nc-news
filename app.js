const express = require("express");
const cors = require('cors')

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
const { getUsers } = require("./controllers/user.controllers");

const {
  customErrorHandler,
  psqlErrorHandler,
  serverErrorHandler,
} = require("./error-handlers");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/topics", getTopics);

app.get("/api", getEndPoints);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticlesVotes);

app.get("/api/articles/:article_id/comments", getCommentsForArticle);

app.post("/api/articles/:article_id/comments", postCommentToArticleId);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
