import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "../utils/hooks/useAuth";
import { getBreeds } from "../services/dogapi";
import Spinner from "../components/Spinner";

const BreedInfoScreen = () => {
    const { retrieveData } = useAuth();
    const [userData,setUserData] = useState()
  const [isLoading, setIsLoading] = useState(true);
    const [breedInfo, setBreedInfo] = useState();
    
  useEffect(() => {
    getDate();
  },[]);

  async function getDate() {
    const user = await retrieveData();
    const breeds = await getBreeds(user.petType);
      const info = breeds.find((breed) => breed.name === user.breed);
      console.log("Info",info,user.breed)
    setBreedInfo(info);
      setIsLoading(false);
      setUserData(user)
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: breedInfo?.image?.url || userData?.avatar }}
        style={styles.image}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{breedInfo?.name}</Text>
        <Text style={styles.breed}>
          {breedInfo?.breed_group || breedInfo?.description}
        </Text>
        <Text style={styles.description}>{breedInfo?.bred_for}</Text>

        <View style={styles.iconContainer}>
          <Ionicons name="ios-paw" size={24} color="black" />
          <Text style={styles.temperament}>{breedInfo?.temperament}</Text>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons name="ios-heart" size={24} color="black" />
          <Text style={styles.lifeSpan}>{breedInfo?.life_span}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  breed: {
    fontSize: 18,
    color: "#888",
    marginBottom: 5,
  },
  description: {
    marginBottom: 15,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  temperament: {
    marginLeft: 10,
  },
  lifeSpan: {
    marginLeft: 10,
  },
};

export default BreedInfoScreen;
