import { Button, Card, Icon, Input, Slider } from "@rneui/themed";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
} from "react-native";
import dog from "../../assets/dog.png";
import cat from "../../assets/cat.png";
import { collection, doc, setDoc } from "firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";
import { firestore, storage } from "../../config/firebase";
import { useEffect } from "react";
import useAuth from "../utils/hooks/useAuth";
import AvatarPicker from "../components/AvatarPicker";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getBreeds } from "../services/dogapi";
import getBlobFromUri from "../utils/getBlobFromUri";
import { screenWidth } from "../utils/helpfulFunctions";

const ProfileCreation = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [pet, setPet] = useState({
    breed: "",
    name: "",
    age: "10",
    gender: "",
    avatar: "",
    petType: "",
  });
  const [user, setUser] = useState();
  const { retrieveData } = useAuth();
  const [open, setOpen] = useState(false);
  const [breedList, setBreedList] = useState([]);
  const [genderOpen, setGenderOpen] = useState();
  const [genderList, setGenderList] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]);

  useEffect(() => {
    getuserData();
  }, []);

  async function getuserData() {
    const user = await retrieveData();
    setUser(user);
    updateBreeds('dog');
  }

  async function updateBreeds(animal) {
    const breeds = await getBreeds(animal);
    const temp = breeds.map((breed) => ({
      label: breed.name,
      value: breed.name,
      id:breed.id
    }));
    setBreedList(temp);
  }

  const goToNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const goToPreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderPetTypeStep();
      case 2:
        return renderProfileFormStep();
      default:
        return null;
    }
  };

  const renderPetTypeStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.title}>Select Pet Type</Text>
        <View style={styles.imageContainer}>
          <PetCard
            title="Dog"
            onPress={() => {
              setPet({ ...pet, petType: "dog" });
              updateBreeds("dog");
              goToNextStep();
            }}
            selected={pet.petType}
          />
          <PetCard
            title="Cat"
            onPress={() => {
              setPet({ ...pet, petType: "cat" });
              updateBreeds("cat");
              goToNextStep();
            }}
            selected={pet.petType}
          />
        </View>
      </View>
    );
  };

  const renderProfileFormStep = () => {
    return (
      <View style={styles.stepContainer}>
        <View style={{ display: "flex", alignItems: "center" }}>
          <Text style={styles.title}>Create Pet Profile</Text>
          <AvatarPicker avatar={pet.avatar} setAvatar={handleSetAvatar} />
        </View>
        <Text style={styles.label}>Pet Name</Text>
        <TextInput
          style={styles.input}
          value={pet.name}
          onChangeText={(text) => setPet({ ...pet, name: text })}
          placeholder="Enter your pet name"
          selectionColor={"#5188E3"}
          placeholderTextColor="#B7B7B7"
        />
        <Text style={styles.label}>Pet Age</Text>
        <View style={styles.dropdownContainer}>
          <Slider
            value={pet.age}
            onValueChange={(text) => setPet({ ...pet, age: text })}
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
                  <Text style={{ bottom: 30 }}>{pet.age}</Text>
                </View>
              ),
            }}
          />
        </View>

        <Text style={styles.label}>Breed</Text>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            style={styles.dropdown}
            open={open}
            items={breedList}
            setOpen={(v) => {
              Keyboard.dismiss();
              setOpen(v);
            }}
            value={pet.breed}
            setValue={(callback) => {
              setPet((pet) => ({ ...pet, breed: callback(pet.breed) }));
            }}
            setItems={setBreedList}
            placeholder="Select breed"
            placeholderStyle={styles.placeholderStyles}
            activityIndicatorColor="#5188E3"
            searchable={true}
            searchPlaceholder="Search your breedList here..."
            zIndex={1000}
            zIndexInverse={3000}
            dropDownDirection="TOP"
            dropDownContainerStyle={{
              position: "relative",
              top: 0,
              height: 200,
            }}
          />
        </View>
        <Text style={styles.label}>Pet Gender</Text>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            style={styles.dropdown}
            open={genderOpen}
            multiple={false}
            value={pet.gender}
            setValue={(callback) =>
              setPet((pet) => ({ ...pet, gender: callback(pet.gender) }))
            }
            items={genderList}
            setOpen={(v) => {
              Keyboard.dismiss();
              setGenderOpen(v);
            }}
            setItems={setGenderList}
            placeholder="Select Pet Gender"
            placeholderStyle={styles.placeholderStyles}
            zIndex={3000}
            zIndexInverse={1000}
          />
        </View>

        <Button
          buttonStyle={styles.buttonStyle}
          containerStyle={styles.buttonContainer}
          titleStyle={styles.buttonTitleStyle}
          title="Submit"
          disabled={!validateProfileForm()}
          onPress={handleSubmit}
        />
        <Button
          buttonStyle={styles.backButtonStyle}
          containerStyle={styles.buttonContainer}
          titleStyle={styles.buttonTitleStyle}
          title="Back"
          onPress={goToPreviousStep}
        />
      </View>
    );
  };

  function validateProfileForm() {
    return pet.name.length > 0 && pet.breed.length > 0 && pet.gender.length > 0;
  }

  function handleSetAvatar(blob) {
    setPet({ ...pet, avatar: blob });
  }

  async function uploadToStorage() {
    const imageBlob = await getBlobFromUri(pet.avatar);
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
    const userName = user?.email.substring(0, user?.email.indexOf("@"));
    const profilesRef = collection(firestore, "profiles");

    try {
      await setDoc(doc(profilesRef, user.email.toLowerCase()), {
        ...petData,
        email: user.email,
        id: user.uid,
        userName,
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

  const handleSubmit = async () => {
    pet.avatar.length > 0 ? uploadToStorage() : updateProfile();
  };

  return <View style={styles.container}>{renderStepContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  stepContainer: {
    maxWidth: 600,
    flex: 1,
    width: screenWidth * 0.85,
  },
  inputContainer: {
    paddingHorizontal: 0,
    borderWidth: 0,
  },
  title: {
    textAlign: "center",
    maxWidth: 600,
    width: screenWidth * 0.85,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    padding: 0,
  },
  // dropdown: {
  //   marginTop: 0,
  //   padding: 0,
  //   borderWidth: 0,
  //   borderBottomWidth: 1,
  //   borderRadius: 0,
  //   backgroundColor: "transparent",
  //   width: screenWidth * 0.85,
  //   maxWidth: 600,
  //   marginBottom: 16,
  // },
  // dropdownContainer: {
  //   marginTop: 0,
  //   padding: 0,
  //   width: screenWidth * 0.85,
  //   maxWidth: 600,
  // },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 48,
  },
  petCard: {
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 16,
  },
  petCardText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 7,
    marginStart: 10,
  },
  input: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    backgroundColor: "white",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    marginHorizontal: 10,
    paddingStart: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 16,
  },
  buttonStyle: {
    backgroundColor: "#FF6F00",
    backgroundColor: "rgba(111, 202, 186, 1)",
    borderRadius: 5,
  },
  backButtonStyle: {
    backgroundColor: "#ccc",
  },
  buttonTitleStyle: {
    fontWeight: "bold",
  },
  inputError: {
    color: "red",
  },
  placeholderStyles: {
    color: "#B7B7B7",
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
});

const PetCard = ({ title, onPress, selected }) => {
  const cardStyle =
    selected === title
      ? [styles.petCard, { borderColor: "#FF6F00" }]
      : styles.petCard;
  const image = title === "Dog" ? dog : cat;

  return (
    <TouchableOpacity onPress={onPress} style={cardStyle}>
      <Card.Image source={image} style={{ width: 100, height: 100 }} />
      <Text style={styles.petCardText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ProfileCreation;
