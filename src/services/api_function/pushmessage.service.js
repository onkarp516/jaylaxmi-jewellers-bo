import {
  createPushMessageUrl,
  updatePushMessageUrl,
  findPushMessageUrl,
  deletePushMessageUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function createPushMessage(values) {
  return axios({
    url: createPushMessageUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function findPushMessage(values) {
  return axios({
    url: findPushMessageUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updatePushMessage(values) {
  return axios({
    url: updatePushMessageUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deletePushMessage(values) {
  return axios({
    url: deletePushMessageUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
