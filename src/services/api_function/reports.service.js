import { getRejectionReportsUrl } from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function getRejectionReports(values) {
  return axios({
    url: getRejectionReportsUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
