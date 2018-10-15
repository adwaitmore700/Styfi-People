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
import { NAVIGATION_PAGE_KEYS } from "../constants/PageConstants";
import { connect } from "react-redux";
import { LEAVE_SECTION_PAGE_RESOURCES } from "../constants/ResourceConstants";
import * as THEME from "../styles/theme";
import { showNoNetworkAlert } from "../utils/utilFunctions";
const { height, width } = Dimensions.get("window");

const leaveSections = [
  {
    text: LEAVE_SECTION_PAGE_RESOURCES.LEAVE_STATISTICS_TILE_TEXT,
    iconSource: require("../images/leave-statistics-icon.png"),
    pageName: NAVIGATION_PAGE_KEYS.LEAVE_STATISTICS_PAGE
  },
  {
    text: LEAVE_SECTION_PAGE_RESOURCES.APPLY_LEAVE_TILE_TEXT,
    iconSource: require("../images/apply-leave-icon.png"),
    pageName: NAVIGATION_PAGE_KEYS.LEAVE_APPLICATION_PAGE
  },
  {
    text: LEAVE_SECTION_PAGE_RESOURCES.LEAVE_HISTORY_TILE_TEXT,
    iconSource: require("../images/leave-history-icon.png"),
    pageName: NAVIGATION_PAGE_KEYS.LEAVE_HISTORY_PAGE
  },
  {
    text: LEAVE_SECTION_PAGE_RESOURCES.HOLIDAY_LIST_TILE_TEXT,
    iconSource: require("../images/holiday-list-icon.png"),
    pageName: NAVIGATION_PAGE_KEYS.HOLIDAY_LIST_PAGE
  }
];

class LeaveSectionPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={THEME.APP_PAGE_CONTAINER.CONTAINER}>
        {this.renderTiles()}
      </View>
    );
  }

  renderTiles() {
    let view = [];
    for (let i = 0; i < leaveSections.length; i++) {
      let marginRightValue = i % 2 == 0 ? 15 : 0;
      view.push(
        <TouchableOpacity
          key={i}
          onPress={() => {
            if (this.props.networkConnected) {
              this.props.navigation.push(leaveSections[i].pageName);
            } else {
              showNoNetworkAlert();
            }
          }}
          activeOpacity={0.8}
          style={{
            marginBottom: 15,
            marginRight: marginRightValue,
            width: (width - 30) / 2 - 7.5,
            height: (width - 30) / 2 - 7.5,
            justifyContent: "flex-start",
            alignItems: "center",
            borderRadius: 6,
            padding: 15,
            backgroundColor: THEME.COLORS.WHITE_COLOR,
            elevation: Platform.select({
              ios: null,
              android: 2
            })
          }}
        >
          <Image style={styles.itemIcon} source={leaveSections[i].iconSource} />
          <Text style={styles.itemName}>{leaveSections[i].text}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={{ flexWrap: "wrap", flexDirection: "row" }}>{view}</View>
    );
  }
}

function mapStateToProps(state) {
  return {
    networkConnected: state.applicationReducer.networkConnected
  };
}

export default connect(mapStateToProps)(LeaveSectionPage);

const styles = StyleSheet.create({
  itemName: {
    fontSize: 14,
    color: THEME.COLORS.TEXT_DARK_COLOR,
    fontFamily: Platform.OS == 'android' ? "sans-serif-medium": 'AvenirNext-Regular',
    marginTop: 5
  },
  itemIcon: {
    height: width * 0.27,
    width: width * 0.27,
    resizeMode: "contain",
    marginBottom: 5
  }
});
