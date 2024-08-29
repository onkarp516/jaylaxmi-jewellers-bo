import React, { useState, useEffect, useRef, Suspense } from "react";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Button,
  Input,
  FormFeedback,
  Card,
  CardBody,
} from "reactstrap";

import {
  MyDatePicker,
  MyDateTimePicker,
  WithUserPermission,
  isActionExist,
} from "@/helpers";
import "react-table/react-table.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import moment from "moment";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

import {
  listJobOperation,
  listOfEmployee,
  listOfMachine,
  listOfBreak,
  listOfJobsForSelect,
  manualAttendance,
  manualStartTask,
} from "@/services/api_function";

let taskTypeOpt = [
  { value: "2", label: "Break Downtime" },
  { value: "4", label: "Helper / Supervisor / Quality Task" },
  { value: "1", label: "Machine Operator Task" },
  { value: "3", label: "Machine setting time" },
];

function Attendance1(props) {
  const attendanceRef = useRef(null);
  const taskRef = useRef(null);
  const [machineOpts, setMachineOpts] = useState([]);
  const [jobOpts, setJobOpts] = useState([]);

  const [workBreakOpts, setWorkBreakOpts] = useState([]);
  const [jobOperationOpts, setjobOperationOpts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [empOpts, setEmpOpts] = useState([]);

  const listOfBreakFun = () => {
    listOfBreak()
      .then((response) => {
        let workBreakOpts =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.breakName,
            };
          });
        setWorkBreakOpts(workBreakOpts);
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  const listOfMachineFun = () => {
    listOfMachine()
      .then((response) => {
        let machineOpts =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.machineNo,
              isMachineCount: values.isMachineCount,
              currentMachineCount: values.currentMachineCount,
            };
          });
        setMachineOpts(machineOpts);
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  const listOfJobsForSelectFun = () => {
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
        setJobOpts(jobOpts);
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  const getJobOperationList = (jobId, values = null) => {
    let reqData = {
      jobId: jobId,
    };
    listJobOperation(reqData)
      .then((response) => {
        setjobOperationOpts([]);
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
          setjobOperationOpts(jobOperationOp);
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  const setMachineCounts = (machineObj, setFieldValue) => {
    console.log({ machineObj });
    if (machineObj.isMachineCount == true) {
      setFieldValue("machineStartCount", machineObj.currentMachineCount);
    } else {
      setFieldValue("machineStartCount", 0);
    }
  };

  const setOperationData = (operationObj, setFieldValue) => {
    console.log({ operationObj });
    if (operationObj && operationObj.dataExist == true) {
      setFieldValue("dataExist", operationObj.dataExist);
      setFieldValue("cycleTime", operationObj.cycleTime);
      setFieldValue("averagePerShift", operationObj.averagePerShift);
      setFieldValue("pointPerJob", operationObj.pointPerJob);
      setFieldValue("jobsHourBasis", operationObj.jobsHourBasis);
    } else {
      toast.error("✘ Operation data not exists. Please update it");
      setFieldValue("dataExist", false);
      setFieldValue("cycleTime", 0);
      setFieldValue("averagePerShift", 0);
      setFieldValue("pointPerJob", 0);
      setFieldValue("jobsHourBasis", 0);
    }
  };

  const handleQtyValue = (val, element, values, setFieldValue) => {
    console.log(values);
    let totalQty = parseInt(values.totalQty);

    if (element == "rework") {
      let reworkQty = parseInt(0);
      if (val != "") reworkQty = parseInt(val);
      let mrQty = parseInt(values.machineRejectQty);
      let umQty = parseInt(values.unMachinedQty);

      let okQty = totalQty - (reworkQty + mrQty + umQty);

      setFieldValue("reworkQty", reworkQty);
      setFieldValue("okQty", okQty);
    } else if (element == "machineReject") {
      let mrQty = parseInt(0);
      if (val != "") mrQty = parseInt(val);
      let reworkQty = parseInt(values.reworkQty);
      let umQty = parseInt(values.unMachinedQty);

      let okQty = totalQty - (reworkQty + mrQty + umQty);

      setFieldValue("machineRejectQty", mrQty);
      setFieldValue("okQty", okQty);
    } else if (element == "unMachined") {
      let umQty = parseInt(0);
      if (val != "") umQty = parseInt(val);
      let mrQty = parseInt(values.machineRejectQty);
      let reworkQty = parseInt(values.reworkQty);

      let okQty = totalQty - (reworkQty + mrQty + umQty);

      setFieldValue("unMachinedQty", umQty);
      setFieldValue("okQty", okQty);
    } else if (element == "total") {
      let total = parseInt(0);
      if (val != "") total = parseInt(val);

      setFieldValue("totalQty", total);
      setFieldValue("okQty", total);
    }
  };

  const handleCountValue = (val, element, values, setFieldValue) => {
    console.log(values);
    let totalQty = 0;

    if (element == "start") {
      let startCount = parseInt(0);
      if (val != "") startCount = parseInt(val);
      let endCount = parseInt(values.machineEndCount);

      totalQty = endCount - startCount;

      setFieldValue("machineStartCount", startCount);
      setFieldValue("machineEndCount", endCount);
      setFieldValue("totalQty", totalQty);
    } else if (element == "end") {
      let endCount = parseInt(0);
      if (val != "") endCount = parseInt(val);
      let startCount = parseInt(values.machineStartCount);

      totalQty = endCount - startCount;

      setFieldValue("machineStartCount", startCount);
      setFieldValue("machineEndCount", endCount);
      setFieldValue("totalQty", totalQty);
    }
    handleQtyValue(totalQty, "total", values, setFieldValue);
  };

  const calculateTime = (values, setFieldValue) => {
    console.log({ values });
    let { checkInTime, checkOutTime } = values;
    if (values.checkInTime != "" && values.checkOutTime != "") {
      var dt1 = checkInTime;
      var dt2 = checkOutTime;
      // var dt1 = new Date("2019-1-8 " + checkInTime);
      // var dt2 = new Date("2019-1-8 " + checkOutTime);

      if (dt2 > dt1) {
        var diff = dt2.getTime() - dt1.getTime();
        var hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);
        var mins = Math.floor(diff / (1000 * 60));
        diff -= mins * (1000 * 60);

        hours = String(hours).padStart(2, "0");
        mins = String(mins).padStart(2, "0");
        var result = hours + ":" + mins;

        setFieldValue("checkInTime", checkInTime);
        setFieldValue("checkOutTime", checkOutTime);
        setFieldValue("totalTime", result);
      } else {
        toast.error("✘ Checkout time is less than Checkin time");
        setFieldValue("checkOutTime", "");
        setFieldValue("totalTime", "");
      }
    } else {
      setFieldValue("checkOutTime", "");
      setFieldValue("totalTime", "");
    }
  };

  const getEmpOptions = () => {
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
          setEmpOpts(opt1);
        } else {
          setEmpOpts([]);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getEmpOptions();
    listOfMachineFun();
    listOfJobsForSelectFun();
    listOfBreakFun();
  }, []);

  const validate = (values) => {
    console.log({ values });
    const errors = {};

    if (!values.taskType) {
      errors.taskType = "Select Task";
    }
    if (!values.taskDate) {
      errors.taskDate = "Attendance Date is required";
    }
    if (!values.startTime) {
      errors.startTime = "Required";
    }
    if (!values.employeeId) {
      errors.employeeId = "Select Employee";
    }
    if (values.taskType && parseInt(values.taskType.value) == 1) {
      if (!values.machineId) {
        errors.machineId = "Select Machine";
      }
      if (!values.machineStartCount && values.isMachineCount == true) {
        errors.machineStartCount = "Start count";
      }
      if (!values.jobId) {
        errors.jobId = "Select Item";
      }
      if (!values.jobOperationId) {
        errors.jobOperationId = "Select Operation";
      }
    }
    if (values.taskType && parseInt(values.taskType.value) == 2) {
      if (!values.workBreakId) {
        errors.workBreakId = "Select Break";
      }
      if (!values.workDone) {
        errors.workDone = "Select Mode";
      }
    }
    if (values.taskType && parseInt(values.taskType.value) == 3) {
      if (!values.machineId) {
        errors.machineId = "Select Machine";
      }
    }
    return errors;
  };

  return (
    <div className="emp">
      {
        <Card>
        <CardBody className="border-bottom p-2">
        <div className="container-fluid">
          <Row>
            <Col md="6">
              <div className="searchprdct mt-4">
                <h4>ADD Attendance:</h4>
              </div>
            </Col>
            <Col md="6"></Col>
          </Row>

          <Formik
            innerRef={attendanceRef}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
              employeeId: "",
              attendanceDate: new Date(),
              checkInTime: "",
              checkOutTime: "",
              totalTime: "",
              lunchTimeInMin: 0,
            }}
            validationSchema={Yup.object().shape({
              attendanceDate: Yup.string().required(
                "Attendance Date is required"
              ),
              checkInTime: Yup.string().required("In Time is required"),
              employeeId: Yup.object().required("Select Employee"),
            })}
            onSubmit={(
              values,
              { resetForm, setStatus, setSubmitting, setFieldValue }
            ) => {
              setIsLoading(true);
              let requestData = {
                employeeId: values.employeeId.value,
                attendanceDate: moment(values.attendanceDate).format(
                  "YYYY-MM-DD"
                ),
                checkInTime: moment(values.checkInTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
                checkOutTime: "",
                totalTime: values.totalTime,
                adminRemark: "",
              };

              // let checkInDate = moment(values.attendanceDate).format(
              //   "YYYY-MM-DD"
              // );
              // let inTime = moment(values.checkInTime, "HH:mm:ss").format(
              //   "HH:mm:ss"
              // );

              // console.log({ checkInDate, inTime });
              // var dateInTime = moment(
              //   checkInDate + " " + inTime,
              //   "YYYY-MM-DD HH:mm:ss"
              // ).format("YYYY-MM-DD HH:mm:ss");

              // requestData["checkInTime"] = dateInTime;
              requestData["lunchTimeInMin"] = values.lunchTimeInMin;

              if (values.checkOutTime != "" && values.checkOutTime != null) {
                // let checkOutDate = moment(values.attendanceDate).format(
                //   "YYYY-MM-DD"
                // );
                // let OutTime = moment(values.checkOutTime, "HH:mm:ss").format(
                //   "HH:mm:ss"
                // );

                // var dateOutTime = moment(
                //   checkOutDate + " " + OutTime,
                //   "YYYY-MM-DD HH:mm:ss"
                // ).format("YYYY-MM-DD HH:mm:ss");

                requestData["checkOutTime"] = moment(
                  values.checkOutTime
                ).format("YYYY-MM-DD HH:mm:ss");
              }

              if (
                values.checkOutTime != "" &&
                values.checkOutTime != null &&
                values.checkInTime > values.checkOutTime
              ) {
                setIsLoading(false);
                toast.error("✘ Checkout time is less than Checkin time");
                setFieldValue("checkOutTime", "");
              } else {
                manualAttendance(requestData)
                  .then((response) => {
                    setIsLoading(false);
                    var result = response.data;
                    console.log(result);

                    if (result.responseStatus == 200) {
                      setSubmitting(false);
                      toast.success("✔  " + result.message);
                      attendanceRef.current.resetForm();
                    } else {
                      setSubmitting(false);
                      toast.error("✘ " + result.message);
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
                      <Label> Employee Name</Label>
                      <Select
                        placeholder="Select Employee"
                        ////isClearable={true}
                        styles={{
                          clearIndicator: ClearIndicatorStyles,
                        }}
                        onChange={(v) => {
                          setFieldValue("employeeId", v);
                        }}
                        name="employeeId"
                        options={empOpts}
                        value={values.employeeId}
                      />

                      <span className="text-danger">
                        {errors.employeeId && "Please select employee"}
                      </span>
                    </FormGroup>
                  </Col>{" "}
                  <Col md="3">
                    <FormGroup>
                      <Label> Attendance Date</Label>
                      <MyDatePicker
                        className="datepic form-control"
                        name="attendanceDate"
                        placeholderText="dd/MM/yyyy"
                        id="attendanceDate"
                        dateFormat="dd/MM/yyyy"
                        value={values.attendanceDate}
                        onChange={(date) => {
                          setFieldValue("attendanceDate", date);
                        }}
                        selected={values.attendanceDate}
                        maxDate={new Date()}
                      />
                      <span className="text-danger">
                        {errors.attendanceDate}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Check In</Label>
                      {/* <Input
                        type="time"
                        placeholder="Enter from time"
                        name="checkInTime"
                        id="checkInTime"
                        value={values.checkInTime}
                        onChange={handleChange}
                      /> */}
                      <MyDateTimePicker
                        autoComplete="off"
                        className="datepic form-control"
                        name="checkInTime"
                        placeholderText="dd/MM/yyyy hh:mm"
                        id="checkInTime"
                        dateFormat="dd/MM/yyyy HH:mm:ss"
                        showTimeInput
                        // showTimeSelect
                        // locale="pt-BR"
                        // timeFormat="p"
                        // dateFormat="Pp"
                        // value={values.taskDate}
                        onChange={(e) => {
                          console.log("date ", e);
                          setFieldValue("checkInTime", e);
                        }}
                        selected={values.checkInTime}
                        maxDate={new Date()}
                      />
                      <span className="text-danger">{errors.checkInTime}</span>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Check Out</Label>
                      {/* <Input
                        type="time"
                        placeholder="Enter from time"
                        name="checkOutTime"
                        id="checkOutTime"
                        value={values.checkOutTime}
                        onChange={handleChange}
                        onBlur={(e) => {
                          if (
                            values.checkOutTime != null &&
                            values.checkOutTime != ""
                          ) {
                            calculateTime(
                              {
                                checkInTime: values.checkInTime,
                                checkOutTime: values.checkOutTime,
                              },
                              setFieldValue
                            );
                          } else {
                            setFieldValue("totalTime", "");
                          }
                        }}
                      /> */}
                      <MyDateTimePicker
                        autoComplete="off"
                        className="datepic form-control"
                        name="checkOutTime"
                        placeholderText="dd/MM/yyyy hh:mm"
                        id="checkOutTime"
                        dateFormat="dd/MM/yyyy HH:mm:ss"
                        showTimeInput
                        // showTimeSelect
                        // locale="pt-BR"
                        // timeFormat="p"
                        // dateFormat="Pp"
                        // value={values.taskDate}
                        // onChange={(e) => {
                        //   console.log("date ", e);
                        //   setFieldValue("checkOutTime", e);
                        // }}
                        onChange={(e) => {
                          setFieldValue("checkOutTime", "");
                          setFieldValue("totalTime", "");
                          if (e != null && e != "" && e > values.checkInTime) {
                            calculateTime(
                              {
                                checkInTime: values.checkInTime,
                                checkOutTime: e,
                              },
                              setFieldValue
                            );
                          } else {
                            toast.error(
                              "✘ Checkout time is less than Checkin time"
                            );
                          }
                        }}
                        selected={values.checkOutTime}
                        
                        maxDate={new Date()}
                      />
                      <FormFeedback>{errors.checkOutTime}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Total Time</Label>
                      <Input
                        readOnly={true}
                        type="text"
                        placeholder="Enter from time"
                        name="totalTime"
                        onChange={handleChange}
                        value={values.totalTime}
                        invalid={errors.totalTime ? true : false}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Lunch Time(Min)</Label>
                      <Input
                        type="text"
                        placeholder="Enter from time"
                        name="lunchTimeInMin"
                        onChange={handleChange}
                        value={values.lunchTimeInMin}
                        invalid={errors.lunchTimeInMin ? true : false}
                      />

                      <span className="text-danger">
                        {errors.lunchTimeInMin}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="2" style={{ textAlign: "end" }} className="my-auto">
                    {console.log(props.userPermissions)}
                    {isActionExist(
                      "manual-process",
                      "create",
                      props.userPermissions
                    ) && (
                      <Button type="submit" className="mainbtn1 text-white">
                        Submit
                      </Button>
                    )}

                    <Button
                      className="mainbtn1 modalcancelbtn ml-2"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        attendanceRef.current.resetForm();
                      }}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          />
         
        </div>
        </CardBody></Card>
      }
    </div>
  );
}

export default WithUserPermission(Attendance1);
