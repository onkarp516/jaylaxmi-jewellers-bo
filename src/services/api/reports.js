import config from "config";

export function getRejectionReportsUrl() {
  return `${config.apiUrl}/bo/getRejectionReports`;
}
