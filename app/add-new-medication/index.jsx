import { View, Text } from 'react-native'
import React from 'react'
import AddMedicineHeader from '../../components/AddMedicineHeader'
import AddMedicationForm from '../../components/AddMedicationForm'

export default function AddNewMedication() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}> 
        <AddMedicineHeader />
        <AddMedicationForm />
      </View>
    );
  }
  