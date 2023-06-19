import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../../config/firebase";

export async function getCollectionData(collectionName,user) {
  try {
    const docRef = doc(firestore, collectionName, user.email?.toLowerCase());
    const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        console.log("No such document!");
        return false
    }
  } catch (err) {
    console.log(err);
  }
}

export async function setCollectionData(collectionName, user, obj) {
  try {
    const profilesRef = collection(firestore, collectionName);
    await setDoc(doc(profilesRef, user.email?.toLowerCase()), obj);
    return true
  } catch (err) {
    console.log(err);
    return false
  }
}

