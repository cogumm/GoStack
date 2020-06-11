import React, { useEffect, useState } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
    const [repositories, setRepositories] = useState([]);

    // Adicionando nomes aos repositórios
    const repositoryName = repositories.length + 1;

    useEffect(() => {
        api.get("/repositories").then((res) => {
            setRepositories(res.data);
        });
    }, []);

    /**
     * Função para adicionar um novo repositório
     */
    async function handleAddRepository() {
        api.post("/repositories", {
            title: `Repository ${repositoryName}`,
            url: "https://github.com",
            techs: [],
        }).then((res) => {
            setRepositories([...repositories, res.data]);
        });
    }

    /**
     * Função para renover repositório
     * @param {*} id
     */
    async function handleRemoveRepository(id) {
        api.delete(`/repositories/${id}`).then((res) => {
            const repos = repositories.filter((repo) => repo.id !== id);
            setRepositories(repos);
        });
    }

    return (
        <>
            <ul data-testid="repository-list">
                {repositories.map((repository) => (
                    <li key={repository.id}>
                        {repository.title}
                        <button
                            onClick={() =>
                                handleRemoveRepository(repository.id)
                            }
                        >
                            Remover
                        </button>
                    </li>
                ))}
            </ul>

            <button onClick={handleAddRepository}>Adicionar</button>
        </>
    );
}

export default App;
