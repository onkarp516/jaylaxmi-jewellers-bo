import config from "config";

export function createJobUrl() {
  return `${config.apiUrl}/createJob`;
}

export function DTJobUrl() {
  return `${config.apiUrl}/DTJob`;
}

export function findJobUrl() {
  return `${config.apiUrl}/findJob`;
}

export function updateJobUrl() {
  return `${config.apiUrl}/updateJob`;
}

export function deleteJobUrl() {
  return `${config.apiUrl}/deleteJob`;
}

export function jobListUrl() {
  return `${config.apiUrl}/job-list`;
}

export function getItemReportUrl() {
  return `${config.apiUrl}/getItemReport`;
}

export function getEmployeeSalaryReportUrl() {
  return `${config.apiUrl}/getEmployeeSalaryReport`;
}

export function getEmployeeEarningReportUrl() {
  return `${config.apiUrl}/getEmployeeEarningReport`;
}
