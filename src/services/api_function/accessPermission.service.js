import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createUserRolesURL,
  getSysActionsURL,
  getSysAllPermissionsURL,
  getRoleActionURL,
  getRolePermissionsURL,
  createUserWithRolesURL,
  getUserPermissionURL,
  getUserByIdURL,
  getRolePermissionsForEditURL,
  updateRoleURL,
  updateUserURL,
  deleteRoleURL,
  deleteUserURL,
} from "../api";

export function createUserRole(requestData) {
  return axios({
    url: createUserRolesURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSysActions() {
  return axios({
    url: getSysActionsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getSysAllPermissions() {
  return axios({
    url: getSysAllPermissionsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getRoleActions() {
  return axios({
    url: getRoleActionURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getRolePermissions(requestData) {
  return axios({
    url: getRolePermissionsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getRolePermissionsForEdit(requestData) {
  return axios({
    url: getRolePermissionsForEditURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getUserById(requestData) {
  return axios({
    url: getUserByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function createUserWithRoles(requestData) {
  return axios({
    url: createUserWithRolesURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getUserPermission(requestData) {
  return axios({
    url: getUserPermissionURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function updateRole(requestData) {
  return axios({
    url: updateRoleURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function updateUser(requestData) {
  return axios({
    url: updateUserURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function deleteRole(requestData) {
  return axios({
    url: deleteRoleURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function deleteUser(requestData) {
  return axios({
    url: deleteUserURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
