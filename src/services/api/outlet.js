import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createCompanyURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_outlet`;
}
export function updateCompanyURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_outlet`;
}

export function getCompanyURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_outlets`;
}

export function getCompanyByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_by_id`;
}
export function getGSTTypesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_gst_type`;
}
export function get_outlets_by_branchURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlets_by_branch`;
}
export function get_outlets_from_branchURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlets_from_branch`;
}
