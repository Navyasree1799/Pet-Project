import { Button, Card, Input } from "@rneui/themed";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import dog from "../../assets/dog.png";
import cat from "../../assets/cat.png";
import { collection, doc, setDoc } from "firebase/firestore";
import DropDownPicker from 'react-native-dropdown-picker';
import { firestore, storage } from "../../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import useAuth from "../utils/hooks/useAuth";
import AvatarPicker from "../components/AvatarPicker";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import alert from "../utils/alert";
import { getBreeds } from "../services/dogapi";
import getBlobFromUri from "../utils/getBlobFromUri";

const screenWidth = Dimensions.get("window").width;

const ProfileCreation = ({navigation}) => {
  
  const [step, setStep] = useState(1);
  const [pet, setPet] = useState({
    breed: "",
    name: "",
    age: "",
    gender: "",
    avatar: ""
  });
  const [user, setUser] = useState();
  const { retrieveData } = useAuth();
  const [open, setOpen] = useState(false);
  const [breedList, setBreedList] = useState([]);
  const [genderOpen,setGenderOpen] = useState()
  const [genderList,setGenderList] = useState([
    {label:"Male",value:"male"},
    {label:"Female",value:"female"}
  ])

  useEffect(() => {
    
    getuserData();
  }, []);

  async function getuserData() {
    const user = await retrieveData();
    setUser(user);
    
    const breeds = await getBreeds()
    const temp = breeds.map((breed) => ({ label: breed.name, value: breed.name }))
    setBreedList(temp)
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
              setPet({ ...pet, petType: "Dog" });
              goToNextStep();
            }}
            selected={pet.petType}
          />
          <PetCard
            title="Cat"
            onPress={() => {
              setPet({ ...pet, petType: "Cat" });
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
        <Text style={styles.title}>Create Pet Profile</Text>
        <AvatarPicker avatar={pet.avatar} setAvatar={handleSetAvatar} />
        <Input
        inputContainerStyle={{borderBottomWidth:0}}
          containerStyle={styles.inputContainer}
          placeholderTextColor="black"
          style={styles.input}
          value={pet.name}
          onChangeText={(text) => setPet({ ...pet, name: text })}
          placeholder="Enter your pet name"
        />
  
        <DropDownPicker
          dropDownContainerStyle={{position: 'relative', top: 0,height:200 }}
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          dropDownDirection="TOP"
          open={open}
          multiple={false}
          value={pet.breed}
          setValue={(callback) => setPet(pet=>({ ...pet, breed: callback(pet.breed) }))}
          items={breedList}
          setOpen={setOpen}
          searchable={true}
          addCustomItem={true}
          setItems={setBreedList}
          placeholder="Select pet breed"
        />
     
        <Input
        inputContainerStyle={{borderBottomWidth:0}}
          containerStyle={styles.inputContainer}
          placeholderTextColor="black"
          style={styles.input}
          value={pet.age}
          onChangeText={(text) => setPet({ ...pet, age: text })}
          placeholder="Enter pet age"
          keyboardType="numeric"
          errorStyle={styles.inputError}
          errorMessage={validate(pet.age)}
        />
        <View style={{zIndex:10}}>
        <DropDownPicker
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          open={genderOpen}
          multiple={false}
          value={pet.gender}
          setValue={(callback) => setPet(pet=>({ ...pet, gender: callback(pet.gender) }))}
          items={genderList}
          setOpen={setGenderOpen}
          setItems={setGenderList}
          placeholder="Select Pet Gender"
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
    return (
      pet.name.length > 0 &&
      pet.breed.length > 0 &&
      pet.age.length > 0 &&
      pet.gender.length > 0
    );
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
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
        console.log(error)
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

  async function updateProfile(url="") {
    const petData = { ...pet, profileCreated: true };
    const userName = user?.email.substring(0, user?.email.indexOf("@"));
    const profilesRef = collection(firestore, "profiles");

    try {
      await setDoc(doc(profilesRef, user.email), {
        ...petData,
        email: user.email,
        id: user.uid,
        userName,
        avatar: url,

      });

    } catch (err) {
      console.log(err);
    }
    finally {
      navigation.navigate("User Stack",{screen:"Home", params:{ reload: "true" }});
    }
  }

  const handleSubmit = async () => {
    pet.avatar.length>0?uploadToStorage(): updateProfile()
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
    maxWidth:600,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth*.85,
  },
  inputContainer:{
   paddingHorizontal:0,
   borderWidth:0
  },
  title: {
    textAlign:"center",
    maxWidth:600,
    width: screenWidth*.85,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    padding:0,
  },
  dropdown:{
    marginTop:0,
    padding:0,
    borderWidth:0,
    borderBottomWidth:1,
    borderRadius:0,
    backgroundColor:"transparent",
    width: screenWidth*.85,
    maxWidth:600,
    marginBottom: 16,
  },
  dropdownContainer:{
    marginTop:0,
    padding:0,
    width: screenWidth*.85,
    maxWidth:600,
   
  },
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
  input: {
    width: screenWidth*.85,
    maxWidth: 600,
    marginVertical:0,
    borderBottomWidth:1,
    paddingLeft:10,
    paddingBottom:10,
    fontSize:16,
    color:"black"
  },
  buttonContainer: {
    width: "100%",
    marginTop: 16,
  },
  buttonStyle: {
    backgroundColor: "#FF6F00",
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

function validate(value) {
  return isNaN(value) ? "Must be a number" : "";
}

function areObjectValuesNotEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && !isEmpty(obj[key])) {
      return true; 
    }
  }
  return false;
}

export default ProfileCreation;
