import { Dimensions } from "react-native";


export const screenWidth = Dimensions.get("window").width;

export function hasObjectChanged(oldObj, newObj) {
  // Get the keys of the object properties
  const keys = Object.keys(oldObj);

  // Check if any property values have changed
  for (let key of keys) {
    if (oldObj[key] !== newObj[key]) {
      return true; // Object has changed
    }
  }

  return false; // Object has not changed
}