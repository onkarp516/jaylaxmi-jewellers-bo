import config from "config";

export function EmployeecreateDocumentUrl() {
  return `${config.apiUrl}/create_emp_document`;
}
