import * as Notifications from "expo-notifications";
export const scheduleNotification = async (notification) => {
  const { frequency, date, time, title } = notification;
  const notificationTime = date ? dateTime(date, time) : new Date(time);
  const now = new Date()
  if (frequency === "Daily") {
    let nextNotificationDate = new Date();
    nextNotificationDate.setHours(notificationTime.getHours());
    nextNotificationDate.setMinutes(notificationTime.getMinutes());
    nextNotificationDate.setSeconds(notificationTime.getSeconds());
    if (nextNotificationDate < now) {
      nextNotificationDate.setDate(nextNotificationDate.getDate() + 1);
    }

    // Schedule the daily notification
     const id =  await Notifications.scheduleNotificationAsync({
       content: {
         title,
         body: "This is your daily notification!",
         sound: "default",
       },
       trigger: {
         hour: nextNotificationDate.getHours(),
         minute: nextNotificationDate.getMinutes(),
         repeats: true,
       },
     });
    return id
     
  } else if (frequency === "Specific Date") {
   
     const id = await Notifications.scheduleNotificationAsync({
       content: {
         title,
         body: "This is your specific date notification!",
         sound: "default",
       },
       trigger: {
         date: notificationTime,
       },
     });
    
    return id
  
  } else if (frequency === "Monthly") {
    let nextNotificationDate = new Date();
    nextNotificationDate.setDate(notificationTime.getDate());
    nextNotificationDate.setMonth(notificationTime.getMonth());
    nextNotificationDate.setFullYear(notificationTime.getFullYear());
    nextNotificationDate.setHours(notificationTime.getHours());
    nextNotificationDate.setMinutes(notificationTime.getMinutes());
    nextNotificationDate.setSeconds(notificationTime.getSeconds());

    if (nextNotificationDate < now) {
      nextNotificationDate.setMonth(nextNotificationDate.getMonth() + 1);
    }
     const id = Notifications.scheduleNotificationAsync({
       content: {
         title,
         body: "This is your monthly notification!",
         sound: "default",
       },
       trigger: {
         date: nextNotificationDate,
         repeats: true,
       },
     });
    return id
  } else {
    console.log("Invalid frequency value");
    return;
  }
};

function dateTime(dateTs, timeTs) {
  const date = new Date(dateTs);
  const time = new Date(timeTs);
  date.setHours(time.getHours());
  date.setMinutes(time.getMinutes());
  date.setSeconds(time.getSeconds());
  return date;
}
