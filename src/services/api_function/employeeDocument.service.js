import {
  EmployeecreateDocumentUrl,
  brandUpdateUrl,
  brandFindUrl,
  brandDeleteUrl,
  brandDataUrl,
  listOfDocumentUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function EmployeeDocumentCreate(values) {
  return axios({
    url: EmployeecreateDocumentUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
