import config from "config";

export function createShiftUrl() {
  return `${config.apiUrl}/createShift`;
}

export function DTShiftsUrl() {
  return `${config.apiUrl}/DTShift`;
}

export function findShiftUrl() {
  return `${config.apiUrl}/findShift`;
}

export function updateShiftUrl() {
  return `${config.apiUrl}/updateShift`;
}

export function deleteShiftUrl() {
  return `${config.apiUrl}/deleteShift`;
}

export function listOfShiftsUrl() {
  return `${config.apiUrl}/listOfShifts`;
}
export function listOfEmployeeUrl() {
  return `${config.apiUrl}/listOfEmployee`;
}
export function shiftAssignToEmployeeUrl() {
  return `${config.apiUrl}/shiftAssignToEmployee`;
}

export function getShiftWiseAttendanceUrl() {
  return `${config.apiUrl}/getShiftWiseAttendance`;
}

export function employeeWiseShiftAssignUrl() {
  return `${config.apiUrl}/employeeWiseShiftAssign`;
}

export function DTShiftAssignUrl() {
  return `${config.apiUrl}/DTShiftAssign`;
}
export function getNonShiftEmployeeUrl() {
  return `${config.apiUrl}/getNonShiftEmployee`;
}

export function deleteEmployeeShiftAssignUrl() {
  return `${config.apiUrl}/deleteEmployeeShiftAssign`;
}
export function updateEmployeeShiftUrl() {
  return `${config.apiUrl}/updateEmployeeShift`;
}
export function findEmployeeShiftUrl() {
  return `${config.apiUrl}/findEmployeeShift`;
}
