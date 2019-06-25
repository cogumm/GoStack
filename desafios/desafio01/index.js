const express = require("express");
const server = express();

// Usando o json no express
server.use(express.json());

const projects = [];
let numberOfRequests = 0;

// Middleware que checa se o projeto existe
function checkProjectExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id === id);

    if (!project) {
        return res.status(400).json({ error: "Projeto não encontrado!" });
    }

    return next();
}

// Middleware que dá log no número de requisições
function logRequests(req, res, next) {
    numberOfRequests++;
    console.log(`Número de requisições: ${numberOfRequests}`);
    return next();
}
// Imprimindo o Middleware do log das requisições
server.use(logRequests);

// Listando os projetos
server.get("/projects", (req, res) => {
    return res.json(projects);
});

// Criando um novo projeto
server.post("/projects", (req, res) => {
    const { id, title } = req.body;
    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.json(project);
});

// Editando um projeto
server.put("/projects/:id", checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const project = projects.find(p => p.id === id);

    project.title = title;

    return res.json(project);
});

// Excluindo um projeto
server.delete("/projects/:id", checkProjectExists, (req, res) => {
    const { id } = req.params;
    const projectIndex = projects.findIndex(p => p.id === id);

    projects.splice(projectIndex, 1);

    return res.send();
});

// Criando as tasks
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
    const { id } = req.params;
    const task = req.body.title;
    const project = projects.find(p => p.id === id);

    project.tasks.push(task);

    return res.json(project);
});
// Rodando na porta 3000
server.listen(3000, () => {
    console.log("Servidor inicializado com sucesso na porta 3000");
});
