import {
  createLeaveTypeUrl,
  findLeaveTypeUrl,
  updateLeaveTypeUrl,
  deleteLeaveTypeUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function createLeaveType(values) {
  return axios({
    url: createLeaveTypeUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function findLeaveType(values) {
  return axios({
    url: findLeaveTypeUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateLeaveType(values) {
  return axios({
    url: updateLeaveTypeUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteLeaveType(values) {
  return axios({
    url: deleteLeaveTypeUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
