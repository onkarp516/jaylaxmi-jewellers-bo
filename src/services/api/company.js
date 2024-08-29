import config from "config";
export function createCompanyUrl() {
    return `${config.apiUrl}/createCompany`;
  }
  export function DTCompanyUrl(){
      return `${config.apiUrl}/DTCompany`;
  }
  export function listOfCompanyUrl(){
      return `${config.apiUrl}/listOfCompany`;
  }
  export function findCompanyUrl(){
      return `${config.apiUrl}/findCompany`;
  }
  export function updateCompanyUrl(){
      return `${config.apiUrl}/updateCompany`;
  }
  export function deleteCompanyUrl(){
      return `${config.apiUrl}/deleteCompany`;
  }
  export function getGSTTypesURL() {
    // return `http://${getCurrentIpaddress()}:${getPortNo()}/get_gst_type`;
    return `${config.apiUrl}/get_gst_type`;
  }