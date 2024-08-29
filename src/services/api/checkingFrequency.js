import config from "config";

export function createCheckingFrequencyUrl() {
  return `${config.apiUrl}/createCheckingFrequency`;
}

export function DTCheckingFrequencyUrl() {
  return `${config.apiUrl}/DTCheckingFrequency`;
}

export function findCheckingFrequencyUrl() {
  return `${config.apiUrl}/findCheckingFrequency`;
}

export function updateCheckingFrequencyUrl() {
  return `${config.apiUrl}/updateCheckingFrequency`;
}

export function deleteCheckingFrequencyUrl() {
  return `${config.apiUrl}/deleteCheckingFrequency`;
}

export function checkingFrequencyListUrl() {
  return `${config.apiUrl}/checkingfrequency-list`;
}
