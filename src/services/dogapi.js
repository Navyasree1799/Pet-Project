import axios from "axios"

export async function getBreeds(){
    return await axios.get("https://api.thedogapi.com/v1/breeds")
    .then((res)=>res.data)
    .catch((err)=>console.log(err))

}