import React from "react";
import AuthStack from "./authStack";
import { Platform, View } from "react-native";
import { screenWidth } from "../utils/helpfulFunctions";

export default function RootNavigation() {

  if (Platform.OS !== "web") {
    return <AuthStack />;
  } else {
    return (
      <View style={{ width: screenWidth, maxWidth: 700 }}>
        <AuthStack />
      </View>
    );
  }
  
}
