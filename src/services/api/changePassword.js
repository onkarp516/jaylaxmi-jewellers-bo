import config from "config";

export function changePasswordUrl() {
  return `${config.apiUrl}/change-password`;
}
