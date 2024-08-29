import {
  DTEmployeeLeaveUrl,
  updateEmployeeLeaveStatusUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function DTEmployeeLeave(values) {
  return axios({
    url: DTEmployeeLeaveUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateEmployeeLeaveStatus(values) {
  return axios({
    url: updateEmployeeLeaveStatusUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
