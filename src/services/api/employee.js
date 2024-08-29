import config from "config";

export function createEmployeeUrl() {
  return `${config.apiUrl}/createEmployee`;
}

export function DTEmployeeUrl() {
  return `${config.apiUrl}/DTEmployee`;
}

export function findEmployeeUrl() {
  return `${config.apiUrl}/findEmployee`;
}

export function updateEmployeeUrl() {
  return `${config.apiUrl}/updateEmployee`;
}

export function changeEmployeeStatusUrl() {
  return `${config.apiUrl}/changeEmployeeStatus`;
}

export function jobListUrl() {
  return `${config.apiUrl}/job-list`;
}

export function getEmployeeAttendanceHistoryUrl() {
  return `${config.apiUrl}/getEmployeeAttendanceHistory`;
}

export function getEmpMonthlyPresentyURL() {
  return `${config.apiUrl}/getEmpMonthlyPresenty`;
}

export function exportEmployeeAttendanceReportUrl(
  fromDate,
  toDate,
  employeeId
) { 
  return `${config.apiUrl}/exportEmployeeAttendanceReport/${fromDate}/${toDate}/${employeeId}`;
}

export function getEmployeeSalaryReportInExcelUrl(
  employeeId,
  currentMonth
) { 
  return `${config.apiUrl}/getEmployeeSalaryReportInExcel/${employeeId}/${currentMonth}`;
}

export function getExcelEmployeePaymentSheetUrl(month, companyId) {
  return `${config.apiUrl}/bo/getExcelEmployeePaymentSheet/${month}/${companyId}`;
}

export function downloadReceiptUrl() {
  return `${config.apiUrl}/downloadReceipt`;
}

// export function getEmpSalaryslipUrl() {
//   return `${config.apiUrl}/getEmpSalaryslip`;
// }
export function getEmpSalaryslipUrl() {
  return `${config.apiUrl}/get_emp_salary_data_with_ledgers`;
}

export function searchEmployeeUrl() {
  return `${config.apiUrl}/searchEmployee`;
}
export function orderByEmployeeUrl() {
  return `${config.apiUrl}/orderByEmployee`;
}

export function recalculateEmpSalaryForMonthUrl() {
  return `${config.apiUrl}/recalculateEmpSalaryForMonth`;
}

export function getEmployeeYearlyAbsentUrl() {
  return `${config.apiUrl}/getEmployeeYearlyAbsent`;
}
export function create_emp_payrollUrl() {
  return `${config.apiUrl}/create_emp_payroll`;
}

// export function getEmpSalaryslipUrl() {
//   return `${config.apiUrl}/get_emp_salary_data_with_ledgers`;
// }