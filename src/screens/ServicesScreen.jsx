import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Button, Input, ListItem, Overlay } from "@rneui/themed";
import React, { useState,useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import useAuth from "../utils/hooks/useAuth";
import { getCollectionData, setCollectionData } from "../utils/firebaseFunctions";
import { screenWidth } from "../utils/helpfulFunctions";
import NewUser from "../components/NewUser";
import Spinner from "../components/Spinner";
import { useFocusEffect } from "@react-navigation/native";

const ServiceScreen = ({ navigation }) => {
  const [userData, setUserData] = useState()
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState({
    food: {
      title: "Food",
      tasks: [],
      icon: "food-bank",
    },
    walking: {
      title: "Walking",
      tasks: [],
      icon: "pets",
    },
    doctor: {
      title: "Doctor",
      tasks: [],
      icon: "medical-services",
    },
    grooming: {
      title: "Grooming",
      tasks: [],
      icon: "cleaning-services",
    },
  });
  const [visible, setVisible] = useState(false);
  const [newCategory,setNewCategory] = useState("")
  const { retrieveData } = useAuth();


  useFocusEffect(
    React.useCallback(() => {
      getCategories();
    }, [])
  );

  async function getCategories(user) {
    try {
      user = await retrieveData();
      setUserData(user)
      const categoriesData = await getCollectionData("categories", user)
      categoriesData
        ? setList(categoriesData)
        : setCollectionData("categories", user, list);
      setIsLoading(false)
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const handleCreate = async() => {
    setVisible(false)
    const user = await retrieveData();
    let updatedCategories = list
    updatedCategories = {
      ...list,
      [newCategory.toLowerCase()]: {
        title: newCategory,
        tasks: [],
        icon: "settings",
        custom:true
      },
    };
    setCollectionData("categories", user, updatedCategories);
    setList(updatedCategories)
  }

 if (isLoading) {
   return <Spinner />;
 } else if (userData?.hasOwnProperty("profileCreated") === false) {
   return <NewUser userName={userData?.userName} />;
 }
  return (
    <View style={styles.container}>
      <View style={styles.listView}>
        {Object.values(list)
          .filter((item) => !item.hasOwnProperty("custom"))
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((item, i) => (
            <ListItem
              key={i}
              bottomDivider
              onPress={() => {
                navigation.navigate("Task Manager", { category: item, list });
              }}
            >
              <MaterialIcons name={item.icon} size={24} color="black" />
              <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
              </ListItem.Content>
              <MaterialIcons name="chevron-right" size={24} color="black" />
            </ListItem>
          ))}
        {Object.values(list)
          .filter((item) => item.hasOwnProperty("custom"))
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((item, i) => (
            <ListItem
              key={i}
              bottomDivider
              onPress={() => {
                navigation.navigate("Task Manager", { category: item, list });
              }}
            >
              <MaterialIcons name={item.icon} size={24} color="black" />
              <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
              </ListItem.Content>
              <MaterialIcons name="chevron-right" size={24} color="black" />
            </ListItem>
          ))}
      </View>
      <View style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
        <Text style={styles.title}>Create custom category</Text>
        <AntDesign
          name="pluscircle"
          size={26}
          color="rgb(32, 137, 220)"
          onPress={() => setVisible(true)}
        />
      </View>
      <Overlay  isVisible={visible} onBackdropPress={toggleOverlay}>
        <View style={{ width: screenWidth * 0.9,maxWidth:600 }}>
          <Input
            value={newCategory}
            onChangeText={(text) => setNewCategory(text)}
            placeholder="Enter your new Category"
          />
          <Button
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonTitleStyle}
            title="Create"
            onPress={handleCreate}
          />
        </View>
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  listView: {
    maxWidth: 600,
    width: screenWidth * 0.9,
  },
  buttonContainer: {
    width: "100%",
  },
  buttonStyle: {
    backgroundColor: "#FF6F00",
  },
  buttonTitleStyle: {
    fontWeight: "bold",
  },

});

export default ServiceScreen;
