/*
Loading overlay view component 
*/

import React from "react";
import { StyleSheet, View, Modal, ActivityIndicator } from "react-native";
import { COLORS } from "../styles/theme";

const ActivityLoader = props => {
  return (
    <Modal
      transparent={true}
      animationType={"none"}
      visible={props.loading}
      onRequestClose={() => {}}
    >
      <View style={styles.modalBackground}>
        <ActivityIndicator
          size="large"
          color={COLORS.APP_PRIMARY_COLOR}
          animating={props.loading}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: COLORS.MODAL_BACKGROUND_COLOR
  }
});

export default ActivityLoader;
