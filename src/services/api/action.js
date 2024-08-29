import config from "config";

export function createActionUrl() {
  return `${config.apiUrl}/create_action`;
}

export function DTActionUrl() {
  return `${config.apiUrl}/DTAction`;
}

export function findActionUrl() {
  return `${config.apiUrl}/findAction`;
}

export function updateActionUrl() {
  return `${config.apiUrl}/updateAction`;
}

export function deleteActionUrl() {
  return `${config.apiUrl}/deleteAction`;
}

export function ActionListUrl() {
  return `${config.apiUrl}/action-list`;
}

