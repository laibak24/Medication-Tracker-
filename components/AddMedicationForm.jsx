import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { useRouter } from "expo-router";

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { getLocalStorage } from "../service/Storage";
import { SafeAreaView } from "react-native-safe-area-context";

const Options = ({ selectedOption, onSelect, options }) => (
  <FlatList
    data={options}
    horizontal
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => {
      const IconComponent = item.library || MaterialCommunityIcons;
      return (
        <TouchableOpacity
          style={[
            styles.option,
            selectedOption === item.id && styles.selectedOption,
          ]}
          onPress={() => onSelect(item.id)}
        >
          <IconComponent
            name={item.icon}
            size={24}
            color={selectedOption === item.id ? "#fff" : "#444"}
          />
          <Text
            style={[
              styles.optionText,
              selectedOption === item.id && styles.selectedText,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    }}
    showsHorizontalScrollIndicator={false}
  />
);

export default function AddMedicationForm() {
  const [showMealPicker, setShowMealPicker] = useState(false);
  const [medName, setMedName] = useState("");
  const [medType, setMedType] = useState("Tablet");
  const [dose, setDose] = useState("");
  const [mealTime, setMealTime] = useState("Breakfast");
  const [timeToTake, setTimeToTake] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReminder = () => {
    const today = new Date();
    const start = new Date(startDate.setHours(0, 0, 0, 0));
    const end = new Date(endDate.setHours(0, 0, 0, 0));
    const current = new Date(today.setHours(0, 0, 0, 0));

    if (start < current) {
      Alert.alert("Invalid Start Date", "Start date cannot be in the past.");
      return false;
    }

    if (end <= start) {
      Alert.alert("Invalid End Date", "End date must be after the start date.");
      return false;
    }

    if (!mealTime || !medType || !medName.trim() || !dose.trim()) {
      Alert.alert("Missing Info", "Please complete all fields.");
      return false;
    }

    return true;
  };

  const SaveMedication = async () => {
    if (!handleReminder()) return;

    const docId = Date.now().toString();

    try {
      const user = await getLocalStorage("userDetail");
      setLoading(true);

      const medicationData = {
        medName,
        medType,
        dose,
        mealTime,
        timeToTake: timeToTake.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userEmail: user?.email || "unknown",
        docId,
      };

      await setDoc(doc(db, "medications", docId), medicationData);
      setLoading(false);

      Alert.alert("Success", "Medication saved successfully!", [
        { text: "OK", onPress: () => router.push("(tabs)") },
      ]);
    } catch (error) {
      setLoading(false);
      console.error("Error saving medication: ", error);
      Alert.alert("Error", "Failed to save medication. Please try again.");
    }
  };

  const renderDateTimePicker = (
    mode,
    value,
    onChange,
    showPicker,
    setShowPicker
  ) => {
    if (Platform.OS === "ios" && showPicker) {
      return (
        <Modal transparent animationType="slide">
          <SafeAreaView style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.modalDoneButton}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={value}
                mode={mode}
                display={mode === "time" ? "spinner" : "inline"}
                onChange={(event, date) => {
                  if (date) onChange(date);
                }}
                style={styles.iosPicker}
                textColor="#000" // Add this line for iOS DateTimePicker
              />
            </View>
          </SafeAreaView>
        </Modal>
      );
    }

    return (
      showPicker && (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) onChange(date);
          }}
        />
      )
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f6f9" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
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
              {
                id: "Tablet",
                label: "Tablet",
                icon: "pills",
                library: FontAwesome5,
              },
              {
                id: "Capsule",
                label: "Capsule",
                icon: "capsules",
                library: FontAwesome5,
              },
              {
                id: "Syrup",
                label: "Syrup",
                icon: "flask",
                library: FontAwesome5,
              },
              {
                id: "Injection",
                label: "Injection",
                icon: "syringe",
                library: FontAwesome5,
              },
            ]}
          />

          <Text style={styles.label}>Dosage</Text>
          <TextInput
            style={[styles.input, { marginTop: 8 }]}
            placeholder="e.g., 500mg"
            placeholderTextColor="#666"
            value={dose}
            onChangeText={setDose}
            keyboardType="default"
          />

          <Text style={styles.label}>Time to Take</Text>
          <View style={styles.timeRow}>
            <View style={styles.pickerWrapper}>
              {Platform.OS === "android" ? (
                <Picker
                  selectedValue={mealTime}
                  onValueChange={setMealTime}
                  style={styles.iosPicker}
                  itemStyle={styles.pickerItem} // Add this line
                >
                  <Picker.Item label="Breakfast" value="Breakfast" />
                  <Picker.Item label="Lunch" value="Lunch" />
                  <Picker.Item label="Dinner" value="Dinner" />
                </Picker>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowMealPicker(true)}
                  >
                    <Text style={styles.dateText}>{mealTime}</Text>
                  </TouchableOpacity>

                  <Modal
                    visible={showMealPicker}
                    transparent
                    animationType="slide"
                  >
                    <SafeAreaView style={styles.modalOverlay}>
                      <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                          <TouchableOpacity
                            onPress={() => setShowMealPicker(false)}
                          >
                            <Text style={styles.modalDoneButton}>Done</Text>
                          </TouchableOpacity>
                        </View>
                        <Picker
                          selectedValue={mealTime}
                          onValueChange={setMealTime}
                          style={styles.iosPicker}
                        >
                          <Picker.Item label="Breakfast" value="Breakfast" />
                          <Picker.Item label="Lunch" value="Lunch" />
                          <Picker.Item label="Dinner" value="Dinner" />
                        </Picker>
                      </View>
                    </SafeAreaView>
                  </Modal>
                </>
              )}
            </View>

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={22}
                color="#007bff"
              />
              <Text style={styles.timeText}>
                {timeToTake.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {renderDateTimePicker(
            "time",
            timeToTake,
            setTimeToTake,
            showTimePicker,
            setShowTimePicker
          )}

          <Text style={styles.label}>Schedule</Text>
          <View style={styles.dateRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.dateText}>{startDate.toDateString()}</Text>
              </TouchableOpacity>
              {renderDateTimePicker(
                "date",
                startDate,
                setStartDate,
                showStartPicker,
                setShowStartPicker
              )}
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.dateText}>{endDate.toDateString()}</Text>
              </TouchableOpacity>
              {renderDateTimePicker(
                "date",
                endDate,
                setEndDate,
                showEndPicker,
                setShowEndPicker
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={SaveMedication}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Set Reminder</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    backgroundColor: "#f4f6f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
    color: "#222",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 6,
    color: "#555",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#000",
  },
  dateButton: {
    backgroundColor: "#fff",
    color: "#000",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#bbb",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "600",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    color: "#000",
    borderColor: "#bbb",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 12,
  },
  timeText: {
    fontSize: 16,
    color: "#007bff",
    marginLeft: 6,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 16,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  modalDoneButton: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "600",
    padding: 8,
  },
  pickerItem: {
    color: '#000', // Black text for all items
    backgroundColor: '#fff', // White background for items
    fontSize: 20, // Optional: increase readability
  },
  iosPicker: {
    height: 180,
    marginTop: -10,
    backgroundColor: '#fff',
    color: '#000', // Main picker text color
  },
  //commit fix
  pickerWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: {
    height: Platform.OS === "ios" ? 180 : 50,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  option: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    marginHorizontal: 6,
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
