import React from "react";
import { FiPower } from "react-icons/fi";

import logoImg from "../../assets/logo.svg";
import { useAuth } from "../../hooks/auth";

import { Container, Header, HeaderContent, Profile } from './styles';

const Dashboard: React.FC = () => {
    const { singOut, user } = useAuth();

    // console.log(user);

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <img src={logoImg} alt="GoBarber" />

                    <Profile>
                        <img src={user.avatar_url} alt={user.name} />

                        <div>
                            <span>Bem-vindo,</span>
                            <strong>{user.name}</strong>
                        </div>
                    </Profile>

                    <button type="button" onClick={singOut}>
                        <FiPower />
                    </button>
                </HeaderContent>
            </Header>
        </Container>
    );
};

export default Dashboard;
