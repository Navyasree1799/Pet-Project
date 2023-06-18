import axios from "axios"

export async function getBreeds(animal='dog'){
    return await axios
      .get(`https://api.the${animal}api.com/v1/breeds`)
      .then((res) => res.data)
      .catch((err) => console.log(err));

}