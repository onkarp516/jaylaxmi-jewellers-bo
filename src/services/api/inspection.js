import config from "config";

export function createLineInspectionUrl() {
  return `${config.apiUrl}/createLineInspection`;
}
export function DTLineInspectionUrl() {
  return `${config.apiUrl}/DTLineInspection`;
}

export function deleteLineInspectionUrl() {
  return `${config.apiUrl}/deleteLineInspection`;
}
export function findLineInspectionUrl() {
  return `${config.apiUrl}/findLineInspection`;
}
export function updateLineInspectionUrl() {
  return `${config.apiUrl}/updateLineInspection`;
}

export function getLineInspectionListWithFilterUrl() {
  return `${config.apiUrl}/bo/getLineInspectionListWithFilter`;
}

export function exportExcelEmployeeInspectionUrl() {
  return `${config.apiUrl}/bo/exportExcelEmployeeInspection`;
}

export function getFinalLineInspectionListWithFilterUrl() {
  return `${config.apiUrl}/bo/getFinalLineInspectionListWithFilter`;
}

export function exportExcelFinalEmployeeInspectionUrl() {
  return `${config.apiUrl}/bo/exportExcelFinalEmployeeInspection`;
}

export function getMachineListFromInspectionDataUrl() {
  return `${config.apiUrl}/bo/getMachineListFromInspectionData`;
}

export function getJobListFromInspectionDataUrl() {
  return `${config.apiUrl}/bo/getJobListFromInspectionData`;
}

export function getJobOperationListFromInspectionDataUrl() {
  return `${config.apiUrl}/bo/getJobOperationListFromInspectionData`;
}

export function getEmployeeListFromInspectionDataUrl() {
  return `${config.apiUrl}/bo/getEmployeeListFromInspectionData`;
}
