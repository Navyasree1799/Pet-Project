import React, { useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { Button } from "@rneui/themed";
import { signOut } from "firebase/auth";

import { auth, firestore } from "../../config/firebase";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import useAuth from "../utils/hooks/useAuth";

export default function HomeScreen({ navigation, route }) {
  const [userData, setUserData] = useState({});

  const { retrieveData, updateUser, logout, isLoading } = useAuth();
  useEffect(() => {
    initialCall();
  }, [route]);



  async function initialCall() {
    const user = await retrieveData();
    setUserData(user);
    getData(user);
    if (!user?.hasOwnProperty("email")) {
      signOut(auth);
    } else if (userData.hasOwnProperty("profileCreated") === false) {
    }
  }

  async function getData(user) {
    try {
      const docRef = doc(firestore, "profiles", user.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {

        setUserData(docSnap.data());
        updateUser(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.log(err);
    }
  }


  

  if (isLoading) {
    return <ActivityIndicator />;
  } else if (userData?.hasOwnProperty("profileCreated") === false) {
    return (
      <View style={styles.container}>
        <Image
          style={styles.imageContainer}
          source={require("../../assets/puppy.png")}
        />
        <Text style={styles.title}>
          Welcome {"\n"}
          {userData?.userName}!
        </Text>

        <Button
          buttonStyle={{
            backgroundColor: "#3095ea",
            borderWidth: 2,
            borderColor: "white",
            borderRadius: 30,
          }}
          containerStyle={styles.buttonContainer}
          titleStyle={{ fontWeight: "bold" }}
          title="Create your profile"
          onPress={() => navigation.navigate("ProfileCreation")}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>Welcome {userData?.userName}!</Text>
        
        <Button
          title="Sign Out"
          style={styles.button}
          onPress={() => {
            signOut(auth);
            logout();
            navigation.navigate("Welcome");
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 10,
  },
  imageContainer: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 500,
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  activitiesContainer: {
    flex: 1,
    marginTop: 16,
  },
  calendarContainer: {
    flex: 1,
    padding: 16,
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    marginVertical: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
});