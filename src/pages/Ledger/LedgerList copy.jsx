import React, { useState, useRef } from "react";
import GridTable from "@nadavshaar/react-grid-table";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
// import Button from "@material-ui/core/Button";
import {
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Row,
  Col,
  Spinner,
  Dropdown,
  Button,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import {
  isWriteAuthorized,
  isReadAuthorized,
  getHeader,
  CustomDTHeader,
  WithUserPermission,
  isActionExist,
} from "@/helpers";
import { DTRolesUrl } from "@/services/api";
import {
  findDesignation,
  updateDesignation,
  deleteDesignation,
  updateUserURL,
  deleteRole,
  getLedgers,
} from "@/services/api_function";

import axios from "axios";

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
  const { header, accessPermissionProps } = additionalProps;
  const { currentIndex, onViewModalShow, onDeleteModalShow } = header;
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
        isActionExist(
          "user-role",
          "edit",
          accessPermissionProps.userPermissions
        ) && (
          <Button
            title="View"
            id="Tooltipedit"
            className="edityellowbtn"
            onClick={(e) => {
              e.preventDefault();
              onViewModalShow(true, data.id, rowIndex);
              // props.history.push("/master/role-edit/" + data.id);
            }}
          >
            <i className="fa fa-eye"></i>
          </Button>
        )
      )}

      {isActionExist(
        "user-role",
        "delete",
        accessPermissionProps.userPermissions
      ) && (
        <Button
          title="DELETE"
          id="Tooltipdelete"
          className="deleteredbtn"
          onClick={(e) => {
            e.preventDefault();
            onDeleteModalShow(data.id);
          }}
        >
          <i className="fa fa-trash"></i>
        </Button>
      )}
    </>
  );
};

function LedgerList(props) {
  //   const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [roleObject, setRoleObject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [currentIndex, setcurrentIndex] = useState(0);
  const tableManager = React.useRef(null);
  const setTableManager = (tm) => (tableManager.current = tm);

  const getColumns = () => {
    return [    
    {
        id: "roleName",
        field: "roleName",
        label: "Ledger Name",
        resizable: true,
    },    
    {
        id: "roleName",
        field: "roleName",
        label: "Foundation",
        resizable: true,
    }, 
    {
        id: "roleName",
        field: "roleName",
        label: "Principle",
        resizable: true,
    }, 
    {
        id: "roleName",
        field: "roleName",
        label: "Sub Principle",
        resizable: true,
    }, 
    {
        id: "roleName",
        field: "roleName",
        label: "Debit",
        resizable: true,
    }, 
    {
        id: "roleName",
        field: "roleName",
        label: "Credit",
        resizable: true,
    },    
    {
        id: "buttons",
        label: "Action",
        pinned: true,
        width: "100px",
        sortable: false,
        resizable: false,
        cellRenderer: ActionsCellRender,
    },
    ];
  };

  const onRowsRequest = async (requestData, tableManager) => {
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
      status: "1",
    };
    const response = await axios({
      url: DTRolesUrl(),
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

  const addBtn = isWriteAuthorized("master", "designationPermission") &&
    isActionExist("user-role", "create", props.userPermissions) && (
      <>
        <button
          onClick={(e) => {
            e.preventDefault();
            props.history.push(`/master/ledger-create`);
          }}
        >
          <i className="fa fa-plus"></i>
        </button>
      </>
    );
 
  const onViewModalShow = (status, id, rowIndex) => {
    if (status) {
      setcurrentIndex(rowIndex);
      props.history.push("/master/role-edit/" + id); 
    } else {
      setcurrentIndex(0);
    }
  };

  const onDeleteModalShow = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      // icon: "warning",
      customClass: "sweetclass",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      console.log("delete event");
      if (!result.isConfirmed) {
        return false;
      }
      let requestData = new FormData();
      requestData.append("role_id", id);
      // let reqData = {
      //   id: id,
      // };
      deleteRole(requestData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            toast.success("✔ " + response.data.message);
            tableManager.current.asyncApi.resetRows();
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          toast.error("✘ " + error);
        });
    });
  };

  return (
    <div>
      <GridTable
        components={{ Header: CustomDTHeader }}
        columns={getColumns()}
        // onRowsRequest={onRowsRequest}
        onRowClick={({ rowIndex, data, column, isEdit, event }, tableManager) =>
          !isEdit
        }
        minSearchChars={0}
        isLoading={isLoading}
        additionalProps={{
          header: {
            label: "Ledgers",
            addBtn: addBtn,
            currentIndex: currentIndex,
            onViewModalShow: onViewModalShow,
            onDeleteModalShow: onDeleteModalShow,
          },
          accessPermissionProps: props,
        }}
        onLoad={setTableManager}
      /> 
    </div>
  );
}

export default WithUserPermission(LedgerList);
