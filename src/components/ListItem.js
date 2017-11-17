import React from 'react';
import Card from './common/Card';
import { Text, View, Image, Switch, Button } from 'react-native';

const ListItem = ({ servicio, onToggleSwitch }) => {
    const { nombre, created_at, estatus, id } = servicio;
    const { textStyle, switchStyle, cardStyle } = styles;

    return (
        <Card>
            <View style={cardStyle}>
                <View >
                    <Text style={textStyle}>{nombre}</Text>
                </View>
                <View >
                    <Switch style={switchStyle}
                        value={estatus}
                        onValueChange={(value) => onToggleSwitch(id, value)} />
                </View>
            </View>
        </Card>
    );
};

const styles = {
    cardStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        alignItems: 'center',
    },
    textStyle: {
        marginLeft: 10,
        fontSize: 16,
    },
    switchStyle: {
        marginRight: 10,
    }
};
export default ListItem;