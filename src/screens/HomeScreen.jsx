import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useEffect } from "react";
import useAuth from "../utils/hooks/useAuth";
import { getCollectionData } from "../utils/firebaseFunctions";
import NewUser from "../components/NewUser";
import Task from "../components/Task";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation, route }) {
  const [userData, setUserData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [todaysActivities, setTodaysActivities] = useState();
  const { retrieveData, updateUser, isLoading } = useAuth();

  // useEffect(() => {
  //   initialCall();
  // }, [route]);

  useFocusEffect(
    React.useCallback(() => {
      initialCall();
    }, [route])
  );

  async function initialCall() {
    const user = await retrieveData();
    setUserData(user);
    getData(user);
    if (!user?.hasOwnProperty("email")) {
      signOut(auth);
    } else if (user.hasOwnProperty("profileCreated") === false) {
    } else if (user.hasOwnProperty("profileCreated") === true) {
      const categoriesData = await getCollectionData("categories", user);
      getTasksByDate(categoriesData);
      setRefresh(!refresh);
    }
    
  }

  async function getData(user) {
    const profileData = await getCollectionData("profiles", user);
    setUserData(profileData);
    updateUser(profileData);
  }

  function getTasksByDate(userActivities) {
    const now = new Date().toDateTimeString();

    const flattenedData = Object.values(userActivities).flatMap(
      (activity) => activity.tasks || []
    );

    const filteredData = flattenedData.filter((task) => {
      console.log(new Date(task.date).toDateTimeString(), now);
      if (task.frequency === "Daily") {
        return true
      } else if (task.frequency === "Specific Date") {
        return new Date(task.time).toDateTimeString() === now;
      }
    })

    // const filteredData = flattenedData.filter((task) => {
    //   const taskDate = new Date(task.date);
    //   return (
    //     taskDate === now ||
    //     task.frequency === "Daily" ||
    //     (task.frequency === "Monthly" &&
    //       taskDate.getDate() === sd.getDate() &&
    //       taskDate.getMonth() === sd.getMonth())
    //   );
    // });
    const sortedData = filteredData.sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    );

    console.log("Sorted Screen: ",sortedData)
    setTodaysActivities(sortedData);
  }

  if (isLoading) {
    return <ActivityIndicator />;
  } else if (userData?.hasOwnProperty("profileCreated") === false) {
    return <NewUser userName={userData?.userName} />;
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hi {userData?.userName}!</Text>

        <View style={styles.activitiesContainer}>
          <Text style={styles.subTitle}>Todays Tasks</Text>
          {todaysActivities?.length > 0&&refresh && (
            <FlatList
              contentContainerStyle={{ display: "flex", alignItems: "center" }}
              data={todaysActivities}
              renderItem={({ item }) => (
                <Task
                  key={item.createdOn}
                  obj={item}
                  handlePress={() => {}}
                  hideDelete={true}
                />
              )}
              keyExtractor={(item) => item.notificationId}
            />
          )}
          {todaysActivities?.length > 0&&!refresh && (
            <FlatList
              contentContainerStyle={{ display: "flex", alignItems: "center" }}
              data={todaysActivities}
              renderItem={({ item }) => (
                <Task
                  key={item.createdOn}
                  obj={item}
                  handlePress={() => {}}
                  hideDelete={true}
                />
              )}
              keyExtractor={(item) => item.notificationId}
            />
          )}
          {!todaysActivities?.length && (
            <Text style={styles.dateText}>No Activities Found today</Text>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 10,
  },
  imageContainer: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    paddingHorizontal: 10,
    backgroundColor: "lightgrey",
    borderRadius: 5,
    padding: 20,
    color: "white",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 10,
    marginBottom: 10,
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
  },
  activitiesContainer: {
    flex: 1,
    marginTop: 16,
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
