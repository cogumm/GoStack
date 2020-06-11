import React, { useState, useEffect } from "react";
import api from "./services/api";

import "./App.css";

import Header from "./components/Header";

function App() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        api.get("/projects").then((res) => {
            // console.log(res);
            setProjects(res.data);
        });
    }, []);

    async function handleAddProject() {
        // projects.push(`Novo projeto ${Date.now()}`);
        // console.log(projects);

        // setProjects([...projects, `Novo projeto ${Date.now()}`]);
        const res = await api.post("/projects", {
            title: `Novo projeto ${Date.now()}`,
            owner: "Gabriel Vilar",
        });

        const project = res.data;

        setProjects([...projects, project]);
    }

    return (
        <>
            <Header title="Projects" />

            <button type="button" onClick={handleAddProject}>
                Adicionar projeto
            </button>

            <ul>
                {projects.map((project) => (
                    <li key={project.id}>{project.title}</li>
                ))}
            </ul>
        </>
    );
}

export default App;
