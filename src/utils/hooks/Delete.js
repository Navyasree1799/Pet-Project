import { deleteDoc, doc } from "firebase/firestore";
import { auth, firestore } from "../../../config/firebase";
import { deleteUser } from "firebase/auth";

export async function DeleteAccount(email) {
    try {
       await deleteUser(auth.currentUser)
      await deleteDoc(doc(firestore, "profiles", email));
      await deleteDoc(doc(firestore, "categories", email));
    }
    catch (err) {
      console.log("Couldnt perform delete",err)
    }
}
