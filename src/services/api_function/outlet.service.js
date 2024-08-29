import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createCompanyURL,
  getCompanyURL,
  getCompanyByIdURL,
  getGSTTypesURL,
  updateCompanyURL,
  get_outlets_by_branchURL,
  get_outlets_from_branchURL,
} from "../api";

export function createCompany(requestData) {
  return axios({
    url: createCompanyURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function updateCompany(requestData) {
  return axios({
    url: updateCompanyURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getCompanyById(requestData) {
  return axios({
    url: getCompanyByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getCompany() {
  return axios({
    url: getCompanyURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getGSTTypes() {
  return axios({
    url: getGSTTypesURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_outlets_by_branch(requestData) {
  return axios({
    url: get_outlets_by_branchURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_outlets_from_branch(requestData) {
  return axios({
    url: get_outlets_from_branchURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
