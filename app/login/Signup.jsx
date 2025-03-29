import { View, Text, TouchableOpacity, TextInput, ToastAndroid, Platform, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import colours from '../../constant/colours';
import { useRouter } from 'expo-router';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfile } from "firebase/auth";



export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');

    const router = useRouter();

    const OnCreateAccount = async () => {
        if (!email || !password || !confirmPassword || !username) {
            if (Platform.OS === "android") {
                ToastAndroid.show('Please fill all the details.', ToastAndroid.LONG);
            } else {
                Alert.alert("Error", "Please fill all the details.");
            }
            return;
        }

        if (password !== confirmPassword) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Passwords do not match.", ToastAndroid.LONG);
            } else {
                Alert.alert("Error", "Passwords do not match.");
            }
            return;
        }
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user);

            // Placeholder function: Implement AsyncStorage or SecureStore as needed
            await AsyncStorage.setItem("userDetail", JSON.stringify({ displayName: username }));
            const storedUser = await AsyncStorage.getItem("userDetail");
            console.log("Stored User:", storedUser);
        // Update Firebase Profile
            await updateProfile(user, { displayName: username });

            router.push('/login/Signin');
        } catch (error) {
            const errorCode = error.code;
            console.log(errorCode);

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
            } else {
                if (Platform.OS === "android") {
                    ToastAndroid.show("An error occurred. Please try again.", ToastAndroid.LONG);
                } else {
                    Alert.alert("Error", "An error occurred. Please try again.");
                }
            }
        }
    };

    return (
        <View style={{ padding: 25 }}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color={colours.DRED} />
            </TouchableOpacity>

            <Text style={styles.Header}>Create Account</Text>
            <Text style={styles.p1}>Sign up to get started</Text>

            <View>
                <Text>Username</Text>
                <TextInput 
                    placeholder='Username' 
                    style={styles.textinput} 
                    onChangeText={setUsername}
                />

                <Text style={{ marginTop: 10 }}>Email</Text>
                <TextInput 
                    placeholder='Email' 
                    style={styles.textinput} 
                    onChangeText={setEmail} 
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={{ marginTop: 10 }}>Password</Text>
                <TextInput 
                    placeholder='Password' 
                    style={styles.textinput} 
                    secureTextEntry 
                    onChangeText={setPassword} 
                />

                <Text style={{ marginTop: 10 }}>Confirm Password</Text>
                <TextInput 
                    placeholder='Confirm Password' 
                    style={styles.textinput} 
                    secureTextEntry 
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.button} onPress={OnCreateAccount}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
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
        color: "#000000",
        borderColor: "#ccc"
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
