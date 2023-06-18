import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import useAuth from "../utils/hooks/useAuth";
import { Avatar } from "@rneui/themed";
import { getCollectionData } from "../utils/firebaseFunctions";

const options = [
  { id: "1", title: "Pet Profile", icon: "user", navigation: "ProfileScreen" },
  { id: "2", title: "Know About Your Pet", icon: "info", navigation: "" },
  { id: "3", title: "About Developer", icon: "code", navigation: "" },
];

const SettingsScreen = ({ navigation }) => {
  const { retrieveData, logout } = useAuth();
  const [userData,setUserData] = useState()

  useEffect(() => {
    getProfileData();
  })

  async function getProfileData() {
    const user = await retrieveData()
    const profileData = await getCollectionData("profiles", user)
    setUserData(profileData)
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.card}
      onPress={() => navigation.navigate(item.navigation)}
    >
      <View style={styles.iconContainer}>
        <Feather name={item.icon} size={24} color="#000" style={styles.icon} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Feather
        name="chevron-right"
        size={24}
        color="#000"
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );

  const renderLogoutItem = () => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        logout();
        navigation.navigate("Welcome");
      }}
    >
      <View style={styles.iconContainer}>
        <Feather name="log-out" size={24} color="#000" style={styles.icon} />
      </View>
      <Text style={styles.title}>Logout</Text>
      <Feather
        name="chevron-right"
        size={24}
        color="#000"
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Avatar
        source={{ uri: userData?.avatar||null }}
        size="large"
        
        containerStyle={styles.avatarContainer}
        title="P"
      />
      {options.map((item) => renderItem({ item }))}
      {renderLogoutItem()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#F5F5F5",
  },
  avatarContainer: {
    width: 100,
    height:100,
    backgroundColor: "transparent",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: "#5188E3",
    borderRadius: 999,
    padding: 10,
    marginRight: 16,
  },
  icon: {
    color: "#fff",
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  arrowIcon: {
    marginLeft: "auto",
  },
});

export default SettingsScreen;
