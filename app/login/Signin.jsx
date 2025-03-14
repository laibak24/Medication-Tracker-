import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { StyleSheet } from 'react-native';
import React from 'react';
import colours from '../../constant/colours';
import { useRouter } from "expo-router";

export default function Signin() {
  const router = useRouter();

  return (
    <View style={{ padding: 25 }}>
      <Text style={styles.Header}>Welcome Back</Text>
      <Text style={styles.p1}>Please enter your credentials</Text>
      
      <View>    
        <Text>Email</Text>
        <TextInput placeholder='Email' style={styles.textinput} />

        <Text style={{ marginTop: 10 }}>Password</Text>
        <TextInput placeholder='Password' style={styles.textinput} secureTextEntry={true} />

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/dashboard')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>Don't have an account?</Text>
        
        <TouchableOpacity 
          onPress={() => router.push('/login/Signup')}
        >
          <Text style={styles.signupLink}>Create One</Text>
        </TouchableOpacity>

        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Header: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 105,
    textAlign: 'center',
    color: colours.DRED
  },
  p1: {
    fontSize: 20,
    textAlign: 'center',
    fontStyle: "italic",
    marginTop: 40,
    color: colours.DBLUE
  },
  textinput: {
    padding: 10,
    borderWidth: 1,
    fontSize: 16,
    borderRadius: 8,
    marginTop: 10
  },
  button: {
    marginTop: 40,
    backgroundColor: colours.DBLUE,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: 'center'
  },
  signupText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: colours.DBLUE
  },
  signupLink: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: "bold",
    color: colours.DRED
  }
});
