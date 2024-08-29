import React, { useState, useEffect } from "react";
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
  Dropdown,
} from "reactstrap";
import Select, { components } from "react-select";

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
  OnlyEnterNumbers,
} from "@/helpers";
import {
  createShift,
  findShift,
  updateShift,
  deleteShift,
  listOfEmployee,
  listOfShifts,
  shiftAssignToEmployee,
} from "@/services/api_function";
import { DTShiftsUrl } from "@/services/api";

import axios from "axios";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

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
        isActionExist("shift", "edit", userPermissions) && (
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
      {isActionExist("shift", "delete", userPermissions) && (
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

function Shift(props) {
  const [Emp_op, setEmp_op] = useState([]);
  const [Shift_op, setShift_op] = useState([]);
  const [selected, setSelected] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [assignModalShow, setAssignModalShow] = useState(false);
  const [shiftObject, setShiftObject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(0);
  const tableManager = React.useRef(null);
  const setTableManager = (tm) => (tableManager.current = tm);

  const columns = [
    {
      id: "name",
      field: "name",
      className: "customcolumn",
      label: "Shift Name",
      resizable: true,
    },
    {
      id: "is_night_shift",
      label: "Is Night Shift?",
      className: "customcolumn",
      resizable: true,
      cellRenderer: ({ data }) => {
        return (
          <div className="nightshift">
            {data.isNightShift == true ? " YES" : "NO"}
          </div>
        );
      }, // cellRenderer: ({ data }) => (data.isNightShift == true ? " YES" : "NO"),
    },
    {
      id: "from_time",
      field: "fromTime",
      label: "Shift From",
      className: "customcolumn",
      resizable: true,
      // width: "130px",
    },
    {
      id: "threshold",
      field: "threshold",
      label: "Permissible  In Time",
      className: "customcolumn",
      resizable: true,
    },
    {
      id: "to_time",
      field: "toTime",
      label: "Shift To",
      className: "customcolumn",
      resizable: true,
      // width: "100px",
    },
    {
      id: "lunch_time",
      field: "lunchTime",
      label: "Lunch Time(MIN.)",
      className: "customcolumn",
      resizable: true,
      // width: "150px",
    },
    {
      id: "working_hours",
      field: "workingHours",
      label: "Total Working Hours",
      className: "customcolumn",
      resizable: true,
    },
    {
      id: "created_at",
      label: "Created Date",
      className: "customcolumn",
      cellRenderer: ({ data }) => {
        return (
          <div className="nightshift">
            {moment(data.createdAt).format("DD-MM-yyyy")}
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

  const addBtn = isWriteAuthorized("master", "designationPermission") &&
    isActionExist("shift", "create", props.userPermissions) && (
      <>
        {/* <button
          title="CREATE"
          onClick={(e) => {
            e.preventDefault();
            onAssignModalShow(true);
          }}
        >
          Assign
        </button> */}

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

  const onAssignModalShow = (status) => {
    setAssignModalShow(status);
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
      findShift(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            // debugger
            setShiftObject(response.data.response);
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
      setEditModalShow(status);
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
      if (!result.isConfirmed) {
        return false;
      }

      let reqData = {
        id: id,
      };
      deleteShift(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            toast.success("✔ " + response.data.message);
            list;
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

  const calculateTime = (values, setFieldValue) => {
    let { isNightShift, shiftFrom, shiftTo } = values;
    if (values.shiftFrom != "" && values.shiftTo != "") {
      if (values.isNightShift) {
        var dt1 = new Date("2019-1-8 " + shiftFrom);
        var dt2 = new Date("2019-1-9 " + shiftTo);
      } else {
        var dt1 = new Date("2019-1-8 " + shiftFrom);
        var dt2 = new Date("2019-1-8 " + shiftTo);
      }

      var diff = dt2.getTime() - dt1.getTime();
      var hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);
      var mins = Math.floor(diff / (1000 * 60));
      diff -= mins * (1000 * 60);

      hours = String(hours).padStart(2, "0");
      mins = String(mins).padStart(2, "0");
      var result = hours + ":" + mins;
      setFieldValue("isNightShift", isNightShift);
      setFieldValue("fromTime", shiftFrom);
      setFieldValue("toTime", shiftTo);
      setFieldValue("workingHours", result);
    }
  };

  const onRowsRequest = async (requestData, tableManager) => {
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
    };
    const response = await axios({
      url: DTShiftsUrl(),
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

  const getEmpOptions = () => {
    listOfEmployee()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt = result.map(function (data) {
            return {
              value: data.id,
              label: data.employeeName,
            };
          });
          setEmp_op(opt);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getShiftOptions = () => {
    listOfShifts()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt = result.map(function (data) {
            return {
              value: data.id,
              label: data.name,
            };
          });
          setShift_op(opt);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // isDayRadio

  const isDayRadio = (considerationCount) => {
    console.log("considerationCount-->" + considerationCount);
    return considerationCount ? false : true;
    // const foundObject = this.state.CheckList.find(
    //   (item) => item.employeeId === employeeId
    // );

    // if (foundObject) {
    //   console.log("Object found:", foundObject);
    //   return foundObject.attendanceStatus;
    // } else {
    //   console.log("Object not found");
    // }
  };

  useEffect(() => {
    getEmpOptions();
    getShiftOptions();
  }, []);

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
              label: "Shift",
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
          Create Shift
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            shiftName: "",
            fromTime: "",
            threshold: "",
            toTime: "",
            lunchTime: "",
            isNightShift: false,
            workingHours: "",
            isDayDeduction: "",
          }}
          validationSchema={Yup.object().shape({
            shiftName: Yup.string()
              .trim()
              .nullable()
              .required("Shift name is required"),
            fromTime: Yup.string()
              .trim()
              .nullable()
              .required("From time is required"),
            threshold: Yup.string()
              .trim()
              .nullable()
              .required("Permissible  In Time is required"),
            toTime: Yup.string()
              .trim()
              .nullable()
              .required("To time is required"),
            lunchTime: Yup.string()
              .trim()
              .nullable()
              .required("Lunch time is required"),
            considerationCount: Yup.string()
              .trim()
              .nullable()
              .required("Late count is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            console.log(values);
            console.log(values.isDayDeduction);
            setStatus();
            setIsLoading(true);
            let requestData = {
              shiftName: values.shiftName,
              fromTime: values.fromTime,
              threshold: values.threshold,
              toTime: values.toTime,
              lunchTime: values.lunchTime,
              isNightShift: values.isNightShift,
              workingHours: values.workingHours,
              considerationCount: values.considerationCount,
              isDayDeduction: values.isDayDeduction,
              dayValueOfDeduction: values.dayValueOfDeduction,
              hourValueOfDeduction: values.hourValueOfDeduction,
            };

            createShift(requestData)
              .then((response) => {
                setIsLoading(false);
                let res = response.data;
                console.log({ res });
                if (res.responseStatus === 200) {
                  setSubmitting(false);
                  toast.success("✔ " + res.message);
                  resetForm();
                  onAddModalShow(false);

                  tableManager.current.asyncApi.resetRows();
                } else {
                  setSubmitting(false);
                  toast.error("✘ " + res.message);
                }
              })
              .catch((error) => {
                setIsLoading(false);
                console.log("✘ " + error);
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
                      <Label>Shift Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter shift name"
                        name="shiftName"
                        onChange={handleChange}
                        value={values.shiftName}
                        invalid={errors.shiftName ? true : false}
                      />
                      <FormFeedback>{errors.shiftName}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label for="checkbox2">Is Night Shift?</Label>
                      <FormGroup check className="nightshiftlabel">
                        <Label check>
                          <Input
                            type="checkbox"
                            name="isNightShift"
                            defaultChecked={false}
                            onChange={() => {
                              setFieldValue(
                                "isNightShift",
                                !values.isNightShift
                              );
                            }}
                            value={values.isNightShift}
                          />{" "}
                          Yes
                        </Label>
                      </FormGroup>
                      {/* </Col> */}
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>In Time</Label>
                      <Input
                        type="time"
                        placeholder="Enter from time"
                        name="fromTime"
                        onChange={handleChange}
                        value={values.fromTime}
                        invalid={errors.fromTime ? true : false}
                      />
                      <FormFeedback>{errors.fromTime}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Permissible  In Time</Label>
                      <Input
                        type="time"
                        placeholder="Enter Permissible In Time"
                        name="threshold"
                        onChange={handleChange}
                        value={values.threshold}
                        invalid={errors.threshold ? true : false}
                      />
                      <FormFeedback>{errors.threshold}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Out Time</Label>
                      <Input
                        type="time"
                        placeholder="Enter to time"
                        name="toTime"
                        onChange={handleChange}
                        onBlur={(e) => {
                          calculateTime(
                            {
                              isNightShift: values.isNightShift,
                              shiftFrom: values.fromTime,
                              shiftTo: values.toTime,
                            },
                            setFieldValue
                          );
                        }}
                        value={values.toTime}
                        invalid={errors.toTime ? true : false}
                      />
                      <FormFeedback>{errors.toTime}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Lunch Time</Label>
                      <Input
                        type="text"
                        placeholder="Enter lunch time in minutes"
                        name="lunchTime"
                        onKeyPress={(e) => {
                          OnlyEnterNumbers(e);
                        }}
                        onChange={handleChange}
                        value={values.lunchTime}
                        invalid={errors.lunchTime ? true : false}
                      />
                      <FormFeedback>{errors.lunchTime}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Total Working Hours</Label>
                      <Input
                        type="text"
                        readOnly={true}
                        placeholder="Enter working Hours"
                        name="workingHours"
                        onChange={handleChange}
                        value={values.workingHours}
                        invalid={errors.workingHours ? true : false}
                      />
                      <FormFeedback>{errors.workingHours}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Permissible Late Count</Label>
                      <Input
                        type="text"
                        // readOnly={true}
                        placeholder="Enter Permissible Late Count"
                        name="considerationCount"
                        onKeyPress={(e) => {
                          OnlyEnterNumbers(e);
                        }}
                        onChange={handleChange}
                        value={values.considerationCount}
                        invalid={errors.considerationCount ? true : false}
                      />
                      <FormFeedback>{errors.considerationCount}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                {/* <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label>Late Count to be consider as deduction</Label>
                      <Input
                        type="text"
                        // readOnly={true}
                        placeholder="Enter Late Count"
                        name="considerationCount"
                        onKeyPress={(e)=>{
                          OnlyEnterNumbers(e)
                        }}
                        onChange={handleChange}
                        value={values.considerationCount}
                        invalid={errors.considerationCount ? true : false}
                      />
                      <FormFeedback>{errors.considerationCount}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row> */}

                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label>Deduction</Label>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="3">
                    <FormGroup>
                      <Label>
                        Deduction for
                        <span className="text-danger">*</span>
                      </Label>
                      <br />
                      <FormGroup className="gender nightshiftlabel">
                        <Label>
                          <input
                            name="isDayDeduction"
                            type="radio"
                            disabled={isDayRadio(values.considerationCount)}
                            // value={true}
                            // checked={values.isDayDeduction === true ? true : false}
                            onChange={(v) => {
                              setFieldValue("isDayDeduction", "true");
                              // this.getAlloCationData(v, setFieldValue, values);
                            }}
                            className="mr-1"
                          />
                          <span>Day </span>
                        </Label>
                        <Label className="ml-3">
                          <input
                            name="isDayDeduction"
                            type="radio"
                            disabled={isDayRadio(values.considerationCount)}
                            // value={false}
                            // checked={values.isDayDeduction === true ? false : true}
                            onChange={(v) => {
                              setFieldValue("isDayDeduction", "false");
                              // this.getAlloCationData(v, setFieldValue, values);
                            }}
                            className="mr-1"
                          />
                          <span>Hour</span>
                        </Label>
                      </FormGroup>
                      <span className="text-danger">
                        {errors.isDayDeduction && "Select Option?"}
                      </span>
                    </FormGroup>
                  </Col>
                  {values.isDayDeduction == "true" ? (
                    <Col md="4">
                      <FormGroup>
                        <Label>
                          Deduction for Days
                          <span className="text-danger">*</span>
                        </Label>
                        <br />
                        <FormGroup className="gender nightshiftlabel">
                          <Row>
                            <Label>
                              <input
                                name="dayValueOfDeduction"
                                type="radio"
                                // value={true}
                                // checked={values.dayValueOfDeduction === true ? true : false}
                                onChange={(v) => {
                                  setFieldValue(
                                    "dayValueOfDeduction",
                                    "quarter"
                                  );
                                  // this.getAlloCationData(
                                  //   v,
                                  //   setFieldValue,
                                  //   values
                                  // );
                                }}
                                className="mr-1"
                              />
                              <span>Quarter</span>
                            </Label>
                          </Row>
                          <Row>
                            <Row>
                              <Label className="ml-3">
                                <input
                                  name="dayValueOfDeduction"
                                  type="radio"
                                  // value={false}
                                  // checked={values.dayValueOfDeduction === true ? false : true}
                                  onChange={(v) => {
                                    setFieldValue(
                                      "dayValueOfDeduction",
                                      "half"
                                    );
                                    // this.getAlloCationData(
                                    //   v,
                                    //   setFieldValue,
                                    //   values
                                    // );
                                  }}
                                  className="mr-1"
                                />
                                <span>Half</span>
                              </Label>
                            </Row>
                          </Row>
                          <Row>
                            <Row>
                              <Label className="ml-3">
                                <input
                                  name="dayValueOfDeduction"
                                  type="radio"
                                  // value={false}
                                  // checked={values.dayValueOfDeduction === true ? false : true}
                                  onChange={(v) => {
                                    setFieldValue(
                                      "dayValueOfDeduction",
                                      "full"
                                    );
                                    // this.getAlloCationData(
                                    //   v,
                                    //   setFieldValue,
                                    //   values
                                    // );
                                  }}
                                  className="mr-1"
                                />
                                <span>Full</span>
                              </Label>
                            </Row>
                          </Row>
                        </FormGroup>
                        <span className="text-danger">
                          {errors.dayValueOfDeduction && "Select Option?"}
                        </span>
                      </FormGroup>
                    </Col>
                  ) : null}
                  {values.isDayDeduction == "false" ? (
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Label>Deduction for Hours</Label>
                          <Input
                            type="text"
                            // readOnly={true}
                            placeholder="Enter Late Count"
                            name="hourValueOfDeduction"
                            onChange={handleChange}
                            value={values.hourValueOfDeduction}
                            invalid={errors.hourValueOfDeduction ? true : false}
                          />
                          <FormFeedback>
                            {errors.hourValueOfDeduction}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : null}
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
          Update Shift
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize={true}
          initialValues={shiftObject}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .trim()
              .nullable()
              .required("Shift name is required"),
            fromTime: Yup.string()
              .trim()
              .nullable()
              .required("From time is required"),
            threshold: Yup.string()
              .trim()
              .nullable()
              .required("Permissible  In Time is required"),
            toTime: Yup.string()
              .trim()
              .nullable()
              .required("To time is required"),
            lunchTime: Yup.string()
              .trim()
              .nullable()
              .required("Lunch time is required"),
            considerationCount: Yup.string()
              .trim()
              .nullable()
              .required("Late count is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = {
              id: shiftObject.id,
              shiftName: values.name,
              fromTime: values.fromTime,
              threshold: values.threshold,
              toTime: values.toTime,
              lunchTime: values.lunchTime,
              isNightShift: values.isNightShift,
              workingHours: values.workingHours,
              considerationCount: values.considerationCount,
              isDayDeduction: values.isDayDeduction,
              dayValueOfDeduction: values.dayValueOfDeduction,
              hourValueOfDeduction: values.hourValueOfDeduction
            };

            updateShift(requestData)
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
                      <Label>Shift Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter shift name"
                        name="name"
                        onChange={handleChange}
                        value={values.name}
                        invalid={errors.name ? true : false}
                      />
                      <FormFeedback>{errors.name}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label for="checkbox2">Is Night Shift?</Label>
                      <FormGroup check className="nightshiftlabel">
                        <Label check>
                          <Input
                            type="checkbox"
                            name="isNightShift"
                            defaultChecked={false}
                            onChange={() => {
                              setFieldValue(
                                "isNightShift",
                                !values.isNightShift
                              );
                            }}
                            checked={values.isNightShift ? true : false}
                            value={values.isNightShift}
                          />{" "}
                          Yes
                        </Label>
                      </FormGroup>
                      {/* </Col> */}
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>In Time</Label>
                      <Input
                        type="time"
                        placeholder="Enter In time"
                        name="fromTime"
                        onChange={handleChange}
                        value={values.fromTime}
                        invalid={errors.fromTime ? true : false}
                      />
                      <FormFeedback>{errors.fromTime}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Permissible  In Time</Label>
                      <Input
                        type="time"
                        placeholder="Enter Permissible  In Time"
                        name="threshold"
                        onChange={handleChange}
                        value={values.threshold}
                        invalid={errors.threshold ? true : false}
                      />
                      <FormFeedback>{errors.threshold}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Out Time</Label>
                      <Input
                        type="time"
                        placeholder="Enter Out time"
                        name="toTime"
                        onChange={handleChange}
                        onBlur={(e) => {
                          calculateTime(
                            {
                              isNightShift: values.isNightShift,
                              shiftFrom: values.fromTime,
                              shiftTo: values.toTime,
                            },
                            setFieldValue
                          );
                        }}
                        value={values.toTime}
                        invalid={errors.toTime ? true : false}
                      />
                      <FormFeedback>{errors.toTime}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Lunch Time</Label>
                      <Input
                        type="text"
                        placeholder="Enter lunch time in minutes"
                        name="lunchTime"
                        onChange={handleChange}
                        value={values.lunchTime}
                        invalid={errors.lunchTime ? true : false}
                      />
                      <FormFeedback>{errors.lunchTime}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Total Working Hours</Label>
                      <Input
                        type="text"
                        readOnly={true}
                        placeholder="Enter Total working Hours"
                        name="workingHours"
                        onChange={handleChange}
                        value={values.workingHours}
                        invalid={errors.workingHours ? true : false}
                      />
                      <FormFeedback>{errors.workingHours}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Permissible Late Count</Label>
                      <Input
                        type="text"
                        // readOnly={true}
                        placeholder="Enter Permissible Late Count"
                        name="considerationCount"
                        onKeyPress={(e) => {
                          OnlyEnterNumbers(e);
                        }}
                        onChange={handleChange}
                        value={values.considerationCount}
                        invalid={errors.considerationCount ? true : false}
                      />
                      <FormFeedback>{errors.considerationCount}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label>Deduction</Label>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="3">
                    <FormGroup>
                      <Label>
                        Deduction for
                        <span className="text-danger">*</span>
                      </Label>
                      <br />
                      <FormGroup className="gender nightshiftlabel">
                        <Label>
                          <input
                            name="isDayDeduction"
                            type="radio"
                            disabled={isDayRadio(values.considerationCount)}
                            // value={true}
                            checked={values.isDayDeduction === true ? true : false}
                            onChange={(v) => {
                              setFieldValue("isDayDeduction", true);
                              // this.getAlloCationData(v, setFieldValue, values);
                            }}
                            className="mr-1"
                          />
                          <span>Day </span>
                        </Label>
                        <Label className="ml-3">
                          <input
                            name="isDayDeduction"
                            type="radio"
                            disabled={isDayRadio(values.considerationCount)}
                            // value={false}
                            checked={values.isDayDeduction === true ? false : true}
                            onChange={(v) => {
                              setFieldValue("isDayDeduction", false);
                              // this.getAlloCationData(v, setFieldValue, values);
                            }}
                            className="mr-1"
                          />
                          <span>Hour</span>
                        </Label>
                      </FormGroup>
                      <span className="text-danger">
                        {errors.isDayDeduction && "Select Option?"}
                      </span>
                    </FormGroup>
                  </Col>
                  {console.log(values)}
                  {values.isDayDeduction == true ? (
                    <Col md="4">
                      <FormGroup>
                        <Label>
                          Deduction for Days
                          <span className="text-danger">*</span>
                        </Label>
                        <br />
                        <FormGroup className="gender nightshiftlabel">
                          <Row>
                            <Label>
                              <input
                                name="dayValueOfDeduction"
                                type="radio"
                                // value={true}
                                checked={values.dayValueOfDeduction === "quarter"}
                                onChange={(v) => {
                                  setFieldValue(
                                    "dayValueOfDeduction",
                                    "quarter"
                                  );
                                  // this.getAlloCationData(
                                  //   v,
                                  //   setFieldValue,
                                  //   values
                                  // );
                                }}
                                className="mr-1"
                              />
                              <span>Quarter</span>
                            </Label>
                          </Row>
                          <Row>
                            <Row>
                              <Label className="ml-3">
                                <input
                                  name="dayValueOfDeduction"
                                  type="radio"
                                  // value={false}
                                  // checked={values.dayValueOfDeduction === true ? false : true}
                                  checked={values.dayValueOfDeduction === "half"}

                                  onChange={(v) => {
                                    setFieldValue(
                                      "dayValueOfDeduction",
                                      "half"
                                    );
                                    // this.getAlloCationData(
                                    //   v,
                                    //   setFieldValue,
                                    //   values
                                    // );
                                  }}
                                  className="mr-1"
                                />
                                <span>Half</span>
                              </Label>
                            </Row>
                          </Row>
                          <Row>
                            <Row>
                              <Label className="ml-3">
                                <input
                                  name="dayValueOfDeduction"
                                  type="radio"
                                  // value={false}
                                  // checked={values.dayValueOfDeduction === true ? false : true}
                                  checked={values.dayValueOfDeduction === "full"}

                                  onChange={(v) => {
                                    setFieldValue(
                                      "dayValueOfDeduction",
                                      "full"
                                    );
                                    // this.getAlloCationData(
                                    //   v,
                                    //   setFieldValue,
                                    //   values
                                    // );
                                  }}
                                  className="mr-1"
                                />
                                <span>Full</span>
                              </Label>
                            </Row>
                          </Row>
                        </FormGroup>
                        <span className="text-danger">
                          {errors.dayValueOfDeduction && "Select Option?"}
                        </span>
                      </FormGroup>
                    </Col>
                  ) : null}
                  {values.isDayDeduction == false ? (
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Label>Deduction for Hours</Label>
                          <Input
                            type="text"
                            // readOnly={true}
                            placeholder="Enter Late Count"
                            name="hourValueOfDeduction"
                            onChange={handleChange}
                            value={values.hourValueOfDeduction}
                            invalid={errors.hourValueOfDeduction ? true : false}
                          />
                          <FormFeedback>
                            {errors.hourValueOfDeduction}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : null}
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

      {/* Shift Assign Modal */}
      <Modal
        className="modal-lg p-2"
        isOpen={assignModalShow}
        toggle={() => {
          onAssignModalShow(false);
        }}
      >
        <ModalHeader
          className="p-2 modalheadernew"
          toggle={() => {
            onAssignModalShow(false);
          }}
        >
          Shift Assign
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            fromDate: "",
            toDate: "",
            employeeIds: "",
            shiftId: "",
          }}
          validationSchema={Yup.object().shape({
            // employeeIds: Yup.string()
            //   .trim()
            //   .nullable()
            //   .required("Employee name is required"),
            shiftId: Yup.object().nullable().required("Shift is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            console.log({ values });
            setStatus();
            setIsLoading(true);

            let employeeIds = values.employeeIds.map((v, i) => v.value);
            console.log({ employeeIds });

            let requestData = {
              fromDate: moment(values.fromDate).format("YYYY-MM-DD"),
              toDate: moment(values.toDate).format("YYYY-MM-DD"),
              employeeIds: employeeIds.toString(),
              shiftId: values.shiftId.value,
            };

            shiftAssignToEmployee(requestData)
              .then((response) => {
                setIsLoading(false);
                if (response.data.responseStatus === 200) {
                  setSubmitting(false);
                  toast.success("✔ " + response.data.message);
                  resetForm();
                  onAssignModalShow(false);
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
                      <Label for="exampleDatetime">
                        Select From Date <span className="text-danger">*</span>
                      </Label>
                      <MyDatePicker
                        autoComplete="off"
                        className="datepic form-control"
                        name="fromDate"
                        placeholderText="dd/MM/yyyy"
                        id="fromDate"
                        dateFormat="dd/MM/yyyy"
                        onChange={(e) => {
                          console.log("date ", e);
                          setFieldValue("fromDate", e);
                        }}
                        value={values.fromDate}
                        selected={values.fromDate}
                        maxDate={new Date()}
                      />
                      <span className="text-danger">{errors.fromDate}</span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Select To Date <span className="text-danger">*</span>
                      </Label>
                      <MyDatePicker
                        autoComplete="off"
                        className="datepic form-control"
                        name="toDate"
                        placeholderText="dd/MM/yyyy"
                        id="toDate"
                        dateFormat="dd/MM/yyyy"
                        onChange={(e) => {
                          console.log("date ", e);
                          setFieldValue("toDate", e);
                        }}
                        value={values.toDate}
                        selected={values.toDate}
                        maxDate={new Date()}
                      />
                      <span className="text-danger">{errors.toDate}</span>
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label style={{ marginBottom: "0px" }} htmlFor="level">
                        Employee Shifts
                      </Label>

                      <Select
                        ////isClearable={true}
                        styles={{
                          clearIndicator: ClearIndicatorStyles,
                        }}
                        onChange={(v) => {
                          setFieldValue("shiftId", v);
                        }}
                        name="shiftId"
                        options={Shift_op}
                        value={values.shiftId}
                      />

                      <span className="text-danger">
                        {errors.shiftId && "Please select Percentage Of."}
                      </span>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <Label style={{ marginBottom: "0px" }} htmlFor="level">
                        Employee Name
                      </Label>
                      <Select
                        isMulti={true}
                        ////isClearable={true}
                        styles={{
                          clearIndicator: ClearIndicatorStyles,
                        }}
                        onChange={(v) => {
                          setFieldValue("employeeIds", v);
                        }}
                        name="employeeIds"
                        options={Emp_op}
                        value={values.employeeIds}
                      />

                      <span className="text-danger">
                        {errors.employeeIds && "Please select Percentage Of."}
                      </span>
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
                    Assigning...
                  </Button>
                ) : (
                  <Button type="submit" className="mainbtn1 text-white">
                    Assign
                  </Button>
                )}

                <Button
                  className="modalcancelbtn"
                  type="button"
                  onClick={() => {
                    onAssignModalShow(null);
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

export default WithUserPermission(Shift);
