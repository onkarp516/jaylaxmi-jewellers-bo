import {
  createSiteUrl,
  findSiteUrl,
  updateSiteUrl,
  changeSiteStatusUrl,
  listOfSitesUrl,
} from "@/services/api";

import { getHeader } from "@/helpers";
import axios from "axios";

export function createSite(requestData) {
  return axios({
    url: createSiteUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function findSite(values) {
  return axios({
    url: findSiteUrl(values),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateSite(requestData) {
  return axios({
    url: updateSiteUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function changeSiteStatus(requestData) {
  return axios({
    url: changeSiteStatusUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function listOfSites() {
  return axios({
    url: listOfSitesUrl(),
    method: "GET",
    headers: getHeader(),
  });
}
