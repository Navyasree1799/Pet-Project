import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      {/* <Image source={require("./assets/logo.png")} style={styles.logo} /> */}
      <Text style={styles.title}>Settings Screen</Text>
      <Text style={styles.subtitle}>Taking care of your beloved pets!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
  },
});

export default SettingsScreen;
