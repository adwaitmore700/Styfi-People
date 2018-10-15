/*

*/
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform
} from "react-native";
import { connect } from "react-redux";
import { NAVIGATION_PAGE_KEYS } from "../constants/PageConstants";
import { WELCOME_PAGE_RESOURCES } from "../constants/ResourceConstants";
import { checkEmptyData, showNoNetworkAlert } from "../utils/utilFunctions";
import * as THEME from "../styles/theme";

const { height, width } = Dimensions.get("window");

class WelcomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      emailId: "",
      employeeId: "",
      jobDesignation: "",
      profileImage: { uri: this.props.employeeData.profile_image }
    };
    this.enterAttendanceSection = this.enterAttendanceSection.bind(this);
    this.enterLeaveSection = this.enterLeaveSection.bind(this);
    this.onImageLoadError = this.onImageLoadError.bind(this);
  }

  render() {
    if (checkEmptyData(this.props.employeeData)) {
      return null;
    } else {
      return (
        <View style={styles.container}>
          <Image
            ref={icon => (this.profileImage = icon)}
            style={styles.profilePhoto}
            onError={this.onImageLoadError}
            source={this.state.profileImage}
          />
          <Text
            style={{
              fontSize: 30,
              fontFamily: Platform.OS == 'android' ? "sans-serif-medium": 'AvenirNext-Regular',
              color: THEME.COLORS.BLACK_COLOR
            }}
          >
            {this.props.employeeData.employee_name}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
              color: THEME.COLORS.TEXT_MEDIUM_COLOR,
              padding: 0
            }}
          >
            {this.props.employeeData.employee_email}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: Platform.OS == 'android' ? "sans-serif-medium": 'AvenirNext-Regular',
              color: THEME.COLORS.TEXT_DARK_COLOR,
              marginTop: 10
            }}
          >
            {this.props.employeeData.employee_id}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: Platform.OS == 'android' ? "sans-serif-medium": 'AvenirNext-Regular',
              color: THEME.COLORS.TEXT_DARK_COLOR,
              marginTop: 15
            }}
          >
            {this.props.employeeData.employee_designation}
          </Text>
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={this.enterLeaveSection}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>
                {WELCOME_PAGE_RESOURCES.LEAVE_SECTION_BUTTON_TEXT}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={this.enterAttendanceSection}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>
                {WELCOME_PAGE_RESOURCES.ATTENDANCE_SECTION_BUTTON_TEXT}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  onImageLoadError() {
    this.setState({ profileImage: require("../images/dummy-user-image.png") });
  }

  enterLeaveSection() {
    if (this.props.networkConnected) {
      this.props.navigation.push(NAVIGATION_PAGE_KEYS.LEAVE_SECTION_PAGE);
    } else {
      showNoNetworkAlert();
    }
  }

  enterAttendanceSection() {
    if (this.props.networkConnected) {
      this.props.navigation.push(NAVIGATION_PAGE_KEYS.ATTENDANCE_SECTION_PAGE);
    } else {
      showNoNetworkAlert();
    }
  }
}

function mapStateToProps(state) {
  return {
    networkConnected: state.applicationReducer.networkConnected,
    employeeData: state.applicationReducer.employeeData
  };
}

export default connect(mapStateToProps)(WelcomePage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.PAGE_BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.1
  },
  profilePhoto: {
    resizeMode: "contain",
    height: 120,
    width: 120,
    borderRadius: 60,
    marginVertical: 10
  },
  actionButtonContainer: {
    width: width,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 30,
    marginTop: 40
  },
  actionButton: {
    width: width * 0.35,
    backgroundColor: THEME.COLORS.BLACK_COLOR,
    borderRadius: 23,
    justifyContent: "center",
    height: 46,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "stretch"
  },
  actionButtonText: {
    color: THEME.COLORS.WHITE_COLOR,
    fontSize: 14,
    fontWeight: "400",
    alignSelf: "center",
    fontFamily:  Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular"
  }
});
