import React, { Component } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Dimensions
} from "react-native";
import TableListViewItem from "./TableListViewItem";
import { COLORS } from "../styles/theme";
const { height } = Dimensions.get("window");

export default class CustomTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: this.renderPageLoader()
    };
    this.onLoadingTable = this.onLoadingTable.bind(this);
  }

  renderPageLoader() {
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.APP_PRIMARY_COLOR}
        animating={true}
        style={{
          paddingVertical: 10,
          justifyContent: "center",
          alignItems: "center"
        }}
      />
    );
  }
  renderColumns() {
    let colView = [];
    for (let i = 0; i < this.props.tableHeaderData.length; i++) {
      colView.push(
        <View
          key={`${i}colItem`}
          style={{
            width: this.props.tableColWidth[i],
            justifyContent: "center",
            alignItems: "center",
            padding: 5
          }}
        >
          <Text style={this.props.headerTextFontStyle}>
            {this.props.tableHeaderData[i]}
          </Text>
        </View>
      );
      if (this.props.showHeaderSeperator) {
        if (i != this.props.tableHeaderData.length - 1) {
          colView.push(this.renderColSeperator(i));
        }
      }
    }
    return colView;
  }

  renderColSeperator(i) {
    return (
      <View
        key={`${i}colSep`}
        style={{ width: 1, backgroundColor: this.props.colSeperatorColor }}
      />
    );
  }

  renderHeader() {
    return (
      <View
        style={{
          flexDirection: "row",
          height: this.props.headerRowHeight,
          backgroundColor: this.props.headerBackgroundColor,
          justifyContent: "space-evenly"
        }}
      >
        {this.renderColumns()}
      </View>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.showLoading !== this.state.showLoading ||
      this.props.tableData != nextProps.tableData
    ) {
      return true;
    } else {
      return false;
    }
  }

  renderList() {
    if (this.props.tableData.length > 0) {
      return (
        <FlatList
          data={this.props.tableData}
          renderItem={({ item, index }) => (
            <TableListViewItem
              rowStyle={{
                flex: 1,
                flexDirection: "row",
                minHeight: this.props.rowHeight,
                backgroundColor: this.props.itemBackgroundColor,
                justifyContent: "space-evenly",
                borderTopColor: this.props.rowSeperatorColor,
                borderTopWidth: 1
              }}
              tableColWidth={this.props.tableColWidth}
              rowItemStyle={{
                justifyContent: "center",
                alignItems: "center"
              }}
              rowColSeperatorStyle={{
                width: 1,
                backgroundColor: this.props.colSeperatorColor
              }}
              item={item}
              itemParentList={this.props.tableData}
              itemCount={this.props.tableData.length}
              onFinishedLoading={this.onLoadingTable}
            />
          )}
          initialNumToRender={Math.round(height / 40)}
          getItemLayout={(data, index) => ({
            length: this.props.rowHeight,
            offset: this.props.rowHeight * index,
            index
          })}
          keyExtractor={(item, index) => String(index)}
        />
      );
    } else {
      return null;
    }
  }

  onLoadingTable() {
    if (this.state.showLoading !== null) {
      this.setState({ showLoading: null });
    }
  }

  render() {
    return (
      <View
        style={{
          borderColor: this.props.tableBorderColor,
          borderWidth: 1
        }}
      >
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            minHeight: this.props.rowHeight * 3
          }}
        >
          <View>
            {this.renderHeader()}
            {this.state.showLoading}
            {this.renderList()}
          </View>
        </ScrollView>
      </View>
    );
  }
}
