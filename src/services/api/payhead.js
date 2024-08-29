import config from "config";

export function getPayheadListForAllocationUrl() {
  return `${config.apiUrl}/get_payhead_list`;
}

export function createPayheadUrl() {
  return `${config.apiUrl}/createPayhead`;
}

export function DTPayheadUrl() {
  return `${config.apiUrl}/DTPayhead`;
}

export function payheadListUrl() {
  return `${config.apiUrl}/payheadList`;
}

export function findPayheadUrl() {
  return `${config.apiUrl}/findPayhead`;
}

export function updatePayheadUrl() {
  return `${config.apiUrl}/updatePayhead`;
}

export function deletePayheadUrl() {
  return `${config.apiUrl}/deletePayhead`;
}

export function createMasterPayheadUrl() {
  return `${config.apiUrl}/createMasterPayhead`;
}

export function DTMasterPayheadUrl() {
  return `${config.apiUrl}/DTMasterPayhead`;
}

export function findMasterPayheadUrl() {
  return `${config.apiUrl}/findMasterPayhead`;
}
