import { Page_Actions } from "../../constants/ReduxConstants";

export const showLoading = () => {
  return {
    type: Page_Actions.PAGE_LOADING,
    pageLoading: true
  };
};

export const hideLoading = () => {
  return {
    type: Page_Actions.PAGE_LOADED,
    pageLoading: false
  };
};

export const updateNavigationBarHeader = pageName => {
  return {
    type: Page_Actions.UPDATE_NAV_HEADER,
    pageName: pageName
  };
};

export const updateNavigationStackCount = stackCount => {
  return {
    type: Page_Actions.UPDATE_STACK_COUNT,
    count: stackCount
  };
};
