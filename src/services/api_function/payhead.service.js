import {
  createPayheadUrl,
  payheadListUrl,
  updatePayheadUrl,
  findPayheadUrl,
  deletePayheadUrl,
  createMasterPayheadUrl,
  findMasterPayheadUrl,
  get_allowance_listUrl,
  getPayheadListForAllocationUrl

} from "@/services/api";

import { getHeader } from "@/helpers";
import axios from "axios";

export function getPayheadList() {
  return axios({
    url: getPayheadListForAllocationUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_allowance_list() {
  return axios({
    url: get_allowance_listUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createPayhead(values) {
  return axios({
    url: createPayheadUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function payheadList() {
  return axios({
    url: payheadListUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function findPayhead(values) {
  return axios({
    url: findPayheadUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updatePayhead(values) {
  return axios({
    url: updatePayheadUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deletePayhead(values) {
  return axios({
    url: deletePayheadUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function createMasterPayhead(values) {
  return axios({
    url: createMasterPayheadUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function findMasterPayhead(values) {
  return axios({
    url: findMasterPayheadUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
