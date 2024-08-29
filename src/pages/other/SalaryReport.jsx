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
import sample from "./sample";
import {
  listOfEmployee,
  getEmployeeAttendanceHistory,
  getSalaryReportMonthWise,
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
  getEmployeeSalaryReportInExcelUrl,
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
      breakInnerData: "",
      mainData: "",
      attendanceDate: moment(new Date()).format("YYYY-MM"),
      secureData: JSON.parse(localStorage.getItem("loginUser")),
    };
  }

  getSalaryMonthWise = () => {
    console.log("getSalaryMonthWise");
    console.log(moment(new Date()).format("YYYY-MM-DD"));

    let requestData = {
      // currentMonth: moment(values.fromDate).format("YYYY-MM-DD"),
      currentMonth: this.state.attendanceDate,
      employeeId: "all",
    };

    getSalaryReportMonthWise(requestData)
      .then((response) => {
        // resetForm();
        var result = response.data;
        console.log({ result });
        console.log("resultA.response", result.response);
        if (result.responseStatus == 200) {
          console.log("200");
          // setSubmitting(false);
          this.setState({
            isLoading: true,
            attendanceData: result.response,
          });

          if (result.response.length == 0) {
            toast.error("✘ No Task Data Found");
          }
        } else {
          // setSubmitting(false);
          this.setState({ isLoading: false, attendanceData: [] });
          toast.error("✘ No Data Found");
        }
      })
      .catch((error) => {
        setSubmitting(false);
        toast.error("✘ " + error);
      });
  };

  getEmpOptions = () => {
    listOfEmployee()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        // if (res.responseStatus == 200) {
        //   let result = res.response;
        //   console.log(res.response);

        //   let opt = result.map(function (data) {
        //     return {
        //       value: data.id,
        //       label: data.employeeName,
        //     };
        //   });
        //   this.setState({ empOpt: opt });
        // }

        if (res.responseStatus == 200) {
          let result = res.response;
          let opt = [
            {
              value: "all",
              label: "All",
            },
          ];
          result.map(function (data) {
            opt.push({
              value: data.id,
              label: data.employeeName,
            });
          });
          console.log(opt);
          this.setState({ empOpt: opt });
          //   , () => {
          //   this.formRef.current.setFieldValue("employeeId", opt[0]);
          // });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  getReport = (values) => {
    let filename =
      "emp_salary_report" + moment().format("YYYY-MM-DD HH:MM:ss") + ".xlsx";

    const requestOption = {
      method: "GET",
      headers: getHeader(),
    };

    return fetch(
      getEmployeeSalaryReportInExcelUrl(
        values.employeeId.value == undefined ? "all" : values.employeeId.value,
        moment(values.currentMonth).format("YYYY-MM")
      ),
      requestOption
    )
      .then((response) => response.blob())
      .then((blob) => {
        // 1. Convert the data into 'blob'
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

  fixFloat = (amt) => {
    return amt.toFixed(2)
  }

  // test=()=>{

  // }

  componentDidMount() {
    this.getEmpOptions();
    this.getSalaryMonthWise();
  }

  render() {
    const { isLoading, empOpt, attendanceData, currMonth, secureData } =
      this.state;

    return (
      <div className="emp">
        {console.log(this.state)}
        <Card>
          <CardBody className="border-bottom p-2">
            <CardTitle>Salary Report</CardTitle>

            <div>
              <Formik
                innerRef={this.formRef}
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={{
                  currentMonth: moment(new Date()).format("YYYY-MM"),
                  employeeId: "",
                }}
                validationSchema={Yup.object().shape({
                  currentMonth: Yup.string().required("From Date is required"),

                  employeeId: Yup.object().required("Select Employee"),
                })}
                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                  // console.log(values.employeeId.value)
                  // console.log(values.currentMonth)

                  this.setState(
                    {
                      isLoading: false,
                      // attendanceData: [],
                    },
                    () => {
                      let requestData = {
                        // currentMonth: moment(values.fromDate).format("YYYY-MM-DD"),
                        currentMonth: values.currentMonth,
                        employeeId: values.employeeId.value,
                      };

                      getSalaryReportMonthWise(requestData)
                        .then((response) => {
                          // resetForm();
                          var result = response.data;
                          console.log({ result });
                          console.log("resultA.response", result.response);
                          if (result.responseStatus == 200) {
                            console.log("200");
                            // setSubmitting(false);
                            this.setState({
                              isLoading: true,
                              attendanceData: result.response,
                            });

                            if (result.response.length == 0) {
                              toast.error("✘ No Task Data Found");
                            }
                          } else {
                            // setSubmitting(false);
                            this.setState({
                              isLoading: false,
                              attendanceData: [],
                            });
                            toast.error("✘ Invalid Year");
                          }
                        })
                        .catch((error) => {
                          setSubmitting(false);
                          toast.error("✘ " + error);
                        });
                    }
                  );
                  setStatus();
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
                            Select Month <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="month"
                            name="currentMonth"
                            id="currentMonth"
                            onChange={handleChange}
                            value={values.currentMonth}
                            invalid={errors.currentMonth ? true : false}
                          />
                          <FormFeedback>{errors.currentMonth}</FormFeedback>
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
                        &nbsp;
                        <FormGroup>
                          {isLoading ? (
                            <>
                              <Button
                                type="submit"
                                className="mainbtn1 text-white report-show-btn"
                              >
                                Show
                              </Button>
                              <Button
                                type="button"
                                className="mainbtn1 text-white report-show-btn"
                                style={{ marginLeft: "10px" }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  // console.log({ values });
                                  // this.getPDFReport(values);
                                  this.getReport(values);
                                }}
                              >
                                Export To Excel
                              </Button>
                            </>
                          ) : (
                            isActionExist(
                              "salary-reports",
                              "view",
                              this.props.userPermissions
                            ) && (
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
                            )
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                )}
              />
            </div>

            {/* <pre>{JSON.stringify(attendanceData)}</pre> */}
            {/* {attendanceData && attendanceData.length > 0 && ( */}
            <div className="container-fluid">
              <div className="attendance-tbl">
                <Table bordered size="sm" className="main-tbl-style">
                  <thead
                    style={{
                      backgroundColor: "#F6F5F7",
                    }}
                    className="datastyle-head"
                  >
                    <tr>
                      <th className="th-style"></th>
                      <th className="th-style">Name</th>
                      {/* <th className="th-style">Designation</th> */}
                      <th className="th-style">Salary</th>
                      <th className="th-style">Present Days</th>
                      <th className="th-style">Absent Days</th>
                      <th className="th-style">Extra Half</th>
                      <th className="th-style">Extra Present</th>
                      <th className="th-style">Present</th>
                      <th className="th-style">Absent</th>
                      <th className="th-style">Extra Pay</th>
                      <th className="th-style">Late Amt</th>
                      <th className="th-style">Advance Amt</th>
                      <th className="th-style">OT Amt</th>
                      <th className="th-style">Total Amt</th>
                      {/* <th className="th-style">PF</th>
                      <th className="th-style">ESI</th> */}
                      <th className="th-style">Drawn</th>
                    </tr>
                  </thead>
                  {isLoading ? (
                    <tbody
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {attendanceData.list &&
                        attendanceData.list.map((v, i) => {
                          console.log(v);
                          return (
                            <>
                              <tr>
                                {v.attData != "" ? (
                                  <td style={{ width: "2%" }}>
                                    <Button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        console.log(
                                          parseInt(this.state.breakInnerData) +
                                          "==" +
                                          parseInt(i)
                                        );
                                        if (
                                          parseInt(this.state.breakInnerData) ==
                                          parseInt(i)
                                        )
                                          this.setState({
                                            breakInnerData: "",
                                          });
                                        else {
                                          console.log(parseInt(i));
                                          this.setState({
                                            breakInnerData: parseInt(i),
                                          });
                                        }
                                      }}
                                      className="btn-arrow-style"
                                    >
                                      {parseInt(this.state.breakInnerData) ==
                                        parseInt(i) ? (
                                        <i
                                          class="fa fa-caret-down"
                                          aria-hidden="true"
                                        ></i>
                                      ) : (
                                        <i
                                          class="fa fa-caret-right"
                                          aria-hidden="true"
                                        ></i>
                                      )}
                                    </Button>
                                  </td>
                                ) : (
                                  <td style={{ width: "2%" }}></td>
                                )}
                                <td>{v.employeeName}</td>
                                {/* <td>{v.designation}</td> */}
                                <td>{v.salaryPerMonth}</td>
                                <td>{v.presentDays}</td>
                                <td>{v.absentDays}</td>
                                <td>{v.extraHalfDays}</td>
                                <td>{v.extraDays}</td>
                                <td>{v.presentDaysSalary.toFixed(2)}</td>
                                <td>{v.absentDaysSalary.toFixed(2)}</td>
                                <td>{v.extraDaysSalary.toFixed(2)}</td>
                                <td>{v.latePunchDeductionAmt.toFixed(2)}</td>
                                <td>
                                  {v.advanceAmt.toFixed(2)}
                                </td>
                                <td>{v.overtimeAmount.toFixed(2)}</td>
                                <td>{v.workedDaysSalary.toFixed(2)}</td>
                                {/* <td>{v.pf}</td>
                                <td>{v.esi}</td> */}
                                <td>{v.salaryDrawn.toFixed(2)}</td>
                              </tr>

                              {v.attData != "" ? (
                                <>
                                  {
                                    console.log("v==>", v)
                                  }
                                  {/* {console.log(this.state.breakInnerData) +"=="+ parseInt(i)}) */}
                                  <tr
                                    className={`${parseInt(this.state.breakInnerData) ==
                                      parseInt(i)
                                      ? ""
                                      : " d-none"
                                      }`}
                                  >
                                    <td
                                      colSpan={24}
                                      className="bg-white inner-tbl-td"
                                      // style={{ padding: "0px" }}
                                    >
                                      <Table
                                        bordered
                                        responsive
                                        size="sm"
                                        className={`${parseInt(this.state.breakInnerData) ==
                                          parseInt(i)
                                          ? "mb-0"
                                          : "mb-0 d-none"
                                          }`}
                                      >
                                        <thead
                                          style={{
                                            background: "#FBF3D0",
                                          }}
                                          className="datastyle-head"
                                        >
                                          <tr>
                                            <th className="th-style"></th>
                                            <th className="th-style">Date</th>
                                            <th className="th-style">
                                              Employee Name
                                            </th>
                                            <th className="th-style">In</th>
                                            <th className="th-style">Out</th>

                                            {/* <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Total Break Time</th> */}
                                          </tr>
                                        </thead>
                                        <tbody
                                          style={{
                                            background: "#FEFCF3",
                                            textAlign: "center",
                                          }}
                                        >
                                          {v.attData &&
                                            v.attData.map((vi, ii) => {
                                              {
                                                console.log(vi);
                                              }
                                              return (
                                                <>
                                                  <tr>
                                                    {vi.breakData != "" ? (
                                                      <td
                                                        style={{ width: "2%" }}
                                                      >
                                                        <Button
                                                          onClick={(e) => {
                                                            e.preventDefault();
                                                            if (
                                                              parseInt(
                                                                this.state
                                                                  .mainData
                                                              ) == parseInt(ii)
                                                            )
                                                              // setMainData("");
                                                              this.setState({
                                                                mainData: "",
                                                              });
                                                            else {
                                                              // setMainData(ii);
                                                              // setMainInnerData("");
                                                              // setBreakInnerData("");
                                                              this.setState({
                                                                mainData: ii,
                                                                // breakInnerData:""
                                                              });
                                                            }
                                                          }}
                                                          className="btn-arrow-style"
                                                        >
                                                          {parseInt(
                                                            this.state.mainData
                                                          ) == parseInt(ii) ? (
                                                            <i
                                                              class="fa fa-caret-down"
                                                              aria-hidden="true"
                                                            ></i>
                                                          ) : (
                                                            <i
                                                              class="fa fa-caret-right"
                                                              aria-hidden="true"
                                                            ></i>
                                                          )}
                                                        </Button>
                                                      </td>
                                                    ) : (
                                                      <td
                                                        style={{ width: "2%" }}
                                                      ></td>
                                                    )}

                                                    <td>{vi.attendanceDate}</td>
                                                    <td>{vi.employeeName}</td>

                                                    <td>
                                                      {vi.checkInTime != "" ? (
                                                        <>
                                                          {moment(
                                                            vi.checkInTime
                                                          ).format("HH:mm:ss")}
                                                        </>
                                                      ) : (
                                                        ""
                                                      )}
                                                    </td>
                                                    <td>
                                                      {vi.checkOutTime != "" ? (
                                                        <>
                                                          {moment(
                                                            vi.checkOutTime
                                                          ).format("HH:mm:ss")}
                                                        </>
                                                      ) : (
                                                        ""
                                                      )}
                                                    </td>
                                                  </tr>

                                                  {/* nested */}
                                                  {vi.breakData != "" ? (
                                                    <tr
                                                      className={`${parseInt(
                                                        this.state.mainData
                                                      ) == parseInt(ii)
                                                        ? ""
                                                        : " d-none"
                                                        }`}
                                                    >
                                                      <td
                                                        colSpan={24}
                                                        className="bg-white inner-tbl-td"
                                                      >
                                                        <Table
                                                          bordered
                                                          responsive
                                                          size="sm"
                                                          className={`${parseInt(
                                                            this.state
                                                              .mainData
                                                          ) == parseInt(ii)
                                                            ? "mb-0"
                                                            : "mb-0 d-none"
                                                            }`}
                                                        >
                                                          <thead
                                                            style={{
                                                              background:
                                                                "#C6E6EC",
                                                            }}
                                                            className="datastyle-head"
                                                          >
                                                            <tr>
                                                              {/* <th>Break Name</th> */}
                                                              <th>Start</th>
                                                              <th>End</th>
                                                              <th>
                                                                Total(MIN)
                                                              </th>
                                                              <th>Work Done</th>
                                                              <th>
                                                                Break Wages
                                                              </th>
                                                              <th>Remark</th>
                                                              <th>
                                                                End Remark
                                                              </th>
                                                              <th>
                                                                Admin Remark
                                                              </th>
                                                              {/* <th>Action</th> */}
                                                            </tr>
                                                          </thead>
                                                          {console.log(
                                                            "vi.breakData"
                                                          )}

                                                          {/* {console.log(
                                                            vi.breakData[0]
                                                          )} */}
                                                          <tbody
                                                            style={{
                                                              background:
                                                                "#EFFCFC",
                                                              textAlign:
                                                                "center",
                                                            }}
                                                          >
                                                            {vi.breakData[0]
                                                              .breakList &&
                                                              vi.breakData[0].breakList.map(
                                                                (vii, iii) => {
                                                                  return (
                                                                    <tr>
                                                                      {console.log(
                                                                        "vii"
                                                                      )}
                                                                      {console.log(
                                                                        vii
                                                                      )}

                                                                      {/* <td>
                                                                {vii.breakName}
                                                              </td> */}
                                                                      <td>
                                                                        {vii.startTime !=
                                                                          "" ? (
                                                                          <>
                                                                            {/* <span
                                                                      style={{
                                                                        fontSize:
                                                                          "12px",
                                                                      }}
                                                                    >
                                                                      (
                                                                      {moment(
                                                                        vii.startTime
                                                                      ).format(
                                                                        "D-M"
                                                                      )}
                                                                      )
                                                                    </span> */}
                                                                            {moment(
                                                                              vii.startTime
                                                                            ).format(
                                                                              "HH:mm:ss"
                                                                            )}
                                                                          </>
                                                                        ) : (
                                                                          ""
                                                                        )}
                                                                        {/* {vii.startTime} */}
                                                                      </td>
                                                                      <td>
                                                                        {vii.endTime !=
                                                                          "" ? (
                                                                          <>
                                                                            <span
                                                                              style={{
                                                                                fontSize:
                                                                                  "12px",
                                                                              }}
                                                                            >
                                                                              {/* (
                                                                      {moment(
                                                                        vii.endTime
                                                                      ).format(
                                                                        "D-M"
                                                                      )}
                                                                      ) */}
                                                                            </span>
                                                                            {moment(
                                                                              vii.endTime
                                                                            ).format(
                                                                              "HH:mm:ss"
                                                                            )}
                                                                          </>
                                                                        ) : (
                                                                          ""
                                                                        )}
                                                                        {/* {vii.endTime} */}
                                                                      </td>
                                                                      <td>
                                                                        {
                                                                          vii.totalTime
                                                                        }
                                                                      </td>
                                                                      <td>
                                                                        {
                                                                          vii.workDone
                                                                        }
                                                                      </td>
                                                                      <td>
                                                                        {
                                                                          vii.breakWages
                                                                        }
                                                                      </td>
                                                                      <td>
                                                                        {
                                                                          vii.remark
                                                                        }
                                                                      </td>
                                                                      <td>
                                                                        {
                                                                          vii.endRemark
                                                                        }
                                                                      </td>
                                                                      <td>
                                                                        {
                                                                          vii.adminRemark
                                                                        }
                                                                      </td>
                                                                      {/* <td>
                                                                        <Button
                                                                          onClick={(
                                                                            e
                                                                          ) => {
                                                                            e.preventDefault();
                                                                            taskDetails(
                                                                              true,
                                                                              vii.taskId
                                                                            );
                                                                          }}
                                                                          color="white"
                                                                          size="sm"
                                                                          round="true"
                                                                          icon="true"
                                                                        >
                                                                          <i
                                                                            className="fa fa-edit"
                                                                            style={{
                                                                              color:
                                                                                "#ffb22b",
                                                                            }}
                                                                          />
                                                                        </Button>
                                                                        <Button
                                                                          onClick={(
                                                                            e
                                                                          ) => {
                                                                            console.log(
                                                                              "row ",
                                                                              v
                                                                            );
                                                                            e.preventDefault();
                                                                            deleteTaskFun(
                                                                              vii.taskId
                                                                            );
                                                                          }}
                                                                          color="white"
                                                                          size="sm"
                                                                          round="true"
                                                                          icon="true"
                                                                        >
                                                                          <i
                                                                            className="fa fa-trash"
                                                                            style={{
                                                                              color:
                                                                                "red",
                                                                            }}
                                                                          />
                                                                        </Button>
                                                                      </td> */}
                                                                    </tr>
                                                                  );
                                                                }
                                                              )}
                                                          </tbody>
                                                        </Table>
                                                      </td>
                                                    </tr>
                                                  ) : (
                                                    ""
                                                  )}
                                                </>
                                              );
                                            })}
                                        </tbody>
                                      </Table>
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                ""
                              )}
                            </>
                          );
                        })}

                      <tr >
                        {attendanceData.salaryTotalArray &&
                          attendanceData.salaryTotalArray.map((item, key) => {
                            return (
                              <>
                                <td></td>
                                <td style={{
                                  fontWeight: "600"
                                }}>Total</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>

                                <td style={{
                                  fontWeight: "600"
                                }}>{this.fixFloat(item.totalPresentAmt)}</td>
                                <td style={{
                                  fontWeight: "600"
                                }}>{this.fixFloat(item.totalAbsentAmt)}</td>
                                <td style={{
                                  fontWeight: "600"
                                }}>{this.fixFloat(item.totalExtraPayAmt)}</td>
                                <td style={{
                                  fontWeight: "600"
                                }}>{this.fixFloat(item.totalLateAmt)}</td>

                                <td style={{
                                  fontWeight: "600"
                                }}>{this.fixFloat(item.totalAdvanceAmt)}</td>
                                <td style={{
                                  fontWeight: "600"
                                }}>{this.fixFloat(item.totalOTAmt)}</td>
                                <td style={{
                                  fontWeight: "600"
                                }}>{this.fixFloat(item.totalAmt)}</td>
                                <td style={{
                                  fontWeight: "600"
                                }}>{this.fixFloat(item.totalDrawnAmt)}</td>

                              </>
                            )
                          })}


                      </tr>
                    </tbody>
                  ) : (
                    <Spinner size="lg" color="secondary" />

                  )}
                </Table>
              </div>
            </div>

            {/* )} */}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default WithUserPermission(AttendanceHistory);
