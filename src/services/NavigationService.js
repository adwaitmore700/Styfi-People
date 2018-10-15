import { NavigationActions, StackActions } from "react-navigation";
import { checkEmptyData } from "../utils/utilFunctions";

var _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

function logout() {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: "LoginPage" })]
  });
  _navigator.dispatch(resetAction);
}

function pop() {
  const popUp = StackActions.pop();
  _navigator.dispatch(popUp);
}

function getActiveRouteName() {
  if (checkEmptyData(_navigator)) {
    return 0;
  }
  let stackCount = _navigator;
  return stackCount.state.nav.routes.length;
}

function getNavigationStackCount() {
  if (checkEmptyData(_navigator)) {
    return 0;
  }
  let stackCount = _navigator;
  return stackCount.state.nav.routes.length;
}
// add other navigation functions that you need and export them

function onBackButtonPressed() {
  const backPress = NavigationActions.back();
  _navigator.dispatch(backPress);
}

export default {
  navigate,
  setTopLevelNavigator,
  logout,
  getNavigationStackCount,
  onBackButtonPressed,
  getActiveRouteName,
  pop
};
