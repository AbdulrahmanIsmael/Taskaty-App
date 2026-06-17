import { Button, StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text>Hello World</Text>
      <Button title="Hello World" onPress={() => router.push("/login")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Index;
