import { UserLeaveActions } from "../../constants/ReduxConstants";
import {
  getLeaveStatsFromServer,
  getHolidayListFromServer,
  getLeaveHistoryFromServer
} from "../../services/LeaveService";
import { ResponseErrors, ApiEndPoints } from "../../constants/ServiceConstants";
import { ALERT_RESOURCES } from "../../constants/ResourceConstants";
import { checkEmptyData, dayOfWeekAsString } from "../../utils/utilFunctions";
import { showLoading, hideLoading } from "./pageActions";
import moment from "moment";

const leaveTypes = ["Casual", "Sick", "Privilege", "Half", "Unpaid"];
const leaveStatus = ["Pending", "Approved", "Rejected"];

export const getLeaveStatistics = () => {
  return async dispatch => {
    try {
      dispatch(showLoading);
      const statsDataResponse = await getLeaveStatsFromServer();
      if (statsDataResponse.ErrorCode == ResponseErrors.OK) {
        if (checkEmptyData(statsDataResponse.Response)) {
          dispatch(dispatchError(ALERT_RESOURCES.NO_RECORDS_FOUND));
        } else {
          let formattedResponse = formatLeaveStatsData(
            statsDataResponse.Response
          );
          dispatch(dispatchLeaveStatsData(formattedResponse));
        }
      } else {
        dispatch(dispatchError(statsDataResponse.ErrorDescription));
      }
    } catch (e) {
      dispatch(dispatchError(ALERT_RESOURCES.ERROR_WHILE_FETCHING_DATA));
    }
  };
};

export const dispatchLeaveStatsData = leaveStats => {
  return {
    type: UserLeaveActions.GET_LEAVE_STATISTICS,
    payload: leaveStats
  };
};

export const getHolidayList = () => {
  return async dispatch => {
    try {
      dispatch(showLoading);
      const statsDataResponse = await getHolidayListFromServer();
      if (statsDataResponse.ErrorCode == ResponseErrors.OK) {
        if (checkEmptyData(statsDataResponse.Response)) {
          dispatch(dispatchError(ALERT_RESOURCES.NO_RECORDS_FOUND));
        } else {
          let formattedResponse = formatHolidayListData(
            statsDataResponse.Response
          );
          dispatch(dispatchHolidayListData(formattedResponse));
        }
      } else {
        dispatch(dispatchError(statsDataResponse.ErrorDescription));
      }
    } catch (e) {
      dispatch(dispatchError(ALERT_RESOURCES.ERROR_WHILE_FETCHING_DATA));
    }
  };
};

export const dispatchHolidayListData = formattedResponse => {
  return {
    type: UserLeaveActions.GET_HOLIDAY_LIST,
    payload: formattedResponse
  };
};

export const getLeaveHistory = () => {
  return async dispatch => {
    try {
      dispatch(showLoading);
      const statsDataResponse = await getLeaveHistoryFromServer();
      if (statsDataResponse.ErrorCode == ResponseErrors.OK) {
        if (checkEmptyData(statsDataResponse.Response)) {
          dispatch(dispatchError(ALERT_RESOURCES.NO_RECORDS_FOUND));
        } else {
          let formattedResponse = formatLeaveHistoryData(
            statsDataResponse.Response
          );
          dispatch(dispatchLeaveHistoryData(formattedResponse));
        }
      } else {
        dispatch(dispatchError(statsDataResponse.ErrorDescription));
      }
    } catch (e) {
      dispatch(dispatchError(ALERT_RESOURCES.ERROR_WHILE_FETCHING_DATA));
    }
  };
};

export const dispatchLeaveHistoryData = formattedResponse => {
  return {
    type: UserLeaveActions.GET_LEAVE_HISTORY,
    payload: formattedResponse
  };
};

export const dispatchError = errorMessage => {
  return {
    type: UserLeaveActions.ERROR_WHILE_FETCHING_LEAVE_DATA,
    errorMessage: errorMessage
  };
};

function formatLeaveStatsData(leaveData) {
  let tableData = [];
  for (let i = 0; i < leaveTypes.length; i++) {
    const rowData = [];
    let totalLeaves = "";
    let availableLeaves = "";
    let usedLeave = "";
    switch (leaveTypes[i]) {
      case "Sick":
        totalLeaves = leaveData["total_sick_leave"];
        availableLeaves = leaveData["sick_leave_available"];
        usedLeave = totalLeaves - availableLeaves;
        break;
      case "Casual":
        totalLeaves = leaveData["total_casual_leave"];
        availableLeaves = leaveData["casual_leave_available"];
        usedLeave = totalLeaves - availableLeaves;
        break;
      case "Privilege":
        totalLeaves = leaveData["total_privileged_leave"];
        availableLeaves = leaveData["privileged_leave_available"];
        usedLeave = totalLeaves - availableLeaves;
        break;
      case "Half":
        totalLeaves = "N/A";
        availableLeaves = "N/A";
        usedLeave = leaveData["half_day_taken"];
        break;
      case "Unpaid":
        totalLeaves = "N/A";
        availableLeaves = "N/A";
        usedLeave = leaveData["paid_leave_used"];
        break;
      default:
        break;
    }
    rowData.push(leaveTypes[i]);
    rowData.push(usedLeave);
    rowData.push(availableLeaves);
    rowData.push(totalLeaves);
    tableData.push(rowData);
  }
  return tableData;
}

function formatHolidayListData(holidayList) {
  let tableData = [];
  for (let i = 0; i < holidayList.length; i++) {
    const rowData = [];
    rowData.push(i + 1);
    rowData.push(holidayList[i].name_of_holiday);
    rowData.push(moment(holidayList[i].date_of_holiday).format("D MMM YY"));
    rowData.push(
      dayOfWeekAsString(moment(holidayList[i].date_of_holiday).day(), false)
    );
    tableData.push(rowData);
  }
  return tableData;
}

function formatLeaveHistoryData(leaveHistory) {
  let tableData = [];
  for (let i = 0; i < leaveHistory.length; i++) {
    const rowData = [];
    rowData.push(moment(leaveHistory[i].leave_applied_on).format("D MMM YY"));
    rowData.push(moment(leaveHistory[i].from_date).format("D MMM YY"));
    rowData.push(moment(leaveHistory[i].to_date).format("D MMM YY"));
    rowData.push(leaveHistory[i].deductable_leaves);
    rowData.push(leaveHistory[i].leave_reason);
    rowData.push(leaveTypes[leaveHistory[i].request_type - 1]);
    rowData.push(leaveStatus[leaveHistory[i].request_status]);
    tableData.push(rowData);
  }
  return tableData;
}
