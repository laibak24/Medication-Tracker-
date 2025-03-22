import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../config/FirebaseConfig";
import { MaterialIcons } from '@expo/vector-icons'; // Corrected import
import { signOut } from 'firebase/auth';

export default function Profile() {
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
            {/* Logout Icon Positioned at Top Right */}
            <View style={{ position: "absolute", top: 20, right: 20 }}>
        <TouchableOpacity onPress={handleLogout}>
          <MaterialIcons name="logout" size={30} color="black" />
        </TouchableOpacity>
      </View>


      <Text>Profile</Text>
    </View>
  );
}