import {
    createCompanyUrl,
    listOfCompanyUrl,
    findCompanyUrl,
    updateCompanyUrl,
    deleteCompanyUrl,
  } from "@/services/api";
  import { getHeader } from "@/helpers";
import axios from "axios";
import { get } from "immutable";


export function createCompany(values) {
    return axios({
      url: createCompanyUrl(),
      method:"POST",
      headers: getHeader(),
      data: values,
    });
  }
  export function listOfCompany(values){
    return axios({
      url:listOfCompanyUrl(),
      method:"GET",
      headers:getHeader(),
      data:values,
    })
  }
  export function findCompany(values){
    return axios({
      url:findCompanyUrl(),
      method:"POST",
      headers:getHeader(),
      data:values,
    })
  }
  export function updateCompany(values){
    return axios({
      url:updateCompanyUrl(),
      method:"POST",
      headers:getHeader(),
      data:values,
    })
  }
  export function deleteCompany(values)
  {
    return axios({
      url:deleteCompanyUrl(),
      method:"POST",
      headers:getHeader(),
      data:values,
    })
  }