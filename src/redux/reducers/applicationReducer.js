import {
  ApplicationActions,
  UserActions
} from "../../constants/ReduxConstants";

const initalReduxState = {
  isUserLoggedIn: false,
  authToken: "",
  employeeData: {},
  initialAppLoaded: false,
  isFirstTimeLaunch: true,
  appState: "active",
  networkConnected: false
};
const applicationReducer = (initialState = initalReduxState, action) => {
  switch (action.type) {
    // case "persist/REHYDRATE":
    //   if (action.key == "root") {
    //     return {
    //       isUserLoggedIn: initialState.isUserLoggedIn,
    //       userId: initialState.userId,
    //       initialAppLoaded: initialState.initialAppLoaded,
    //       isFirstTimeLaunch: initialState.isFirstTimeLaunch,
    //       appState: initialState.appState,
    //       networkConnected: initialState.networkConnected
    //     };
    //   }
    // else {
    //   return {
    //     isUserLoggedIn: action.payload.applicationReducer.isUserLoggedIn,
    //     userId: action.payload.applicationReducer.userId,
    //     initialAppLoaded: initialState.initialAppLoaded,
    //     isFirstTimeLaunch: action.payload.applicationReducer.isFirstTimeLaunch,
    //     appState: initialState.appState,
    //     networkConnected: initialState.networkConnected
    //   };
    // }
    case ApplicationActions.LOAD_APP_INITIAL_DATA:
      return {
        isUserLoggedIn: action.payload.isUserLoggedIn,
        employeeData: action.payload.employeeData,
        authToken: action.payload.authToken,
        initialAppLoaded: action.payload.initialAppLoaded,
        isFirstTimeLaunch: initialState.isFirstTimeLaunch,
        appState: initialState.appState,
        networkConnected: initialState.networkConnected
      };
    case UserActions.LOGIN_SUCCESS:
      return {
        isUserLoggedIn: action.payload.isUserLoggedIn,
        employeeData: action.payload.employeeData,
        authToken: action.payload.authToken,
        initialAppLoaded: true,
        isFirstTimeLaunch: false,
        appState: initialState.appState,
        networkConnected: initialState.networkConnected
      };
    case UserActions.LOGOUT_SUCCESS:
      return {
        isUserLoggedIn: false,
        employeeData: {},
        authToken: {},
        initialAppLoaded: true,
        isFirstTimeLaunch: false,
        appState: initialState.appState,
        networkConnected: initialState.networkConnected
      };
    case ApplicationActions.ENTER_ACTIVE_STATE:
      return {
        isUserLoggedIn: initialState.isUserLoggedIn,
        employeeData: initialState.employeeData,
        authToken: initialState.authToken,
        initialAppLoaded: initialState.initialAppLoaded,
        isFirstTimeLaunch: initialState.isFirstTimeLaunch,
        appState: "active",
        networkConnected: initialState.networkConnected
      };
    case ApplicationActions.ENTER_BACKGROUND_STATE:
      return {
        isUserLoggedIn: initialState.isUserLoggedIn,
        employeeData: initialState.employeeData,
        authToken: initialState.authToken,
        initialAppLoaded: initialState.initialAppLoaded,
        isFirstTimeLaunch: initialState.isFirstTimeLaunch,
        appState: "background",
        networkConnected: initialState.networkConnected
      };
    case ApplicationActions.ENTER_INACTIVE_STATE:
      return {
        isUserLoggedIn: initialState.isUserLoggedIn,
        employeeData: initialState.employeeData,
        authToken: initialState.authToken,
        initialAppLoaded: initialState.initialAppLoaded,
        isFirstTimeLaunch: initialState.isFirstTimeLaunch,
        appState: "inactive",
        networkConnected: initialState.networkConnected
      };
    case ApplicationActions.NETWORK_STATUS_CHANGE:
      return {
        isUserLoggedIn: initialState.isUserLoggedIn,
        employeeData: initialState.employeeData,
        authToken: initialState.authToken,
        initialAppLoaded: initialState.initialAppLoaded,
        isFirstTimeLaunch: initialState.isFirstTimeLaunch,
        appState: initialState.appState,
        networkConnected: action.status
      };
    default:
      return initialState;
  }
};

export default applicationReducer;
