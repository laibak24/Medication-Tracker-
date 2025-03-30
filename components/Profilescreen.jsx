import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Profilescreen = () => {
  return (
    <View styles={styles.container}>
      <Text>Profilescreen</Text>
    </View>
  )
}

export default Profilescreen

const styles = StyleSheet.create({
    cointainer: {
    flex : 1,
    paddingHorizontal : 20,
    paddingtop : 20
    }
})