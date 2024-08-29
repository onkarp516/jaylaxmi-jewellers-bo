import React, { useState, useEffect, Component, useRef } from "react";
import GridTable from "@nadavshaar/react-grid-table";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import moment from "moment";
import {
  isWriteAuthorized,
  isReadAuthorized,
  getHeader,
  CustomDTHeader,
  getSelectValue,
  WithUserPermission,
  isActionExist,
} from "@/helpers";
import { DTEmployeeLeaveUrl } from "@/services/api";
import { updateEmployeeLeaveStatus } from "@/services/api_function";

import { Badge, Button } from "reactstrap";

import axios from "axios";

class EmployeeLeave extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.state = {
      isLoading: false,
      currentIndex: 0,

      payheadObject: "",
      payheadOpt: [],
      phOptions: [],
      secureData: JSON.parse(localStorage.getItem("loginUser")),
    };
  }

  setTableManager = (tm) => (this.tableManager.current = tm);

  onRowsRequest = async (requestData, tableManager) => {
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
    };
    const response = await axios({
      url: DTEmployeeLeaveUrl(),
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

  onRejectModal = (leaveId = null, leaveStatus = null) => {
    Swal.fire({
      title: `Sure to reject request?`,
      input: "textarea",
      inputPlaceholder: "Type your remark here...",
      inputAttributes: {
        "aria-label": "Type your remark here",
      },
      customClass: "sweetclass",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Reject`,

      inputValidator: (value) => {
        console.log({ value });
        if (!value) {
          return "You need to write something!";
        }
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return false;
      }

      let Obj = {
        leaveId: leaveId,
        leaveStatus: leaveStatus,
        remark: result.value,
      };
      updateEmployeeLeaveStatus(Obj)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            toast.success("✔ " + res.message);
            this.tableManager.current.asyncApi.resetRows();
          } else {
            toast.error("✘ Something went wrong!");
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    });
  };

  onApproveShow = (leaveId = null, leaveStatus = null) => {
    Swal.fire({
      title: `Sure to approve request?`,
      input: "textarea",
      inputPlaceholder: "Type your remark here...",
      inputAttributes: {
        "aria-label": "Type your remark here",
      },
      customClass: "sweetclass",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Approve`,

      // inputValidator: (value) => {
      //   console.log({ value });
      //   // if (!value) {
      //   //   return "You need to write something!";
      //   // }
      // },
    }).then((result) => {
      if (!result.isConfirmed) {
        return false;
      }

      let Obj = {
        leaveId: leaveId,
        leaveStatus: leaveStatus,
        remark: result.value,
      };
      updateEmployeeLeaveStatus(Obj)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            toast.success("✔ " + res.message);
            this.tableManager.current.asyncApi.resetRows();
          } else {
            toast.error("✘ Something went wrong!");
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    });
  };

  onResetModal = (leaveId = null, leaveStatus = null) => {
    Swal.fire({
      title: `Confirm Reset?`,
      input: "textarea",
      inputPlaceholder: "Type your remark here...",
      inputAttributes: {
        "aria-label": "Type your remark here",
      },
      customClass: "sweetclass",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Reset`,
    }).then((result) => {
      if (!result.isConfirmed) {
        return false;
      }

      let Obj = {
        leaveId: leaveId,
        leaveStatus: leaveStatus,
        remark: result.value,
      };
      updateEmployeeLeaveStatus(Obj)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            toast.success("✔ " + res.message);
            this.tableManager.current.asyncApi.resetRows();
          } else {
            toast.error("✘ Something went wrong!");
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    });
  };

  render() {
    const columns = [
      {
        id: "employee_name",
        field: "employeeName",
        label: "Employee Name",
        //minResizeWidth: "130px",
        width: "150px",
        resizable: true,
      },
      {
        id: "leave_name",
        field: "leaveName",
        label: "Leave Name",
        resizable: true,
        //minResizeWidth: "130px",
        width: "130px",
      },
      {
        id: "from_date",
        label: "From Date",
        //minResizeWidth: "130px",
        width: "130px",
        cellRenderer: ({ data }) => {
          return (
            <div className="nightshift">
              {moment(data.fromDate).format("Do MMM YYYY")}
            </div>
          );
        },
        resizable: true,
      },
      {
        id: "to_date",
        label: "To Date",
        width: "120px",
        //minResizeWidth: "130px",
        cellRenderer: ({ data }) => {
          return (
            <div className="nightshift">
              {moment(data.toDate).format("Do MMM YYYY")}
            </div>
          );
        },
        resizable: true,
      },
      {
        id: "total_days",
        field: "totalDays",
        label: "Total Days",
        //minResizeWidth: "130px",
        width: "110px",
        resizable: true,
      },
      {
        id: "reason",
        field: "reason",
        label: "Reason",
        resizable: true,
        //minResizeWidth: "130px",
        width: "150px",
      },
      {
        id: "created_at",
        width: "200px",
        //minResizeWidth: "130px",
        label: "Created Date",
        cellRenderer: ({ data }) => {
          return (
            <div className="nightshift">
              {moment(data.createdAt).format("Do MMM YYYY hh:mm:ss")}
            </div>
          );
        },
        resizable: true,
      },
      {
        id: "approval_status",
        width: "200px",
        //minResizeWidth: "130px",
        label: "Approval Status",
        cellRenderer: ({ data }) => {
          return (
            <div className="nightshift">
              <h4>
                <Badge pill style={{backgroundColor:data.leaveStatus=="Approved"?"#A1C880":""}}>
                  {data.leaveStatus}
                </Badge>
              </h4>
            </div>
          );
        },
        resizable: true,
      },
      {
        id: "buttons",
        label: "Action",
        pinned: true,
        width: "90px",
        sortable: false,
        resizable: false,
        cellRenderer: ({ value, data, column, colIndex, rowIndex }) =>
          data.leaveStatus.toLowerCase() == "pending"
            ? isActionExist(
                "employee-leaves",
                "edit",
                this.props.userPermissions
              ) && (
                <>
                  <Button
                    title="REJECT"
                    id="Tooltipedit"
                    className="deleteredbtn"
                    onClick={(e) => {
                      e.preventDefault();
                      this.onRejectModal(data.id, "Rejected");
                    }}
                  >
                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                    {/* <i className="fa fa-refresh" aria-hidden="true"></i> */}
                  </Button>

                  <Button
                    title="APPROVE"
                    id="Tooltipedit"
                    className="creategreenbtn"
                    onClick={(e) => {
                      e.preventDefault();
                      this.onApproveShow(data.id, "Approved");
                    }}
                  >
                    <i className="fa fa-check-circle"></i>
                  </Button>
                </>
              )
            : this.state.secureData.instituteId == 2
            ? isActionExist(
                "employee-leaves",
                "edit",
                this.props.userPermissions
              ) && (
                <>
                  <span style={{ marginLeft: "8px" }}></span>
                  <Button
                    title="RESET"
                    id="Tooltipedit"
                    className="deleteredbtn"
                    onClick={(e) => {
                      e.preventDefault();
                      this.onResetModal(data.id, "pending");
                    }}
                  >
                    <i className="fa fa-refresh" aria-hidden="true"></i>
                  </Button>
                </>
              )
            : data.leaveStatus,
      },
    ];

    const { isLoading, currentIndex } = this.state;

    return (
      <div>
        {(isReadAuthorized("master", "designationPermission") ||
          isWriteAuthorized("master", "designationPermission")) && (
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
                  label: "Employee Leave Requests",
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

export default WithUserPermission(EmployeeLeave);
