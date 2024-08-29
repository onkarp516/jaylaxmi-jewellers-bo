import config from "config";

export function createOperationProcedureUrl() {
  return `${config.apiUrl}/createJob`;
}

export function DTOperationProcedureUrl() {
  return `${config.apiUrl}/DTOperationProcedure`;
}

export function findOperationProcedureUrl() {
  return `${config.apiUrl}/findOperationProcedure`;
}

export function updateOperationProcedureUrl() {
  return `${config.apiUrl}/updateOperationProcedure`;
}

export function deleteOperationProcedureUrl() {
  return `${config.apiUrl}/deleteOperationProcedure`;
}


