import React, { Component } from 'react';
import {Platform, StyleSheet} from 'react-native';
import { TabNavigator } from 'react-navigation';
import DailyVerification from './DailyVerification';
import Profile from './Profile';



const Main = TabNavigator(
  {
    DailyVer: {
      screen: DailyVerification,
    },
    Profile: {
      screen: Profile,
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
      inactiveTintColor: '#808080',
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: 'white',
      },
    },
  }
);

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

export default Main;