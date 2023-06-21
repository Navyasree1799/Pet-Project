import { MaterialIcons } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Button, ButtonGroup, Input, FAB, BottomSheet } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { formatDate, formatTime } from "../utils/formatDate";
import { scheduleNotification } from "../utils/notifications/scheduleNotifications";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useRef } from "react";
import useAuth from "../utils/hooks/useAuth";
import alert from "../utils/alert";
import Task from "../components/Task";
import { setCollectionData } from "../utils/firebaseFunctions";
import { screenHeight, screenWidth, validateObj } from "../utils/helpfulFunctions";
import DatePicker from "../components/DatePicker";

Notifications?.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications?.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications?.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      console.log("Asking for permission");
      const { status } = await Notifications?.requestPermissionsAsync();
      console.log("Permission: ", status);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications?.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

const TaskManager = ({ route }) => {
  const { retrieveData } = useAuth();
  const [toggleRender, setToggleRender] = useState(true);
  const [categoryList, setCategoryList] = useState(route.params.list);
  const [tasksArray, setTaskArray] = useState(route.params.list);
  const [task, setTask] = useState(route.params.category);
  const [isVisible, setIsVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [update,setUpdate] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const frequencyList = ["Daily", "Monthly", "Specific Date"];
  const [taskObj, setTaskObj] = useState({
    title: "",
    time: "",
    date: "",
    frequency: "Daily",
  });

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token))
      .catch((err) =>
        console.log("registerForPushNotificationsAsync Error: ", err)
      );

    notificationListener.current =
      Notifications?.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications?.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications?.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications?.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  function onChangeTime(t) {
    // if (
    //   taskObj.frequency !== "Specific Date" &&
    //   new Date() > new Date(t.nativeEvent.timestamp)
    // ) {
    //   alert("Please Change you Input", "Time Cannot be less than current time");
    // } else {

    // }

    console.log("OnchangeTime: ",t)

    setShowTimePicker(false);
    setTaskObj({ ...taskObj, time: t.nativeEvent.timestamp });
  }

  function onChangeDate(t) {
    console.log("OnDate changed",t)
    setShowDatePicker(false);
    setTaskObj({ ...taskObj, date: t.nativeEvent.timestamp });
  }

  async function handleTaskCreate() {
    setIsVisible(false);
    const notificationId = Platform.OS!=="web"? await scheduleNotification(taskObj):"";
    let categoryObj = categoryList;
    console.log(categoryList);
    categoryObj[task.title.toLowerCase()].tasks.push({
      ...taskObj,
      createdOn: new Date(),
      notificationId,
      date: taskObj.frequency !== "Daily" ? taskObj.date : Date.now(),
    });
    const res = await updateCategories(categoryObj);
    if (res) {
      setTask(categoryObj[task.title.toLowerCase()]);
      setToggleRender(!toggleRender);
      setCategoryList(categoryObj);
    }
  }

    async function handleTaskUpdate() {
      setIsVisible(false);
      await handleDelete(update)
      await handleTaskCreate()
    }

  function handlePress(task) {
    setUpdate(task)
    setTaskObj(task);
    setIsVisible(true);
  }

  async function updateCategories(obj) {
    const user = await retrieveData();
    return await setCollectionData("categories", user, obj);
  }

  async function handleDelete(selectedTask) {
    console.log(selectedTask);
    Platform.OS!=="web"&& await Notifications.cancelScheduledNotificationAsync(
      selectedTask.notificationId
    );
    let categoryObj = categoryList;
    let tasks = task.tasks.filter(
      (obj) => obj.notificationId !== selectedTask.notificationId
    );

    categoryObj[task.title.toLowerCase()].tasks = tasks;
    console.log("categoryObj: ", categoryObj[task.title.toLowerCase()]);
    const res = await updateCategories(categoryObj);
    if (res) {
      updateCategories(categoryObj);
      setTask(categoryObj[task.title.toLowerCase()]);
      setToggleRender(!toggleRender);
      setCategoryList(categoryObj);
    }
    
    // setTask(categoryObj[task.title.toLowerCase()]);
      
  }

  function renderTasks() {
    return task.tasks.map((task) => {
      return (
        <Task
          key={task.createdOn}
          obj={task}
          handlePress={() => handlePress(task)}
          handleDelete={() => handleDelete(task)}
        />
      );
    });
  }

  return (
    <View style={styles.container}>
      <FAB
        onPress={() => setIsVisible(!isVisible)}
        style={{
          position: "absolute",
          zIndex: 2,
          bottom: 50,
          right: 30,
          alignSelf: "flex-end",
        }}
        visible={!isVisible}
        icon={{ name: "add", color: "white" }}
        color="green"
      />
      <ScrollView>
        {task?.tasks.length > 0 && toggleRender && renderTasks()}
        {!toggleRender && task?.tasks.length && renderTasks()}
        {!task?.tasks.length && (
          <View style={styles.empty}>
            <Text style={styles.subtitle}>
              No tasks found for {route.params.category.title}
            </Text>
          </View>
        )}
        <BottomSheet
          onBackdropPress={() => {
            setUpdate(null);
            setIsVisible(false);
          }}
          containerStyle={{width:screenWidth,maxWidth:600,alignSelf:"center"}}
          modalProps={{}}
          isVisible={isVisible}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.bottomSheetViewContainer}
          >
            <Text style={styles.title}>New Task</Text>
            <Input
              placeholder="Enter title"
              value={taskObj.title}
              onChangeText={(text) => setTaskObj({ ...taskObj, title: text })}
            />

            {showTimePicker ? (
              <View style={{ zIndex: 10 }}>
                <DatePicker
                  date={date}
                  minimumDate={new Date()}
                  onChangeTime={onChangeTime}
                  mode="time"
                />
                {/* <RNDateTimePicker
                  value={date}
                  onChange={(cb) => onChangeTime(cb)}
                  mode="time"
                  positiveButton={{ label: "OK", textColor: "green" }}
                /> */}
              </View>
            ) : (
              <Button
                onPress={() => setShowTimePicker(true)}
                buttonStyle={{ borderRadius: 5 }}
                containerStyle={{ paddingHorizontal: 10, marginBottom: 20 }}
                icon={
                  <MaterialIcons name="watch-later" size={24} color="white" />
                }
                title={`${
                  taskObj.time
                    ? formatDate(taskObj.date) + " " + formatTime(taskObj.time)
                    : "Choose time"
                } `}
              />
            )}

            {showDatePicker && (
              <View style={{ alignItems: "center" }}>
                <DatePicker
                  date={date}
                  minimumDate={new Date()}
                  onChangeTime={onChangeDate}
                  mode="date"
                />
              </View>
              // <RNDateTimePicker
              //   value={date}
              //   minimumDate={new Date()}
              //   onChange={(cb) => onChangeDate(cb)}
              //   mode="date"
              //   positiveButton={{ label: "OK", textColor: "green" }}
              // />
            )}

            <ButtonGroup
              buttons={frequencyList}
              selectedIndex={frequencyList.findIndex(
                (obj) => obj === taskObj.frequency
              )}
              onPress={(value) => {
                if (frequencyList[value] !== "Daily") {
                  setShowDatePicker(true);
                  setTaskObj({ ...taskObj, frequency: frequencyList[value] });
                } else {
                  setTaskObj({
                    ...taskObj,
                    frequency: frequencyList[value],
                    date: "",
                  });
                }
              }}
              containerStyle={{ marginBottom: 20 }}
            />
            {update ? (
              <Button
                onPress={()=>handleTaskUpdate()}
                // disabled={
                //   !validateObj(
                //     taskObj.frequency === "Daily"
                //       ? { title: taskObj.title, time: taskObj.time }
                //       : taskObj
                //   )
                // }
                buttonStyle={{
                  backgroundColor: "rgba(111, 202, 186, 1)",
                  borderRadius: 5,
                }}
                containerStyle={{ paddingHorizontal: 10, marginBottom: 20 }}
                icon={<MaterialIcons name="post-add" size={24} color="white" />}
                title="Update Task"
                
              />
            ) : (
              <Button
                onPress={handleTaskCreate}
                disabled={
                  !validateObj(
                    taskObj.frequency === "Daily"
                      ? { title: taskObj.title, time: taskObj.time }
                      : taskObj
                  )
                }
                buttonStyle={{
                  backgroundColor: "rgba(111, 202, 186, 1)",
                  borderRadius: 5,
                }}
                containerStyle={{ paddingHorizontal: 10, marginBottom: 20 }}
                icon={<MaterialIcons name="post-add" size={24} color="white" />}
                title="Create Task"
              />
            )}
            <Button
              onPress={() => setIsVisible(false)}
              buttonStyle={{ backgroundColor: "red", borderRadius: 5 }}
              containerStyle={{ paddingHorizontal: 10, marginBottom: 20 }}
              icon={<MaterialIcons name="close" size={24} color="white" />}
              title="Cancel"
            />
          </KeyboardAvoidingView>
        </BottomSheet>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    minHeight: screenHeight * .9,
    alignItems: "center",
    justifyContent:"center"
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    paddingLeft: 10,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
  },
  bottomSheetViewContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  time: {
    fontSize: 14,
    color: "#888",
  },
  taskTitle: {
    fontSize: 20,
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

export default TaskManager;
