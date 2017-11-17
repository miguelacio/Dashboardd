import React, { Component } from 'react';
import { Text, StyleSheet, View, Switch, AsyncStorage, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import ListItem from './components/ListItem.js';

class DailyVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            servicios: [],
            loading: false
        };
    }

    onToggleSwitch = (id, value) => {
        var estado = '';
        if (value) {
            estado = 'encendido';
        } else {
            estado = 'apagado';
        }
        const servicios = [...this.state.servicios]
        const index = servicios.findIndex(item => item.id === id)
        servicios[index].estatus = value
        this.setState({ servicios })

        AsyncStorage.getItem("token").then((token) => {
            axios.put('http://104.196.152.63/api/servicio/updateStatus?token=' + token, {
                id: id,
                estatus: value
            })
                .then(function (response) {        
                    Alert.alert(
                        response.data.message,
                        'El servicio está ' + estado,
                        [
                            { text: 'Ok', onPress: () => console.log('OK Pressed') },
                        ]
                    )
                })
                .catch(function (error) {
                   
                        Alert.alert(
                            'Ocurrió un error',
                            'No se cambió el estado del servicio, vuelva a intentarlo más tarde.',
                            [
                                { text: 'Ok', onPress: () => console.log('OK Pressed') },
                            ]
                        )
                    
                });
        }).done();
    }

    componentDidMount() {
        const { navigate } = this.props.navigation;
        this.setState({loading: true});
        AsyncStorage.getItem("token").then((value) => {
            axios.get('http://104.196.152.63:80/api/servicio/index?token=' + value)
                .then(response => this.setState({ servicios: response.data.servicios, loading: false }))
                .catch(function (error) {
                    (error) => this.setState({ loading: false});

                    if (error.response) {
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
                
                });
        }).done();
    }
    renderList() {
        return this.state.servicios.map(servicio =>
            <ListItem key={servicio.id} servicio={servicio} onToggleSwitch={this.onToggleSwitch} />);
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
                <ScrollView style={{ backgroundColor: 'white'}}>
                    {this.renderList()}
                </ScrollView>
                );
                break;
        }

    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white'}}>
                {this.renderContent()}
            </View>
        );
    }

}

DailyVerification.navigationOptions = {
    title: "Verificación Diaria",
    tabBarLabel: 'Verificación Diaria',
    headerLeft: null,
    tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={26}
            style={{ color: tintColor }}
        />
    ),
};

const styles = StyleSheet.create({
    centering: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center', 
        backgroundColor: 'white'
    },
})

export default DailyVerification;