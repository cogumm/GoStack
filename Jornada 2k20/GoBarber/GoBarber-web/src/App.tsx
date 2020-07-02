import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import GlobalStyle from "./styles/global";

// Importanto o Context
import AppProvider from "./hooks";

// Arquivo de rotas.
import Routes from "./routes";

const App: React.FC = () => (
    <Router>
        <AppProvider>
            <Routes />
        </AppProvider>

        <GlobalStyle />
    </Router>
);

export default App;
