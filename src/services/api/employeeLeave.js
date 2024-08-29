import config from "config";

export function DTEmployeeLeaveUrl() {
  return `${config.apiUrl}/DTEmployeeLeaves`;
}

export function updateEmployeeLeaveStatusUrl() {
  return `${config.apiUrl}/updateEmployeeLeaveStatus`;
}
