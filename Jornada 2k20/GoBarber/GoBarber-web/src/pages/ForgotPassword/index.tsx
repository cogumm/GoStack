import React, { useRef, useCallback, useState } from "react";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";

import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";

import api from "../../services/api";

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
    const [loading, setLoading] = useState(false);

    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();

    // const history = useHistory();

    const handleSubmit = useCallback(
        async (data: ForgotPasswordFormData) => {
            try {
                setLoading(true);

                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required("E-mail obrigatório.")
                        .email("Digite um e-mail válido."),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                // Recuperação de senha.
                await api.post("/password/forgot", {
                    email: data.email,
                });

                addToast({
                    type: "success",
                    title: "E-mail de recuperação enviado.",
                    description:
                        "E-mail de recuperação de senha enviado, chegue seu sua caixa de entrada ou spam.",
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
            } finally {
                setLoading(false);
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

                        <Button loading={loading} type="submit">
                            Recuperar
                        </Button>
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
