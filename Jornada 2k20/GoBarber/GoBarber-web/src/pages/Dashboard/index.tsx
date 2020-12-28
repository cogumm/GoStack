import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isToday, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiClock, FiPower } from "react-icons/fi";

import logoImg from "../../assets/logo.svg";
import { useAuth } from "../../hooks/auth";
import api from "../../services/api";

import {
    Container,
    Header,
    HeaderContent,
    Profile,
    Content,
    Schedule,
    NextAppointment,
    Section,
    Appointment,
    Calendar,
  } from './styles';
interface MonthAvailabilityItem {
    day: number;
    available: boolean;
}

interface Appointment {
    id: string;
    date: string;
    user: {
        name: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    // Quando clicar no dia do calendário alterar a listagem dos agendamentos.
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);

    const [appointment, setAppointment] = useState<Appointment[]>([]);

    const { singOut, user } = useAuth();
    // console.log(user);

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers ) => {
        if(modifiers.available) {
            setSelectedDate(day);
        }
    }, []);

    const handleMonthChange = useCallback((month: Date) => {
        setCurrentMonth(month);
    }, []);

    useEffect(() => {
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                // Retornando o ano por completo.
                year: currentMonth.getFullYear(),
                // Retornando o mês corretamente, começando do 1 em vez do 0.
                month: currentMonth.getMonth() + 1,
            }
        }).then(res => {
            setMonthAvailability(res.data);
        });
    }, [currentMonth, user.id]);

    // Carregando os agendamentos vindo da API.
    useEffect(() => {
        api.get("/appointments/me", {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1,
                day: selectedDate.getDate(),
            }
        }).then(res => {
            setAppointment(res.data);
            console.log(res.data);
        })
    }, [selectedDate]);

    // Desabilitando os dias que estão com agendamentos lotados ou dias que já passaram.
    /**
     * useMemo: Serve para memorizar um valor expecífico, uma formatação, qualquer coisa,
     * e a aplicação dizer para ele quando quer que esse valor seja recarregado.
     */
    const disableDays = useMemo(() =>{
        // Filtrando os dias que não estão disponíveis.
        const dates = monthAvailability
            .filter(monthDay => monthDay.available === false)
            .map(monthDay => {
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth();

                return new Date(year, month, monthDay.day);
            });

            return dates;
    }, [currentMonth, monthAvailability]);

    const selectedDateAsText = useMemo(() => {
        return format(selectedDate, "'dia' dd 'de' MMMM", {
            locale: ptBR,
        });
    }, [selectedDate]);

    const selectedWeekDay = useMemo(() => {
        return format(selectedDate, "cccc", {
            locale: ptBR,
        });
    }, [selectedDate])

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
                        {isToday(selectedDate) && <span>Hoje</span> }
                        <span>{selectedWeekDay}</span>
                        <span>{selectedDateAsText}</span>
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
                        disabledDays={[{ daysOfWeek: [0, 6 ]}, ...disableDays]}

                        // Adicionando uma classe em um dia expecífico.
                        modifiers={{
                            available: { daysOfWeek: [1, 2, 3, 4, 5] }
                        }}

                        onMonthChange={handleMonthChange}
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
