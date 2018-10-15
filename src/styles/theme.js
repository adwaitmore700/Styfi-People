import { StyleSheet, Dimensions,Platform } from "react-native";
const { width } = Dimensions.get("window");

export const COLORS = {
  APP_PRIMARY_COLOR: "#2366EA",
  MODAL_BACKGROUND_COLOR: "#00000070",
  WHITE_COLOR: "#FFFFFF",
  BLACK_COLOR: "#000000",
  PAGE_BACKGROUND_COLOR: "#F1F1F1",
  TEXT_PLACEHOLDER_COLOR: "#676767",
  TEXT_MEDIUM_COLOR: "#7C7C7C",
  TEXT_DARK_COLOR: "#212121",
  CALENDAR_SECONDARY_COLOR: "#96999B",
  SEPERATOR_PRIMARY_COLOR: "#E1E1E1",
  SEPERATOR_SECONDARY_COLOR: "#E2E2E2",
  SEPERATOR_TERNARY_COLOR: "#E0E0E0",
  TABLE_HEADER_BACKGROUND_COLOR: "#D4D4D4",
  GREEN_COLOR: "#008000",
  RED_COLOR: "#FF0000",
  TRANSPARENT_COLOR: "transparent",
  HOLIDAY_STATUS_COLOR: "#A208A3", //"#00ADCC",
  LEAVE_STATUS_COLOR: "#FF0000", //"#00A591",
  WORKING_DAY_STATUS_COLOR: "#0076A4", //"#D2691E",
  ABSENT_DAY_STATUS_COLOR: "#FF0000",
  LEAVE_APPROVED_COLOR: "#7DBF17", //"#008000",
  LEAVE_PENDING_COLOR: "#FEA600", //"#FFA500",
  LEAVE_REJECTED_COLOR: "#FF0000"
};

export const APP_PAGE_CONTAINER = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.PAGE_BACKGROUND_COLOR
  }
});

export const TABLE_STYLE = StyleSheet.create({
  HEADER_TEXT_FONT: {
    fontSize: 14,
    fontFamily: Platform.OS == 'android' ? "sans-serif-medium": 'AvenirNext-Regular',
    color: COLORS.BLACK_COLOR
  }
});

export const CALENDAR_STYLE = StyleSheet.create({
  CALENDAR: {
    marginBottom: 15,
    borderRadius: 6,
    minHeight: 300,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  CALENDAR_MONTH_LABEL_CONTAINER: {
    backgroundColor: COLORS.WHITE_COLOR,
    justifyContent: "center",
    alignItems: "center",
    width: width - 30,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomColor: COLORS.TEXT_PLACEHOLDER_COLOR,
    borderBottomWidth: 0,
    height: 40
  },
  CALENDAR_MONTH_LABEL: {
    fontSize: 18,
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
    fontFamily: Platform.OS == 'android' ? "sans-serif-medium": 'AvenirNext-Regular',
    color: COLORS.BLACK_COLOR
  }
});
