import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons"; 

export default function Options({ selectedOption, onSelect, options }) {
  return (
    <FlatList
      data={options}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const IconComponent = item.library || MaterialCommunityIcons; 
        return (
          <TouchableOpacity
            style={[styles.option, selectedOption === item.id && styles.selectedOption]}
            onPress={() => onSelect(item.id)}
          >
            <IconComponent name={item.icon} size={24} color={selectedOption === item.id ? "#fff" : "#444"} />
            <Text style={[styles.optionText, selectedOption === item.id && styles.selectedText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      }}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  option: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    borderWidth: 1,
    borderColor: "#bbb",
  },
  selectedOption: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
  },
  optionText: {
    marginTop: 5,
    fontSize: 14,
    color: "#444",
  },
  selectedText: {
    color: "#fff",
  },
});
