import config from "config";

export function createAllowanceUrl() {
  return `${config.apiUrl}/createAllowance`;
}

export function DTAllowanceUrl() {
  return `${config.apiUrl}/DTAllowance`;
}

export function getAllowanceListUrl() {
  return `${config.apiUrl}/get_allowance_list`;
}

export function updateAllowanceUrl() {
  return `${config.apiUrl}/updateAllowance`;
}

export function deleteAllowanceUrl() {
  return `${config.apiUrl}/deleteAllowance`;
}

export function findAllowanceUrl() {
  return `${config.apiUrl}/findAllowance`;
}
