// TODO move all check exists functions in /models folder to here

const db = require("../db/connection");

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT slug FROM topics WHERE slug = $1;`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "topic not found" });
      }
    });
};
