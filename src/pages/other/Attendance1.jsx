import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormFeedback,
  Spinner,
} from "reactstrap";

import Swal from "sweetalert2";
import { CloseButton, Dropdown, Table, ProgressBar } from "react-bootstrap";
import moment from "moment";
import { MyDatePicker, getHeader, MyDateTimePicker } from "@/helpers";
import "react-table/react-table.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Select from "react-select";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

import { getSelectValue } from "@/helpers";

import {
  todayEmployeeAttendance,
  updateAttendance,
  listJobOperation,
  getTaskDetailsForUpdate,
  listOfMachine,
  listOfBreak,
  listOfJobsForSelect,
  updateTaskDetails,
  listOfEmployee,
  recalculateEmployeeTasksAttendance,
  approveSalaryAttendance,
  deleteAttendance,
  deleteTask,
  recalculateAllEmployeeTasksAttendance,
} from "@/services/api_function";
import { exportExcelTodayEmployeeAttendanceUrl } from "@/services/api";

export default function Attendance1(props) {
  const [atttendanceOpt, setAttendanceOpt] = useState([
    { value: "approve", label: "Approve", visible: false },
    { value: "pending", label: "Pending", visible: false },
  ]);

  const secureData = JSON.parse(localStorage.getItem("loginUser"));
  const salaryForm = useRef(null);
  const [attDate, setAttDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [machineOpts, setMachineOpts] = useState([]);
  const [jobOpts, setJobOpts] = useState([]);
  const [workBreakOpts, setWorkBreakOpts] = useState([]);
  const [jobOperationOpts, setjobOperationOpts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attEditModalShow, setAttEditModalShow] = useState(false);
  const [taskModal, setTaskModalShow] = useState(false);
  const [salaryApprovalModal, setSalaryApprovalModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  let [mainData, setMainData] = useState("");
  const [mainInnerData, setMainInnerData] = useState("");
  const [breakData, setBreakData] = useState([]);
  const [breakInnerData, setBreakInnerData] = useState("");
  const [machineInnerData, setMachineInnerData] = useState("");
  const [attendanceInit, setAttenanceInit] = useState({
    attendanceId: "",
    attendanceDate: "",
    employeeName: "",
    checkInTime: "",
    checkOutTime: "",
    totalTime: "",
    employeeWagesType: "",
    wagesHourBasis: 0,
    wagesPcsBasis: 0,
    breakWages: 0,
    netPcsWages: 0,
    wagesPointBasis: 0,
    wagesPerDay: 0,
  });

  const [orgData, setOrgData] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [attStatus, setAttStatus] = useState("");
  const [empOpts, setEmpOpts] = useState([]);
  const [taskInit, setTaskInit] = useState({
    taskId: "",
    taskType: 0,
    employeeName: "",
    startTime: "",
    endTime: "",
    breakName: "",
    workDone: "",
    remark: "",
    workBreakId: "",
    machineId: "",
    jobId: "",
    jobOperationId: "",
    lunchTime: "",
    machineStartCount: "",
    machineEndCount: "",
    totalCount: "",
    actualProduction: "",
    cycleTime: 0,
    pcsRate: 0,
    averagePerShift: 0,
    pointPerJob: 0,
    totalQty: 0,
    reworkQty: 0,
    machineRejectQty: 0,
    doubtfulQty: 0,
    unMachinedQty: 0,
    okQty: 0,
    settingTimeInMin: 0,
  });

  const onEditModalShow = (status, attObject) => {
    console.log({ attObject });

    if (status == true) {
      let request_data = {
        attendanceId: attObject.id,
        attendanceDate: new Date(attObject.attendanceDate),
        checkInTime: new Date(attObject.checkInTime),
        employeeName: attObject.employeeName,
        workingHours: attObject.workingHours,
        totalTime: attObject.totalTime != null ? attObject.totalTime : "",
        lunchTimeInMin:
          attObject.lunchTimeInMin != null ? attObject.lunchTimeInMin : 0,
      };
      request_data["checkOutTime"] = "";
      let checkOutTime = "";
      if (attObject.checkOutTime != null && attObject.checkOutTime != "") {
        checkOutTime = new Date(attObject.checkOutTime);
        request_data["dbcheckOutTime"] = attObject.checkOutTime;

        var diff =
          new Date(attObject.checkOutTime).getTime() -
          new Date(attObject.checkInTime).getTime();
        var hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);
        var mins = Math.floor(diff / (1000 * 60));
        diff -= mins * (1000 * 60);

        hours = String(hours).padStart(2, "0");
        mins = String(mins).padStart(2, "0");
        var result = hours + ":" + mins;
        request_data["totalTime"] = result;
      }
      request_data["checkOutTime"] = checkOutTime;

      // let checkInTime = moment(
      //   attObject.checkInTime,
      //   "YYYY-MM-DD HH:mm:ss"
      // ).format("HH:mm:ss");
      // request_data["dbcheckInTime"] = attObject.checkInTime;
      // request_data["checkInTime"] = checkInTime;

      // request_data["dbcheckOutTime"] = "";
      // request_data["checkOutTime"] = "";
      // let checkOutTime = "";
      // if (attObject.checkOutTime != null && attObject.checkOutTime != "") {
      //   checkOutTime = moment(
      //     attObject.checkOutTime,
      //     "YYYY-MM-DD HH:mm:ss"
      //   ).format("HH:mm:ss");
      //   request_data["dbcheckOutTime"] = attObject.checkOutTime;
      // }
      // request_data["checkOutTime"] = checkOutTime;

      console.log({ request_data });

      setAttenanceInit(request_data);
      setAttEditModalShow(status);
    } else {
      setAttEditModalShow(status);
    }
  };

  const onSalaryModalShow = (status, attObject) => {
    console.log({ attObject });

    if (status == true) {
      let request_data = {
        attendanceId: attObject.id,
        attendanceDate: new Date(attObject.attendanceDate),
        employeeName: attObject.employeeName,

        totalTime: attObject.totalTime != null ? attObject.totalTime : "",
        lunchTimeInMin:
          attObject.lunchTimeInMin != null ? attObject.lunchTimeInMin : 0,

        employeeWagesType:
          attObject.employeeWagesType != null
            ? attObject.employeeWagesType
            : "",

        workingHours: attObject.workingHours,
        wagesHourBasis: attObject.wagesHourBasis,
        wagesPcsBasis: attObject.wagesPcsBasis,
        breakWages: attObject.breakWages,
        netPcsWages: attObject.netPcsWages,
        wagesPointBasis: attObject.wagesPointBasis,
        wagesPerDay: attObject.wagesPerDay,
        attendanceStatus: attObject.attendanceStatus,
        remark: attObject.remark,
        adminRemark: attObject.adminRemark,
      };

      // let checkInTime = moment(
      //   attObject.checkInTime,
      //   "YYYY-MM-DD HH:mm:ss"
      // ).format("HH:mm:ss");
      // request_data["dbcheckInTime"] = attObject.checkInTime;
      request_data["checkInTime"] = new Date(attObject.checkInTime);

      request_data["dbcheckOutTime"] = "";
      request_data["checkOutTime"] = "";
      let checkOutTime = "";
      if (attObject.checkOutTime != null && attObject.checkOutTime != "") {
        // checkOutTime = moment(
        //   attObject.checkOutTime,
        //   "YYYY-MM-DD HH:mm:ss"
        // ).format("HH:mm:ss");
        // request_data["dbcheckOutTime"] = attObject.checkOutTime;
        checkOutTime = new Date(attObject.checkOutTime);

        var diff =
          new Date(attObject.checkOutTime).getTime() -
          new Date(attObject.checkInTime).getTime();
        var hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);
        var mins = Math.floor(diff / (1000 * 60));
        diff -= mins * (1000 * 60);

        hours = String(hours).padStart(2, "0");
        mins = String(mins).padStart(2, "0");
        var result = hours + ":" + mins;

        request_data["totalTime"] = result;
      }
      request_data["checkOutTime"] = checkOutTime;

      console.log({ request_data });

      setAttenanceInit(request_data);
      setSalaryApprovalModal(status);
    } else {
      setSalaryApprovalModal(status);
    }
  };

  const taskDetails = (status, taskId = null) => {
    console.log({ taskId });
    if (status) {
      let reqData = {
        taskId: taskId,
      };

      getTaskDetailsForUpdate(reqData)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            let taskData = res.response;

            let input_data = {
              taskId: taskData.taskId,
              taskDate: new Date(taskData.taskDate),
              employeeId: taskData.employeeId,
              attendanceId: taskData.attendanceId,
              taskType: parseInt(taskData.taskType),
              employeeName: taskData.employeeName,
              startTime: new Date(taskData.startTime),
              endTime: taskData.endTime,

              machineId: taskData.machineId,
              jobId: taskData.jobId,
              jobOperationId: taskData.jobOperationId,
              isMachineCount: taskData.isMachineCount,
              machineStartCount: taskData.machineStartCount,
              machineEndCount: taskData.machineEndCount,
              totalCount: taskData.totalCount,
              actualProduction: taskData.actualProduction,

              workBreakId: taskData.workBreakId,
              workDone: taskData.workDone == true ? "true" : "false",

              cycleTime: taskData.cycleTime,
              pcsRate: taskData.pcsRate,
              averagePerShift: taskData.averagePerShift,
              pointPerJob: taskData.pointPerJob,

              totalQty: taskData.totalQty != null ? taskData.totalQty : 0,
              reworkQty: taskData.reworkQty != null ? taskData.reworkQty : 0,
              machineRejectQty:
                taskData.machineRejectQty != null
                  ? taskData.machineRejectQty
                  : 0,
              doubtfulQty:
                taskData.doubtfulQty != null ? taskData.doubtfulQty : 0,
              unMachinedQty:
                taskData.unMachinedQty != null ? taskData.unMachinedQty : 0,
              okQty: taskData.okQty != null ? taskData.okQty : 0,
              settingTimeInMin:
                taskData.settingTimeInMin != null
                  ? taskData.settingTimeInMin
                  : 0,
              correctiveAction:
                taskData.correctiveAction != null
                  ? taskData.correctiveAction
                  : "",
              preventiveAction:
                taskData.preventiveAction != null
                  ? taskData.preventiveAction
                  : "",
              remark: taskData.remark != null ? taskData.remark : "",
              adminRemark:
                taskData.adminRemark != null ? taskData.adminRemark : "",
              breakName: taskData.breakName != null ? taskData.breakName : "",
            };

            // let startTime = moment(
            //   taskData.startTime,
            //   "YYYY-MM-DD HH:mm:ss"
            // ).format("HH:mm:ss");
            // input_data["dbstartTime"] = taskData.startTime;
            // input_data["startTime"] = startTime;

            // input_data["dbendTime"] = "";
            input_data["endTime"] = "";
            let endTime = "";
            if (taskData.endTime != null && taskData.endTime != "") {
              // endTime = moment(taskData.endTime, "YYYY-MM-DD HH:mm:ss").format(
              //   "HH:mm:ss"
              // );
              // input_data["dbendTime"] = taskData.endTime;
              endTime = new Date(taskData.endTime);
            }
            input_data["endTime"] = endTime;

            console.log({ input_data });

            if (input_data.taskType == 1) {
              input_data.machineId = getSelectValue(
                machineOpts,
                parseInt(input_data.machineId)
              );
              input_data.jobId = getSelectValue(
                jobOpts,
                parseInt(input_data.jobId)
              );
              getJobOperationList(input_data.jobId.value, input_data);
            } else if (input_data.taskType == 2) {
              input_data.workBreakId = getSelectValue(
                workBreakOpts,
                parseInt(input_data.workBreakId)
              );
              setTaskInit(input_data);
              setTaskModalShow(true);
            } else if (input_data.taskType == 3) {
              input_data.machineId = getSelectValue(
                machineOpts,
                parseInt(input_data.machineId)
              );
              setTaskInit(input_data);
              setTaskModalShow(true);
            } else if (input_data.taskType == 4) {
              setTaskInit(input_data);
              setTaskModalShow(true);
            }
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      setTaskModalShow(status);
      // this.setState({ taskModalShow: status });
    }
  };

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
              label: values.name,
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
        let jobOperationOp =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.operationName,
            };
          });
        setjobOperationOpts(jobOperationOp);

        if (values != null && values.jobOperationId) {
          let jobOperationOpt =
            values.jobOperationId != ""
              ? getSelectValue(jobOperationOp, values.jobOperationId)
              : "";

          values.jobOperationId = jobOperationOpt;
          setTaskInit(values);
          setTaskModalShow(true);
        }
      })
      .catch((error) => {
        console.log({ error });
      });
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

      if (dt1 > dt2) {
        console.warn("check in is greater >>>>>>>>>>>>>>>>>>>>>>>>>>>");
        toast.error("✘ checkin time greater than checkout time");
        setFieldValue("checkOutTime", "");
        setFieldValue("totalTime", "");
      } else {
        // var dt1 = new Date("2019-1-8 " + checkInTime);
        // var dt2 = new Date("2019-1-8 " + checkOutTime);

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
      }
    } else {
      setFieldValue("checkOutTime", "");
      setFieldValue("totalTime", "");
    }
  };

  const getAttendanceData = () => {
    console.log(
      "passed props >>>>>>>>>>>>>>>>>>>",
      props.history.location.state
    );

    setIsLoading(true);
    let reqData = {
      fromDate:
        fromDate != null && fromDate != ""
          ? moment(fromDate).format("YYYY-MM-DD")
          : "",
      attendanceDate:
        attDate != null && attDate != ""
          ? moment(attDate).format("YYYY-MM-DD")
          : "",
      employeeId:
        employeeId != null && employeeId != "" ? employeeId.value : "",
      attStatus: attStatus != null && attStatus != "" ? attStatus.value : "",
      selectedShift:
        props.history.location.state != null &&
        props.history.location.state != ""
          ? props.history.location.state
          : "",
    };
    todayEmployeeAttendance(reqData)
      .then((response) => {
        setIsLoading(false);
        let res = response.data;
        console.log({ res });
        if (res.responseStatus == 200) {
          setAttendanceData(res.response);
          setOrgData(res.response);
        } else {
          toast.error("✘ " + res.message);
          setAttendanceData([]);
          setOrgData([]);
        }
        setMainData("");
        setMainInnerData("");
        setBreakInnerData("");
        setMachineInnerData("");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const exportData = () => {
    setIsLoading(true);
    let frmDate =
      fromDate != null && fromDate != ""
        ? moment(fromDate).format("YYYY-MM-DD")
        : "na";
    let attendanceDate =
      attDate != null && attDate != ""
        ? moment(attDate).format("YYYY-MM-DD")
        : "na";
    let empId =
      employeeId != null && employeeId != "" ? employeeId.value : "na";

    let status = attStatus != null && attStatus != "" ? attStatus.value : "na";

    let filename = "emp_att_sheet.xlsx";

    const requestOption = {
      method: "GET",
      headers: getHeader(),
    };

    return fetch(
      exportExcelTodayEmployeeAttendanceUrl(
        frmDate,
        attendanceDate,
        empId,
        status
      ),
      requestOption
    )
      .then((response) => response.blob())
      .then((blob) => {
        setIsLoading(false);
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

  useEffect(() => {
    listOfMachineFun();
    listOfJobsForSelectFun();
    listOfBreakFun();
    getAttendanceData();
    getEmpOptions();
  }, []);

  useEffect(() => {
    getAttendanceData();
  }, [fromDate, attDate, employeeId, attStatus]);

  const getEmpOptions = () => {
    listOfEmployee()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt = result.map(function (data) {
            let empName = data.firstName.trim();
            if (data.lastName != null)
              empName = empName + " " + data.lastName.trim();
            return {
              value: data.id,
              label: empName,
            };
          });
          setEmpOpts(opt);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const reviseWages = (attendanceId, employeeId) => {
    console.log({ attendanceId, employeeId });
    Swal.fire({
      title: `Are you sure? `,
      customClass: "sweetclass",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes Revise",
    }).then((result) => {
      if (!result.isConfirmed) {
        return false;
      }

      let request_data = new FormData();
      request_data.append("attendanceId", attendanceId);
      request_data.append("employeeId", employeeId);

      recalculateEmployeeTasksAttendance(request_data)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            toast.success("✔ " + res.message);
            getAttendanceData();
          } else {
            toast.error("✘ " + res.message);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    });
  };

  const deleteAttendanceFun = (attendanceId) => {
    console.log({ attendanceId });
    Swal.fire({
      title: `Are you sure? `,
      customClass: "sweetclass",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes Delete",
    }).then((result) => {
      if (!result.isConfirmed) {
        return false;
      }

      let request_data = new FormData();
      request_data.append("attendanceId", attendanceId);
      deleteAttendance(request_data)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            toast.success("✔ " + res.message);
            getAttendanceData();
          } else {
            toast.error("✘ " + res.message);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    });
  };

  const deleteTaskFun = (taskId) => {
    console.log({ taskId });
    Swal.fire({
      title: `Are you sure? `,
      customClass: "sweetclass",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes Delete",
    }).then((result) => {
      if (!result.isConfirmed) {
        return false;
      }

      let request_data = new FormData();
      request_data.append("taskId", taskId);
      deleteTask(request_data)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            toast.success("✔ " + res.message);
            getAttendanceData();
          } else {
            toast.error("✘ " + res.message);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    });
  };

  const getReviseAllEmployee = () => {
    Swal.fire({
      title: `Are you sure? `,
      customClass: "sweetclass",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes Revise",
    }).then((result) => {
      if (!result.isConfirmed) {
        return false;
      }

      setIsLoading(true);
      let reqData = {
        fromDate:
          fromDate != null && fromDate != ""
            ? moment(fromDate).format("YYYY-MM-DD")
            : "",
        attendanceDate:
          attDate != null && attDate != ""
            ? moment(attDate).format("YYYY-MM-DD")
            : "",
        employeeId:
          employeeId != null && employeeId != "" ? employeeId.value : "",
        attStatus: attStatus != null && attStatus != "" ? attStatus.value : "",
      };

      recalculateAllEmployeeTasksAttendance(reqData)
        .then((response) => {
          setIsLoading(false);
          let res = response.data;
          if (res.responseStatus == 200) {
            toast.success("✔ " + res.message);
            getAttendanceData();
          } else {
            toast.error("✘ " + res.message);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    });
  };

  return (
    <div className="emp">
      <div className="container-fluid">
        <Row className="mt-3">
          <Col md="3">
            <div className="searchprdct mt-4">
              <h4>ATTENDANCE</h4>
            </div>
          </Col>

          <Col md="1">
            <FormGroup>
              <Label> From Date</Label>
              <MyDatePicker
                autoComplete="off"
                className="datepic form-control"
                name="taskDate"
                placeholderText="dd/MM/yyyy"
                id="taskDate"
                dateFormat="dd/MM/yyyy"
                // value={values.taskDate}
                onChange={(e) => {
                  console.log("date ", e);
                  setFromDate(e);
                }}
                selected={fromDate}
                maxDate={new Date()}
              />
            </FormGroup>
          </Col>

          <Col md="1">
            <FormGroup>
              <Label> To Date</Label>
              <MyDatePicker
                autoComplete="off"
                className="datepic form-control"
                name="taskDate"
                placeholderText="dd/MM/yyyy"
                id="taskDate"
                dateFormat="dd/MM/yyyy"
                // value={values.taskDate}
                onChange={(e) => {
                  console.log("date ", e);
                  setAttDate(e);
                }}
                selected={attDate}
                maxDate={new Date()}
              />
            </FormGroup>
          </Col>
          <Col md="2">
            &nbsp;
            <FormGroup>
              <Select
                placeholder="Select Employee"
                ////isClearable={true}
                styles={{
                  clearIndicator: ClearIndicatorStyles,
                  menu: (provided) => ({ ...provided, zIndex: 91 }),
                }}
                onChange={(v) => {
                  setEmployeeId(v);
                  console.log(v);
                  // handleSearch(v != null ? v.label : "");
                }}
                name="employeeId"
                id="employeeId"
                options={empOpts}
                value={employeeId}
                className="mt-2"
              />
            </FormGroup>
          </Col>
          <Col md="1">
            &nbsp;
            <FormGroup>
              <Select
                placeholder="Status"
                ////isClearable={true}
                styles={{
                  clearIndicator: ClearIndicatorStyles,
                  menu: (provided) => ({ ...provided, zIndex: 91 }),
                }}
                onChange={(v) => {
                  setAttStatus(v);
                }}
                name="attStatus"
                id="attStatus"
                options={atttendanceOpt}
                value={attStatus}
                className="mt-2"
              />
            </FormGroup>
          </Col>
          <Col md="2">
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
                Revising...
              </Button>
            ) : (
              <Button
                type="button"
                className="mainbtn1 text-white mr-2 report-show-btn"
                onClick={(e) => {
                  e.preventDefault();
                  getReviseAllEmployee();
                }}
              >
                Salary revise of all employees
              </Button>
            )}
          </Col>
          <Col md="2">
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
                Exporting...
              </Button>
            ) : (
              <Button
                type="button"
                className="mainbtn1 text-white mr-2 report-show-btn"
                onClick={(e) => {
                  e.preventDefault();
                  if (attendanceData.length > 0) {
                    exportData();
                  }
                }}
              >
                Export Excel
              </Button>
            )}
          </Col>
        </Row>

        {isLoading != true ? (
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
                  <th className="th-style">Date</th>
                  <th className="th-style">Employee Name</th>
                  <th className="th-style">In</th>
                  <th className="th-style">Out</th>
                  <th className="th-style">LT(MIN)</th>
                  <th className="th-style">WH(HR)</th>
                  <th className="th-style">PWH(HR)</th>
                  <th className="th-style">PROD(%)</th>
                  <th className="th-style">PWHWS(HR)</th>
                  {secureData.instituteId == 2 ? null : (
                    <>
                      <th className="th-style"> FT-Time</th>
                      <th className="th-style">ET-Time</th>
                    </>
                  )}
                  <th className="th-style">Wages Per Day</th>
                  <th className="th-style">Wages Per Hour</th>
                  {secureData.instituteId == 2 ? null : (
                    <>
                      <th className="th-style">Hour Wages</th>
                      <th className="th-style">Wages Per Point</th>
                      <th className="th-style">Total Points</th>
                      <th className="th-style">Point Wages</th>
                      <th className="th-style">PCS Wages</th>
                    </>
                  )}
                  <th className="th-style">Break Wages</th>
                  {secureData.instituteId == 2 ? null : (
                    <th className="th-style">Net PCS Wages</th>
                  )}
                  <th className="th-style">Remark</th>
                  <th className="th-style">Admin Remark</th>
                  <th className="th-style">Action</th>
                </tr>
              </thead>
              <tbody
                style={{
                  textAlign: "center",
                }}
              >
                {attendanceData &&
                  attendanceData.map((v, i) => {
                    return (
                      <>
                        <tr>
                          <td style={{ width: "2%" }}>
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                if (parseInt(mainData) == parseInt(i))
                                  setMainData("");
                                else {
                                  setMainData(i);
                                  setMainInnerData("");
                                  setBreakInnerData("");
                                }
                              }}
                              className="btn-arrow-style"
                            >
                              {parseInt(mainData) == parseInt(i) ? (
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
                          <td>{v.attendanceDate}</td>
                          <td>
                            {v.employeeName} ({v.designationCode})
                          </td>
                          <td>
                            {v.checkInTime != "" ? (
                              <>
                                <span style={{ fontSize: "12px" }}>
                                  ({moment(v.checkInTime).format("D-M")})
                                </span>
                                <br />
                                {moment(v.checkInTime).format("HH:mm:ss")}
                              </>
                            ) : (
                              ""
                            )}
                          </td>
                          <td>
                            {v.checkOutTime != "" ? (
                              <>
                                <span style={{ fontSize: "12px" }}>
                                  ({moment(v.checkOutTime).format("D-M")})
                                </span>
                                <br />
                                {moment(v.checkOutTime).format("HH:mm:ss")}
                              </>
                            ) : (
                              ""
                            )}
                          </td>
                          <td>{v.lunchTimeInMin}</td>
                          <td>{v.workingHours}</td>
                          <td>{v.prodWorkingHours}</td>
                          <td>
                            <ProgressBar
                              striped
                              animated
                              variant="warning"
                              now={v.productionPercentage}
                              label={`${v.productionPercentage}%`}
                              style={{
                                height: "13px",
                              }}
                            />
                            {v.productionPercentage}
                          </td>
                          <td>{v.workingHourWithSetting}</td>
                          {secureData.instituteId == 2 ? null : (
                            <>
                              <td>
                                {v.firstTaskStartTime != "" ? (
                                  <>
                                    <span style={{ fontSize: "12px" }}>
                                      (
                                      {moment(v.firstTaskStartTime).format(
                                        "D-M"
                                      )}
                                      )
                                    </span>
                                    <br />
                                    {moment(v.firstTaskStartTime).format(
                                      "HH:mm:ss"
                                    )}
                                  </>
                                ) : (
                                  ""
                                )}
                              </td>
                              <td>
                                {v.lastTaskEndTime != "" ? (
                                  <>
                                    <span style={{ fontSize: "12px" }}>
                                      ({moment(v.lastTaskEndTime).format("D-M")}
                                      )
                                    </span>
                                    <br />
                                    {moment(v.lastTaskEndTime).format(
                                      "HH:mm:ss"
                                    )}
                                  </>
                                ) : (
                                  ""
                                )}
                              </td>
                            </>
                          )}
                          <td
                            className={`${
                              v.finalDaySalaryType === "day"
                                ? "finalSalaryBgClr"
                                : ""
                            }`}
                          >
                            {v.wagesPerDay}
                          </td>
                          <td>{v.wagesPerHour}</td>
                          {secureData.instituteId == 2 ? null : (
                            <>
                              <td
                                className={`${
                                  v.finalDaySalaryType === "hr"
                                    ? "finalSalaryBgClr"
                                    : ""
                                }`}
                              >
                                {v.wagesHourBasis}
                              </td>

                              <td>{v.wagePerPoint}</td>
                              <td>{v.totalWorkPoint}</td>
                              <td
                                className={`${
                                  v.finalDaySalaryType === "point"
                                    ? "finalSalaryBgClr"
                                    : ""
                                }`}
                              >
                                {v.wagesPointBasis}
                              </td>
                              <td>{v.wagesPcsBasis}</td>
                            </>
                          )}
                          <td>{v.breakWages}</td>
                          {secureData.instituteId == 2 ? null : (
                            <>
                              <td
                                className={`${
                                  v.finalDaySalaryType === "pcs"
                                    ? "finalSalaryBgClr"
                                    : ""
                                }`}
                              >
                                {v.netPcsWages}
                              </td>
                            </>
                          )}
                          <td>{v.remark}</td>
                          <td>{v.adminRemark}</td>

                          <td style={{ width: "7%" }}>
                            {" "}
                            <Button
                              onClick={(e) => {
                                // console.log("row ", row._original);
                                e.preventDefault();
                                onEditModalShow(true, v);
                              }}
                              color="white"
                              size="sm"
                              round="true"
                              icon="true"
                            >
                              <i
                                className="fa fa-edit"
                                style={{ color: "#ffb22b" }}
                              />
                            </Button>
                            {v.attendanceStatus == "pending" ? (
                              <Button
                                onClick={(e) => {
                                  console.log("row ", v);
                                  e.preventDefault();
                                  reviseWages(v.attendanceId, v.employeeId);
                                }}
                                color="white"
                                size="sm"
                                round="true"
                                icon="true"
                              >
                                <i
                                  className="fa fa-refresh"
                                  style={{ color: "#ffb22b" }}
                                />
                              </Button>
                            ) : (
                              ""
                            )}
                            <Button
                              onClick={(e) => {
                                console.log("row ", v);
                                e.preventDefault();
                                deleteAttendanceFun(v.attendanceId);
                              }}
                              color="white"
                              size="sm"
                              round="true"
                              icon="true"
                            >
                              <i
                                className="fa fa-trash"
                                style={{ color: "red" }}
                              />
                            </Button>
                            <Button
                              onClick={(e) => {
                                console.log("row ", v);
                                e.preventDefault();
                                onSalaryModalShow(true, v);
                              }}
                              color="white"
                              size="sm"
                              round="true"
                              icon="true"
                            >
                              {v.attendanceStatus == "pending" ? (
                                <i
                                  className="fa fa-check"
                                  style={{ color: "red" }}
                                />
                              ) : (
                                <i
                                  className="fa fa-check"
                                  style={{ color: "green" }}
                                />
                              )}
                            </Button>
                          </td>
                        </tr>
                        {v.summaryData != "" && v.empType == "l3" ? (
                          <tr
                            className={`${
                              parseInt(mainData) == parseInt(i) ? "" : " d-none"
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
                                className={`${
                                  parseInt(mainData) == parseInt(i)
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
                                    <th></th>
                                    <th>Machine</th>
                                    <th>Item</th>
                                    <th>Operation</th>
                                    <th>CT</th>
                                    <th>PRD QTY</th>
                                    <th>PRD QTY(%)</th>
                                    <th>PRD WH</th>
                                    <th>ST(MIN)</th>
                                    <th>ST(HR)</th>
                                    <th>WHWS(HR)</th>
                                    <th>Per AVG Shift</th>
                                    <th>Per JOB PT</th>
                                    <th>PRD PT</th>
                                    <th>Setting Time PT</th>
                                    <th>Total PT</th>
                                    <th>Wages Per PT</th>
                                    <th>PT Wages</th>
                                    <th>Wages Per PCS</th>
                                    <th>PCS Wages</th>
                                  </tr>
                                </thead>
                                <tbody
                                  style={{
                                    background: "#FEFCF3",
                                    textAlign: "center",
                                  }}
                                >
                                  {v.summaryData &&
                                    v.summaryData.map((vi, ii) => {
                                      return (
                                        <>
                                          <tr>
                                            <td style={{ width: "2%" }}>
                                              {" "}
                                              <Button
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  if (
                                                    parseInt(mainInnerData) ==
                                                    parseInt(ii)
                                                  )
                                                    setMainInnerData("");
                                                  else setMainInnerData(ii);
                                                }}
                                                className="btn-arrow-style"
                                              >
                                                {parseInt(mainInnerData) ==
                                                parseInt(ii) ? (
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
                                            <td>{vi.machineNo}</td>
                                            <td>{vi.jobName}</td>
                                            <td>{vi.operationName}</td>
                                            <td>{vi.cycleTime}</td>
                                            <td>{vi.okQty}</td>
                                            <td>
                                              <ProgressBar
                                                striped
                                                animated
                                                variant="warning"
                                                now={vi.averageTaskPercentage}
                                                label={`${vi.averageTaskPercentage}%`}
                                                style={{
                                                  height: "13px",
                                                }}
                                              />
                                            </td>
                                            <td>{vi.prodWorkingHour}</td>
                                            <td>{vi.settingTimeInMin}</td>
                                            <td>{vi.settingTimeInHour}</td>
                                            <td>{vi.workingHourWithSetting}</td>
                                            <td>{vi.averagePerShift}</td>
                                            <td>{vi.perJobPoint}</td>
                                            <td>{vi.prodPoint}</td>
                                            <td>{vi.settingTimePoint}</td>
                                            <td>{vi.totalPoint}</td>
                                            <td>{vi.wagesPerPoint}</td>
                                            <td>{vi.wagesPointBasis}</td>
                                            <td>{vi.pcsRate}</td>
                                            <td>{vi.wagesPcsBasis}</td>
                                          </tr>
                                          {vi.taskData != "" ? (
                                            <tr
                                              className={`${
                                                parseInt(mainInnerData) ==
                                                parseInt(ii)
                                                  ? ""
                                                  : " d-none"
                                              }`}
                                            >
                                              <td
                                                colSpan={21}
                                                className="bg-white inner-tbl-td"
                                              >
                                                <Table
                                                  bordered
                                                  responsive
                                                  size="sm"
                                                  className={`${
                                                    parseInt(mainInnerData) ==
                                                    parseInt(ii)
                                                      ? "mb-0"
                                                      : "mb-0 d-none"
                                                  }`}
                                                >
                                                  <thead
                                                    style={{
                                                      background: "#C6E6EC",
                                                    }}
                                                    className="datastyle-head"
                                                  >
                                                    <tr>
                                                      <th>Start</th>
                                                      <th>End</th>
                                                      <th>PRD QTY</th>
                                                      <th>WH(HR)</th>
                                                      <th>PWH(HR)</th>
                                                      <th>ST(HR)</th>
                                                      <th>WHWS(HR)</th>
                                                      <th>PRD PT</th>
                                                      <th>Setting Time PT</th>
                                                      <th>Total PT</th>
                                                      <th>Wages Per PT</th>
                                                      <th>PT Wages</th>
                                                      <th>Wages Per PCS</th>
                                                      <th>PCS Wages</th>
                                                      <th>Remark</th>
                                                      <th>Admin Remark</th>
                                                      <th>Action</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody
                                                    style={{
                                                      background: "#EFFCFC",
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    {vi.taskData &&
                                                      vi.taskData.map(
                                                        (vii, iii) => {
                                                          return (
                                                            <tr>
                                                              <td>
                                                                {vii.startTime !=
                                                                "" ? (
                                                                  <>
                                                                    <span
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
                                                                    </span>

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
                                                                      (
                                                                      {moment(
                                                                        vii.endTime
                                                                      ).format(
                                                                        "D-M"
                                                                      )}
                                                                      )
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
                                                              {vii.okQty !=
                                                              null ? (
                                                                <td>
                                                                  <ProgressBar
                                                                    striped
                                                                    animated
                                                                    variant="warning"
                                                                    now={
                                                                      vii.taskPercentage
                                                                    }
                                                                    label={`${vii.taskPercentage}%`}
                                                                    style={{
                                                                      height:
                                                                        "13px",
                                                                    }}
                                                                  />
                                                                  {vii.okQty}
                                                                </td>
                                                              ) : (
                                                                <td>
                                                                  {vii.okQty}
                                                                </td>
                                                              )}
                                                              <td>
                                                                {
                                                                  vii.workingHour
                                                                }
                                                              </td>
                                                              <td>
                                                                {
                                                                  vii.prodWorkingHour
                                                                }
                                                              </td>
                                                              <td>
                                                                {
                                                                  vii.settingTimeInHour
                                                                }
                                                              </td>
                                                              <td>
                                                                {
                                                                  vii.workingHourWithSetting
                                                                }
                                                              </td>
                                                              <td>
                                                                {vii.prodPoint}
                                                              </td>
                                                              <td>
                                                                {
                                                                  vii.settingTimePoint
                                                                }
                                                              </td>
                                                              <td>
                                                                {vii.totalPoint}
                                                              </td>
                                                              <td>
                                                                {
                                                                  vii.wagesPerPoint
                                                                }
                                                              </td>
                                                              <td>
                                                                {
                                                                  vii.wagesPointBasis
                                                                }
                                                              </td>
                                                              <td>
                                                                {vii.pcsRate}
                                                              </td>
                                                              <td>
                                                                {
                                                                  vii.wagesPcsBasis
                                                                }
                                                              </td>
                                                              <td>
                                                                {vii.remark}
                                                              </td>
                                                              <td>
                                                                {
                                                                  vii.adminRemark
                                                                }
                                                              </td>
                                                              <td>
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
                                                              </td>
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
                        ) : (
                          ""
                        )}

                        {v.taskWithoutMachineData != "" ? (
                          <tr
                            className={`${
                              parseInt(mainData) == parseInt(i) ? "" : " d-none"
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
                                className={`${
                                  parseInt(mainData) == parseInt(i)
                                    ? "mb-0"
                                    : "mb-0 d-none"
                                }`}
                              >
                                <thead
                                  style={{
                                    background: "#C6E6EC",
                                  }}
                                  className="datastyle-head"
                                >
                                  <tr>
                                    <th></th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>WH(HR)</th>
                                    <th>PWH(HR)</th>
                                    <th>ST(HR)</th>
                                    <th>WHWS(HR)</th>
                                    <th>PRD PT</th>
                                    <th>Setting Time PT</th>
                                    <th>Total PT</th>
                                    <th>Wages Per PT</th>
                                    <th>PT Wages</th>
                                    <th>Wages Per PCS</th>
                                    <th>PCS Wages</th>
                                    <th>Remark</th>
                                    <th>Admin Remark</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody
                                  style={{
                                    background: "#FEFCF3",
                                    textAlign: "center",
                                  }}
                                >
                                  {v.taskWithoutMachineData &&
                                    v.taskWithoutMachineData.map((vi, ii) => {
                                      return (
                                        <tr>
                                          <td>{}</td>
                                          <td>
                                            {vi.startTime != "" ? (
                                              <>
                                                <span
                                                  style={{
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  (
                                                  {moment(vi.startTime).format(
                                                    "D-M"
                                                  )}
                                                  )
                                                </span>

                                                {moment(vi.startTime).format(
                                                  "HH:mm:ss"
                                                )}
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </td>
                                          <td>
                                            {vi.endTime != "" ? (
                                              <>
                                                <span
                                                  style={{
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  (
                                                  {moment(vi.endTime).format(
                                                    "D-M"
                                                  )}
                                                  )
                                                </span>

                                                {moment(vi.endTime).format(
                                                  "HH:mm:ss"
                                                )}
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </td>
                                          <td>{vi.workingHour}</td>
                                          <td>{vi.prodWorkingHour}</td>
                                          <td>{vi.settingTimeInHour}</td>
                                          <td>{vi.workingHourWithSetting}</td>
                                          <td>{vi.prodPoint}</td>
                                          <td>{vi.settingTimePoint}</td>
                                          <td>{vi.totalPoint}</td>
                                          <td>{vi.wagesPerPoint}</td>
                                          <td>{vi.wagesPointBasis}</td>
                                          <td>{vi.pcsRate}</td>
                                          <td>{vi.wagesPcsBasis}</td>
                                          <td>{vi.remark}</td>
                                          <td>{vi.adminRemark}</td>
                                          <td>
                                            <Button
                                              onClick={(e) => {
                                                e.preventDefault();
                                                taskDetails(true, vi.taskId);
                                              }}
                                              color="white"
                                              size="sm"
                                              round="true"
                                              icon="true"
                                            >
                                              <i
                                                className="fa fa-edit"
                                                style={{
                                                  color: "#ffb22b",
                                                }}
                                              />
                                            </Button>
                                            <Button
                                              onClick={(e) => {
                                                console.log("row ", v);
                                                e.preventDefault();
                                                deleteTaskFun(vi.taskId);
                                              }}
                                              color="white"
                                              size="sm"
                                              round="true"
                                              icon="true"
                                            >
                                              <i
                                                className="fa fa-trash"
                                                style={{
                                                  color: "red",
                                                }}
                                              />
                                            </Button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                              </Table>
                            </td>
                          </tr>
                        ) : (
                          ""
                        )}
                        {/* 
                        {v.taskWithoutMachineData != "" && v.empType == "l3" ? (
                          <tr
                            className={`${
                              parseInt(mainData) == parseInt(i) ? "" : " d-none"
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
                                className={`${
                                  parseInt(mainData) == parseInt(i)
                                    ? "mb-0"
                                    : "mb-0 d-none"
                                }`}
                              >
                                <thead
                                  style={{
                                    background: "#C6E6EC",
                                  }}
                                  className="datastyle-head"
                                >
                                  <tr>
                                    <th></th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>WH(HR)</th>
                                    <th>PWH(HR)</th>
                                    <th>ST(HR)</th>
                                    <th>WHWS(HR)</th>
                                    <th>PRD PT</th>
                                    <th>Setting Time PT</th>
                                    <th>Total PT</th>
                                    <th>Wages Per PT</th>
                                    <th>PT Wages</th>
                                    <th>Wages Per PCS</th>
                                    <th>PCS Wages</th>
                                    <th>Remark</th>
                                    <th>Admin Remark</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody
                                  style={{
                                    background: "#FEFCF3",
                                    textAlign: "center",
                                  }}
                                >
                                  {v.taskWithoutMachineData &&
                                    v.taskWithoutMachineData.map((vi, ii) => {
                                      return (
                                        <tr>
                                          <td>{}</td>
                                          <td>
                                            {vi.startTime != "" ? (
                                              <>
                                                <span
                                                  style={{
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  (
                                                  {moment(vi.startTime).format(
                                                    "D-M"
                                                  )}
                                                  )
                                                </span>

                                                {moment(vi.startTime).format(
                                                  "HH:mm:ss"
                                                )}
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </td>
                                          <td>
                                            {vi.endTime != "" ? (
                                              <>
                                                <span
                                                  style={{
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  (
                                                  {moment(vi.endTime).format(
                                                    "D-M"
                                                  )}
                                                  )
                                                </span>

                                                {moment(vi.endTime).format(
                                                  "HH:mm:ss"
                                                )}
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </td>
                                          <td>{vi.workingHour}</td>
                                          <td>{vi.prodWorkingHour}</td>
                                          <td>{vi.settingTimeInHour}</td>
                                          <td>{vi.workingHourWithSetting}</td>
                                          <td>{vi.prodPoint}</td>
                                          <td>{vi.settingTimePoint}</td>
                                          <td>{vi.totalPoint}</td>
                                          <td>{vi.wagesPerPoint}</td>
                                          <td>{vi.wagesPointBasis}</td>
                                          <td>{vi.pcsRate}</td>
                                          <td>{vi.wagesPcsBasis}</td>
                                          <td>{vi.remark}</td>
                                          <td>{vi.adminRemark}</td>
                                          <td>
                                            <Button
                                              onClick={(e) => {
                                                e.preventDefault();
                                                taskDetails(true, vi.taskId);
                                              }}
                                              color="white"
                                              size="sm"
                                              round="true"
                                              icon="true"
                                            >
                                              <i
                                                className="fa fa-edit"
                                                style={{
                                                  color: "#ffb22b",
                                                }}
                                              />
                                            </Button>
                                            <Button
                                              onClick={(e) => {
                                                console.log("row ", v);
                                                e.preventDefault();
                                                deleteTaskFun(vi.taskId);
                                              }}
                                              color="white"
                                              size="sm"
                                              round="true"
                                              icon="true"
                                            >
                                              <i
                                                className="fa fa-trash"
                                                style={{
                                                  color: "red",
                                                }}
                                              />
                                            </Button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                              </Table>
                            </td>
                          </tr>
                        ) : (
                          ""
                        )} */}

                        {v.summaryData != "" && v.empType == "l2" ? (
                          <tr
                            className={`${
                              parseInt(mainData) == parseInt(i) ? "" : " d-none"
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
                                className={`${
                                  parseInt(mainData) == parseInt(i)
                                    ? "mb-0"
                                    : "mb-0 d-none"
                                }`}
                              >
                                <thead
                                  style={{
                                    background: "#C6E6EC",
                                  }}
                                  className="datastyle-head"
                                >
                                  <tr>
                                    <th></th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>WH(HR)</th>
                                    <th>PWH(HR)</th>
                                    <th>ST(HR)</th>
                                    <th>WHWS(HR)</th>
                                    <th>PRD PT</th>
                                    <th>Setting Time PT</th>
                                    <th>Total PT</th>
                                    <th>Wages Per PT</th>
                                    <th>PT Wages</th>
                                    <th>Wages Per PCS</th>
                                    <th>PCS Wages</th>
                                    <th>Remark</th>
                                    <th>Admin Remark</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody
                                  style={{
                                    background: "#FEFCF3",
                                    textAlign: "center",
                                  }}
                                >
                                  {v.summaryData &&
                                    v.summaryData.map((vi, ii) => {
                                      return (
                                        <tr>
                                          <td>{}</td>
                                          <td>
                                            {vi.startTime != "" ? (
                                              <>
                                                <span
                                                  style={{
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  (
                                                  {moment(vi.startTime).format(
                                                    "D-M"
                                                  )}
                                                  )
                                                </span>

                                                {moment(vi.startTime).format(
                                                  "HH:mm:ss"
                                                )}
                                              </>
                                            ) : (
                                              ""
                                            )}
                                            {/* {vi.startTime} */}
                                          </td>
                                          <td>
                                            {vi.endTime != "" ? (
                                              <>
                                                <span
                                                  style={{
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  (
                                                  {moment(vi.endTime).format(
                                                    "D-M"
                                                  )}
                                                  )
                                                </span>

                                                {moment(vi.endTime).format(
                                                  "HH:mm:ss"
                                                )}
                                              </>
                                            ) : (
                                              ""
                                            )}
                                            {/* {vi.endTime} */}
                                          </td>
                                          <td>{vi.workingHour}</td>
                                          <td>{vi.prodWorkingHour}</td>
                                          <td>{vi.settingTimeInHour}</td>
                                          <td>{vi.workingHourWithSetting}</td>
                                          <td>{vi.prodPoint}</td>
                                          <td>{vi.settingTimePoint}</td>
                                          <td>{vi.totalPoint}</td>
                                          <td>{vi.wagesPerPoint}</td>
                                          <td>{vi.wagesPointBasis}</td>
                                          <td>{vi.pcsRate}</td>
                                          <td>{vi.wagesPcsBasis}</td>
                                          <td>{vi.remark}</td>
                                          <td>{vi.adminRemark}</td>
                                          <td>
                                            <Button
                                              onClick={(e) => {
                                                e.preventDefault();
                                                taskDetails(true, vi.taskId);
                                              }}
                                              color="white"
                                              size="sm"
                                              round="true"
                                              icon="true"
                                            >
                                              <i
                                                className="fa fa-edit"
                                                style={{
                                                  color: "#ffb22b",
                                                }}
                                              />
                                            </Button>
                                            <Button
                                              onClick={(e) => {
                                                console.log("row ", v);
                                                e.preventDefault();
                                                deleteTaskFun(vi.taskId);
                                              }}
                                              color="white"
                                              size="sm"
                                              round="true"
                                              icon="true"
                                            >
                                              <i
                                                className="fa fa-trash"
                                                style={{
                                                  color: "red",
                                                }}
                                              />
                                            </Button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                              </Table>
                            </td>
                          </tr>
                        ) : (
                          ""
                        )}

                        {v.downtimeData != "" ? (
                          <tr
                            className={`${
                              parseInt(mainData) == parseInt(i) ? "" : " d-none"
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
                                className={`${
                                  parseInt(mainData) == parseInt(i)
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
                                    <th></th>
                                    <th>Break Name</th>
                                    <th>Break Time</th>
                                    <th>Break Wages</th>
                                  </tr>
                                </thead>
                                <tbody
                                  style={{
                                    background: "#FEFCF3",
                                    textAlign: "center",
                                  }}
                                >
                                  {v.downtimeData &&
                                    v.downtimeData.map((vi, ii) => {
                                      return (
                                        <>
                                          <tr>
                                            <td style={{ width: "2%" }}>
                                              {" "}
                                              <Button
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  if (
                                                    parseInt(breakInnerData) ==
                                                    parseInt(ii)
                                                  )
                                                    setBreakInnerData("");
                                                  else {
                                                    setBreakInnerData(
                                                      parseInt(ii)
                                                    );
                                                  }
                                                }}
                                                className="btn-arrow-style"
                                              >
                                                {parseInt(breakInnerData) ==
                                                parseInt(ii) ? (
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
                                            <td>{vi.breakName}</td>
                                            <td>{vi.actualTime}</td>
                                            <td>{vi.breakWages}</td>
                                          </tr>
                                          {vi.breakList != "" ? (
                                            <tr
                                              className={`${
                                                parseInt(breakInnerData) ==
                                                parseInt(ii)
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
                                                  className={`${
                                                    parseInt(breakInnerData) ==
                                                    parseInt(ii)
                                                      ? "mb-0"
                                                      : "mb-0 d-none"
                                                  }`}
                                                >
                                                  <thead
                                                    style={{
                                                      background: "#C6E6EC",
                                                    }}
                                                    className="datastyle-head"
                                                  >
                                                    <tr>
                                                      {/* <th>Break Name</th> */}
                                                      <th>Start</th>
                                                      <th>End</th>
                                                      <th>Total(MIN)</th>
                                                      <th>Work Done</th>
                                                      <th>Break Wages</th>
                                                      <th>Remark</th>
                                                      <th>Admin Remark</th>
                                                      <th>Action</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody
                                                    style={{
                                                      background: "#EFFCFC",
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    {vi.breakList &&
                                                      vi.breakList.map(
                                                        (vii, iii) => {
                                                          return (
                                                            <tr>
                                                              {/* <td>
                                                                {vii.breakName}
                                                              </td> */}
                                                              <td>
                                                                {vii.startTime !=
                                                                "" ? (
                                                                  <>
                                                                    <span
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
                                                                    </span>
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
                                                                      (
                                                                      {moment(
                                                                        vii.endTime
                                                                      ).format(
                                                                        "D-M"
                                                                      )}
                                                                      )
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
                                                                {vii.totalTime}
                                                              </td>
                                                              <td>
                                                                {vii.workDone}
                                                              </td>
                                                              <td>
                                                                {vii.breakWages}
                                                              </td>
                                                              <td>
                                                                {vii.remark}
                                                              </td>
                                                              <td>
                                                                {
                                                                  vii.adminRemark
                                                                }
                                                              </td>
                                                              <td>
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
                                                              </td>
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
                        ) : (
                          ""
                        )}

                        {v.machineData != "" ? (
                          <tr
                            className={`${
                              parseInt(mainData) == parseInt(i) ? "" : " d-none"
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
                                className={`${
                                  parseInt(mainData) == parseInt(i)
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
                                    <th></th>
                                    <th>Machine Name</th>
                                    <th>Time</th>
                                    <th>Break Wages</th>
                                  </tr>
                                </thead>
                                <tbody
                                  style={{
                                    background: "#FEFCF3",
                                    textAlign: "center",
                                  }}
                                >
                                  {v.machineData &&
                                    v.machineData.map((vi, ii) => {
                                      return (
                                        <>
                                          <tr>
                                            <td style={{ width: "2%" }}>
                                              {" "}
                                              <Button
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  if (
                                                    parseInt(
                                                      machineInnerData
                                                    ) == parseInt(ii)
                                                  )
                                                    setMachineInnerData("");
                                                  else {
                                                    setMachineInnerData(
                                                      parseInt(ii)
                                                    );
                                                  }
                                                }}
                                                className="btn-arrow-style"
                                              >
                                                {parseInt(machineInnerData) ==
                                                parseInt(ii) ? (
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
                                            <td>{vi.breakName}</td>
                                            <td>{vi.actualTime}</td>
                                            <td>{vi.breakWages}</td>
                                          </tr>
                                          {vi.breakList != "" ? (
                                            <tr
                                              className={`${
                                                parseInt(machineInnerData) ==
                                                parseInt(ii)
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
                                                  className={`${
                                                    parseInt(
                                                      machineInnerData
                                                    ) == parseInt(ii)
                                                      ? "mb-0"
                                                      : "mb-0 d-none"
                                                  }`}
                                                >
                                                  <thead
                                                    style={{
                                                      background: "#C6E6EC",
                                                    }}
                                                    className="datastyle-head"
                                                  >
                                                    <tr>
                                                      {/* <th>Break Name</th> */}
                                                      <th>Start</th>
                                                      <th>End</th>
                                                      <th>Total(MIN)</th>
                                                      <th>Work Done</th>
                                                      <th>Break Wages</th>
                                                      <th>Remark</th>
                                                      <th>Admin Remark</th>
                                                      <th>Action</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody
                                                    style={{
                                                      background: "#EFFCFC",
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    {vi.breakList &&
                                                      vi.breakList.map(
                                                        (vii, iii) => {
                                                          return (
                                                            <tr>
                                                              <td>
                                                                {vii.startTime !=
                                                                "" ? (
                                                                  <>
                                                                    <span
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
                                                                    </span>
                                                                    {moment(
                                                                      vii.startTime
                                                                    ).format(
                                                                      "HH:mm:ss"
                                                                    )}
                                                                  </>
                                                                ) : (
                                                                  ""
                                                                )}
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
                                                                      (
                                                                      {moment(
                                                                        vii.endTime
                                                                      ).format(
                                                                        "D-M"
                                                                      )}
                                                                      )
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
                                                              </td>
                                                              <td>
                                                                {vii.totalTime}
                                                              </td>
                                                              <td>
                                                                {vii.workDone}
                                                              </td>
                                                              <td>
                                                                {vii.breakWages}
                                                              </td>
                                                              <td>
                                                                {vii.remark}
                                                              </td>
                                                              <td>
                                                                {
                                                                  vii.adminRemark
                                                                }
                                                              </td>
                                                              <td>
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
                                                              </td>
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
                        ) : (
                          ""
                        )}
                      </>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        ) : (
          <Spinner />
        )}

        {/* Salary Approval Modal */}
        <Modal
          className="modal-xl p-2 attendance-view-mdl"
          isOpen={salaryApprovalModal}
          toggle={() => {
            onSalaryModalShow(null);
          }}
          backdrop="static"
          keyboard={false}
        >
          <ModalHeader
            className="modalheader-style p-2"
            toggle={() => {
              onSalaryModalShow(null);
            }}
          >
            Employee Name: {attendanceInit && attendanceInit.employeeName}
            <CloseButton
              className="pull-right"
              onClick={() => {
                onSalaryModalShow(null);
              }}
            />
          </ModalHeader>

          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            innerRef={salaryForm}
            initialValues={attendanceInit}
            validationSchema={Yup.object().shape({
              employeeWagesType: Yup.string()
                .trim()
                .nullable()
                .required("Employee wages is required"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              setIsLoading(true);
              console.log({ values });

              let requestData = new FormData();
              requestData.append("attendanceId", values.attendanceId);
              requestData.append("attendanceDate", values.attendanceDate);
              requestData.append("attendanceStatus", "approve");
              requestData.append(
                "finalDaySalaryType",
                values.employeeWagesType
              );
              requestData.append(
                "remark",
                values.remark != null ? values.remark : ""
              );
              requestData.append(
                "adminRemark",
                values.adminRemark != null ? values.adminRemark : ""
              );

              if (values.employeeWagesType == "pcs")
                requestData.append("finalDaySalary", values.netPcsWages);
              if (values.employeeWagesType == "point")
                requestData.append("finalDaySalary", values.wagesPointBasis);
              if (values.employeeWagesType == "day")
                requestData.append("finalDaySalary", values.wagesPerDay);
              if (values.employeeWagesType == "hr")
                requestData.append("finalDaySalary", values.wagesHourBasis);

              approveSalaryAttendance(requestData)
                .then((response) => {
                  setIsLoading(false);
                  if (response.data.responseStatus == 200) {
                    setSubmitting(false);
                    toast.success("✔ " + response.data.message);
                    onSalaryModalShow(false);
                    getAttendanceData();
                  } else {
                    setSubmitting(false);
                    toast.error("✘ " + response.data.message);
                  }
                })
                .catch((error) => {
                  setIsLoading(false);
                  setSubmitting(false);
                  toast.error("✘" + error);
                });
            }}
            render={({
              values,
              errors,
              status,
              touched,
              isSubmitting,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <Form autoComplete="off">
                <ModalBody>
                  {/* {JSON.stringify(values)} */}
                  <Row>
                    <Col md="2">
                      <FormGroup>
                        <Label> Attendance Date</Label>
                        <MyDatePicker
                          readOnly={true}
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
                    <Col md="2">
                      <FormGroup>
                        <Label>Check In</Label>
                        <MyDateTimePicker
                          readOnly={true}
                          autoComplete="off"
                          className="datepic form-control"
                          name="checkInTime"
                          placeholderText="dd/MM/yyyy hh:mm:ss"
                          id="checkInTime"
                          dateFormat="dd/MM/yyyy HH:mm:ss"
                          showTimeInput
                          onChange={(e) => {
                            console.log("date ", e);
                            setFieldValue("checkInTime", e);
                          }}
                          selected={values.checkInTime}
                          maxDate={new Date()}
                        />
                        <span className="text-danger">
                          {errors.checkInTime}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Check Out</Label>
                        <MyDateTimePicker
                          readOnly={true}
                          autoComplete="off"
                          className="datepic form-control"
                          name="checkOutTime"
                          placeholderText="dd/MM/yyyy hh:mm:ss"
                          id="checkOutTime"
                          dateFormat="dd/MM/yyyy HH:mm:ss"
                          showTimeInput
                          onChange={(e) => {
                            console.log("date ", e);
                            setFieldValue("checkOutTime", e);
                          }}
                          // onBlur={(e) => {
                          //   setFieldValue("checkOutTime", "");
                          //   setFieldValue("totalTime", "");
                          //   if (
                          //     values.checkOutTime != null &&
                          //     values.checkOutTime != ""
                          //   ) {
                          //     calculateTime(
                          //       {
                          //         checkInTime: values.checkInTime,
                          //         checkOutTime: values.checkOutTime,
                          //       },
                          //       setFieldValue
                          //     );
                          //   }
                          // }}
                          selected={values.checkOutTime}
                          maxDate={new Date()}
                        />
                        <span className="text-danger">
                          {errors.checkOutTime}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="1">
                      <FormGroup>
                        <Label>Total Time</Label>
                        <Input
                          readOnly={true}
                          type="time"
                          placeholder="Enter from time"
                          name="totalTime"
                          onChange={handleChange}
                          value={values.totalTime}
                          invalid={errors.totalTime ? true : false}
                        />
                        <FormFeedback>{errors.totalTime}</FormFeedback>
                      </FormGroup>
                    </Col>

                    <Col md="1">
                      <FormGroup>
                        <Label> Working Hours</Label>
                        <Input
                          readOnly={true}
                          type="text"
                          name="workingHours"
                          id="workingHours"
                          onChange={handleChange}
                          value={values.workingHours}
                          invalid={errors.workingHours ? true : false}
                        />
                        <FormFeedback>{errors.workingHours}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Employee Remark</Label>
                        <Input
                          type="textarea"
                          placeholder="Employee Remark"
                          name="remark"
                          id="remark"
                          value={values.remark}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>Admin Remark</Label>
                        <Input
                          type="textarea"
                          placeholder="Admin Remark"
                          name="adminRemark"
                          id="adminRemark"
                          value={values.adminRemark}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                        <label>
                          Salary Option to confirm
                          <span className="text-danger">*</span>
                        </label>
                        <br />
                        <FormGroup className="gender nightshiftlabel">
                          <Label className="ml-3">
                            <input
                              // disabled={
                              //   values.attendanceStatus != "pending"
                              //     ? true
                              //     : false
                              // }
                              name="employeeWagesType"
                              type="radio"
                              value={"day"}
                              checked={
                                values.employeeWagesType === "day"
                                  ? true
                                  : false
                              }
                              onChange={(v) => {
                                setFieldValue("employeeWagesType", "day");
                              }}
                              className="mr-1"
                            />
                            <span>Day ({values.wagesPerDay})</span>
                          </Label>

                          <Label className="ml-3">
                            <input
                              // disabled={
                              //   values.attendanceStatus != "pending"
                              //     ? true
                              //     : false
                              // }
                              name="employeeWagesType"
                              type="radio"
                              value={"hr"}
                              checked={
                                values.employeeWagesType === "hr" ? true : false
                              }
                              onChange={(v) => {
                                setFieldValue("employeeWagesType", "hr");
                              }}
                              className="mr-1"
                            />
                            <span>Hour ({values.wagesHourBasis})</span>
                          </Label>

                          <Label className="ml-3">
                            <input
                              // disabled={
                              //   values.attendanceStatus != "pending"
                              //     ? true
                              //     : false
                              // }
                              name="employeeWagesType"
                              type="radio"
                              value={"point"}
                              checked={
                                values.employeeWagesType === "point"
                                  ? true
                                  : false
                              }
                              onChange={(v) => {
                                setFieldValue("employeeWagesType", "point");
                              }}
                              className="mr-1"
                            />
                            <span>Point ({values.wagesPointBasis})</span>
                          </Label>
                          <Label className="ml-3">
                            <input
                              // disabled={
                              //   values.attendanceStatus != "pending"
                              //     ? true
                              //     : false
                              // }
                              name="employeeWagesType"
                              type="radio"
                              value={"pcs"}
                              checked={
                                values.employeeWagesType === "pcs"
                                  ? true
                                  : false
                              }
                              onChange={(v) => {
                                setFieldValue("employeeWagesType", "pcs");
                              }}
                              className="mr-1"
                            />
                            <span>
                              PCS (
                              {values.wagesPcsBasis +
                                " + " +
                                values.breakWages +
                                " = " +
                                values.netPcsWages}
                              )
                            </span>
                          </Label>
                        </FormGroup>
                        <span className="text-danger">
                          {errors.employeeWagesType && "Select Option"}
                        </span>
                      </FormGroup>
                    </Col>
                  </Row>
                </ModalBody>

                <ModalFooter className="p-2">
                  {isLoading ? (
                    <Button
                      className="mainbtn1 text-white"
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
                      updating...
                    </Button>
                  ) : (
                    <>
                      {/* {JSON.stringify(values.checkOutTime)} */}
                      {values.checkOutTime != null &&
                        values.checkOutTime != "" && (
                          <Button type="submit" className="mainbtn1 text-white">
                            Approve
                          </Button>
                        )}
                    </>
                  )}
                  <Button
                    className="mainbtn1 modalcancelbtn"
                    type="button"
                    onClick={() => {
                      onSalaryModalShow();
                    }}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </Form>
            )}
          />
        </Modal>

        {/* Attendance Edit Modal */}
        <Modal
          className="modal-xl p-2 attendance-view-mdl"
          backdrop="static"
          keyboard={false}
          isOpen={attEditModalShow}
          toggle={() => {
            setAttEditModalShow(null);
          }}
        >
          <ModalHeader
            className="modalheader-style p-2"
            toggle={() => {
              setAttEditModalShow(null);
            }}
            // style={{ width: "100%" }}
          >
            Employee Name: {attendanceInit && attendanceInit.employeeName}
            <CloseButton
              className="pull-right"
              onClick={() => {
                setAttEditModalShow(null);
              }}
            />
          </ModalHeader>

          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={attendanceInit}
            validationSchema={Yup.object().shape({
              checkInTime: Yup.string()
                .trim()
                .nullable()
                .required("Check In time is required"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              // this.setState({ isLoading: true });
              setIsLoading(true);
              console.log({ values });

              let requestData = {
                attendanceId: values.attendanceId,
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

              // let checkInDate = moment(
              //   values.dbcheckInTime,
              //   "YYYY-MM-DD HH:mm:ss"
              // ).format("YYYY-MM-DD");
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
                // let checkOutDate = moment(
                //   values.dbcheckOutTime != ""
                //     ? values.dbcheckOutTime
                //     : values.dbcheckInTime,
                //   "YYYY-MM-DD HH:mm:ss"
                // ).format("YYYY-MM-DD");
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

              updateAttendance(requestData)
                .then((response) => {
                  setIsLoading(false);
                  if (response.data.responseStatus == 200) {
                    setSubmitting(false);
                    toast.success("✔ " + response.data.message);
                    setAttEditModalShow(false);
                    getAttendanceData();
                  } else {
                    setSubmitting(false);
                    toast.error("✘ " + response.data.message);
                  }
                })
                .catch((error) => {
                  setIsLoading(false);
                  setSubmitting(false);
                  toast.error("✘" + error);
                });
            }}
            render={({
              values,
              errors,
              status,
              touched,
              isSubmitting,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <Form autoComplete="off">
                <ModalBody>
                  <Row>
                    <Col md="2">
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
                        {/* <Input
                          type="date"
                          name="attendanceDate"
                          id="attendanceDate"
                          onChange={handleChange}
                          value={values.attendanceDate}
                          invalid={errors.attendanceDate ? true : false}
                        /> */}
                        <span className="text-danger">
                          {errors.attendanceDate}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Check In</Label>
                        <MyDateTimePicker
                          autoComplete="off"
                          className="datepic form-control"
                          name="checkInTime"
                          placeholderText="dd/MM/yyyy hh:mm:ss"
                          id="checkInTime"
                          dateFormat="dd/MM/yyyy HH:mm:ss"
                          showTimeInput
                          onChange={(e) => {
                            console.log("date ", e);
                            setFieldValue("checkInTime", e);
                          }}
                          selected={values.checkInTime}
                          maxDate={new Date()}
                        />
                        {/* <Input
                          type="time"
                          placeholder="Enter from time"
                          name="checkInTime"
                          onChange={handleChange}
                          value={values.checkInTime}
                          invalid={errors.checkInTime ? true : false}
                        /> */}
                        <span className="text-danger">
                          {errors.checkInTime}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Check Out</Label>
                        <MyDateTimePicker
                          autoComplete="off"
                          className="datepic form-control"
                          name="checkOutTime"
                          placeholderText="dd/MM/yyyy hh:mm:ss"
                          id="checkOutTime"
                          dateFormat="dd/MM/yyyy HH:mm:ss"
                          showTimeInput
                          // onChange={(e) => {
                          //   console.log("date ", e);
                          //   setFieldValue("checkOutTime", e);
                          // }}
                          // onBlur={(e) => {
                          //   setFieldValue("checkOutTime", "");
                          //   setFieldValue("totalTime", "");
                          //   if (
                          //     values.checkOutTime != null &&
                          //     values.checkOutTime != ""
                          //   ) {
                          //     calculateTime(
                          //       {
                          //         checkInTime: values.checkInTime,
                          //         checkOutTime: values.checkOutTime,
                          //       },
                          //       setFieldValue
                          //     );
                          //   }
                          onChange={(e) => {
                            setFieldValue("checkOutTime", "");
                            setFieldValue("totalTime", "");
                            if (
                              e != null &&
                              e != "" &&
                              e > values.checkInTime
                            ) {
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
                        {/* <Input
                          type="time"
                          placeholder="Enter from time"
                          name="checkOutTime"
                          // onChange={handleChange}
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
                            }
                          }}
                          value={values.checkOutTime}
                          invalid={errors.checkOutTime ? true : false}
                        /> */}
                        <span className="text-danger">
                          {errors.checkOutTime}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="2">
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
                        <span className="text-danger">{errors.totalTime}</span>
                      </FormGroup>
                    </Col>
                    <Col md="2">
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
                  </Row>
                </ModalBody>

                <ModalFooter className="p-2">
                  {isLoading ? (
                    <Button
                      className="mainbtn1 text-white"
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
                      updating...
                    </Button>
                  ) : (
                    <Button type="submit" className="mainbtn1 text-white">
                      Update
                    </Button>
                  )}
                  <Button
                    className="mainbtn1 modalcancelbtn"
                    type="button"
                    onClick={() => {
                      setAttEditModalShow();
                    }}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </Form>
            )}
          />
        </Modal>

        {/* Task Modal */}
        <Modal
          backdrop="static"
          keyboard={false}
          className="modal-xl attendance-view-mdl"
          isOpen={taskModal}
          toggle={() => {
            setTaskModalShow(null);
          }}
        >
          <ModalHeader
            className="modalheader-style p-2"
            toggle={() => {
              setTaskModalShow(null);
            }}
            // style={{ width: "100%" }}
          >
            Date: {moment(taskInit.taskDate).format("Do MMM YYYY")} &nbsp;
            Employee Name: {taskInit && taskInit.employeeName}
            <CloseButton
              // variant="black"
              className="pull-right"
              //onClick={this.handleClose}
              onClick={() => {
                setTaskModalShow(null);
              }}
            />
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={taskInit}
            validationSchema={Yup.object().shape({
              preventiveAction: Yup.string().when("machineRejectQty", {
                is: (machineRejectQty) => parseInt(machineRejectQty) > 0,
                then: Yup.string().required("Field is required"),
                otherwise: Yup.string(),
              }),
              correctiveAction: Yup.string().when("machineRejectQty", {
                is: (machineRejectQty) => parseInt(machineRejectQty) > 0,
                then: Yup.string().required("Field is required"),
                otherwise: Yup.string(),
              }),
            })}
            onSubmit={(
              values,
              { resetForm, setStatus, setSubmitting, setFieldValue }
            ) => {
              setStatus();
              setIsLoading(true);

              let requestData = {
                taskId: values.taskId,
                taskType: values.taskType,
                startTime: moment(values.startTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
                settingTimeInMin: values.settingTimeInMin,
                remark: values.remark,
                adminRemark: values.adminRemark,
                endTime: "",
              };
              if (values.endTime != "" && values.endTime != null) {
                requestData["endTime"] = moment(values.endTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              }

              if (
                values.endTime != "" &&
                values.endTime != null &&
                values.startTime > values.endTime
              ) {
                setIsLoading(false);
                toast.error("✘ End time is less than End time");
                setFieldValue("endTime", "");
              } else {
                if (
                  values.taskType == 1 &&
                  values.endTime != "" &&
                  values.endTime != null &&
                  parseInt(values.totalQty) <= 0
                ) {
                  setIsLoading(false);
                  toast.error("✘ Total Quantity should be value");
                  setFieldValue("totalQty", 0);
                } else {
                  if (values.taskType == 1) {
                    requestData["machineStartCount"] = values.machineStartCount;
                    requestData["machineEndCount"] = values.machineEndCount;
                    requestData["totalCount"] = values.totalCount;
                    requestData["actualProduction"] = values.actualProduction;
                    requestData["reworkQty"] = values.reworkQty;
                    requestData["machineRejectQty"] = values.machineRejectQty;
                    requestData["doubtfulQty"] = values.doubtfulQty;
                    requestData["unMachinedQty"] = values.unMachinedQty;
                    requestData["okQty"] = values.okQty;
                    requestData["totalQty"] = values.totalQty;
                    requestData["breakName"] = values.breakName;

                    requestData["machineId"] = values.machineId.value;
                    requestData["jobId"] = values.jobId.value;
                    requestData["jobOperationId"] = values.jobOperationId.value;
                    requestData["totalQty"] = values.totalQty;
                    requestData["settingTimeInMin"] = values.settingTimeInMin;

                    if (parseInt(values.machineRejectQty) > 0) {
                      requestData["correctiveAction"] = values.correctiveAction;
                      requestData["preventiveAction"] = values.preventiveAction;
                    }
                  } else if (values.taskType == 2) {
                    requestData["breakId"] = values.workBreakId.value;
                    requestData["workDone"] =
                      values.workDone == "true" ? true : false;
                  } else if (values.taskType == 3) {
                    requestData["machineId"] = values.machineId.value;
                    requestData["workDone"] =
                      values.workDone == "true" ? true : false;
                  }

                  console.log({ requestData });
                  updateTaskDetails(requestData)
                    .then((response) => {
                      setIsLoading(false);
                      if (response.data.responseStatus == 200) {
                        toast.success("✔ " + response.data.message);

                        setTaskModalShow(false);
                        getAttendanceData();
                      } else {
                        toast.error("✘ " + response.data.message);
                      }
                    })
                    .catch((error) => {
                      console.log("error", error);
                    });
                }
              }
            }}
            render={({
              values,
              errors,
              status,
              touched,
              isSubmitting,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <Form autoComplete="off">
                {/* {JSON.stringify(values)} */}
                <ModalBody>
                  <Row>
                    <Col md="2">
                      <FormGroup>
                        <Label>Start Time</Label>

                        <MyDateTimePicker
                          autoComplete="off"
                          className="datepic form-control"
                          name="startTime"
                          placeholderText="dd/MM/yyyy hh:mm:ss"
                          id="startTime"
                          dateFormat="dd/MM/yyyy HH:mm:ss"
                          showTimeInput
                          onChange={(e) => {
                            console.log("date ", e);
                            setFieldValue("startTime", e);
                          }}
                          selected={values.startTime}
                          maxDate={new Date()}
                        />

                        {/* <Input
                          type="time"
                          placeholder="Enter from time"
                          name="startTime"
                          onChange={handleChange}
                          value={values.startTime}
                          invalid={errors.startTime ? true : false}
                        /> */}
                        <span className="text-danger">{errors.startTime}</span>
                      </FormGroup>
                    </Col>

                    <Col md="2">
                      <FormGroup>
                        <Label>End Time</Label>
                        <MyDateTimePicker
                          autoComplete="off"
                          className="datepic form-control"
                          name="endTime"
                          placeholderText="dd/MM/yyyy hh:mm:ss"
                          id="endTime"
                          dateFormat="dd/MM/yyyy HH:mm:ss"
                          showTimeInput
                          onChange={(e) => {
                            console.log("date ", e);
                            setFieldValue("endTime", e);
                          }}
                          selected={values.endTime}
                          maxDate={new Date()}
                        />
                        {/* <Input
                          type="time"
                          placeholder="Enter from time"
                          name="endTime"
                          onChange={handleChange}
                          value={values.endTime}
                          invalid={errors.endTime ? true : false}
                        /> */}
                        <span className="text-danger">{errors.endTime}</span>
                      </FormGroup>
                    </Col>

                    {parseInt(values.taskType) == 4 ? (
                      <Col md="2">
                        <FormGroup>
                          <Label>Break Time(Min)</Label>
                          <Input
                            type="text"
                            placeholder="Enter Setting Time"
                            name="settingTimeInMin"
                            id="settingTimeInMin"
                            onChange={handleChange}
                            value={values.settingTimeInMin}
                            invalid={errors.settingTimeInMin ? true : false}
                          />
                          <span className="text-danger">
                            {errors.settingTimeInMin}
                          </span>
                        </FormGroup>
                      </Col>
                    ) : (
                      ""
                    )}
                  </Row>
                  {parseInt(values.taskType) == 1 ? (
                    <>
                      <Row>
                        <Col md="2">
                          <FormGroup>
                            <Label htmlFor="jobId"> Select Machine </Label>
                            <Select
                              ////isClearable={true}
                              stylefinalDaySalarys={{
                                clearIndicator: ClearIndicatorStyles,
                              }}
                              onChange={(v) => {
                                setFieldValue("machineId", "");
                                if (v != null) {
                                  setFieldValue("machineId", v);
                                }
                              }}
                              name="machineId"
                              options={machineOpts}
                              value={values.machineId}
                            />
                            <span className="text-danger">
                              {errors.machineId && errors.machineId}
                            </span>
                          </FormGroup>
                        </Col>
                        <Col md="2">
                          <FormGroup>
                            <Label htmlFor="jobId"> Select Item </Label>
                            <Select
                              ////isClearable={true}
                              styles={{
                                clearIndicator: ClearIndicatorStyles,
                              }}
                              onChange={(v) => {
                                setFieldValue("jobId", "");
                                setFieldValue("jobOperationId", "");
                                // this.setState({ jobOperationOpts: [] });
                                setjobOperationOpts();
                                if (v != null) {
                                  setFieldValue("jobId", v);
                                  setFieldValue("jobOperationId", "");
                                  getJobOperationList(v.value);
                                }
                              }}
                              name="jobId"
                              options={jobOpts}
                              value={values.jobId}
                            />
                            <span className="text-danger">
                              {errors.jobId && errors.jobId}
                            </span>
                          </FormGroup>
                        </Col>
                        <Col md="2">
                          <FormGroup>
                            <Label htmlFor="jobOperationId">
                              Select Operation{" "}
                            </Label>
                            <Select
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
                              options={jobOperationOpts}
                              value={values.jobOperationId}
                            />
                            <span className="text-danger">
                              {errors.jobOperationId && errors.jobOperationId}
                            </span>
                          </FormGroup>
                        </Col>
                        {values.isMachineCount == true ? (
                          <>
                            <Col md="1">
                              <FormGroup>
                                <Label>Start Count</Label>
                                <Input
                                  type="text"
                                  placeholder="Enter Start Count"
                                  name="machineStartCount"
                                  id="machineStartCount"
                                  // onChange={handleChange}
                                  onChange={(e) => {
                                    handleCountValue(
                                      e.target.value,
                                      "start",
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  onBlur={(e) => {
                                    handleCountValue(
                                      e.target.value,
                                      "start",
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  value={values.machineStartCount}
                                  invalid={
                                    errors.machineStartCount ? true : false
                                  }
                                  // readOnly={true}
                                />
                                <span className="text-danger">
                                  {errors.machineStartCount}
                                </span>
                              </FormGroup>
                            </Col>

                            <Col md="1">
                              <FormGroup>
                                <Label>End Count</Label>
                                <Input
                                  type="text"
                                  placeholder="Enter End Count"
                                  name="machineEndCount"
                                  id="machineEndCount"
                                  // onChange={handleChange}
                                  onChange={(e) => {
                                    handleCountValue(
                                      e.target.value,
                                      "end",
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  onBlur={(e) => {
                                    handleCountValue(
                                      e.target.value,
                                      "end",
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  value={values.machineEndCount}
                                  invalid={
                                    errors.machineEndCount ? true : false
                                  }
                                  // readOnly={true}
                                />
                                <span className="text-danger">
                                  {errors.machineEndCount}
                                </span>
                              </FormGroup>
                            </Col>
                          </>
                        ) : (
                          ""
                        )}
                        <Col md="1">
                          <FormGroup>
                            <Label> Total Qty</Label>
                            <Input
                              type="text"
                              placeholder="Enter Total Qty"
                              name="totalQty"
                              id="totalQty"
                              // onChange={handleChange}
                              onChange={(e) => {
                                handleQtyValue(
                                  e.target.value,
                                  "total",
                                  values,
                                  setFieldValue
                                );
                              }}
                              value={values.totalQty}
                              invalid={errors.totalQty ? true : false}
                              // readOnly={true}
                            />
                            <span className="text-danger">
                              {errors.totalQty}
                            </span>
                          </FormGroup>
                        </Col>
                        <Col md="2">
                          <FormGroup>
                            <Label>Machine Rejection Qty</Label>
                            <Input
                              type="text"
                              placeholder="Enter Machine Rejection Qty"
                              name="machineRejectQty"
                              id="machineRejectQty"
                              // onChange={handleChange}
                              onChange={(e) => {
                                handleQtyValue(
                                  e.target.value,
                                  "machineReject",
                                  values,
                                  setFieldValue
                                );
                              }}
                              value={values.machineRejectQty}
                              invalid={errors.machineRejectQty ? true : false}
                            />
                            <span className="text-danger">
                              {errors.machineRejectQty}
                            </span>
                          </FormGroup>
                        </Col>
                        <Col md="1">
                          <FormGroup>
                            <Label>Rework Qty</Label>
                            <Input
                              type="text"
                              placeholder="Enter Rework Qty"
                              name="reworkQty"
                              id="reworkQty"
                              onChange={(e) => {
                                handleQtyValue(
                                  e.target.value,
                                  "rework",
                                  values,
                                  setFieldValue
                                );
                              }}
                              value={values.reworkQty}
                              invalid={errors.reworkQty ? true : false}
                            />
                            <span className="text-danger">
                              {errors.reworkQty}
                            </span>
                          </FormGroup>
                        </Col>
                        <Col md="2">
                          <FormGroup>
                            <Label> Un-Machined Qty</Label>
                            <Input
                              type="text"
                              placeholder="Enter Un-Machined Qty"
                              name="unMachinedQty"
                              onChange={(e) => {
                                handleQtyValue(
                                  e.target.value,
                                  "unMachined",
                                  values,
                                  setFieldValue
                                );
                              }}
                              value={values.unMachinedQty}
                              invalid={errors.unMachinedQty ? true : false}
                            />
                            <span className="text-danger">
                              {errors.unMachinedQty}
                            </span>
                          </FormGroup>
                        </Col>
                        <Col md="1">
                          <FormGroup>
                            <Label> Doubtful Qty</Label>
                            <Input
                              type="text"
                              placeholder="Enter Doubtful Qty"
                              name="doubtfulQty"
                              onChange={handleChange}
                              value={values.doubtfulQty}
                              invalid={errors.doubtfulQty ? true : false}
                            />
                            <span className="text-danger">
                              {errors.doubtfulQty}
                            </span>
                          </FormGroup>
                        </Col>
                        <Col md="1">
                          <FormGroup>
                            <Label>Ok Qty</Label>
                            <Input
                              type="text"
                              placeholder="Enter Ok Qty"
                              name="okQty"
                              id="okQty"
                              onChange={handleChange}
                              value={values.okQty}
                              invalid={errors.okQty ? true : false}
                              readOnly={true}
                            />
                            <span className="text-danger">{errors.okQty}</span>
                          </FormGroup>
                        </Col>{" "}
                        <Col md="2">
                          <FormGroup>
                            <Label>Break Time(Min)</Label>
                            <Input
                              type="text"
                              placeholder="Enter Break Time"
                              name="settingTimeInMin"
                              id="settingTimeInMin"
                              onChange={handleChange}
                              value={values.settingTimeInMin}
                              invalid={errors.settingTimeInMin ? true : false}
                            />
                            <span className="text-danger">
                              {errors.settingTimeInMin}
                            </span>
                          </FormGroup>
                        </Col>
                        {parseInt(values.machineRejectQty) > 0 ? (
                          <>
                            <Col md="3">
                              <FormGroup>
                                <Label>Corrective Action</Label>
                                <Input
                                  type="textarea"
                                  placeholder="Corrective Action"
                                  name="correctiveAction"
                                  onChange={handleChange}
                                  value={values.correctiveAction}
                                  invalid={
                                    errors.correctiveAction ? true : false
                                  }
                                  rows={1}
                                />
                                <span className="text-danger">
                                  {errors.correctiveAction}
                                </span>
                              </FormGroup>
                            </Col>
                            <Col md="3">
                              <FormGroup>
                                <Label>Preventive Action</Label>
                                <Input
                                  type="textarea"
                                  placeholder="Preventive Action"
                                  name="preventiveAction"
                                  onChange={handleChange}
                                  value={values.preventiveAction}
                                  invalid={
                                    errors.preventiveAction ? true : false
                                  }
                                  rows={1}
                                />
                                <span className="text-danger">
                                  {errors.preventiveAction}
                                </span>
                              </FormGroup>
                            </Col>
                          </>
                        ) : (
                          ""
                        )}
                      </Row>
                    </>
                  ) : (
                    ""
                  )}
                  {parseInt(values.taskType) == 2 ? (
                    <>
                      <Row>
                        <Col md="4">
                          <FormGroup>
                            <Label htmlFor="jobId"> Select Work Break </Label>
                            <Select
                              ////isClearable={true}
                              styles={{
                                clearIndicator: ClearIndicatorStyles,
                              }}
                              onChange={(v) => {
                                setFieldValue("workBreakId", "");
                                if (v != null) {
                                  setFieldValue("workBreakId", v);
                                }
                              }}
                              name="workBreakId"
                              options={workBreakOpts}
                              value={values.workBreakId}
                            />
                            <span className="text-danger">
                              {errors.workBreakId && errors.workBreakId}
                            </span>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <label>
                              DownTime Mode{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <br />
                            <FormGroup className="gender nightshiftlabel">
                              <Label>
                                <input
                                  name="workDone"
                                  type="radio"
                                  value="true"
                                  checked={
                                    values.workDone
                                      ? values.workDone.toLowerCase() === "true"
                                        ? true
                                        : false
                                      : ""
                                  }
                                  onChange={handleChange}
                                  className="mr-1"
                                />
                                <span>Working</span>
                              </Label>
                              <Label className="ml-3">
                                <input
                                  name="workDone"
                                  type="radio"
                                  value="false"
                                  onChange={handleChange}
                                  checked={
                                    values.workDone
                                      ? values.workDone.toLowerCase() ===
                                        "false"
                                        ? true
                                        : false
                                      : ""
                                  }
                                  className="mr-1"
                                />
                                <span>Not Working</span>
                              </Label>
                            </FormGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    ""
                  )}

                  {parseInt(values.taskType) == 3 ? (
                    <>
                      <Row>
                        <Col md="3">
                          <FormGroup>
                            <Label htmlFor="jobId"> Select Machine </Label>
                            <Select
                              ////isClearable={true}
                              styles={{
                                clearIndicator: ClearIndicatorStyles,
                              }}
                              onChange={(v) => {
                                setFieldValue("machineId", "");
                                if (v != null) {
                                  setFieldValue("machineId", v);
                                }
                              }}
                              name="machineId"
                              options={machineOpts}
                              value={values.machineId}
                            />
                            <span className="text-danger">
                              {errors.machineId && errors.machineId}
                            </span>
                          </FormGroup>
                        </Col>

                        <Col md="4">
                          <FormGroup>
                            <label>
                              DownTime Mode{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <br />
                            <FormGroup className="gender nightshiftlabel">
                              <Label>
                                <input
                                  name="workDone"
                                  type="radio"
                                  value="true"
                                  checked={
                                    values.workDone
                                      ? values.workDone.toLowerCase() === "true"
                                        ? true
                                        : false
                                      : ""
                                  }
                                  onChange={handleChange}
                                  className="mr-1"
                                />
                                <span>Working</span>
                              </Label>
                              <Label className="ml-3">
                                <input
                                  name="workDone"
                                  type="radio"
                                  value="false"
                                  onChange={handleChange}
                                  checked={
                                    values.workDone
                                      ? values.workDone.toLowerCase() ===
                                        "false"
                                        ? true
                                        : false
                                      : ""
                                  }
                                  className="mr-1"
                                />
                                <span>Not Working</span>
                              </Label>
                            </FormGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    ""
                  )}
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label>Employee Remark</Label>
                        <Input
                          type="textarea"
                          placeholder="Employee Remark"
                          name="remark"
                          onChange={handleChange}
                          value={values.remark}
                          invalid={errors.remark ? true : false}
                        />
                        <span className="text-danger">{errors.remark}</span>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Admin Remark</Label>
                        <Input
                          type="textarea"
                          placeholder="Admin Remark"
                          name="adminRemark"
                          onChange={handleChange}
                          value={values.adminRemark}
                          invalid={errors.adminRemark ? true : false}
                        />
                        <span className="text-danger">
                          {errors.adminRemark}
                        </span>
                      </FormGroup>
                    </Col>
                  </Row>
                </ModalBody>

                <ModalFooter className="p-2">
                  {isLoading ? (
                    <Button
                      className="mainbtn1 text-white"
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
                      updating...
                    </Button>
                  ) : (
                    <Button type="submit" className="mainbtn1 text-white">
                      Update
                    </Button>
                  )}
                  <Button
                    className="mainbtn1 modalcancelbtn"
                    type="button"
                    onClick={() => {
                      setTaskModalShow();
                    }}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </Form>
            )}
          />
        </Modal>
      </div>
    </div>
  );
}

{
  /* {v.downtimeData != "" ? (
                          <tr
                            className={`${
                              parseInt(mainData) == parseInt(i) ? "" : " d-none"
                            }`}
                          >
                            <td
                              colSpan={21}
                              className="bg-white inner-tbl-td"
                              // style={{ padding: "0px" }}
                            >
                              <Table
                                bordered
                                responsive
                                size="sm"
                                className={`${
                                  parseInt(mainData) == parseInt(i)
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
                                    <th></th>
                                    <th>Break Name</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Total(MIN)</th>
                                    <th>Work Done</th>
                                    <th>Remark</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody
                                  style={{
                                    background: "#FEFCF3",
                                    textAlign: "center",
                                  }}
                                >
                                  {v.downtimeData &&
                                    v.downtimeData.map((vi, ii) => {
                                      return (
                                        <>
                                          <tr>
                                            <td style={{ width: "2%" }}> </td>
                                            <td>{vi.breakName}</td>
                                            <td>{vi.startTime}</td>
                                            <td>{vi.endTime}</td>
                                            <td>{vi.totalTime}</td>
                                            <td>{vi.workDone}</td>
                                            <td>{vi.remark}</td>
                                            <td>
                                              <Button
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  taskDetails(true, vi.taskId);
                                                }}
                                                color="white"
                                                size="sm"
                                                round="true"
                                                icon="true"
                                              >
                                                <i
                                                  className="fa fa-edit"
                                                  style={{
                                                    color: "#ffb22b",
                                                  }}
                                                />
                                              </Button>
                                            </td>
                                          </tr>
                                        </>
                                      );
                                    })}
                                </tbody>
                              </Table>
                            </td>
                          </tr>
                        ) : (
                          ""
                        )} */
}
