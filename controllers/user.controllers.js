const users = require("../db/data/test-data/users");
const { fetchUsers } = require("../models/user.models");

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.send({ users });
  });
};
