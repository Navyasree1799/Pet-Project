import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { screenWidth } from "../utils/helpfulFunctions";
import { formatDate, formatTime } from "../utils/formatDate";

const Task = ({ obj, handlePress, handleDelete, hideDelete }) => {
  return (
    <TouchableOpacity
      style={styles.taskContainer}
      onPress={() => handlePress()}
    >
      <View style={styles.alignParallel}>
        <Text style={styles.title}>{obj.title}</Text>
        <Text style={styles.frequency}>{obj.frequency==="Daily"?"Daily":formatDate(obj.date)}</Text>
      </View>

      <View style={styles.alignParallel}>
        <View style={[styles.alignParallel, { justifyContent: "flex-start" }]}>
          <MaterialIcons name="watch-later" size={20} color="grey" />
          <Text style={styles.time}>{" " + formatTime(obj.time)}</Text>
        </View>
        {!hideDelete && (
          <Ionicons
            name="md-trash"
            size={20}
            color="red"
            onPress={handleDelete}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Task;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  taskContainer: {
    borderLeftWidth: 5,
    borderLeftColor: "rgba(111, 202, 186, 1)",
    width: Platform.OS!=='web'?screenWidth * 0.9:450,
    maxWidth: 600,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  time: {
    fontSize: 14,
    color: "#888",
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  frequency: {
    fontSize: 12,
    color: "#888888",
  },
  alignParallel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
