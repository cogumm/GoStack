const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findIndexRepository(id) {
    const repositoryIndex = repositories.findIndex((rep) => rep.id === id);

    return repositoryIndex;
}

app.get("/repositories", (req, res) => {
    return res.json(repositories);
});

app.post("/repositories", (req, res) => {
    const { title, url, techs } = req.body;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0,
    };

    repositories.push(repository);

    return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
    const { id } = req.params;
    const { title, url, techs } = req.body;

    const repositoryIndex = findIndexRepository(id);

    if (repositoryIndex < 0) {
        return res.status(400).json({ error: "Repository is not exist." });
    }

    repositories[repositoryIndex] = {
        id,
        title: title ? title : repositories[repositoryIndex].title,
        url: url ? url : repositories[repositoryIndex].url,
        techs: techs ? techs : repositories[repositoryIndex].techs,
        likes: repositories[repositoryIndex].likes,
    };

    return res.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (req, res) => {
    const { id } = req.params;

    const repositoryIndex = findIndexRepository(id);

    if (repositoryIndex < 0) {
        return res.status(400).json({ error: "Repository does not exists." });
    }

    repositories.splice(repositoryIndex, 1);

    return res.status(204).send();
});

app.post("/repositories/:id/likes", (req, res) => {
    const { id } = req.params;

    const repositoryIndex = findIndexRepository(id);

    if (repositoryIndex < 0) {
        return res.status(400).json({ error: "Repository does not exists." });
    }

    repositories[repositoryIndex].likes += 1;

    return res.json(repositories[repositoryIndex]);
});

module.exports = app;
