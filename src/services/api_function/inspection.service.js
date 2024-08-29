import {
  createLineInspectionUrl,
  deleteLineInspectionUrl,
  findLineInspectionUrl,
  updateLineInspectionUrl,
  getLineInspectionListWithFilterUrl,
  exportExcelEmployeeInspectionUrl,
  getMachineListFromInspectionDataUrl,
  getJobListFromInspectionDataUrl,
  getJobOperationListFromInspectionDataUrl,
  getEmployeeListFromInspectionDataUrl,
  getFinalLineInspectionListWithFilterUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";
// import { findLineInspectionUrl } from "../api/inspection";

export function createLineInspection(values) {
  return axios({
    url: createLineInspectionUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function deleteLineInspection(values) {
  return axios({
    url: deleteLineInspectionUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function findLineInspection(values) {
  return axios({
    url: findLineInspectionUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function updateLineInspection(values) {
  return axios({
    url: updateLineInspectionUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getLineInspectionListWithFilter(values) {
  return axios({
    url: getLineInspectionListWithFilterUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function exportExcelEmployeeInspection(values) {
  return axios({
    url: exportExcelEmployeeInspectionUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getMachineListFromInspectionData(values) {
  return axios({
    url: getMachineListFromInspectionDataUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getJobListFromInspectionData(values) {
  return axios({
    url: getJobListFromInspectionDataUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getJobOperationListFromInspectionData(values) {
  return axios({
    url: getJobOperationListFromInspectionDataUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getEmployeeListFromInspectionData(values) {
  return axios({
    url: getEmployeeListFromInspectionDataUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getFinalLineInspectionListWithFilter(values) {
  return axios({
    url: getFinalLineInspectionListWithFilterUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
