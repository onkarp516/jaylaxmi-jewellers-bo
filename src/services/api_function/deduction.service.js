import {
  createDeductionUrl,
  updateDeductionUrl,
  findDeductionUrl,
  deleteDeductionUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function createDeduction(values) {
  return axios({
    url: createDeductionUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateDeduction(values) {
  return axios({
    url: updateDeductionUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function findDeduction(values) {
  return axios({
    url: findDeductionUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteDeduction(values) {
  return axios({
    url: deleteDeductionUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
