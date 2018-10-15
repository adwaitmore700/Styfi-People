/*
Loading overlay view component 
*/

import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  Text,
  Platform
} from "react-native";
import {COLORS} from '../styles/theme';


const { height, width } = Dimensions.get("window");

class CustomAlert extends Component {
  constructor(props) {
    super(props);
    this.state = { showAlert: this.props.showAlert };
    this.dismissAlert = this.dismissAlert.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showAlert != this.props.showAlert) {
      this.setState({ showAlert: nextProps.showAlert });
    }
  }

  render() {
    return (
      <Modal
        transparent={true}
        animationType={"fade"}
        visible={this.state.showAlert}
        onRequestClose={() => {if(this.props.showTwoButtons){
          this.dismissAlert()
        }}}
      >
        <View style={styles.alertContainer}>
          <View style={styles.alertBox}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertHeaderText}>
                {this.props.errorHeader}
              </Text>
            </View>
            <Text style={styles.alertMessageText}>
              {this.props.errorMessage}
            </Text>
            {this.renderConfirmationButton()}
            <View style={styles.alertFooter}>
              <TouchableOpacity
                key={"actionBtn"}
                opacity={0.7}
                style={styles.actionButton}
                onPress={this.dismissAlert}
              >
                <Text key={"actionBtnText"} style={styles.actionButtonText}>
                  {this.props.actionButtonText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

renderConfirmationButton=()=>{
  if(this.props.showTwoButtons){
    return (
      <View style={styles.alertFooter}>
            <TouchableOpacity
      key={"actionBtn2"}
      opacity={0.7}
      style={styles.actionButton}
      onPress={this.props.onConfirmation}
    >
      <Text key={"actionBtnText2"} style={styles.actionButtonText}>
        {this.props.actionButtonText2}
      </Text>
    </TouchableOpacity>
            </View>
    )
  }
}

  dismissAlert() {
    this.setState({ showAlert: false }, () => {
      this.props.onDismissAlert();
    });
  }
}

const styles = StyleSheet.create({
  alertContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: COLORS.MODAL_BACKGROUND_COLOR
  },
  alertBox: {
    width: width * 0.8,
    backgroundColor: COLORS.WHITE_COLOR,
    borderRadius: 10
  },
  alertHeader: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.APP_PRIMARY_COLOR,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  alertFooter: {
    justifyContent: "space-evenly",
    borderTopWidth: 1,
    borderTopColor: COLORS.SEPERATOR_TERNARY_COLOR
  },
  actionButton: {
    justifyContent: "space-evenly",
    padding: 10
  },
  actionButtonText: {
    color: COLORS.BLACK_COLOR,
    fontSize: 16,
    fontWeight: "400",
    alignSelf: "center",
    fontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular"
  },
  alertHeaderText: {
    fontSize: 20,
    fontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
    alignSelf: "center",
    padding: 10,
    fontWeight: "500",
    color: COLORS.WHITE_COLOR
  },
  alertMessageText: {
    fontSize: 18,
    fontFamily: Platform.OS == 'android' ? "sans-serif":"AvenirNext-Regular",
    paddingVertical: 20,
    paddingHorizontal: 15,
    fontWeight: "400",
    alignSelf: "center",
    color: COLORS.BLACK_COLOR
  }
});

export default CustomAlert;
