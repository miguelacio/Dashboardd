import React, { Component } from 'react';
import { Text, Button, StyleSheet, Alert, AsyncStorage, ActivityIndicator } from 'react-native';
import { Image, View } from 'react-native-animatable';
import imgLogo from './images/logo.png';
import metrics from './config/metrics';
import { NavigationActions } from 'react-navigation';
import CustomTextInput from './components/common/CustomTextInput';
import CustomButton from './components/common/CustomButton';
import axios from 'axios';

const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.8


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loading: false
        };
    }
    componentDidMount() {
        const { navigate } = this.props.navigation;
        AsyncStorage.getItem("token").then((value) => {
            if (value) {
                console.log(value);
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'ScreenMain' })
                    ]
                })
                this.props.navigation.dispatch(resetAction)
            }
        }).done();
    }

    onButtonPressed() {
        const { email, password, loading } = this.state;
        const { navigate } = this.props.navigation;

        if (email != '' && password != '') {
            this.setState({loading: true});
            axios.post('http://104.196.152.63/api/user/signin', {
                email: email,
                password: password
            })
                .then(function (response) {
                   (response) => this.setState({ loading: false});
                    var newData = response.data.token;
                    var tokenUser = String(newData);
                    AsyncStorage.setItem("token", tokenUser);
                    navigate('ScreenMain');

                })
                .catch(function (error) {
                   
                    if (error.response) {
                        if (error.response.status == 401) {
                            Alert.alert(
                                'Ocurrió un error',
                                error.response.data.error,
                                [
                                    { text: 'Ok', onPress: () => console.log('OK Pressed') },
                                ]
                            )
                        } else {
                            Alert.alert(
                                'Ocurrió un error',
                                'Verifica que hayas puesto un correo y una contraseña',
                                [
                                    { text: 'Ok', onPress: () => console.log('OK Pressed') },
                                ]
                            )
                        }
                    } else if (error.request) {
                        Alert.alert(
                            'Ocurrió un error',
                            error.request._response,
                            [
                                { text: 'Ok', onPress: () => console.log('OK Pressed') },
                            ]
                        )
                    } else {
                        Alert.alert(
                            'Ocurrió un error',
                            error.message,
                            [
                                { text: 'Ok', onPress: () => console.log('OK Pressed') },
                            ]
                        )
                    }

                   (error) => this.setState({ loading: true});
                });
               
        } else {
            Alert.alert(
                'Llena todos los campos antes de seguir',
                '',
                [
                    { text: 'Ok', onPress: () => console.log('OK Pressed') },
                ]
            )
        }
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

    render() {
        return (

            <View style={styles.bigContainer}>


                <View style={styles.container}>
                    <Image
                        animation={'bounceIn'}
                        duration={1200}
                        delay={200}
                        style={styles.logoImg}
                        source={imgLogo}
                    />

                    <View style={styles.form}
                        animation={'bounceIn'}
                        duration={1200}
                        delay={200}>
                        <CustomTextInput
                            name={'email'}
                            placeholder={'Email'}
                            keyboardType={'email-address'}
                            returnKeyType={'next'}
                            blurOnSubmit={false}
                            onChangeText={(value) => this.setState({ email: value })}
                            withRef={true}
                        />
                        <CustomTextInput
                            name={'password'}
                            placeholder={'Password'}
                            returnKeyType={'done'}
                            secureTextEntry={true}
                            onChangeText={(value) => this.setState({ password: value })}
                            withRef={true}
                        />
                    </View>


                    <View
                        style={styles.button}
                        animation={'bounceIn'}
                        duration={1200}
                        delay={200}>
                        <CustomButton
                            onPress={this.onButtonPressed.bind(this)}
                        >
                            Iniciar Sesión</CustomButton>
                    </View>
                </View>
                {this.renderContent()}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    bigContainer: {
        flex: 1,
        backgroundColor: 'white'
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
        alignSelf: 'center',
        width: IMAGE_WIDTH,
        height: 50
    }
})

export default Login;