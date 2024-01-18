const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
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

exports.fetchArticles = () => {
  return db
    .query(
      `
SELECT 
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.article_id) AS comment_count
FROM 
    articles
LEFT JOIN 
    comments ON articles.article_id = comments.article_id
GROUP BY
    articles.article_id
ORDER BY articles.created_at DESC;
`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchCommentsForArticle = (article_id) => {
  const checkForID = checkArticleIdExists(article_id);

  const fetchComments = db
    .query(
      `
SELECT
    comment_id,
    votes,
    created_at,
    author,
    body, 
    article_id
FROM 
    comments
WHERE
    article_id = $1
ORDER BY created_at DESC;
`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });

  return Promise.all([checkForID, fetchComments]).then((response) => {
    return response[1];
  });
};

const checkArticleIdExists = (article_id) => {
  return db
    .query(
      `
SELECT 
    article_id 
FROM 
    articles
WHERE
    article_id = $1;
  `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article_id not found",
        });
      }
    });
};

exports.insertComment = (author, body, article_id) => {
  return db
    .query(
      `
INSERT INTO comments 
    (author, body, article_id)
VALUES
    ($1,$2,$3)
RETURNING comment_id, body, article_id, author, votes, created_at;
`,
      [author, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticleVote = (article_id, inc_votes) => {
  //TODO add in check if article_id works
  const checkForID = checkArticleIdExists(article_id);
  const updateVotes = db
    .query(
      `
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING  author, title, article_id, topic, created_at, votes, article_img_url, body;
    `,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      return rows[0];
    });
  return Promise.all([checkForID, updateVotes]).then((response) => {
    return response[1];
  });
};
