import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack 
      screenOptions={{
        headerStyle: { backgroundColor: "#ff8c00" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "ShuffleDo" }} />
    </Stack>
  );
};

export default RootLayout;
