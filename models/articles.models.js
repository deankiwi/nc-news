const db = require("../db/connection");

exports.fetchArticles = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
  WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article_id not found",
        });
      }
      return rows;
    });
};

// author, title, article_id, body, topic, created_at, votes, article_img_url
