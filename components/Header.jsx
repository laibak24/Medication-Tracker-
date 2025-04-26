import { Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { getLocalStorage } from "../service/Storage";
import { StyleSheet } from "react-native";
import colours from "../constant/colours";

export default function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        GetUserDetails();
    }, []);

    const GetUserDetails = async () => {
        const userInfo = await getLocalStorage("userDetail");
        console.log("Retrieved User:", userInfo);
        setUser(userInfo);
    };

    return (
        <View style={styles.headerContainer}>
            {/* Left-aligned Greeting & Name */}
            <View style={styles.textContainer}>
                <Text style={styles.greetingText}>Hello,</Text>
                <Text style={styles.userName}>
                    {user?.displayName ? user.displayName : "Guest"}  
                </Text>
            </View>

            {/* Right Section: Goodbye Icon */}
            <Image
                source={require("./../assets/images/goodbye.png")}
                style={styles.goodbyeIcon}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 22, // Slightly increased for a sleek look
        paddingHorizontal: 38, // Increased to make it chic
        backgroundColor: colours.DBLUE,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
        zIndex: 1000,
    },
    textContainer: {
        alignItems: "flex-start", // Align text to the left
    },
    greetingText: {
        fontSize: 18,
        fontWeight: "400",
        color: "#DDDDDD",
        textAlign: "left",
    },
    userName: {
        fontSize: 24,
        fontWeight: "500",
        color: "#FFF",
        letterSpacing: 0.5,
        textAlign: "left",
    },
    goodbyeIcon: {
        width: 40, // Slightly larger for balance
        height: 40,
        tintColor: "#FFD700",
    },
});
