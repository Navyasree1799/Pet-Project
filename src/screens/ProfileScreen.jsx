import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import useAuth from "../utils/hooks/useAuth";
import AvatarPicker from "../components/AvatarPicker";
import { getBreeds } from "../services/dogapi";
import { hasObjectChanged } from "../utils/helpfulFunctions";

const ProfileScreen = () => {
  const [petObj, setPetObj] = useState({});
  const [defaultPetObj, setDefaultPetObj] = useState({});
  
  const {retrieveData} = useAuth()
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]);

  const [breedOpen, setBreedOpen] = useState(false);
  const [breedList, setBreedList] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    // Handle form submission
  };

  

  useEffect(() => {
    getUserData()
  }, [])
  
  async function getUserData() {
    const user = await retrieveData()
    const { avatar, breed, age, gender, name, petType, userName } = user
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

  function onChange(prop,value) {
    setPetObj((petObj) => ({ ...petObj, [prop]: value }));
  }

  return (
    <View style={styles.container}>
      <View style={{ display: "flex", alignItems: "center" }}>
        <AvatarPicker
          avatar={petObj.avatar}
          setAvatar={(blob) => onChange("avatar", blob)}
        />
      </View>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={petObj.name}
        onChangeText={(text) => onChange("name", text)}
        selectionColor={"#5188E3"}
        placeholder="Enter Name"
        placeholderTextColor="#B7B7B7"
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={petObj.age}
        onChangeText={(text) => onChange("age", text)}
        selectionColor={"#5188E3"}
        placeholder="Enter Password"
        placeholderTextColor="#B7B7B7"
      />

      <Text style={styles.label}>Breed</Text>
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          style={styles.dropdown}
          open={breedOpen}
          value={petObj.breed}
          items={breedList}
          setOpen={setBreedOpen}
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

      <Text style={styles.label}>Gender</Text>
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          style={styles.dropdown}
          open={genderOpen}
          value={petObj.gender}
          items={gender}
          setOpen={setGenderOpen}
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

      {hasObjectChanged(defaultPetObj, petObj) && (
        <TouchableOpacity style={styles.getStarted} onPress={onSubmit}>
          <Text style={styles.getStartedText}>Update</Text>
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
    borderRadius: 50,
    marginTop: 20,
  },
  getStartedText: {
    color: "white",
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
