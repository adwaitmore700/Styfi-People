import { combineReducers } from "redux";
import loginReducer from "./userReducer";
import pageReducer from "./pageReducer";
import applicationReducer from "./applicationReducer";
import userLeaveReducer from "./userLeaveReducer";
import userAttendanceReducer from './userAttendanceReducer';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

// const allReducers = combineReducers({
//   applicationReducer:applicationReducer,
//   loginReducer:loginReducer,
//   pageReducer:pageReducer
// });

//export default allReducers;

const rootPersistConfig = {
  key: "root",
  storage: storage,
  blacklist: ["loginReducer", "pageReducer", "applicationReducer"],
  stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

const applicationPersistConfig = {
  key: "applicationReducer",
  storage: storage,
  blacklist: ["appState", "networkConnected", "initialAppLoaded"]
  //stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

const rootReducer = combineReducers({
  applicationReducer: persistReducer(
    applicationPersistConfig,
    applicationReducer
  ),
  loginReducer: loginReducer,
  pageReducer: pageReducer,
  userLeaveReducer: userLeaveReducer,
  userAttendanceReducer:userAttendanceReducer
});

const pReducer = persistReducer(rootPersistConfig, rootReducer);
export default pReducer;
