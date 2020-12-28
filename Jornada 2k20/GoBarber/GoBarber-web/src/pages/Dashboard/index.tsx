import React, { useCallback, useState } from "react";

import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiClock, FiPower } from "react-icons/fi";

import logoImg from "../../assets/logo.svg";
import { useAuth } from "../../hooks/auth";

import { Container, Header, HeaderContent, Profile, Content, Schedule, NextAppointment, Section, Appointment, Calendar } from './styles';

const Dashboard: React.FC = () => {
    // Quando clicar no dia do calendário alterar a listagem dos agendamentos.
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { singOut, user } = useAuth();

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers ) => {
        if(modifiers.available) {
            setSelectedDate(day);
        }
    }, []);

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

            <Content>
                <Schedule>
                    <h1>Horários agendados</h1>
                    <p>
                        <span>Hoje</span>
                        <span>dia 28</span>
                        <span>segunda-feira</span>
                    </p>

                    <NextAppointment>
                        <strong>Próximo atendimento:</strong>
                        <div>
                            <img src="https://avatars2.githubusercontent.com/u/113603?s=460&u=80ff02187db0c2f433149af604ca94f5333ba0c1&v=4" alt="aaa" />

                            <strong>Gabriel</strong>
                            <span>
                                <FiClock />
                                8:00
                            </span>
                        </div>
                    </NextAppointment>

                    <Section>
                        <strong>Manhã</strong>

                        <Appointment>
                            <span>
                                <FiClock />
                                8:00
                            </span>

                            <div>
                                <img src="https://avatars2.githubusercontent.com/u/113603?s=460&u=80ff02187db0c2f433149af604ca94f5333ba0c1&v=4" alt="aaa" />

                                <strong>Gabriel</strong>
                            </div>
                        </Appointment>
                        <Appointment>
                            <span>
                                <FiClock />
                                9:00
                            </span>

                            <div>
                                <img src="https://avatars2.githubusercontent.com/u/113603?s=460&u=80ff02187db0c2f433149af604ca94f5333ba0c1&v=4" alt="aaa" />

                                <strong>Gabriel</strong>
                            </div>
                        </Appointment>
                    </Section>

                    <Section>
                        <strong>Tarde</strong>

                        <Appointment>
                            <span>
                                <FiClock />
                                8:00
                            </span>

                            <div>
                                <img src="https://avatars2.githubusercontent.com/u/113603?s=460&u=80ff02187db0c2f433149af604ca94f5333ba0c1&v=4" alt="aaa" />

                                <strong>Gabriel</strong>
                            </div>
                        </Appointment>
                    </Section>
                </Schedule>

                <Calendar>
                    <DayPicker
                        weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
                        // Não permitir selecionar meses anteriores do atual.
                        fromMonth={new Date()}

                        // Desabilitando dias expecífico.
                        // 0, 6 = Domingo e sábado.
                        disabledDays={[{ daysOfWeek: [0, 6 ]}]}

                        // Adicionando uma classe em um dia expecífico.
                        modifiers={{
                            available: { daysOfWeek: [1, 2, 3, 4, 5] }
                        }}
                        selectedDays={selectedDate}
                        onDayClick={handleDateChange}

                        months={[
                            "Janeiro",
                            "Fevereiro",
                            "Março",
                            "Abril",
                            "Maio",
                            "Junho",
                            "Julho",
                            "Agosto",
                            "Setembro",
                            "Outubro",
                            "Novembro",
                            "Dezembro",
                        ]}
                    />
                </Calendar>
            </Content>
        </Container>
    );
};

export default Dashboard;
