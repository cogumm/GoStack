import React from 'react';
import { FiLogIn } from "react-icons/fi";

import logo from "../../assets/logo.svg";
import { Container, Content, Background } from './styles';

const SignIn: React.FC = () => (
    <Container>
        <Content>
            <img src={logo} alt="GoBarber" />

            <form>
                <h1>Faça seu logon</h1>

                <input placeholder="E-mail" />
                <input type="password" placeholder="Senha" />

                <button type="submit">Entrar</button>
                <a href="#">Esqueci minha senha!</a>
            </form>

            <a href="#">
                <FiLogIn />
                Criar conta!
            </a>
        </Content>
        <Background />
    </Container>
);

export default SignIn;
