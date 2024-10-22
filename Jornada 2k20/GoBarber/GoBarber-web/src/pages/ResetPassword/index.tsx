import React, { useRef, useCallback } from "react";
import { FiLock } from "react-icons/fi";
import * as Yup from "yup";
import { useHistory, useLocation } from "react-router-dom";

import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";

import api from "../../services/api";

import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErros";

import logo from "../../assets/logo.svg";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, AnimationContainer, Background } from "./styles";

interface ResetPasswordFormData {
    password: string;
    password_confirmation: string;
}

const ResetPassword: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();

    const history = useHistory();

    const location = useLocation();
    // console.log(location.search);

    const handleSubmit = useCallback(
        async (data: ResetPasswordFormData) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    password: Yup.string().required("Senha obrigatória."),
                    password_confirmation: Yup.string().oneOf(
                        [Yup.ref("password")],
                        "Senhas não são parecidas.",
                    ),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                const {password, password_confirmation} = data;
                const token = location.search.replace("?token=", "");

                if (!token) {
                    addToast({
                        type: "error",
                        title: "Token inválido.",
                        description:
                            "Token inválido ou inexistente.",
                    });

                    return;
                }

                await api.post("/password/reset", {
                    password,
                    password_confirmation,
                    token,
                });

                history.push("/");
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);

                    return;
                }

                addToast({
                    type: "error",
                    title: "Erro ao resetar senha.",
                    description:
                        "Ocorreu um erro ao tentar resetar sua senha, tente novamente.",
                });
            }
        },
        [addToast, history, location.search],
    );
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logo} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Resetar senha</h1>

                        <Input
                            name="password"
                            icon={FiLock}
                            type="password"
                            placeholder="Nova senha"
                        />
                        <Input
                            name="password_confirmation"
                            icon={FiLock}
                            type="password"
                            placeholder="Confirmar senha"
                        />

                        <Button type="submit">Alterar senha</Button>
                    </Form>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    );
};

export default ResetPassword;
