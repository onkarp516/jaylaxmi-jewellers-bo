import {
  createOperationParameterUrl,
  jobOperationListUrl,
  findOperationParameterUrl,
  updateOperationParameterUrl,
  deleteOperationParameterUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function createOperationParameter(values) {
  return axios({
    url: createOperationParameterUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function jobOperationList() {
  return axios({
    url: jobOperationListUrl(),
    method: "GET",
    headers: getHeader(),
  });
}
export function findOperationParameter(values) {
  return axios({
    url: findOperationParameterUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function updateOperationParameter(values) {
  return axios({
    url: updateOperationParameterUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function deleteOperationParameter(values) {
  return axios({
    url: deleteOperationParameterUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
