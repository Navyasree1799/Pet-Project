import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button } from "react-native-elements";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import useAuth from "../utils/hooks/useAuth";

const SignUpScreen = ({ navigation }) => {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    passwordVisible: false,
    confirmPassword: "",
    cPasswordVisible: false,
    error: "",
  });

  const {login} = useAuth()

  async function signUp() {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    } else if (value.password !== value.confirmPassword) {
      setValue({
        ...value,
        error: "Passwords dont match Please check",
      });
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );
      const userName = value.email.substring(0, value.email.indexOf("@"));

      const data = {
        email: value.email,
        uid: res.user.uid,
        userName
      };
      console.log(data);

      const profilesRef = collection(firestore, "profiles");

      await setDoc(doc(profilesRef, value.email.toLocaleLowerCase()), data);
      
      login(data);
      navigation.navigate("ProfileCreation");
    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title1}>SignUp screen!</Text>

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
          secureTextEntry={!value.passwordVisible}
          leftIcon={<Icon name="key" size={16} />}
          rightIcon={
            value.passwordVisible ? (
              <Icon
                onPress={() =>
                  setValue({
                    ...value,
                    passwordVisible: !value.passwordVisible,
                  })
                }
                name="eye"
                size={16}
              />
            ) : (
              <Icon
                onPress={() =>
                  setValue({
                    ...value,
                    passwordVisible: !value.passwordVisible,
                  })
                }
                name="eye-slash"
                size={16}
              />
            )
          }
        />

        <Input
          placeholder="Confirm Password"
          containerStyle={styles.control}
          value={value.confirmPassword}
          onChangeText={(text) => setValue({ ...value, confirmPassword: text })}
          secureTextEntry={!value.cPasswordVisible}
          leftIcon={<Icon name="key" size={16} />}
          rightIcon={
            value.cPasswordVisible ? (
              <Icon
                onPress={() =>
                  setValue({
                    ...value,
                    cPasswordVisible: !value.cPasswordVisible,
                  })
                }
                name="eye"
                size={16}
              />
            ) : (
              <Icon
                onPress={() =>
                  setValue({
                    ...value,
                    cPasswordVisible: !value.cPasswordVisible,
                  })
                }
                name="eye-slash"
                size={16}
              />
            )
          }
        />

        <Button
          buttonStyle={{
            backgroundColor: "rgba(111, 202, 186, 1)",
            borderWidth: 2,
            borderColor: "white",
            borderRadius: 30,
          }}
          containerStyle={styles.buttonContainer}
          titleStyle={{ fontWeight: "bold" }}
          title="SignUp"
          onPress={signUp}
        />

        <Text style={{ textAlign: "center" }}>Already have an account?</Text>
        <Button
          buttonStyle={{
            backgroundColor: "black",
            borderWidth: 2,
            borderColor: "white",
            borderRadius: 30,
          }}
          containerStyle={styles.buttonContainer}
          titleStyle={{ fontWeight: "bold" }}
          onPress={() => navigation.navigate("Sign In")}
          title="Sign in"
        />
        {/* <Button title="Sign up" buttonStyle={styles.control} onPress={signUp} /> */}
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
    marginTop: 20,
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

export default SignUpScreen;
