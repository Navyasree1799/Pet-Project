import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "../screens/Welcome";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserStack from "./userStack";
import ProfileCreation from "../screens/ProfileCreation";
import TaskManager from "../screens/TaskManager";
const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        // initialRouteName={user ? "User Stack" : "Welcome"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Sign In" component={SignInScreen} />
        <Stack.Screen name="Sign Up" component={SignUpScreen} />
        <Stack.Screen name="User Stack" component={UserStack} />
        <Stack.Screen name="ProfileCreation" component={ProfileCreation} />
        <Stack.Screen options={{headerShown:true}} name="Task Manager" component={TaskManager} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
