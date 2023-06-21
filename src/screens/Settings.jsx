import React, {  useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import useAuth from "../utils/hooks/useAuth";
import {  Button, Overlay } from "@rneui/themed";
import { getCollectionData } from "../utils/firebaseFunctions";
import { DeleteAccount } from "../utils/hooks/Delete";
import { useFocusEffect } from "@react-navigation/native";
import Spinner from "../components/Spinner";
import NewUser from "../components/NewUser";

const SettingsScreen = ({ navigation }) => {
  const { retrieveData, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();
  const options = [
    {
      id: "1",
      title: "Pet Profile",
      icon: "user",
      handlePress: () => navigation.navigate("ProfileScreen"),
    },
    {
      id: "2",
      title: "Know About Your Pet",
      icon: "info",
      handlePress: async() => {
        navigation.navigate("BreedInfoScreen");
        // Linking.openURL(`https://www.google.com/search?q=${user.breed}`);
      }
        
    },
    {
      id: "3",
      title: "About Developer",
      icon: "code",
      handlePress: () => navigation.navigate("AboutDeveloper"),
    },
    {
      id: "4",
      title: "Logout",
      icon: "log-out",
      handlePress: () => {
        logout();
        navigation.navigate("Welcome");
      },
    },
    {
      id: "5",
      title: "Delete Account",
      icon: "trash",
      handlePress: () => {
        setVisible(true);

        // deleteAccount();
        // navigation.navigate("Welcome");
      },
    },
  ];
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

    useFocusEffect(
      React.useCallback(() => {
      getProfileData();
      }, [])
    );


  async function getProfileData() {
    const user = await retrieveData();

    // const profileData = await getCollectionData("profiles", user);
    // console.log("Profile info: ", user, profileData);
    setUserData(user);
     setIsLoading(false);
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.card}
      onPress={item.handlePress}
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

   if (isLoading) {
     return <Spinner />;
   } else if (userData?.hasOwnProperty("profileCreated") === false) {
     return <NewUser userName={userData.userName} />;
   }

  return (
    <View style={styles.container}>
      {/* <Avatar
        source={{ uri: userData?.avatar || null }}
        size="large"
        containerStyle={styles.avatarContainer}
        title="P"
      /> */}
      {options.map((item) => renderItem({ item }))}
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text style={styles.textPrimary}>
          {" "}
          Are you sure to delete your account?
        </Text>
        <Text style={styles.textSecondary}>You will lose all your data</Text>
        <Button
          buttonStyle={{ backgroundColor: "red",marginBottom:10 }}
          title="Delete"
          onPress={async() => {
            toggleOverlay;
            const user = await retrieveData()
            DeleteAccount(user.email);
            navigation.navigate("Welcome");
          }}
        />
        <Button
          title="Cancel"
          onPress={toggleOverlay}
        />
      </Overlay>
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
    height: 100,
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
    width:"100%"
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
  button: {
    margin: 10,
  },
  textPrimary: {
    marginVertical: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight:"bold"
  },
  textSecondary: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 16,
  },
});

export default SettingsScreen;
