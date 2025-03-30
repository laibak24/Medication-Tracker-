import { Text, View, TouchableOpacity, Image, Modal, TextInput, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // Expo Icons
import colours from "../constant/colours";
import { useFonts } from "expo-font";

const EmptyState = () => {
    const router=useRouter();
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/med.png')} style={styles.image} />
      <Text style={styles.title}>No Medications</Text>
      <Text style={styles.subtitle}>Click to add new items to the list.</Text>
      <TouchableOpacity style={styles.button}
      onPress={()=>router.push('/add-new-medication')}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: 100, // Adjust size as needed
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default EmptyState;
