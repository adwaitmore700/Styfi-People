/*

*/
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  NetInfo,
  Platform
} from "react-native";
import { TextField } from "react-native-material-textfield";
import { connect } from "react-redux";
import * as UserActions from "../redux/actions/userActions";
import { checkEmptyData } from "../utils/utilFunctions";
import { ResponseErrors } from "../constants/ServiceConstants";
import { Login } from "../services/UserService";
import CustomAlert from "../components/CustomAlert";
import {
  ALERT_RESOURCES,
  LOGIN_PAGE_RESOURCES
} from "../constants/ResourceConstants";
import { NAVIGATION_PAGE_KEYS } from "../constants/PageConstants";
import * as THEME from "../styles/theme";
const { height, width } = Dimensions.get("window");

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      errors: {},
      employeeId: "",
      password: "",
      employeeIdError: false,
      passwordError: false,
      validationErrorText: "",
      renderLoginPage: false
    };
    this.onActionButtonClicked = this.onActionButtonClicked.bind(this);
  }

  componentWillMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        if (this.props.loggedIn) {
          this.props.navigation.replace(NAVIGATION_PAGE_KEYS.WELCOME_PAGE);
          return;
        } else {
          this.setState({
            renderLoginPage: true
          });
        }
      } else {
        this.setState({
          showAlert: true,
          errors: ALERT_RESOURCES.NETWORK_DISCONNECTED
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedIn != this.props.loggedIn && nextProps.loggedIn) {
      this.props.navigation.replace(NAVIGATION_PAGE_KEYS.WELCOME_PAGE);
    }
  }

  render() {
    const errorViews = this.renderErrorView();
    return (
      <View style={styles.container}>
        <CustomAlert
          showAlert={this.state.showAlert}
          errorMessage={this.state.errors}
          errorHeader={ALERT_RESOURCES.ERROR_HEADER_TEXT}
          actionButtonText={ALERT_RESOURCES.OK_TEXT}
          onDismissAlert={() => {
            this.setState({ showAlert: false });
          }}
        />
        <View style={styles.formContainer}>
          <Text key={"pageHeader"} style={styles.pageHeader}>
            {LOGIN_PAGE_RESOURCES.LOGIN_PAGE_HEADER_TEXT}
          </Text>
          <View style={{ paddingBottom: 0 }}>
            <TextField
              label={LOGIN_PAGE_RESOURCES.EMPLOYEE_ID_TEXT}
              textColor={THEME.COLORS.BLACK_COLOR}
              fontSize={16}
              activeLineWidth={1}
              labelFontSize={14} //upper text font size
              labelTextStyle={{
                fontFamily: Platform.OS == 'android' ? "sans-serif-medium": 'AvenirNext-Regular'
              }}
              baseColor={THEME.COLORS.TEXT_PLACEHOLDER_COLOR} //og color
              tintColor={THEME.COLORS.BLACK_COLOR} //on focus changed color
              onChangeText={employeeId => this.setState({ employeeId })}
              onFocus={() => {
                this.setState({
                  validationErrorText: "",
                  employeeIdError: false
                });
              }}
              onBlur={() => {
                if (checkEmptyData(this.state.employeeId)) {
                  this.setState({ employeeIdError: true });
                }
              }}
              value={this.state.employeeId}
            />
            {errorViews[0]}
          </View>
          <View style={{ paddingBottom: 10 }}>
            <TextField
              label={LOGIN_PAGE_RESOURCES.PASSWORD_TEXT}
              clearTextOnFocus={true}
              maxLength={14}
              secureTextEntry={true}
              activeLineWidth={1}
              onChangeText={password => this.setState({ password })}
              onFocus={() => {
                this.setState({
                  validationErrorText: "",
                  passwordError: false
                });
              }}
              onBlur={() => {
                if (checkEmptyData(this.state.password)) {
                  this.setState({ passwordError: true });
                }
              }}
              value={this.state.password}
              textColor={THEME.COLORS.BLACK_COLOR}
              fontSize={16}
              labelFontSize={14} //upper text font size
              labelTextStyle={{
                fontFamily: Platform.OS == 'android' ? "sans-serif-medium": 'AvenirNext-Regular'
              }}
              baseColor={THEME.COLORS.TEXT_PLACEHOLDER_COLOR} //og color
              tintColor={THEME.COLORS.BLACK_COLOR} //on focus changed color
            />
            {errorViews[1]}
          </View>
          <Text
            style={{
              color: THEME.COLORS.RED_COLOR,
              fontSize: 12,
              alignSelf: "center"
            }}
          >
            {this.state.validationErrorText}
          </Text>
          <TouchableOpacity
            key={"actionBtn"}
            opacity={0.7}
            style={styles.actionButton}
            onPress={this.onActionButtonClicked}
          >
            <Text key={"actionBtnText"} style={styles.actionButtonText}>
              {LOGIN_PAGE_RESOURCES.LOGIN_BUTTON_TEXT}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderErrorView() {
    let errorView = [null, null];
    if (this.state.employeeIdError) {
      errorView[0] = (
        <Text style={styles.fieldErrorText}>
          {LOGIN_PAGE_RESOURCES.EMPLOYEE_ID_ERROR}
        </Text>
      );
    }
    if (this.state.passwordError) {
      errorView[1] = (
        <Text style={styles.fieldErrorText}>
          {LOGIN_PAGE_RESOURCES.PASSWORD_ERROR}
        </Text>
      );
    }
    return errorView;
  }

  async onActionButtonClicked() {
    if (this.props.networkConnected) {
      if (this.isDataValid()) {
        //create an object and send it to the api
        let postObj = {
          employee_id: this.state.employeeId,
          password: this.state.password
        };
        this.props.dispatch(UserActions.loginRequest());
        let serviceResponse = await Login(postObj);
        if (serviceResponse.ErrorCode == ResponseErrors.OK) {
          this.props.dispatch(
            UserActions.loginSuccess(serviceResponse.Response)
          );
        } else {
          this.props.dispatch(UserActions.loginFailed());
          this.setState({
            showAlert: true,
            errors: serviceResponse.ErrorDescription
          });
        }
      } else {
        this.setState({
          validationErrorText: LOGIN_PAGE_RESOURCES.ERROR_TEXT,
          employeeIdError: false,
          passwordError: false
        });
      }
    } else {
      this.setState({
        showAlert: true,
        errors: ALERT_RESOURCES.NETWORK_DISCONNECTED
      });
    }
  }

  isDataValid() {
    let isValid = true;
    if (
      checkEmptyData(this.state.employeeId) ||
      checkEmptyData(this.state.password)
    ) {
      isValid = false;
    }
    return isValid;
  }
}

function mapStateToProps(state) {
  return {
    loggedIn: state.applicationReducer.isUserLoggedIn,
    networkConnected: state.applicationReducer.networkConnected
  };
}

export default connect(mapStateToProps)(LoginPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.PAGE_BACKGROUND_COLOR,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: height * 0.1
  },
  formContainer: {
    backgroundColor: THEME.COLORS.WHITE_COLOR,
    width: width - 38,
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingBottom: 30,
    justifyContent: "flex-start"
  },
  pageHeader: {
    color: THEME.COLORS.BLACK_COLOR,
    fontSize: 22,
    alignSelf: "center",
    fontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
    paddingTop: 30,
    paddingBottom: 40
  },
  fieldErrorText: {
    fontSize: 12,
    color: "red"
  },
  actionButton: {
    backgroundColor: THEME.COLORS.BLACK_COLOR,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    marginVertical: 30,
    width: width * 0.35,
    alignSelf: "flex-end"
  },
  actionButtonText: {
    color: THEME.COLORS.WHITE_COLOR,
    fontSize: 14,
    fontWeight: "400",
    alignSelf: "center",
    fontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
  }
});
