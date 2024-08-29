import React, { useState, useEffect, useDebugValue } from "react";
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
  Table,
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
} from "@/helpers";
import {
  createShift,
  findShift,
  updateShift,
  deleteShift,
  listOfEmployee,
  listOfShifts,
  employeeWiseShiftAssign,
} from "@/services/api_function";
import { DTShiftsUrl } from "@/services/api";

import axios from "axios";
const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

export default function EmpShift(props) {
  const [Shift_op, setShift_op] = useState([]);
  const [Emp_op, setEmp_op] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(0);
  const setTableManager = (tm) => (tableManager.current = tm);
  const [empShiftAssignModalShow, setEmpShiftAssignModalShow] = useState(false);
  const tableManager = React.useRef(null);

  const columns = [
    {
      id: "from_date",
      field: "fromDate",
      className: "customcolumn",
      label: "From Date",
      resizable: true,
    },

    {
      id: "to_date",
      field: "toDate",
      label: "To Date",
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

      // cellRenderer: ActionsCellRender,
    },
  ];

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

  const getEmpOptions = () => {
    listOfEmployee()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;

          let opt = result.map(function (data) {
            return {
              ...data,
              shiftId: "",
            };
          });
          setEmp_op(opt);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getEmpOptions();
    getShiftOptions();
  }, []);

  const addBtn = isWriteAuthorized("master", "designationPermission") && (
    <>
      <button
        title="CREATE"
        onClick={(e) => {
          e.preventDefault();
          onEmpShiftAssignModalShow(true);
        }}
      >
        Emp Shift
      </button>
    </>
  );

  const onEmpShiftAssignModalShow = (status) => {
    setEmpShiftAssignModalShow(status);
  };

  const handleShiftChange = (v, index) => {
    let opt = Emp_op.map(function (data, i) {
      if (index == i) {
        return {
          ...data,
          shiftId: v,
        };
      } else {
        return {
          ...data,
        };
      }
    });
    setEmp_op(opt);
  };

  return (
    <div>
      {(isReadAuthorized("master", "designationPermission") ||
        isWriteAuthorized("master", "designationPermission")) && (
        <GridTable
          components={{ Header: CustomDTHeader }}
          columns={columns}
          // onRowsRequest={onRowsRequest}
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
            },
          }}
          onLoad={setTableManager}
        />
      )}

      {/*Employee Shift Assign */}

      <Modal
        className="modal-lg p-2"
        isOpen={empShiftAssignModalShow}
        toggle={() => {
          onEmpShiftAssignModalShow(false);
        }}
      >
        <ModalHeader
          className="p-2 modalheadernew"
          toggle={() => {
            onEmpShiftAssignModalShow(false);
          }}
        >
          Employee Shift Assigning
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            fromDate: "",
            toDate: "",
          }}
          validationSchema={Yup.object().shape({})}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            console.log({ values });
            setStatus();
            setIsLoading(true);
            console.log("Emp_op", { Emp_op });
            let frow = [];
            Emp_op.map((v, i) => {
              if (v.id != "" && v.shiftId != "") {
                frow.push({
                  employeeId: v.id,
                  shiftId: v.shiftId.value,
                });
              }
            });
            console.log("frow", frow);

            let requestData = {
              fromDate: values.fromDate,
              toDate: values.toDate,
              rows: JSON.stringify(frow),
            };

            employeeWiseShiftAssign(requestData)
              .then((response) => {
                setIsLoading(false);
                if (response.data.responseStatus === 200) {
                  setSubmitting(false);
                  toast.success("✔ " + response.data.message);
                  resetForm();
                  onEmpShiftAssignModalShow(false);
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

            setIsLoading(false);
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
              {/* {JSON.stringify(errors)} */}
              <ModalBody>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Select From Date <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="date"
                        name="fromDate"
                        id="fromDate"
                        onChange={handleChange}
                        value={values.fromDate}
                        invalid={errors.fromDate ? true : false}
                      />
                      <FormFeedback>{errors.toDate}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label for="exampleDatetime">
                        Select To Date <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="date"
                        name="toDate"
                        id="toDate"
                        onChange={handleChange}
                        value={values.toDate}
                        invalid={errors.toDate ? true : false}
                      />
                      <FormFeedback>{errors.toDate}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Table>
                    <thead>
                      <tr>
                        <th>Employee Name</th>
                        <th>Shift Name</th>
                      </tr>
                    </thead>
                    {/* {JSON.stringify(Emp_op)} */}

                    <tbody>
                      {Emp_op &&
                        Emp_op.map((value, key) => {
                          return (
                            <>
                              <tr key={key}>
                                <td>{value.employeeName}</td>
                                <td>
                                  <Select
                                    ////isClearable={true}
                                    styles={{
                                      clearIndicator: ClearIndicatorStyles,
                                    }}
                                    onChange={(v) => {
                                      handleShiftChange(v, key);
                                    }}
                                    name={`shiftId` + key}
                                    id={`shiftId` + key}
                                    options={Shift_op}
                                    value={value.shiftId}
                                  />
                                </td>
                              </tr>
                            </>
                          );
                        })}
                    </tbody>
                  </Table>
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
                    onEmpShiftAssignModalShow(null);
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
