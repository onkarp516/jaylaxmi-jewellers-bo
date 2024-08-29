import { getHeader } from "@/helpers";
import axios from "axios";

import {
  rejectAdvancePaymentUrl,
  approveAdvancePaymentUrl,
} from "@/services/api";

export function rejectAdvancePayment(values) {
  return axios({
    url: rejectAdvancePaymentUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function approveAdvancePayment(values) {
  return axios({
    url: approveAdvancePaymentUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
