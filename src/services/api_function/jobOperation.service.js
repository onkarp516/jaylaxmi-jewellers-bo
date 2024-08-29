import {
  createJobOperationUrl,
  findJobOperationUrl,
  updateJobOperationUrl,
  deleteJobOperationUrl,
  listOfJobsForSelectUrl,
  jobOperationListUrl,
  listJobOperationUrl,
  createNewJobOperationUrl,
  deleteProcedureSheetUrl,
  deleteDrawingSheetUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function createJobOperation(values) {
  return axios({
    url: createJobOperationUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function createNewJobOperation(values) {
  return axios({
    url: createNewJobOperationUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function findJobOperation(values) {
  return axios({
    url: findJobOperationUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateJobOperation(values) {
  return axios({
    url: updateJobOperationUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteJobOperation(values) {
  return axios({
    url: deleteJobOperationUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function listOfJobsForSelect() {
  return axios({
    url: listOfJobsForSelectUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function jobOperationList() {
  return axios({
    url: jobOperationListUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function listJobOperation(values) {
  return axios({
    url: listJobOperationUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteProcedureSheet(values) {
  return axios({
    url: deleteProcedureSheetUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteDrawingSheet(values) {
  return axios({
    url: deleteDrawingSheetUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
