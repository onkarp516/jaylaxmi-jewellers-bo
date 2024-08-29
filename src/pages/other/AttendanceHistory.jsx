import React, { Component, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import moment from "moment";
import {
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
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
import Select, { components } from "react-select";
import Table from "react-bootstrap/Table";
import Paper from "@material-ui/core/Paper";

import {
  listOfEmployee,
  getEmployeeAttendanceHistory,
  exportEmployeeAttendanceReport,
} from "@/services/api_function";

import {
  getHeader,
  WithUserPermission,
  isActionExist,
  MyDatePicker,
} from "@/helpers";

import {
  exportEmployeeAttendanceReportUrl,
  downloadReceiptUrl,
} from "@/services/api";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { date } from "yup/lib/locale";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

class AttendanceHistory extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.state = {
      isLoading: false,
      empOpt: [],
      attendanceData: [],
      secureData: JSON.parse(localStorage.getItem("loginUser")),
    };
  }

  getEmpOptions = () => {
    listOfEmployee()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt = result.map(function (data) {
            return {
              value: data.id,
              label: data.employeeName,
            };
          });
          this.setState({ empOpt: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  getReport = (values) => {
    let filename =
      "emp_att_" + moment().format("YYYY-MM-DD HH:MM:ss") + ".xlsx";

    const requestOption = {
      method: "GET",
      headers: getHeader(),
    };

    return fetch(
      exportEmployeeAttendanceReportUrl(
        moment(values.fromDate).format("YYYY-MM-DD"),
        moment(values.toDate).format("YYYY-MM-DD"),
        values.employeeId.value
      ),
      requestOption
    )
      .then((response) => response.blob())
      .then((blob) => {
        // 1. Convert the data into 'blob'
        console.log("blob");

        console.log({ blob });

        if (blob.size > 0) {
          // 2. Create blob link to download
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${filename}`);
          // 3. Append to html page
          document.body.appendChild(link);
          // 4. Force download
          link.click();
          // 5. Clean up and remove the link
          link.parentNode.removeChild(link);
          return true;
        } else {
          console.warn("Data Not Found");
          toast.error("✘ No Data Found");
        }
      });
  };

  getPDFReport = () => {
    let filename = "emp_att_" + moment().format("YYYY-MM-DD HH:MM:ss") + ".pdf";

    const requestOption = {
      method: "GET",
      headers: getHeader(),
    };

    return fetch(downloadReceiptUrl(), requestOption)
      .then((response) => response.blob())
      .then((blob) => {
        // 1. Convert the data into 'blob'
        console.log({ blob });

        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename}`);
        // 3. Append to html page
        document.body.appendChild(link);
        // 4. Force download
        link.click();
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
        return true;
      });
  };

  componentDidMount() {
    this.getEmpOptions();
  }

  render() {
    const { isLoading, empOpt, attendanceData, secureData } = this.state;

    return (
      <div className="emp">
        <Card>
          <CardBody className="border-bottom p-2">
            <CardTitle>Employee Attendance History</CardTitle>

            <div>
              <Formik
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={{
                  // fromDate: "2022-09-01",
                  // toDate: "2022-09-12",
                  fromDate: new Date(),
                  toDate: new Date(),
                  employeeId: "",
                }}
                validationSchema={Yup.object().shape({
                  fromDate: Yup.string().required("From Date is required"),
                  toDate: Yup.string().required("To Date is required"),
                  employeeId: Yup.object().required("Select Employee"),
                })}
                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                  this.setState({ isLoading: true, attendanceData: [] });
                  setStatus();
                  let requestData = {
                    fromDate: moment(values.fromDate).format("YYYY-MM-DD"),
                    toDate: moment(values.toDate).format("YYYY-MM-DD"),
                    employeeId: values.employeeId.value,
                  };

                  getEmployeeAttendanceHistory(requestData)
                    .then((response) => {
                      // resetForm();
                      var result = response.data;
                      console.log({ result });
                      console.log("result.response", result.response);
                      if (result.responseStatus == 200) {
                        setSubmitting(false);
                        this.setState({
                          isLoading: false,
                          attendanceData: result.response,
                        });

                        if (result.response.length == 0) {
                          toast.error("✘ No Task Data Found");
                        }
                      } else {
                        setSubmitting(false);
                        this.setState({ isLoading: false, attendanceData: [] });
                        toast.error("✘ No Data Found");
                      }
                    })
                    .catch((error) => {
                      setSubmitting(false);
                      toast.error("✘ " + error);
                    });
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
                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            Select From Date{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          {/* <Input
                            type="date"
                            name="fromDate"
                            id="fromDate"
                            onChange={handleChange}
                            value={values.fromDate}
                            invalid={errors.fromDate ? true : false}
                          />
                          <FormFeedback>{errors.fromDate}</FormFeedback> */}
                          <MyDatePicker
                            autoComplete="off"
                            className="datepic form-control"
                            name="fromDate"
                            placeholderText="dd/MM/yyyy"
                            id="fromDate"
                            dateFormat="dd/MM/yyyy"
                            onChange={(e) => {
                              console.log("date ", e);
                              setFieldValue("fromDate", e);
                            }}
                            value={values.fromDate}
                            selected={values.fromDate}
                            // maxDate={new Date()}
                          />
                          <span className="text-danger">{errors.fromDate}</span>
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            Select To Date{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          {/* <Input
                            type="date"
                            name="toDate"
                            id="toDate"
                            onChange={handleChange}
                            value={values.toDate}
                            invalid={errors.toDate ? true : false}
                          />
                          <FormFeedback>{errors.toDate}</FormFeedback>
                           */}
                          <MyDatePicker
                            autoComplete="off"
                            className="datepic form-control"
                            name="toDate"
                            placeholderText="dd/MM/yyyy"
                            id="toDate"
                            dateFormat="dd/MM/yyyy"
                            onChange={(e) => {
                              console.log("date ", e);
                              setFieldValue("toDate", e);
                            }}
                            value={values.toDate}
                            selected={values.toDate}
                            maxDate={new Date()}
                          />
                          <span className="text-danger">{errors.toDate}</span>
                        </FormGroup>
                      </Col>

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

                      <Col md="3">
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
                            "employee-attendance-history",
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
                        {/* </Col>
                      <Col md="2"> */}
                        <Button
                          type="button"
                          className="mainbtn1 text-white report-show-btn"
                          style={{ marginLeft: "10px" }}
                          onClick={(e) => {
                            e.preventDefault();
                            console.log({ values });
                            // this.getPDFReport(values);
                            this.getReport(values);
                          }}
                        >
                          Export To Excel
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              />
            </div>
            {/* <pre>{JSON.stringify(attendanceData)}</pre> */}
            {attendanceData && attendanceData.length > 0 && (
              <div className="container-fluid">
                <div className="attendance-tbl">
                  <Table bordered className="main-tbl-style">
                    <thead
                      style={{
                        backgroundColor: "#F6F5F7",
                      }}
                      className="datastyle-head"
                    >
                      <tr>
                        <th className="th-style">Employee</th>
                        <th className="th-style">Date</th>
                        <th className="th-style">In</th>
                        <th className="th-style">Out</th>
                        {secureData.instituteId == 2 ? null : (
                          <>
                            <th className="th-style">WH(HR)</th>
                            <th className="th-style">PWH(HR)</th>
                            <th className="th-style">WT(MIN)</th>
                            <th className="th-style">AWT(MIN)</th>
                            <th className="th-style">ST(MIN)</th>
                            <th className="th-style">Machine</th>
                            <th className="th-style">Item/Break</th>
                            <th className="th-style">Operation</th>
                            <th className="th-style">Cycle Time</th>
                            <th className="th-style">REQ</th>
                            <th className="th-style">ACT</th>
                            <th className="th-style">OK</th>
                            <th className="th-style">M/R</th>
                            <th className="th-style">R/W</th>
                            <th className="th-style">D/F</th>
                            <th className="th-style">U/M</th>
                          </>
                        )}
                        <th className="th-style">Wages Per Day</th>
                        <th className="th-style">Hour Wages</th>
                        {secureData.instituteId == 2 ? null : (
                          <>
                            <th className="th-style">Point Wages</th>
                            <th className="th-style">PCS Wages</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {attendanceData &&
                        attendanceData.map((value, key) => {
                          return (
                            <tr key={key}>
                              <td>{value.fullName}</td>
                              <td>{value.attendanceDate}</td>
                              <td>
                                {value.checkInTime != null
                                  ? moment(
                                      value.checkInTime,
                                      "YYYY-MM-DD HH:mm:ss"
                                    ).format("LT")
                                  : ""}
                              </td>
                              <td>
                                {value.checkOutTime != null &&
                                value.checkOutTime != ""
                                  ? moment(
                                      value.checkOutTime,
                                      "YYYY-MM-DD HH:mm:ss"
                                    ).format("LT")
                                  : ""}
                              </td>
                              {secureData.instituteId == 2 ? null : (
                                <>
                                  <td>{value.workingHour}</td>
                                  <td>{value.prodWorkingHour}</td>
                                  <td>
                                    {value.totalWorkTime != null
                                      ? value.totalWorkTime
                                      : "-"}
                                  </td>
                                  <td>{value.actualWorkTime}</td>
                                  <td>{value.breakTime}</td>
                                  <td>
                                    {value.machineNo != null
                                      ? value.machineNo
                                      : "-"}
                                  </td>
                                  <td>
                                    {value.jobName != null
                                      ? value.jobName
                                      : value.workBreakName != null
                                      ? value.workBreakName
                                      : "-"}
                                  </td>
                                  <td>
                                    {value.jobOperationName != null
                                      ? value.jobOperationName
                                      : "-"}
                                  </td>
                                  <td>
                                    {value.cycleTime != null
                                      ? value.cycleTime
                                      : "-"}
                                  </td>
                                  <td>
                                    {value.requiredQty != null
                                      ? value.requiredQty
                                      : 0}
                                  </td>
                                  <td>
                                    {value.actualQty != null
                                      ? value.actualQty
                                      : 0}
                                  </td>

                                  <td>
                                    {value.okQty != null ? value.okQty : 0}
                                  </td>
                                  <td>
                                    {value.machineRejectQty != null
                                      ? value.machineRejectQty
                                      : 0}
                                  </td>
                                  <td>
                                    {value.reworkQty != null
                                      ? value.reworkQty
                                      : 0}
                                  </td>
                                  <td>
                                    {value.doubtfulQty != null
                                      ? value.doubtfulQty
                                      : 0}
                                  </td>
                                  <td>
                                    {value.unMachinedQty != null
                                      ? value.unMachinedQty
                                      : 0}
                                  </td>
                                </>
                              )}
                              <td>
                                {value.wagesPerDay != null
                                  ? value.wagesPerDay
                                  : 0}
                              </td>
                              <td>
                                {value.wagesInHour != null
                                  ? value.wagesInHour
                                  : 0}
                              </td>
                              {secureData.instituteId == 2 ? null : (
                                <>
                                  <td>
                                    {value.wagesInPoint != null
                                      ? value.wagesInPoint
                                      : 0}
                                  </td>
                                  <td>
                                    {value.wagesInPcs != null
                                      ? value.wagesInPcs
                                      : 0}
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default WithUserPermission(AttendanceHistory);
