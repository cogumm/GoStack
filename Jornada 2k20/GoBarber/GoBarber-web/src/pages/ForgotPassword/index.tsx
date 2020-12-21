import React, { useRef, useCallback } from "react";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";

import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";

import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErros";

import logo from "../../assets/logo.svg";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, AnimationContainer, Background } from "./styles";

interface ForgotPasswordFormData {
    email: string;
}

const ForgotPassword: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();

    // const history = useHistory();

    const handleSubmit = useCallback(
        async (data: ForgotPasswordFormData) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required("E-mail obrigatório.")
                        .email("Digite um e-mail válido."),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                // history.push("/dashboard");
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);

                    return;
                }

                // Toast
                addToast({
                    type: "error",
                    title: "Erro na recuperação de senha.",
                    description:
                        "Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.",
                });
            }
        },
        [addToast],
    );
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logo} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Recuperar senha</h1>

                        <Input
                            name="email"
                            icon={FiMail}
                            placeholder="E-mail"
                        />

                        <Button type="submit">Recuperar</Button>
                    </Form>

                    <Link to="/">
                        <FiArrowLeft />
                        Voltar para entrar
                    </Link>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    );
};

export default ForgotPassword;
