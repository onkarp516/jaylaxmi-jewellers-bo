import config from "config";

export function get_sundry_debtors_indirect_incomes_URL() {
  return `${config.apiUrl}/get_sundry_debtors_indirect_incomes`;
}

export function get_employee_id_by_ledger_id_URL() {
  return `${config.apiUrl}/get_employee_id_by_ledger_id`;
}

export function get_salary_data_by_id_URL() {
  return `${config.apiUrl}/get_salary_data_by_id`;
}
