import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../config/FirebaseConfig";   
import { signOut } from 'firebase/auth';
import Header from '../../components/Header';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login/Signin'); // Redirect to login screen after logout
    } catch (error) {
      console.error("Logout failed: ", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>ADD: NO MED + CURRENT MEDS</Text>
      <Header/>
    </View>
  );
}