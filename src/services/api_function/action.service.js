import {
  createActionUrl,
  ActionListUrl,
  findActionUrl,
  updateActionUrl,
  deleteActionUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function createAction(values) {
  return axios({
    url: createActionUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function ActionList() {
  return axios({
    url: ActionListUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function findAction(values) {
  return axios({
    url: findActionUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateAction(values) {
  return axios({
    url: updateActionUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteAction(values) {
  return axios({
    url: deleteActionUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
