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
import {
  NetInfo
} from "react-native";

export async function getLeaveStatsFromServer() {
  let operationResult = createServiceResponse();
  let auth_token = await getDataFromStorage(AsyncStorageKeys.AuthToken);
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
    let response = await fetch(
      ApiEndPoints.GET_EMPLOYEE_LEAVE_STATISTICS_API,
      requestOptions
    );
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

export async function getHolidayListFromServer() {
  let operationResult = createServiceResponse();
  let auth_token = await getDataFromStorage(AsyncStorageKeys.AuthToken);
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
    let response = await fetch(
      ApiEndPoints.GET_HOLIDAY_LIST_API,
      requestOptions
    );
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

export async function getLeaveHistoryFromServer() {
  let operationResult = createServiceResponse();
  let auth_token = await getDataFromStorage(AsyncStorageKeys.AuthToken);
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
    let response = await fetch(
      ApiEndPoints.GET_EMPLOYEE_LEAVE_RECORD_API,
      requestOptions
    );
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

export async function applyLeave(postData) {
  let operationResult = createServiceResponse();
  let auth_token = await getDataFromStorage(AsyncStorageKeys.AuthToken);
  const requestOptions = {
    method: "POST",
    dataType: "json",
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token.Response}`
    }),
    body: JSON.stringify(postData)
  };
  try {
    operationResult.ErrorCode = ResponseErrors.NOK;
    let response = await fetch(
      ApiEndPoints.EMPLOYEE_LEAVE_APPLICATION_API,
      requestOptions
    );
    if (response.status == 200) {
      let jsonResponse = await response.json();
      if (jsonResponse.success) {
        operationResult.ErrorCode = ResponseErrors.OK;
        operationResult.ErrorDescription = jsonResponse.data.msg;
      } else {
        operationResult.ErrorCode = jsonResponse.errors[0].error_code;
        operationResult.ErrorDescription = jsonResponse.errors[0].message;
        //SET SPECIFIC ERROR DESCRIPTION FROM SERVER
      }
    } else {
      operationResult.ErrorCode = ResponseErrors.NOK;
      operationResult.ErrorDescription = "Error while applying leave";
    }
  } catch (error) {
    operationResult.ErrorCode = ResponseErrors.NOK;
    operationResult.ErrorDescription = "Error while applying leave";
  }
  return operationResult;
}