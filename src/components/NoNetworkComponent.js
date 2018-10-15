/*
No Network view component 
*/

import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Image,
  StatusBar,
  TouchableOpacity,
  Text,
  NetInfo,
  Platform
} from "react-native";
import { connect } from "react-redux";
import * as PageActions from "../redux/actions/pageActions";
import NavigationService from "../services/NavigationService";
import { COLORS } from "../styles/theme";
import { ALERT_RESOURCES } from "../constants/ResourceConstants";

class NoNetworkComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { showModal: this.props.showModal };
    this.onActionButtonClicked = this.onActionButtonClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showModal != this.props.showModal) {
      this.setState({ showModal: nextProps.showModal });
    }
  }

  render() {
    return (
      <Modal
        transparent={false}
        animationType={"none"}
        visible={this.state.showModal}
        onRequestClose={() => {
          if (this.props.navigationStackCount > 1) {
            NavigationService.pop();
          }
          setTimeout(() => {
            this.setState({ showModal: false });
          }, 300);
        }}
      >
        <StatusBar
          backgroundColor={COLORS.APP_PRIMARY_COLOR}
          barStyle="light-content"
        />
        <View style={styles.container}>
          <Image
            source={require("../images/no-network-icon.png")}
            style={styles.networkIcon}
          />
          <Text style={styles.contentText}>
            {ALERT_RESOURCES.NETWORK_DISCONNECTED}
          </Text>
          <TouchableOpacity
            key={"actionBtn"}
            opacity={0.7}
            style={styles.actionButton}
            onPress={this.onActionButtonClicked}
          >
            <Text key={"actionBtnText"} style={styles.actionButtonText}>
              {ALERT_RESOURCES.TRY_AGAIN}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  onActionButtonClicked() {
    this.props.dispatch(PageActions.showLoading());
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        this.props.dispatch(PageActions.hideLoading());
        if (isConnected) {
          if (this.props.reloadPage != null) {
            this.props.reloadPage();
          }
        }
      })
      .catch(error => {});
  }
}

function mapStateToProps(state) {
  return {
    networkConnected: state.applicationReducer.networkConnected,
    navigationStackCount: state.pageReducer.pageStackCount
  };
}

export default connect(mapStateToProps)(NoNetworkComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: COLORS.WHITE_COLOR,
    marginTop: 60
  },
  networkIcon: {
    height: 80,
    width: 80,
    resizeMode: "contain"
  },
  contentText: {
    fontSize: 18,
    color: COLORS.BLACK_COLOR,
    fontFamily: Platform.OS == 'android' ? "sans-serif-medium": 'AvenirNext-Regular',
    textAlignVertical: "center",
    alignSelf: "center",
    marginTop: 10
  },
  actionButton: {
    backgroundColor: COLORS.WHITE_COLOR,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    marginVertical: 20,
    alignSelf: "center",
    padding: 15
  },
  actionButtonText: {
    color: COLORS.BLACK_COLOR,
    fontSize: 15,
    fontWeight: "400",
    alignSelf: "center",
    fontFamily: Platform.OS == 'android' ? "sans-serif-medium": 'AvenirNext-Regular'
  }
});
