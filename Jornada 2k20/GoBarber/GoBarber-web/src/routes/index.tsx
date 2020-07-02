import React from "react";
import { Switch } from "react-router-dom";

// Route personalizado
import Route from "./Route";

import SingIn from "../pages/SignIn";
import SingUp from "../pages/SignUp";

import Dashboard from "../pages/Dashboard";

const Routes: React.FC = () => (
    <Switch>
        <Route path="/" exact component={SingIn} />
        <Route path="/singup" component={SingUp} />

        <Route path="/dashboard" component={Dashboard} isPrivate />
    </Switch>
);

export default Routes;
