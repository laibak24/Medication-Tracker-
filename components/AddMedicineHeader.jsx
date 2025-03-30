import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Expo Icons
import colours from "../constant/colours";

export default function AddMedicineHeader() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header Image */}
            <Image source={require('../assets/images/header4.jpg')} style={styles.image} />
            
            {/* Back Button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colours.LIGHTGRAY, 
        paddingBottom: 10,  
    },
    image: {
        width: "100%",
        height: 150, // Adjust height as needed
        resizeMode: "cover",
    },
    backButton: {
        position: "absolute",
        left: 15,
        top: 15,
        backgroundColor: colours.DRED,
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
    },
});
