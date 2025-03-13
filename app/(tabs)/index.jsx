import { Text, View } from "react-native";
import React, { useEffect } from 'react';
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace("login");  // Replaces the current screen with "login"
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>HomeScreen</Text>
    </View>
  );
}
