const express = require("express");
const server = express();

// Usando o json no express
server.use(express.json());

const users = ["Gabriel", "Henrique", "Juliana"];

// Middleware Global
server.use((req, res, next) => {
    // Cálculo do tempo da instrução
    console.time("Request");
    console.log(`Método: ${req.method}; URL: ${req.url}`);

    //return next();
    next();
    console.timeEnd("Request");
});

// Middleware local
function checkUserExists(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({ error: "Nome do usuário é requerido." });
    }

    return next();
}

// Middleware de rota
function checkUserInArray(req, res, next) {
    const user = users[req.params.index];
    if (!user) {
        return res.status(400).json({ error: "Usuário não existe." });
    }

    req.user = user;
    return next();
}

server.get("/users", (req, res) => {
    return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
    // Query params = ?teste=1
    //const name = req.query.name;
    //return res.json({ message: `Estou ${name}!` });

    // Route params = /users/1
    //const { index } = req.params;
    //return res.json({ message: `Buscando o usuário ${id}!` });

    // Request body = { "name": "Gabriel", "email": "gabriel@cogumm.net" }
    //return res.json(users[index]);

    return res.json(req.user);
});

// Criando um novo usuário
server.post("/users", checkUserExists, (req, res) => {
    const { name } = req.body;
    users.push(name);

    return res.json(users);
});

// Editar um usuário
server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;

    return res.json(users);
});

// Exclusão de um usuário
server.delete("/users/:index", checkUserInArray, (req, res) => {
    const { index } = req.params;

    users.splice(index, 1);

    return res.send();
});

server.listen(3000);
