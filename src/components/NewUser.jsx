import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { Text } from "react-native";
import {View,Image, StyleSheet} from "react-native"

const NewUser = ({userName}) => {
    const navigation = useNavigation()
    return (
      <View style={styles.container}>
        <Image
          style={styles.imageContainer}
          source={require("../../assets/puppy.png")}
        />
        <Text style={styles.title}>
          Welcome {"\n"}
          {userName}!
        </Text>

        <Button
          buttonStyle={{
            backgroundColor: "#3095ea",
            borderWidth: 2,
            borderColor: "white",
            borderRadius: 30,
          }}
          containerStyle={styles.buttonContainer}
          titleStyle={{ fontWeight: "bold" }}
          title="Create your profile"
          onPress={() => navigation.navigate("ProfileCreation")}
        />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
    textAlign: "center",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 500,
    marginVertical: 15,
    paddingHorizontal: 20,
  },
});


export default NewUser