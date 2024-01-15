const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server error");
});

module.exports = app;
