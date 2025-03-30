import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../config/FirebaseConfig";
import { MaterialIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import Profilescreen from '../../components/Profilescreen';

const Profile = () => {
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
    <View>
      <View style={styles.logoutButton}>
        <TouchableOpacity onPress={handleLogout}>
          <MaterialIcons name="logout" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <Profilescreen />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});
