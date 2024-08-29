import {
  getUnderListURL,
  getBalancingMethodsURL,
  createLedgerURL,
  getValidateLedgermMasterURL,
  get_outlet_appConfigUrl,
  getLedgersURL,
  deleteledgerUrl,
  getLedgersByIdURL,
  editLedgerURL,
  viewLedgerURL
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function getUnderList() {
  return axios({
    url: getUnderListURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getBalancingMethods() {
  return axios({
    url: getBalancingMethodsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createLedger(requestData) {
  return axios({
    url: createLedgerURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function getValidateLedgermMaster(requestData) {
  return axios({
    url: getValidateLedgermMasterURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getoutletappConfig() {
  return axios({
    url: get_outlet_appConfigUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getLedgers() {
  return axios({
    url: getLedgersURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function delete_ledger(requestData) {
  return axios({
    url: deleteledgerUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getLedgersById(requestData) {
  return axios({
    url: getLedgersByIdURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function editLedger(requestData) {
  return axios({
    url: editLedgerURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function viewLedger(requestData) {
  return axios({
    url: viewLedgerURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}


