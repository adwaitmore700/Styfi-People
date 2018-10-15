/*

*/
import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity,Platform } from "react-native";
import {
  AsyncStorageKeys,
  StorageResponse
} from "../constants/StorageConstants";
import * as UserActions from "../redux/actions/userActions";
import { connect } from "react-redux";
import { ResponseErrors } from "../constants/ServiceConstants";
import ActivityLoader from "./ActivityLoader.js";
import CustomAlert from './CustomAlert';
import NavigationService from "../services/NavigationService";
import { Logout } from "../services/UserService.js";
import { checkEmptyData } from "../utils/utilFunctions";
import { ALERT_RESOURCES } from "../constants/ResourceConstants";
import { COLORS } from "../styles/theme";

class AppNavigationBar extends Component {
  constructor(props) {
    super(props);
    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.onBackButtonClicked = this.onBackButtonClicked.bind(this);
    this.state = {
      showAlert:false,
      showLogoutIcon: this.props.isUserLoggedIn,
      headerTitle: "",
      navigationStackCount: this.props.navigationStackCount
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigationStackCount != this.props.navigationStackCount) {
      this.setState({ navigationStackCount: nextProps.navigationStackCount });
    }
    if (nextProps.headerText != this.props.headerText) {
      this.setState({ headerTitle: nextProps.headerText });
    }
    if (nextProps.isUserLoggedIn != this.props.isUserLoggedIn) {
      this.setState({
        showLogoutIcon: nextProps.isUserLoggedIn
      });
      if (!nextProps.isUserLoggedIn) {
        NavigationService.logout();
      }
    }
  }

  render() {
    return (
      <View style={styles.navBarContainer}>
        <ActivityLoader loading={this.props.isLoading} />
        <CustomAlert
          showAlert={this.state.showAlert}
          errorMessage={"Are you sure you want to sign out ?"}
          errorHeader={"Alert"}
          actionButtonText={"Dismiss"}
          actionButtonText2={"Confirm"}
          showTwoButtons={true}
          onDismissAlert={() => {
            this.setState({showAlert:false})
          }}
          onConfirmation={()=>{
            this.setState({showAlert:false})
this.onLogoutClick()
          }}
        />
        {this.renderBackButton()}
        {this.renderHeaderCenter()}
        {this.renderLogoutIcon()}
      </View>
    );
  }

  renderHeaderCenter() {
    if (checkEmptyData(this.state.headerTitle)) {
      return (
        <Image
          source={require("../images/sf-people-white.png")}
          style={styles.headerLogo}
        />
      );
    } else {
      return <Text style={styles.headerText}>{this.state.headerTitle}</Text>;
    }
  }

  renderBackButton() {
    if (this.state.navigationStackCount > 1) {
      return (
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={this.onBackButtonClicked}
        >
          <Image
            source={require("../images/back-icon.png")}
            style={styles.sideLogo}
          />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  renderLogoutIcon() {
    if (this.state.showLogoutIcon) {
      return (
        <TouchableOpacity
          style={styles.logoutContainer}
          onPress={()=>{this.setState({showAlert:true})}}
        >
          <Image
            source={require("../images/logout-icon.png")}
            style={styles.sideLogo}
          />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  onBackButtonClicked() {
    NavigationService.onBackButtonPressed();
  }

  async onLogoutClick() {
    this.props.dispatch(UserActions.logoutRequest());
    setTimeout(async ()=>{
      let serviceResponse = await Logout();
      if (serviceResponse.ErrorCode == ResponseErrors.OK) {
        this.props.dispatch(UserActions.logoutSuccess());
      } else {
        this.props.dispatch(UserActions.loginFailed());
        alert(ALERT_RESOURCES.LOG_OUT_ERROR_TEXT);
      }
    },1000)
  }
}

function mapStateToProps(state) {
  return {
    isUserLoggedIn: state.applicationReducer.isUserLoggedIn,
    isLoading: state.pageReducer.pageLoading,
    headerText: state.pageReducer.currentPage,
    navigationStackCount: state.pageReducer.pageStackCount
  };
}

export default connect(mapStateToProps)(AppNavigationBar);

const styles = StyleSheet.create({
  navBarContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: COLORS.APP_PRIMARY_COLOR,
    paddingTop:Platform.OS=='ios' ? 20 : 0,
    height: Platform.OS=='ios' ? 80 : 60,
    zIndex:125
    //width: width
  },
  headerLogo: {
    height: 30,
    width: 120,
    resizeMode: "contain"
  },
  sideLogo: {
    height: 22,
    width: 20,
    resizeMode: "contain"
  },
  logoutText: {
    fontSize: 10,
    color: "#fff",
    fontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
    fontWeight: "300",
    alignSelf: "center"
  },
  headerText: {
    fontSize: 18,
    fontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
    fontWeight: "500",
    textAlignVertical: "center",
    alignSelf: "center",
    color: COLORS.WHITE_COLOR
  },
  backButtonContainer: {
    position: "absolute",
    top: Platform.OS=='ios' ? 25 : 5,
    left: 0,
    backgroundColor: COLORS.TRANSPARENT_COLOR,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100
  },
  logoutContainer: {
    position: "absolute",
    top: Platform.OS=='ios' ? 25 : 5,
    right: 0,
    backgroundColor: COLORS.TRANSPARENT_COLOR,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center"
  }
});
