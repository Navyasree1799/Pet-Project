import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ServicesScreen from "../screens/ServicesScreen";
import Appointments from "../screens/Appointments";
import { Feather } from "@expo/vector-icons";
import ProfileCreation from "../screens/ProfileCreation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/Settings";
import { Platform } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarStyle: {
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingVertical: 10,
          height: Platform.OS==="ios"?100:70,
        },
        // title:"",
        tabBarLabel: "",
        activeTintColor: "blue", // Customize the active tab color
        inactiveTintColor: "gray", // Customize the inactive tab color
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Tasks") {
            iconName = focused ? "list" : "list";
          } else if (route.name === "Appointments") {
            iconName = focused ? "calendar" : "calendar";
          } else if (route.name === "SettingsScreen") {
            iconName = focused ? "user" : "user";
          }

          // Return the corresponding Ionicons component with the appropriate icon name
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        options={{ title: "Categories" }}
        name="Tasks"
        component={ServicesScreen}
      />
      <Tab.Screen
        options={{ title: "Calendar" }}
        name="Appointments"
        component={Appointments}
      />
      <Stack.Screen
        options={{ title: "Profile" }}
        name="SettingsScreen"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}