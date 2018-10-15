/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from "react";
import { AppState, NetInfo, View } from "react-native";
import { createStackNavigator } from "react-navigation";
import LoginPage from "./views/LoginPage";
import { connect } from "react-redux";
import AttendanceSectionPage from "./views/AttendanceSectionPage";
import LeaveSectionPage from "./views/LeaveSectionPage";
import WelcomePage from "./views/WelcomePage";
import LeaveStatisticsPage from "./views/LeaveStatisticsPage.js";
import LeaveApplicationPage from "./views/LeaveApplicationPage.js";
import LeaveHistoryPage from "./views/LeaveHistoryPage.js";
import HolidayListPage from "./views/HolidayListPage.js";
import LoadingPage from "./views/LoadingPage";
import AppNavigationBar from "./components/AppNavigationBar.js";
import SnackBar from "rn-snackbar";
import * as ApplicationActions from "./redux/actions/applicationActions";
import * as PageActions from "./redux/actions/pageActions";
import NavigationService from "./services/NavigationService";
import SplashScreen from 'react-native-splash-screen';

class MainPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    SplashScreen.hide();
  }

  componentWillMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      this.props.dispatch(
        ApplicationActions.handleNetworkConnectionStatus(isConnected)
      );
    });
    AppState.addEventListener("change", this.handleAppStateChange);
    NetInfo.addEventListener("connectionChange", this.handleConnectivityChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
    NetInfo.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  handleAppStateChange = nextAppState => {
    this.props.dispatch(ApplicationActions.handleAppStateChange(nextAppState));
  };

  handleConnectivityChange = connectionInfo => {
    let connectionStatus = connectionInfo.type.match(/none|unknown/)
      ? false
      : true;
    SnackBar.show(
      `${
        connectionStatus ? "Internet is now connected" : "No network connection"
      }`,
      {
        style: {
          justifyContent: "center",
          alignItems: "center",
          height: 50,
          padding: 5
        },
        id: "currentSnack", // Custom ID to avoid duplicated items being added to the queue, which in turn to be shown multiple time
        tapToClose: true,
        duration: 2500,
        position: "bottom",
        backgroundColor: connectionStatus ? "green" : "red",
        textColor: "white",
        textStyle: { fontSize: 15, color: "#fff" }
      }
    );
    this.props.dispatch(
      ApplicationActions.handleNetworkConnectionStatus(connectionStatus)
    );
  };

  render() {
    const AppNavigator = createStackNavigator(
      {
        LoadingPage: {
          screen: LoadingPage
        },
        LoginPage: {
          screen: LoginPage
        },
        WelcomePage: {
          screen: WelcomePage
        },
        LeaveSectionPage: {
          screen: LeaveSectionPage
        },
        AttendanceSectionPage: {
          screen: AttendanceSectionPage
        },
        LeaveStatisticsPage: {
          screen: LeaveStatisticsPage
        },
        LeaveApplicationPage: {
          screen: LeaveApplicationPage
        },
        LeaveHistoryPage: {
          screen: LeaveHistoryPage
        },
        HolidayListPage: {
          screen: HolidayListPage
        }
      },
      {
        initialRouteName: "LoadingPage",
        navigationOptions: ({ navigation }) => ({
          headerMode: "float",
          headerTransitionPreset: "fade-in-place",
          header: null //to hide the navigation bar and use it like app main screen
        })
      }
    );
    return (
      <View style={{ flex: 1 }}>
        <AppNavigationBar />
        <AppNavigator
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          onNavigationStateChange={(prevState, currentState) => {
            this.props.dispatch(
              PageActions.updateNavigationStackCount(currentState.routes.length)
            );
          }}
        />
      </View>
    );
  }
}

export default connect()(MainPage);
//never connect this component to redux store it will render every commponent again
