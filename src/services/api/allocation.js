import config from "config";

export function get_allowance_listUrl() {
  return `${config.apiUrl}/get_allowance_list`;
}

export function get_deduction_listUrl() {
  return `${config.apiUrl}/get_deduction_list`;
}

export function allocateAllowanceDeductionsUrl() {
  return `${config.apiUrl}/allocateAllowanceDeductions`;
}

export function DTAllocationsUrl() {
  return `${config.apiUrl}/DTAllocation`;
}
export function getAllocationListUrl() {
  return `${config.apiUrl}/getAllocationList`;
}

export function findAllocationUrl() {
  return `${config.apiUrl}/findAllocation`;
}

export function updateAllocationUrl() {
  return `${config.apiUrl}/updateAllocation`;
}
export function deleteAllocationUrl() {
  return `${config.apiUrl}/deleteAllocation`;
}






// export function DTActionUrl() {
//   return `${config.apiUrl}/DTAction`;
// }

// export function findActionUrl() {
//   return `${config.apiUrl}/findAction`;
// }

// export function updateActionUrl() {
//   return `${config.apiUrl}/updateAction`;
// }

// export function deleteActionUrl() {
//   return `${config.apiUrl}/deleteAction`;
// }

// export function ActionListUrl() {
//   return `${config.apiUrl}/action-list`;
// }

