const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const server = express();

server.use(cors());
server.use(express.json());

/**
 * TODO
 * Anotações no Notion
 */

const projects = [];

/**
 * Middleware de log.
 */
function logResquests(req, res, next) {
    const { method, url } = req;

    const logLabel = `[${method.toUpperCase()}] - ${url}`;

    console.time(logLabel);

    next();

    console.timeEnd(logLabel);
}

/**
 * Validação
 */
function validadeProjectId(req, res, next) {
    const { id } = req.params;

    if (!isUuid(id)) {
        return res.status(400).json({ error: "Invalid project ID." });
    }

    return next();
}

server.use(logResquests);

server.use("/projects/:id", validadeProjectId);

server.get("/projects", (req, res) => {
    const { title } = req.query;

    // console.log(title);

    const results = title
        ? projects.filter((project) => project.title.includes(title))
        : projects;

    return res.json(results);
});

server.post("/projects", (req, res) => {
    const { title, owner } = req.body;

    const project = { id: uuid(), title, owner };

    projects.push(project);

    return res.json(project);
});

server.put("/projects/:id", (req, res) => {
    const { id } = req.params;
    const { title, owner } = req.body;

    const projectIndex = projects.findIndex((project) => project.id === id);

    if (projectIndex < 0) {
        return res.status(400).json({ error: "Project not found." });
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return res.json(project);
});

server.delete("/projects/:id", (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex((project) => project.id === id);

    if (projectIndex < 0) {
        return res.status(400).json({ error: "Project not found." });
    }

    projects.splice(projectIndex, 1);

    return res.status(204).send();
});

server.listen(3001, () => {
    console.log("[Nível 01] - Conceitos NodeJS");
});
