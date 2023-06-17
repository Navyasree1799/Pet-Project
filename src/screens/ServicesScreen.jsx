import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Button, Input, ListItem, Overlay } from "@rneui/themed";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { firestore } from "../../config/firebase";
import useAuth from "../utils/hooks/useAuth";

const screenWidth = Dimensions.get("window").width;

const ServiceScreen = ({ navigation }) => {

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
  });
  const [visible, setVisible] = useState(false);
  const [newCategory,setNewCategory] = useState("")
  const [userData, setUserData] = useState();
  const { retrieveData } = useAuth();

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories(user) {
    try {
      user = await retrieveData();
      console.log("User: ", user);
      const docRef = doc(firestore, "categories", user.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setList(docSnap.data());
      } else {
        console.log("No Document Found");
        setCategories(user.email, list);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function setCategories(email, obj) {
    const categoryRef = collection(firestore, "categories");
    await setDoc(doc(categoryRef, email), obj);
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  };


  const handleSubmit = () => {
    let updatedCategories = list
    updatedCategories = {
      ...list,
      [newCategory]: {
        title: "newCategory",
        tasks: [],
        icon: "settings",
      },
    };
  }

  return (
    <View style={styles.container}>
      <View style={styles.listView}>
        {Object.values(list).map((item, i) => (
          <ListItem
            key={i}
            bottomDivider
            onPress={() =>
              navigation.navigate("Task Manager", { category: item, list })
            }
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
        <Text style={styles.title}>Add New Category</Text>
        <AntDesign
          name="pluscircle"
          size={26}
          color="rgb(32, 137, 220)"
          onPress={() => setVisible(true)}
        />
      </View>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <View style={{ width: screenWidth * 0.9 }}>
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
            onPress={handleSubmit}
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
    // justifyContent: "center",
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
    width: screenWidth*.9,
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
