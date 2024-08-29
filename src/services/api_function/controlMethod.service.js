import {
  createControlMethodUrl,
  controlMethodListUrl,
  findControlMethodUrl,
  updateControlMethodUrl,
  deleteControlMethodUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function createControlMethod(values) {
  return axios({
    url: createControlMethodUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function ControlMethodList() {
  return axios({
    url: controlMethodListUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function findControlMethod(values) {
  return axios({
    url: findControlMethodUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateControlMethod(values) {
  return axios({
    url: updateControlMethodUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteControlMethod(values) {
  return axios({
    url: deleteControlMethodUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
