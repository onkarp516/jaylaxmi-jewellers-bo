import React, { Component, useRef, useContext } from "react";
import GridTable from "@nadavshaar/react-grid-table";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
// import Table from "react-bootstrap/Table";
import "@/assets/scss/all/custom/tbl.scss";
import moment from "moment";
import {
  isWriteAuthorized,
  isReadAuthorized,
  getHeader,
  CustomDTHeader,
  getSelectValue,
} from "@/helpers";
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
  Collapse,
  Card,
  CardBody,
  Table,
} from "reactstrap";

import {
  getEmployeeTodayTasks,
  submitEmployeeTodayWages,
  getTaskDetailsForUpdate,
  updateTaskQuantities,
  updateAttendance,
  listOfJobsForSelect,
  listOfMachine,
  listJobOperation,
  listOfBreak,
  updateTaskDetails,
  getEmployeeOperationView,
} from "@/services/api_function";

import { DTAttendanceUrl } from "@/services/api";
import Paper from "@material-ui/core/Paper";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import axios from "axios";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

const ActionsCellRender = ({
  tableManager,
  value,
  field,
  data,
  column,
  colIndex,
  rowIndex,
}) => {
  const { additionalProps } = tableManager.config;
  const { header } = additionalProps;
  const { currentIndex, onViewModalShow, onEditModalShow } = header;
  return (
    <>
      {currentIndex === rowIndex ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : (
        <Button
          title="VIEW"
          id="Tooltipedit"
          className="edityellowbtn"
          onClick={(e) => {
            e.preventDefault();
            onViewModalShow(true, data, rowIndex);
          }}
        >
          <i className="fa fa-eye"></i>
        </Button>
      )}

      {currentIndex === rowIndex ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : (
        <Button
          title="EDIT"
          id="Tooltipedit"
          className="edityellowbtn"
          onClick={(e) => {
            e.preventDefault();
            onEditModalShow(true, data, rowIndex);
          }}
        >
          <i className="fa fa-edit"></i>
        </Button>
      )}
    </>
  );
};

class Attendance extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.state = {
      isLoading: false,
      currentIndex: 0,
      editModalShow: false,
      viewModalShow: false,
      salaryModalShow: false,
      taskModalShow: false,
      attendanceDate: "",
      taskList: [],
      taskRows: [],
      tData: [],
      machineOpts: [],
      jobOpts: [],
      jobOperationOpts: [],
      workBreakOpts: [],
      attendanceObject: "",
      taskInit: {
        taskId: "",
        taskType: 0,
        employeeName: "",
        startTime: "",
        endTime: "",

        workDone: "",
        remark: "",
        workBreakId: "",
        machineId: "",
        jobId: "",
        jobOperationId: "",

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
      },

      attendanceInit: {
        attendanceId: "",
        attendanceDate: "",
        employeeName: "",
        checkInTime: "",
        checkOutTime: "",
        totalTime: "",
      },

      columnlist: [
        { value: "machine_number", label: "MACHINE" },
        { value: "job_name", label: "ITEM" },
        { value: "operation_name", label: "OPERATION" },
        { value: "break_name", label: "BREAK" },
        { value: "cycle_time", label: "CYCLE-TIME" },
        { value: "start_time", label: "WORK-TIME" },
        { value: "total_time", label: "TIME(MIN.)" },
        { value: "actual_work_time", label: "ACT-TIME" },
        { value: "total_count", label: "TOTAL QTY" },
        { value: "required_production", label: "REQ QTY" },
        { value: "actual_production", label: "ACT QTY" },
        { value: "percentage_of_task", label: "% OF TASK" },
        { value: "ok_qty", label: "OK QTY" },
        { value: "machine_reject_qty", label: "M/R QTY" },
        { value: "rework_qty", label: "R/W QTY" },
        { value: "doubtful_qty", label: "D/F QTY" },
        { value: "un_machined_qty", label: "U/M QTY" },
        { value: "remark", label: "REMARK" },
      ],
      collapse: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    };
  }

  listOfBreakFun = () => {
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
        this.setState({ workBreakOpts: workBreakOpts });
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  listOfMachineFun = () => {
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
        this.setState({ machineOpts: machineOpts });
      })
      .catch((error) => {
        console.log({ error });
      });
  };

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

  getJobOperationList = (jobId, values = null) => {
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
        this.setState({ jobOperationOpts: jobOperationOp });

        if (values != null && values.jobOperationId) {
          let jobOperationOpt =
            values.jobOperationId != ""
              ? getSelectValue(jobOperationOp, values.jobOperationId)
              : "";

          values.jobOperationId = jobOperationOpt;
          this.setState({
            taskInit: values,
            taskModalShow: true,
            currentIndex: 0,
          });
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  };
  setTableManager = (tm) => (this.tableManager.current = tm);

  onRowsRequest = async (requestData, tableManager) => {
    const { attendanceDate } = this.state;
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
      attendanceDate: attendanceDate != null ? attendanceDate : "",
    };
    const response = await axios({
      url: DTAttendanceUrl(),
      method: "POST",
      headers: getHeader(),
      data: JSON.stringify(req),
    })
      .then((response) => response.data)
      .catch((e) => {
        console.log("e--->", e);
      });

    if (!response?.rows) return;

    return {
      rows: response.rows,
      totalRows: response.totalRows,
    };
  };

  onViewModalShow = (status, attObject, rowIndex) => {
    console.log({ attObject });
    if (status) {
      this.setState({ currentIndex: rowIndex });
      let reqData = {
        employeeId: attObject.employeeId,
        attendanceId: attObject.id,
      };
      getEmployeeTodayTasks(reqData)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            let request_data = {
              fullName: attObject.fullName,
              attendanceId: attObject.id,
              employeeId: attObject.employeeId,
              attendanceDate: attObject.attendanceDate,
            };

            this.setState({
              currentIndex: 0,
              taskList: res.response,
              viewModalShow: status,
              attendanceObject: request_data,
            });
          } else {
            this.setState({ currentIndex: 0 }, () => {
              toast.error("✘ " + response.data.message);
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      this.setState({ currentIndex: 0, viewModalShow: status });
    }
  };

  onEditModalShow = (status, attObject, rowIndex) => {
    console.log({ attObject });

    if (status == true) {
      this.setState({ currentIndex: rowIndex });

      let request_data = {
        attendanceId: attObject.id,
        attendanceDate: attObject.attendanceDate,
        employeeName: attObject.fullName,
        // checkInTime: attObject.checkInTime,
        // checkOutTime:
        //   attObject.checkOutTime != null ? attObject.checkOutTime : "",
        totalTime: attObject.totalTime != null ? attObject.totalTime : "",
      };

      let checkInTime = moment(
        attObject.checkInTime,
        "YYYY-MM-DD HH:mm:ss"
      ).format("HH:mm");
      request_data["dbcheckInTime"] = attObject.checkInTime;
      request_data["checkInTime"] = checkInTime;

      request_data["dbcheckOutTime"] = "";
      request_data["checkOutTime"] = "";
      if (attObject.checkOutTime != null) {
        let checkOutTime = moment(
          attObject.checkOutTime,
          "YYYY-MM-DD HH:mm:ss"
        ).format("HH:mm");
        request_data["dbcheckOutTime"] = attObject.checkOutTime;
        request_data["checkOutTime"] = checkOutTime;
      }

      console.log({ request_data });

      this.setState({
        currentIndex: 0,
        editModalShow: status,
        attendanceInit: request_data,
      });
    } else {
      this.setState({
        editModalShow: status,
      });
    }
  };

  onTaskModalShow = (status, taskId = null) => {
    console.log({ taskId });
    if (status) {
      let reqData = {
        taskId: taskId,
      };

      getTaskDetailsForUpdate(reqData)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            const { machineOpts, jobOpts, workBreakOpts } = this.state;

            let taskData = res.response;
            let input_data = {
              taskId: taskData.taskId,
              taskDate: taskData.taskDate,
              employeeId: taskData.employeeId,
              attendanceId: taskData.attendanceId,
              taskType: parseInt(taskData.taskType),
              employeeName: taskData.employeeName,
              startTime: taskData.startTime,
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
              remark: taskData.remark != null ? taskData.remark : "",
              adminRemark:
                taskData.adminRemark != null ? taskData.adminRemark : "",
            };

            if (input_data.taskType == 1) {
              input_data.machineId = getSelectValue(
                machineOpts,
                parseInt(input_data.machineId)
              );
              input_data.jobId = getSelectValue(
                jobOpts,
                parseInt(input_data.jobId)
              );
              this.getJobOperationList(input_data.jobId.value, input_data);
            } else if (input_data.taskType == 2) {
              input_data.workBreakId = getSelectValue(
                workBreakOpts,
                parseInt(input_data.workBreakId)
              );
              this.setState({ taskInit: input_data, taskModalShow: true });
            } else if (input_data.taskType == 3) {
              input_data.machineId = getSelectValue(
                machineOpts,
                parseInt(input_data.machineId)
              );
              this.setState({ taskInit: input_data, taskModalShow: true });
            } else if (input_data.taskType == 4) {
              this.setState({ taskInit: input_data, taskModalShow: true });
            }
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      this.setState({ taskModalShow: status });
    }
  };

  handleQtyValue = (val, element, values, setFieldValue) => {
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

  handleCountValue = (val, element, values, setFieldValue) => {
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
    this.handleQtyValue(totalQty, "total", values, setFieldValue);
  };

  calculateTime = (values, setFieldValue) => {
    console.log({ values });
    let { checkInTime, checkOutTime } = values;
    if (values.checkInTime != "" && values.checkOutTime != "") {
      var dt1 = new Date("2019-1-8 " + checkInTime);
      var dt2 = new Date("2019-1-8 " + checkOutTime);

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
      setFieldValue("checkOutTime", "");
      setFieldValue("totalTime", "");
    }
  };

  searchTaskData = (employeeId, attendanceId, columnId, searchText) => {
    let reqData = {
      employeeId: employeeId,
      attendanceId: attendanceId,
      columnId: columnId,
      searchText: searchText,
    };
    console.log({ reqData });
    getEmployeeTodayTasks(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            taskList: res.response,
          });
        } else {
          this.setState({ taskList: [] }, () => {
            toast.error("✘ " + response.data.message);
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  componentDidMount() {
    this.listOfMachineFun();
    this.listOfJobsForSelectFun();
    this.listOfBreakFun();
  }
  changeCollapseState = (index, jobOperationId = null, attendanceId = null) => {
    console.log("index ---> ", { index, jobOperationId, attendanceId });
    let { collapse } = this.state;

    collapse = collapse.map((v, i) => {
      if (i == index) {
        return v;
      } else {
        return false;
      }
    });
    collapse[index] = !collapse[index];

    console.log("collapse ", collapse[index]);
    if (collapse[index] == true) {
      console.log("api call");

      let reqData = {
        jobOperationId: jobOperationId,
        attendanceId: attendanceId,
      };

      getEmployeeOperationView(reqData)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            this.setState({
              taskRows: res.response,
            });
          } else {
            this.setState({ taskRows: [] }, () => {
              toast.error("✘ " + response.data.message);
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }

    this.setState({ collapse: collapse });
  };

  getCollapseState = (index) => {
    let { collapse } = this.state;

    return collapse[index];
  };
  render() {
    const columns = [
      {
        id: "full_name",
        field: "fullName",
        label: "Employee Name",
        resizable: true,
        width: "150px",
      },
      {
        id: "check_in_time",
        field: "checkInTime",
        label: "In Time",
        // moment(row.inTime, "YYYY-MM-DD HH:mm:ss").format("LT")
        cellRenderer: ({ data }) => {
          return (
            <div className="nightshift">
              {data.checkInTime != null
                ? moment(data.checkInTime, "YYYY-MM-DD HH:mm:ss").format("LT")
                : ""}
            </div>
          );
        },
        resizable: true,
        width: "120px",
      },
      {
        id: "check_out_time",
        field: "checkOutTime",
        label: "Out Time",
        cellRenderer: ({ data }) => {
          return (
            <div className="nightshift">
              {data.checkOutTime != null
                ? moment(data.checkOutTime, "YYYY-MM-DD HH:mm:ss").format("LT")
                : ""}
            </div>
          );
        },
        resizable: true,
        width: "120px",
      },
      {
        id: "total_time",
        field: "totalTime",
        label: "Total Time",
        resizable: true,
        width: "120px",
      },
      {
        id: "total_work_time",
        field: "totalWorkTime",
        label: "Total Work Time",
        resizable: true,
        width: "120px",
      },
      {
        id: "actual_work_time",
        field: "actualWorkTime",
        label: "Actual Work Time",
        resizable: true,
        width: "120px",
      },
      {
        id: "total_prod_qty",
        field: "totalProdQty",
        label: "PRD. Qty.",
        resizable: true,
        width: "100px",
      },
      {
        id: "total_work_point",
        field: "totalWorkPoint",
        label: "Work Pts.",
        resizable: true,
        width: "110px",
      },
      {
        id: "wages_point_basis",
        field: "wagesPointBasis",
        label: "Wages In Pts.",
        resizable: true,
        width: "130px",
        // cellRenderer: ({ data }) => {
        //   return (
        //     <div className="nightshift">
        //       {parseFloat(data.wagesPointBasis).toFixed(2)}
        //     </div>
        //   );
        // },
      },
      {
        id: "wages_hour_basis",
        field: "wagesHourBasis",
        label: "Wages In Hrs.",
        resizable: true,
        width: "130px",
        // cellRenderer: ({ data }) => {
        //   return (
        //     <div className="nightshift">
        //       {parseFloat(data.wagesHourBasis).toFixed(2)}
        //     </div>
        //   );
        // },
      },
      {
        id: "wages_pcs_basis",
        field: "wagesPcsBasis",
        label: "Wages In Pcs.",
        resizable: true,
        width: "130px",
      },
      {
        id: "wages_per_day",
        field: "wagesPerDay",
        label: "Wages Per Day",
        resizable: true,
        width: "130px",
      },

      // {
      //   id: "final_day_salary",
      //   field: "finalDaySalary",
      //   label: "Final Salary",
      //   resizable: true,
      //   width: "130px",
      // },
      {
        id: "buttons",
        label: "Action",
        pinned: true,
        width: "150px",
        sortable: false,
        resizable: false,
        cellRenderer: ActionsCellRender,
      },
    ];

    const {
      isLoading,
      currentIndex,
      viewModalShow,
      taskModalShow,
      editModalShow,

      taskList,
      attendanceObject,
      taskInit,
      attendanceInit,
      machineOpts,
      jobOpts,
      jobOperationOpts,
      workBreakOpts,
      columnlist,
      collapse,
      taskRows,
    } = this.state;

    const showDate = (
      <>
        <Input
          type="date"
          placeholder="Enter dob"
          name="dob"
          onChange={(e) => {
            console.log("date ", e.target.value);

            if (e.target.value != null && e.target.value != "") {
              this.setState({ attendanceDate: e.target.value }, () => {
                this.tableManager.current.asyncApi.resetRows();
              });
            }
          }}
          // value={values.dob}
        />
      </>
    );

    return (
      <div>
        {(isReadAuthorized("master", "taskPermission") ||
          isWriteAuthorized("master", "taskPermission")) && (
          <>
            <GridTable
              components={{ Header: CustomDTHeader }}
              columns={columns}
              onRowsRequest={this.onRowsRequest}
              onRowClick={(
                { rowIndex, data, column, isEdit, event },
                tableManager
              ) => !isEdit}
              minSearchChars={0}
              additionalProps={{
                header: {
                  label: "Attendance",
                  showDate: showDate,
                  addBtn: "",
                  currentIndex: currentIndex,
                  onViewModalShow: this.onViewModalShow.bind(this),
                  onEditModalShow: this.onEditModalShow.bind(this),
                },
              }}
              onLoad={this.setTableManager.bind(this)}
            />
          </>
        )}

        {/* View Modal */}
        <Modal
          className="modal-xl attendance-view-mdl"
          isOpen={viewModalShow}
          toggle={() => {
            this.onViewModalShow(null);
          }}
        >
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={attendanceObject}
            validationSchema={Yup.object().shape({
              attendanceId: Yup.string()
                .trim()
                .nullable()
                .required("Id is required"),
              finalDaySalaryType: Yup.string()
                .trim()
                .nullable()
                .required("Salary type is required"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              this.setState({ isLoading: true });

              let requestData = {
                attendanceId: values.attendanceId,
                finalDaySalaryType: values.finalDaySalaryType,
                finalDaySalary:
                  values.finalDaySalaryType == "true"
                    ? values.wagesHourBasis
                    : values.wagesPointBasis,
              };
              // console.log({ requestData });
              submitEmployeeTodayWages(requestData)
                .then((response) => {
                  // console.log("response", response);
                  if (response.data.responseStatus == 200) {
                    toast.success("✔ " + response.data.message);

                    this.setState({ isLoading: false }, () => {
                      this.onViewModalShow(false);
                      this.tableManager.current.asyncApi.resetRows();
                    });
                  } else {
                    toast.error("✘ Something went wrong!");
                    this.setState({ isLoading: false });
                  }
                })
                .catch((error) => {
                  console.log("error", error);
                  this.setState({ isLoading: false });
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
              <Form autoComplete="off">
                {/* {JSON.stringify(attendanceObject)} */}
                <ModalHeader
                  className="modalheadernew p-2"
                  toggle={() => {
                    this.onViewModalShow(null);
                  }}
                >
                  Today's Work:{" "}
                  {moment(attendanceObject.attendanceDate).format(
                    "Do MMM YYYY"
                  )}{" "}
                  &nbsp; Employee Name: {values && values.fullName}
                </ModalHeader>

                <ModalBody className="p-2">
                  <Row>
                    <Col md="12">
                      <Table className="table-bordered">
                        <thead>
                          <tr>
                            <th className="tblalignment">Machine Name</th>
                            <th className="tblalignment">Item Name</th>
                            <th className="tblalignment">Operation Name</th>
                            <th className="tblalignment">Cycle Time</th>
                            <th className="tblalignment">Total Time</th>
                            <th className="tblalignment">Total Count.</th>
                            <th className="tblalignment">OK Qty.</th>
                            <th className="tblalignment">R/W Qty.</th>
                            <th className="tblalignment">M/R Qty.</th>
                            <th className="tblalignment">Break Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {taskList &&
                            taskList.map((value, key) => {
                              return (
                                <>
                                  <tr
                                    key={key}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.changeCollapseState(
                                        key,
                                        value.jobOperationId,
                                        attendanceObject.attendanceId
                                      );
                                    }}
                                    className={` ${
                                      this.getCollapseState(key) == true
                                        ? "collapsebtn"
                                        : ""
                                    }`}
                                  >
                                    <td>
                                      {value.machineName != null
                                        ? value.machineName
                                        : "-"}
                                    </td>
                                    <td>
                                      {value.jobName != null
                                        ? value.jobName
                                        : "-"}
                                    </td>

                                    <td>
                                      {value.operationName != null
                                        ? value.operationName
                                        : "-"}
                                    </td>
                                    <td>
                                      {value.cycleTime != null
                                        ? value.cycleTime
                                        : "-"}
                                    </td>
                                    <td>
                                      {value.totalTime != null
                                        ? value.totalTime
                                        : "-"}
                                    </td>
                                    <td>
                                      {value.totalCount != null
                                        ? value.totalCount
                                        : 0}
                                    </td>
                                    <td>
                                      {value.okQty != null ? value.okQty : 0}
                                    </td>
                                    <td>
                                      {value.reworkQty != null
                                        ? value.reworkQty
                                        : 0}
                                    </td>

                                    <td>
                                      {value.machineRejectQty != null
                                        ? value.machineRejectQty
                                        : 0}
                                    </td>
                                    <td>{value.breakTime}</td>
                                  </tr>

                                  <tr
                                    className={`${
                                      this.getCollapseState(key) == true
                                        ? ""
                                        : "d-none"
                                    }`}
                                  >
                                    <td
                                      colSpan={18}
                                      style={{
                                        padding: "1px",
                                      }}
                                    >
                                      <Collapse
                                        isOpen={this.getCollapseState(key)}
                                      >
                                        <Table className="table-bordered">
                                          {/* <thead>
                                            <tr>
                                              <th className="tblalignment">
                                                Machine Name
                                              </th>
                                              <th className="tblalignment">
                                                Item Name
                                              </th>
                                              <th className="tblalignment">
                                                Operation Name
                                              </th>
                                              <th className="tblalignment">
                                                Cycle Time
                                              </th>
                                              <th className="tblalignment">
                                                Total Time
                                              </th>
                                              <th className="tblalignment">
                                                Total Count.
                                              </th>
                                              <th className="tblalignment">
                                                OK Qty.
                                              </th>
                                              <th className="tblalignment">
                                                R/W Qty.
                                              </th>
                                              <th className="tblalignment">
                                                M/R Qty.
                                              </th>
                                              <th
                                                className="tblalignment"
                                                style={{ zIndex: "9" }}
                                              >
                                                ACT
                                              </th>
                                            </tr>
                                          </thead> */}
                                          <tbody style={{ padding: "1px" }}>
                                            {/* {JSON.stringify(taskRows)} */}
                                            {taskRows &&
                                              taskRows.map((taskV, i) => {
                                                return (
                                                  <tr
                                                    style={{
                                                      marginBottom: "5px",
                                                    }}
                                                  >
                                                    <td>
                                                      {taskV.machineName != null
                                                        ? taskV.machineName
                                                        : "-"}
                                                    </td>
                                                    <td>
                                                      {taskV.jobName != null
                                                        ? taskV.jobName
                                                        : "-"}
                                                    </td>

                                                    <td>
                                                      {taskV.operationName !=
                                                      null
                                                        ? taskV.operationName
                                                        : "-"}
                                                    </td>
                                                    <td>
                                                      {taskV.cycleTime != null
                                                        ? taskV.cycleTime
                                                        : "-"}
                                                    </td>
                                                    <td>
                                                      {taskV.actualWorkTime !=
                                                      null
                                                        ? taskV.actualWorkTime
                                                        : "-"}
                                                    </td>
                                                    <td>
                                                      {taskV.totalCount != null
                                                        ? taskV.totalCount
                                                        : "-"}
                                                    </td>
                                                    <td>
                                                      {taskV.actualProduction !=
                                                      null
                                                        ? taskV.actualProduction
                                                        : 0}
                                                    </td>

                                                    <td>
                                                      {taskV.reworkQty != null
                                                        ? taskV.reworkQty
                                                        : 0}
                                                    </td>

                                                    <td>
                                                      {taskV.machineRejectQty !=
                                                      null
                                                        ? taskV.machineRejectQty
                                                        : 0}
                                                    </td>

                                                    <td>
                                                      <Button
                                                        title="VIEW"
                                                        id="Tooltipedit"
                                                        className="edityellowbtn"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          this.onTaskModalShow(
                                                            true,
                                                            taskV.id
                                                          );
                                                        }}
                                                      >
                                                        <i className="fa fa-edit"></i>
                                                      </Button>
                                                    </td>
                                                  </tr>
                                                );
                                              })}
                                          </tbody>
                                        </Table>
                                      </Collapse>
                                    </td>
                                  </tr>
                                </>
                              );
                            })}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter className="p-2 todaysw_modal_footer">
                  <Row>
                    <Col md="5"></Col>
                    <Col md="7" className="tw_modalf_left">
                      <div
                        style={{
                          display: "inline-block",
                          verticalAlign: "top",
                        }}
                      >
                        <Button
                          className="modalcancelbtn"
                          type="button"
                          onClick={() => {
                            this.onViewModalShow(null);
                          }}
                        >
                          close
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </ModalFooter>
              </Form>
            )}
          />
        </Modal>

        {/* Attendance Edit Modal */}
        <Modal
          className="modal-xl p-2"
          isOpen={editModalShow}
          toggle={() => {
            this.onEditModalShow(null);
          }}
        >
          <ModalHeader
            className="modalheadernew p-2"
            toggle={() => {
              this.onEditModalShow(null);
            }}
          >
            Employee Name: {attendanceInit && attendanceInit.employeeName}
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={attendanceInit}
            validEmployee
            NameationSchema={Yup.object().shape({
              checkInTime: Yup.string()
                .trim()
                .nullable()
                .required("Check In time is required"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              this.setState({ isLoading: true });
              console.log({ values });

              let requestData = {
                attendanceId: values.attendanceId,
                attendanceDate: values.attendanceDate,
                checkInTime: "",
                checkOutTime: "",
                totalTime: values.totalTime,
                adminRemark: "",
              };

              let checkInDate = moment(
                values.dbcheckInTime,
                "YYYY-MM-DD HH:mm:ss"
              ).format("YYYY-MM-DD");
              let inTime = moment(values.checkInTime, "HH:mm:ss").format(
                "HH:mm:ss"
              );

              console.log({ checkInDate, inTime });
              var dateInTime = moment(
                checkInDate + " " + inTime,
                "YYYY-MM-DD HH:mm:ss"
              ).format("YYYY-MM-DD HH:mm:ss");

              requestData["checkInTime"] = dateInTime;

              if (values.checkOutTime != "") {
                let checkOutDate = moment(
                  values.dbcheckOutTime != ""
                    ? values.dbcheckOutTime
                    : values.dbcheckInTime,
                  "YYYY-MM-DD HH:mm:ss"
                ).format("YYYY-MM-DD");
                let OutTime = moment(values.checkOutTime, "HH:mm:ss").format(
                  "HH:mm:ss"
                );

                var dateOutTime = moment(
                  checkOutDate + " " + OutTime,
                  "YYYY-MM-DD HH:mm:ss"
                ).format("YYYY-MM-DD HH:mm:ss");

                requestData["checkOutTime"] = dateOutTime;
              }

              updateAttendance(requestData)
                .then((response) => {
                  this.setState({ isLoading: false });
                  if (response.data.responseStatus == 200) {
                    toast.success("✔ " + response.data.message);
                    this.setState({ editModalShow: false });
                    this.tableManager.current.asyncApi.resetRows();
                  } else {
                    toast.error("✘ Something went wrong!");
                  }
                })
                .catch((error) => {
                  console.log("error", error);
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
                    <Col md="3">
                      <FormGroup>
                        <Label> Attendance Date</Label>
                        <Input
                          type="date"
                          name="attendanceDate"
                          id="attendanceDate"
                          onChange={handleChange}
                          value={values.attendanceDate}
                          invalid={errors.attendanceDate ? true : false}
                        />
                        <FormFeedback>{errors.attendanceDate}</FormFeedback>
                      </FormGroup>
                    </Col>

                    <Col md="2">
                      <FormGroup>
                        <Label>Check In Time</Label>
                        <Input
                          type="time"
                          placeholder="Enter from time"
                          name="checkInTime"
                          onChange={handleChange}
                          value={values.checkInTime}
                          invalid={errors.checkInTime ? true : false}
                        />
                        <FormFeedback>{errors.checkInTime}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Check Out Time</Label>
                        <Input
                          type="time"
                          placeholder="Enter from time"
                          name="checkOutTime"
                          // onChange={handleChange}
                          onChange={handleChange}
                          onBlur={(e) => {
                            this.calculateTime(
                              {
                                checkInTime: values.checkInTime,
                                checkOutTime: values.checkOutTime,
                              },
                              setFieldValue
                            );
                          }}
                          value={values.checkOutTime}
                          invalid={errors.checkOutTime ? true : false}
                        />
                        <FormFeedback>{errors.checkOutTime}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
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
                      this.onEditModalShow(null);
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
          className="modal-xl attendance-view-mdl"
          isOpen={taskModalShow}
          toggle={() => {
            this.onTaskModalShow(null);
          }}
        >
          <ModalHeader
            className="modalheadernew p-2"
            toggle={() => {
              this.onTaskModalShow(null);
            }}
          >
            Date: {moment(taskInit.taskDate).format("Do MMM YYYY")} &nbsp;
            Employee Name: {taskInit && taskInit.employeeName}
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={taskInit}
            validationSchema={Yup.object().shape({})}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              this.setState({ isLoading: true });

              let requestData = {
                taskId: values.taskId,
                taskType: values.taskType,
                startTime: values.startTime,
                machineStartCount: values.machineStartCount,
                machineEndCount: values.machineEndCount,
                totalCount: values.totalCount,
                actualProduction: values.actualProduction,
                reworkQty: values.reworkQty,
                machineRejectQty: values.machineRejectQty,
                doubtfulQty: values.doubtfulQty,
                unMachinedQty: values.unMachinedQty,
                okQty: values.okQty,
                remark: values.remark,
                adminRemark: values.adminRemark,
                endTime: "",
              };

              if (values.taskType == 1) {
                requestData["machineId"] = values.machineId.value;
                requestData["jobId"] = values.jobId.value;
                requestData["jobOperationId"] = values.jobOperationId.value;
              } else if (values.taskType == 2) {
                requestData["breakId"] = values.workBreakId.value;
                requestData["workDone"] =
                  values.workDone == "true" ? true : false;
              } else if (values.taskType == 3) {
                requestData["machineId"] = values.machineId.value;
              }
              if (values.endTime != "") {
                requestData["endTime"] = values.endTime;
              }

              updateTaskDetails(requestData)
                .then((response) => {
                  this.setState({ isLoading: false });
                  // console.log("response", response);
                  if (response.data.responseStatus == 200) {
                    toast.success("✔ " + response.data.message);
                    this.setState(
                      { taskModalShow: false, viewModalShow: false },
                      () => {
                        let request_data = {
                          fullName: values.employeeName,
                          employeeId: values.employeeId,
                          id: values.attendanceId,
                        };
                        console.log({ request_data });
                        this.onViewModalShow(true, request_data, 0);
                      }
                    );
                  } else {
                    toast.error("✘ Something went wrong!");
                  }
                })
                .catch((error) => {
                  console.log("error", error);
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
                {/* <pre>{JSON.stringify(values)}</pre> */}
                <ModalBody>
                  <Row>
                    <Col md="2">
                      <FormGroup>
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          placeholder="Enter from time"
                          name="startTime"
                          onChange={handleChange}
                          value={values.startTime}
                          invalid={errors.startTime ? true : false}
                        />
                        <FormFeedback>{errors.startTime}</FormFeedback>
                      </FormGroup>
                    </Col>

                    <Col md="2">
                      <FormGroup>
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          placeholder="Enter from time"
                          name="endTime"
                          onChange={handleChange}
                          value={values.endTime}
                          invalid={errors.endTime ? true : false}
                        />
                        <FormFeedback>{errors.endTime}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  {parseInt(values.taskType) == 1 ? (
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
                        <Col md="3">
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
                                this.setState({ jobOperationOpts: [] });
                                if (v != null) {
                                  setFieldValue("jobId", v);
                                  setFieldValue("jobOperationId", "");
                                  this.getJobOperationList(v.value);
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
                        <Col md="3">
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
                      </Row>

                      <Row>
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
                                    this.handleCountValue(
                                      e.target.value,
                                      "start",
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  onBlur={(e) => {
                                    this.handleCountValue(
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
                                <FormFeedback>
                                  {errors.machineStartCount}
                                </FormFeedback>
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
                                    this.handleCountValue(
                                      e.target.value,
                                      "end",
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  onBlur={(e) => {
                                    this.handleCountValue(
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
                                <FormFeedback>
                                  {errors.machineEndCount}
                                </FormFeedback>
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
                                this.handleQtyValue(
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
                            <FormFeedback>{errors.totalQty}</FormFeedback>
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
                                this.handleQtyValue(
                                  e.target.value,
                                  "machineReject",
                                  values,
                                  setFieldValue
                                );
                              }}
                              value={values.machineRejectQty}
                              invalid={errors.machineRejectQty ? true : false}
                            />
                            <FormFeedback>
                              {errors.machineRejectQty}
                            </FormFeedback>
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
                                this.handleQtyValue(
                                  e.target.value,
                                  "rework",
                                  values,
                                  setFieldValue
                                );
                              }}
                              value={values.reworkQty}
                              invalid={errors.reworkQty ? true : false}
                            />
                            <FormFeedback>{errors.reworkQty}</FormFeedback>
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
                                this.handleQtyValue(
                                  e.target.value,
                                  "unMachined",
                                  values,
                                  setFieldValue
                                );
                              }}
                              value={values.unMachinedQty}
                              invalid={errors.unMachinedQty ? true : false}
                            />
                            <FormFeedback>{errors.unMachinedQty}</FormFeedback>
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
                            <FormFeedback>{errors.doubtfulQty}</FormFeedback>
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
                            <FormFeedback>{errors.okQty}</FormFeedback>
                          </FormGroup>
                        </Col>
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
                              Gender <span className="text-danger">*</span>
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
                      </Row>
                    </>
                  ) : (
                    ""
                  )}
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label>Employee Remark?</Label>
                        <Input
                          type="textarea"
                          placeholder="Employee Remark"
                          name="remark"
                          onChange={handleChange}
                          value={values.remark}
                          invalid={errors.remark ? true : false}
                        />
                        <FormFeedback>{errors.remark}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Admin Remark?</Label>
                        <Input
                          type="textarea"
                          placeholder="Admin Remark"
                          name="adminRemark"
                          onChange={handleChange}
                          value={values.adminRemark}
                          invalid={errors.adminRemark ? true : false}
                        />
                        <FormFeedback>{errors.adminRemark}</FormFeedback>
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
                      this.onTaskModalShow(null);
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
    );
  }
}

export default Attendance;
