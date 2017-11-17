import Login from './Login';
import Main from './Main';
import ChangePassword from './ChangePassword';
import { Platform } from 'react-native';

const Routes = {
    ScreenLogin: {
        screen: Login,
        navigationOptions: {
            header: null
        }
    },
    ScreenMain: {
        screen: Main,
        headerLeft: null,
    },
    ScreenChangePassword: {
        screen: ChangePassword,
        title: 'Cambiar Contraseña'
    },
};

export default Routes;