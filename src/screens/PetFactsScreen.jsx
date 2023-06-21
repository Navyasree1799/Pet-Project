import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text } from "@rneui/themed";
import dogFacts from "../utils/dogFacts.json";
import catFacts from "../utils/catFacts.json";
import { useEffect } from "react";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

const PetFactsScreen = ({ route }) => {
  const [facts, setFacts] = useState([]);

  useEffect(() => {
    if (route.params.animal === "dog") {
      setFacts(dogFacts);
    } else {
      setFacts(catFacts);
    }
  }, [route]);

  const renderFactCard = ({ item }) => (
    <LinearGradient
      colors={["#FDBE3B", "#FAD961"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Text style={styles.factText}>{item.fact}</Text>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={facts}
        renderItem={renderFactCard}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    overflow: "hidden", // Prevent gradient overflow
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  factText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#FFF",
  },
});

export default PetFactsScreen;
