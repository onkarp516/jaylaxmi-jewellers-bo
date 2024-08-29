import config from "config";

export function DTAdvancePaymentUrl() {
  return `${config.apiUrl}/DTAdvancePayment`;
}

export function rejectAdvancePaymentUrl() {
  return `${config.apiUrl}/rejectAdvancePayment`;
}

export function approveAdvancePaymentUrl() {
  return `${config.apiUrl}/approveAdvancePayment`;
}
