import { ApplicationActions } from "../../constants/ReduxConstants";

export const handleAppStateChange = currentState => {
  switch (currentState) {
    case "active":
      return {
        type: ApplicationActions.ENTER_ACTIVE_STATE,
        currentState: currentState
      };
    case "background":
      return {
        type: ApplicationActions.ENTER_BACKGROUND_STATE,
        currentState: currentState
      };
    case "inactive":
      return {
        type: ApplicationActions.ENTER_INACTIVE_STATE,
        currentState: currentState
      };
    default:
      return {
        type: ApplicationActions.ENTER_ACTIVE_STATE,
        currentState: "active"
      };
  }
};

export const handleNetworkConnectionStatus = statusBool => {
  return {
    type: ApplicationActions.NETWORK_STATUS_CHANGE,
    status: statusBool
  };
};
