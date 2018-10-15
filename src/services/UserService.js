import { storeDataInStorage, deleteDataFromStorage } from "../api/storageApi";
import {
  AsyncStorageKeys,
  StorageResponse
} from "../constants/StorageConstants";
import { ResponseErrors, ApiEndPoints } from "../constants/ServiceConstants";
import { createServiceResponse } from "../utils/utilFunctions";
import { NetInfo } from "react-native";

function withTimeout(msecs, promise) {
  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("timeout"));
    }, msecs);
  });
  return Promise.race([timeout, promise]);
}

export async function Login(loginCredentials) {
  let operationResult = createServiceResponse();
  const requestOptions = {
    method: "POST",
    dataType: "json",
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json"
    }),
    body: JSON.stringify(loginCredentials)
  };
  try {
    let isConnected = await NetInfo.isConnected.fetch();
    operationResult.ErrorCode = ResponseErrors.NOK;
    if (isConnected) {
      let response = await withTimeout(
        2000,
        fetch(ApiEndPoints.LOGIN_API, requestOptions)
      );
      let loginResponse = await response.json();
      if (loginResponse.success) {
        operationResult.Response = {
          EmployeeData: loginResponse.data.employee_details,
          AuthToken: loginResponse.data.token
        };
        let dataResponse = await Promise.all([
          storeDataInStorage(AsyncStorageKeys.IsUserLoggedIn, true),
          storeDataInStorage(
            AsyncStorageKeys.UserData,
            operationResult.Response.EmployeeData
          ),
          storeDataInStorage(
            AsyncStorageKeys.AuthToken,
            operationResult.Response.AuthToken
          )
        ]);
        if (
          dataResponse[0].ErrorCode == StorageResponse.SuccessfulOperation &&
          dataResponse[1].ErrorCode == StorageResponse.SuccessfulOperation &&
          dataResponse[2].ErrorCode == StorageResponse.SuccessfulOperation
        ) {
          operationResult.ErrorCode = ResponseErrors.OK;
        }
      } else {
        operationResult.ErrorCode = loginResponse.errors[0].error_code;
        operationResult.ErrorDescription = loginResponse.errors[0].message;
      }
    } else {
      operationResult.ErrorCode = ResponseErrors.NO_INTERNET_CONNECTION;
      operationResult.ErrorDescription = "No internet connectivity";
    }
  } catch (error) {
    operationResult.ErrorCode = ResponseErrors.NOK;
    operationResult.ErrorDescription = "Error while logging in";
  }
  return operationResult;
}

export async function Logout() {
  let operationResult = createServiceResponse();
  //Perform a cleanup and log out from all services if required
  let dataResponse = await Promise.all([
    deleteDataFromStorage(AsyncStorageKeys.UserData),
    deleteDataFromStorage(AsyncStorageKeys.IsUserLoggedIn),
    deleteDataFromStorage(AsyncStorageKeys.AuthToken)
  ]);
  if (
    dataResponse[0].ErrorCode == StorageResponse.SuccessfulOperation &&
    dataResponse[1].ErrorCode == StorageResponse.SuccessfulOperation &&
    dataResponse[2].ErrorCode == StorageResponse.SuccessfulOperation
  ) {
    operationResult.ErrorCode = ResponseErrors.OK;
  } else {
    operationResult.ErrorCode = ResponseErrors.NOK;
  }
  return operationResult;
}
