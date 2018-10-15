import { AppRegistry, StatusBar } from "react-native";
import React, { Component } from "react";
import { Provider } from "react-redux";
import MainPage from "./src/App";
import { persistor, reduxStore } from "./src/redux/reduxStore";
import { PersistGate } from "redux-persist/lib/integration/react";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={reduxStore}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar backgroundColor="#2366EA" barStyle="light-content" />
          <MainPage {...this.props} />
        </PersistGate>
      </Provider>
    );
  }
}

AppRegistry.registerComponent("StyfiPeople", () => App);
