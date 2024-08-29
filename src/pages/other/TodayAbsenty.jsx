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

import { DTAbsentUrl } from "@/services/api";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";

class TodayAbsenty extends Component {
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

  setTableManager = (tm) => (this.tableManager.current = tm);

  onRowsRequest = async (requestData, tableManager) => {
    console.log(
      "passed props >>>>>>>>>>>>>>>>>>>",
      this.props.history.location.state
    );

    const { attendanceDate } = this.state;
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
      attendanceDate: attendanceDate != null ? attendanceDate : "",
      selectedShift:
        this.props.history.location.state != null &&
        this.props.history.location.state != ""
          ? this.props.history.location.state
          : "",
    };
    const response = await axios({
      url: DTAbsentUrl(),
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
        id: "desig_name",
        field: "desigName",
        label: "Designation Name",
        resizable: true,
        width: "150px",
      },
      {
        id: "mobile_number",
        field: "mobileNumber",
        label: "Mobile Number",
        resizable: true,
        width: "150px",
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
                  label: "Absent Employee",
                  showDate: showDate,
                  addBtn: "",
                  currentIndex: currentIndex,
                },
              }}
              onLoad={this.setTableManager.bind(this)}
            />
          </>
        )}
      </div>
    );
  }
}

export default TodayAbsenty;
