import React, { useState, useEffect, FormEvent } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

import api from "../../services/api";

import LogoImg from "../../assets/logo.svg";

import { Title, Form, Repositories, Error } from "./styles";

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    // Armazenando o valor do input
    const [newRepo, setNewRepo] = useState("");
    // Tratando os erros.
    const [inputError, setInputError] = useState("");

    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem(
            "@GithubExplorer:repositories",
        );

        if (storagedRepositories) {
            return JSON.parse(storagedRepositories);
        }
        return [];
    });

    // Salvando em local storage.
    useEffect(() => {
        localStorage.setItem(
            "@GithubExplorer:repositories",
            JSON.stringify(repositories),
        );
    }, [repositories]);

    async function handleAddRepository(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        // Adicionando um novo repositório, vindo da API do Github.
        // Previnindo o recarregamento da página.
        event.preventDefault();

        if (!newRepo) {
            setInputError("Digite o autor/nome do repositório.");
            return;
        }
        // console.log(newRepo);

        try {
            const response = await api.get<Repository>(`repos/${newRepo}`);
            // console.log(response.data);

            const repository = response.data;
            setRepositories([...repositories, repository]);

            // Limpando o input.
            setNewRepo("");
            setInputError("");
        } catch (err) {
            setInputError("Erro na busca por esse repositório.");
        }
    }

    return (
        <>
            <img src={LogoImg} alt="Github Explorer" />
            <Title>Explore repositórios no github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                    placeholder="Digite o nome do repositório"
                />
                <button type="submit">Pesquisar</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map((repository) => (
                    <Link
                        key={repository.full_name}
                        to={`/repositories/${repository.full_name}`}
                    >
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>

                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repositories>
        </>
    );
};

export default Dashboard;
