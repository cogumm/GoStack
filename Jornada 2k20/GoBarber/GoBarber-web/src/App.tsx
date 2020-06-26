import React from "react";

import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
import GlobalStyle from "./styles/global";

// Importanto o Context
import { AuthProvider } from "./hooks/AuthContext";

const App: React.FC = () => (
    <>
        <AuthProvider>
            <SignIn />
        </AuthProvider>

        <GlobalStyle />
    </>
);

export default App;
