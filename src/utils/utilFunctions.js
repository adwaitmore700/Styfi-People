/*

*/
import SnackBar from "rn-snackbar";
import moment from "moment";

export function createServiceResponse(responseData, errorCode, errDesc) {
  return {
    Response: responseData,
    ErrorCode: errorCode,
    ErrorDescription: errDesc
  };
}

export function checkEmptyData(data) {
  return data == null || data == undefined || data == "" || data == {};
}

export function dateToString(date) {
  //const date = new Date(time);
  return date.toISOString().split("T")[0];
}

export function dayOfWeekAsString(dayIndex, shortForm) {
  if (shortForm) {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex];
  } else {
    return [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ][dayIndex];
  }
}

export function getLocalTimeFromTimeString(utcTimeString) {
  if (!checkEmptyData(utcTimeString)) {
    let valuesByUnit = utcTimeString.split(":");
    if (valuesByUnit[0] == "00") {
      return "N/A";
    }
    let totalMinutes = Number(valuesByUnit[0] * 60) + Number(valuesByUnit[1]);
    totalMinutes += -new Date().getTimezoneOffset();
    let minuteValue = totalMinutes % 60;
    return `${Math.floor(totalMinutes/60)}:${minuteValue < 10 ? "0"+minuteValue : minuteValue}`
  } else {
    return "";
  }
}

export function showNoNetworkAlert() {
  SnackBar.show("No network connection", {
    style: {
      justifyContent: "center",
      alignItems: "center",
      height: 50,
      padding: 5
    },
    id: "currentSnack", // Custom ID to avoid duplicated items being added to the queue, which in turn to be shown multiple time
    tapToClose: true,
    duration: 2500,
    position: "bottom",
    backgroundColor: "red",
    textColor: "white",
    textStyle: {
      fontSize: 15,
      color: "#fff"
    }
  });
}