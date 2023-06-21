import * as ImagePicker from "expo-image-picker";
import { Platform, View } from "react-native";
import { Avatar } from "@rneui/themed";
import * as FileSystem from "expo-file-system";
import alert from "../utils/alert"

const getFileInfo = async (fileURI) => {
  if (Platform.OS !== "web") {
     const fileInfo = await FileSystem.getInfoAsync(fileURI);
     return fileInfo.size;
  } else {
     return new Promise((resolve, reject) => {
       const reader = new FileReader();

       reader.onload = (e) => {
         const arrayBuffer = e.target.result;
         const blob = new Blob([arrayBuffer]);
         const imageSize = blob.size;
         resolve(imageSize);
       };

       reader.onerror = (error) => {
         reject(error);
       };

       fetch(fileURI)
         .then((response) => response.blob())
         .then((blob) => {
           reader.readAsArrayBuffer(blob);
         })
         .catch((error) => {
           reject(error);
         });
     });
   }
  
};

const isLessThanTheMB = (fileSize, smallerThanSizeMB) => {
  const isOk = fileSize / 1024 / 1024 < smallerThanSizeMB;
  console.log(fileSize / 1024 / 1024);
  return isOk;
};

const AvatarPicker = ({avatar,setAvatar}) => {
 

  const handleAvatarPicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        console.log(result.assets[0].uri);
        const fileSize = await getFileInfo(result.assets[0].uri);
        console.log("File size:",fileSize)
        // if (!fileInfo?.size) {
        //   alert("Can't select this file as the size is unknown.");
        //   return;
        // }
         const isLt15MB = isLessThanTheMB(fileSize, 10);
         if (!isLt15MB) {
           alert(`Image size must be smaller than 10MB!`);
           return;
         } else {
            setAvatar(result.assets[0].uri);
         }
      }
    } catch (E) {
      console.log(E);
    }
  };

  return (
    <View>
      <Avatar
        size="large"
        containerStyle={{ backgroundColor: "grey" }}
        rounded
        title="P"
        source={avatar ? { uri: avatar } : null}
        showEditButton
        onEditPress={handleAvatarPicker}
        onPress={handleAvatarPicker}
      >
        <Avatar.Accessory size={23} />
      </Avatar>
    </View>
  );
};

export default AvatarPicker;
