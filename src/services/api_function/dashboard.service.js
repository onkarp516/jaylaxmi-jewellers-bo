import { getDashboardDataUrl } from "@/services/api";

import { getHeader } from "@/helpers";
import axios from "axios";

export function getDashboardData(values) {
  return axios({
    url: getDashboardDataUrl(),
    method: "POST",
    data:values,
    headers: getHeader(),
  });
}
