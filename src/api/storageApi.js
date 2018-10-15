import { AsyncStorage } from "react-native";
import { StorageResponse } from "../constants/StorageConstants";
import { createServiceResponse, checkEmptyData } from "../utils/utilFunctions";

export async function getDataFromStorage(key) {
  let dataResponse = createServiceResponse();
  try {
    dataResponse.Response = await AsyncStorage.getItem(key);
    if (dataResponse.Response !== null) {
      let dataItem = JSON.parse(dataResponse.Response);
      dataResponse.Response = dataItem;
    }
    dataResponse.ErrorCode = StorageResponse.SuccessfulOperation;
  } catch (error) {
    dataResponse.ErrorCode = StorageResponse.ErrorWhileRetrievingRecords;
  }
  return dataResponse;
}

export async function storeDataInStorage(key, dataObject) {
  let dataResponse = createServiceResponse();
  try {
    await AsyncStorage.setItem(key, JSON.stringify(dataObject));
    dataResponse.ErrorCode = StorageResponse.SuccessfulOperation;
  } catch (error) {
    dataResponse.ErrorCode = StorageResponse.ErrorWhileUpdatingRecords;
  }
  return dataResponse;
}

export async function updateDataToStorage(key, dataObject) {
  let dataResponse = createServiceResponse();
  try {
    let originalObj = await getDataFromStorage(key);
    if (checkEmptyData(originalObj)) {
      await AsyncStorage.setItem(key, JSON.stringify(dataObject));
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(originalObj), () => {
        AsyncStorage.mergeItem(key, JSON.stringify(dataObject), () => {});
      });
    }
    dataResponse.ErrorCode = StorageResponse.SuccessfulOperation;
  } catch (error) {
    dataResponse.ErrorCode = StorageResponse.ErrorWhileUpdatingRecords;
  }
  return dataResponse;
}

export async function deleteDataFromStorage(key) {
  let dataResponse = createServiceResponse();
  try {
    await AsyncStorage.removeItem(key);
    dataResponse.ErrorCode = StorageResponse.SuccessfulOperation;
  } catch (error) {
    dataResponse.ErrorCode = StorageResponse.ErrorWhileDeletingRecords;
  }
  return dataResponse;
}
