import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Image, StyleSheet, Linking } from "react-native";

const AboutDeveloperScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/NP.jpg")} // Replace with the path to your avatar image
        style={styles.avatar}
      />
      <Text style={styles.name}>Navyasree Putluri</Text>
      <Text style={styles.bio}>Masters in Applied Computer science{"\n"} Grand Valley State university</Text>
      <Text style={styles.contact}> putlurinavyasree@gmail.com</Text>
      <View style={styles.socialIconsContainer}>
        <Ionicons
          name="logo-github"
          size={32}
          color="#333"
          style={styles.socialIcon}
          onPress={() => Linking.openURL("https://github.com/navyasree1799")}
        />
        <Ionicons
          name="logo-linkedin"
          size={32}
          color="#0077B5"
          style={styles.socialIcon}
          onPress={() =>
            Linking.openURL(
              "https://www.linkedin.com/in/navyasree-putluri-189b85260/"
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bio: {
      fontSize: 14,
      fontWeight:"bold",
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  contact: {
    fontSize: 14,
    marginBottom: 20,
    
  },
  socialIconsContainer: {
    flexDirection: "row",
  },
  socialIcon: {
    marginHorizontal: 10,
  },
});

export default AboutDeveloperScreen;
