import config from "config";

export function createLeaveTypeUrl() {
  return `${config.apiUrl}/createLeaveType`;
}

export function DTLeaveTypeUrl() {
  return `${config.apiUrl}/DTLeaveType`;
}

export function findLeaveTypeUrl() {
  return `${config.apiUrl}/findLeaveType`;
}

export function updateLeaveTypeUrl() {
  return `${config.apiUrl}/updateLeaveType`;
}

export function deleteLeaveTypeUrl() {
  return `${config.apiUrl}/deleteLeaveType`;
}
