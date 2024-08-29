import {
  createJobUrl,
  jobListUrl,
  findJobUrl,
  updateJobUrl,
  deleteJobUrl,
  getItemReportUrl,
  getEmployeeSalaryReportUrl,
  getEmployeeEarningReportUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function createJob(values) {
  return axios({
    url: createJobUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function jobList() {
  return axios({
    url: jobListUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function findJob(values) {
  return axios({
    url: findJobUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateJob(values) {
  return axios({
    url: updateJobUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteJob(values) {
  return axios({
    url: deleteJobUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getItemReport(values) {
  return axios({
    url: getItemReportUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getEmployeeSalaryReport(values) {
  return axios({
    url: getEmployeeSalaryReportUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getEmployeeEarningReport(values) {
  return axios({
    url: getEmployeeEarningReportUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
