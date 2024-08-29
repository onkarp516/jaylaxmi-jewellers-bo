import { changePasswordUrl } from "@/services/api";

import { getHeader } from "@/helpers";
import axios from "axios";

export function changePassword(value) {
  return axios({
    url: changePasswordUrl(),
    method: "POST",
    headers: getHeader(),
    data: value,
  });
}
