const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsForArticle,
  checkArticleIdExists,
} = require("../models/articles.models");

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
  fetchArticles()
    .then((articles) => {
      res.send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;

  const fetchCommentQuery = fetchCommentsForArticle(article_id);
  const checkIdExists = checkArticleIdExists(article_id);

  const queries = [fetchCommentQuery, checkIdExists];

  Promise.all(queries)
    .then((response) => {
      comments = response[0];
      res.send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
