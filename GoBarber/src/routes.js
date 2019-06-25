const { Router } = require("express");
const routes = new Router();

routes.get("/", (req, res) => {
    return res.json({ message: "Estou vivo!" });
});

module.exports = routes;
