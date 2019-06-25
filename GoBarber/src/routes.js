import { Router } from "express";
const routes = new Router();

routes.get("/", (req, res) => {
    return res.json({ message: "Estou vivo!!" });
});

export default routes;
