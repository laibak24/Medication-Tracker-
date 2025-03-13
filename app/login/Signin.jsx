import { View, Text } from 'react-native'
import { StyleSheet } from 'react-native';
import React from 'react'
import colours from '../../constant/colours';
import { TextInput } from 'react-native';


export default function Signin() {

  return (
    <View style= {
        {padding: 25      
        } } >
      <Text style = {styles.Header}>Welcome Back</Text>
      <Text style = {styles.p1}>Please enter your credentials</Text>
      <View>    
        <Text> Email </Text>
        <TextInput placeholder='Email' style = {styles.textinput} />

        <Text style= {{marginTop: 10}}> Password </Text>
        <TextInput placeholder='Password' style = {styles.textinput} />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
    Header: {
         fontSize: 50,
         fontWeight: 'bold',
         marginTop:105,
         textAlign: 'center',
         color: colours.DRED
    },

    p1: {
        fontsize: 20,
        textAlign: 'center',
        fontStyle: "italic",
        marginTop: 40,
        color: colours.DBLUE
    },
    textinput: {
        padding: 10,
        borderWidth: 1,
        fontsize: 10,
        borderRadius: 8,
        marginTop: 10
    }

})