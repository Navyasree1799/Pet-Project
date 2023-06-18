import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, Input } from "@rneui/themed";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import useAuth from "../utils/hooks/useAuth";

const SignInScreen = ({ navigation }) => {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });
  const { login } = useAuth();

  async function signIn() {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );

      const data = {
        email: value.email,
        uid: res.user.uid,
        userName: value.email.substring(0, value.email.indexOf("@")),
      };
      console.log(data);
      login(data);
      navigation.navigate("User Stack", { screen: "Home" });
    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title1}>Signin screen!</Text>

      {!!value.error && (
        <View style={styles.error}>
          <Text>{value.error}</Text>
        </View>
      )}

      <View style={styles.controls}>
        <Input
          placeholder="Email"
          containerStyle={styles.control}
          value={value.email}
          onChangeText={(text) => setValue({ ...value, email: text })}
          leftIcon={<Icon name="envelope" size={16} />}
        />

        <Input
          placeholder="Password"
          containerStyle={styles.control}
          value={value.password}
          onChangeText={(text) => setValue({ ...value, password: text })}
          secureTextEntry={true}
          leftIcon={<Icon name="key" size={16} />}
        />
        <Button
          buttonStyle={{
            backgroundColor: "black",
            borderRadius: 30,
          }}
          containerStyle={styles.buttonContainer}
          titleStyle={{ fontWeight: "bold" }}
          onPress={signIn}
          title="Sign in"
        />
        <Text style={{ textAlign: "center" }}>Don't have an account?</Text>
        <Button
          buttonStyle={{
            backgroundColor: "rgba(111, 202, 186, 1)",
            borderRadius: 30,
          }}
          containerStyle={styles.buttonContainer}
          titleStyle={{ fontWeight: "bold" }}
          title="SignUp"
          onPress={() => navigation.navigate("Sign Up")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title1: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
  },

  controls: {
    width: "100%",
    maxWidth: 500,
    paddingHorizontal: 20,
  },

  control: {
    marginTop: 10,
  },

  error: {
    marginTop: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#D54826FF",
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default SignInScreen;
