import React, { useState } from "react";
import GridTable from "@nadavshaar/react-grid-table";
import Button from "@material-ui/core/Button";
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
  SUPPORTED_FORMATS_PDF,
  truncateString,
  isWriteAuthorized,
  isReadAuthorized,
  getHeader,
  CustomDTHeader,
  WithUserPermission,
  isActionExist,
} from "@/helpers";
import { DTJobUrl } from "@/services/api";
import {
  createJob,
  findJob,
  updateJob,
  deleteJob,
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
        isActionExist("item-creation", "edit", userPermissions) && (
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
      {isActionExist("item-creation", "delete", userPermissions) && (
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

function Job(props) {
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [jobObject, setjobObject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(0);
  const tableManager = React.useRef(null);
  const setTableManager = (tm) => (tableManager.current = tm);

  const columns = [
    {
      id: "job_name",
      field: "jobName",
      label: "Name",
      resizable: true,
    },
    {
      id: "job_image_path",
      label: "Drawing & Process Sheet",
      resizable: true,
      cellRenderer: ({ data }) => {
        if (data.jobImagePath != null) {
          return (
            <>
              <a href={data.jobImagePath} target="_blank">
                View Drawing & Process Sheet
              </a>
            </>
          );
        }
      },
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
      width: "100px",
      cellRenderer: ActionsCellRender,
    },
  ];

  const addBtn = isWriteAuthorized("master", "designationPermission") &&
    isActionExist("item-creation", "create", props.userPermissions) && (
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
      findJob(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            setjobObject(response.data.response);
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

      deleteJob(reqData)
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
      url: DTJobUrl(),
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
              label: "Items",
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
          Create Item
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            jobName: "",
            jobDocument: "",
          }}
          validationSchema={Yup.object().shape({
            jobName: Yup.string().trim().required("Item name is required"),
            jobDocument: Yup.lazy((v) => {
              if (v != undefined) {
                return Yup.mixed()
                  .test(
                    "fileType",
                    "Upload JPG,JPEG,PNG with MAX. 5MB sizes",
                    (value) => SUPPORTED_FORMATS_PDF.includes(value.type)
                  )
                  .test(
                    "fileSize",
                    "File size should be less than 5MB",
                    (v) => {
                      const size = 1024 * 1024 * 5;
                      return v && v.size <= size;
                    }
                  );
              }
              return Yup.mixed().notRequired("Upload JPG,JPEG,PNG,PDF");
            }),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = new FormData();
            requestData.append("jobName", values.jobName);
            requestData.append("jobDocument", values.jobDocument);

            createJob(requestData)
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
                      <Label>Item Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter Item name"
                        name="jobName"
                        onChange={handleChange}
                        value={values.jobName}
                        invalid={errors.jobName ? true : false}
                      />
                      <FormFeedback>{errors.jobName}</FormFeedback>
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="employeeType">
                        Upload Drawing / Sheet
                      </Label>
                      <InputGroup className="">
                        <div className="custom-file">
                          <Input
                            type="file"
                            name="jobDocument"
                            className="custom-file-input"
                            onChange={(e) => {
                              setFieldValue("jobDocument", e.target.files[0]);
                            }}
                          />
                          <label
                            className="custom-file-label"
                            htmlFor="jobDocument"
                          >
                            {values.jobDocument
                              ? truncateString(values.jobDocument.name, 20)
                              : "Upload Drawing / Sheet"}
                          </label>
                        </div>
                      </InputGroup>
                      <span className="text-danger">{errors.jobDocument}</span>
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
          Update Item
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize={true}
          initialValues={{
            jobName: jobObject != null ? jobObject.jobName : "",
            jobDocument: "",
          }}
          validationSchema={Yup.object().shape({
            jobName: Yup.string().trim().required("Item name is required"),
            jobDocument: Yup.lazy((v) => {
              if (v != undefined) {
                return Yup.mixed()
                  .test(
                    "fileType",
                    "Upload JPG,JPEG,PNG,PDF with MAX. 5MB sizes",
                    (value) => SUPPORTED_FORMATS_PDF.includes(value.type)
                  )
                  .test(
                    "fileSize",
                    "File size should be less than 5MB",
                    (v) => {
                      const size = 1024 * 1024 * 5;
                      return v && v.size <= size;
                    }
                  );
              }
              return Yup.mixed().notRequired("Upload JPG,JPEG,PNG,PDF");
            }),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = new FormData();
            requestData.append("id", jobObject.id);
            requestData.append("jobName", values.jobName);

            if (values.jobDocument != null && values.jobDocument != undefined) {
              requestData.append("jobDocument", values.jobDocument);
            }

            updateJob(requestData)
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
                      <Label>Item Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter Item name"
                        name="jobName"
                        onChange={handleChange}
                        value={values.jobName}
                        invalid={errors.jobName ? true : false}
                      />
                      <FormFeedback>{errors.jobName}</FormFeedback>
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="employeeType">
                        Upload Drawing / Sheet
                      </Label>
                      <InputGroup className="">
                        <div className="custom-file">
                          <Input
                            type="file"
                            name="jobDocument"
                            className="custom-file-input"
                            onChange={(e) => {
                              setFieldValue("jobDocument", e.target.files[0]);
                            }}
                          />
                          <label
                            className="custom-file-label"
                            htmlFor="jobDocument"
                          >
                            {values.jobDocument
                              ? truncateString(values.jobDocument.name, 20)
                              : "Upload Drawing / Sheet"}
                          </label>
                        </div>
                      </InputGroup>
                      <span className="text-danger">{errors.jobDocument}</span>
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

export default WithUserPermission(Job);
