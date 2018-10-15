/*

*/
import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform
} from "react-native";
import { TextField } from "react-native-material-textfield";
import DatePicker from "react-native-datepicker";
import { Dropdown } from "react-native-material-dropdown";
import moment from "moment";
import { checkEmptyData } from "../utils/utilFunctions";
import * as PageActions from "../redux/actions/pageActions";
import { connect } from "react-redux";
import { applyLeave } from "../services/LeaveService";
import CustomAlert from "../components/CustomAlert";
import {
  ALERT_RESOURCES,
  LEAVE_APPLICATION_PAGE_RESOURCES
} from "../constants/ResourceConstants";
import { ResponseErrors } from "../constants/ServiceConstants";
import * as THEME from "../styles/theme";
import { DATE_TIME_FORMAT } from "../constants/GeneralConstants";

const { height, width } = Dimensions.get("window");
const leaveTypes = [
  { id: "casual", value: "Casual Leave(Max 1)" },
  { id: "sick", value: "Sick Leave(Max 1)" },
  { id: "priv", value: "Privileged Leave" },
  { id: "paid", value: "Unpaid Leave" },
  { id: "half", value: "Half Day" }
];

class LeaveApplicationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      errors: { header: "", body: "" },
      leaveType: "",
      fromDate: "",
      toDate: "",
      reason: "",
      disableEndDatePicker: false,
      leaveTypeError: false,
      fromDateError: false,
      toDateError: false,
      reasonError: false
    };
    this.currentDate = moment().format(DATE_TIME_FORMAT);
    this.onStartDateSelect = this.onStartDateSelect.bind(this);
    this.onEndDateSelect = this.onEndDateSelect.bind(this);
    this.onActionButtonClicked = this.onActionButtonClicked.bind(this);
    this.onAlertDismiss = this.onAlertDismiss.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(
      PageActions.updateNavigationBarHeader(
        LEAVE_APPLICATION_PAGE_RESOURCES.PAGE_HEADER_TEXT
      )
    );
  }

  componentWillUnmount() {
    this.props.dispatch(PageActions.updateNavigationBarHeader(""));
  }

  componentDidMount() {
    this.props.dispatch(PageActions.hideLoading());
  }

  render() {
    const errorViews = this.renderErrorView();
    const materialTextLabels = this.renderMaterialLabels();
    const datePickerCustomStyle = {
      dateIcon: {
        position: "absolute",
        right: 2
      },
      dateInput: {
        backgroundColor: "#f1f1f1",
        height: 30,
        alignSelf: "flex-start",
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "flex-start",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        width: width - 30
      },
      dateText: {
        fontSize: 16,
        fontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
        color: THEME.COLORS.BLACK_COLOR
      },
      placeholderText: {
        color: THEME.COLORS.TEXT_PLACEHOLDER_COLOR,
        fontSize: 16,
        fontFamily: Platform.OS == 'android' ? "sans-serif-medium": "AvenirNext-Regular"
      }
    };
    return (
      <View style={THEME.APP_PAGE_CONTAINER.CONTAINER}>
        <CustomAlert
          showAlert={this.state.showAlert}
          errorMessage={this.state.errors.body}
          errorHeader={this.state.errors.header}
          actionButtonText={ALERT_RESOURCES.OK_TEXT}
          onDismissAlert={this.onAlertDismiss}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Dropdown
            label={LEAVE_APPLICATION_PAGE_RESOURCES.LEAVE_TYPE_PLACEHOLDER_TEXT}
            data={leaveTypes}
            fontSize={16}
            labelFontSize={14} //upper text font size
            labelTextStyle={{
              fontSize: 14,
              fontFamily: Platform.OS == 'android' ? "sans-serif-medium": 'AvenirNext-Regular',
              marginBottom: 10
            }}
            dropdownPosition={2}
            dropdownOffset={{ top: 20, left: 0 }}
            baseColor={THEME.COLORS.TEXT_PLACEHOLDER_COLOR} //og color
            tintColor={THEME.COLORS.BLACK_COLOR} //on focus changed color
            containerStyle={{
              width: width - 30,
              height: 50,
              backgroundColor: THEME.COLORS.TRANSPARENT_COLOR
            }} //outer view
            inputContainerStyle={{
              backgroundColor: THEME.COLORS.TRANSPARENT_COLOR,
              paddingBottom: 0
            }}
            pickerStyle={{
              backgroundColor: THEME.COLORS.SEPERATOR_PRIMARY_COLOR,
              marginLeft: 6,
              borderRadius: 6,
              width: width - 30,
              marginTop: 110
            }}
            //overlayStyle={{ paddingTop:110 }}
            itemCount={4}
            itemTextStyle={{
              fontSize: 14,
              fontFamily:Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
              borderBottomWidth: 1,
              borderBottomColor: THEME.COLORS.SEPERATOR_SECONDARY_COLOR,
              color: THEME.COLORS.TEXT_PLACEHOLDER_COLOR,
              paddingBottom: 5
            }}
            itemPadding={5}
            onChangeText={(value, index, data) => {
              this.setState({
                leaveType: data[index].id,
                fromDate: "",
                toDate: "",
                disableEndDatePicker: false,
                leaveTypeError: false
              });
            }}
          />
          {errorViews[0]}
          <View style={{ height: 60, justifyContent: "flex-end" }}>
            {materialTextLabels[0]}
            <DatePicker
              style={styles.datePicker}
              date={this.state.fromDate}
              mode="date"
              placeholder={
                LEAVE_APPLICATION_PAGE_RESOURCES.FROM_DATE_PLACEHOLDER_TEXT
              }
              format={DATE_TIME_FORMAT}
              minDate={this.currentDate}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              iconComponent={
                <Image
                  source={require("../images/calendar-picker-icon.png")}
                  style={styles.calendarImageIcon}
                />
              }
              customStyles={datePickerCustomStyle}
              onDateChange={this.onStartDateSelect}
              onOpenModal={() => {
                this.setState({ fromDateError: false });
              }}
              onCloseModal={() => {
                if (checkEmptyData(this.state.fromDate)) {
                  this.setState({ fromDateError: true });
                }
              }}
            />
          </View>
          {errorViews[1]}
          <View style={{ height: 60, justifyContent: "flex-end" }}>
            {materialTextLabels[1]}
            <DatePicker
              style={styles.datePicker}
              disabled={this.state.disableEndDatePicker}
              date={this.state.toDate}
              mode="date"
              placeholder={
                LEAVE_APPLICATION_PAGE_RESOURCES.TO_DATE_PLACEHOLDER_TEXT
              }
              format={DATE_TIME_FORMAT}
              minDate={this.currentDate}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              iconComponent={
                <Image
                  source={require("../images/calendar-picker-icon.png")}
                  style={styles.calendarImageIcon}
                />
              }
              customStyles={datePickerCustomStyle}
              onDateChange={this.onEndDateSelect}
              onOpenModal={() => {
                this.setState({ toDateError: false });
              }}
              onCloseModal={() => {
                if (checkEmptyData(this.state.toDate)) {
                  this.setState({ toDateError: true });
                }
              }}
            />
          </View>
          {errorViews[2]}
          <TextField
            label={LEAVE_APPLICATION_PAGE_RESOURCES.REASON_PLACEHOLDER_TEXT}
            value={this.state.reason}
            onChangeText={reason => this.setState({ reason })}
            textColor={THEME.COLORS.BLACK_COLOR}
            activeLineWidth={1}
            fontSize={16}
            labelFontSize={14} //upper text font size
            labelTextStyle={{
              fontFamily: Platform.OS == 'android' ? "sans-serif-medium": 'AvenirNext-Regular'
            }}
            baseColor={THEME.COLORS.TEXT_PLACEHOLDER_COLOR} //og color
            tintColor={THEME.COLORS.BLACK_COLOR} //on focus changed color
            onFocus={() => {
              this.setState({ reasonError: false });
            }}
            onBlur={() => {
              if (checkEmptyData(this.state.reason)) {
                this.setState({ reasonError: true });
              }
            }}
          />
          {errorViews[3]}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={this.onActionButtonClicked}
          >
            <Text style={styles.actionButtonText}>
              {LEAVE_APPLICATION_PAGE_RESOURCES.LEAVE_APPLY_BUTTON_TEXT}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  onAlertDismiss() {
    this.setState({ showAlert: false }, () => {
      if (this.state.errors.header !== ALERT_RESOURCES.ERROR_HEADER_TEXT) {
        this.props.navigation.pop();
      }
    });
  }

  renderMaterialLabels() {
    let materialLabels = [];
    materialLabels.push(
      <Text style={styles.inputHeader}>
        {checkEmptyData(this.state.fromDate)
          ? ""
          : LEAVE_APPLICATION_PAGE_RESOURCES.FROM_DATE_PLACEHOLDER_TEXT}
      </Text>
    );
    materialLabels.push(
      <Text style={styles.inputHeader}>
        {checkEmptyData(this.state.toDate)
          ? ""
          : LEAVE_APPLICATION_PAGE_RESOURCES.TO_DATE_PLACEHOLDER_TEXT}
      </Text>
    );
    return materialLabels;
  }

  renderErrorView() {
    let errorView = [null, null, null, null];
    if (this.state.leaveTypeError) {
      errorView[0] = (
        <Text style={styles.fieldErrorText}>
          {LEAVE_APPLICATION_PAGE_RESOURCES.LEAVE_TYPE_VAILDATION_ERROR_TEXT}
        </Text>
      );
    }
    if (this.state.fromDateError) {
      errorView[1] = (
        <Text style={styles.fieldErrorText}>
          {LEAVE_APPLICATION_PAGE_RESOURCES.FROM_DATE_VALIDATION_ERROR_TEXT}
        </Text>
      );
    }
    if (this.state.toDateError) {
      errorView[2] = (
        <Text style={styles.fieldErrorText}>
          {LEAVE_APPLICATION_PAGE_RESOURCES.TO_DATE_VALIDATION_ERROR_TEXT}
        </Text>
      );
    }
    if (this.state.reasonError) {
      errorView[3] = (
        <Text
          style={{
            fontSize: 10,
            color: "red",
            paddingTop: 0
          }}
        >
          {LEAVE_APPLICATION_PAGE_RESOURCES.REASON_VALIDATION_ERROR_TEXT}
        </Text>
      );
    }
    return errorView;
  }

  onStartDateSelect(startDate) {
    if (
      !checkEmptyData(this.state.leaveType) &&
      (this.state.leaveType == leaveTypes[0].id ||
        this.state.leaveType == leaveTypes[1].id ||
        this.state.leaveType == leaveTypes[4].id)
    ) {
      this.setState({ toDate: startDate, disableEndDatePicker: true });
    }
    this.setState({ fromDate: startDate });
  }

  onEndDateSelect(endDate) {
    this.setState({ toDate: endDate });
  }

  async onActionButtonClicked() {
    if (this.props.networkConnected) {
      let errorHeader = ALERT_RESOURCES.ERROR_HEADER_TEXT;
      let errorBody = "";
      if (checkEmptyData(this.state.leaveType)) {
        errorBody =
          LEAVE_APPLICATION_PAGE_RESOURCES.LEAVE_TYPE_BLANK_ERROR_TEXT;
      } else if (checkEmptyData(this.state.fromDate)) {
        errorBody = LEAVE_APPLICATION_PAGE_RESOURCES.FROM_DATE_BLANK_ERROR_TEXT;
      } else if (checkEmptyData(this.state.toDate)) {
        errorBody = LEAVE_APPLICATION_PAGE_RESOURCES.TO_DATE_BLANK_ERROR_TEXT;
      } else if (moment(this.state.fromDate) > moment(this.state.toDate)) {
        errorBody = LEAVE_APPLICATION_PAGE_RESOURCES.DATE_VALIDATION_ERROR_TEXT;
      } else if (checkEmptyData(this.state.reason)) {
        errorBody = LEAVE_APPLICATION_PAGE_RESOURCES.REASON_BLANK_ERROR_TEXT;
      } else {
        //create an object and send it to the api
        let postObj = {
          leave_type: this.state.leaveType,
          leave_from: this.state.fromDate,
          leave_to: this.state.toDate,
          leave_reason: this.state.reason
        };
        this.props.dispatch(PageActions.showLoading());
        let serviceResponse = await applyLeave(postObj);
        this.props.dispatch(PageActions.hideLoading());
        errorBody = serviceResponse.ErrorDescription;
        errorHeader =
          serviceResponse.ErrorCode == ResponseErrors.OK
            ? "Success"
            : ALERT_RESOURCES.ERROR_HEADER_TEXT;
      }
      this.setState({
        showAlert: true,
        errors: {
          header: errorHeader,
          body: errorBody
        }
      });
    } else {
      this.setState({
        showAlert: true,
        errors: {
          header: ALERT_RESOURCES.ERROR_HEADER_TEXT,
          body: ALERT_RESOURCES.NETWORK_DISCONNECTED
        }
      });
    }
  }
}

function mapStateToProps(state) {
  return {
    networkConnected: state.applicationReducer.networkConnected
  };
}

export default connect(mapStateToProps)(LeaveApplicationPage);

const styles = StyleSheet.create({
  inputHeader: {
    fontSize: 14,
    color: THEME.COLORS.TEXT_PLACEHOLDER_COLOR,
    marginTop: 15,
    fontFamily: Platform.OS == 'android' ? "sans-serif-medium": 'AvenirNext-Regular'
  },
  textInput: {
    backgroundColor: THEME.COLORS.SEPERATOR_PRIMARY_COLOR,
    color: THEME.COLORS.BLACK_COLOR,
    height: 40,
    fontSize: 12,
    borderRadius: 6,
    width: width - 30,
    fontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
  },
  calendarImageIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    height: 24,
    width: 24,
    resizeMode: "contain",
    marginRight: 10
  },
  datePicker: {
    backgroundColor: THEME.COLORS.PAGE_BACKGROUND_COLOR,
    height: 30,
    borderWidth: 0,
    borderRadius: 0,
    width: width - 30
  },
  fieldErrorText: {
    fontSize: 10,
    color: "red",
    paddingTop: 5
  },
  actionButton: {
    marginTop: height * 0.2,
    width: (width - 30) * 0.5,
    backgroundColor: THEME.COLORS.BLACK_COLOR,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    height: 46
  },
  actionButtonText: {
    color: THEME.COLORS.WHITE_COLOR,
    fontSize: 14,
    fontWeight: "600",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10
  }
});
