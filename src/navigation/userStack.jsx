import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ServicesScreen from "../screens/ServicesScreen";
import Appointments from "../screens/Appointments";
import { Feather } from "@expo/vector-icons";
import ProfileCreation from "../screens/ProfileCreation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/Settings";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarStyle: { borderRadius: 30, height: 70, paddingVertical: 10 },
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

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileCreation" component={ProfileCreation} />
    </Stack.Navigator>
  );
};
