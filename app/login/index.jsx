import { Text, View, TouchableOpacity, Image, Modal, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // Expo Icons
import colours from "../../constant/colours";
import { useFonts } from "expo-font";

export default function WelcomeScreen() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [infoModalVisible, setInfoModalVisible] = useState(false); // Info popup
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false); // Feedback popup
  const [feedbackText, setFeedbackText] = useState("");

  const text = "MediQure"; // App name for typewriter effect

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  // Typewriting effect
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colours.LCREAM,
        padding: 20,
      }}
    >
      {/* Top Icons: Info & Feedback */}
      <View
        style={{
          position: "absolute",
          top: 50,
          right: 20,
          flexDirection: "row",
          gap: 20,
        }}
      >
        {/* Info Button - Opens Popup */}
        <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
          <Ionicons name="information-circle-outline" size={30} color={colours.DBLUE} />
        </TouchableOpacity>

        {/* Feedback Button - Opens Feedback Popup */}
        <TouchableOpacity onPress={() => setFeedbackModalVisible(true)}>
          <MaterialIcons name="feedback" size={30} color={colours.DBLUE} />
        </TouchableOpacity>
      </View>

      {/* Medicine Box Image (No Animation) */}
      <Image
        source={require("../../assets/images/doctor.png")}
        style={{
          width: 360,
          height: 360,
          resizeMode: "contain",
          marginBottom: 0,
        }}
      />

      {/* App Name with Typewriter Effect */}
      <Text
        style={{
          fontSize: 48,
          fontFamily: "Poppins-Bold",
          color: colours.DRED,
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        {text.substring(0, textIndex)}
      </Text>

      {/* Tagline */}
      <Text
        style={{
          fontSize: 20,
          color: colours.DBLUE,
          textAlign: "center",
          marginBottom: 60,
          paddingHorizontal: 30,
          fontStyle: "italic",
          fontWeight: "500",
          letterSpacing: 0.5,
        }}
      >
        Smart Reminders for a Healthier You
      </Text>

      {/* Floating Arrow Button - Moved Slightly Higher */}
      <TouchableOpacity
        disabled={!isReady}
        onPress={() => isReady && router.push("login/Signin")}
        style={{
          position: "absolute",
          bottom: 70,
          right: "56%",
          transform: [{ translateX: 25 }],
          backgroundColor: isReady ? colours.DRED : colours.LRED,
          width: 55,
          height: 55,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
          elevation: 5,
          opacity: isReady ? 1 : 0.6,
        }}
      >
        <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Info Popup Modal */}
      <Modal
        transparent={true}
        visible={infoModalVisible}
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "80%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 10,
                color: colours.DBLUE,
              }}
            >
              About MediQure
            </Text>
            <Text style={{ fontSize: 16, textAlign: "center", color: "#333" }}>
              MediQure is a smart medication reminder app that helps you stay on
              track with your health by sending timely notifications.
            </Text>
            <TouchableOpacity
              onPress={() => setInfoModalVisible(false)}
              style={{
                marginTop: 20,
                backgroundColor: colours.DRED,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Feedback Popup Modal */}
      <Modal
        transparent={true}
        visible={feedbackModalVisible}
        animationType="fade"
        onRequestClose={() => setFeedbackModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "80%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 10,
                color: colours.DBLUE,
              }}
            >
              Submit Feedback
            </Text>
            <TextInput
              style={{
                width: "100%",
                height: 100,
                borderWidth: 1,
                borderColor: colours.DBLUE,
                borderRadius: 5,
                padding: 10,
                textAlignVertical: "top",
                marginBottom: 10,
              }}
              placeholder="Type your feedback here..."
              multiline
              value={feedbackText}
              onChangeText={setFeedbackText}
            />
            <TouchableOpacity
              onPress={() => {
                setFeedbackModalVisible(false);
                setFeedbackText(""); // Clear input after submission
              }}
              style={{
                backgroundColor: colours.DRED,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
