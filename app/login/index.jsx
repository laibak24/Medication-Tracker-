import { Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate a delay to ensure navigation is mounted
    const timer = setTimeout(() => setIsReady(true), 500);

    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E3F2FD",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: "#1565C0",
          textAlign: "center",
        }}
      >
        Welcome to MedTrack
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#1E88E5",
          textAlign: "center",
          marginTop: 10,
          fontStyle: "italic",
        }}
      >
        "Keep track of your medicines, stay on top of your health!"
      </Text>

      <TouchableOpacity
        disabled={!isReady} // Disable button if navigation is not ready
        onPress={() => isReady && router.push("/login")}
        style={{
          marginTop: 40,
          backgroundColor: isReady ? "#42A5F5" : "#90CAF9", // Lighter blue when disabled
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 25,
          elevation: 5,
          opacity: isReady ? 1 : 0.6, // Reduce opacity when not ready
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "#FFFFFF",
            fontWeight: "600",
          }}
        >
          {isReady ? "Continue" : "Loading..."}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
