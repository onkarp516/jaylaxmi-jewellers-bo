import {
  createShiftUrl,
  findShiftUrl,
  updateShiftUrl,
  deleteShiftUrl,
  listOfShiftsUrl,
  listOfEmployeeUrl,
  shiftAssignToEmployeeUrl,
  getShiftWiseAttendanceUrl,
  employeeWiseShiftAssignUrl,
  getNonShiftEmployeeUrl,
  deleteEmployeeShiftAssignUrl,
  updateEmployeeShiftUrl,
  findEmployeeShiftUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function createShift(values) {
  return axios({
    url: createShiftUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function findEmployeeShift(values) {
  return axios({
    url: findEmployeeShiftUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function updateEmployeeShift(values) {
  return axios({
    url: updateEmployeeShiftUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function deleteEmployeeShiftAssign(values) {
  return axios({
    url: deleteEmployeeShiftAssignUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getNonShiftEmployee(values) {
  return axios({
    url: getNonShiftEmployeeUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function findShift(values) {
  return axios({
    url: findShiftUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateShift(values) {
  return axios({
    url: updateShiftUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteShift(values) {
  return axios({
    url: deleteShiftUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function listOfShifts() {
  return axios({
    url: listOfShiftsUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function listOfEmployee() {
  return axios({
    url: listOfEmployeeUrl(),
    method: "GET",
    headers: getHeader(),
  });
}
export function shiftAssignToEmployee(values) {
  return axios({
    url: shiftAssignToEmployeeUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getShiftWiseAttendance(values) {
  return axios({
    url: getShiftWiseAttendanceUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function employeeWiseShiftAssign(values) {
  return axios({
    url: employeeWiseShiftAssignUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
