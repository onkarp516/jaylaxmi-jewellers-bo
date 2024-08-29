import {
  createAllowanceUrl,
  updateAllowanceUrl,
  deleteAllowanceUrl,
  findAllowanceUrl,
  getAllowanceListUrl
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function createAllowance(values) {
  return axios({
    url: createAllowanceUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateAllowance(values) {
  return axios({
    url: updateAllowanceUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteAllowance(values) {
  return axios({
    url: deleteAllowanceUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function findAllowance(values) {
  return axios({
    url: findAllowanceUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}


export function getAllowanceList() {
  return axios({
    url: getAllowanceListUrl(),
    method: "GET",
    headers: getHeader(),
  });
}