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
import { DTUsersUrl } from "@/services/api";
import {
  findDesignation,
  updateDesignation,
  deleteDesignation,
  deleteUser,
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
  const { currentIndex, onEditModalShow, onDeleteModalShow } = header;
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
          "user-creation",
          "edit",
          accessPermissionProps.userPermissions
        ) && (
          <Button
            title="EDIT"
            id="Tooltipedit"
            className="edityellowbtn"
            onClick={(e) => {
              e.preventDefault();
              onEditModalShow(true, data.id, rowIndex);
              props.history.push("/master/user-edit");
            }}
          >
            <i className="fa fa-edit"></i>
          </Button>
        )
      )}

      {/* {isActionExist(
        "user-creation",
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
      )} */}
      {isActionExist(
        "user-creation",
        "delete",
        accessPermissionProps.userPermissions
      ) &&
        (data.status == true ? (
          <Button
            title="DEACTIVATE"
            id="Tooltipedit"
            className="deleteredbtn"
            onClick={(e) => {
              e.preventDefault();
              // changeEmployeeStatusFun(data.employeeId, !data.status);
              onDeleteModalShow(data.id, !data.status);
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
              // changeEmployeeStatusFun(data.employeeId, !data.status);
              onDeleteModalShow(data.id, !data.status);
            }}
          >
            <i className="fa fa-check-circle"></i>
          </Button>
        ))}
    </>
  );
};

function ShowUsers(props) {
  //   const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [roleObject, setRoleObject] = useState("");
  const [userStatus, setUserStatus] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [currentIndex, setcurrentIndex] = useState(0);
  const tableManager = React.useRef(null);
  const setTableManager = (tm) => (tableManager.current = tm);

  const getColumns = () => {
    return [
      {
        id: "username",
        field: "username",
        label: "User Name",
        resizable: true,
      },
      {
        id: "roleName",
        field: "roleName",
        label: "Role Name",
        resizable: true,
      },
      {
        id: "created_at",
        label: "Created Date",
        cellRenderer: ({ data }) => {
          return (
            <div className="nightshift">
              {moment(data.createdAt).format("Do MMM YYYY")}
            </div>
          );
        },
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
      status: userStatus,
    };
    const response = await axios({
      url: DTUsersUrl(),
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
    isActionExist("user-creation", "create", props.userPermissions) && (
      <>
        <button
          onClick={(e) => {
            e.preventDefault();
            props.history.push(`/master/user-create`);
          }}
        >
          <i className="fa fa-plus"></i>
        </button>
      </>
    );
  // );
  // const onAddModalShow = (status) => {
  //   setAddModalShow(status);
  // };

  const toggleUserStatus = (event) => {
    // console.log("inside toggleUserStatus : ", event.target.value);
    setUserStatus(event.target.value);
    tableManager.current.asyncApi.resetRows();
  };

  const onEditModalShow = (status, id, rowIndex) => {
    if (status) {
      setcurrentIndex(rowIndex);
      props.history.push("/master/user-edit/" + id);
      // props.history.push("/emp/emp-edit/" + id);
      // let reqData = {
      //   id: id,
      // };
      // findDesignatios(reqData)
      //   .then((response) => {
      //     if (response.data.responseStatus == 200) {
      //       props.history.push(`/master/role`);
      //     } else {
      //       toast.error("✘ " + response.data.message);
      //     }
      //   })
      //   .catch((error) => {
      //     console.log("errors", error);
      //   });
    } else {
      setcurrentIndex(0);
    }
  };

  const onDeleteModalShow = (id, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      // icon: "warning",
      customClass: "sweetclass",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: status ? "Activate" : "De-Activate",
    }).then((result) => {
      console.log("delete event");
      if (!result.isConfirmed) {
        return false;
      }
      let requestData = new FormData();
      requestData.append("user_id", id);
      requestData.append("status", status);
      // let reqData = {
      //   id: id,
      // };
      deleteUser(requestData)
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
        onRowsRequest={onRowsRequest}
        onRowClick={({ rowIndex, data, column, isEdit, event }, tableManager) =>
          !isEdit
        }
        minSearchChars={0}
        isLoading={isLoading}
        additionalProps={{
          header: {
            label: "Users",
            addBtn: addBtn,
            currentIndex: currentIndex,
            onEditModalShow: onEditModalShow,
            onDeleteModalShow: onDeleteModalShow,
            radioBtn: true,
            toggleUserStatus: toggleUserStatus,
            userStatus: userStatus,
          },
          accessPermissionProps: props,
        }}
        onLoad={setTableManager}
      />

      {/* Add Modal */}
      {/* <Modal
        className="modal-lg p-2"
        isOpen={addModalShow}
        toggle={() => {
          onAddModalShow(false);
        }}
      >
        <ModalHeader
          className="p-2 modalheadernew"
          toggle={() => {
            onAddModalShow(false);
          }}
        >
          Create Designation
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            designationName: "",
            designationCode: "",
          }}
          validationSchema={Yup.object().shape({
            designationName: Yup.string()
              .trim()
              .nullable()
              .required("Designation name is required"),
            designationCode: Yup.string()
              .trim()
              .nullable()
              .required("Designation code is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = new FormData();
            requestData.append("name", values.designationName);
            requestData.append("code", values.designationCode);

            createDesignation(requestData)
              .then((response) => {
                setIsLoading(false);
                if (response.data.responseStatus === 200) {
                  setSubmitting(false);
                  toast.success("✔ " + response.data.message);
                  resetForm();
                  onAddModalShow(false);
                  tableManager.current.asyncApi.resetRows();
                } else {
                  setSubmitting(false);
                  toast.error("✘ " + response.data.message);
                }
              })
              .catch((error) => {
                setIsLoading(false);
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
            <Form autoComplete="off">
              <ModalBody>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Designation Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter designation name"
                        name="designationName"
                        onChange={handleChange}
                        value={values.designationName}
                        invalid={errors.designationName ? true : false}
                      />
                      <FormFeedback>{errors.designationName}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Designation Level</Label>
                      <Input
                        type="text"
                        placeholder="Enter designation Level"
                        name="designationCode"
                        onChange={handleChange}
                        value={values.designationCode}
                        invalid={errors.designationCode ? true : false}
                      />
                      <FormFeedback>{errors.designationCode}</FormFeedback>
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
                    Creating...
                  </Button>
                ) : (
                  <Button type="submit" className="mainbtn1 text-white">
                    Create
                  </Button>
                )}

                <Button
                  className="modalcancelbtn"
                  type="button"
                  onClick={() => {
                    onAddModalShow(null);
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          )}
        />
      </Modal> */}

      {/* Edit Modal */}
      {/* <Modal
        className="modal-lg p-2"
        isOpen={editModalShow}
        toggle={() => {
          onEditModalShow(null);
        }}
      >
        <ModalHeader
          className="modalheadernew p-2"
          toggle={() => {
            onEditModalShow(null);
          }}
        >
          Update Designation
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize={true}
          initialValues={{
            roleName: "",
          }}
          validationSchema={Yup.object().shape({
            roleName: Yup.string()
              .nullable()
              .trim()
              .required("Role name is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = {
              id: designationObject.id,
              name: values.designationName,
              code: values.designationCode,
            };

            updateDesignation(requestData)
              .then((response) => {
                setIsLoading(false);
                if (response.data.responseStatus === 200) {
                  setSubmitting(false);
                  toast.success("✔ " + response.data.message);
                  resetForm();
                  onEditModalShow(false);
                  tableManager.current.asyncApi.resetRows();
                } else {
                  setSubmitting(false);
                  toast.error("✘ " + response.data.message);
                }
              })
              .catch((error) => {
                setIsLoading(false);
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
            <Form autoComplete="off">
              <ModalBody>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Designation Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter designation name"
                        name="designationName"
                        onChange={handleChange}
                        value={values.designationName}
                        invalid={errors.designationName ? true : false}
                      />
                      <FormFeedback>{errors.designationName}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Designation Level</Label>
                      <Input
                        type="text"
                        placeholder="Enter designation Level"
                        name="designationCode"
                        onChange={handleChange}
                        value={values.designationCode}
                        invalid={errors.designationCode ? true : false}
                      />
                      <FormFeedback>{errors.designationCode}</FormFeedback>
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
                    onEditModalShow(null);
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          )}
        />
      </Modal> */}
    </div>
  );
}

export default WithUserPermission(ShowUsers);
