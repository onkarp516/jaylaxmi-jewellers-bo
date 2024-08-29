import config from "config";

export function createJobOperationUrl() {
  return `${config.apiUrl}/createJobOperation`;
}
export function createNewJobOperationUrl() {
  return `${config.apiUrl}/createNewJobOperation`;
}

export function DTJobOperationUrl() {
  return `${config.apiUrl}/DTJobOperation`;
}

export function findJobOperationUrl() {
  return `${config.apiUrl}/findJobOperation`;
}

export function updateJobOperationUrl() {
  return `${config.apiUrl}/updateJobOperation`;
}

export function deleteJobOperationUrl() {
  return `${config.apiUrl}/deleteJobOperation`;
}

export function listOfJobsForSelectUrl() {
  return `${config.apiUrl}/listOfJobsForSelect`;
}

export function jobOperationListUrl() {
  return `${config.apiUrl}/jobOperation-list`;
}

export function listJobOperationUrl() {
  return `${config.apiUrl}/listJobOperation`;
}

export function deleteProcedureSheetUrl() {
  return `${config.apiUrl}/deleteProcedureSheet`;
}

export function deleteDrawingSheetUrl() {
  return `${config.apiUrl}/deleteDrawingSheet`;
}
