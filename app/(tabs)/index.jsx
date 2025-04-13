import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../config/FirebaseConfig";   
import { signOut } from 'firebase/auth';
import Header from '../../components/Header';
import EmptyState from '../../components/EmptyState';
import MedicationList from '../../components/MedicationList';

const HomeScreen = () => {
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
    <View style={styles.container}>
      <Header/>
      <MedicationList/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
