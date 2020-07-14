import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SingIn from '../Pages/SignIn';
import SingUp from '../Pages/SingUp';

// Navegação para autenticação.
const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => (
    <Auth.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#312e38' },
        }}
    >
        <Auth.Screen name="SingIn" component={SingIn} />
        <Auth.Screen name="SingUp" component={SingUp} />
    </Auth.Navigator>
);

export default AuthRoutes;
