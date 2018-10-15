import React, { Component } from "react";
import { StyleSheet, ActivityIndicator, View, NetInfo } from "react-native";
import { connect } from "react-redux";
import { COLORS } from "../styles/theme";
import NoNetworkComponent from "../components/NoNetworkComponent";
import { NAVIGATION_PAGE_KEYS } from "../constants/PageConstants";
import * as THEME from "../styles/theme";

class LoadingPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this.initializeComponent();
      }
    });
  }

  initializeComponent() {
    if (this.props.loggedIn) {
      this.props.navigation.replace(NAVIGATION_PAGE_KEYS.WELCOME_PAGE);
    } else {
      this.props.navigation.replace(NAVIGATION_PAGE_KEYS.LOGIN_PAGE);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          color={THEME.COLORS.APP_PRIMARY_COLOR}
          size="large"
          animating={true}
        />
        <NoNetworkComponent
          showModal={!this.props.networkConnected}
          reloadPage={this.refreshPage}
        />
      </View>
    );
  }

  refreshPage = () => {
    this.initializeComponent();
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.networkConnected != this.props.networkConnected &&
      nextProps.networkConnected
    ) {
      this.refreshPage();
    }
  }
}

function mapStateToProps(state) {
  return {
    loggedIn: state.applicationReducer.isUserLoggedIn,
    networkConnected: state.applicationReducer.networkConnected
  };
}

export default connect(mapStateToProps)(LoadingPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE_COLOR,
    justifyContent: "center",
    alignItems: "center"
  }
});
