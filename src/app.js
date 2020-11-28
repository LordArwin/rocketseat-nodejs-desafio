const express = require("express");
const cors = require("cors");
const { v4, validate } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;
  if (!validate(id)) {
    return response.status(400).json({ error: "Invalid id" });
  }
  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repo = {
    id: v4(),
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  };
  repositories.push(repo);
  return response.status(200).json(repo);
});

app.put("/repositories/:id",validateId,(request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repoIndex = repositories.findIndex((repo) => repo.id == id);
  if (repoIndex < 0) {
    return response.status(400).json({ error: "id not found" });
  }
  repositories[repoIndex].title = title;
  repositories[repoIndex].url = url;
  repositories[repoIndex].techs = techs;
  return response.status(200).json(repositories[repoIndex]);
});

app.delete("/repositories/:id", validateId,(request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex((repo) => repo.id == id);
  if (repoIndex < 0) {
    return response.status(400).json({ error: "id not found" });
  }
  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like",validateId,(request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex((repo) => repo.id == id);
  if (repoIndex < 0) {
    return response.status(400).json({ error: "id not found" });
  }
  repositories[repoIndex].likes += 1;
  return response.status(200).json(repositories[repoIndex]);
});

module.exports = app;
