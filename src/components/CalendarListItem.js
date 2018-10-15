import React, { Component } from "react";
import { View, Text, Dimensions,Platform } from "react-native";
import moment from "moment";
import {
  dayOfWeekAsString,
  checkEmptyData
} from "../utils/utilFunctions";
import { ATTENDANCE_SECTION_PAGE_RESOURCES } from "../constants/ResourceConstants";
import { EVENT_TYPES, LEAVE_STATUS } from "../constants/GeneralConstants";
import { COLORS } from "../styles/theme";

const { height, width } = Dimensions.get("window");

export default class CalendarListItem extends Component {
  constructor(props) {
    super(props);
    this.setComponentData(this.props);
  }

  getTypeForRegularView(updatedProps) {
    if (
      updatedProps.attendanceData.calendarData.hasOwnProperty(EVENT_TYPES[0])
    ) {
      return EVENT_TYPES[0];
    } else if (
      updatedProps.attendanceData.calendarData.hasOwnProperty(EVENT_TYPES[1])
    ) {
      return EVENT_TYPES[1];
    } else {
      return EVENT_TYPES[2];
    }
  }

  componentWillReceiveProps(newProps) {
    let newDate = moment(newProps.attendanceData.date);
    if (this.itemDate.month() != newDate.month()) {
      this.setComponentData(newProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let newDate = moment(nextProps.attendanceData.date);
    let oldDate = moment(this.props.attendanceData.date);
    if (oldDate.month() != newDate.month()) {
      return true;
    } else {
      return false;
    }
  }

  setComponentData = updatedProps => {
    this.isMultipleViews =
      Object.keys(updatedProps.attendanceData.calendarData).length > 1;
    this.showHolidayView = updatedProps.attendanceData.calendarData.hasOwnProperty(
      EVENT_TYPES[3]
    );
    this.showLeaveView = updatedProps.attendanceData.calendarData.hasOwnProperty(
      EVENT_TYPES[4]
    );
    this.showRegularView =
      updatedProps.attendanceData.calendarData.hasOwnProperty(EVENT_TYPES[0]) ||
      updatedProps.attendanceData.calendarData.hasOwnProperty(EVENT_TYPES[1]) ||
      updatedProps.attendanceData.calendarData.hasOwnProperty(EVENT_TYPES[2]);
    this.regularViewType = this.showRegularView
      ? this.getTypeForRegularView(updatedProps)
      : "";
    this.itemDate = moment(updatedProps.attendanceData.date);
    this.isAbsent = moment().dayOfYear() > this.itemDate.dayOfYear();
    this.textColor =
      this.itemDate.day() == 0 || this.itemDate.day() == 6
        ? COLORS.CALENDAR_SECONDARY_COLOR
        : COLORS.BLACK_COLOR;
  };

  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          borderRadius: 6,
          marginBottom: 10,
          backgroundColor: COLORS.WHITE_COLOR,
          height: 90
        }}
      >
        <View
          style={{
            justifyContent: "center",
            width: (width - 20) * 0.25,
            alignItems: "center",
            padding: 10
          }}
        >
          <Text
            style={{ fontSize: 30, color: COLORS.BLACK_COLOR, fontWeight: "bold" }}
          >
            {this.itemDate.date()}
          </Text>
          <Text
            style={{ fontSize: 17, color: COLORS.BLACK_COLOR, fontWeight: "400" }}
          >
            {dayOfWeekAsString(this.itemDate.day(), true)}
          </Text>
        </View>
        <View
          style={{
            width: 1,
            backgroundColor: COLORS.PAGE_BACKGROUND_COLOR,
            marginVertical: 5,
            borderRadius: 1
          }}
        />
        {this.renderBody()}
      </View>
    );
  }

  renderBody() {
    if (Object.keys(this.props.attendanceData.calendarData).length == 0) {
      return (
        <View style={{ padding: 10}}>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 13,
              fontWeight: "500",
              fontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
              color: COLORS.WHITE_COLOR,
              backgroundColor: this.textColor == COLORS.CALENDAR_SECONDARY_COLOR ? COLORS.HOLIDAY_STATUS_COLOR:COLORS.ABSENT_DAY_STATUS_COLOR,
              padding:4,
              paddingHorizontal:8,
              borderRadius:10
            }}
          >
            {this.textColor == COLORS.BLACK_COLOR
              ? this.isAbsent
                ? "ABSENT"
                : "N/A"
              : "WEEKEND"}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: "row"  }}>
          {this.renderNonHolidayData()}
          {this.renderMiddleSeperator()}
          {this.renderHolidayOrLeaveData()}
        </View>
      );
    }
  }

  renderMiddleSeperator() {
    if (this.isMultipleViews) {
      return (
        <View
          style={{
            width: 1,
            backgroundColor: COLORS.PAGE_BACKGROUND_COLOR,
            marginVertical: 5,
            borderRadius: 1
          }}
        />
      );
    } else {
      return null;
    }
  }

  renderNonHolidayData() {
    if (this.showRegularView) {
      return (
        <View
          style={{
            width: (width - 20) * 0.35,
            paddingVertical: 5,
            paddingLeft: 10,
            justifyContent: "flex-start",
            alignItems: "flex-start"
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              color: COLORS.WHITE_COLOR,
              backgroundColor:COLORS.WORKING_DAY_STATUS_COLOR,
              padding:4,
              paddingHorizontal:8,
              borderRadius:10
              //alignSelf: "center"
            }}
          >
            {this.props.attendanceData.calendarData[this.regularViewType].type}
          </Text>
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flexDirection: "row"
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: this.textColor,
                  fontWeight: "400"
                }}
              >
                {ATTENDANCE_SECTION_PAGE_RESOURCES.DAY_CONTAINER_IN_TEXT}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: this.textColor,
                  fontWeight: "400"
                }}
              >
                {ATTENDANCE_SECTION_PAGE_RESOURCES.DAY_CONTAINER_OUT_TEXT}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: this.textColor,
                  fontWeight: "400"
                }}
              >
                {
                  ATTENDANCE_SECTION_PAGE_RESOURCES.DAY_CONTAINER_WORK_HOURS_TEXT
                }
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: this.textColor,
                  fontWeight: "400"
                }}
              >
                {` : ${this.props.attendanceData.calendarData[this.regularViewType]
                    .in_time}`}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: this.textColor,
                  fontWeight: "400"
                }}
              >
                {` : ${this.props.attendanceData.calendarData[this.regularViewType]
                    .out_time}`}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: this.textColor,
                  fontWeight: "400"
                }}
              >
                {` : ${
                  this.props.attendanceData.calendarData[this.regularViewType]
                    .work_hours
                }`}
              </Text>
            </View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }

  renderHolidayOrLeaveData() {
    return (
      <View
        style={{
          width: this.isMultipleViews
            ? (width - 20) * 0.35
            : (width - 20) * 0.7,
          paddingVertical: 5,
          paddingHorizontal: 10,
          justifyContent: "flex-start",
          flexDirection: "column",
          alignItems: "flex-start"
        }}
      >
        {this.renderHolidayView()}
        {this.renderLeaveView()}
      </View>
    );
  }

  renderHolidayView() {
    if (this.showHolidayView) {
      return (
        <View
          style={{
            justifyContent: "flex-start",
            //alignItems: "center"
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: COLORS.WHITE_COLOR,
              fontWeight: "500",
              backgroundColor:COLORS.HOLIDAY_STATUS_COLOR,
              padding:4,
              paddingHorizontal:8,
              borderRadius:10,
              alignSelf: 'flex-start'
            }}
          >
            {this.props.attendanceData.calendarData[EVENT_TYPES[3]].type}
          </Text>
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <Text
              style={{ fontSize: 12, color: this.textColor, fontWeight: "400" }}
              numberOfLines={2}
              ellipsizeMode={"tail"}
            >
              {`Occasion: ${
                this.props.attendanceData.calendarData[EVENT_TYPES[3]].message
              }`}
            </Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }

  renderLeaveView() {
    if (this.showLeaveView) {
      return (
        <View
          style={{
            justifyContent: "flex-start",
            //alignItems: "center"
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                height: 8,
                width: 8,
                borderRadius: 4,
                alignSelf: "center",
                marginRight: 5,
                backgroundColor: this.renderLeaveStatusColor()
              }}
            />
            <Text
              style={{
                fontSize: 13,
                color: COLORS.WHITE_COLOR,
                fontWeight: "500",
                backgroundColor:COLORS.LEAVE_STATUS_COLOR,
              padding:4,
              paddingHorizontal:8,
              borderRadius:10
                //alignSelf: "center"
              }}
            >
              {this.props.attendanceData.calendarData[EVENT_TYPES[4]].type}
            </Text>
          </View>

          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flexDirection: "row"
            }}
          >
            <Text
              style={{ fontSize: 12, color: this.textColor, fontWeight: "400" }}
            >
              {"Reason : "}
            </Text>
            <Text
              style={{fontSize: 12, color: this.textColor, fontWeight: "400", width:this.isMultipleViews ? null : (width - 40) * 0.55 }}
              numberOfLines={this.isMultipleViews ? 1 : 3}
              ellipsizeMode={'tail'}
            >
              {`${this.props.attendanceData.calendarData[EVENT_TYPES[4]].reason}`}
            </Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }

  renderLeaveStatusColor() {
    switch (this.props.attendanceData.calendarData[EVENT_TYPES[4]].status) {
      case LEAVE_STATUS[0]:
        return COLORS.LEAVE_APPROVED_COLOR;
      case LEAVE_STATUS[1]:
        return COLORS.LEAVE_PENDING_COLOR;
      case LEAVE_STATUS[2]:
        return COLORS.LEAVE_REJECTED_COLOR;
      default:
        return COLORS.WHITE_COLOR;
    }
  }
}
