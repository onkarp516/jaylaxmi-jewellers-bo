import config from "config";

export function createInstrumentUrl() {
  return `${config.apiUrl}/create_instrument`;
}

export function DTInstrumentUrl() {
  return `${config.apiUrl}/DTInstrument`;
}

export function findInstrumentUrl() {
  return `${config.apiUrl}/findInstrument`;
}

export function updateInstrumentUrl() {
  return `${config.apiUrl}/updateInstrument`;
}

export function deleteInstrumentUrl() {
  return `${config.apiUrl}/deleteInstrument`;
}

export function InstrumentListUrl() {
  return `${config.apiUrl}/instrument-list`;
}

