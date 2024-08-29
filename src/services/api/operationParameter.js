import config from "config";

export function createOperationParameterUrl() {
  return `${config.apiUrl}/createOperationParameter`;
}
export function DTJobOperationUrl() {
  return `${config.apiUrl}/getAllJob`;
}
export function jobListUrl() {
  return `${config.apiUrl}/job-list`;
}
export function DTOperationParameterUrl() {
  return `${config.apiUrl}/DTOperationParameter`;
}
export function findOperationParameterUrl() {
  return `${config.apiUrl}/findOperationParameter`;
}
export function updateOperationParameterUrl() {
  return `${config.apiUrl}/updateOperationParameter`;
}

export function deleteOperationParameterUrl() {
  return `${config.apiUrl}/deleteOperationParameter`;
}
