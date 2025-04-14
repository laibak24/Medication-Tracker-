import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import EmptyState from '../../components/EmptyState' // Adjust import path as needed

const AddNew = () => {
  return (
    <View style={styles.container}>
      <EmptyState />
    </View>
  )
}

export default AddNew

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
})