import React, { Component, useRef, useState, useEffect } from "react";
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
import { Tab, Tabs } from "react-bootstrap";
import Select from "react-select";
import {
  MyDatePicker,
  getHeader,
  WithUserPermission,
  isActionExist,
  ledger_select,
} from "@/helpers";
import LayoutCustom from "@/pages/layout/LayoutCustom";
import {
  getLineInspectionListWithFilter,
  listOfJobsForSelect,
  listJobOperation,
  listOfEmployee,
  getMachineListFromInspectionData,
  getJobListFromInspectionData,
  getJobOperationListFromInspectionData,
  getEmployeeListFromInspectionData,
  getRejectionReports,
} from "@/services/api_function";

// import { getRejectionReportsUrl } from "@/services/api";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

function RejectionReport(props) {
  const options = [
    { id: 1, value: "operator-name", label: "Operator Name" },
    { id: 2, value: "item-name", label: "Item Name" },
    { id: 3, value: "machine-number", label: "Machine No" },
  ];
  const [reportTypeOptions] = useState(options);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // const [itemCountsArray, setItemCountsArray] = useState([]);
  // const [itemNamesArray, setItemNamesArray] = useState([]);
  // const [machineNamesArray, setMachineNamesArray] = useState([]);
  // const [machineCountsArray, setMachineCountsArray] = useState([]);
  // const [operationCountsArray, setOperationCountsArray] = useState([]);
  // const [operationNamesArray, setOperationNamesArray] = useState([]);
  // const [operatorCountsArray, setOperatorCountsArray] = useState([]);
  // const [operatorNamesArray, setOperatorNamesArray] = useState([]);
  const [yearMonthsArray, setYearMonthsArray] = useState([]);
  const [sumData, setSumData] = useState([]);
  const [namesArray, setNamesArray] = useState([]);
  const [type, setType] = useState("");
  const formRef = useRef(null);
  // getMachineListFromInspectionDataFun = (fromDate, toDate, employeeId) => {
  //   console.warn(fromDate, toDate, employeeId);
  //   let requestData = {
  //     fromDate: moment(fromDate).format("YYYY-MM-DD"),
  //     toDate: moment(toDate).format("YYYY-MM-DD"),
  //     employeeId: employeeId,
  //   };
  //   getMachineListFromInspectionData(requestData)
  //     .then((response) => {
  //       let machineOpts =
  //         response.data.response &&
  //         response.data.response.map(function (values) {
  //           return {
  //             value: values.machineId,
  //             label: values.machineName,
  //           };
  //         });
  //       this.setState({ machineOpts: machineOpts });
  //     })
  //     .catch((error) => {
  //       console.log({ error });
  //     });
  // };

  // getJobListFromInspectionDataFun = (fromDate, toDate, machineId) => {
  //   let requestData = {
  //     fromDate: moment(fromDate).format("YYYY-MM-DD"),
  //     toDate: moment(toDate).format("YYYY-MM-DD"),
  //     machineId: machineId,
  //   };
  //   getJobListFromInspectionData(requestData)
  //     .then((response) => {
  //       let jobOpts =
  //         response.data.response &&
  //         response.data.response.map(function (values) {
  //           return {
  //             value: values.jobId,
  //             label: values.jobName,
  //           };
  //         });
  //       this.setState({ jobOpts: jobOpts });
  //     })
  //     .catch((error) => {
  //       console.log({ error });
  //     });
  // };

  // getJobOperationListFromInspectionDataFun = (
  //   fromDate,
  //   toDate,
  //   machineId,
  //   jobId
  // ) => {
  //   let requestData = {
  //     fromDate: moment(fromDate).format("YYYY-MM-DD"),
  //     toDate: moment(toDate).format("YYYY-MM-DD"),
  //     machineId: machineId,
  //     jobId: jobId,
  //   };
  //   getJobOperationListFromInspectionData(requestData)
  //     .then((response) => {
  //       this.setState({ jobOperationOp: [] });
  //       if (response.data.responseStatus == 200) {
  //         let jobOperationOp =
  //           response.data.response &&
  //           response.data.response.map(function (values) {
  //             return {
  //               value: values.jobOperationId,
  //               label: values.jobOperationName,
  //             };
  //           });
  //         this.setState({ jobOperationOpts: jobOperationOp });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log({ error });
  //     });
  // };

  // getEmpOptions = (fromDate, toDate, machineId) => {
  //   console.log(fromDate, toDate, machineId);
  //   let requestData = {
  //     fromDate: moment(fromDate).format("YYYY-MM-DD"),
  //     toDate: moment(toDate).format("YYYY-MM-DD"),
  //     machineId: machineId,
  //   };
  //   getEmployeeListFromInspectionData(requestData)
  //     .then((response) => {
  //       let res = response.data;
  //       if (res.responseStatus == 200) {
  //         let result = res.response;
  //         let opt1 = [];
  //         result.map(function (data) {
  //           opt1.push({
  //             value: data.employeeId,
  //             label: data.employeeName,
  //           });
  //         });
  //         this.setState({ empOpts: opt1 });
  //       } else {
  //         this.setState({ empOpts: [] });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // };

  // exportData = (values) => {
  //   this.setState({ isLoading: true }, () => {
  //     let requestData = {
  //       fromDate:
  //         values.fromDate != null
  //           ? moment(values.fromDate).format("YYYY-MM-DD")
  //           : "",
  //       toDate:
  //         values.toDate != null
  //           ? moment(values.toDate).format("YYYY-MM-DD")
  //           : "",
  //       employeeId:
  //         values.employeeId != "" && values.employeeId != null
  //           ? values.employeeId.value
  //           : "",
  //       machineId:
  //         values.machineId != "" && values.machineId != null
  //           ? values.machineId.value
  //           : "",
  //       jobId:
  //         values.jobId != "" && values.jobId != null ? values.jobId.value : "",
  //       jobOperationId:
  //         values.jobOperationId != "" && values.jobOperationId != null
  //           ? values.jobOperationId.value
  //           : "",
  //     };

  //     let filename = "emp_inspection_sheet.xlsx";

  //     const requestOption = {
  //       method: "POST",
  //       headers: getHeader(),
  //       body: JSON.stringify(requestData),
  //     };

  //     return fetch(exportExcelEmployeeInspectionUrl(), requestOption)
  //       .then((response) => response.blob())
  //       .then((blob) => {
  //         // this.setState({ isLoading: false });
  //         setIsLoading(false);
  //         // 1. Convert the data into 'blob'
  //         console.log({ blob });

  //         if (blob.size > 0) {
  //           // 2. Create blob link to download
  //           const url = window.URL.createObjectURL(new Blob([blob]));
  //           const link = document.createElement("a");
  //           link.href = url;
  //           link.setAttribute("download", `${filename}`);
  //           // 3. Append to html page
  //           document.body.appendChild(link);
  //           // 4. Force download
  //           link.click();
  //           // 5. Clean up and remove the link
  //           link.parentNode.removeChild(link);
  //           return true;
  //         } else {
  //           console.warn("Data Not Found");
  //           toast.error("✘ No Data Found");
  //         }
  //       })
  //       .catch((error) => {
  //         setIsLoading(false);
  //         console.log({ error });
  //       });
  //   });
  // };


  return (
    <div className="emp">
      <Card>
        <CardBody className="border-bottom p-2">
          <CardTitle>Rejection Report</CardTitle>

          <div>
            <Formik
            innerRef={formRef}
              validateOnChange={false}
              // validateOnBlur={false}
              // enableReinitialize={true}
              validateOnBlur={false}
              initialValues={{
                fromYearMonth: new Date(),
                toYearMonth: new Date(),
                reportType: "",
              }}
              validationSchema={Yup.object().shape({
                fromYearMonth: Yup.string().required("From Date is required"),
                toYearMonth: Yup.string().required("To Date is required"),
                reportType: Yup.object().required("Report type is required"),
              })}
              onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                console.log({ values });
                setIsLoading(true);
                setStatus();
                let requestData = {
                  fromYearMonth: moment(values.fromYearMonth).format(
                    "YYYY-MM-DD"
                  ),
                  toYearMonth: moment(values.toYearMonth).format("YYYY-MM-DD"),
                  
                  reportType: values.reportType.value,
                };

                getRejectionReports(requestData)
                  .then((response) => {
                    // resetForm();
                    var result = response.data;
                    if (result.responseStatus == 200) {
                      setSubmitting(false);
                      console.log("Data received : ", result);
                      setIsLoading(false);
                      setSumData(result.sumData);
                      setNamesArray(result.namesArray);
                      setType(result.reportType);
                      // setYearMonthsArray(result.yearMonthsArray);
                      // if (result.reportType === "operator-name") {
                      //   setSumData(sumData);
                      //   setNamesArray(namesArray);
                      //   setType(reportType);

                      //   setArrayValues(
                      //     result.sumData,
                      //     result.operatorNamesArray,
                      //     result.reportType
                      //   );
                      // } else if (result.reportType === "item-name") {
                      //   setArrayValues(
                      //     result.sumData,
                      //     result.itemNamesArray,
                      //     result.reportType
                      //   );
                      // } else if (result.reportType === "machine-number") {
                      //   setArrayValues(
                      //     result.sumData,
                      //     result.machineNamesArray,
                      //     result.reportType
                      //   );
                      // }
                      toast.success("✔ " + "Data retrieved");
                    } else {
                      setSubmitting(false);
                      setIsLoading(false);
                      toast.error("✘ No Data Found");
                    }
                  })
                  .catch((error) => {
                    setSubmitting(false);
                    setIsLoading(false);
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
                          Select Start Date{" "}
                          <span className="text-danger">*</span>
                        </Label>
                        {/* <Input
                          type="date"
                          name="fromYearMonth"
                          id="fromYearMonth"
                          onChange={handleChange}
                          value={values.fromYearMonth}
                          invalid={errors.fromYearMonth ? true : false}
                        />
                        <FormFeedback>{errors.fromYearMonth}</FormFeedback> */}
                        <MyDatePicker
                          autoComplete="off"
                          className="datepic form-control"
                          name="fromYearMonth"
                          placeholderText="dd/MM/yyyy"
                          id="fromYearMonth"
                          dateFormat="dd/MM/yyyy"
                          onChange={(e) => {
                            console.log("date ", e);
                            setFieldValue("fromYearMonth", e);
                          }}
                          value={values.fromYearMonth}
                          selected={values.fromYearMonth}
                          maxDate={new Date()}
                        />
                        <span className="text-danger">
                          {errors.fromYearMonth}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label for="exampleDatetime">
                          Select End Date <span className="text-danger">*</span>
                        </Label>
                        {/* <Input
                          type="date"
                          name="toYearMonth"
                          id="toYearMonth"
                          onChange={handleChange}
                          value={values.toYearMonth}
                          invalid={errors.toYearMonth ? true : false}
                        />
                        <FormFeedback>{errors.toYearMonth}</FormFeedback> */}
                        <MyDatePicker
                          autoComplete="off"
                          className="datepic form-control"
                          name="toYearMonth"
                          placeholderText="dd/MM/yyyy"
                          id="toYearMonth"
                          dateFormat="dd/MM/yyyy"
                          onChange={(e) => {
                            console.log("date ", e);
                            setFieldValue("toYearMonth", e);
                          }}
                          value={values.toYearMonth}
                          selected={values.toYearMonth}
                          maxDate={new Date()}
                        />
                        <span className="text-danger">
                          {errors.toYearMonth}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      &nbsp;
                      <FormGroup>
                        <Select
                          placeholder="Select Report Type"
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            console.log("report type :", v);
                            setFieldValue("reportType", "");
                            if (v != null) {
                              setFieldValue("reportType", v);
                            }
                          }}
                          name="reportType"
                          id="reportType"
                          options={reportTypeOptions}
                          value={values.reportType}
                          className="mt-2"
                        />
                        <span className="text-danger">
                          {errors.reportType && "Please Select Report Type"}
                        </span>
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
                              "rejection-report",
                              "view",
                              props.userPermissions
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
                      </Row>
                    </Col>
                  </Row>
                  {namesArray && namesArray.length > 0 && (
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
                                {type === "operator-name" ? (
                                  <>
                                    <th>Operator Name</th>
                                    <th>Job Name</th>
                                    <th>Operation Name</th>
                                  </>
                                ) : type === "item-name" ? (
                                  <>
                                    <th>Item Name</th>
                                    <th>Machine No</th>
                                    <th>Operation Name</th>
                                  </>
                                ) : type === "machine-number" ? (
                                  <>
                                    <th>Machine No</th>
                                    <th>Item Name</th>
                                    <th>Operation Name</th>
                                  </>
                                ) : (
                                  ""
                                )}
                                <th>Rejection Qty</th>
                                <th>Re-Work Qty</th>
                                <th>Doubtful Qty</th>
                                <th>Un-Machined Qty</th>
                                {/* {yearMonthsArray.map((dv, i) => {
                                    return <th key={i}>{dv}</th>;
                                  })} */}
                              </tr>
                            </thead>
                            <tbody
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {namesArray.map((v, i) => {
                                return (
                                  <tr key={i}>
                                    {type === "operator-name" ? (
                                      <>
                                        <td
                                          style={{
                                            position: "sticky",
                                            left: "-1px",
                                            background: "white",
                                          }}
                                        >
                                          {v.operatorName}
                                        </td>
                                        <td>{v.JobName}</td>
                                        <td>{v.operationName}</td>
                                      </>
                                    ) : type === "item-name" ? (
                                      <>
                                        <td
                                          style={{
                                            position: "sticky",
                                            left: "-1px",
                                            background: "white",
                                          }}
                                        >
                                          {v.itemName}
                                        </td>
                                        <td>{v.machineName}</td>
                                        <td>{v.operationName}</td>
                                      </>
                                    ) : type === "machine-number" ? (
                                      <>
                                        <td
                                          style={{
                                            position: "sticky",
                                            left: "-1px",
                                            background: "white",
                                          }}
                                        >
                                          {v.machineName}
                                        </td>
                                        <td>{v.itemName}</td>
                                        <td>{v.operationName}</td>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    <td>{parseInt(v.rejectQty)}</td>
                                    <td>{parseInt(v.reworkQty)}</td>
                                    <td>{parseInt(v.doubtQty)}</td>
                                    <td>{parseInt(v.unMachinedQty)}</td>
                                  </tr>
                                );
                              })}
                              <tr>
                                <td colSpan={3}>TOTAL</td>
                                <td>{parseInt(sumData.rejectionSum)}</td>
                                <td>{parseInt(sumData.reworkSum)}</td>
                                <td>{parseInt(sumData.doubtfulSum)}</td>
                                <td>{parseInt(sumData.unMachinedSum)}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  )}

                  {namesArray && namesArray.length == 0 && (
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

                  {/* <Tabs
                    className="emptab mt-0"
                    id="controlled-tab-example"
                    activeKey={step}
                    onSelect={(k) => {
                      setStep(parseInt(k));
                    }}
                  >
                    <Tab eventKey="1" title="ITEM INFO">
                      {itemCountsArray &&
                        itemCountsArray.length > 0 &&
                        itemNamesArray &&
                        itemNamesArray.length > 0 && (
                          <Row>
                            <Col md="12">
                              <div className="attendance-tbl">
                                <Table
                                  bordered
                                  size="sm"
                                  className="main-tbl-style"
                                >
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
                                        Item Name
                                      </th>
                                      {yearMonthsArray.map((dv, i) => {
                                        return <th key={i}>{dv}</th>;
                                      })}
                                    </tr>
                                  </thead>
                                  <tbody
                                    style={{
                                      textAlign: "center",
                                    }}
                                  >
                                    {itemNamesArray.map((v, i) => {
                                      return (
                                        <tr key={i}>
                                          <td
                                            style={{
                                              position: "sticky",
                                              left: "-1px",
                                              background: "white",
                                            }}
                                          >
                                            {v.itemName}
                                          </td>
                                          {itemCountsArray[i].map((rv, ri) => {
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
                                                {rv}
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

                      {itemCountsArray.length == 0 &&
                        itemNamesArray.length == 0 && (
                          <Row>
                            <Col md="12">
                              <div className="attendance-tbl">
                                <Table
                                  bordered
                                  size="sm"
                                  className="main-tbl-style"
                                >
                                  <tr>
                                    <td>No Data Exists</td>
                                  </tr>
                                </Table>
                              </div>
                            </Col>
                          </Row>
                        )}
                    </Tab>
                    <Tab eventKey="2" title="MACHINE INFO">
                      {machineCountsArray &&
                        machineCountsArray.length > 0 &&
                        machineNamesArray &&
                        machineNamesArray.length > 0 && (
                          <Row>
                            <Col md="12">
                              <div className="attendance-tbl">
                                <Table
                                  bordered
                                  size="sm"
                                  className="main-tbl-style"
                                >
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
                                        Machine No
                                      </th>
                                      {yearMonthsArray.map((dv, i) => {
                                        return <th key={i}>{dv}</th>;
                                      })}
                                    </tr>
                                  </thead>
                                  <tbody
                                    style={{
                                      textAlign: "center",
                                    }}
                                  >
                                    {machineNamesArray.map((v, i) => {
                                      return (
                                        <tr key={i}>
                                          <td
                                            style={{
                                              position: "sticky",
                                              left: "-1px",
                                              background: "white",
                                            }}
                                          >
                                            {v.machineName}
                                          </td>
                                          {machineCountsArray[i].map(
                                            (rv, ri) => {
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
                                                  {rv}
                                                </td>
                                              );
                                            }
                                          )}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </Table>
                              </div>
                            </Col>
                          </Row>
                        )}

                      {machineNamesArray.length == 0 &&
                        machineCountsArray.length == 0 && (
                          <Row>
                            <Col md="12">
                              <div className="attendance-tbl">
                                <Table
                                  bordered
                                  size="sm"
                                  className="main-tbl-style"
                                >
                                  <tr>
                                    <td>No Data Exists</td>
                                  </tr>
                                </Table>
                              </div>
                            </Col>
                          </Row>
                        )}
                    </Tab>
                    <Tab eventKey="3" title="OPERATION INFO">
                      {operationCountsArray &&
                        operationCountsArray.length > 0 &&
                        operationNamesArray &&
                        operationNamesArray.length > 0 && (
                          <Row>
                            <Col md="12">
                              <div className="attendance-tbl">
                                <Table
                                  bordered
                                  size="sm"
                                  className="main-tbl-style"
                                >
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
                                        Operation Name
                                      </th>
                                      {yearMonthsArray.map((dv, i) => {
                                        return <th key={i}>{dv}</th>;
                                      })}
                                    </tr>
                                  </thead>
                                  <tbody
                                    style={{
                                      textAlign: "center",
                                    }}
                                  >
                                    {operationNamesArray.map((v, i) => {
                                      return (
                                        <tr key={i}>
                                          <td
                                            style={{
                                              position: "sticky",
                                              left: "-1px",
                                              background: "white",
                                            }}
                                          >
                                            {v.operationName}
                                          </td>
                                          {operationCountsArray[i].map(
                                            (rv, ri) => {
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
                                                  {rv}
                                                </td>
                                              );
                                            }
                                          )}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </Table>
                              </div>
                            </Col>
                          </Row>
                        )}

                      {operationNamesArray.length == 0 &&
                        operationCountsArray.length == 0 && (
                          <Row>
                            <Col md="12">
                              <div className="attendance-tbl">
                                <Table
                                  bordered
                                  size="sm"
                                  className="main-tbl-style"
                                >
                                  <tr>
                                    <td>No Data Exists</td>
                                  </tr>
                                </Table>
                              </div>
                            </Col>
                          </Row>
                        )}
                    </Tab>
                    <Tab eventKey="4" title="OPERATOR INFO">
                      {operatorCountsArray &&
                        operatorCountsArray.length > 0 &&
                        operatorNamesArray &&
                        operatorNamesArray.length > 0 && (
                          <Row>
                            <Col md="12">
                              <div className="attendance-tbl">
                                <Table
                                  bordered
                                  size="sm"
                                  className="main-tbl-style"
                                >
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
                                        Operation Name
                                      </th>
                                      {yearMonthsArray.map((dv, i) => {
                                        return <th key={i}>{dv}</th>;
                                      })}
                                    </tr>
                                  </thead>
                                  <tbody
                                    style={{
                                      textAlign: "center",
                                    }}
                                  >
                                    {operatorNamesArray.map((v, i) => {
                                      return (
                                        <tr key={i}>
                                          <td
                                            style={{
                                              position: "sticky",
                                              left: "-1px",
                                              background: "white",
                                            }}
                                          >
                                            {v.operatorName}
                                          </td>
                                          {operatorCountsArray[i].map(
                                            (rv, ri) => {
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
                                                  {rv}
                                                </td>
                                              );
                                            }
                                          )}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </Table>
                              </div>
                            </Col>
                          </Row>
                        )}

                      {operatorNamesArray.length == 0 &&
                        operatorCountsArray.length == 0 && (
                          <Row>
                            <Col md="12">
                              <div className="attendance-tbl">
                                <Table
                                  bordered
                                  size="sm"
                                  className="main-tbl-style"
                                >
                                  <tr>
                                    <td>No Data Exists</td>
                                  </tr>
                                </Table>
                              </div>
                            </Col>
                          </Row>
                        )}
                    </Tab>
                  </Tabs> */}
                </Form>
              )}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default WithUserPermission(RejectionReport);
