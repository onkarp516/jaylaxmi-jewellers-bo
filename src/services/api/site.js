import config from "config";

export function createSiteUrl() {
  return `${config.apiUrl}/createSite`;
}

export function DTSiteUrl() {
  return `${config.apiUrl}/DTSite`;
}

export function findSiteUrl() {
  return `${config.apiUrl}/findSite`;
}

export function updateSiteUrl() {
  return `${config.apiUrl}/updateSite`;
}

export function changeSiteStatusUrl() {
  return `${config.apiUrl}/changeSiteStatus`;
}

export function listOfSitesUrl() {
  return `${config.apiUrl}/listOfSites`;
}
