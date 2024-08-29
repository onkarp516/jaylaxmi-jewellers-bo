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

import { Form as bootstrapForm } from "react-bootstrap";

import Swal from "sweetalert2";
import { CloseButton, Dropdown, Table, ProgressBar } from "react-bootstrap";
import moment from "moment";
import {
  MyDatePicker,
  getHeader,
  MyDateTimePicker,
  WithUserPermission,
  getSelectValue,
  isActionExist,
} from "@/helpers";
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

function Attendance2(props) {
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
  const [imageShow, setImageShow] = useState(false);
  const [CheckList, setCheckList] = useState([]);

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
  const [employeeIdStatus, setEmployeeIdStatus] = useState(false);
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

      console.log({ request_data });

      setAttenanceInit(request_data);
      setAttEditModalShow(status);
    } else {
      setAttEditModalShow(status);
    }
  };

  const onPuncIntModalShow = (status, attObject) => {
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
      setImageShow(status);
    } else {
      setImageShow(status);
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

  const getAttendanceData = (values) => {
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

          // let opt = [];
          // res.response.map(function (data) {
          //   opt.push({
          //     ...data,
          //     attendanceStatus: false,
          //   });
          // });
          setAttendanceData(res.response)
          // setAttendanceData(res.response);
          setOrgData(res.response);
          if (employeeId != "") {
            setEmployeeIdStatus(true);
          }
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
    // listOfMachineFun();
    listOfJobsForSelectFun();
    listOfBreakFun();
    // getAttendanceData();
    getEmpOptions();
  }, []);

  // useEffect(() => {
  //   getAttendanceData();
  // }, [fromDate, attDate, employeeId, attStatus]);

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

  const isChecked = (id) => {
    console.log("id-->" + id);

    const foundObject = CheckList.find((item) => item.id === id);

    if (foundObject) {
      console.log("Object found:", foundObject);
      return foundObject.attendanceStatus;
    } else {
      console.log("Object not found");
    }
  };

  const handleCheckboxSelection = (
    e,
    id,
    index,
    employeeWagesType,
    wagesPerDay
  ) => {
    console.log("employeeWagesType", employeeWagesType);
    console.log("wagesPerDay", wagesPerDay);

    const { name, checked } = e.target; // Use "checked" instead of "value" for checkboxes

    if (name === "all") {
      // alert("in all");
      console.log(attendanceData);

      let opt = [];

      attendanceData.map((v) => {
        // opt.push({
        //   id: v.id,
        //   finalDaySalaryType: v.employeeWagesType,
        //   finalDaySalary: v.wagesPerDay,
        //   attendanceStatus: checked == true ? "approve" : "pending",
        // });

        opt.push({
          ...v,
          attendanceStatus: v.isAttendanceApproved ==true?true:checked,
          // attendanceStatus: v.payableAmount !== undefined && v.isSalaryProcessed !== true ? checked : false,
        });
      });

      console.log(opt);
      // setAttendanceData(opt)
      setAttendanceData(opt);

      setInitValue();
      pageReload();
      resetForm();

      // result.map(function (data) {
      //   opt.push({
      //     value: data.id,
      //     label: data.employeeName,
      //   });
      // });

      //    const filteredArray = list.filter((item) => item !== null);

      // console.log("in group  list-->", filteredArray);
      // setCheckList(filteredArray);
    } else {
      const list = [...attendanceData];

      // Update the specific object in the array
      list[index] = {
        ...list[index],
        attendanceStatus: checked,
      };

      console.log("in group  list-->", list);
      setAttendanceData(list);
      // this.setState({ debtorsData: list });
    }
    // console.log(...CheckList);
    // const list = [...CheckList];

    // list[index] = {
    //   ...list[index],
    //   id, // Bind the 'id'
    //   finalDaySalaryType: employeeWagesType,
    //   finalDaySalary: wagesPerDay,
    //   [name]: checked == true ? "approve" : "pending", // Bind the 'checked' value
    // };
    // const filteredArray = list.filter((item) => item !== null);

    // console.log("in group  list-->", filteredArray);
    // setCheckList(filteredArray);
  };

  return (
    <div className="emp">
      <div className="container-fluid mt-3">
        <div>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
              taskDate: "",
              employeeId: "",
            }}
            validationSchema={Yup.object().shape({
              // taskDate: Yup.string().required("From Date is required"),
              // employeeId: Yup.object().required("Select Employee"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              console.log("i am in ");

              getAttendanceData(values);
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
                  <Col md="1">
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
                  <Col md="1">
                    &nbsp;
                    <FormGroup>
                      <Button
                        type="submit"
                        className="mainbtn1 text-white report-show-btn"
                      >
                        Show
                      </Button>
                    </FormGroup>
                  </Col>

                  <Col md="2">
                    &nbsp;
                    <FormGroup>
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
                    </FormGroup>
                  </Col>
                  <Col md="1">
                    &nbsp;
                    <FormGroup>
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
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  {/* <Col md="1">
                    <div className="searchprdct mt-4">

                    </div>
                  </Col> */}
                  <Col md="1">
                    &nbsp;
                    <FormGroup>
                      {employeeIdStatus ? (
                        <FormGroup className="d-flex my-auto p-2">
                          <bootstrapForm.Check type={"checkbox"}>
                            <bootstrapForm.Check.Input
                              type={"checkbox"}
                              defaultChecked={false}
                              name="all"
                              onChange={(e) => {
                                handleCheckboxSelection(
                                  e
                                  // v.id,
                                  // i,
                                  // v.employeeWagesType,
                                  // v.wagesPerDay,
                                );
                              }}
                            />
                            <bootstrapForm.Check.Label
                              style={{
                                color: "#00a0f5",
                                textDecoration: "underline",
                              }}
                            >
                              {`Check all`}
                            </bootstrapForm.Check.Label>
                          </bootstrapForm.Check>
                        </FormGroup>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col md="1">
                    <FormGroup>
                      <Label> Approve</Label>

                      <Button
                        type="button"
                        className="mainbtn1 text-white mr-2 report-show-btn"
                        disabled={
                          attendanceData.filter(
                            (item) => item.attendanceStatus != false && item.isAttendanceApproved !=true
                          ).length > 0
                            ? false
                            : true
                        }
                        onClick={(e) => {
                          console.log(
                            "🚀 ~ file: Attendance2.jsx:1099 ~ Attendance2 ~ CheckList:",
                            CheckList
                          );
                          // const filteredArray = CheckList.filter((item) => item.attendanceStatus != null);
                          const filteredArray = attendanceData.filter(
                            (item) => item.attendanceStatus != false && item.isAttendanceApproved!=true
                          );

                          console.log(
                            "🚀 ~ file: Attendance2.jsx:1100 ~ Attendance2 ~ filteredArray:",
                            filteredArray
                          );

                          // e.preventDefault();
                          // if (attendanceData.length > 0) {
                          //   exportData();
                          // }

                          // console.log("row ", v);

                          e.preventDefault();
                          let frmData = new FormData();
                          frmData.append("list", JSON.stringify(filteredArray));
                          // return false
                          approveSalaryAttendance(frmData)
                            .then((response) => {
                              setIsLoading(false);
                              if (response.data.responseStatus == 200) {
                                toast.success("✔ " + response.data.message);
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
                      >
                        <i className="fa fa-check" style={{ color: "red" }} />
                        Approve
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            )}
          />
        </div>

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
                  <th className="th-style">Select</th>
                  <th className="th-style">Date</th>
                  <th className="th-style">Employee Name</th>
                  <th className="th-style">In</th>
                  <th className="th-style">Out</th>
                  <th className="th-style">Overtime</th>
                  <th className="th-style">Break Time</th>
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
                          {v.downtimeData != "" ? (
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
                          ) : (
                            <td style={{ width: "2%" }}></td>
                          )}
                          <td>
                            <FormGroup className="d-flex my-auto p-2">
                              <bootstrapForm.Check type={"checkbox"}>
                                <bootstrapForm.Check.Input
                                  type={"checkbox"}
                                  // defaultChecked={false}
                                  name="attendanceStatus"
                                  // disabled={false}
                                  disabled={v.isAttendanceApproved==true?true:false}
                                  checked={v.attendanceStatus}
                                  onChange={(e) => {
                                    handleCheckboxSelection(
                                      e,
                                      v.id, 
                                      i,
                                      v.employeeWagesType,
                                      v.wagesPerDay
                                    );
                                  }}
                                />
                              </bootstrapForm.Check>
                            </FormGroup>
                          </td>
                          <td>{v.attendanceDate}</td>
                          <td>
                            {v.employeeName} ({v.designationCode})
                          </td>
                          <td>
                            {v.checkInTime != "" ? (
                              <>
                                {/* <span style={{ fontSize: "12px" }}>
                                  ({moment(v.checkInTime).format("D-M")})
                                </span>
                                <br /> */}
                                {moment(v.checkInTime).format("HH:mm:ss")}
                              </>
                            ) : (
                              ""
                            )}
                          </td>
                          <td>
                            {v.checkOutTime != "" ? (
                              <>
                                {/* <span style={{ fontSize: "12px" }}>
                                  ({moment(v.checkOutTime).format("D-M")})
                                </span>
                                <br /> */}
                                {moment(v.checkOutTime).format("HH:mm:ss")}
                              </>
                            ) : (
                              ""
                            )}
                          </td>

                          <td>
                            {v.overtime}
                          </td>

                          <td>
                            {v.downtimeData &&
                              v.downtimeData.map((vi, ii) => {
                                return (
                                  <>
                                    <span>{vi.actualTime}</span>
                                  </>
                                );
                              })}
                          </td>
                          <td>{v.remark}</td>
                          <td>{v.adminRemark}</td>
                          {/* <td><img src="data:image/jpeg;base64,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" alt="punch in selfie"></img></td>
                          <td><img src="data:image/jpeg;base64,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" alt="punch in selfie"></img></td> */}

                          <td style={{ width: "7%" }}>
                            {" "}
                            {isActionExist(
                              "today-s",
                              "edit",
                              props.userPermissions
                            ) && (
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
                            )}
                            {v.attendanceStatus == "pending" &&
                            isActionExist(
                              "today-s",
                              "edit",
                              props.userPermissions
                            ) ? (
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
                            {isActionExist(
                              "today-s",
                              "delete",
                              props.userPermissions
                            ) && (
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
                            )}
                            {isActionExist(
                              "today-s",
                              "edit",
                              props.userPermissions
                            ) && (
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
                                disabled={v.isAttendanceApproved}
                              >
                                {v.isAttendanceApproved == false || v.isAttendanceApproved == null ? (
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
                            )}
                            {isActionExist(
                              "today-s",
                              "edit",
                              props.userPermissions
                            ) && (
                              <Button
                                onClick={(e) => {
                                  console.log("row ", v);
                                  e.preventDefault();
                                  onPuncIntModalShow(true, v);
                                }}
                                color="white"
                                size="sm"
                                round="true"
                                icon="true"
                              >
                                {v.attendanceStatus == false ? (
                                  <i
                                    className="fa fa-info"
                                    style={{ color: "red" }}
                                  />
                                ) : (
                                  <i
                                    className="fa fa-info"
                                    style={{ color: "green" }}
                                  />
                                )}
                              </Button>
                            )}
                          </td>
                        </tr>

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
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Total Break Time</th>
                                    {/* <th>Break Wages</th> */}
                                    {/* <th>Total Time</th> */}
                                    {/* <th>Remark</th>
                                    <th>End Remark</th> */}
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
                                      {
                                        console.log(vi);
                                      }
                                      return (
                                        <>
                                          <tr>
                                            {vi.breakList[0] != "" ? (
                                              <td style={{ width: "2%" }}>
                                                <Button
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    if (
                                                      parseInt(
                                                        breakInnerData
                                                      ) == parseInt(ii)
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
                                            ) : (
                                              <td style={{ width: "2%" }}></td>
                                            )}
                                            <td>{vi.breakName}</td>
                                            <td>
                                              {moment(
                                                vi.breakList[0].startTime
                                              ).format("HH:mm:ss")}
                                            </td>
                                            <td>
                                              {moment(
                                                vi.breakList[0].endTime
                                              ).format("HH:mm:ss")}
                                            </td>
                                            <td>{vi.actualTime}</td>
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
                                                      <th>End Remark</th>
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
                                                                {vii.endRemark}
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
          className="modal-sm p-2 attendance-view-mdl"
          isOpen={imageShow}
          // toggle={() => {
          //   onSalaryModalShow(null);
          // }}
          backdrop="static"
          keyboard={false}
        >
          <ModalHeader
            className="modalheader-style p-2"
            // toggle={() => {
            //   onSalaryModalShow(null);
            // }}
          >
            Employee Name: {attendanceInit && attendanceInit.employeeName}
            <CloseButton
              className="pull-right"
              onClick={() => {
                // onSalaryModalShow(null);
                setImageShow(false);
              }}
            />
          </ModalHeader>

          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            // innerRef={salaryForm}
            initialValues={attendanceInit}
            validationSchema={Yup.object().shape({
              employeeWagesType: Yup.string()
                .trim()
                .nullable()
                .required("Employee wages is required"),
            })}
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
                    <Col md="6">
                      <FormGroup>
                        <Label> Punch In Image</Label>
                        {/* <img src="" alt="punch in image" /> */}
                        <td>
                          <img
                            src="data:image/jpeg;base64,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"
                            alt="punch in selfie"
                          ></img>
                        </td>

                        {/* <span className="text-danger">
                          {errors.attendanceDate}
                        </span> */}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                        <Label> Punch Out Image</Label>
                        {/* <img src="" alt="punch in image" /> */}
                        <td>
                          <img
                            src="data:image/jpeg;base64,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"
                            alt="punch in selfie"
                          ></img>
                        </td>

                        {/* <span className="text-danger">
                          {errors.attendanceDate}
                        </span> */}
                      </FormGroup>
                    </Col>
                  </Row>
                </ModalBody>
              </Form>
            )}
          />
        </Modal>

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
              requestData.append("attendanceStatus", true);
              requestData.append("employeeWagesType", values.employeeWagesType);
              requestData.append(
                "remark",
                values.remark != null ? values.remark : ""
              );
              requestData.append(
                "adminRemark",
                values.adminRemark != null ? values.adminRemark : ""
              );

              if (values.employeeWagesType == "pcs")
                requestData.append("netPcsWages", values.netPcsWages);
              if (values.employeeWagesType == "point")
                requestData.append("wagesPointBasis", values.wagesPointBasis);
              if (values.employeeWagesType == "day")
                requestData.append("wagesPerDay", values.wagesPerDay);
              if (values.employeeWagesType == "hr")
                requestData.append("wagesHourBasis", values.wagesHourBasis);

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
                          selected={values.checkOutTime}
                          maxDate={new Date()}
                        />
                        <span className="text-danger">
                          {errors.checkOutTime}
                        </span>
                      </FormGroup>
                    </Col>
                    {/* {console.log(values)} */}
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
              requestData["lunchTimeInMin"] = values.lunchTimeInMin;

              if (values.checkOutTime != "" && values.checkOutTime != null) {
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
                  setIsLoading(false);
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
                {/* {JSON.stringify(values)}
                {JSON.stringify(errors)} */}
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

export default WithUserPermission(Attendance2);
