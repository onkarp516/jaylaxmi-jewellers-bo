import config from "config";

export function getDashboardDataUrl() {
  return `${config.apiUrl}/getDashboardStatistics`;
}
