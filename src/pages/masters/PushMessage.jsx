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
  MyDatePicker,
} from "@/helpers";
import { DTPushMessageUrl } from "@/services/api";
import {
  createPushMessage,
  findPushMessage,
  updatePushMessage,
  deletePushMessage,
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
        isActionExist("designation", "edit", userPermissions) && (
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
      {isActionExist("designation", "delete", userPermissions) && (
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

function PushMessage(props) {
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [messageObject, setMessageObject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [currentIndex, setcurrentIndex] = useState(0);
  const tableManager = React.useRef(null);
  const setTableManager = (tm) => (tableManager.current = tm);

  const getColumns = () => {
    return [
      {
        id: "from_date",
        label: "From Date",
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
        id: "message",
        field: "message",
        label: "Message",
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
    };
    const response = await axios({
      url: DTPushMessageUrl(),
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
    isActionExist("designation", "create", props.userPermissions) && (
      <>
        <button
          onClick={(e) => {
            e.preventDefault();
            onAddModalShow(true);
          }}
        >
          <i className="fa fa-plus"></i>
        </button>
      </>
    );
  const onAddModalShow = (status) => {
    setAddModalShow(status);
  };

  const onEditModalShow = (status, id, rowIndex) => {
    if (status) {
      setcurrentIndex(rowIndex);
      let reqData = {
        id: id,
      };
      findPushMessage(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            setMessageObject(response.data.response);
            setcurrentIndex(0);
            setEditModalShow(status);
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          console.log("errors", error);
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
      deletePushMessage(reqData)
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
          isLoading={isLoading}
          additionalProps={{
            header: {
              label: "Push Message",
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
          Create Push Message
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            fromDate: "",
            toDate: "",
            message: "",
          }}
          validationSchema={Yup.object().shape({
            fromDate: Yup.string()
              .trim()
              .nullable()
              .required("From date is required"),
            toDate: Yup.string()
              .trim()
              .nullable()
              .required("To date is required"),
            message: Yup.string()
              .trim()
              .nullable()
              .required("Message is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = {
              fromDate: moment(values.fromDate).format("YYYY-MM-DD"),
              toDate: moment(values.toDate).format("YYYY-MM-DD"),
              message: values.message,
            };

            createPushMessage(requestData)
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
                      <Label>From Date</Label>
                      <MyDatePicker
                        autoComplete="off"
                        className="datepic form-control"
                        name="fromDate"
                        placeholderText="dd/MM/yyyy"
                        id="fromDate"
                        dateFormat="dd/MM/yyyy"
                        value={values.fromDate}
                        onChange={(e) => {
                          console.log("date ", e);
                          setFieldValue("fromDate", e);
                        }}
                        selected={values.fromDate}
                      />
                      <FormFeedback>{errors.fromDate}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>To Date</Label>
                      <MyDatePicker
                        autoComplete="off"
                        className="datepic form-control"
                        name="toDate"
                        placeholderText="dd/MM/yyyy"
                        id="toDate"
                        dateFormat="dd/MM/yyyy"
                        value={values.toDate}
                        onChange={(e) => {
                          console.log("date ", e);
                          setFieldValue("toDate", e);
                        }}
                        selected={values.toDate}
                      />
                      <FormFeedback>{errors.toDate}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <Label>Message</Label>
                      <Input
                        type="textarea"
                        name="message"
                        id="message"
                        onChange={handleChange}
                        value={values.message}
                        invalid={errors.message ? true : false}
                      />
                      <FormFeedback>{errors.message}</FormFeedback>
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
      </Modal>

      {/* Edit Modal */}
      <Modal
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
          Update Push Message
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize={true}
          initialValues={{
            fromDate:
              messageObject != null ? new Date(messageObject.fromDate) : "",
            toDate: messageObject != null ? new Date(messageObject.toDate) : "",
            message: messageObject != null ? messageObject.message : "",
          }}
          validationSchema={Yup.object().shape({
            fromDate: Yup.string()
              .trim()
              .nullable()
              .required("From date is required"),
            toDate: Yup.string()
              .trim()
              .nullable()
              .required("To date is required"),
            message: Yup.string()
              .trim()
              .nullable()
              .required("Message is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);

            let requestData = {
              id: messageObject.id,
              fromDate: moment(values.fromDate).format("YYYY-MM-DD"),
              toDate: moment(values.toDate).format("YYYY-MM-DD"),
              message: values.message,
            };

            updatePushMessage(requestData)
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
                      <Label>From Date</Label>
                      <MyDatePicker
                        autoComplete="off"
                        className="datepic form-control"
                        name="fromDate"
                        placeholderText="dd/MM/yyyy"
                        id="fromDate"
                        dateFormat="dd/MM/yyyy"
                        value={values.fromDate}
                        onChange={(e) => {
                          console.log("date ", e);
                          setFieldValue("fromDate", e);
                        }}
                        selected={values.fromDate}
                      />
                      <FormFeedback>{errors.fromDate}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>To Date</Label>
                      <MyDatePicker
                        autoComplete="off"
                        className="datepic form-control"
                        name="toDate"
                        placeholderText="dd/MM/yyyy"
                        id="toDate"
                        dateFormat="dd/MM/yyyy"
                        value={values.toDate}
                        onChange={(e) => {
                          console.log("date ", e);
                          setFieldValue("toDate", e);
                        }}
                        selected={values.toDate}
                      />
                      <FormFeedback>{errors.toDate}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <Label>Message</Label>
                      <Input
                        rows={4}
                        type="textarea"
                        name="message"
                        id="message"
                        onChange={handleChange}
                        value={values.message}
                        invalid={errors.message ? true : false}
                      />
                      <FormFeedback>{errors.message}</FormFeedback>
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
      </Modal>
    </div>
  );
}

export default WithUserPermission(PushMessage);
