import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import useAuth from "../utils/hooks/useAuth";
import {
  getCollectionData,
  setCollectionData,
} from "../utils/firebaseFunctions";
import NewUser from "../components/NewUser";
import Task from "../components/Task";
import { useFocusEffect } from "@react-navigation/native";
import Spinner from "../components/Spinner";
import { Text } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { screenHeight } from "../utils/helpfulFunctions";

const colorPallet = ["#817fff", "#fba172", "#ffd888", "#f9b6b4"];

export default function HomeScreen({ navigation, route }) {
  const [userData, setUserData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [todaysActivities, setTodaysActivities] = useState();
  const { retrieveData, updateUser } = useAuth();
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

  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      initialCall();
    }, [route])
  );

  async function initialCall() {
    const user = await retrieveData();
    setUserData(user);
    const categoriesData = await getCollectionData("categories", user);
    categoriesData
      ? setList(categoriesData)
      : setCollectionData("categories", user, list);
    setIsLoading(false);
    await getData(user);
    if (!user?.hasOwnProperty("email")) {
      signOut(auth);
    } else if (user.hasOwnProperty("profileCreated") === false) {
      setIsLoading(false);
    } else if (user.hasOwnProperty("profileCreated") === true) {
      const categoriesData = await getCollectionData("categories", user);
      getTasksByDate(categoriesData);
      setRefresh(!refresh);
    }
  }

  async function getData(user) {
    const profileData = await getCollectionData("profiles", user);
    if (profileData) {
      setUserData(profileData);
      updateUser(profileData);
    }
  }

  function getTasksByDate(userActivities) {
    const now = new Date().toDateString();
    const flattenedData = Object.values(userActivities).flatMap(
      (activity) => activity.tasks || []
    );

    const filteredData = flattenedData.filter((task) => {
      if (task.frequency === "Daily") {
        return true;
      } else if (task.frequency === "Specific Date") {
        return new Date(task.date).toDateString() === now;
      }
    });

    const sortedData = filteredData.sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    );
    setTodaysActivities(sortedData);
  }

  if (isLoading) {
    return <Spinner />;
  } else if (userData?.hasOwnProperty("profileCreated") === false) {
    return <NewUser userName={userData.userName} />;
  } else {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}> Hi {userData.userName}!</Text>
          <Text style={styles.para}>
            Lets take care of your pet {userData.name}!
          </Text>
          <View style={styles.categoryContainer}>
            {Object.values(list)
              .filter((item) => !item.hasOwnProperty("custom"))
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((item, i) => {
                return (
                  <TouchableOpacity
                    key={item.title}
                    onPress={() => {
                      navigation.navigate("Task Manager", {
                        category: item,
                        list,
                      });
                    }}
                  >
                    <MaterialIcons
                      style={[
                        { ...styles.categoryCard },
                        {
                          backgroundColor: colorPallet[i],
                          padding: 20,
                          borderRadius: 5,
                        },
                      ]}
                      name={item.icon}
                      size={24}
                      color="white"
                    />
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        marginTop: 5,
                      }}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>

          <View style={styles.activitiesContainer}>
            <LinearGradient
              colors={["#FDBE3B", "#FAD961"]}
              style={styles.gradient}
              start={[0, 0]}
              end={[1, 1]}
            >
              <Text style={styles.subTitle}>Todays Tasks</Text>
              {todaysActivities?.length > 0 && refresh && (
                <FlatList
                  nestedScrollEnabled
                  contentContainerStyle={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  data={todaysActivities}
                  renderItem={({ item }) => (
                    <Task
                      key={item.createdOn}
                      obj={item}
                      handlePress={() => {}}
                      hideDelete={true}
                    />
                  )}
                  keyExtractor={(item) => item.createdOn}
                />
              )}
              {todaysActivities?.length > 0 && !refresh && (
                <FlatList
                  contentContainerStyle={{
                    display: "flex",
                    alignItems: "center",
                    maxHeight: 200,
                  }}
                  nestedScrollEnabled
                  style={{ flexGrow: 0, maxHeight: 200 }}
                  data={todaysActivities}
                  renderItem={({ item }) => (
                    <Task
                      key={item.createdOn}
                      obj={item}
                      handlePress={() => {}}
                      hideDelete={true}
                    />
                  )}
                  keyExtractor={(item) => item.createdOn}
                />
              )}
              {!todaysActivities?.length && (
                <Text style={styles.dateText}>No Activities Found today</Text>
              )}
            </LinearGradient>
            <TouchableOpacity
              onPress={() => navigation.navigate("BreedInfoScreen")}
            >
              <LinearGradient
                colors={["#FD6585", "#FFD3A5"]}
                style={styles.findMoreBlock}
                start={[0, 0]}
                end={[1, 1]}
              >
                <FontAwesome5
                  name={userData?.petType}
                  size={24}
                  color="white"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.subTitle}>
                  Find more about {userData.breed} breed
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View
              style={{
                marginTop: 15,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PetFactsScreen", { animal: "dog" })
                }
                style={{ width: "48%" }}
              >
                <LinearGradient
                  colors={["#7F7FD5", "#91EAE4"]}
                  style={[{ ...styles.gradient }]}
                  start={[0, 0]}
                  end={[1, 1]}
                >
                  <Text style={styles.subTitle}>
                    Find Interesting dog facts
                  </Text>
                  <Image
                    source={require("../../assets/dogFact.png")}
                    style={{ width: 150, height: 150, resizeMode: "contain" }}
                  />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PetFactsScreen", { animal: "cat" })
                }
                style={{ width: "48%" }}
              >
                <LinearGradient
                  colors={["#7F7FD5", "#91EAE4"]}
                  style={[{ ...styles.gradient }, { height: "100%" }]}
                  start={[0, 0]}
                  end={[1, 1]}
                >
                  <Text style={styles.subTitle}>
                    {" "}
                    Find Interesting cat facts
                  </Text>
                  <Image
                    source={require("../../assets/catFact.png")}
                    style={{ width: 150, height: 150, resizeMode: "contain" }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    elevation: 4,
  },
  gradient: {
    borderRadius: 8,
    padding: 16,
    maxHeight: screenHeight * 0.3,
  },
  container: {
    flex: 1,
    minHeight: screenHeight,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  findMoreBlock: {
    borderRadius: 8,
    padding: 16,
    maxHeight: screenHeight * 0.3,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginTop: 10,
  },
  imageContainer: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  categoryCard: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  para: {
    color: "grey",
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 500,
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "white",
  },
  activitiesContainer: {
    flex: 1,
    marginTop: 10,
  },
  calendarContainer: {
    flex: 1,
    padding: 16,
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    marginVertical: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
});
