import * as ImagePicker from "expo-image-picker";
import { View } from "react-native";
import { Avatar } from "@rneui/themed";

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
        
        setAvatar(result.assets[0].uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  return (
    <View>
      <Avatar
        size="large"
        containerStyle={{backgroundColor:"grey"}}
        rounded
        title="P"
        source={avatar ? { uri: avatar } : null}
        showEditButton
        onEditPress={handleAvatarPicker}
        onPress={handleAvatarPicker}
      />
    </View>
  );
};

export default AvatarPicker;
