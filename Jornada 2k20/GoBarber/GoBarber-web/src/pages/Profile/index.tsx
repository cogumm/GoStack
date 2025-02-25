import React, { ChangeEvent, useCallback, useRef } from "react";
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";

import api from "../../services/api";

import { useToast } from "../../hooks/toast";
import { useAuth } from "../../hooks/auth";

import getValidationErrors from "../../utils/getValidationErros";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, AvatarInput } from "./styles";

interface ProfileFormData {
    name: string;
    email: string;
    password: string;
    old_password: string;
    password_confirmation: string;
}

const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();
    const history = useHistory();

    // Retornando os dados do usuário logado.
    const { user, updateUser } = useAuth();

    const handleSubmit = useCallback(
        async (data: ProfileFormData) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    name: Yup.string().required("Nome obrigatório."),
                    email: Yup.string()
                        .required("E-mail obrigatório.")
                        .email("Digite um e-mail válido."),
                    password: Yup.string().when("old_password", {
                        is: val => !!val.length,
                        then: Yup.string().required("Campo obrigatório."),
                        otherwise: Yup.string(),
                    }),
                    old_password: Yup.string(),
                    password_confirmation: Yup.string()
                        .when("old_password", {
                            is: val => !!val.length,
                            then: Yup.string().required("Campo obrigatório."),
                            otherwise: Yup.string(),
                        })
                        .oneOf(
                            [Yup.ref("password")],
                            "Senhas não são parecidas.",
                        ),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                const {
                    name,
                    email,
                    old_password,
                    password,
                    password_confirmation,
                } = data;

                const formData = {
                    name,
                    email,
                    // Se o campo old_password estiver preenchido, ele envia os campos se não envia vazio.
                    ...(old_password
                        ? {
                              old_password,
                              password,
                              password_confirmation,
                          }
                        : {}),
                };

                const res = await api.put("/profile", formData);
                updateUser(res.data);

                // Se cadastrou com sucesso.
                history.push("/dashboard");

                addToast({
                    type: "success",
                    title: "Perfil atualizado.",
                    description: "Perfil atualizado com sucesso.",
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
                    title: "Erro na atualização.",
                    description:
                        "Ocorreu um erro ao atluzar o seu perfil, tente novamente.",
                });
            }
        },
        [addToast, updateUser, history],
    );

    // Função para alterar o avatar.
    const handleAvatarChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const data = new FormData();

                data.append("avatar", e.target.files[0]);
                // console.log(e.target.files[0]);

                api.patch("/users/avatar", data).then(res => {
                    updateUser(res.data);

                    addToast({
                        type: "success",
                        title: "Avatar atualizado!",
                    });
                });
            }
        },
        [addToast, updateUser],
    );

    return (
        <Container>
            <header>
                <div>
                    <Link to="/dashboard">
                        <FiArrowLeft />
                    </Link>
                </div>
            </header>

            <Content>
                <Form
                    ref={formRef}
                    initialData={{
                        name: user.name,
                        email: user.email,
                    }}
                    onSubmit={handleSubmit}
                >
                    <AvatarInput>
                        <img src={user.avatar_url} alt={user.name} />
                        <label htmlFor="avatar">
                            <FiCamera />

                            <input
                                type="file"
                                id="avatar"
                                onChange={handleAvatarChange}
                            />
                        </label>
                    </AvatarInput>

                    <h1>Meu perfil</h1>

                    <Input name="name" icon={FiUser} placeholder="Seu nome" />
                    <Input name="email" icon={FiMail} placeholder="E-mail" />

                    <Input
                        containerStyle={{ marginTop: 24 }}
                        name="old_password"
                        icon={FiLock}
                        type="password"
                        placeholder="Senha atual"
                    />
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

                    <Button type="submit">Confirmar mudanças</Button>
                </Form>
            </Content>
        </Container>
    );
};

export default Profile;
