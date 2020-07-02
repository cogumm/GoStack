import React, { useCallback, useRef } from "react";
import { FiArrowLeft, FiMail, FiUser, FiLock } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";

import api from "../../services/api";

import { useToast } from "../../hooks/toast";

import getValidationErrors from "../../utils/getValidationErros";

import logo from "../../assets/logo.svg";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, AnimationContainer, Background } from "./styles";

interface SingUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    // console.log(formRef);

    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(
        async (data: SingUpFormData) => {
            // console.log(data);
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    name: Yup.string().required("Nome obrigatório."),
                    email: Yup.string()
                        .required("E-mail obrigatório.")
                        .email("Digite um e-mail válido."),
                    password: Yup.string().min(6, "No mínimo 6 digitos."),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await api.post("/users", data);

                // Se cadastrou com sucesso.
                history.push("/");

                addToast({
                    type: "success",
                    title: "Cadastro realizado.",
                    description:
                        "Você já pode realizar o seu logon no GoBarber!",
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);

                    return;
                }

                // Toast
                addToast({
                    type: "error",
                    title: "Erro no cadastro.",
                    description:
                        "Ocorreu um erro ao realizar o cadastro, tente novamente.",
                });
            }
        },
        [addToast, history],
    );

    return (
        <Container>
            <Background />
            <Content>
                <AnimationContainer>
                    <img src={logo} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça seu cadastro</h1>

                        <Input
                            name="name"
                            icon={FiUser}
                            placeholder="Seu nome"
                        />
                        <Input
                            name="email"
                            icon={FiMail}
                            placeholder="E-mail"
                        />
                        <Input
                            name="password"
                            icon={FiLock}
                            type="password"
                            placeholder="Senha"
                        />

                        <Button type="submit">Cadastrar</Button>
                    </Form>

                    <Link to="/">
                        <FiArrowLeft />
                        Voltar para entrar
                    </Link>
                </AnimationContainer>
            </Content>
        </Container>
    );
};

export default SignUp;
