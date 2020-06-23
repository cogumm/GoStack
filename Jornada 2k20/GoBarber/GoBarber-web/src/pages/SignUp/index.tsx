import React from "react";
import { FiArrowLeft, FiMail, FiUser, FiLock } from "react-icons/fi";

import logo from "../../assets/logo.svg";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, Background } from "./styles";

const SignUp: React.FC = () => (
    <Container>
        <Background />
        <Content>
            <img src={logo} alt="GoBarber" />

            <form>
                <h1>Faça seu cadastro</h1>

                <Input name="name" icon={FiUser} placeholder="Seu nome" />
                <Input name="email" icon={FiMail} placeholder="E-mail" />
                <Input
                    name="password"
                    icon={FiLock}
                    type="password"
                    placeholder="Senha"
                />

                <Button type="submit">Cadastrar</Button>
            </form>

            <a href="a">
                <FiArrowLeft />
                Voltar para entrar
            </a>
        </Content>
    </Container>
);

export default SignUp;
