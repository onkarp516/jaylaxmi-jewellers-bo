import config from "config";

export function createPushMessageUrl() {
  return `${config.apiUrl}/createPushMessage`;
}
export function DTPushMessageUrl() {
  return `${config.apiUrl}/DTPushMessage`;
}
export function updatePushMessageUrl() {
  return `${config.apiUrl}/updatePushMessage`;
}

export function deletePushMessageUrl() {
  return `${config.apiUrl}/deletePushMessage`;
}

export function findPushMessageUrl() {
  return `${config.apiUrl}/findPushMessage`;
}
