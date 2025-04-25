import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '@/config/FirebaseConfig';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import moment from 'moment';

export default function MedicationActionModal() {
  const medicine = useLocalSearchParams();
  const [actionTaken, setActionTaken] = useState(null);

  const UpdateActionStatus = async (status) => {
    try {
      const docRef = doc(db, 'medications', medicine?.docId);
  
      // Ensure selectedDate is parsed properly
      const rawDate = medicine?.selectedDate;
      let parsedDate = moment(rawDate);
  
      // If parsing fails, fallback to moment.utc
      if (!parsedDate.isValid()) {
        parsedDate = moment.utc(rawDate);
      }
  
      if (!parsedDate.isValid()) {
        Alert.alert('Invalid Date', 'The selected date is not valid!');
        return;
      }
  
      const selectedDate = parsedDate.format('YYYY-MM-DD');
      const fieldToUpdate = status === 'taken' ? 'takenDates' : 'missedDates';
  
      await updateDoc(docRef, {
        action: arrayUnion({
          status: status,
          time: moment().format('LT'),
          date: selectedDate,
        }),
        [`statusMap.${selectedDate}`]: status,
        [fieldToUpdate]: arrayUnion(selectedDate),
      });
  
      setActionTaken(status.toLowerCase());
  
      Alert.alert(
        'Success',
        `Medication marked as ${status}`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('(tabs)'),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error updating action status:', error);
      Alert.alert('Error', 'Something went wrong while updating status!');
    }
  };
    
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Reminder</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Image
          source={require('../../assets/images/bell-icon.png')}
          style={styles.bellIcon}
        />
        <Text style={styles.medName}>{medicine.medName}</Text>
        <Text style={styles.detail}>{medicine.mealTime} - {medicine.timeToTake}</Text>
        <Text style={styles.detail}>{new Date(medicine.selectedDate).toDateString()}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.takenButton, actionTaken === 'taken' && styles.disabled]}
          onPress={() => UpdateActionStatus('taken')}
          disabled={actionTaken !== null}
        >
          <Text style={styles.buttonText}>Taken</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.skippedButton, actionTaken === 'missed' && styles.disabled]}
          onPress={() => UpdateActionStatus('missed')}
          disabled={actionTaken !== null}
        >
          <Text style={styles.buttonText}>Skipped</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937', // slate-900
  },
  card: {
    backgroundColor: '#1E293B', // dark slate
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 40,
  },
  bellIcon: {
    width: 60,
    height: 60,
    marginBottom: 18,
  },
  medName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8FAFC', // light text
    textAlign: 'center',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    color: '#CBD5E1', // slate-300
    textAlign: 'center',
    marginVertical: 2,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  takenButton: {
    backgroundColor: '#10B981', // emerald
  },
  skippedButton: {
    backgroundColor: '#EF4444', // red
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabled: {
    opacity: 0.6,
  },
});
