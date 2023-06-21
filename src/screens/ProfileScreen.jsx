import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import useAuth from "../utils/hooks/useAuth";
import AvatarPicker from "../components/AvatarPicker";
import { getBreeds } from "../services/dogapi";
import { hasObjectChanged } from "../utils/helpfulFunctions";
import { setCollectionData } from "../utils/firebaseFunctions";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore";
import { firestore, storage } from "../../config/firebase";
import getBlobFromUri from "../utils/getBlobFromUri";
import { Icon, Slider } from "@rneui/themed";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

const ProfileScreen = ({ navigation }) => {
  const [petObj, setPetObj] = useState({});

  const [defaultPetObj, setDefaultPetObj] = useState({});
  const { retrieveData } = useAuth();
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]);

  const [breedOpen, setBreedOpen] = useState(false);
  const [breedList, setBreedList] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    // Handle form submission
    const user = await retrieveData();
    if (defaultPetObj?.avatar === petObj?.avatar) {
      setCollectionData("profiles", user, { ...petObj, profileCreated: true });
      navigation.navigate("Home");
    } else {
      uploadToStorage();
      navigation.navigate("Home");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  async function getUserData() {
    const user = await retrieveData();
    const { avatar, breed, age, gender, name, petType, userName } = user;
    setDefaultPetObj({ avatar, breed, age, gender, name, petType, userName });
    if (user) {
      setPetObj({ avatar, breed, age, gender, name, petType, userName });
    }
    const breeds = await getBreeds(petType);
    const temp = breeds.map((breed) => ({
      label: breed.name,
      value: breed.name,
    }));
    setBreedList(temp);
  }

  function onChange(prop, value) {
    setPetObj((petObj) => ({ ...petObj, [prop]: value }));
  }

  async function uploadToStorage() {
    const imageBlob = await getBlobFromUri(petObj.avatar);
    const storageRef = ref(storage, "pet-avatars/" + Date.now());
    const uploadTask = uploadBytesResumable(storageRef, imageBlob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;
          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          updateProfile(downloadURL);
        });
      }
    );
  }

  async function updateProfile(url = "") {
    const petData = { ...pet, profileCreated: true };
    const user = retrieveData();
    const profilesRef = collection(firestore, "profiles");

    try {
      await setDoc(doc(profilesRef, user.email.toLowerCase()), {
        ...petData,
        ...petObj,
        avatar: url,
      });
    } catch (err) {
      console.log(err);
    } finally {
      navigation.navigate("User Stack", {
        screen: "Home",
        params: { reload: "true" },
      });
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ display: "flex", alignItems: "center" }}>
        <AvatarPicker
          avatar={petObj.avatar}
          setAvatar={(blob) => onChange("avatar", blob)}
        />
      </View>
      <Text style={styles.label}>Pet Name</Text>
      <TextInput
        style={styles.input}
        value={petObj.name || ""}
        onChangeText={(text) => onChange("name", text)}
        selectionColor={"#5188E3"}
        placeholder="Enter Name"
        placeholderTextColor="#B7B7B7"
      />

      <Text style={styles.label}>Pet Age</Text>
      <View style={styles.dropdownContainer}>
        <Slider
          // value={pet.age}
          value={petObj.age || ""}
          // onValueChange={(text) => setPet({ ...pet, age: text })}
          onValueChange={(text) => onChange("age", text)}
          maximumValue={50}
          minimumValue={0}
          step={1}
          trackStyle={{ height: 10, backgroundColor: "transparent" }}
          thumbStyle={{
            height: 20,
            width: 20,
            backgroundColor: "transparent",
          }}
          thumbProps={{
            children: (
              <View>
                {Platform.OS == "web" ? (
                  <Ionicons
                    name="heart-circle"
                    style={{ bottom: 0, right: 20 }}
                    size={30}
                    color="#f50"
                  />
                ) : (
                  <Icon
                    name="heartbeat"
                    type="font-awesome"
                    size={20}
                    reverse
                    containerStyle={{ bottom: 20, right: 20 }}
                    color="#f50"
                  />
                )}
                <Text style={{ bottom: 30 }}>{petObj.age}</Text>
              </View>
            ),
          }}
        />
      </View>

      {/* <Text style={styles.label}>Pet Age</Text>
      <TextInput
        style={styles.input}
        value={petObj.age || ""}
        onChangeText={(text) => onChange("age", text)}
        selectionColor={"#5188E3"}
        placeholder="Enter Password"
        placeholderTextColor="#B7B7B7"
      /> */}

      <Text style={styles.label}>Breed</Text>
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          dropDownDirection="TOP"
          dropDownContainerStyle={{
            position: "relative",
            top: 0,
            height: 200,
          }}
          style={styles.dropdown}
          open={breedOpen}
          value={petObj.breed}
          items={breedList}
          setOpen={(v) => {
            Keyboard.dismiss();
            setBreedOpen(v);
          }}
          setValue={(callback) =>
            setPetObj((petObj) => ({
              ...petObj,
              breed: callback(petObj.breed),
            }))
          }
          setItems={setBreedList}
          placeholder="Select breedList"
          placeholderStyle={styles.placeholderStyles}
          loading={loading}
          activityIndicatorColor="#5188E3"
          searchable={true}
          searchPlaceholder="Search your breedList here..."
          zIndex={1000}
          zIndexInverse={3000}
        />
      </View>

      <Text style={styles.label}>Pet Gender</Text>
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          style={styles.dropdown}
          open={genderOpen}
          value={petObj.gender}
          items={gender}
          setOpen={(v) => {
            Keyboard.dismiss();
            setGenderOpen(v);
          }}
          setValue={(callback) =>
            setPetObj((petObj) => ({
              ...petObj,
              gender: callback(petObj.gender),
            }))
          }
          setItems={setGender}
          placeholder="Select Gender"
          placeholderStyle={styles.placeholderStyles}
          zIndex={3000}
          zIndexInverse={1000}
        />
      </View>

      <Text style={styles.label}>Your Name</Text>
      <TextInput
        style={styles.input}
        value={petObj.userName || ""}
        onChangeText={(text) => onChange("userName", text)}
        selectionColor={"#5188E3"}
        placeholder="Enter Your Name"
        placeholderTextColor="#B7B7B7"
      />

      {hasObjectChanged(defaultPetObj, petObj) && (
        <TouchableOpacity style={styles.getStarted} onPress={onSubmit}>
          <Text style={styles.updateText}>Update</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 10,
  },
  input: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    marginHorizontal: 10,
    paddingStart: 10,
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 7,
    marginStart: 10,
  },
  placeholderStyles: {
    color: "grey",
  },
  dropdownContainer: {
    marginHorizontal: 10,
    marginBottom: 15,
    zIndex: 2,
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 50,
  },
  getStarted: {
    backgroundColor: "#5188E3",
    color: "white",
    textAlign: "center",
    marginHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  updateText: {
    color: "white",
    textAlign: "center",
  },
  logIn: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  links: {
    textAlign: "center",
    textDecorationLine: "underline",
    color: "#758580",
  },
});

export default ProfileScreen;
