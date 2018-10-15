/*

*/
import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  InteractionManager,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Platform
} from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import CalendarListItem from "../components/CalendarListItem";
import * as PageActions from "../redux/actions/pageActions";
import * as AttendanceActions from "../redux/actions/userAttendanceActions";
import { connect } from "react-redux";
import CustomAlert from "../components/CustomAlert";
import {
  ATTENDANCE_SECTION_PAGE_RESOURCES,
  ALERT_RESOURCES
} from "../constants/ResourceConstants";
import { DATE_TIME_FORMAT } from "../constants/GeneralConstants";
import * as THEME from "../styles/theme";
import NavigationService from "../services/NavigationService";

const { height, width } = Dimensions.get("screen");

class AttendanceSectionPage extends Component {
  constructor(props) {
    super(props);
    this.calendarData = [];
    this.currentDate = moment();
    this.startDay = this.currentDate.date(1).format(DATE_TIME_FORMAT);
    this.lastDay = this.currentDate.daysInMonth();
    this.state = {
      scrollY: new Animated.Value(0),
      hoursStatsY: new Animated.Value(-100),
      showHelpModal: false,
      calendarData: [],
      currentDay: moment().format(DATE_TIME_FORMAT)
    };
    this.hoursStatsAnimation = true;
    this.monthDeviation = 0;
    this.calendarRows = [];
    this.onDayPress = this.onDayPress.bind(this);
    this.scrollCalendarToTop = this.scrollCalendarToTop.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(PageActions.updateNavigationBarHeader(""));
    this.props.dispatch(AttendanceActions.dispatchError(""));
  }

  componentDidMount() {
    this.props.dispatch(PageActions.showLoading());
    this.props.dispatch(
      PageActions.updateNavigationBarHeader(
        ATTENDANCE_SECTION_PAGE_RESOURCES.PAGE_HEADER_TEXT
      )
    );
    InteractionManager.runAfterInteractions(() => {
      if (this.props.networkConnected) {
        this.props.dispatch(
          AttendanceActions.getEmployeeAttendance(this.startDay, this.lastDay)
        );
      } else {
        this.props.dispatch(PageActions.hideLoading());
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.networkConnected != this.props.networkConnected &&
      nextProps.networkConnected &&
      this.props.attendanceData.length < 1
    ) {
      this.props.dispatch(
        AttendanceActions.getEmployeeAttendance(this.startDay, this.lastDay)
      );
    }
    if (
      nextProps.attendanceData != this.props.attendanceData &&
      nextProps.attendanceData.length > 0
    ) {
      this.props.dispatch(PageActions.hideLoading());
    }
  }

  onDayPress(day) {
    this.setState(
      {
        currentDay: day.dateString
      },
      () => {
        setTimeout(() => {
          this.animScroll.scrollTo({
            y: 425 + (day.day - 1) * 100,
            x: 0,
            animated: true
          });
        }, 50);
      }
    );
  }

  scrollCalendarToTop() {
    this.animScroll.scrollTo({ y: 0, x: 0, animated: true });
  }

  render() {
    if (this.props.pageError !== "") {
      this.props.dispatch(PageActions.hideLoading());
      return (
        <CustomAlert
          showAlert={true}
          errorMessage={this.props.pageError}
          errorHeader={
            this.props.pageError == ALERT_RESOURCES.NO_RECORDS_FOUND
              ? ALERT_RESOURCES.ALERT_HEADER_TEXT
              : ALERT_RESOURCES.ERROR_HEADER_TEXT
          }
          actionButtonText={ALERT_RESOURCES.OK_TEXT}
          onDismissAlert={() => {
            NavigationService.pop();
          }}
        />
      );
    } else {
      return (
        <View
          style={[THEME.APP_PAGE_CONTAINER.CONTAINER, [{ paddingVertical: 0 }]]}
        >
          <Modal
            transparent={true}
            animationType={"none"}
            visible={this.state.showHelpModal}
            onRequestClose={() => {
              this.setState({ showHelpModal: false });
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                this.setState({ showHelpModal: false });
              }}
              style={{
                flex: 1,
                backgroundColor: THEME.COLORS.MODAL_BACKGROUND_COLOR
              }}
            >
              {this.renderHelpContent()}
            </TouchableOpacity>
          </Modal>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ position: "absolute", zIndex: 105, bottom: 15, right: 10 }}
            onPress={() => {
              this.setState({ showHelpModal: true });
            }}
          >
            <Image
              source={require("../images/info-icon.png")}
              style={{
                height: 40,
                width: 40,
                resizeMode: "contain"
              }}
            />
          </TouchableOpacity>
          <Animated.View
            style={{
              position: "absolute",
              zIndex: 100,
              bottom: 15,
              right: 15,
              transform: [
                {
                  translateY: this.state.scrollY.interpolate({
                    inputRange: [0, 20, 40, 60],
                    outputRange: [0, -25, -45, -65],
                    extrapolate: "clamp"
                  })
                }
              ],
              opacity: this.state.scrollY.interpolate({
                inputRange: [0, 60],
                outputRange: [0, 1]
              })
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                this.animateHoursStatsView();
              }}
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <Animated.Image
                source={require("../images/hours-icon.png")}
                style={{
                  height: 30,
                  width: 30,
                  resizeMode: "contain"
                }}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={{
              position: "absolute",
              zIndex: 90,
              bottom: 15,
              right: 15,
              transform: [
                {
                  translateY: this.state.scrollY.interpolate({
                    inputRange: [60, 80, 100, 120],
                    outputRange: [-65, -85, -105, -125],
                    extrapolate: "clamp"
                  })
                }
              ],
              opacity: this.state.scrollY.interpolate({
                inputRange: [60, 120],
                outputRange: [0, 1]
              })
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                this.scrollCalendarToTop();
              }}
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <Animated.Image
                source={require("../images/scroll-top-icon.png")}
                style={{
                  height: 30,
                  width: 30,
                  resizeMode: "contain"
                }}
              />
              <Text style={{ fontSize: 12, color: "#000" }}>Top</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={{
              position: "absolute",
              zIndex: 100,
              top: -90,
              left: 0,
              width: width,
              backgroundColor: THEME.COLORS.PAGE_BACKGROUND_COLOR,
              paddingHorizontal: 15,
              transform: [
                {
                  translateY: this.state.hoursStatsY
                }
              ]
            }}
          >
            {this.renderHoursStatistics()}
          </Animated.View>
          <ScrollView
            ref={animScroll => (this.animScroll = animScroll)}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([
              { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
            ])}
          >
            {this.renderHoursStatistics()}
            {this.renderCalendar()}
            {this.props.attendanceData.map((data, index) => {
              return <CalendarListItem key={index} attendanceData={data} />;
            })}
          </ScrollView>
        </View>
      );
    }
  }

  renderHoursStatistics() {
    return (
      <View
        style={{
          top: 0,
          paddingVertical: 15,
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <View
          style={{
            minWidth: (width - 50) / 2,
            height: 90,
            backgroundColor: THEME.COLORS.WHITE_COLOR,
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              fontSize: 30,
              fontWeight: "600",
              alignSelf: "center",
              paddingBottom: 5,
              paddingHorizontal: 10,
              color:
                this.props.workHours.actual < this.props.workHours.expected
                  ? THEME.COLORS.RED_COLOR
                  : THEME.COLORS.GREEN_COLOR
            }}
          >
            {this.props.workHours.actual}
          </Text>
          <Text
            style={{
              alignSelf: "center",
              color: THEME.COLORS.BLACK_COLOR
            }}
          >
            {ATTENDANCE_SECTION_PAGE_RESOURCES.WORKING_HOURS_TEXT}
          </Text>
        </View>
        <View
          style={{
            minWidth: ((width - 50) / 2) + 5,
            height: 90,
            backgroundColor: THEME.COLORS.WHITE_COLOR,
            justifyContent: "center",
            borderRadius: 6,
            alignItems: "center"
          }}
        >
          <Text
            style={{
              backgroundColor: "white",
              borderRadius: 6,
              fontSize: 30,
              fontWeight: "600",
              alignSelf: "center",
              paddingBottom: 5,
              color: THEME.COLORS.BLACK_COLOR
            }}
            numberOfLines={2}
          >
            {this.props.workHours.expected}
          </Text>
          <Text
            style={{
              alignSelf: "center",
              color: THEME.COLORS.BLACK_COLOR
            }}
          >
            {ATTENDANCE_SECTION_PAGE_RESOURCES.EXPECTED_WORKING_HOURS_TEXT}
          </Text>
        </View>
      </View>
    );
  }

  renderCalendar() {
    const calendarMarkings = {
      ...this.props.calendarData,
      [this.state.currentDay]: {
        selected: true,
        disableTouchEvent: true,
        selectedDotColor: THEME.COLORS.WHITE_COLOR
      }
    };
    return (
      <Calendar
        key={`${Math.random()}`}
        style={THEME.CALENDAR_STYLE.CALENDAR}
        current={this.state.currentDay}
        onDayPress={day => {
          this.onDayPress(day);
        }}
        monthFormat={"MMMM yyyy"}
        //monthFormat={DATE_TIME_FORMAT}
        hideExtraDays={true}
        markingType={"multi-dot"}
        markedDates={calendarMarkings}
        hideArrows={false}
        onPressArrowLeft={() => {
          if (this.monthDeviation < 4) {
            this.props.dispatch(PageActions.showLoading());
            this.monthDeviation++;
            this.currentDate = this.currentDate.subtract(1, "months");
            this.startDay = this.currentDate.date(1).format(DATE_TIME_FORMAT);
            this.lastDay = this.currentDate.daysInMonth();
            this.setState({
              currentDay: this.currentDate.format(DATE_TIME_FORMAT)
            });
            this.props.dispatch(
              AttendanceActions.getEmployeeAttendance(
                this.startDay,
                this.lastDay
              )
            );
          }
        }}
        onPressArrowRight={() => {
          if (this.currentDate.month() < moment().month()) {
            this.props.dispatch(PageActions.showLoading());
            this.monthDeviation--;
            this.currentDate = this.currentDate.add(1, "months");
            this.startDay = this.currentDate.date(1).format(DATE_TIME_FORMAT);
            this.lastDay = this.currentDate.daysInMonth();
            if (this.currentDate.month() == moment().month()) {
              this.currentDate = moment();
            }
            this.setState({
              currentDay: this.currentDate.format(DATE_TIME_FORMAT)
            });
            this.props.dispatch(
              AttendanceActions.getEmployeeAttendance(
                this.startDay,
                this.lastDay
              )
            );
          }
        }}
        theme={{
          calendarBackground: THEME.COLORS.WHITE_COLOR,
          selectedDayBackgroundColor: THEME.COLORS.APP_PRIMARY_COLOR,
          selectedDayTextColor: THEME.COLORS.WHITE_COLOR,
          todayTextColor: THEME.COLORS.BLACK_COLOR,
          dayTextColor: THEME.COLORS.BLACK_COLOR,
          textDisabledColor: THEME.COLORS.BLACK_COLOR,
          selectedDotColor: THEME.COLORS.WHITE_COLOR,
          arrowColor: THEME.COLORS.BLACK_COLOR,
          monthTextColor: THEME.COLORS.BLACK_COLOR,
          textDayFontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
          textMonthFontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
          textDayHeaderFontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
          textMonthFontWeight: "bold",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 16,
          "stylesheet.calendar.header": {
            week: {
              flexDirection: "row",
              justifyContent: "space-around"
            },
            dayHeader: {
              width: 32,
              textAlign: "center",
              fontSize: 16,
              color: THEME.COLORS.CALENDAR_SECONDARY_COLOR
            }
          }
        }}
      />
    );
  }

  renderHelpContent() {
    return (
      <View
        style={{
          backgroundColor: THEME.COLORS.WHITE_COLOR,
          padding: 10,
          borderRadius: 6,
          position: "absolute",
          top: height * 0.22,
          maxWidth: width - 30,
          right: 15
        }}
      >
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <Image
            source={require("../images/info-grey-icon.png")}
            style={{
              height: 18,
              width: 18,
              marginTop: 5,
              marginRight: 5,
              resizeMode: "contain"
            }}
          />
          <Text
            style={{
              fontSize: 15,
              fontWeight: "400",
              paddingBottom: 5,
              color: THEME.COLORS.BLACK_COLOR
            }}
            numberOfLines={2}
          >
            Attendance for last four months will be displayed
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../images/info-grey-icon.png")}
            style={{
              height: 18,
              width: 18,
              marginTop: 5,
              marginRight: 5,
              resizeMode: "contain"
            }}
          />
          <Text
            style={{
              fontSize: 15,
              fontWeight: "400",
              paddingBottom: 5,
              color: THEME.COLORS.BLACK_COLOR
            }}
            numberOfLines={3}
          >
            Every color dot you see on the calendar denotes specific
            information. Kindly refer the following :
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              paddingVertical: 5,
              color: THEME.COLORS.BLACK_COLOR
            }}
          >
            Calendar Day Status
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              paddingHorizontal: 10
            }}
          >
            <View
              style={{
                height: 14,
                width: 14,
                borderRadius: 7,
                marginRight: 5,
                backgroundColor: THEME.COLORS.WORKING_DAY_STATUS_COLOR
              }}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                textAlignVertical: "center",
                textAlign: "center",
                color: THEME.COLORS.BLACK_COLOR
              }}
            >
              Working Day (Present | Half-Day | Work From Home)
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              paddingHorizontal: 10
            }}
          >
            <View
              style={{
                height: 14,
                width: 14,
                borderRadius: 7,
                marginRight: 5,
                backgroundColor: THEME.COLORS.ABSENT_DAY_STATUS_COLOR
              }}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                textAlignVertical: "center",
                textAlign: "center",
                color: THEME.COLORS.BLACK_COLOR
              }}
            >
              Absent or Unknown
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              paddingHorizontal: 10
            }}
          >
            <View
              style={{
                height: 14,
                width: 14,
                borderRadius: 7,
                marginRight: 5,
                backgroundColor: THEME.COLORS.HOLIDAY_STATUS_COLOR
              }}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                textAlignVertical: "center",
                textAlign: "center",
                color: THEME.COLORS.BLACK_COLOR
              }}
            >
              Holiday (Weekends | Public Holidays)
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              paddingHorizontal: 10
            }}
          >
            <View
              style={{
                height: 14,
                width: 14,
                borderRadius: 7,
                marginRight: 5,
                backgroundColor: THEME.COLORS.LEAVE_STATUS_COLOR
              }}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                textAlignVertical: "center",
                textAlign: "center",
                color: THEME.COLORS.BLACK_COLOR
              }}
            >
              Leave
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                paddingVertical: 5,
                color: THEME.COLORS.BLACK_COLOR
              }}
            >
              Leave Status (Refer to the list)
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 5,
                paddingHorizontal: 10
              }}
            >
              <View
                style={{
                  height: 14,
                  width: 14,
                  borderRadius: 7,
                  marginRight: 5,
                  backgroundColor: THEME.COLORS.LEAVE_APPROVED_COLOR
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: THEME.COLORS.BLACK_COLOR
                }}
              >
                Approved
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 5,
                paddingHorizontal: 10
              }}
            >
              <View
                style={{
                  height: 14,
                  width: 14,
                  borderRadius: 7,
                  marginRight: 5,
                  backgroundColor: THEME.COLORS.LEAVE_PENDING_COLOR
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: THEME.COLORS.BLACK_COLOR
                }}
              >
                Pending
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 5,
                paddingHorizontal: 10
              }}
            >
              <View
                style={{
                  height: 14,
                  width: 14,
                  borderRadius: 7,
                  marginRight: 5,
                  backgroundColor: THEME.COLORS.LEAVE_REJECTED_COLOR
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: THEME.COLORS.BLACK_COLOR
                }}
              >
                Rejected
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  animateHoursStatsView = () => {
    Animated.sequence([
      Animated.timing(
        this.state.hoursStatsY,
        {
          toValue: 90,
          duration: 1000,
          useNativeDriver: true
        }
      ),
      Animated.timing(
        this.state.hoursStatsY,
        {
          toValue: -100,
          duration: 1000,
          delay: 4000,
          useNativeDriver: true
        }
      )
    ]).start(finished => {});
  };
}

function mapStateToProps(state) {
  return {
    networkConnected: state.applicationReducer.networkConnected,
    attendanceData: state.userAttendanceReducer.attendanceData.attendanceList,
    workHours: state.userAttendanceReducer.attendanceData.workHours,
    calendarData: state.userAttendanceReducer.attendanceData.calendarData,
    pageError: state.userAttendanceReducer.errors
  };
}

export default connect(mapStateToProps)(AttendanceSectionPage);
