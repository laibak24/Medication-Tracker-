import { Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ImageBackground} from 'react-native';
import colours from "../../constant/colours";

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
      backgroundColor: "transparent", // Ensure it's transparent so background is visible
      padding: 20,
    }}
  >
      <ImageBackground
  source={require('../../assets/images/loginbckg.jpg')}
  style={{
    flex: 1,
    width: "110%",
    height: "102%",
    position: "absolute",
    
  }}
/>
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: colours.DRED,
          textAlign: "center",
        }}
      >
        Welcome to MediQure
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: colours.LRED,
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
          backgroundColor: isReady ? colours.DBLUE : colours.LBLUE, // Lighter blue when disabled
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
