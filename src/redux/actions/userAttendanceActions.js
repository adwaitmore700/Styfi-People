import {
  UserAttendanceActions
} from "../../constants/ReduxConstants";
import {
  getAttendanceData,
  getEmployeeWorkHours
} from "../../services/AttendanceService";
import {
  ResponseErrors
} from "../../constants/ServiceConstants";
import {
  ALERT_RESOURCES
} from "../../constants/ResourceConstants";
import {
  checkEmptyData,
  getLocalTimeFromTimeString
} from "../../utils/utilFunctions";
import {
  showLoading
} from "./pageActions";
import moment from "moment";
import {
  EVENT_TYPES,
  DATE_TIME_FORMAT
} from "../../constants/GeneralConstants";
import {
  COLORS
} from "../../styles/theme";

export const getEmployeeAttendance = (startDate, noOfDays) => {
  return async dispatch => {
    try {
      dispatch(showLoading);
      const statsDataResponse = await Promise.all([
        getAttendanceData(startDate, noOfDays),
        getEmployeeWorkHours(startDate)
      ]);
      if (
        statsDataResponse[0].ErrorCode == ResponseErrors.OK &&
        statsDataResponse[1].ErrorCode == ResponseErrors.OK
      ) {
        let formattedResponse = formatAttendanceData(
          startDate,
          noOfDays,
          statsDataResponse[0].Response,
          statsDataResponse[1].Response
        );
        dispatch(dispatchAttendanceData(formattedResponse));
      } else {
        dispatch(dispatchError(statsDataResponse[0].ErrorDescription));
      }
    } catch (e) {
      dispatch(dispatchError(ALERT_RESOURCES.ERROR_WHILE_FETCHING_DATA));
    }
  };
};

export const dispatchError = errorMsg => {
  return {
    type: UserAttendanceActions.ERROR_WHILE_FETCHING_ATTENDANCE_DATA,
    errorMessage: errorMsg
  };
};

export const dispatchAttendanceData = attendanceList => {
  return {
    type: UserAttendanceActions.GET_USER_ATTENDANCE,
    payload: checkEmptyData(attendanceList) ? {
      attendanceList: [],
      workHours: {
        actual: `0:0`,
        expected: `0:0`
      }
    } : attendanceList
  };
};

function formatAttendanceData(startDate, noOfDays, attendanceData, workHours) {
  let outputData = [];
  const baseDate = moment(startDate);
  for (let i = 1; i <= noOfDays; i++) {
    baseDate.date(i);
    let calendarDataArray = {};
    for (let j = 0; j < attendanceData.length; j++) {
      if (baseDate.date() == new Date(attendanceData[j].date).getDate()) {
        for (let k = 0; k < attendanceData[j].events.length; k++) {
          calendarDataArray[attendanceData[j].events[k].type] =
            attendanceData[j].events[k];
          calendarDataArray[attendanceData[j].events[k].type].in_time = getLocalTimeFromTimeString(attendanceData[j].events[k].in_time);
          calendarDataArray[attendanceData[j].events[k].type].out_time = getLocalTimeFromTimeString(attendanceData[j].events[k].out_time);
        }
        break;
      }
    }
    outputData.push({
      date: baseDate.format(DATE_TIME_FORMAT),
      calendarData: calendarDataArray
    });
  }
  let colorCalendarData = createCalendarData(outputData);
  return {
    attendanceList: outputData,
    workHours: {
      actual: `${workHours.hours}:${workHours.minutes}`,
      expected: `${workHours.expectedHours}:00`
    },
    calendarData: colorCalendarData
  };
}

function createCalendarData(rawData) {
  let outputArray = {};
  for (let i = 0; i < rawData.length; i++) {
    if (Object.keys(rawData[i].calendarData).length !== 0) {
      let dotsArray = [];
      for (let j = 0; j < Object.keys(rawData[i].calendarData).length; j++) {
        let color = renderEventColor(Object.keys(rawData[i].calendarData)[j]);
        dotsArray.push({
          key: rawData[i].calendarData[j],
          color: color,
          selectedDotColor: COLORS.WHITE_COLOR
        });
      }
      outputArray[rawData[i].date] = {
        dots: dotsArray
      };
    } else {
      let itemDate = moment(rawData[i].date);
      let dotsArray = [];
      if (moment().dayOfYear() > itemDate.dayOfYear()) {
        dotsArray.push({
          key: rawData[i].date,
          color: COLORS.ABSENT_DAY_STATUS_COLOR,
          selectedDotColor: COLORS.WHITE_COLOR
        });
        outputArray[rawData[i].date] = {
          dots: dotsArray
        };
      }
    }
  }
  return outputArray;
}

function renderEventColor(eventType) {
  switch (eventType) {
    case EVENT_TYPES[0]:
      return COLORS.WORKING_DAY_STATUS_COLOR;
    case EVENT_TYPES[1]:
      return COLORS.WORKING_DAY_STATUS_COLOR;
    case EVENT_TYPES[2]:
      return COLORS.WORKING_DAY_STATUS_COLOR;
    case EVENT_TYPES[3]:
      return COLORS.HOLIDAY_STATUS_COLOR;
    case EVENT_TYPES[4]:
      return COLORS.LEAVE_STATUS_COLOR;
    default:
      return COLORS.WHITE_COLOR;
  }
}