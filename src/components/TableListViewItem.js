import React, { Component } from "react";
import { View, Text, ScrollView,Platform } from "react-native";
import * as THEME from "../styles/theme";

export default class TableListViewItem extends Component {
  constructor(props) {
    super(props);
  }
  renderRow = item => {
    let colView = [];
    let itemObjectsSize = Object.keys(item).length;
    for (let i = 0; i < itemObjectsSize; i++) {
      colView.push(
        <View
          key={`${i}rowItem`}
          style={{
            ...this.props.rowItemStyle,
            ...{
              width: this.props.tableColWidth[i]
            }
          }}
        >
          <Text
            style={{
              fontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
              color: THEME.COLORS.BLACK_COLOR,
              alignSelf: "center",
              padding: 10
            }}
          >
            {Object.values(item)[i]}
          </Text>
        </View>
      );
      if (i != itemObjectsSize - 1) {
        colView.push(this.renderRowColSeperator(i));
      }
    }
    return colView;
  };

  renderRowColSeperator = i => {
    return (
      <View key={`${i}rowColSep`} style={this.props.rowColSeperatorStyle} />
    );
  };

  render() {
    if (
      this.props.itemParentList.indexOf(this.props.item) ==
      this.props.itemCount - 1
    ) {
      this.props.onFinishedLoading();
    }
    return (
      <View style={this.props.rowStyle}>{this.renderRow(this.props.item)}</View>
    );
  }
}
