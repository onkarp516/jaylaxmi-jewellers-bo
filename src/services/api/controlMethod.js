import config from "config";

export function createControlMethodUrl() {
  return `${config.apiUrl}/createControlMethod`;
}

export function DTControlMethodUrl() {
  return `${config.apiUrl}/DTControlMethod`;
}

export function findControlMethodUrl() {
  return `${config.apiUrl}/findControlMethod`;
}

export function updateControlMethodUrl() {
  return `${config.apiUrl}/updateControlMethod`;
}

export function deleteControlMethodUrl() {
  return `${config.apiUrl}/deleteControlMethod`;
}

export function controlMethodListUrl() {
  return `${config.apiUrl}/controlmethod-list`;
}
