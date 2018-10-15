const BASE_URL = "https://service.styfi.in/people/v1/employee";//"http://service.lightbuzz.in/people/v1/employee";

export const ApiEndPoints = {
  LOGIN_API: `${BASE_URL}/login`,
  GET_HOLIDAY_LIST_API: `${BASE_URL}/holidaylist`,
  GET_EMPLOYEE_LEAVE_STATISTICS_API: `${BASE_URL}/leave_stats`,
  GET_EMPLOYEE_LEAVE_RECORD_API: `${BASE_URL}/leave_record`,
  EMPLOYEE_LEAVE_APPLICATION_API: `${BASE_URL}/leave_application`,
  GET_EMPLOYEE_ATTENDANCE_WORK_HOURS: `${BASE_URL}/work_hours?`,
  GET_EMPLOYEE_ATTENDANCE: `${BASE_URL}/attendance?`
};

export const ResponseErrors = {
  OK: "OK",
  NOK: "NOK",
  NO_DATA_FOUND: "NO_DATA_FOUND",
  ERROR_WHILE_RETRIEVING_DATA: "ERROR_WHILE_RETRIEVING_DATA",
  SUCCESSFUL_DATA_OPERATION: "SUCCESSFUL_DATA_OPERATION",
  NO_INTERNET_CONNECTION:"NO_INTERNET_CONNECTION"
};

export const HttpResponseErrors = {
  OK:200,
  CREATED:201,
  BAD_REQUEST:400,
  UNAUTHORIZED:401,
  FORBIDDEN:403,
  NOT_FOUND:404,
  METHOD_NOT_ALLOWED:405,
  DUPLICATE_ENTRY:409
};

