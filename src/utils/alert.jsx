import { Alert, Platform } from "react-native"

const alert = (title,value) => {
    if(Platform.OS!="web"){
        Alert.alert(title,value||"")
    }else{
        window.alert(title+"\n"+value||"")
    }
    
}

export default alert