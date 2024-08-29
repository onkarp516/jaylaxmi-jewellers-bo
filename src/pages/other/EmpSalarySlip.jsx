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
import {
  listOfEmployee,
  getEmpSalaryslip,
  recalculateEmpSalaryForMonth,
} from "@/services/api_function";

import { Formik, Form } from "formik";
import * as Yup from "yup";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

class EmpSalarySlip extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      isLoading: false,
      empOpt: [],
      salaryViewData: [],
    };
  }

  getEmpOptions = () => {
    listOfEmployee()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;

          let opt = [
            // {
            //   value: "all",
            //   label: "All",
            // },
          ];

          result.map(function (data) {
            opt.push({
              value: data.id,
              label: data.employeeName,
            });
          });

          this.setState({ empOpt: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  recalculateEmpSalaryForMonthFun = (values) => {
    this.setState({ isLoading: true });
    let requestData = {
      yearMonth: values.fromMonth,
      employeeId: values.employeeId.value,
    };

    recalculateEmpSalaryForMonth(requestData)
      .then((response) => {
        console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          if (values.employeeId.value != "all") {
            this.myRef.current.handleSubmit();
          } else {
            toast.success("✔ " + res.message);
            this.setState({ isLoading: false });
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  componentDidMount() {
    this.getEmpOptions();
  }

  render() {
    const { isLoading, empOpt, salaryViewData } = this.state;

    return (
      <div>
        <Card>
          <CardBody className="border-bottom p-2">
            <CardTitle>View Salary Slip</CardTitle>

            <div>
              <Formik
                validateOnBlur={false}
                validateOnChange={false}
                innerRef={this.myRef}
                initialValues={{
                  fromMonth: "",
                  employeeId: "",
                }}
                validationSchema={Yup.object().shape({
                  fromMonth: Yup.string().required("From Date is required"),
                  employeeId: Yup.object().required("Select Employee"),
                })}
                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                  if (values.employeeId && values.employeeId.value != "all") {
                    this.setState({ isLoading: true, salaryViewData: [] });
                    setStatus();
                    let requestData = {
                      fromMonth: values.fromMonth,
                      employeeId: values.employeeId.value,
                    };

                    getEmpSalaryslip(requestData)
                      .then((response) => {
                        // resetForm();
                        var result = response.data;
                        console.log({ result });
                        console.log("result.response", result.response);
                        if (result.responseStatus == 200) {
                          setSubmitting(false);

                          let data = result.response;
                          data["month"] = values.fromMonth;
                          this.setState({
                            isLoading: false,
                            salaryViewData: data,
                          });
                        } else {
                          setSubmitting(false);
                          this.setState({
                            isLoading: false,
                            salaryViewData: [],
                          });
                          toast.error("✘ No Data Found");
                        }
                      })
                      .catch((error) => {
                        setSubmitting(false);
                        toast.error("✘ " + error);
                      });
                  }
                }}
                render={({
                  errors,
                  status,
                  touched,
                  isSubmitting,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                  values,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md="3">
                        <FormGroup>
                          <Label
                            style={{ marginBottom: "0px" }}
                            htmlFor="level"
                          >
                            Employee
                          </Label>

                          <Select
                            ////isClearable={true}
                            styles={{
                              clearIndicator: ClearIndicatorStyles,
                            }}
                            onChange={(v) => {
                              setFieldValue("employeeId", v);
                            }}
                            name="employeeId"
                            options={empOpt}
                            value={values.employeeId}
                            className="mt-2"
                          />

                          <span className="text-danger">
                            {errors.employeeId && "Please select employee"}
                          </span>
                        </FormGroup>
                      </Col>

                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            Select Month <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="month"
                            name="fromMonth"
                            id="fromMonth"
                            onChange={handleChange}
                            value={values.fromMonth}
                            invalid={errors.fromMonth ? true : false}
                          />
                          <FormFeedback>{errors.fromMonth}</FormFeedback>
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        &nbsp;
                        <FormGroup>
                        {isLoading ? (
                          <Button
                            className="mainbtn1 text-white report-show-btn"
                            type="button"
                            disabled={isSubmitting}
                          >
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            Loading...
                          </Button>
                        ) : (
                          isActionExist(
                            "emp-salary-slip",
                            "view",
                            this.props.userPermissions
                          ) && (
                            <>
                              <Button
                                type="submit"
                                className="mainbtn1 text-white report-show-btn"
                              >
                                Show
                              </Button>
                            </>
                          )
                        )}
                        &nbsp;
                        {isLoading ? (
                          <Button
                            className="mainbtn1 text-white report-show-btn"
                            type="button"
                            disabled={isSubmitting}
                          >
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            Loading...
                          </Button>
                        ) : (
                          isActionExist(
                            "emp-salary-slip",
                            "edit",
                            this.props.userPermissions
                          ) && (
                            <>
                              <Button
                                type="button"
                                onClick={() => {
                                  if (
                                    values.employeeId != "" &&
                                    values.fromMonth != ""
                                  ) {
                                    this.recalculateEmpSalaryForMonthFun(
                                      values
                                    );
                                  }
                                }}
                                className="mainbtn1 text-white report-show-btn"
                              >
                                Recalculate Salary
                              </Button>
                            </>
                          )
                        )}
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                )}
              />
            </div>
            {/* <pre>{JSON.stringify(salaryViewData)}</pre> */}

            {salaryViewData && (
              <Row style={{ justifyContent: "center" }}>
                <Col md="5" className="">
                  <Table hover>
                    <thead className="text-center">
                      <tr>
                        <th colSpan={2}>
                          ID : {salaryViewData.employeeId}
                          <br />
                          Employee : {salaryViewData.employeeName}
                          <br />
                          Designation : {salaryViewData.designation}
                          <br />
                          Mobile No : {salaryViewData.mobileNo}
                          <br />
                          Address : {salaryViewData.address}
                        </th>
                      </tr>
                      <tr>
                        <th>
                          Month :{" "}
                          {salaryViewData.month != null
                            ? moment(salaryViewData.month).format("MMM yyyy")
                            : ""}
                        </th>

                        <th>Net Salary: {salaryViewData.netPayableAmount}</th>
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
                          {salaryViewData.totalDaysInMonth}
                        </td>
                      </tr>
                      {/* <tr>
                        <td>Monthly Payment</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData.monthlyPay}
                        </td>
                      </tr> */}

                      {/* <tr>
                        <th>
                          Month :{" "}
                          {salaryViewData.month != null
                            ? moment(salaryViewData.month).format("MMM yyyy")
                            : ""}
                        </th>

                        <th>Net Salary: {salaryViewData.netPayableAmount}</th>
                      </tr> */}

                      <tr>
                        <td>Basic D.A</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData.basic}
                        </td>
                      </tr>

                      <tr>
                        <td>Special Allowance</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData.specialAllowance}
                        </td>
                      </tr>

                      <tr>
                        <td>Gross Total</td>
                        <td style={{ color: "#83b7d1" }}>
                          {/* {salaryViewData.grossTotal} */}
                          {salaryViewData["grossTotal"]?salaryViewData["grossTotal"].toFixed(2):""}
                          
                        </td>
                      </tr>
                      {/* <tr>
                        <td>WH(HR)</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData.totalHoursInMonth}
                        </td>
                      </tr> */}

                      {/* {salaryViewData.netSalaryInDays != "NA" ? (
                        <tr>
                          <td>Net Salary In Days</td>
                          <td style={{ color: "#83b7d1" }}>
                            {salaryViewData.netSalaryInDays}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )} */}

                      {/* {salaryViewData.netSalaryInHours != "NA" ? (
                        <tr>
                          <td>Net Salary In Hours</td>
                          <td style={{ color: "#83b7d1" }}>
                            {salaryViewData.netSalaryInHours}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}

                      {salaryViewData.netSalaryInPoints != "NA" ? (
                        <tr>
                          <td>Net Salary In Points</td>
                          <td style={{ color: "#83b7d1" }}>
                            {salaryViewData.netSalaryInPoints}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}

                      {salaryViewData.netSalaryInPcs != "NA" ? (
                        <tr>
                          <td>Net Salary In PCS</td>
                          <td style={{ color: "#83b7d1" }}>
                            {salaryViewData.netSalaryInPcs}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )} */}
                      <tr>
                        <td>Per Day Wages</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData["perDaySalary"]?salaryViewData["perDaySalary"].toFixed(2):""}

                        </td>
                      </tr>
                      <tr>
                        <td>Present Days</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData["noDaysPresent"]?salaryViewData["noDaysPresent"]:""}
                          {/* {salaryViewData["presentDays"] ? parseFloat(salaryViewData["presentDays"]) + parseFloat(salaryViewData["extraDays"]) + parseFloat(salaryViewData["halfDays"]) + parseFloat(salaryViewData["extraHalfDays"]) : ""} */}
                        </td>
                      </tr>
                      <tr>
                        <td>Present Days Salary</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData["noDaysPresent"] && salaryViewData["perDaySalary"] ? (salaryViewData["noDaysPresent"]*salaryViewData["perDaySalary"]).toFixed(2):""}
                          {/* {salaryViewData["presentDays"] ? parseFloat(salaryViewData["presentDays"]) + parseFloat(salaryViewData["extraDays"]) + parseFloat(salaryViewData["halfDays"]) + parseFloat(salaryViewData["extraHalfDays"]) : ""} */}
                        </td>
                      </tr>
                      <tr>
                        <td>Overtime Amt</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData["overtimeAmount"]?salaryViewData["overtimeAmount"]:""}
                          {/* {salaryViewData["presentDays"] ? parseFloat(salaryViewData["presentDays"]) + parseFloat(salaryViewData["extraDays"]) + parseFloat(salaryViewData["halfDays"]) + parseFloat(salaryViewData["extraHalfDays"]) : ""} */}
                        </td>
                      </tr>
                      {salaryViewData.netSalary != "NA" ? (
                        <tr>
                          <td>Total Salary</td>
                          <td style={{ color: "#83b7d1" }}>
                            {salaryViewData.netSalary}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}
                      {/* <tr>
                        <td>PF {salaryViewData.pfPercentage}%</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData.pfAmount}
                        </td>
                      </tr>
                      <tr>
                        <td>Esi {salaryViewData.esiPercentage}%</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData.esiAmount}
                        </td>
                      </tr> */}
                      <tr>
                        <td>Professional Tax</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData.profTax}
                        </td>
                      </tr>
                      <tr>
                        <td>Late Punch In</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData["latePunchDeductionAmount"]?salaryViewData["latePunchDeductionAmount"].toFixed(2):""}
                        </td>
                      </tr>
                      <tr>
                        <td>Advance</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData.advance}
                        </td>
                      </tr>
                      <tr>
                        <td>Net Amount</td>
                        <td style={{ color: "#83b7d1" }}>
                          {/* {salaryViewData.neySalary} */}
                          {salaryViewData["neySalary"]?salaryViewData["neySalary"].toFixed(2):""}
                        </td>
                      </tr>
                      <tr>
                        <td>Total Deduction</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData.totalDeduction}
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
                          {salaryViewData.payableAmount}
                        </td>
                      </tr>
                      {/* <tr>
                        <td>Advance Amount</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData.advance}
                        </td>
                      </tr>
                      <tr>
                        <td>Incentive Amount</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData.incentive}
                        </td>
                      </tr> */}
                      {/* <tr>
                        <td>Net Payable Amount</td>
                        <td style={{ color: "#83b7d1" }}>
                          {salaryViewData.netPayableAmount}
                        </td>
                      </tr> */}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default WithUserPermission(EmpSalarySlip);
