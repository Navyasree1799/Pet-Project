import { Button } from "@rneui/themed";
import React from "react";
import { useLayoutEffect } from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import useAuth from "../utils/hooks/useAuth";
import { useState } from "react";
import Spinner from "../components/Spinner";

const screenWidth = Dimensions.get("window").width;

const WelcomeScreen = ({ navigation }) => {
  const { retrieveData } = useAuth();
  const [isLoading,setIsLoading] = useState(true)
  useLayoutEffect(() => {
    getUserInfo();
  }, []);

  async function getUserInfo() {
    const user = await retrieveData();
    // console.log("Welcome Screen: ", user);
    user && navigation.navigate("User Stack", { screen: "Home" });
    setIsLoading(false)
  }

  if (isLoading) {
    return <Spinner />
  }
  else {
    return (
      <View style={styles.container}>
        <Image
          style={styles.imageContainer}
          source={require("../../assets/pets.png")}
        />
        <Text style={styles.title1}>Welcome to Pet Journal</Text>
        <Text style={{ marginBottom: 30 }}>Your one stop for pet care</Text>
        <View style={styles.buttons}>
          <Button
            buttonStyle={{
              backgroundColor: "#3095ea",
              borderRadius: 30,
            }}
            containerStyle={styles.buttonContainer}
            titleStyle={{ fontWeight: "bold" }}
            onPress={() => navigation.navigate("Sign In")}
            title="Log in to your account"
          />
          <Button
            buttonStyle={{
              backgroundColor: "rgba(111, 202, 186, 1)",
              borderRadius: 30,
            }}
            containerStyle={styles.buttonContainer}
            titleStyle={{ fontWeight: "bold" }}
            title="Register your account"
            onPress={() => navigation.navigate("Sign Up")}
          />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },

  title1: {
    fontSize: 24,
    marginTop: -20,
    fontWeight: "bold",
    textAlign: "justify",
  },

  buttons: {
    width: screenWidth * 0.9,
    alignItems: "center",
  },

  buttonContainer: {
    width: "100%",
    maxWidth: 500,
    marginBottom: 10,
  },

  imageContainer: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});

export default WelcomeScreen;
