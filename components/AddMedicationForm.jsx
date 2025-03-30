import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

const Options = ({ selectedOption, onSelect, options }) => (
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

export default function AddMedicationForm() {
  const [medName, setMedName] = useState("");
  const [medType, setMedType] = useState("Tablet");
  const [dose, setDose] = useState("");
  const [timeToTake, setTimeToTake] = useState("Morning");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [capsules, setCapsules] = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Medication</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Medication Name"
        placeholderTextColor="#666"
        value={medName}
        onChangeText={setMedName}
      />

      <Text style={styles.label}>Medication Type</Text>
      <Options 
        selectedOption={medType} 
        onSelect={setMedType} 
        options={[
          { id: "Tablet", label: "Tablet", icon: "pills", library: FontAwesome5 },
          { id: "Capsule", label: "Capsule", icon: "capsules", library: FontAwesome5 },
          { id: "Syrup", label: "Syrup", icon: "flask", library: FontAwesome5 },
          { id: "Injection", label: "Injection", icon: "syringe", library: FontAwesome5 },
        ]}
      />

      <TextInput
        style={styles.input}
        placeholder="Dosage (e.g., 500mg)"
        placeholderTextColor="#666"
        value={dose}
        onChangeText={setDose}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Time to Take</Text>
      <Options
        selectedOption={timeToTake}
        onSelect={setTimeToTake}
        options={[
          { id: "Morning", label: "Morning", icon: "weather-sunset-up", library: MaterialCommunityIcons },
          { id: "Afternoon", label: "Afternoon", icon: "weather-sunny", library: MaterialCommunityIcons },
          { id: "Night", label: "Night", icon: "weather-night", library: MaterialCommunityIcons },
        ]}
      />

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
        <Text style={styles.dateText}>Start Date: {startDate.toDateString()}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
        <Text style={styles.dateText}>End Date: {endDate.toDateString()}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="No. of Capsules (Optional)"
        placeholderTextColor="#666"
        value={capsules}
        onChangeText={setCapsules}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Set Reminder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
    color: "#555",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#000",
  },
  dateButton: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
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
