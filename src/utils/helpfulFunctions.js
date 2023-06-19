import { Dimensions } from "react-native";


export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;

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

export const validateObj = (obj) => {
   return Object.values(obj).every((value) => value !== null && value !== undefined && value !== "");
}