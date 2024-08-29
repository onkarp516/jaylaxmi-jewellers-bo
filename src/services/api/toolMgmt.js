import config from "config";

export function createToolMgmtUrl() {
  return `${config.apiUrl}/create_tool_mgmt`;
}

export function DTToolMgmtUrl() {
  return `${config.apiUrl}/DTToolMgmt`;
}

export function findToolMgmtUrl() {
  return `${config.apiUrl}/findToolMgmt`;
}

export function updateToolMgmtUrl() {
  return `${config.apiUrl}/updateToolMgmt`;
}

export function deleteToolMgmtUrl() {
  return `${config.apiUrl}/deleteToolMgmt`;
}

export function ToolMgmtListUrl() {
  return `${config.apiUrl}/toolMgmt-list`;
}
