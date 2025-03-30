import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const AddNew = () => {
  return (
    <View styles = {styles.container} >
      <Text>AddNew</Text>
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