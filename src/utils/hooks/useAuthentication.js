import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useAuthentication() {
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    const unsubscribeFromAuthStatusChanged = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          setUser(user);

          try {
            // Persist the user data using AsyncStorage
            await AsyncStorage.setItem("user", JSON.stringify(user));
          } catch (error) {
            console.log("Error storing user data:", error);
          }
        } else {
          // User is signed out
          setUser(undefined);

          try {
            // Clear the user data from AsyncStorage
            await AsyncStorage.removeItem("user");
          } catch (error) {
            console.log("Error removing user data:", error);
          }
        }
      }
    );

    // Retrieve user data from AsyncStorage on component mount
    const retrieveUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.log("Error retrieving user data:", error);
      }
    };

    retrieveUserData();

    return unsubscribeFromAuthStatusChanged;
  }, []);

  return {
    user,
  };
}
