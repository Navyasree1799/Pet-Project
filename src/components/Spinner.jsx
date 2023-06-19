import { ActivityIndicator, StyleSheet, View } from "react-native";
import { screenWidth } from "../utils/helpfulFunctions";

const Spinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={50} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent:"center"
  },
});

export default Spinner;
