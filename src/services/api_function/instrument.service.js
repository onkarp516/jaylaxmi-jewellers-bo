import {
    createInstrumentUrl,
    InstrumentListUrl,
    findInstrumentUrl,
    updateInstrumentUrl,
    deleteInstrumentUrl,
  } from "@/services/api";
  import { getHeader } from "@/helpers";
  import axios from "axios";
  
  export function createInstrument(values) {
    return axios({
      url: createInstrumentUrl(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
  
  export function InstrumentList() {
    return axios({
      url: InstrumentListUrl(),
      method: "GET",
      headers: getHeader(),
    });
  }
  
  export function findInstrument(values) {
    return axios({
      url: findInstrumentUrl(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
  
  export function updateInstrument(values) {
    return axios({
      url: updateInstrumentUrl(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
  
  export function deleteInstrument(values) {
    return axios({
      url: deleteInstrumentUrl(),
      method: "POST",
      headers: getHeader(),
      data: values,
    });
  }
  