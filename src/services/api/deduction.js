import config from "config";

export function DTDeductionUrl() {
  return `${config.apiUrl}/DTDeduction`;
}

export function createDeductionUrl() {
  return `${config.apiUrl}/createDeduction`;
}

export function findDeductionUrl() {
  return `${config.apiUrl}/findDeduction`;
}

export function updateDeductionUrl() {
  return `${config.apiUrl}/updateDeduction`;
}

export function deleteDeductionUrl() {
  return `${config.apiUrl}/deleteDeduction`;
}
