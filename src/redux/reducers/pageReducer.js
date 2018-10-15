import { Page_Actions, UserActions } from "../../constants/ReduxConstants";
const pageReducer = (
  initialState = {
    pageLoading: false,
    currentPage: "",
    pageStackCount: 1
  },
  action
) => {
  switch (action.type) {
    case Page_Actions.PAGE_LOADING:
      return {
        pageLoading: action.pageLoading,
        currentPage: initialState.currentPage,
        pageStackCount: initialState.pageStackCount
      };
    case Page_Actions.PAGE_LOADED:
      return {
        pageLoading: action.pageLoading,
        currentPage: initialState.currentPage,
        pageStackCount: initialState.pageStackCount
      };
    case Page_Actions.UPDATE_NAV_HEADER:
      return {
        pageLoading: initialState.pageLoading,
        currentPage: action.pageName,
        pageStackCount: initialState.pageStackCount
      };
    case UserActions.LOGIN_REQUEST:
      return {
        pageLoading: action.pageLoading,
        currentPage: initialState.currentPage,
        pageStackCount: initialState.pageStackCount
      };
    case UserActions.LOGIN_SUCCESS:
      return {
        pageLoading: action.pageLoading,
        currentPage: initialState.currentPage,
        pageStackCount: initialState.pageStackCount
      };
    case UserActions.LOGIN_FAILURE:
      return {
        pageLoading: action.pageLoading,
        currentPage: initialState.currentPage,
        pageStackCount: initialState.pageStackCount
      };
    case UserActions.LOGOUT_REQUEST:
      return {
        pageLoading: true,
        currentPage: initialState.currentPage,
        pageStackCount: initialState.pageStackCount
      };
    case UserActions.LOGOUT_SUCCESS:
      return {
        pageLoading: false,
        currentPage: initialState.currentPage,
        pageStackCount: initialState.pageStackCount
      };
    case UserActions.LOGOUT_FAILED:
      return {
        pageLoading: false,
        currentPage: initialState.currentPage,
        pageStackCount: initialState.pageStackCount
      };
    case Page_Actions.UPDATE_STACK_COUNT:
      return {...initialState,
        pageLoading: initialState.pageLoading,
        currentPage: initialState.currentPage,
        pageStackCount: action.count
      };
    default:
      return initialState;
  }
};

export default pageReducer;
