import { UserActions } from "../../constants/ReduxConstants";
const loginReducer = (
  initialState = { loggedIn: false },
  action
) => {
  switch (action.type) {
    case UserActions.LOGIN_REQUEST:
      return { loggedIn: false };
    case UserActions.LOGIN_SUCCESS:
      return { loggedIn: true };
    case UserActions.LOGIN_FAILURE:
      return { loggedIn: false };
    case UserActions.LOGOUT_REQUEST:
      return { loggedIn: initialState.loggedIn };
    case UserActions.LOGOUT_SUCCESS:
      return { loggedIn: false };
    case UserActions.LOGOUT_FAILED:
      return { loggedIn: true };
    default:
      return initialState;
  }
};

export default loginReducer;
