import React, {
    InputHTMLAttributes,
    useEffect,
    useState,
    useRef,
    useCallback,
} from "react";
import { IconBaseProps } from "react-icons";
import { FiAlertTriangle } from "react-icons/fi";
import { useField } from "@unform/core";

import { Container, Error } from "./styles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({ name, icon: Icon, ...rest }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const { fieldName, defaultValue, error, registerField } = useField(name);

    // SEMPRE que for criar uma função dentro de um componente utilizar o useCallback
    // Função para deixar o icone colorido.
    const handleInputBlur = useCallback(() => {
        setIsFocused(false);

        // Se tiver algum valor vem true
        setIsFilled(!!inputRef.current?.value);
    }, []);

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: "value",
        });
    }, [fieldName, registerField]);

    return (
        <Container
            isErrored={!!error}
            isFilled={isFilled}
            isFocused={isFocused}
        >
            {Icon && <Icon size={20} />}
            <input
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                defaultValue={defaultValue}
                ref={inputRef}
                {...rest}
            />

            {error && (
                <Error title={error}>
                    <FiAlertTriangle color="#c53030" size={20} />
                </Error>
            )}
        </Container>
    );
};

export default Input;
