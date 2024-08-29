import config from "config";

export function createMachineUrl() {
  return `${config.apiUrl}/createMachine`;
}

export function DTMachineUrl() {
  return `${config.apiUrl}/DTMachine`;
}

export function deleteMachineUrl() {
  return `${config.apiUrl}/deleteMachine`;
}

export function updateMachineUrl() {
  return `${config.apiUrl}/updateMachine`;
}

export function findMachineUrl() {
  return `${config.apiUrl}/findMachine`;
}

export function listOfMachineUrl() {
  return `${config.apiUrl}/machineListForSelection`;
}

export function getMachineReportUrl() {
  return `${config.apiUrl}/getMachineReport`;
}
