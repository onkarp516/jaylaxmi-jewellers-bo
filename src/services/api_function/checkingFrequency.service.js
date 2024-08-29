import {
  createCheckingFrequencyUrl,
  checkingFrequencyListUrl,
  findCheckingFrequencyUrl,
  updateCheckingFrequencyUrl,
  deleteCheckingFrequencyUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function createCheckingFrequency(values) {
  return axios({
    url: createCheckingFrequencyUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function CheckingFrequencyList() {
  return axios({
    url: checkingFrequencyListUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function findCheckingFrequency(values) {
  return axios({
    url: findCheckingFrequencyUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateCheckingFrequency(values) {
  return axios({
    url: updateCheckingFrequencyUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteCheckingFrequency(values) {
  return axios({
    url: deleteCheckingFrequencyUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
