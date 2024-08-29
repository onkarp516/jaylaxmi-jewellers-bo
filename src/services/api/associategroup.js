import config from "config";

export function createAssociateGroupURL() {
  return `${config.apiUrl}/create_associate_groups`;
}

export function getAssociateGroupsURL() {
  return `${config.apiUrl}/get_associate_groups`;
}

export function delete_ledger_groupURL() {
  return `${config.apiUrl}/delete_ledger_group`;
}

export function updateAssociateGroupURL() {
  return `${config.apiUrl}/edit_associate_groups`;
}

export function DTAssociateGroupsURL() {
  return `${config.apiUrl}/DTAssociateGroups`;
}
