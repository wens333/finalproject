import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HomeStack, ProfileStack, FormStack, LoginStack, BlogStack } from './screens';
// Stack Nav.
import { createStackNavigator } from '@react-navigation/stack';
// Tab Nav.
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// 資料庫
import firebase from 'firebase';
// 鍵盤不擋畫面
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
// import AntDesign from 'react-native-vector-icons/AntDesign';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='登入'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName
            if (route.name == '首頁') {
              iconName = 'home'
              // } else if (route.name == '表單') {
              //   iconName = 'reader'
            } else if (route.name == '看板') {
              // iconName = 'globe'
              iconName = 'ios-chatbubble-ellipses-sharp'
            } else if (route.name == '個資') {
              iconName = 'people'
            }
            else if (route.name == '登入') {
              iconName = 'enter-outline'
            }
            return <Ionicons name={iconName} size={25} color={color} />

          },
          headerShown: false,
          tabBarActiveTintColor: '#5CADAD',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="首頁" component={HomeStack} />
        {/* <Tab.Screen name="表單" component={FormStack} /> */}
        <Tab.Screen name="看板" component={BlogStack} />
        <Tab.Screen name="個資" component={ProfileStack} />
        <Tab.Screen name="登入" component={LoginStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
