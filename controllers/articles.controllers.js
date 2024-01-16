const { fetchArticles } = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticles(article_id)
    .then((articles) => {
      res.send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
