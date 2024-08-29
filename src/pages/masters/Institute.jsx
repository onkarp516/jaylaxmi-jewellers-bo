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
import { DTInstituteUrl } from "@/services/api";
import {
  createInstitute,
  getListOfInstitutes,
  getInstitute,
  deleteInstitute,
  updateInstitute,
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
        <>
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
        </>
      )}
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
    </>
  );
};

function Institute(props) {
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [instituteObject, setInstituteObject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [currentIndex, setcurrentIndex] = useState(0);
  const tableManager = React.useRef(null);
  const setTableManager = (tm) => (tableManager.current = tm);

  const getColumns = () => {
    return [
      {
        id: "instituteName",
        field: "instituteName",
        label: "Institute Name",
        resizable: true,
      },
      {
        id: "username",
        field: "username",
        label: "Admin",
        resizable: true,
      },
      {
        id: "mobile",
        field: "mobile",
        label: "Mobile",
        resizable: true,
      },
      {
        id: "address",
        field: "address",
        label: "Address",
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
      url: DTInstituteUrl(),
      method: "POST",
      headers: getHeader(),
      data: JSON.stringify(req),
    })
      .then((response) => response.data)
      .catch((e) => {
        console.log("e--->", e);
      });

    if (!response?.rows) return;
    console.log("DTInstituteUrl", response);
    return {
      rows: response.rows,
      totalRows: response.totalRows,
    };
  };

  const addBtn = isWriteAuthorized("master", "institutePermission") && (
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
      getInstitute(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            setInstituteObject(response.data.response);
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
      deleteInstitute(reqData)
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
    <div className="pt-2 pl-2" style={{ background: "#fff" }}>
      {/* <h4>Company</h4> */}
      {(isReadAuthorized("master", "institutePermission") ||
        isWriteAuthorized("master", "institutePermission")) && (
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
              label: "Institute",
              addBtn: addBtn,
              currentIndex: currentIndex,
              onEditModalShow: onEditModalShow,
              onDeleteModalShow: onDeleteModalShow,
            },
            accessPermissionProps: props,
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
        autoFocus={false}
      >
        <ModalHeader
          className="p-2 modalheadernew"
          toggle={() => {
            onAddModalShow(false);
          }}
        >
          Create Institute
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            instituteName: "",
            mobile: "",
            email: "",
            address: "",
            username: "",
            password: "",
          }}
          validationSchema={Yup.object().shape({
            instituteName: Yup.string().required("Institute Name is required"),
            mobile: Yup.string().required("Mobile is required"),
            email: Yup.string().required("Email is required"),
            address: Yup.string().required("Address is required"),
            username: Yup.string().required("Username is required"),
            password: Yup.string().required("Password is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            console.log("inside onSubmit");
            setIsLoading(true);

            let requestData = new FormData();
            requestData.append("institute_name", values.instituteName);
            requestData.append("mobile", values.mobile);
            requestData.append("email", values.email);
            requestData.append("address", values.address);
            requestData.append("username", values.username);
            requestData.append("password", values.password);
            createInstitute(requestData)
              .then((response) => {
                var result = response.data;
                console.log("result.response", result);
                if (result.responseStatus == 200) {
                  setSubmitting(false);
                  setIsLoading(false);
                  toast.success("✔ " + response.data.message);
                  resetForm();
                  onAddModalShow(false);
                  tableManager.current.asyncApi.resetRows();
                } else {
                  setSubmitting(false);
                  setIsLoading(false);
                  toast.error("✘ No Data Found");
                }
              })
              .catch((error) => {
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
                  <Col md="3">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Institute Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter Institute Name"
                        name="instituteName"
                        onChange={handleChange}
                        value={values.instituteName}
                        invalid={errors.instituteName ? true : false}
                      />
                      <FormFeedback>{errors.instituteName}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Mobile <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter Mobile Number"
                        name="mobile"
                        onChange={handleChange}
                        value={values.mobile}
                        invalid={errors.mobile ? true : false}
                      />
                      <FormFeedback>{errors.mobile}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Email <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter Email Address"
                        name="email"
                        onChange={handleChange}
                        value={values.email}
                        invalid={errors.email ? true : false}
                      />
                      <FormFeedback>{errors.email}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Institute Address <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter Institute Address"
                        name="address"
                        onChange={handleChange}
                        value={values.address}
                        invalid={errors.address ? true : false}
                      />
                      <FormFeedback>{errors.address}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="3">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Username <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter Username"
                        name="username"
                        onChange={handleChange}
                        value={values.username}
                        invalid={errors.username ? true : false}
                      />
                      <FormFeedback>{errors.username}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Password <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter Password"
                        name="password"
                        onChange={handleChange}
                        value={values.password}
                        invalid={errors.password ? true : false}
                      />
                      <FormFeedback>{errors.password}</FormFeedback>
                    </FormGroup>
                  </Col>
                  {/* <Col md="3">
                    {isLoading ? (
                      <Button
                        className="mainbtn1 text-white mr-2 report-show-btn"
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
                        Loading...
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="mainbtn1 text-white mr-2 report-show-btn"
                      >
                        Create
                      </Button>
                    )}
                  </Col> */}
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
          Update Institute
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize={true}
          initialValues={{
            instituteName:
              instituteObject != null ? instituteObject.instituteName : "",
            mobile: instituteObject != null ? instituteObject.mobile : "",
            email: instituteObject != null ? instituteObject.email : "",
            address: instituteObject != null ? instituteObject.address : "",
            username: instituteObject != null ? instituteObject.username : "",
            password:
              instituteObject != null ? instituteObject.plainPassword : "",
          }}
          validationSchema={Yup.object().shape({
            instituteName: Yup.string().required("Institute Name is required"),
            mobile: Yup.string().required("Mobile is required"),
            email: Yup.string().required("Email is required"),
            address: Yup.string().required("Address is required"),
            username: Yup.string().required("Username is required"),
            password: Yup.string().required("Password is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = {
              id: instituteObject.id,
              institute_name: values.instituteName,
              mobile: values.mobile,
              email: values.email,
              address: values.address,
              username: values.username,
              password: values.password,
            };

            updateInstitute(requestData)
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
                  <Col md="3">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Institute Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter Institute Name"
                        name="instituteName"
                        onChange={handleChange}
                        value={values.instituteName}
                        invalid={errors.instituteName ? true : false}
                      />
                      <FormFeedback>{errors.instituteName}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Mobile <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter Mobile Number"
                        name="mobile"
                        onChange={handleChange}
                        value={values.mobile}
                        invalid={errors.mobile ? true : false}
                      />
                      <FormFeedback>{errors.mobile}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Email <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter Email Address"
                        name="email"
                        onChange={handleChange}
                        value={values.email}
                        invalid={errors.email ? true : false}
                      />
                      <FormFeedback>{errors.email}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Institute Address <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter Institute Address"
                        name="address"
                        onChange={handleChange}
                        value={values.address}
                        invalid={errors.address ? true : false}
                      />
                      <FormFeedback>{errors.address}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="3">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Username <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter Username"
                        name="username"
                        onChange={handleChange}
                        value={values.username}
                        invalid={errors.username ? true : false}
                      />
                      <FormFeedback>{errors.username}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Password <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter Password"
                        name="password"
                        onChange={handleChange}
                        value={values.password}
                        invalid={errors.password ? true : false}
                      />
                      <FormFeedback>{errors.password}</FormFeedback>
                    </FormGroup>
                  </Col>
                  {/* <Col md="3">
                    {isLoading ? (
                      <Button
                        className="mainbtn1 text-white mr-2 report-show-btn"
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
                        Loading...
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="mainbtn1 text-white mr-2 report-show-btn"
                      >
                        Create
                      </Button>
                    )}
                  </Col> */}
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

export default WithUserPermission(Institute);
