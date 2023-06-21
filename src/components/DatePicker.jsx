import RNDateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment/moment";
import { useState } from "react";
import { Platform, createElement } from "react-native"

function timeToTimestamp(time) {
  const [hours, minutes] = time.split(":");
  const date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date.getTime();
}

const DatePicker = ({date,onChangeTime,mode,minimumDate}) => {
    // const [date, setDate] = useState(new Date(Date.now()));
    if (Platform.OS !== "web") {
        return (
          <RNDateTimePicker
            value={date}
            minimumDate={minimumDate}
            onChange={(cb) => onChangeTime(cb)}
            mode = {mode}
            positiveButton={{ label: "OK", textColor: "green" }}
          />
        );
    } else {
        return createElement("input", {
          type: mode,
          value: date,
          onChange: (event) => {
            // console.log( event.target.value,new Date(Date.parse(event.target.value)).toISOString());
            
            onChangeTime({
              nativeEvent: {
                timestamp:
                  mode === "time"
                    ? timeToTimestamp(event.target.value)
                    : moment(event.target.value, "YYYY-MM-DD").valueOf(),
              },
            });
          },
          style: {
            height: 30,
            padding: 5,
            border: "2px solid #677788",
            borderRadius: 5,
          },
        });
    }
    
}

export default DatePicker