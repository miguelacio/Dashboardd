import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const LogOutButton = ({ onPress, children }) => {
    const { buttonStyle, textStyle } = styles;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={buttonStyle}>
            <Text style={textStyle}
            >{children}</Text>
        </TouchableOpacity>
    );
};
const styles = {
    textStyle: {
        alignSelf: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonStyle: {
        flex: 1,
        backgroundColor: '#B20000',
        borderRadius: 5,
        borderWidth: 1,
        justifyContent: 'center',
        borderColor: '#B20000',
        marginHorizontal: 5
    }
};

export default LogOutButton ;