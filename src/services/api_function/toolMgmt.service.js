import {
    createToolMgmtUrl,
    ToolMgmtListUrl,
    findToolMgmtUrl,
    updateToolMgmtUrl,
    deleteToolMgmtUrl,
  } from "@/services/api";
  import { getHeader } from "@/helpers";
  import axios from "axios";
  
  export function createToolMgmt(values) {
    return axios({
      url: createToolMgmtUrl(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
  
  export function ToolMgmtList() {
    return axios({
      url: ToolMgmtListUrl(),
      method: "GET",
      headers: getHeader(),
    });
  }
  
  export function findToolMgmt(values) {
    return axios({
      url: findToolMgmtUrl(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
  
  export function updateToolMgmt(values) {
    return axios({
      url: updateToolMgmtUrl(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
  
  export function deleteToolMgmt(values) {
    return axios({
      url: deleteToolMgmtUrl(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
  