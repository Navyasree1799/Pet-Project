import React from "react";
import MainStack from "./mainStack";
import { Platform, View } from "react-native";
import { screenWidth } from "../utils/helpfulFunctions";

export default function RootNavigation() {

  if (Platform.OS !== "web") {
    return <MainStack />;
  } else {
    return (
      <View style={{ width: screenWidth, maxWidth: 500,marginHorizontal:screenWidth*.3 }}>
        <MainStack />
      </View>
    );
  }
  
}
