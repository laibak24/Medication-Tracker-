import { Text, View, TouchableOpacity, Image, Modal, TextInput, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // Expo Icons
import colours from "../../constant/colours";
import { useFonts } from "expo-font";

const WelcomeScreen = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const text = "MediQure";
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev < text.length ? prev + 1 : prev));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>

      <Image source={require("../../assets/images/doctor.png")} style={styles.image} />

      <Text style={styles.appName}>{text.substring(0, textIndex)}</Text>
      <Text style={styles.tagline}>Smart Reminders for a Healthier You</Text>

      <TouchableOpacity
        disabled={!isReady}
        onPress={() => isReady && router.push("login/Signin")}
        style={[styles.floatingButton, { backgroundColor: isReady ? colours.DRED : colours.LRED, opacity: isReady ? 1 : 0.6 }]}
      >
        <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colours.LCREAM,
    padding: 20,
  },
  topIcons: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
    gap: 20,
  },
  image: {
    width: 360,
    height: 360,
    resizeMode: "contain",
    marginBottom: 0,
  },
  appName: {
    fontSize: 48,
    fontFamily: "Poppins-Bold",
    color: colours.DRED,
    textAlign: "center",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 20,
    color: colours.DBLUE,
    textAlign: "center",
    marginBottom: 60,
    paddingHorizontal: 30,
    fontStyle: "italic",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  floatingButton: {
    position: "absolute",
    bottom: 70,
    right: "56%",
    transform: [{ translateX: 25 }],
    width: 55,
    height: 55,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});

export default WelcomeScreen;