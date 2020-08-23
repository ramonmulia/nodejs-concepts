const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();

const verifyRepository = (request, response, next) => {
  const paramId = request.params.id;
  const index = repositories.findIndex(({ id }) => id === paramId);

  if(index < 0){
    return response.status(400).json({
      message: 'repository doesn\'t exist.'
    })
  }
  request.repositoryIndex = index;

  return next();
}

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const id = uuid();
  const repository = {
    id,
    likes: 0,
    ...request.body,
  };
  repositories.push(repository);
  response.status(201).json(repository);
});

app.put("/repositories/:id", verifyRepository, (request, response) => {
  const { title, url, techs } = request.body;
  const {repositoryIndex} = request;

  const repositoryUpdated = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  }
  repositories[repositoryIndex] = repositoryUpdated;
  response.status(200).json(repositoryUpdated);
});

app.delete("/repositories/:id", verifyRepository,  (request, response) => {
  const {repositoryIndex} = request;
  repositories.splice(repositoryIndex, 1);
  response.status(204).send();
});

app.post("/repositories/:id/like", verifyRepository, (request, response) => {
  const {repositoryIndex} = request;
  const {likes: currentLikes, ...props} = repositories[repositoryIndex];
  const likes =  currentLikes + 1;
  repositories[repositoryIndex] = {
    ...props,
    likes
  }

  response.status(201).json({likes});
});

module.exports = app;
