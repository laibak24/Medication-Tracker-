import { View, Text, TouchableOpacity, TextInput, ToastAndroid, Platform, Alert} from 'react-native';
import { StyleSheet } from 'react-native';
import colours from '../../constant/colours';
import { useRouter } from 'expo-router';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";
import React, { useState } from 'react';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');

    const router = useRouter(); // ✅ Fix: Initialize router

    const OnCreateAccount = () => {
        if (!email || !password || !confirmPassword) {
            if (Platform.OS === "android") {
                ToastAndroid.show('Please fill all the details.', ToastAndroid.LONG);
            } else {
                Alert.alert("Error", "Please fill all the details.");
            }
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                router.push('/login/Signin'); // ✅ Fix: Proper navigation after signup
                
            })
            .catch((error) => {
                const errorCode = error.code;
                console.log(errorCode);
                if (password !== confirmPassword) {
                    if (Platform.OS === "android") {
                        ToastAndroid.show("Passwords do not match.", ToastAndroid.LONG);
                    } else {
                        Alert.alert("Error", "Passwords do not match.");
                    }
                    return;
                }
        
                if (errorCode === "auth/email-already-in-use") {
                    if (Platform.OS === "android") {
                        ToastAndroid.show("Email already exists.", ToastAndroid.LONG);
                    } else {
                        Alert.alert("Error", "Email already exists.");
                    }
                } else if (errorCode === "auth/weak-password") {
                    if (Platform.OS === "android") {
                        ToastAndroid.show("Password is not strong.", ToastAndroid.LONG);
                    } else {
                        Alert.alert("Error", "Password is not strong.");
                    }
                }
            });
    };

    return (
        <View style={{ padding: 25 }}>
            <Text style={styles.Header}>Create Account</Text>
            <Text style={styles.p1}>Sign up to get started</Text>
            <View>
            <Text> Username </Text>
                <TextInput 
                    placeholder='Username' 
                    style={styles.textinput} 
                    onChangeText={(value) => setUsername(value)}
                />
                <Text style={{ marginTop: 10}}>Email </Text>
                <TextInput 
                    placeholder='Email' 
                    style={styles.textinput} 
                    onChangeText={(value) => setEmail(value)} 
                />

                <Text style={{ marginTop: 10 }}> Password </Text>
                <TextInput 
                    placeholder='Password' 
                    style={styles.textinput} 
                    secureTextEntry={true} 
                    onChangeText={(value) => setPassword(value)} 
                />

                <Text style={{ marginTop: 10 }}> Confirm Password </Text>
                <TextInput 
                    placeholder='Confirm Password' 
                    style={styles.textinput} 
                    secureTextEntry={true} 
                    onChangeText={(value) => setConfirmPassword(value)} // ✅ Fix: Moved inside tag
                />

                <TouchableOpacity style={styles.button} onPress={OnCreateAccount}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    
}

const styles = StyleSheet.create({
    Header: {
        fontSize: 50,
        fontWeight: 'bold',
        marginTop: 80,
        textAlign: 'center',
        color: colours.DRED,
    },
    p1: {
        fontSize: 20,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 30,
        color: colours.DBLUE,
    },
    textinput: {
        padding: 10,
        borderWidth: 1,
        fontSize: 16,
        borderRadius: 8,
        marginTop: 10,
        color: "#000000"
    },
    button: {
        marginTop: 40,
        backgroundColor: colours.DBLUE,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '600',
        textAlign: 'center',
    },
});
