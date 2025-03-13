import { Text, View } from "react-native";
import React from 'react'
import { Tabs } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  return (

    <Tabs screenOptions={
        {headerShown:false}
    }> <Tabs.Screen name='Profile'
    options={
       {tabBarLabel:'Profile',
       tabBarIcon:({color,size})=>(<MaterialCommunityIcons name="face-man-profile" size={24} color="black" />)}
       }
       ></Tabs.Screen>
        <Tabs.Screen name='AddNew'
        options={
            {tabBarLabel:'Add',
            tabBarIcon:({color,size})=>(<MaterialIcons name="add-box" size={24} color="black" />)}
            }></Tabs.Screen>
       
       <Tabs.Screen name='index'
        options={
            {tabBarLabel:'Home',
            tabBarIcon:({color,size})=>(<Entypo name="home" size={24} color="black" />)}
        }></Tabs.Screen>
       
    </Tabs>
);
}
