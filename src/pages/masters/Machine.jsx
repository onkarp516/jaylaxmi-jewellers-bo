import React, { useState } from "react";
import GridTable from "@nadavshaar/react-grid-table";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
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
  SUPPORTED_FORMATS_IMG,
  isWriteAuthorized,
  isReadAuthorized,
  getHeader,
  WithUserPermission,
  CustomDTHeader,
  isActionExist,
  MyDatePicker,
} from "@/helpers";
import { DTMachineUrl } from "@/services/api";
import {
  createMachine,
  findMachine,
  updateMachine,
  deleteMachine,
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
        <>
          {isActionExist("machine", "edit", userPermissions) && (
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
          )}
          {isActionExist("machine", "delete", userPermissions) && (
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
      )}
    </>
  );
};

function brand(props) {
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [machineObject, setMachineObject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(0);
  const tableManager = React.useRef(null);
  const setTableManager = (tm) => (tableManager.current = tm);

  const columns = [
    {
      id: "name",
      field: "name",
      label: "Name",
      resizable: true,
    },
    {
      id: "number",
      field: "number",
      label: "Number",
      resizable: true,
    },
    {
      id: "date_of_purchase",
      label: "Date Of Purchase",
      cellRenderer: ({ data }) => {
        return (
          <div className="nightshift">
            {moment(data.dateOfPurchase).format("DD-MM-YYYY")}
          </div>
        );
      },
      resizable: true,
    },
    {
      id: "cost",
      field: "cost",
      label: "Cost",
      resizable: true,
    },
    {
      id: "is_machine_count",
      label: "Is Machine Count?",
      resizable: true,
      cellRenderer: ({ data }) => {
        return (
          <div className="nightshift">
            {data.isMachineCount == true ? " YES" : "NO"}
          </div>
        );
      },
    },
    {
      id: "what_machine_makes",
      field: "whatMachineMakes",
      label: "Machine Work",
      resizable: true,
    },
    {
      id: "default_machine_count",
      field: "defaultMachineCount",
      label: "Default Machine Count",
      resizable: true,
    },
    {
      id: "current_machine_count",
      field: "currentMachineCount",
      label: "Current Machine Count",
      resizable: true,
    },
    {
      id: "created_at",
      label: "Created Date",
      cellRenderer: ({ data }) => {
        return (
          <div className="nightshift">
            {moment(data.createdAt).format("DD-MM-YYYY")}
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
    isActionExist("machine", "create", props.userPermissions) && (
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
    console.log("status, id, rowIndex: ", status, id, rowIndex);
    if (status) {
      setcurrentIndex(rowIndex);
      let reqData = {
        id: id,
      };
      findMachine(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            setMachineObject(response.data.response);
            setcurrentIndex(rowIndex);
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

      deleteMachine(reqData)
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
      url: DTMachineUrl(),
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
              label: "Machine",
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
          Create Machine
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            name: "",
            machineNumber: "",
            dateOfPurchase: "",
            cost: "",
            whatMachineMakes: "",
            isMachineCount: false,
            defaultMachineCount: "",
            currentMachineCount: "",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .trim()
              .nullable()
              .required("Machine name is required"),
            machineNumber: Yup.string()
              .trim()
              .nullable()
              .required("Machine No. is required"),
            dateOfPurchase: Yup.string()
              .trim()
              .nullable()
              .required("Date of purchase is required"),
            cost: Yup.string().trim().nullable().required("Cost is required"),
            whatMachineMakes: Yup.string()
              .trim()
              .nullable()
              .required("Field is required"),
            isMachineCount: Yup.string()
              .trim()
              .nullable()
              .required("Machine Count is required"),
            defaultMachineCount: Yup.string()
              .trim()
              .nullable()
              .required("Default Machine count is require"),
            currentMachineCount: Yup.string()
              .trim()
              .nullable()
              .required("Current count Machine Is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = new FormData();
            requestData.append("name", values.name);
            requestData.append("number", values.machineNumber);
            requestData.append(
              "dateOfPurchase",
              moment(values.dateOfPurchase).format("YYYY-MM-DD")
            );
            requestData.append("cost", values.cost);
            requestData.append("whatMachineMakes", values.whatMachineMakes);
            requestData.append("isMachineCount", values.isMachineCount);
            requestData.append(
              "defaultMachineCount",
              values.defaultMachineCount
            );
            requestData.append(
              "currentMachineCount",
              values.currentMachineCount
            );

            createMachine(requestData)
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
                  <Col md="3">
                    <FormGroup>
                      <Label>Machine Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter Machine name"
                        name="name"
                        onChange={handleChange}
                        value={values.name}
                        invalid={errors.name ? true : false}
                      />
                      <FormFeedback>{errors.name}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Machine Number</Label>
                      <Input
                        type="text"
                        placeholder="Enter Machine number"
                        name="machineNumber"
                        onChange={handleChange}
                        value={values.machineNumber}
                        invalid={errors.machineNumber ? true : false}
                      />
                      <FormFeedback>{errors.machineNumber}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Date Of Purchase</Label>
                      {/* <Input
                        type="date"
                        placeholder="Enter Machine number"
                        name="dateOfPurchase"
                        onChange={handleChange}
                        value={values.dateOfPurchase}
                        invalid={errors.dateOfPurchase ? true : false}
                      />
                      <FormFeedback>{errors.dateOfPurchase}</FormFeedback> */}
                      <MyDatePicker
                        autoComplete="off"
                        className="datepic form-control"
                        name="dateOfPurchase"
                        placeholderText="dd/MM/yyyy"
                        id="dateOfPurchase"
                        dateFormat="dd/MM/yyyy"
                        onChange={(e) => {
                          console.log("date ", e);
                          setFieldValue("dateOfPurchase", e);
                          // getNextDate(e.target.value);
                        }}
                        value={values.dateOfPurchase}
                        selected={values.dateOfPurchase}
                        maxDate={new Date()}
                      />
                      <span className="text-danger">
                        {errors.dateOfPurchase}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Cost</Label>
                      <Input
                        type="text"
                        placeholder="Enter Cost"
                        name="cost"
                        onChange={handleChange}
                        value={values.cost}
                        invalid={errors.cost ? true : false}
                      />
                      <FormFeedback>{errors.cost}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label>What Machine Makes?</Label>
                      <Input
                        type="textarea"
                        placeholder="Enter What Machine Makes?"
                        name="whatMachineMakes"
                        onChange={handleChange}
                        value={values.whatMachineMakes}
                        invalid={errors.whatMachineMakes ? true : false}
                      />
                      <FormFeedback>{errors.whatMachineMakes}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label for="checkbox2">Is Machine Count?</Label>
                      <FormGroup check className="nightshiftlabel">
                        <Label check>
                          <Input
                            type="checkbox"
                            name="isMachineCount"
                            defaultChecked={
                              values.isMachineCount == true ? true : false
                            }
                            onChange={() => {
                              setFieldValue(
                                "isMachineCount",
                                !values.isMachineCount
                              );
                            }}
                            value={values.isMachineCount}
                          />{" "}
                          Yes
                        </Label>
                      </FormGroup>
                    </FormGroup>
                  </Col>

                  <Col md="3">
                    <FormGroup>
                      <Label>Default Machine count</Label>
                      <Input
                        type="text"
                        placeholder="Enter Default machine count"
                        name="defaultMachineCount"
                        onChange={handleChange}
                        value={values.defaultMachineCount}
                        invalid={errors.defaultMachineCount ? true : false}
                      />
                      <FormFeedback>{errors.defaultMachineCount}</FormFeedback>
                    </FormGroup>
                  </Col>

                  <Col md="3">
                    <FormGroup>
                      <Label>Current Machine count</Label>
                      <Input
                        type="text"
                        placeholder="Enter Default machine count"
                        name="currentMachineCount"
                        onChange={handleChange}
                        value={values.currentMachineCount}
                        invalid={errors.currentMachineCount ? true : false}
                      />
                      <FormFeedback>{errors.currentMachineCount}</FormFeedback>
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
          Update Machine
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize={true}
          initialValues={{
            name: machineObject != null ? machineObject.name : "",
            machineNumber: machineObject != null ? machineObject.number : "",
            dateOfPurchase:
              machineObject != null
                ? new Date(machineObject.dateOfPurchase)
                : "",
            cost: machineObject != null ? machineObject.cost : "",
            whatMachineMakes:
              machineObject != null ? machineObject.whatMachineMakes : "",
            isMachineCount:
              machineObject != null ? machineObject.isMachineCount : "",
            defaultMachineCount:
              machineObject != null ? machineObject.defaultMachineCount : "",
            currentMachineCount:
              machineObject != null ? machineObject.currentMachineCount : "",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .trim()
              .nullable()
              .required("Machine name is required"),
            machineNumber: Yup.string()
              .trim()
              .nullable()
              .required("Machine No. is required"),
            dateOfPurchase: Yup.string()
              .trim()
              .nullable()
              .required("Date of purchase is required"),
            cost: Yup.string().trim().nullable().required("Cost is required"),
            whatMachineMakes: Yup.string()
              .trim()
              .nullable()
              .required("Field is required"),
            isMachineCount: Yup.string()
              .trim()
              .nullable()
              .required("Machine count is required"),
            defaultMachineCount: Yup.string()
              .trim()
              .nullable()
              .required("Default Machine count is required"),
            currentMachineCount: Yup.string()
              .trim()
              .nullable()
              .required("Current Machine Count id required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = {
              id: machineObject.id,
              name: values.name,
              number: values.machineNumber,
              dateOfPurchase: moment(values.dateOfPurchase).format(
                "YYYY-MM-DD"
              ),
              cost: values.cost,
              whatMachineMakes: values.whatMachineMakes,
              isMachineCount: values.isMachineCount,
              defaultMachineCount: values.defaultMachineCount,
              currentMachineCount: values.currentMachineCount,
            };

            updateMachine(requestData)
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
                      <Label>Machine Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter Machine name"
                        name="name"
                        onChange={handleChange}
                        value={values.name}
                        invalid={errors.name ? true : false}
                      />
                      <FormFeedback>{errors.name}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Machine Number</Label>
                      <Input
                        type="text"
                        placeholder="Enter Machine number"
                        name="machineNumber"
                        onChange={handleChange}
                        value={values.machineNumber}
                        invalid={errors.machineNumber ? true : false}
                      />
                      <FormFeedback>{errors.machineNumber}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Date Of Purchase</Label>
                      {/* <Input
                        type="date"
                        placeholder="Enter Machine number"
                        name="dateOfPurchase"
                        onChange={handleChange}
                        value={values.dateOfPurchase}
                        invalid={errors.dateOfPurchase ? true : false}
                      />
                      <FormFeedback>{errors.dateOfPurchase}</FormFeedback> */}
                      <MyDatePicker
                        autoComplete="off"
                        className="datepic form-control"
                        name="dateOfPurchase"
                        placeholderText="dd/MM/yyyy"
                        id="dateOfPurchase"
                        dateFormat="dd/MM/yyyy"
                        onChange={(e) => {
                          console.log("date ", e);
                          setFieldValue("dateOfPurchase", e);
                          // getNextDate(e.target.value);
                        }}
                        value={values.dateOfPurchase}
                        selected={values.dateOfPurchase}
                        maxDate={new Date()}
                      />
                      <span className="text-danger">
                        {errors.dateOfPurchase}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Cost</Label>
                      <Input
                        type="text"
                        placeholder="Enter Cost"
                        name="cost"
                        onChange={handleChange}
                        value={values.cost}
                        invalid={errors.cost ? true : false}
                      />
                      <FormFeedback>{errors.cost}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label>What Machine Makes?</Label>
                      <Input
                        type="textarea"
                        placeholder="Enter What Machine Makes?"
                        name="whatMachineMakes"
                        onChange={handleChange}
                        value={values.whatMachineMakes}
                        invalid={errors.whatMachineMakes ? true : false}
                      />
                      <FormFeedback>{errors.whatMachineMakes}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label for="checkbox2">Is Machine Count?</Label>
                      <FormGroup check className="nightshiftlabel">
                        <Label check>
                          <Input
                            type="checkbox"
                            name="isMachineCount"
                            defaultChecked={
                              values.isMachineCount == true ? true : false
                            }
                            onChange={() => {
                              setFieldValue(
                                "isMachineCount",
                                !values.isMachineCount
                              );
                            }}
                            value={values.isMachineCount}
                          />{" "}
                          Yes
                        </Label>
                      </FormGroup>
                    </FormGroup>
                  </Col>

                  <Col md="3">
                    <FormGroup>
                      <Label>Default Machine count</Label>
                      <Input
                        type="text"
                        placeholder="Enter Default machine count"
                        name="defaultMachineCount"
                        onChange={handleChange}
                        value={values.defaultMachineCount}
                        invalid={errors.defaultMachineCount ? true : false}
                      />
                      <FormFeedback>{errors.defaultMachineCount}</FormFeedback>
                    </FormGroup>
                  </Col>

                  <Col md="3">
                    <FormGroup>
                      <Label>Current Machine count</Label>
                      <Input
                        type="text"
                        placeholder="Enter Default machine count"
                        name="currentMachineCount"
                        onChange={handleChange}
                        value={values.currentMachineCount}
                        invalid={errors.currentMachineCount ? true : false}
                      />
                      <FormFeedback>{errors.currentMachineCount}</FormFeedback>
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

export default WithUserPermission(brand);
