import React, { Component, useRef, useContext } from "react";
import GridTable from "@nadavshaar/react-grid-table";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
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
} from "reactstrap";
import { DTAttendanceUrl } from "@/services/api";
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
} from "@/services/api_function";
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
  const { currentIndex, onViewModalShow, onEditModalShow, onEditModalShow1 } =
    header;
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

      <Button
        title="EDIT"
        id="Tooltipedit"
        className="edityellowbtn"
        onClick={(e) => {
          e.preventDefault();
          onEditModalShow1(true, data, rowIndex);
        }}
      >
        <i className="fa fa-edit"></i>
      </Button>
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
      editModalShow1: false,
      editModalShow: false,
      viewModalShow: false,
      salaryModalShow: false,
      taskModalShow: false,
      attendanceDate: "",
      taskList: [],
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
        columnId: "",
        searchText: "",
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
              // finalDaySalaryType: "",
              // finalDaySalary: "",
              // wagesHourBasis: attObject.wagesHourBasis,
              // wagesPointBasis: attObject.wagesPointBasis,
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
  // $('#myCollapsible').collapse({
  //   toggle: false
  // })
  onEditModalShow1 = (status, attObject, rowIndex) => {
    console.log({ attObject });

    if (status == true) {
      this.setState({ currentIndex: rowIndex });

      this.setState({
        currentIndex: 0,
        editModalShow1: status,
      });
    } else {
      this.setState({
        editModalShow1: status,
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
  changeCollapseState = (index) => {
    let { collapse } = this.state;

    collapse[index] = !collapse[index];

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
      editModalShow1,
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
                  onEditModalShow1: this.onEditModalShow1.bind(this),
                },
              }}
              onLoad={this.setTableManager.bind(this)}
            />
          </>
        )}

        {/* Blank Edit Modal */}
        <Modal
          className="modal-xl p-2"
          isOpen={editModalShow1}
          toggle={() => {
            this.onEditModalShow1(null);
          }}
        >
          <ModalHeader
            className="modalheadernew p-2"
            toggle={() => {
              this.onEditModalShow1(null);
            }}
          >
            Employee Name:
          </ModalHeader>

          <ModalBody>
            Name
            {/* {JSON.stringify(values)} */}
            {/* <div id="accordion">
              <div class="card">
                <div class="card-header accordionstyle" id="headingOne">
                  <h5 class="mb-0">
                    <button
                      class="btn btn-link"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                            <th>First Name</th>
                          </tr>
                        </thead>
                      </Table>
                    </button>
                  </h5>
                </div>

                <div
                  id="collapseOne"
                  class="collapse show"
                  aria-labelledby="headingOne"
                  data-parent="#accordion"
                >
                  <div class="card-body">
                    <Table>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                          <td>1</td>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                          <td>1</td>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                          <td>1</td>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header accordionstyle" id="headingTwo">
                  <h5 class="mb-0">
                    <button
                      class="btn btn-link collapsed"
                      data-toggle="collapse"
                      data-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      Collapsible Group Item #2
                    </button>
                  </h5>
                </div>
                <div
                  id="collapseTwo"
                  class="collapse"
                  aria-labelledby="headingTwo"
                  data-parent="#accordion"
                >
                  <div class="card-body">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life
                    accusamus terry richardson ad squid. 3 wolf moon officia
                    aute, non cupidatat skateboard dolor brunch. Food truck
                    quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                    sunt aliqua put a bird on it squid single-origin coffee
                    nulla assumenda shoreditch et. Nihil anim keffiyeh
                    helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim
                    aesthetic synth nesciunt you probably haven't heard of them
                    accusamus labore sustainable VHS.
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header accordionstyle" id="headingThree">
                  <h5 class="mb-0">
                    <button
                      class="btn btn-link collapsed"
                      data-toggle="collapse"
                      data-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      Collapsible Group Item #3
                    </button>
                  </h5>
                </div>
                <div
                  id="collapseThree"
                  class="collapse"
                  aria-labelledby="headingThree"
                  data-parent="#accordion"
                >
                  <div class="card-body">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life
                    accusamus terry richardson ad squid. 3 wolf moon officia
                    aute, non cupidatat skateboard dolor brunch. Food truck
                    quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                    sunt aliqua put a bird on it squid single-origin coffee
                    nulla assumenda shoreditch et. Nihil anim keffiyeh
                    helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim
                    aesthetic synth nesciunt you probably haven't heard of them
                    accusamus labore sustainable VHS.
                  </div>
                </div>
              </div>
          </div> */}
          </ModalBody>

          <ModalFooter className="p-2">
            <Button type="submit" className="mainbtn1 text-white">
              Update
            </Button>
            <Button
              className="mainbtn1 modalcancelbtn"
              type="button"
              onClick={() => {
                this.onEditModalShow1(null);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

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
            Item
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
                    <Col md="3" xs="8" className="pr-1 pl-2">
                      <Select
                        ////isClearable={true}
                        styles={{
                          clearIndicator: ClearIndicatorStyles,
                        }}
                        onChange={(v) => {
                          if (v != null) {
                            setFieldValue("columnId", v);
                          } else {
                            setFieldValue("columnId", "");
                          }
                        }}
                        name="columnId"
                        options={columnlist}
                        value={values.columnId}
                      />
                    </Col>
                    <Col md="3" xs="8" className="pr-1 pl-2">
                      <input
                        name="searchText"
                        type="search"
                        value={values.searchText}
                        onChange={handleChange}
                        className="searchinput1"
                        placeholder=" Search For"
                        style={{ width: "100%" }}
                      />
                    </Col>
                    <Col md="3" xs="8" className="pr-1 pl-2">
                      <Button
                        type="button"
                        className="mainbtn1 text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          this.searchTaskData(
                            attendanceObject.employeeId,
                            attendanceObject.attendanceId,
                            values.columnId.value,
                            values.searchText
                          );
                        }}
                      >
                        Search Data
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      {/* <Table
                        component={Paper}
                        aria-label="simple table"
                        responsive
                        bordered
                        className="today_work_tbl mt-2"
                      >
                        <thead>
                          <tr className="orderdetail-tbl">
                            <th>Machine</th>
                            <th>Item/Break</th>
                            <th>Operation</th>
                            <th>Cycle Time</th>
                            <th>Working Time</th>
                            <th>Time (MIN.)</th>
                            <th>Actual Time (MIN.)</th>
                            <th>Total Qty.</th>
                            <th>REQ. Qty.</th>
                            <th>ACT. Qty.</th>
                            <th>% Of Task</th>
                            <th>OK Qty.</th>
                            <th>M/R Qty.</th>
                            <th>R/W Qty.</th>
                            <th>D/F Qty.</th>
                            <th>U/M Qty.</th>
                            <th>Remark</th>
                            <th style={{ zIndex: "9" }}>ACT</th>
                          </tr>
                        </thead>

                        <tbody
                          className="prescriptiontable"
                          style={{
                            width: "320px",
                            height: "80px",
                            overflow: "auto",
                          }}
                        >
                          {taskList &&
                            taskList.map((value, key) => {
                              return (
                                <tr key={key}>
                                  {/* <td>{parseInt(key) + 1}</td>
                                  <td>
                                    {value.taskType == 1
                                      ? "TASK"
                                      : value.taskType == 2
                                      ? "DOWN TIME"
                                      : value.taskType == 3
                                      ? "SETTING TIME"
                                      : "-"}
                                  </td> */}

                      {/*     <td>
                                    {value.machineNumber != null
                                      ? value.machineNumber
                                      : "-"}
                                  </td>
                                  <td>
                                    {value.jobName != null
                                      ? value.jobName
                                      : value.breakName != null
                                      ? value.breakName
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
                                    {value.startTime != null
                                      ? value.startTime
                                      : "-"}
                                    <br />
                                    {"TO"}
                                    <br />
                                    {value.endTime != null
                                      ? value.endTime
                                      : "-"}
                                  </td>
                                  <td>{value.totalTime}</td>
                                  <td>{value.actualWorkTime}</td>
                                  <td>
                                    {value.totalCount != null
                                      ? value.totalCount
                                      : 0}
                                  </td>
                                  <td>
                                    {value.requiredProduction != null
                                      ? value.requiredProduction
                                      : 0}
                                  </td>
                                  <td>
                                    {value.actualProduction != null
                                      ? value.actualProduction
                                      : 0}
                                  </td>
                                  <td>
                                    {value.percentageOfTask != null
                                      ? value.percentageOfTask + "%"
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
                                  <td>
                                    {value.remark != null ? value.remark : "-"}
                                  </td>

                                  <td>
                                    <Button
                                      title="VIEW"
                                      id="Tooltipedit"
                                      className="edityellowbtn"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.onTaskModalShow(true, value.id);
                                      }}
                                    >
                                      <i className="fa fa-edit"></i>
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </Table> */}

                      {/* <Card
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({ collapse: !collapse });
                        }}
                        style={{ marginBottom: "1rem" }}
                      >
                        Toggle
                      </Card>
                      <Collapse isOpen={collapse}>
                        <Card className="border">
                          <CardBody>
                            <Table
                              // component={Paper}
                              aria-label="simple table"
                              responsive
                              bordered
                              className="today_work_tbl mt-2"
                            >
                              <thead>
                                <tr className="orderdetail-tbl">
                                  <th>Machine</th>
                                  <th>Item/Break</th>
                                  <th>Operation</th>
                                  <th>Cycle Time</th>
                                  <th>Working Time</th>
                                  <th>Time (MIN.)</th>
                                  <th>Actual Time (MIN.)</th>
                                  <th>Total Qty.</th>
                                  <th>REQ. Qty.</th>
                                  <th>ACT. Qty.</th>
                                  <th>% Of Task</th>
                                  <th>OK Qty.</th>
                                  <th>M/R Qty.</th>
                                  <th>R/W Qty.</th>
                                  <th>D/F Qty.</th>
                                  <th>U/M Qty.</th>
                                  <th>Remark</th>
                                  <th style={{ zIndex: "9" }}>ACT</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ collapse: !collapse });
                                  }}
                                >
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                </tr>
                                <tr
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ collapse: !collapse });
                                  }}
                                >
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                </tr>
                                <tr
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ collapse: !collapse });
                                  }}
                                >
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                </tr>
                                <tr
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ collapse: !collapse });
                                  }}
                                >
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                </tr>
                                <tr
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ collapse: !collapse });
                                  }}
                                >
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                  <td>1</td>
                                </tr>
                              </tbody>
                            </Table>
                          </CardBody>
                        </Card>
                      </Collapse> */}
                      {/* <Table>
                        <thead>
                          <tr>
                            <th>Machine</th>
                            <th>Item/Break</th>
                            <th>Operation</th>
                            <th>Cycle Time</th>
                            <th>Working Time</th>
                            <th>Time (MIN.)</th>
                            <th>Actual Time (MIN.)</th>
                            <th>Total Qty.</th>
                            <th>REQ. Qty.</th>
                            <th>ACT. Qty.</th>
                            <th>% Of Task</th>
                            <th>OK Qty.</th>
                            <th>M/R Qty.</th>
                            <th>R/W Qty.</th>
                            <th>D/F Qty.</th>
                            <th>U/M Qty.</th>
                            <th>Remark</th>
                            <th style={{ zIndex: "9" }}>ACT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array(18)
                            .fill(18)
                            .map((v, i) => {
                              return (
                                <>
                                  <tr
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.changeCollapseState(i);
                                    }}
                                  >
                                    <td>{i + 1}</td>
                                    <td>{v}</td>
                                  </tr>
                                  <tr>
                                    <Collapse isOpen={this.getCollapseState(i)}>
                                      {i + 1}
                                      <Table>
                                        <thead>
                                          <tr>
                                            <th>Inner</th>
                                            <th>Inner</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td>234</td>
                                            <td>234</td>
                                          </tr>{" "}
                                          <tr>
                                            <td>234</td>
                                            <td>234</td>
                                          </tr>{" "}
                                          <tr>
                                            <td>234</td>
                                            <td>234</td>
                                          </tr>{" "}
                                          <tr>
                                            <td>234</td>
                                            <td>234</td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </Collapse>
                                  </tr>
                                </>
                              );
                            })}
                        </tbody>
                      </Table> */}
                      <div className="container">
                        <div className="col-md-12">
                          <div className="panel panel-default">
                            <div className="panel-heading">Employee</div>
                            <div className="panel-body">
                              <table className="table table-condensed table-striped">
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>Fist Name</th>
                                    <th>Last Name</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  <tr
                                    data-toggle="collapse"
                                    data-target="#demo1"
                                    className="accordion-toggle"
                                  >
                                    <td>
                                      <button className="btn btn-default btn-xs">
                                        <span className="fa fa-eye"></span>
                                      </button>
                                    </td>
                                    <td>Carlos</td>
                                    <td>Mathias</td>
                                    <td>Leme</td>
                                    <td>SP</td>
                                    <td>new</td>
                                  </tr>

                                  <tr>
                                    <td colspan="12" className="hiddenRow">
                                      <div
                                        className="accordian-body collapse"
                                        id="demo1"
                                      >
                                        <table className="table table-striped">
                                          <thead>
                                            <tr className="info">
                                              <th>Job</th>
                                              <th>Company</th>
                                              <th>Salary</th>
                                              <th>Date On</th>
                                              <th>Date off</th>
                                              <th>Action</th>
                                            </tr>
                                          </thead>

                                          <tbody>
                                            <tr
                                              data-toggle="collapse"
                                              className="accordion-toggle"
                                              data-target="#demo10"
                                            >
                                              <td>
                                                {" "}
                                                <a href="#">
                                                  Enginner Software
                                                </a>
                                              </td>
                                              <td>Google</td>
                                              <td>U$8.00000 </td>
                                              <td> 2016/09/27</td>
                                              <td> 2017/09/27</td>
                                              <td>
                                                <a
                                                  href="#"
                                                  className="btn btn-default btn-sm"
                                                >
                                                  <i className="fa fa-gear"></i>
                                                </a>
                                              </td>
                                            </tr>

                                            <tr>
                                              <td
                                                colspan="12"
                                                className="hiddenRow"
                                              >
                                                <div
                                                  className="accordian-body collapse"
                                                  id="demo10"
                                                >
                                                  <table className="table table-striped">
                                                    <thead>
                                                      <tr>
                                                        <td>
                                                          <a href="#">
                                                            {" "}
                                                            XPTO 1
                                                          </a>
                                                        </td>
                                                        <td>XPTO 2</td>
                                                        <td>Obs</td>
                                                      </tr>
                                                      <tr>
                                                        <th>item 1</th>
                                                        <th>item 2</th>
                                                        <th>item 3 </th>
                                                        <th>item 4</th>
                                                        <th>item 5</th>
                                                        <th>Actions</th>
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      <tr>
                                                        <td>item 1</td>
                                                        <td>item 2</td>
                                                        <td>item 3</td>
                                                        <td>item 4</td>
                                                        <td>item 5</td>
                                                        <td>
                                                          <a
                                                            href="#"
                                                            className="btn btn-default btn-sm"
                                                          >
                                                            <i className="fa fa-gear"></i>
                                                          </a>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </div>
                                              </td>
                                            </tr>

                                            <tr>
                                              <td>Scrum Master</td>
                                              <td>Google</td>
                                              <td>U$8.00000 </td>
                                              <td> 2016/09/27</td>
                                              <td> 2017/09/27</td>
                                              <td>
                                                {" "}
                                                <a
                                                  href="#"
                                                  className="btn btn-default btn-sm"
                                                >
                                                  <i className="fa fa-gear"></i>
                                                </a>
                                              </td>
                                            </tr>

                                            <tr>
                                              <td>Back-end</td>
                                              <td>Google</td>
                                              <td>U$8.00000 </td>
                                              <td> 2016/09/27</td>
                                              <td> 2017/09/27</td>
                                              <td>
                                                {" "}
                                                <a
                                                  href="#"
                                                  className="btn btn-default btn-sm"
                                                >
                                                  <i className="fa fa-gear"></i>
                                                </a>
                                              </td>
                                            </tr>

                                            <tr>
                                              <td>Front-end</td>
                                              <td>Google</td>
                                              <td>U$8.00000 </td>
                                              <td> 2016/09/27</td>
                                              <td> 2017/09/27</td>
                                              <td>
                                                {" "}
                                                <a
                                                  href="#"
                                                  className="btn btn-default btn-sm"
                                                >
                                                  <i className="fa fa-gear"></i>
                                                </a>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </td>
                                  </tr>

                                  <tr
                                    data-toggle="collapse"
                                    data-target="#demo2"
                                    className="accordion-toggle"
                                  >
                                    <td>
                                      <button className="btn btn-default btn-xs">
                                        <span className="fa fa-eye"></span>
                                      </button>
                                    </td>
                                    <td>Silvio</td>
                                    <td>Santos</td>
                                    <td>São Paulo</td>
                                    <td>SP</td>
                                    <td> new</td>
                                  </tr>
                                  <tr>
                                    <td colspan="6" className="hiddenRow">
                                      <div
                                        id="demo2"
                                        className="accordian-body collapse"
                                      >
                                        Demo2
                                      </div>
                                    </td>
                                  </tr>
                                  <tr
                                    data-toggle="collapse"
                                    data-target="#demo3"
                                    className="accordion-toggle"
                                  >
                                    <td>
                                      <button className="btn btn-default btn-xs">
                                        <span className="fa fa-eye"></span>
                                      </button>
                                    </td>
                                    <td>John</td>
                                    <td>Doe</td>
                                    <td>Dracena</td>
                                    <td>SP</td>
                                    <td> New</td>
                                  </tr>
                                  <tr>
                                    <td colspan="6" className="hiddenRow">
                                      <div
                                        id="demo3"
                                        className="accordian-body collapse"
                                      >
                                        Demo3 sadasdasdasdasdas
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
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
            validationSchema={Yup.object().shape({
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
                  // console.log("response", response);
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
            Task Job Work Counts:{" "}
            {moment(taskInit.taskDate).format("Do MMM YYYY")} &nbsp; Employee
            Name: {taskInit && taskInit.employeeName}
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={taskInit}
            validationSchema={Yup.object().shape({
              // okQty: Yup.string().trim().nullable().required("Id is required"),
              // reworkQty: Yup.string()
              //   .trim()
              //   .nullable()
              //   .required("Rework count is required"),
              // machineRejectQty: Yup.string()
              //   .trim()
              //   .nullable()
              //   .required("Machine Rejection count is required"),
              // doubtfulQty: Yup.string()
              //   .trim()
              //   .nullable()
              //   .required("Doubtful count is required"),
              // unMachinedQty: Yup.string()
              //   .trim()
              //   .nullable()
              //   .required("Doubtful count is required"),
              // totalQty: Yup.string()
              //   .trim()
              //   .nullable()
              //   .required("Total is required"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              this.setState({ isLoading: true });

              let requestData = {
                taskId: values.taskId,
                taskType: values.taskType,
                startTime: values.startTime,
                machineStartCount: values.machineStartCount,
                machineEndCount: values.machineEndCount,
                totalCount: values.totalQty,
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
