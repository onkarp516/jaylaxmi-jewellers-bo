import {
  createInstituteURL,
  getListOfInstitutesURL,
  getInstituteURL,
  deleteInstituteUrl,
  updateInstituteUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function createInstitute(values) {
  return axios({
    url: createInstituteURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getListOfInstitutes() {
  return axios({
    url: getListOfInstitutesURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getInstitute(values) {
  return axios({
    url: getInstituteURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteInstitute(values) {
  return axios({
    url: deleteInstituteUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateInstitute(values) {
  return axios({
    url: updateInstituteUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
