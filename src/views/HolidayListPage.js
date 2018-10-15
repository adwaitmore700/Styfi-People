/*

*/
import React, { Component } from "react";
import { View, Dimensions, InteractionManager } from "react-native";
import CustomTable from "../components/CustomTable";
import * as PageActions from "../redux/actions/pageActions";
import * as LeaveActions from "../redux/actions/userLeaveActions";
import { connect } from "react-redux";
import CustomAlert from "../components/CustomAlert";
import NavigationService from "../services/NavigationService";
import * as THEME from "../styles/theme";
import {
  HOLIDAY_LIST_PAGE_RESOURCES,
  ALERT_RESOURCES
} from "../constants/ResourceConstants";

const { height, width } = Dimensions.get("window");

class HolidayListPage extends Component {
  constructor(props) {
    super(props);
    const newWidth = width - 32; //counting the side padddings of 15 each, additional 2 to fix border issue
    this.state = {
      tableHead: [
        HOLIDAY_LIST_PAGE_RESOURCES.SNO_HEADER_TEXT,
        HOLIDAY_LIST_PAGE_RESOURCES.HOLIDAY_HEADER_TEXT,
        HOLIDAY_LIST_PAGE_RESOURCES.DATE_HEADER_TEXT,
        HOLIDAY_LIST_PAGE_RESOURCES.DAY_HEADER_TEXT
      ],
      widthArr: [
        newWidth * 0.15,
        newWidth * 0.5,
        newWidth * 0.25,
        newWidth * 0.3
      ]
    };
    this.tableData = [];
  }

  componentWillMount() {
    this.props.dispatch(
      PageActions.updateNavigationBarHeader(
        HOLIDAY_LIST_PAGE_RESOURCES.PAGE_HEADER_TEXT
      )
    );
  }

  componentWillUnmount() {
    this.props.dispatch(PageActions.updateNavigationBarHeader(""));
    this.props.dispatch(LeaveActions.dispatchError(""));
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      if (this.props.networkConnected) {
        this.props.dispatch(LeaveActions.getHolidayList());
      } else {
        this.props.dispatch(PageActions.hideLoading());
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.networkConnected != this.props.networkConnected &&
      nextProps.networkConnected &&
      this.props.holidayList.length < 1
    ) {
      this.props.dispatch(LeaveActions.getHolidayList());
    }
    if (
      nextProps.holidayList != this.props.holidayList &&
      nextProps.holidayList.length > 0
    ) {
      this.props.dispatch(PageActions.hideLoading());
    }
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
        <View style={THEME.APP_PAGE_CONTAINER.CONTAINER}>
          <CustomTable
            tableData={this.props.holidayList}
            tableHeaderData={this.state.tableHead}
            tableBorderColor={THEME.COLORS.TRANSPARENT_COLOR}
            rowSeperatorColor={THEME.COLORS.SEPERATOR_PRIMARY_COLOR}
            colSeperatorColor={THEME.COLORS.SEPERATOR_PRIMARY_COLOR}
            itemBackgroundColor={THEME.COLORS.WHITE_COLOR}
            headerBackgroundColor={THEME.COLORS.TABLE_HEADER_BACKGROUND_COLOR}
            headerTextFontStyle={THEME.TABLE_STYLE.HEADER_TEXT_FONT}
            showHeaderSeperator={false}
            tableColWidth={this.state.widthArr}
            headerRowHeight={60}
            rowHeight={40}
          />
        </View>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    networkConnected: state.applicationReducer.networkConnected,
    holidayList: state.userLeaveReducer.holidayList,
    pageError: state.userLeaveReducer.errors
  };
}

export default connect(mapStateToProps)(HolidayListPage);
