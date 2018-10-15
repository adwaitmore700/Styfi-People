import {
  UserAttendanceActions,
  UserActions
} from "../../constants/ReduxConstants";
const userAttendanceReducer = (
  initialState = {
    attendanceData: {
      attendanceList: [],
      workHours: {
        actual: `0:0`,
        expected: `0:0`
      }
    },
    errors: ""
  },
  action
) => {
  switch (action.type) {
    case UserActions.LOGOUT_SUCCESS:
      return {
        attendanceData: {
          attendanceList: [],
          workHours: {
            actual: `0:0`,
            expected: `0:0`
          }
        },
        errors: ""
      };
    case UserAttendanceActions.GET_USER_ATTENDANCE:
      return {
        attendanceData: action.payload,
        errors: ""
      };
    case UserAttendanceActions.ERROR_WHILE_FETCHING_ATTENDANCE_DATA:
      return {
        attendanceData: {
          attendanceList: [],
          workHours: {
            actual: `0:0`,
            expected: `0:0`
          },
          calendarData: []
        },
        errors: action.errorMessage
      };
    default:
      return initialState;
  }
};

export default userAttendanceReducer;
