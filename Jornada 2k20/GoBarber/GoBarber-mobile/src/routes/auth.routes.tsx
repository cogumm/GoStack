import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '../pages/SignIn';
import SingUp from '../pages/SingUp';

// Navegação para autenticação.
const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => (
  <Auth.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' },
    }}
  >
    <Auth.Screen name="SingIn" component={SignIn} />
    <Auth.Screen name="SingUp" component={SingUp} />
  </Auth.Navigator>
);

export default AuthRoutes;
