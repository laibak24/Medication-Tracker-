import { View, Text, TouchableOpacity, TextInput, Platform, Alert, ToastAndroid } from 'react-native';
import { StyleSheet } from 'react-native';
import colours from '../../constant/colours';
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";
import React, { useState } from 'react';
import { setLocalStorage } from '../../service/Storage';

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const OnSignInClick = () => {
    if (!email || !password) {
      if (Platform.OS === "android") {
        ToastAndroid.show('Please fill all the details.', ToastAndroid.LONG);
      } else {
        Alert.alert("Error", "Please fill all the details.");
      }
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    const user = userCredential.user;
    console.log(user);
    
    // Store user data in AsyncStorage
    await setLocalStorage('userDetail', user);
    
    router.replace('(tabs)');
  })
  .catch((error) => {
    const errorCode = error.code;
    console.log(errorCode);

    if (errorCode === 'auth/invalid-credential') {
        if (Platform.OS === "android") {
            ToastAndroid.show('Invalid Email or Password.', ToastAndroid.LONG);
        } else {
            Alert.alert("Error", "Invalid Email or Password.");
        }
    } 
    else if (errorCode === 'auth/too-many-requests') {
        if (Platform.OS === "android") {
            ToastAndroid.show('Too many requests please try again later.', ToastAndroid.LONG);
        } else {
            Alert.alert("Error", "Too many requests please try again later.");
        }
    }
})
   

  };

  return (
    <View style={{ padding: 25 }}>
      <Text style={styles.Header}>Welcome Back</Text>
      <Text style={styles.p1}>Please enter your credentials</Text>

      <View>
        <Text>Email</Text>
        <TextInput
          placeholder='Email'
          style={styles.textinput}
          onChangeText={(value) => setEmail(value)}
          value={email}
        />

        <Text style={{ marginTop: 10 }}>Password</Text>
        <TextInput
          placeholder='Password'
          style={styles.textinput}
          secureTextEntry={true}
          onChangeText={(value) => setPassword(value)}
          value={password}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={OnSignInClick}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>Don't have an account?</Text>

        <TouchableOpacity onPress={() => router.push('login/Signup')}>
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
