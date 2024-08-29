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
  Table, // CardHeader,
} from "reactstrap";

import Select from "react-select";
import {
  MyDatePicker,
  getHeader,
  WithUserPermission,
  isActionExist,
} from "@/helpers";
import {
  getFinalLineInspectionListWithFilter,
  listOfJobsForSelect,
  listJobOperation,
  listOfEmployee,
} from "@/services/api_function";

import { exportExcelFinalEmployeeInspectionUrl } from "@/services/api";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

class FinalInspectionReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      mainData: "",
      mainInnerData: "",
      jobOpts: [],
      jobOperationOpts: [],
      empOpts: [],
      drawingArray: [],
      jobNoArray: [],
      resultArray: [],
    };
  }

  listOfJobsForSelectFun = () => {
    listOfJobsForSelect()
      .then((response) => {
        let jobOpts =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.jobName,
            };
          });
        this.setState({ jobOpts: jobOpts });
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  getJobOperationList = (jobId) => {
    let reqData = {
      jobId: jobId,
    };
    listJobOperation(reqData)
      .then((response) => {
        this.setState({ jobOperationOp: [] });
        if (response.data.responseStatus == 200) {
          let jobOperationOp =
            response.data.response &&
            response.data.response.map(function (values) {
              return {
                value: values.id,
                label: values.operationName,
                dataExist: values.dataExist,
                cycleTime: values.cycleTime,
                averagePerShift: values.averagePerShift,
                pointPerJob: values.pointPerJob,
                jobsHourBasis: values.jobsHourBasis,
              };
            });
          this.setState({ jobOperationOpts: jobOperationOp });
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  getEmpOptions = () => {
    listOfEmployee()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt1 = [];
          result.map(function (data) {
            opt1.push({
              value: data.id,
              label: data.employeeName,
            });
          });
          this.setState({ empOpts: opt1 });
        } else {
          this.setState({ empOpts: [] });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  exportData = (values) => {
    this.setState({ isLoading: true }, () => {
      let requestData = {
        fromDate:
          values.fromDate != null
            ? moment(values.fromDate).format("YYYY-MM-DD")
            : "",
        toDate:
          values.toDate != null
            ? moment(values.toDate).format("YYYY-MM-DD")
            : "",
        employeeId:
          values.employeeId != "" && values.employeeId != null
            ? values.employeeId.value
            : "",
        jobId: values.jobId != null ? values.jobId.value : "",
        jobOperationId:
          values.jobOperationId != null ? values.jobOperationId.value : "",
      };

      let filename = "emp_final_inspection_sheet.xlsx";

      const requestOption = {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(requestData),
      };

      return fetch(exportExcelFinalEmployeeInspectionUrl(), requestOption)
        .then((response) => {
          return response.blob();
        })
        .then((blob) => {
          this.setState({ isLoading: false });
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
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          console.log({ error });
        });
    });
  };

  componentDidMount() {
    this.listOfJobsForSelectFun();
    this.getEmpOptions();
  }

  render() {
    const {
      isLoading,
      jobOpts,
      jobOperationOpts,
      empOpts,
      mainData,
      drawingArray,
      jobNoArray,
      resultArray,
    } = this.state;

    return (
      <div className="emp">
        <Card>
          <CardBody className="border-bottom p-2">
            <CardTitle>Final Inspection Report</CardTitle>

            <div>
              <Formik
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={{
                  fromDate: new Date(),
                  toDate: new Date(),
                  jobId: "",
                  jobOperationId: "",
                  employeeId: "",
                }}
                validationSchema={Yup.object().shape({
                  fromDate: Yup.string().required("From Date is required"),
                  toDate: Yup.string().required("To Date is required"),
                  jobId: Yup.object().required("Job is required"),
                  jobOperationId: Yup.object().required(
                    "Job Operation is required"
                  ),
                })}
                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                  this.setState({ isLoading: true, itemData: [] });
                  setStatus();
                  let requestData = {
                    fromDate: moment(values.fromDate).format("YYYY-MM-DD"),
                    toDate: moment(values.toDate).format("YYYY-MM-DD"),
                    jobId:
                      values.jobId != "" && values.jobId != null
                        ? values.jobId.value
                        : "",
                    jobOperationId:
                      values.jobOperationId != "" &&
                      values.jobOperationId != null
                        ? values.jobOperationId.value
                        : "",
                    employeeId:
                      values.employeeId != "" && values.employeeId != null
                        ? values.employeeId.value
                        : "",
                  };

                  getFinalLineInspectionListWithFilter(requestData)
                    .then((response) => {
                      // resetForm();
                      var result = response.data;
                      console.log({ result });
                      console.log("result.response", result.response);
                      if (result.responseStatus == 200) {
                        setSubmitting(false);
                        console.log("resultArray :", result.resultArray);
                        this.setState(
                          {
                            isLoading: false,
                            drawingArray: result.drawingArray,
                            jobNoArray: result.jobNoArray,
                            resultArray: result.resultArray,
                          },
                          () => {
                            if (result.drawingArray.length == 0) {
                              toast.error("✘ No Data Found");
                            }
                          }
                        );
                      } else {
                        setSubmitting(false);
                        this.setState({ isLoading: false, mainData: [] });
                        toast.error("✘ No Data Found");
                      }
                    })
                    .catch((error) => {
                      setSubmitting(false);
                      this.setState({ isLoading: false, mainData: [] });
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
                            maxDate={new Date()}
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
                          <MyDatePicker
                            autoComplete="off"
                            className="datepic form-control"
                            name="toDate"
                            placeholderText="dd/MM/yyyy"
                            id="toDate"
                            dateFormat="dd/MM/yyyy"
                            value={values.toDate}
                            onChange={(e) => {
                              console.log("date ", e);
                              setFieldValue("toDate", e);
                            }}
                            selected={values.toDate}
                            maxDate={new Date()}
                          />
                          <span className="text-danger">{errors.toDate}</span>
                        </FormGroup>
                      </Col>

                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            Select Job <span className="text-danger">*</span>
                          </Label>
                          <Select
                            placeholder="Select Item"
                            ////isClearable={true}
                            styles={{
                              clearIndicator: ClearIndicatorStyles,
                            }}
                            onChange={(v) => {
                              setFieldValue("jobId", "");
                              if (v != null) {
                                setFieldValue("jobId", v);
                                this.getJobOperationList(v.value);
                              }
                            }}
                            name="jobId"
                            id="jobId"
                            options={jobOpts}
                            value={values.jobId}
                          />
                          <span className="text-danger">{errors.jobId}</span>
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            Select Job Operation{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            placeholder="Select Operation"
                            ////isClearable={true}
                            styles={{
                              clearIndicator: ClearIndicatorStyles,
                            }}
                            onChange={(v) => {
                              setFieldValue("jobOperationId", "");
                              if (v != null) {
                                setFieldValue("jobOperationId", v);
                              }
                            }}
                            name="jobOperationId"
                            id="jobOperationId"
                            options={jobOperationOpts}
                            value={values.jobOperationId}
                          />
                          <span className="text-danger">
                            {errors.jobOperationId}
                          </span>
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">Select Employee</Label>
                          <Select
                            placeholder="Select Employee"
                            ////isClearable={true}
                            styles={{
                              clearIndicator: ClearIndicatorStyles,
                            }}
                            onChange={(v) => {
                              setFieldValue("employeeId", "");
                              if (v != null) {
                                setFieldValue("employeeId", v);
                              }
                            }}
                            name="employeeId"
                            id="employeeId"
                            options={empOpts}
                            value={values.employeeId}
                          />
                        </FormGroup>
                      </Col>

                      <Col md="2">
                        <Row>
                          <Col md="6">
                            {isLoading ? (
                              <Button
                                className="mainbtn1 text-white mr-2 report-show-btn"
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
                                "final-inspection-report",
                                "view",
                                this.props.userPermissions
                              ) && (
                                <Button
                                  type="submit"
                                  className="mainbtn1 text-white mr-2 report-show-btn"
                                >
                                  Show
                                </Button>
                              )
                            )}
                          </Col>
                          <Col md="6">
                            {isLoading ? (
                              <Button
                                className="mainbtn1 text-white mr-2 report-show-btn"
                                type="button"
                                disabled={isLoading}
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
                              <Button
                                type="button"
                                className="mainbtn1 text-white mr-2 report-show-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log("errors.length ", errors);
                                  if (
                                    values.fromDate != "" &&
                                    values.toDate != "" &&
                                    values.jobId != "" &&
                                    values.jobOperationId != ""
                                  ) {
                                    this.exportData(values);
                                  }
                                }}
                              >
                                Export Excel
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </Col>
                      {/* 
                      <Col md="2">
                       
                      </Col> */}
                    </Row>
                  </Form>
                )}
              />
            </div>

            {/* {JSON.stringify(resultArray[0])} */}

            {jobNoArray && jobNoArray.length > 0 && (
              <Row>
                <Col md="12">
                  <div className="attendance-tbl">
                    <Table bordered size="sm" className="main-tbl-style">
                      <thead
                        style={{
                          backgroundColor: "#F6F5F7",
                        }}
                        className="datastyle-head"
                      >
                        <tr>
                          <th
                            style={{
                              left: "-1px",
                              zIndex: "91",
                            }}
                          >
                            Job No
                          </th>

                          {drawingArray.map((dv) => {
                            return (
                              <th>
                                {dv.specification}
                                <br />
                                {" (" + dv.drawingSize + " )"}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {jobNoArray.map((v, i) => {
                          return (
                            <tr>
                              <td
                                style={{
                                  position: "sticky",
                                  left: "-1px",
                                  zIndex: "9",
                                  background: "#f5f6f7",
                                }}
                              >
                                {v}
                              </td>
                              {resultArray[i].map((rv, ri) => {
                                return (
                                  <td
                                    className={
                                      rv.sizeResult == "true"
                                        ? "greenColor"
                                        : rv.sizeResult == "false"
                                        ? "redColor"
                                        : ""
                                    }
                                  >
                                    {rv.actualSize}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            )}

            {jobNoArray.length == 0 && (
              <Row>
                <Col md="12">
                  <div className="attendance-tbl">
                    <Table bordered size="sm" className="main-tbl-style">
                      <tr>
                        <td>No Data Exists</td>
                      </tr>
                    </Table>
                  </div>
                </Col>
              </Row>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default WithUserPermission(FinalInspectionReport);
