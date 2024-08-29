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
import "@/assets/scss/all/custom/tbl.scss";
import {
  listOfEmployee,
  getEmployeeYearlyPresent,
  exportEmployeeAttendanceReport,
} from "@/services/api_function";

import { getHeader, WithUserPermission, isActionExist } from "@/helpers";

import { exportEmployeeAttendanceReportUrl } from "@/services/api";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

class EmpYearlyPresenty extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.state = {
      isLoading: false,
      empOpt: [],
      attendanceData: [],
    };
  }

  getEmpOptions = () => {
    listOfEmployee()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;

          let opt1 = [
            {
              value: "all",
              label: "ALL",
            },
          ];
          result.map(function (data) {
            opt1.push({
              value: data.id,
              label: data.employeeName,
            });
          });
          this.setState({ empOpt: opt1 });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // getReport = (values) => {
  //   let filename =
  //     "emp_att_" + moment().format("YYYY-MM-DD HH:MM:ss") + ".xlsx";

  //   exportEmployeeAttendanceReport(
  //     values.fromDate,
  //     values.toMonth,
  //     values.employeeId.value
  //   )
  //     .then((response) => {
  //       console.log({ response });
  //     })
  //     .then((blob) => {
  //       // 1. Convert the data into 'blob'
  //       console.log({ blob });

  //       // 2. Create blob link to download
  //       const url = window.URL.createObjectURL(new Blob([blob]));
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute("download", `${filename}`);
  //       filename// 3. Append to html page
  //       document.body.appendChild(link);
  //       // 4. Force download
  //       link.click();
  //       // 5. Clean up and remove the link
  //       link.parentNode.removeChild(link);
  //       return true;
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // };

  getReport = (values) => {
    let filename =
      "emp_att_" + moment().format("YYYY-MM-DD HH:MM:ss") + ".xlsx";

    const requestOption = {
      method: "GET",
      headers: getHeader(),
    };

    return fetch(
      exportEmployeeAttendanceReportUrl(
        values.fromMonth,
        values.toMonth,
        values.employeeId.value
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

  componentDidMount() {
    this.getEmpOptions();
  }

  render() {
    const { isLoading, empOpt, attendanceData } = this.state;

    return (
      <div className="emp">
        <Card>
          <CardBody className="border-bottom p-2">
            <CardTitle>Employee Yearly Presenty</CardTitle>
            <div>
              <Formik
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={{
                  fromMonth: "",
                  toMonth: "",
                  employeeId: "",
                }}
                validationSchema={Yup.object().shape({
                  fromMonth: Yup.string().required("From month is required"),
                  toMonth: Yup.string().required("To month is required"),
                  employeeId: Yup.object().required("Select Employee"),
                })}
                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                  this.setState({ isLoading: true, attendanceData: [] });
                  setStatus();
                  let requestData = {
                    fromMonth: values.fromMonth,
                    toMonth: values.toMonth,
                    employeeId: values.employeeId.value,
                  };

                  getEmployeeYearlyPresent(requestData)
                    .then((response) => {
                      // resetForm();
                      var result = response.data;
                      console.log({ result });
                      console.log("result.response", result.responseObject);
                      if (result.responseStatus == 200) {
                        setSubmitting(false);
                        this.setState({
                          isLoading: false,
                          attendanceData: result.responseObject,
                        });
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
                            Select From Month{" "}
                            <span className="text-danger">*</span>
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
                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            Select To Month{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="month"
                            name="toMonth"
                            id="toMonth"
                            onChange={handleChange}
                            value={values.toMonth}
                            invalid={errors.toMonth ? true : false}
                          />
                          <FormFeedback>{errors.toMonth}</FormFeedback>
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
                            "yearly-presenty",
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
                            this.getReport(values);
                          }}
                        >
                          Export To Excel
                        </Button>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                )}
              />
            </div>
            {/* {JSON.stringify(attendanceData)} */}

            <Row>
              <Col md="12" className="tbl-style">
                <div className="attendance-tbl">
                  <Table
                    aria-label="simple table"
                    // responsive
                    bordered
                    size="sm"
                    className="main-tbl-style"
                  >
                    <thead
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <tr>
                        <th className="tblalignment">SR NO</th>
                        <th className="tblalignment">Name</th>
                        <th className="tblalignment">Avg</th>
                        <th className="tblalignment">Total</th>

                        {attendanceData.length > 0 &&
                          attendanceData[0]["months"].map((v) => {
                            return <th className="tblalignment">{v}</th>;
                          })}
                      </tr>
                    </thead>

                    <tbody>
                      {attendanceData.length > 0 &&
                        attendanceData.map((v, i) => {
                          if (i != 0) {
                            return (
                              <tr>
                                {/* <td className="td-style">{i++}</td> */}
                                <td>{i++}</td>
                                <td>{v.employeeName}</td>
                                <td>{v.avg}</td>
                                <td>{v.totalDaysInYear}</td>
                                {v.attendance.map((vi) => {
                                  return <td>{vi}</td>;
                                })}
                              </tr>
                            );
                          }
                        })}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default WithUserPermission(EmpYearlyPresenty);
