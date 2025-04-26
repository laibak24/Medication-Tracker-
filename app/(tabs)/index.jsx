import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../config/FirebaseConfig";   
import { signOut } from 'firebase/auth';
import Header from '../../components/Header';
import MedicationList from '../../components/MedicationList';

const HomeScreen = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login/Signin');
    } catch (error) {
      console.error("Logout failed: ", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <MedicationList />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 110, // <-- this matches your header height (adjust if needed)
  },
});

export default HomeScreen;
