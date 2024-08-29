import React, { useState, useEffect } from "react";
import GridTable from "@nadavshaar/react-grid-table";
import { Row, Col } from "react-bootstrap";
import {
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Spinner,
} from "reactstrap";

import Button from "@material-ui/core/Button";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import {
  isWriteAuthorized,
  isReadAuthorized,
  getHeader,
  CustomDTHeader,
  WithUserPermission,
  isActionExist,
  OnlyEnterNumbers,
} from "@/helpers";
import { DTLeaveTypeUrl } from "@/services/api";
import {
  createLeaveType,
  findLeaveType,
  updateLeaveType,
  deleteLeaveType,
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
  props,
}) => {
  const { additionalProps } = tableManager.config;
  const { header } = additionalProps;
  const { currentIndex, onEditModalShow, onDeleteModalShow, userPermissions } =
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
        isActionExist("leave-type", "edit", userPermissions) && (
          <Button
            title="EDIT"
            id="Tooltipedit"
            className="edityellowbtn"
            onClick={(e) => {
              e.preventDefault();
              onEditModalShow(true, data.id, rowIndex);
            }}
          >
            <i className="fa fa-edit"></i>
          </Button>
        )
      )}
      {isActionExist("leave-type", "delete", userPermissions) && (
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

function LeaveType(props) {
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leaveTypeObject, setLeaveTypeObject] = useState("");
  const [currentIndex, setcurrentIndex] = useState(0);
  const tableManager = React.useRef(null);
  const setTableManager = (tm) => (tableManager.current = tm);

  const getColumns = () => {
    return [
      {
        id: "name",
        field: "name",
        label: "Leave Type Name",
        resizable: true,
      },
      {
        id: "is_paid",
        label: "Is Paid?",
        resizable: true,
        cellRenderer: ({ data }) => {
          return (
            <div className="nightshift">
              {data.isPaid == true ? " YES" : "NO"}
            </div>
          );
        },
      },
      {
        id: "leavesAllowed",
        field: "leavesAllowed",
        label: "Leaves Allowed",
        resizable: true,
      },
      {
        id: "created_at",
        label: "Created At",
        resizable: true,
        cellRenderer: ({ data }) => {
          return (
            <div className="nightshift">
              {moment(data.createdAt).format("Do MMM YYYY")}
            </div>
          );
        },
      },
      {
        id: "buttons",
        label: "Action",
        pinned: true,
        sortable: false,
        resizable: false,
        cellRenderer: ActionsCellRender,
      },
    ];
  };
  // {isActionExist('leave-type','view',props.user)}
  const addBtn = isActionExist(
    "leave-type",
    "create",
    props.userPermissions
  ) && (
    <>
      <button
        title="CREATE"
        onClick={(e) => {
          e.preventDefault();
          onAddModalShow(true);
        }}
      >
        <i className="fa fa-plus"></i>
      </button>
    </>
  );

  const onRowsRequest = async (requestData, tableManager) => {
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
    };
    const response = await axios({
      url: DTLeaveTypeUrl(),
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

  const onAddModalShow = (status) => {
    setAddModalShow(status);
  };

  const onEditModalShow = (status, id, rowIndex) => {
    if (status) {
      setcurrentIndex(rowIndex);
      let reqData = {
        id: id,
      };
      findLeaveType(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            setLeaveTypeObject(response.data.response);
            setcurrentIndex(0);
            setEditModalShow(status);
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          console.log("errors", error);
          toast.error("✘ " + error);
        });
    } else {
      setcurrentIndex(0);
      setEditModalShow(status);
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
      if (!result.isConfirmed) {
        return false;
      }
      let reqData = {
        id: id,
      };
      deleteLeaveType(reqData)
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
  let { userPermissions } = props;
  return (
    <div>
      {(isReadAuthorized("master", "designationPermission") ||
        isWriteAuthorized("master", "designationPermission")) && (
        <GridTable
          components={{ Header: CustomDTHeader }}
          columns={getColumns()}
          onRowsRequest={onRowsRequest}
          onRowClick={(
            { rowIndex, data, column, isEdit, event },
            tableManager
          ) => !isEdit}
          minSearchChars={0}
          additionalProps={{
            header: {
              label: "Leave Type",
              addBtn: addBtn,
              currentIndex: currentIndex,
              onEditModalShow: onEditModalShow,
              onDeleteModalShow: onDeleteModalShow,
              userPermissions: userPermissions,
            },
          }}
          onLoad={setTableManager}
        />
      )}

      {/* Add Modal */}
      <Modal
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
          Create Leave Type
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            name: "",
            isPaid: false,
            leavesAllowed: "",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .trim()
              .nullable()
              .required("Leave Type name is required"),
            leavesAllowed: Yup.string()
              .trim()
              .nullable()
              .required("Allowed Leaves is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = {
              name: values.name,
              isPaid: values.isPaid,
              leavesAllowed: values.leavesAllowed,
            };

            createLeaveType(requestData)
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
                      <Label>Leave Type Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter break name"
                        name="name"
                        onChange={handleChange}
                        value={values.name}
                        invalid={errors.name ? true : false}
                      />
                      <FormFeedback>{errors.name}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <Label for="checkbox2">Is Paid?</Label>
                      <FormGroup check className="nightshiftlabel">
                        <Label check>
                          <Input
                            type="checkbox"
                            name="isPaid"
                            onChange={() => {
                              setFieldValue("isPaid", !values.isPaid);
                            }}
                            value={values.isPaid}
                          />{" "}
                          Yes
                        </Label>
                      </FormGroup>
                      {/* </Col> */}
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Leaves Allowed</Label>
                      <Input
                        type="text"
                        placeholder="Enter Allowed Leaves"
                        name="leavesAllowed"
                        onKeyPress={(e) => {
                          OnlyEnterNumbers(e);
                        }}
                        onChange={handleChange}
                        value={values.leavesAllowed}
                        invalid={errors.leavesAllowed ? true : false}
                      />
                      <FormFeedback>{errors.leavesAllowed}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter className="p-0">
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
      </Modal>

      {/* Update Modal */}
      <Modal
        className="modal-lg p-2"
        isOpen={editModalShow}
        toggle={() => {
          onEditModalShow(false);
        }}
      >
        <ModalHeader
          className="p-2 modalheadernew"
          toggle={() => {
            onEditModalShow(false);
          }}
        >
          Update Leave Type
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize={true}
          initialValues={{
            name: leaveTypeObject != null ? leaveTypeObject.name : "",
            isPaid: leaveTypeObject != null ? leaveTypeObject.isPaid : false,
            leavesAllowed: leaveTypeObject != null ? leaveTypeObject.leavesAllowed : "",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .trim()
              .nullable()
              .required("Leave Type name is required"),
            leavesAllowed: Yup.string()
              .trim()
              .nullable()
              .required("Allowed Leaves is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = {
              id: leaveTypeObject.id,
              name: values.name,
              isPaid: values.isPaid,
              leavesAllowed: values.leavesAllowed,
            };

            updateLeaveType(requestData)
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
                      <Label>Leave Type Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter leave type name"
                        name="name"
                        onChange={handleChange}
                        value={values.name}
                        invalid={errors.name ? true : false}
                      />
                      <FormFeedback>{errors.name}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <Label for="checkbox2">Is Paid?</Label>
                      <FormGroup check className="nightshiftlabel">
                        <Label check>
                          <Input
                            type="checkbox"
                            name="isPaid"
                            checked={values.isPaid == true ? true : false}
                            onChange={() => {
                              setFieldValue("isPaid", !values.isPaid);
                            }}
                            value={values.isPaid}
                          />{" "}
                          Yes
                        </Label>
                      </FormGroup>
                      {/* </Col> */}
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Leaves Allowed</Label>
                      <Input
                        type="text"
                        placeholder="Enter Allowed Leaves"
                        name="leavesAllowed"
                        onKeyPress={(e) => {
                          OnlyEnterNumbers(e);
                        }}
                        onChange={handleChange}
                        value={values.leavesAllowed}
                        invalid={errors.leavesAllowed ? true : false}
                      />
                      <FormFeedback>{errors.leavesAllowed}</FormFeedback>
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
                    Updating...
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
      </Modal>
    </div>
  );
}

export default WithUserPermission(LeaveType);
