import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteUser, getAuth, signOut } from "firebase/auth";
import * as Notifications from "expo-notifications";
import { auth, firestore } from "../../../config/firebase";
import { deleteDoc, doc } from "firebase/firestore";

const useAuth = (key = "user-data") => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const userData = await retrieveData();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setUser(null);
      
    } catch (error) {
      console.error("Error removing user data:", error);
    }
    signOut(auth);
    Notifications.cancelAllScheduledNotificationsAsync()
  };

  const updateUser = async (updatedData) => {
    try {
      const existingUser = await retrieveData();
      if (existingUser) {
        const parsedUser = existingUser;
        const updatedUser = { ...parsedUser, ...updatedData };
        await AsyncStorage.setItem(key, JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const retrieveData = async () => {
    try {
      const data = await AsyncStorage.getItem(key);
      return JSON.parse(data);
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    retrieveData,
  };
};

export default useAuth;
