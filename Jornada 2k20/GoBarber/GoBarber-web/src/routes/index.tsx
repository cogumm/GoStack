import React from "react";
import { Switch } from "react-router-dom";

// Route personalizado
import Route from "./Route";

import SingIn from "../pages/SignIn";
import SingUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

// Rotas privadas
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";

const Routes: React.FC = () => (
    <Switch>
        <Route path="/" exact component={SingIn} />
        <Route path="/singup" component={SingUp} />
        <Route path="/forgot" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />

        <Route path="/dashboard" component={Dashboard} isPrivate />
        <Route path="/profile" component={Profile} isPrivate />
    </Switch>
);

export default Routes;
