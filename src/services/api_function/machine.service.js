import {
  createMachineUrl,
  findMachineUrl,
  deleteMachineUrl,
  updateMachineUrl,
  listOfMachineUrl,
  getMachineReportUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function createMachine(values) {
  return axios({
    url: createMachineUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function findMachine(values) {
  return axios({
    url: findMachineUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteMachine(values) {
  return axios({
    url: deleteMachineUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateMachine(values) {
  return axios({
    url: updateMachineUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function listOfMachine() {
  return axios({
    url: listOfMachineUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getMachineReport(values) {
  return axios({
    url: getMachineReportUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
