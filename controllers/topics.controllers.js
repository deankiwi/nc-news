const { fetchTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  return fetchTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
