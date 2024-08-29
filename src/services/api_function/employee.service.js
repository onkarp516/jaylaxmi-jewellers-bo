import {
  createEmployeeUrl,
  findEmployeeUrl,
  updateEmployeeUrl,
  changeEmployeeStatusUrl,
  jobListUrl,
  getEmployeeAttendanceHistoryUrl,
  getEmployeeYearlyAbsentUrl,
  exportEmployeeAttendanceReportUrl,
  getEmployeeSalaryReportInExcelUrl,
  getEmpSalaryslipUrl,
  getEmpMonthlyPresentyURL,
  searchEmployeeUrl,
  orderByEmployeeUrl,
  recalculateEmpSalaryForMonthUrl,
  create_emp_payrollUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

// create_emp_payroll
export function create_emp_payroll(values) {
  return axios({
    url: create_emp_payrollUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function createEmployee(values) {
  return axios({
    url: createEmployeeUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function searchEmployee(values) {
  return axios({
    url: searchEmployeeUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function findEmployee(values) {
  return axios({
    url: findEmployeeUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateEmployee(values) {
  return axios({
    url: updateEmployeeUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function orderByEmployee(values) {
  return axios({
    url: orderByEmployeeUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function changeEmployeeStatus(values) {
  return axios({
    url: changeEmployeeStatusUrl(),
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

export function getEmployeeAttendanceHistory(values) {
  return axios({
    url: getEmployeeAttendanceHistoryUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getEmpMonthlyPresenty(values) {
  return axios({
    url: getEmpMonthlyPresentyURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function exportEmployeeAttendanceReport(fromDate, toDate, employeeId) {
  return axios({
    url: exportEmployeeAttendanceReportUrl(fromDate, toDate, employeeId),
    method: "GET",
    headers: getHeader(),
  });
}

export function getEmployeeSalaryReportInExcel(employeeId, currentMonth) {
  return axios({
    url: getEmployeeSalaryReportInExcelUrl(employeeId, currentMonth),
    method: "GET",
    headers: getHeader(),
  });
}

export function getEmpSalaryslip(values) {
  return axios({
    url: getEmpSalaryslipUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getEmployeeYearlyAbsent(values) {
  return axios({
    url: getEmployeeYearlyAbsentUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function recalculateEmpSalaryForMonth(values) {
  return axios({
    url: recalculateEmpSalaryForMonthUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

// export function getEmpSalaryslip(values) {
//   return axios({
//     url: getEmpSalaryslipUrl(),
//     method: "POST",
//     headers: getHeader(),
//     data: values,
//   });
// }
