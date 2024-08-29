import React, { Component, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import moment from "moment";
import {
  Input,
  FormFeedback,
  Row,
  Col,
  Spinner,
  FormGroup,
  Label,
  Button,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import Select from "react-select";
import Table from "react-bootstrap/Table";
import { WithUserPermission, isActionExist } from "@/helpers";
import LayoutCustom from "@/pages/layout/LayoutCustom";
import {
  get_salary_data_by_id,
  get_employee_id_by_ledger_id,
  recalculateEmpSalaryForMonth,
  getEmpSalaryslip,
  getPayrollLedgers,
  create_emp_payroll,
} from "@/services/api_function";

import { Formik, Form } from "formik";
import * as Yup from "yup";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

class EmpSalaryData extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      isLoading: false,
      editData: "",
      employeeId: "",
      employeeName: "",
      basic: "",
      specialAllowance: "",
      empSalaryData: [],
    };
  }
  //   this.setState({ isLoading: true });
  //   let requestData = {
  //     yearMonth: values.fromMonth,
  //     employeeId: values.employeeId.value,
  //   };

  //   recalculateEmpSalaryForMonth(requestData)
  //     .then((response) => {
  //       console.log("doc response", response.data);
  //       let res = response.data;
  //       if (res.responseStatus == 200) {
  //         if (values.employeeId.value != "all") {
  //           this.myRef.current.handleSubmit();
  //         } else {
  //           toast.success("✔ " + res.message);
  //           this.setState({ isLoading: false });
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // };

  setEmpSalaryData = () => {
    let formData = new FormData();
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const monthStr = month < 10 ? "0" + month : month;
    const yearMonth = year + "-" + monthStr;
    let requestData = {
      fromMonth: yearMonth, //yearMonth,
      employeeId: this.state.employeeId,
    };
    getEmpSalaryslip(requestData)
      .then((response) => {
        console.log("SalaryData>>>>", response.data.response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.response;
          data["month"] = yearMonth;
          this.setState({
            empSalaryData: data,
          });
        }
      })
      .catch((error) => {});
  };

  getEmployeeIdByLedgerId = () => {
    let formData = new FormData();
    const { editData } = this.state;
    console.log("ledger_id", editData);
    formData.append("ledger_id", editData);
    get_employee_id_by_ledger_id(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ employeeId: res.employee_id }, () => {});
        }
      })
      .catch((error) => {});
  };

  processSalary = () => {
    const { empSalaryData, editData } = this.state;

    // let requestData = {
    //   employeeId: this.state.employeeId,
    //   employeeName: empSalaryData.employeeName,
    //   basic: empSalaryData.basic,
    //   specialAllowance: empSalaryData.specialAllowance,
    //   netSalary: empSalaryData.netSalary,
    //   pfPercentage: empSalaryData.pfPercentage,
    //   pfAmount: empSalaryData.pfAmount,
    //   esiAmount: empSalaryData.esiAmount,
    //   profTax: empSalaryData.profTax,
    //   payableAmount: empSalaryData.payableAmount,
    //   incentiveId: empSalaryData.incentive,
    //   netPayableAmount: empSalaryData.netPayableAmount,
    //   Basic_Salary_Ac: empSalaryData["Basic_Salary_A/c"],
    //   Basic_Salary_Ac_id: empSalaryData["Basic_Salary_A/c_id"],
    //   Special_allowance_Ac: empSalaryData["Special_allowance_A/c"],
    //   Special_allowance_Ac_id: empSalaryData["Special_Allowance_A/c_id"],
    //   PF_Ac: empSalaryData["PF_A/c"],
    //   PF_Ac_id: empSalaryData["PF_A/c_id"],
    //   ESIC_Ac: empSalaryData["ESIC_A/c"],
    //   ESIC_Ac_id: empSalaryData["ESIC_A/c_id"],
    //   PT_Ac: empSalaryData["PT_A/c"],
    //   PT_Ac_id: empSalaryData["PT_A/c_id"],
    //   Insentive: empSalaryData.Insentive,
    //   Insentive_id: empSalaryData.Insentive_id,
    //   month: empSalaryData.month,
    //   emp_ledger_id: editData,
    // };

    let requestData = new FormData();

    // requestData.append("employeeId", values.designationName);

    requestData.append("employeeId",this.state.employeeId),
    requestData.append("employeeName",empSalaryData.employeeName),
    requestData.append("basic",empSalaryData.basic),
    requestData.append("specialAllowance",empSalaryData.specialAllowance),
    requestData.append("netSalary",empSalaryData.netSalary),
    requestData.append("pfPercentage",empSalaryData.pfPercentage),
    requestData.append("pfAmount",empSalaryData.pfAmount),
    requestData.append("esiAmount",empSalaryData.esiAmount),
    requestData.append("profTax",empSalaryData.profTax),
    requestData.append("payableAmount",empSalaryData.payableAmount),
    // requestData.append("incentiveId",empSalaryData.incentive),
    requestData.append("netPayableAmount",empSalaryData.netPayableAmount),
    requestData.append("Basic_Salary_A/c",empSalaryData["Basic_Salary_A/c"]),
    requestData.append("Basic_Salary_A/c_id",empSalaryData["Basic_Salary_A/c_id"]),
    requestData.append("Special_Allowance_A/c",empSalaryData["Special_Allowance_A/c"]),
    requestData.append("Special_Allowance_A/c_id",empSalaryData["Special_Allowance_A/c_id"]),
    requestData.append("PF_A/C",empSalaryData["PF_A/C"]),
    requestData.append("PF_A/C_id",empSalaryData["PF_A/C_id"]),
    requestData.append("ESIC_A/C",empSalaryData["ESIC_A/C"]),
    requestData.append("ESIC_A/C_id",empSalaryData["ESIC_A/C_id"]),
    requestData.append("PT_A/C",empSalaryData["PT_A/C"]),
    requestData.append("PT_Ac_id",empSalaryData["PT_A/C_id"]),
    // requestData.append("Insentive",empSalaryData.incentive),
    requestData.append("Late_Punch-In",empSalaryData["Late_Punch-In"]),
    requestData.append("Late_Punch-In_id",empSalaryData["Late_Punch-In_id"]),
    requestData.append("lateCount",empSalaryData["lateCount"]),
    requestData.append("latePunchDeductionAmount",empSalaryData["latePunchDeductionAmount"]),
    // requestData.append("Insentive_id",empSalaryData.Insentive_id),
    requestData.append("month",empSalaryData.month),
    requestData.append("emp_ledger_id",editData),

    
    create_emp_payroll(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          toast.success("✔", res.message);
          // this.setState({ employeeId: res.employee_id }, () => {});
          this.props.history.push("/payroll");
          console.log("Respone>>>", res);
        }
      })
      .catch((error) => {
        toast.success("✘");
      });
    // let formData = new FormData();

    // formData.append("employeeId", empSalaryData.employeeId);
    // formData.append("employeeName", empSalaryData.employeeName);
    // formData.append("basic", empSalaryData.basic);
    // formData.append("specialAllowance", empSalaryData.specialAllowance);
    // formData.append("netSalary", empSalaryData.netSalary);
    // formData.append("pfPercentage", empSalaryData.pfPercentage);
    // formData.append("pfAmount", empSalaryData.pfAmount);
    // formData.append("esiPercentage", empSalaryData.esiPercentage);
    // formData.append("esiAmount", empSalaryData.esiAmount);
    // formData.append("profTax", empSalaryData.profTax);
    // // formData.append("totalDeduction", empSalaryData.totalDeduction);
    // formData.append("payableAmount", empSalaryData.payableAmount);
    // formData.append("advance", empSalaryData.advance);
    // formData.append("incentive", empSalaryData.incentive);
    // formData.append("netPayableAmount", empSalaryData.netPayableAmount);
    // // formData.append("noDaysPresent", empSalaryData.noDaysPresent);
    // // formData.append("totalHoursInMonth", empSalaryData.totalHoursInMonth);
    // // formData.append("netSalaryInHours", empSalaryData.netSalaryInHours);
    // // formData.append("netSalaryInDays", empSalaryData.netSalaryInDays);
    // // formData.append("netSalaryInPoints", empSalaryData.netSalaryInPoints);
    // formData.append("netSalaryInPcs", empSalaryData.netSalaryInPcs);
    // formData.append("Basic_Salary_A/c", empSalaryData["Basic_Salary_A/c"]);
    // formData.append(
    //   "Basic_Salary_A/c_id",
    //   empSalaryData["Basic_Salary_A/c_id"]
    // );
    // formData.append(
    //   "Special_allowance_A/c",
    //   empSalaryData["Special_allowance_A/c"]
    // );
    // formData.append(
    //   "Special_allowance_A/c_id",
    //   empSalaryData["Special_allowance_A/c_id"]
    // );
    // formData.append("PF_A/c", empSalaryData["PF_A/c"]);
    // formData.append("PF_A/c_id", empSalaryData["PF_A/c_id"]);
    // formData.append("ESIC_A/c", empSalaryData["ESIC_A/c"]);
    // formData.append("ESIC_A/c_id", empSalaryData["ESIC_A/c_id"]);
    // formData.append("PT_A/c", empSalaryData["PT_A/c"]);
    // formData.append("PT_A/c_id", empSalaryData["PT_A/c_id"]);
    // formData.append("Insentive", empSalaryData.Insentive);
    // formData.append("Insentive_id", empSalaryData.Insentive_id);
    // formData.append("month", empSalaryData.month);
    // console.log("This is the Form Data-----------", requestData);
  };

  componentDidMount() {
    console.log("params>>>", this.props.match.params.id);
    this.setState({ editData: this.props.match.params.id }, () => {
      this.getEmployeeIdByLedgerId();
    });
  }

  componentDidUpdate() {
    const { empSalaryData } = this.state;
    console.log("componentDidUpdate");
    if (this.state.employeeId != "" && empSalaryData.length == 0) {
      this.setEmpSalaryData();
      // this.getPayrollLedgers();
    }
  }

  render() {
    const { empSalaryData } = this.state;

    return (
      <LayoutCustom>
        <div>
          {/* {JSON.stringify(empSalaryData)} */}
          <Card>
            <CardBody className="border-bottom p-2">
              <Row>
                <Col md="12" style={{ textAlign: "center" }}>
                  <CardTitle>Salary Data</CardTitle>
                </Col>
              </Row>
              {/* <pre>{JSON.stringify(empSalaryData)}</pre> */}

              {empSalaryData ? (
                <Row style={{ justifyContent: "center" }}>
                <Col md="5" className="">
                  <Table hover>
                    <thead className="text-center">
                      <tr>
                        <th colSpan={2}>
                          ID : {empSalaryData.employeeId}
                          <br />
                          Employee : {empSalaryData.employeeName}
                          <br />
                          Designation : {empSalaryData.designation}
                          <br />
                          Mobile No : {empSalaryData.mobileNo}
                          <br />
                          Address : {empSalaryData.address}
                        </th>
                      </tr>
                      <tr>
                        <th>
                          Month :{" "}
                          {empSalaryData.month != null
                            ? moment(empSalaryData.month).format("MMM yyyy")
                            : ""} 
                        </th>

                        <th>Net Salary: {empSalaryData.netPayableAmount}</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{ fontWeight: "500" }}
                      className="view_salary"
                    >
                      {/* <tr>
                        <th colSpan={2}>Earning</th>
                      </tr> */}
                      <tr>
                        <td>Total Days</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.totalDaysInMonth}
                        </td>
                      </tr>
                      <tr>
                        <td>Monthly Payment</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.monthlyPay}
                        </td>
                      </tr>

                      <tr>
                        <td>Per Day Wages</td>
                        <td style={{ color: "#83b7d1" }}>
                          {/* {empSalaryData.perDaySalary} */}
                          {empSalaryData["perDaySalary"]?empSalaryData["perDaySalary"].toFixed(2):""}

                        </td>
                      </tr>

                      <tr>
                        <td>Present Days</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.noDaysPresent}
                        </td>
                      </tr>

                      <tr>
                        <td>Basic D.A</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.basic}
                        </td>
                      </tr>

                      <tr>
                        <td>Special Allowance</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.specialAllowance}
                        </td>
                      </tr>

                      <tr>
                        <td>Gross Total</td>
                        <td style={{ color: "#83b7d1" }}>
                          {/* {empSalaryData.grossTotal} */}
                          {empSalaryData["grossTotal"]?empSalaryData["grossTotal"].toFixed(2):""}

                        </td>
                      </tr>
                      {/* <tr>
                        <td>WH(HR)</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.totalHoursInMonth}
                        </td>
                      </tr> */}

                      {/* {empSalaryData.netSalaryInDays != "NA" ? (
                        <tr>
                          <td>Net Salary In Days</td>
                          <td style={{ color: "#83b7d1" }}>
                            {empSalaryData.netSalaryInDays}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )} */}

                      {/* {empSalaryData.netSalaryInHours != "NA" ? (
                        <tr>
                          <td>Net Salary In Hours</td>
                          <td style={{ color: "#83b7d1" }}>
                            {empSalaryData.netSalaryInHours}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}

                      {empSalaryData.netSalaryInPoints != "NA" ? (
                        <tr>
                          <td>Net Salary In Points</td>
                          <td style={{ color: "#83b7d1" }}>
                            {empSalaryData.netSalaryInPoints}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}

                      {empSalaryData.netSalaryInPcs != "NA" ? (
                        <tr>
                          <td>Net Salary In PCS</td>
                          <td style={{ color: "#83b7d1" }}>
                            {empSalaryData.netSalaryInPcs}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )} */}
                      {empSalaryData.netSalary != "NA" ? (
                        <tr>
                          <td>Total Salary</td>
                          <td style={{ color: "#83b7d1" }}>
                            {empSalaryData.netSalary}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}
                        {/* <tr>
                        <td>PF {empSalaryData.pfPercentage}%</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.pfAmount}
                        </td>
                      </tr>
                      <tr>
                        <td>Esi {empSalaryData.esiPercentage}%</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.esiAmount}
                        </td>
                      </tr> */}
                      <tr>
                        <td>Professional Tax</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.profTax}
                        </td>
                      </tr>
                      <tr>
                        <td>Late Punch In</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.latePunchDeductionAmount}
                        </td>
                      </tr>
                      <tr>
                          <td>Advance</td>
                          <td style={{ color: "#83b7d1" }}>
                            {empSalaryData.advance}
                          </td>
                        </tr>
                        <tr>
                        <td>Total Deduction</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.totalDeduction}
                        </td>
                      </tr>
                      <tr>
                        <td>Net Amount</td>
                        <td style={{ color: "#83b7d1" }}>
                          {/* {empSalaryData.neySalary} */}
                          {empSalaryData["neySalary"]?empSalaryData["neySalary"].toFixed(2):""}

                        </td>
                      </tr>
                      <tr 
                       style={{
                        borderBottom: "2px solid #dcdcdc",
                        borderTop: "2px solid #dcdcdc",
                      }}
                      >
                        <td style={{ fontWeight: "bold" }}>Payable Amount</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.payableAmount}
                        </td>
                      </tr>
                      {/* <tr>
                        <td>Advance Amount</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.advance}
                        </td>
                      </tr>
                      <tr>
                        <td>Incentive Amount</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.incentive}
                        </td>
                      </tr> */}
                      {/* <tr>
                        <td>Net Payable Amount</td>
                        <td style={{ color: "#83b7d1" }}>
                          {empSalaryData.netPayableAmount}
                        </td>
                      </tr> */}
                    </tbody>
                  </Table>
                </Col>
              </Row>
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    No Data Found
                  </td>
                </tr>
              )}
              <Row>
                <Col md="12" style={{ textAlign: "end" }}>
                  <Button
                    className="mainbtn1 text-white report-show-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      this.processSalary();
                      //   this.props.history.push(`/receipt-create`);
                    }}
                  >
                    Process Salary
                  </Button>
                  <Button
                    className="mainbtn1 text-white report-show-btn"
                    style={{ marginLeft: "20px", marginRight: "20px" }}
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.history.push(`/payroll`);
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </LayoutCustom>
    );
  }
}

export default WithUserPermission(EmpSalaryData);
