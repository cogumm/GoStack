import React from "react";
import { FiAlertTriangle, FiTriangle } from "react-icons/fi";

import { Container, Toast } from "./styles";

import { ToastMessage } from "../../hooks/toast";

interface ToastContainetProps {
    messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainetProps> = ({ messages }) => {
    return (
        <Container>
            {messages.map(message => (
                <Toast
                    key={message.id}
                    type={message.type}
                    hasDescription={!!message.description}
                >
                    <FiAlertTriangle size={20} />

                    <div>
                        <strong>{message.title}</strong>
                        {message.description && <p>{message.description}</p>}
                    </div>

                    <button type="button">
                        <FiTriangle size={18} />
                    </button>
                </Toast>
            ))}
        </Container>
    );
};

export default ToastContainer;
