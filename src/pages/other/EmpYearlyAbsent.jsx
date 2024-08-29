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
import CanvasJSReact from "../../assets/canvasjs.react";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
import Chart from "react-apexcharts";

import {
  listOfEmployee,
  getEmployeeYearlyAbsent,
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

class EmpYearlyAbsent extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.state = {
      isLoading: false,
      empOpt: [],
      attendanceData: [],
      dataPoints: [],
      data: [],
    };
  }

  getEmpOptions = () => {
    listOfEmployee()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          // let result = res.response;
          // let opt1 = [];
          // result.map(function (data) {
          //   opt1.push({
          //     value: data.id,
          //     label: data.employeeName,
          //   });
          // });
          // this.setState({ empOpt: opt1 });

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
          // setEmpOpts(opt);
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
    const { isLoading, empOpt, attendanceData, dataPoints, data } = this.state;
    const options = {
      plotOptions: {
        bar: {
          // horizontal: false,
          columnWidth: "15%",
          // endingShape: "flat",
        },
      },
      colors: ["#4f81bc"],
      // fill: {
      //   type: "solid",
      //   opacity: 1,
      // },
      // chart: {
      //   toolbar: {
      //     show: false,
      //   },
      //   sparkline: {
      //     enabled: false,
      //   },
      // },
      dataLabels: {
        // enabled: false,
      },
      markers: {
        // size: 100,
      },
      legend: {
        // show: true,
      },
      xaxis: {
        // type: "category",
        // categories: props.data.machineList,
        categories: dataPoints,
        // categories:
        // [
        //   "Apr-2019",
        //   "May-19",
        //   "Jun-19",
        //   "Jul-19",
        //   "Aug-19",
        //   "Sep-19",
        //   "Oct-19",
        //   "Nov-19",
        //   "Dec-19",
        //   "Jan-23",
        //   "Feb-23",
        //   "Mar-23",
        // ],
        labels: {
          style: {
            // cssClass: "grey--text lighten-2--text fill-color",
          },
        },
      },
      yaxis: {
        show: true,
        labels: {
          style: {
            // cssClass: "grey--text lighten-2--text fill-color",
          },
        },
      },
      // stroke: {
      //   show: true,
      //   width: 5,
      //   lineCap: "butt",
      //   colors: ["transparent"],
      // },
      tooltip: {
        // theme: "dark",
      },
      title: {
        // text: "Basic Column Chart",
      },
      data: [
        {
          // Change type to "doughnut", "line", "splineArea", etc.
          type: "column",
          // dataPoints: [
          //   { label: "Apr-19", y: 10, color: "#4f81bc" },
          //   { label: "May-19", y: 15, color: "#4f81bc" },
          //   { label: "Jun-19", y: 15, color: "#4f81bc" },
          //   { label: "Jul-19", y: 15, color: "#4f81bc" },
          //   { label: "Aug-19", y: 15, color: "#4f81bc" },
          //   { label: "Sep-19", y: 15, color: "#4f81bc" },
          //   { label: "Oct-19", y: 15, color: "#4f81bc" },
          //   { label: "Nov-19", y: 15, color: "#4f81bc" },
          //   { label: "Dec-19", y: 15, color: "#4f81bc" },
          //   { label: "Jan-20", y: 15, color: "#4f81bc" },
          //   { label: "Feb-20", y: 15, color: "#4f81bc" },
          //   { label: "Mar-20", y: 15, color: "#4f81bc" },
          // ],
          dataPoints: this.state.dataPonts,
        },
      ],
    };
    const seriessalesoverview = [
      {
        name: "Absent Days",
        data: this.state.data,
        // data: [10, 15, 90, 16, 5, 20, 32, 25, 68, 5, 48, 85],
      },
    ];
    return (
      <div>
        <Card>
          <CardBody className="border-bottom p-2">
            <CardTitle>Employee Yearly Absent</CardTitle>
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
                  fromMonth: Yup.string().required("From Date is required"),
                  toMonth: Yup.string().required("To Date is required"),
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

                  getEmployeeYearlyAbsent(requestData)
                    .then((response) => {
                      // resetForm();
                      var result = response.data;
                      console.log({ result });
                      console.log("result.response", result.responseObject);
                      if (result.responseStatus == 200) {
                        setSubmitting(false);
                        let months = result.responseObject.months;
                        let absent = result.responseObject.absent;
                        console.log("Months >>", months, absent);
                        this.setState({
                          isLoading: false,
                          dataPoints: months,
                          data: absent,
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
                              "yearly-absent",
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
                          {/* <Button
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
                        </Button> */}
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                )}
              />
            </div>
            {/* <pre>{JSON.stringify(attendanceData)}</pre> */}

            {/* <div className="">
              <Table
                component={Paper}
                aria-label="simple table"
                // responsive
                size="sm"
              >
                <thead>
                  <tr>
                    {dataPoints != "" ? dataPoints.map((value, index) => {
                      <th>
                        {value}
                      </th>
                    }) : <></>}
                  </tr>
                </thead>

                <tbody>
                  {attendanceData != "" ? (
                    attendanceData.map((value, key) => {
                      return (
                        <tr key={key}>
                          <td>{value.fullName}</td>
                          <td>
                            {value.checkInTime != null
                              ? moment(
                                  value.checkInTime,
                                  "YYYY-MM-DD HH:mm:ss"
                                ).format("LT")
                              : ""}
                          </td>
                          <td>
                            {value.checkOutTime != null
                              ? moment(
                                  value.checkOutTime,
                                  "YYYY-MM-DD HH:mm:ss"
                                ).format("LT")
                              : ""}
                          </td>
                          <td>
                            {value.totalWorkTime != null
                              ? value.totalWorkTime
                              : "-"}
                          </td>
                          <td>
                            {value.machineNo != null ? value.machineNo : "-"}
                          </td>
                          <td>
                            {value.jobName != null
                              ? value.jobName
                              : value.breakName != null
                              ? value.breakName
                              : "-"}
                          </td>
                          <td>
                            {value.jobOperationName != null
                              ? value.jobOperationName
                              : "-"}
                          </td>
                          <td>
                            {value.cycleTime != null ? value.cycleTime : "-"}
                          </td>
                          <td>
                            {value.requiredQty != null ? value.requiredQty : 0}
                          </td>
                          <td>
                            {value.actualQty != null ? value.actualQty : 0}
                          </td>

                          <td>{value.okQty != null ? value.okQty : 0}</td>
                          <td>
                            {value.machineRejectQty != null
                              ? value.machineRejectQty
                              : 0}
                          </td>
                          <td>
                            {value.reworkQty != null ? value.reworkQty : 0}
                          </td>
                          <td>
                            {value.doubtfulQty != null ? value.doubtfulQty : 0}
                          </td>
                          <td>
                            {value.unMachinedQty != null
                              ? value.unMachinedQty
                              : 0}
                          </td>
                          <td>{value.actualWorkTime}</td>
                          <td>{value.breakTime}</td>
                          <td>
                            {value.wagesInHour != null ? value.wagesInHour : 0}
                          </td>
                          <td>
                            {value.wagesInPoint != null
                              ? value.wagesInPoint
                              : 0}
                          </td>
                          <td>
                            {value.wagesInPcs != null ? value.wagesInPcs : 0}
                          </td>
                          <td>
                            {value.wagesPerDay != null ? value.wagesPerDay : 0}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    // <tr>
                    //   <td>Absent %</td>
                    //   <td>48</td>
                    //   <td>26</td>
                    //   <td>24.5</td>
                    //   <td>38.6</td>
                    //   <td>68</td>
                    //   <td>28.4</td>
                    //   <td>29</td>
                    //   <td>26.2</td>
                    //   <td>42</td>
                    //   <td>39.2</td>
                    //   <td>23.2</td>
                    //   <td></td>
                    // </tr>
                    <tr md="12"  className="attendance-tbl">
                      <td style={{textAlign:"center"}} >
                        No Data Exists
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div> */}
          </CardBody>
        </Card>
        <Card
          style={{ height: "60vh", overflow: "scroll", overflowX: "hidden" }}
        >
          <Chart
            options={options}
            // series={props.data.machineCountsArray}
            series={seriessalesoverview}
            type="bar"
            height="308px"
          />
          {/* <CanvasJSChart options={options} /> */}
        </Card>
      </div>
    );
  }
}

export default WithUserPermission(EmpYearlyAbsent);
