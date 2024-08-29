import {
  createActionUrl,
  ActionListUrl,
  findActionUrl,
  updateActionUrl,
  deleteActionUrl,
  get_allowance_listUrl,
  get_deduction_listUrl,
  allocateAllowanceDeductionsUrl,
  getAllocationListUrl,
  findAllocationUrl,
  updateAllocationUrl,
  deleteAllocationUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

// export function createAction(values) {
//   return axios({
//     url: createActionUrl(),
//     method: "POST",
//     headers: getHeader(),
//     data: values,
//   });
// }



export function deleteAllocation(values) {
  return axios({
    url: deleteAllocationUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}


export function updateAllocation(values) {
  return axios({
    url: updateAllocationUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function findAllocation(values) {
  return axios({
    url: findAllocationUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function get_allowance_list() {
  return axios({
    url: get_allowance_listUrl(),
    method: "GET",
    headers: getHeader(),
  });
}
export function get_deduction_list() {
  return axios({
    url: get_deduction_listUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function allocateAllowanceDeductions(values) {
  return axios({
    url: allocateAllowanceDeductionsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getAllocationList(values) {
  return axios({
    url: getAllocationListUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}





// export function findAction(values) {
//   return axios({
//     url: findActionUrl(),
//     method: "POST",
//     headers: getHeader(),
//     data: values,
//   });
// }

// export function updateAction(values) {
//   return axios({
//     url: updateActionUrl(),
//     method: "POST",
//     headers: getHeader(),
//     data: values,
//   });
// }

// export function deleteAction(values) {
//   return axios({
//     url: deleteActionUrl(),
//     method: "POST",
//     headers: getHeader(),
//     data: values,
//   });
// }
