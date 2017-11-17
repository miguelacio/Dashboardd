import React, { Component } from 'react';
import { Text, Button, StyleSheet, Alert, View, AsyncStorage } from 'react-native';
import { TabNavigator, NavigationActions } from 'react-navigation';
import LogOutButton from './components/common/LogOutButton';
import CustomButton from './components/common/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import metrics from './config/metrics';
import axios from 'axios';


const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 1

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      rolData: []
    };
  }
  onLogOutButtonPressed() {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar' },
        { text: 'Ok', onPress: this.logOut.bind(this) },
      ]
    )
  }

  onChangePasswordButtonPressed() {
    const { navigate } = this.props.navigation;
    AsyncStorage.setItem("id", JSON.stringify(this.state.userData.id));
    navigate('ScreenChangePassword');
  }

  logOut() {
    const { navigate } = this.props.navigation;
    AsyncStorage.clear();
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'ScreenLogin' })
      ]
    })
    this.props.navigation.dispatch(resetAction)

  }

  componentDidMount() {
    AsyncStorage.getItem("token").then((value) => {
      axios.get('http://104.196.152.63:80/api/user/user?token=' + value)
        .then(response => {
          this.setState({ userData: response.data.user, rolData: response.data.rolname })
        }
        )
        .catch(function (error) {
          AsyncStorage.clear();
          if(error.response.status == 400){
            Alert.alert(
                'Ocurrió un error',
                'Token inválido, vuelva a iniciar sesión',
                [
                    { text: 'Ok', onPress: () =>   navigate('ScreenLogin')},
                ]
            )
        }
        });


    }).done();


  }
  render() {
    const { infoStyle, labelStyle, containerRowStyle, containerStyle, buttonStyle } = styles;
    const { navigate } = this.props.navigation;

    return (
      <View style={containerStyle}>
        <View style={containerRowStyle}>
          <Text style={labelStyle}>Nombre:</Text>
          <Text style={infoStyle}>{this.state.userData.name}</Text>
        </View>
        <View style={containerRowStyle}>
          <Text style={labelStyle}>Correo:</Text>
          <Text style={infoStyle}>{this.state.userData.email}</Text>
        </View>
        <View style={containerRowStyle}>
          <Text style={labelStyle}>Rol:</Text>
          <Text style={infoStyle}>{this.state.rolData.nombre}</Text>
        </View>
        <View style={buttonStyle}>
          <LogOutButton
            onPress={this.onLogOutButtonPressed.bind(this)}>
            Cerrar sesion
          </LogOutButton>
        </View>
        <View style={buttonStyle}>
          <CustomButton
            onPress={this.onChangePasswordButtonPressed.bind(this)}> Cambiar contraseña</CustomButton>
        </View>
      </View>
    );
  }

}

const styles = {
  labelStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 20
  },
  infoStyle: {
    fontSize: 18,
    marginLeft: 5
  },
  containerRowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,

  },
  containerStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  buttonStyle: {
    height: 50,
    marginTop: 10,
    width: IMAGE_WIDTH
  }
};


Profile.navigationOptions = {
  title: "Perfil",
  tabBarLabel: 'Perfil',
  headerLeft: null,
  tabBarIcon: ({ tintColor, focused }) => (
    <Ionicons
      name={focused ? 'ios-person' : 'ios-person-outline'}
      size={26}
      style={{ color: tintColor }}
    />
  ),
};

export default Profile;