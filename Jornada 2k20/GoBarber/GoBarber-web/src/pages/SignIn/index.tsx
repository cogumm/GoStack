import React, { useRef, useCallback } from "react";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import * as Yup from "yup";

import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";

import { useAuth } from "../../hooks/auth";
import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErros";

import logo from "../../assets/logo.svg";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, Background } from "./styles";

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    // Hook de context
    const { singIn } = useAuth();
    // console.log(auth);
    // console.log(user);
    const { addToast } = useToast();

    const handleSubmit = useCallback(
        async (data: SignInFormData) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required("E-mail obrigatório.")
                        .email("Digite um e-mail válido."),
                    password: Yup.string().required("Senha obrigatória."),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await singIn({
                    email: data.email,
                    password: data.password,
                });
            } catch (err) {
                // console.log(err);

                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                }

                // Toast
                addToast({
                    type: "error",
                    title: "Erro na autenticação.",
                    description:
                        "Ocorreu um erro ao realizar o login, cheque as credenciais.",
                });
            }
        },
        [singIn, addToast],
    );
    return (
        <Container>
            <Content>
                <img src={logo} alt="GoBarber" />

                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Faça seu logon</h1>

                    <Input name="email" icon={FiMail} placeholder="E-mail" />
                    <Input
                        name="password"
                        icon={FiLock}
                        type="password"
                        placeholder="Senha"
                    />

                    <Button type="submit">Entrar</Button>
                    <a href="a">Esqueci minha senha!</a>
                </Form>

                <a href="a">
                    <FiLogIn />
                    Criar conta!
                </a>
            </Content>
            <Background />
        </Container>
    );
};

export default SignIn;
