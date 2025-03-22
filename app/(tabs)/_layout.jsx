import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";

export default function TabLayout() {
  const auth = getAuth();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(null);

  // Handle user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User UID:", user.uid);
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authenticated === false) {
      router.push("/login");
    }
  }, [authenticated]);

  // Show loading while authentication state is being determined
  if (authenticated === null) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="face-man-profile" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="AddNew"
        options={{
          tabBarLabel: "Add",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="add-box" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <Entypo name="home" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
