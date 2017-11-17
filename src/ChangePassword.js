import React, { Component } from 'react';
import metrics from './config/metrics';
import { Text, Button, StyleSheet, Alert, View, AsyncStorage, ActivityIndicator } from 'react-native';
import CustomTextInput from './components/common/CustomTextInput';
import CustomButton from './components/common/CustomButton';
import axios from 'axios';


const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.8
const BUTTON_WIDTH = metrics.DEVICE_WIDTH * 1

class ChangePassword extends Component {

    static navigationOptions = {
        title: 'Cambiar Contraseña',
    };
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirmPassword: '',
            id: '',
            loading: false
        };
    }
    renderContent() {
        switch (this.state.loading) {
            case true:
                return (
                    <ActivityIndicator
                        animating={this.state.loading}
                        style={styles.centering}
                        size="large"
                    />
                );
                break;
            case false:
                return (
                    <View />
                );
                break;
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("id").then((value) => {
            this.setState({id: JSON.parse(value)})
            console.log(this.state.id);
        }).done();
    }

    onButtonPressed() {
        const { confirmPassword, password } = this.state;
        const { navigate } = this.props.navigation;
        this.setState({loading: true});
        if (confirmPassword == password) {
            AsyncStorage.getItem("token").then((token) => {
                axios.put('http://104.196.152.63/api/user/changePass?token=' + token, {
                    id: this.state.id,
                    password: password
                })
                    .then(function (response) {
                        AsyncStorage.clear();
                        (response) => this.setState({ loading: false});
                        Alert.alert(
                            'Éxito',
                            response.data.message,
                            [
                                { text: 'Ok', onPress: () => navigate('ScreenLogin') },
                            ]
                        )
                    })
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

        } else {
            Alert.alert(
                'Las contraseñas no coinciden',
                'Verifique que las contraseñas coincidan',
                [
                    { text: 'Ok', onPress: () => console.log('OK Pressed') },
                ]
            )
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.form}
                >
                    <CustomTextInput
                        name={'password'}
                        placeholder={'Contraseña'}
                        returnKeyType={'next'}
                        secureTextEntry={true}
                        onChangeText={(value) => this.setState({ password: value })}
                        withRef={true}
                    />
                    <CustomTextInput
                        name={'confirmpassword'}
                        placeholder={'Confirma contraseña'}
                        returnKeyType={'done'}
                        secureTextEntry={true}
                        onChangeText={(value) => this.setState({ confirmPassword: value })}
                        withRef={true} />
                </View>
                <View
                    style={styles.button}>
                    <CustomButton
                        onPress={this.onButtonPressed.bind(this)}>
                        Cambiar Contraseña</CustomButton>
                </View>
                {this.renderContent()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: metrics.DEVICE_WIDTH,
        height: metrics.DEVICE_HEIGHT,
        paddingTop: 15,
        backgroundColor: 'white'
    },
    logoImg: {
        height: 180,
        backgroundColor: 'white',
        resizeMode: 'contain',
        width: IMAGE_WIDTH,
        alignSelf: 'center'
    },
    form: {
        alignSelf: 'center',
        width: IMAGE_WIDTH,
        backgroundColor: 'white',
        marginTop: 20
    },
    button: {
        marginTop: 10,
        alignSelf: 'center',
        width: BUTTON_WIDTH,
        height: 50
    },
    centering: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
})

export default ChangePassword;