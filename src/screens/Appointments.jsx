import React from "react";
import { StyleSheet, View, Text, Image, FlatList } from "react-native";
import { screenWidth } from "../utils/helpfulFunctions";
import { Calendar } from "react-native-calendars";
import { useEffect } from "react";
import { useState } from "react";
import Task from "../components/Task";
import { doc, getDoc } from "firebase/firestore";
import useAuth from "../utils/hooks/useAuth";
import { firestore } from "../../config/firebase";
const Appointments = () => {
  const {retrieveData} = useAuth()
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [activitiesForSelectedDate, setActivitiesForSelectedDate] = useState();
  const [activities, setActivities] = useState();
  const [markedDate, setMarkedDate] = useState({
    [new Date().toISOString().split("T")[0]]: {
      selected: true,
    },
  });
  useEffect(() => {
    getData()
  }, []);

   async function getData() {
     try {
      const user = await retrieveData();
       const docRef = doc(firestore, "categories", user.email);
       const docSnap = await getDoc(docRef);
       if (docSnap.exists()) {
         console.log("getData funciton ************: ",docSnap.data())
        
         setActivities(docSnap.data());
       } else {
         console.log("No such document!");
       }
     } catch (err) {
       console.log(err);
     }
   }

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    const defaultMarkedDate = {
      [day.dateString]: {
        selected: true,
      },
    };

    let sd = new Date(day.dateString);
    sd = sd.setDate(sd.getDate() + 1);
    sd = new Date(sd).toDateString();

    console.log(sd);
    const flattenedData = Object.values(activities).flatMap(
      (activity) => activity.tasks || []
    );
    //  console.log(flattenedData)
    const temp = flattenedData.filter((task) => {
      console.log(new Date(task.date).toDateString(), sd);
      return new Date(task.date).toDateString() === sd;
    });

    const sortedData = flattenedData.sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    );

    setActivitiesForSelectedDate(sortedData);

    let markedDates = defaultMarkedDate;
    Object.values(activities).forEach((activity) => {
      activity.tasks.forEach((task) => {
        if (task.date) {
          markedDates[task.date] = { marked: true };
        }
        console.log(markedDates);
      });
    });
    console.log("marked Dates: ",markedDates)
    setMarkedDate(markedDates);
  };

  console.log("activitiesForSelectedDate: ",activitiesForSelectedDate);

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar markedDates={markedDate} onDayPress={onDayPress} />
        <View style={styles.activitiesContainer}>
          {activitiesForSelectedDate?.length>0 ? (
            <FlatList
              data={activitiesForSelectedDate}
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
          ) : (
            <Text style={styles.dateText}>
              No Activities Found on {"\n"+selectedDate}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
  },
  calendarContainer: {
    flex: 1,
    width: screenWidth,
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
});

export default Appointments;
