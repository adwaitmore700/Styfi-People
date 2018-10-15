import { UserLeaveActions, UserActions } from "../../constants/ReduxConstants";
const userLeaveReducer = (
  initialState = {
    leaveStats: [],
    holidayList: [],
    leaveHistory: [],
    errors: ""
  },
  action
) => {
  switch (action.type) {
    case UserActions.LOGOUT_SUCCESS:
      return {
        leaveStats: [],
        holidayList: [],
        leaveHistory: [],
        errors: ""
      };
    case UserLeaveActions.GET_LEAVE_STATISTICS:
      return {
        leaveStats: action.payload,
        holidayList: initialState.holidayList,
        leaveHistory: initialState.leaveHistory,
        errors: ""
      };
    case UserLeaveActions.GET_HOLIDAY_LIST:
      return {
        leaveStats: initialState.leaveStats,
        holidayList: action.payload,
        leaveHistory: initialState.leaveHistory,
        errors: ""
      };
    case UserLeaveActions.GET_LEAVE_HISTORY:
      return {
        leaveStats: initialState.leaveStats,
        holidayList: initialState.holidayList,
        leaveHistory: action.payload,
        errors: ""
      };
    case UserLeaveActions.ERROR_WHILE_FETCHING_LEAVE_DATA:
      return {
        leaveStats: [],
        holidayList: [],
        leaveHistory: [],
        errors: action.errorMessage
      };
    default:
      return initialState;
  }
};

export default userLeaveReducer;
