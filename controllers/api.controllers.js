const { fetchEndPoints } = require("../models/api.models");

exports.getEndPoints = (req, res, next) => {
  res.send(fetchEndPoints());
};
