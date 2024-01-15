const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getEndPoints } = require("./controllers/api.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndPoints);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server error");
});

module.exports = app;
