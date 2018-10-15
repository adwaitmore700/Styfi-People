import {
  getDataFromStorage
} from "../api/storageApi";
import {
  AsyncStorageKeys
} from "../constants/StorageConstants";
import {
  ResponseErrors,
  ApiEndPoints
} from "../constants/ServiceConstants";
import {
  createServiceResponse,
  checkEmptyData
} from "../utils/utilFunctions";

export async function getAttendanceData(startDate, noOfDays) {
  let operationResult = createServiceResponse();
  let auth_token = await getDataFromStorage(AsyncStorageKeys.AuthToken);
  let endPoint = `${
    ApiEndPoints.GET_EMPLOYEE_ATTENDANCE
  }start_date=${startDate}&no_of_days=${noOfDays}`;
  const requestOptions = {
    method: "GET",
    dataType: "json",
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token.Response}`
    })
  };
  try {
    operationResult.ErrorCode = ResponseErrors.NOK;
    let response = await fetch(endPoint, requestOptions);
    let jsonResponse = await response.json();
    if (jsonResponse.success) {
      operationResult.Response = jsonResponse.data;
      operationResult.ErrorCode = ResponseErrors.OK;
    } else {
      operationResult.ErrorCode = jsonResponse.errors[0].error_code;
      operationResult.ErrorDescription = jsonResponse.errors[0].message;
    }

  } catch (error) {
    operationResult.ErrorCode = ResponseErrors.NOK;
    operationResult.ErrorDescription = "Error while fetching data";
  }
  return operationResult;
}

export async function getEmployeeWorkHours(startDate) {
  let operationResult = createServiceResponse();
  let auth_token = await getDataFromStorage(AsyncStorageKeys.AuthToken);
  let endPoint = `${
    ApiEndPoints.GET_EMPLOYEE_ATTENDANCE_WORK_HOURS
  }start_date=${startDate}`;
  const requestOptions = {
    method: "GET",
    dataType: "json",
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token.Response}`
    })
  };
  try {
    operationResult.ErrorCode = ResponseErrors.NOK;
    let response = await fetch(endPoint, requestOptions);
    if (response.status == 200) {
      let jsonResponse = await response.json();
      if (jsonResponse.success) {
        operationResult.Response = jsonResponse.data;
        operationResult.ErrorCode = ResponseErrors.OK;
      } else {
        operationResult.ErrorCode = jsonResponse.errors[0].error_code;
        operationResult.ErrorDescription = jsonResponse.errors[0].message;
        //SET SPECIFIC ERROR DESCRIPTION FROM SERVER
      }
    } else {
      operationResult.ErrorCode = ResponseErrors.NOK;
      operationResult.ErrorDescription = "Error while fetching data";
    }
  } catch (error) {
    operationResult.ErrorCode = ResponseErrors.NOK;
    operationResult.ErrorDescription = "Error while fetching data";
  }
  return operationResult;
}