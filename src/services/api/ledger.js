import config from "config";

export function getUnderListURL() {
  return `${config.apiUrl}/get_under_list`;
}

export function getBalancingMethodsURL() {
  return `${config.apiUrl}/get_balancing_methods`;
}

export function createLedgerURL() {
  // return `http://${getCurrentIpaddress()}:${getPortNo()}/create_ledger_master`;
  return `${config.apiUrl}/create_ledger_master`;
}

export function getValidateLedgermMasterURL() {
  // return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_ledger_master`;
  return `${config.apiUrl}/validate_ledger_master`;
}

export function get_outlet_appConfigUrl() {
  // return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_appConfig`;
  return `${config.apiUrl}/get_outlet_appConfig`;
}

export function getLedgersURL() {
  // return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_ledgers`;
  return `${config.apiUrl}/get_all_ledgers`;
}

export function deleteledgerUrl() {
  // return `http://${getCurrentIpaddress()}:${getPortNo()}/delete_ledger`;
  return `${config.apiUrl}/delete_ledger`;
}

export function getLedgersByIdURL() {
  // return `http://${getCurrentIpaddress()}:${getPortNo()}/get_ledgers_by_id`;
  return `${config.apiUrl}/get_ledgers_by_id`;
}

export function editLedgerURL() {
  // return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_ledger_master`;
  return `${config.apiUrl}/edit_ledger_master`;
}

export function viewLedgerURL() {
  // return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_ledger_master`;
  return `${config.apiUrl}/get_ledger_tranx_details_report`;
}


