import React from "react";
import {
    Route as ReactDOMRoute,
    RouteProps as ReactDOMRouteProps,
    Redirect,
} from "react-router-dom";

import { useAuth } from "../hooks/auth";

interface RouteProps extends ReactDOMRouteProps {
    isPrivate?: boolean;
    component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
    isPrivate = false,
    component: Component,
    ...rest
}) => {
    const { user } = useAuth();

    return (
        <ReactDOMRoute
            {...rest}
            render={({ location }) => {
                // Verificando se a rota é privada ou não.
                // Função para checar se a rota é privada e se a pessoa está autenticada.
                return isPrivate === !!user ? (
                    <Component />
                ) : (
                        <Redirect
                            to={{
                                state: { from: location },
                                pathname: isPrivate ? "/" : "/dashboard",
                            }}
                        />
                    );
            }}
        />
    );
};

export default Route;
