import config from "config";
import { updateControlMethodUrl } from "./controlMethod";

export function createUserRolesURL() {
  return `${config.apiUrl}/register_role`;
}

export function getSysActionsURL() {
  return `${config.apiUrl}/get_master_actions`;
}

export function getSysAllPermissionsURL() {
  return `${config.apiUrl}/get_systems_all_permissions`;
}

export function getRoleActionURL() {
  return `${config.apiUrl}/get_all_roles`;
}

export function getRolePermissionsURL() {
  return `${config.apiUrl}/get_role_by_id`;
}

export function getRolePermissionsForEditURL() {
  return `${config.apiUrl}/get_role_by_id_for_edit`;
}

export function getUserByIdURL() {
  return `${config.apiUrl}/get_user_by_id`;
}

export function createUserWithRolesURL() {
  return `${config.apiUrl}/add_bo_user_with_roles`;
}

export function getUserPermissionURL() {
  return `${config.apiUrl}/get_user_permissions`;
}

export function DTRolesUrl() {
  return `${config.apiUrl}/DTRole`;
}

export function DTUsersUrl() {
  return `${config.apiUrl}/DTUser`;
}

export function updateRoleURL() {
  return `${config.apiUrl}/update_role`;
}

export function updateUserURL() {
  return `${config.apiUrl}/updateUser`;
}

export function deleteRoleURL() {
  return `${config.apiUrl}/remove_role`;
}

export function deleteUserURL() {
  return `${config.apiUrl}/activate_deactivate_employee`;
}
