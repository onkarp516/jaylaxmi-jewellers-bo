import {
    createOperationProcedureUrl,
    OperationProcedureListUrl,
    findOperationProcedureUrl,
    updateOperationProcedureUrl,
    deleteOperationProcedureUrl,
  } from "@/services/api";
  import { getHeader } from "@/helpers";
  import axios from "axios";
  
  export function createOperationProcedure(values) {
    return axios({
      url: createOperationProcedureUrl(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
  
  export function OperationProcedureList() {
    return axios({
      url: OperationProcedureListUrl(),
      method: "GET",
      headers: getHeader(),
    });
  }
  
  export function findOperationProcedure(values) {
    return axios({
      url: findOperationProcedureUrl(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
  
  export function updateOperationProcedure(values) {
    return axios({
      url: updateOperationProcedureUrl(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
  
  export function deleteJob(values) {
    return axios({
      url: deleteJobUrl(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
  