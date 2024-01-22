const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsForArticle,
  insertComment,
  updateArticleVote,
} = require("../models/articles.models");

const { checkTopicExists } = require("../utills/check-exists");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((articles) => {
      res.send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;

  fetchArticles(topic)
    .then((articles) => {
      queries = [articles];
      if (articles.length === 0) {
        queries.push(checkTopicExists(topic));
      }
      return Promise.all(queries).then(() => {
        // const articles = response[0];
        res.send({ articles });
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;

  fetchCommentsForArticle(article_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentToArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertComment(username, body, article_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticlesVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleVote(article_id, inc_votes)
    .then((articles) => {
      res.send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
