import React, { useState, useEffect } from "react";
import GridTable from "@nadavshaar/react-grid-table";
// import Button from "@material-ui/core/Button";
import moment from "moment";
import { DTEmployeeUrl } from "@/services/api";
import { changeEmployeeStatus } from "@/services/api_function";
import {
  isWriteAuthorized,
  isReadAuthorized,
  getHeader,
  CustomDTHeader,
  WithUserPermission,
  isActionExist,
} from "@/helpers";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Button, Col, Form, Row } from "reactstrap";
import axios from "axios";
import { Select } from "@material-ui/core";

function Employee(props) {
  const tableManager = React.useRef(null);
  const setTableManager = (tm) => (tableManager.current = tm);

  const [empStatusOpt, setEmpStatusOpt] = useState([
    { value: "", label: "All", visible: false },
    { value: "1", label: "Active", visible: false },
    { value: "0", label: "De-Active", visible: false },
  ]);

  const [empStatusValue, setEmpStatusValue] = useState("");
  const [selectedShift, setSelectedShift] = useState("");

  const addBtn = isWriteAuthorized("master", "designationPermission") &&
    isActionExist("employee", "create", props.userPermissions) && (
      <>
        <button
          title="CREATE"
          onClick={(e) => {
            e.preventDefault();
            props.history.push("/master/ledger/ledger-create");
          }}
          className="mr-2"
        >
          <i className="fa fa-plus"></i>
        </button>
      </>
    );

  const columns = [
    {
      id: "ledger_name",
      field: "ledger_name",
      label: "Ledger Name",
      resizable: true,
    },
    {
      id: "foundation",
      field: "foundation",
      label: "Foundation",
      resizable: true,
    },
    {
      id: "principle",
      field: "principle",
      label: "Principle",
      resizable: true,
    },
    // {
    //   id: "dob",
    //   field: "dob",
    //   label: "DOB",
    //   cellRenderer: ({ data }) => {
    //     return (
    //       <div className="nightshift">
    //         {moment(data.dob).format("Do MMM YYYY")}
    //       </div>
    //     );
    //   },
    //   resizable: true,
    // },
    {
      id: "sub_principle",
      field: "sub_principle",
      label: "Sub Principle",
      resizable: true,
    },
    {
      id: "debit",
      field: "debit",
      label: "Debit",
      resizable: true,
    },
    {
      id: "credit",
      field: "credit",
      label: "Credit",
      resizable: true,
    },
    // {
    //   id: "action",
    //   field: "action",
    //   label: "Action",
    //   resizable: true,
    // },
    // {
    //   id: "created_at",
    //   label: "Created Date",
    //   cellRenderer: ({ data }) => {
    //     return (
    //       <div className="nightshift">
    //         {moment(data.createdAt).format("Do MMM YYYY")}
    //       </div>
    //     );
    //   },
    //   resizable: true,
    // },
    // {
    //   id: "status",
    //   label: "Status",
    //   cellRenderer: ({ data }) => {
    //     return (
    //       <div className="nightshift">
    //         {data.status === true ? "Active" : "De-active"}
    //       </div>
    //     );
    //   },
    //   resizable: true,
    // },
    {
      id: "buttons",
      label: "Action",
      pinned: true,
      width: "100px",
      sortable: false,
      resizable: false,
      width: "100px",
      cellRenderer: ({ value, data, column, colIndex, rowIndex }) => (
        <>
          {isActionExist("employee", "edit", props.userPermissions) && (
            <Button
              title="EDIT"
              id="Tooltipedit"
              className="edityellowbtn"
              onClick={(e) => {
                e.preventDefault();
                props.history.push("/emp/emp-edit/" + data.employeeId);
              }}
            >
              <i className="fa fa-edit"></i>
            </Button>
          )}
          {isActionExist("employee", "delete", props.userPermissions) &&
            (data.status == true ? (
              <Button
                title="DEACTIVATE"
                id="Tooltipedit"
                className="deleteredbtn"
                onClick={(e) => {
                  e.preventDefault();
                  changeEmployeeStatusFun(data.employeeId, !data.status);
                }}
              >
                <i className="fa fa-times-circle" aria-hidden="true"></i>
              </Button>
            ) : (
              <Button
                title="ACTIVATE"
                id="Tooltipedit"
                className="creategreenbtn"
                // style={{
                //   display: "-webkit-inline-box",
                //   color: "#159515",
                //   marginLeft: "6px",
                // }}
                onClick={(e) => {
                  e.preventDefault();
                  changeEmployeeStatusFun(data.employeeId, !data.status);
                }}
              >
                <i className="fa fa-check-circle"></i>
              </Button>
            ))}
        </>
      ),
    },
  ];

  const changeEmployeeStatusFun = (id, empStatus) => {
    Swal.fire({
      title: `Are you sure? `,
      customClass: "sweetclass",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes ${empStatus ? "Activate" : "De-activate"}`,
    }).then((result) => {
      if (!result.isConfirmed) {
        return false;
      }

      let request_data = {
        id: id,
        status: empStatus,
      };
      changeEmployeeStatus(request_data)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            toast.success("✔ " + res.message);
            tableManager.current.asyncApi.resetRows();
          } else {
            toast.error("✘ Something went wrong!");
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    });
  };

  const onRowsRequest = async (requestData, tableManager) => {
    console.log(
      "passed props >>>>>>>>>>>>>>>>>>> , empStatusValue >>>>>>>>>>>",
      props.history.location.state,
      empStatusValue
    );

    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
      empStatus:
        empStatusValue == "" &&
        props.history.location.state != null &&
        props.history.location.state != ""
          ? 1
          : empStatusValue,
      selectedShift:
        props.history.location.state != null &&
        props.history.location.state != ""
          ? props.history.location.state
          : "",
    };

    const response = await axios({
      url: DTEmployeeUrl(),
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

  const toggleEmployeeData = (value) => {
    console.log({ value });
    let empStatus = empStatusOpt.map((v) => {
      if (v.value == value) {
        v.visible = true;
        setEmpStatusValue(v.value);
      } else {
        v.visible = false;
      }
      return v;
    });
    setEmpStatusOpt(empStatus);
    tableManager.current.asyncApi.resetRows();
  };

  return (
    <div>
    
      <GridTable
        components={{ Header: CustomDTHeader }}
        columns={columns}
        onRowsRequest={onRowsRequest}
        onRowClick={({ rowIndex, data, column, isEdit, event }, tableManager) =>
          !isEdit
        }
        minSearchChars={0}
        additionalProps={{
          header: {
            label: "Ledger List",
            addBtn: addBtn,
            empStatusOpt: empStatusOpt,
            toggleEmployeeData: toggleEmployeeData,
            changeEmployeeStatusFun: changeEmployeeStatusFun,
          },
        }}
        onLoad={setTableManager}
      />
    </div>
  );
}

export default WithUserPermission(Employee);
