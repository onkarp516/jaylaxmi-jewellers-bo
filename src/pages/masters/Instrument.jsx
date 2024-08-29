import React, { useState } from "react";
import GridTable from "@nadavshaar/react-grid-table";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import { IconButton } from "@material-ui/core";
import {
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  InputGroup,
  FormFeedback,
  Row,
  Col,
  Spinner,
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
import { DTInstrumentUrl } from "@/services/api";
import {
  createInstrument,
  findInstrument,
  updateInstrument,
  deleteInstrument,
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
        isActionExist("instrument", "edit", userPermissions) && (
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
      {isActionExist("instrument", "delete", userPermissions) && (
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

function Instrument(props) {
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [instrumentObject, setInstrumentObject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(0);
  const tableManager = React.useRef(null);
  const setTableManager = (tm) => (tableManager.current = tm);

  const columns = [
    {
      id: "name",
      field: "name",
      label: "Instrument Name",
      resizable: true,
    },
    {
      id: "is_reading_applicable",
      field: "is_reading_applicable",
      label: "Reading Applicable",
      cellRenderer: ({ data }) => {
        return (
          <div className="nightshift">
            {data.isReadingApplicable == true ? "YES" : "NO"}
          </div>
        );
      },
      resizable: true,
    },
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
    {
      id: "buttons",
      label: "Action",
      pinned: true,
      width: "100px",
      sortable: false,
      resizable: false,
      width: "100px",
      cellRenderer: ActionsCellRender,
    },
  ];

  const addBtn = isWriteAuthorized("master", "designationPermission") &&
    isActionExist("instrument", "create", props.userPermissions) && (
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

  const onAddModalShow = (status) => {
    setAddModalShow(status);
  };

  const onEditModalShow = (status, id, rowIndex) => {
    if (status) {
      setcurrentIndex(rowIndex);
      let reqData = {
        id: id,
      };
      findInstrument(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            setInstrumentObject(response.data.response);
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

      deleteInstrument(reqData)
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

  const onRowsRequest = async (requestData, tableManager) => {
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
    };
    const response = await axios({
      url: DTInstrumentUrl(),
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
  let { userPermissions } = props;
  return (
    <div>
      {(isReadAuthorized("master", "designationPermission") ||
        isWriteAuthorized("master", "designationPermission")) && (
        <GridTable
          components={{ Header: CustomDTHeader }}
          columns={columns}
          onRowsRequest={onRowsRequest}
          onRowClick={(
            { rowIndex, data, column, isEdit, event },
            tableManager
          ) => !isEdit}
          minSearchChars={0}
          additionalProps={{
            header: {
              label: "Instrument",
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
          Create Instrument
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            instrumentName: "",
            isReadingApplicable: false,
          }}
          validationSchema={Yup.object().shape({
            instrumentName: Yup.string()
              .trim()
              .required("Job name is required"),
            isReadingApplicable: Yup.string()
              .trim()
              .nullable()
              .required("Is Reading Applicable is mandatory"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = new FormData();
            requestData.append("instrumentName", values.instrumentName);
            requestData.append(
              "isReadingApplicable",
              values.isReadingApplicable
            );
            createInstrument(requestData)
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
                      <Label>Instrument Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter Instrument name"
                        name="instrumentName"
                        onChange={handleChange}
                        value={values.instrumentName}
                        invalid={errors.instrumentName ? true : false}
                      />
                      <FormFeedback>{errors.instrumentName}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <Label for="checkbox2">Is Reading Applicable </Label>
                      <FormGroup check className="nightshiftlabel">
                        <Label check>
                          <Input
                            type="checkbox"
                            name="isReadingApplicable"
                            // defaultChecked={false}
                            onChange={() => {
                              setFieldValue(
                                "isReadingApplicable",
                                !values.isReadingApplicable
                              );
                            }}
                            value={values.isReadingApplicable}
                          />{" "}
                          Yes
                        </Label>
                      </FormGroup>
                      {/* </Col> */}
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
          Update Instrument
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize={true}
          initialValues={{
            instrumentName:
              instrumentObject != null ? instrumentObject.name : "",
            isReadingApplicable:
              instrumentObject != null
                ? instrumentObject.isReadingApplicable
                : "",
          }}
          validationSchema={Yup.object().shape({
            instrumentName: Yup.string()
              .trim()
              .required("Job name is required"),
            isReadingApplicable: Yup.string()
              .trim()
              .nullable()
              .required("Is Reading Applicable is mandatory"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = {
              id: instrumentObject.id,
              instrumentName: values.instrumentName,
              isReadingApplicable: values.isReadingApplicable,
            };

            updateInstrument(requestData)
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
                      <Label>Instrument Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter Instrument name"
                        name="instrumentName"
                        onChange={handleChange}
                        value={values.instrumentName}
                        invalid={errors.instrumentName ? true : false}
                      />
                      <FormFeedback>{errors.instrumentName}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <Label for="checkbox2">Is Reading Applicable </Label>
                      <FormGroup check className="nightshiftlabel">
                        <Label check>
                          <Input
                            type="checkbox"
                            name="isReadingApplicable"
                            defaultChecked={
                              values.isReadingApplicable == true ? true : false
                            }
                            onChange={() => {
                              setFieldValue(
                                "isReadingApplicable",
                                !values.isReadingApplicable
                              );
                            }}
                            checked={values.isReadingApplicable ? true : false}
                            value={values.isReadingApplicable}
                          />{" "}
                          Yes
                        </Label>
                      </FormGroup>
                      {/* </Col> */}
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

export default WithUserPermission(Instrument);
