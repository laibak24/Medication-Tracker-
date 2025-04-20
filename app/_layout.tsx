import { Stack } from "expo-router";

export default function RootLayout() {

  return ( 
    <Stack screenOptions={
      {headerShown:false
      }}>
    <Stack.Screen name="login/index"/>
    <Stack.Screen name="(tabs)"/>
    <Stack.Screen name="action-modal"
    options={
      {presentation:'modal'}
    }/>

    </Stack>

  )
}
