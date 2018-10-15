import { UserActions } from "../../constants/ReduxConstants";

import {
  AsyncStorageKeys,
  StorageResponse
} from "../../constants/StorageConstants";
import {
  storeDataInStorage,
  deleteDataFromStorage
} from "../../api/storageApi";

export const loginRequest = () => {
  return {
    type: UserActions.LOGIN_REQUEST,
    pageLoading: true
  };
};

export const loginSuccess = response => {
  return {
    type: UserActions.LOGIN_SUCCESS,
    pageLoading: false,
    payload: {
      employeeData: response.EmployeeData,
      isUserLoggedIn: true,
      authToken: response.AuthToken
    }
  };
};

export const loginFailed = () => {
  return {
    type: UserActions.LOGIN_FAILURE,
    pageLoading: false
  };
};

export const logoutRequest = () => {
  return {
    type: UserActions.LOGOUT_REQUEST,
    pageLoading: true
  };
};

export const logoutSuccess =() => {
  return {
    type: UserActions.LOGOUT_SUCCESS,
    pageLoading: false
  };
};

export const logoutFailed = () => {
  return {
    type: UserActions.LOGOUT_FAILED,
    pageLoading: false,
    payload: { employeeData: {}, isUserLoggedIn: true }
  };
};
