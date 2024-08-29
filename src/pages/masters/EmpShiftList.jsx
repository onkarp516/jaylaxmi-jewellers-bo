import React, { Component } from "react";
import GridTable from "@nadavshaar/react-grid-table";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import moment from "moment";
import {
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  FormFeedback,
  Label,
  Row,
  Col,
  Spinner,
  CustomInput,
} from "reactstrap";
import { MyDatePicker } from "@/helpers";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";
import {
  isWriteAuthorized,
  getHeader,
  CustomDTHeader,
  WithUserPermission,
  isActionExist,
} from "@/helpers";
import { DTShiftAssignUrl } from "@/services/api";
import {
  createPayhead,
  payheadList,
  findPayhead,
  updatePayhead,
  deletePayhead,
  deleteEmployeeShiftAssign,
  findEmployeeShift,
  listOfShifts,
  updateEmployeeShift,
} from "@/services/api_function";

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
        isActionExist("shift-assign-to-employee", "edit", userPermissions) && (
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
      {isActionExist("shift-assign-to-employee", "delete", userPermissions) && (
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

class EmpShiftList extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.state = {
      refresh: true,
      addModalShow: false,
      editModalShow: false,
      isLoading: false,
      currentIndex: 0,
      getShiftListTable: [],
      shiftObject: "",
      payheadOpt: [],
      phOptions: [],
      shiftList: [],
      selectedShift: "",
    };
  }
  setTableManager = (tm) => (this.tableManager.current = tm);
  addBtn = isWriteAuthorized("master", "designationPermission") &&
    isActionExist(
      "shift-assign-to-employee",
      "create",
      this.props.userPermissions
    ) && (
      <>
        <button
          title="CREATE"
          onClick={(e) => {
            e.preventDefault();
            this.props.history.push("/master/employeeShift");
          }}
        >
          <i className="fa fa-plus"></i>
        </button>
      </>
    );

  getPayheadOptions = () => {
    payheadList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let selectOptions = response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.payheadName,
            };
          });
          this.setState({
            payheadOpt: selectOptions,
            phOptions: selectOptions,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  onRowsRequest = async (requestData, tableManager) => {
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
    };
    const response = await axios({
      url: DTShiftAssignUrl(),
      method: "POST",
      headers: getHeader(),
      data: JSON.stringify(req),
    })
      .then((response) => response.data)
      .catch((e) => {
        console.log("e--->", e);
      });

    console.log("response==---->>>>", response.rows);
    if (!response?.rows) return;

    return {
      rows: response.rows,
      totalRows: response.totalRows,
    };
  };

  onAddModalShow = (status) => {
    this.setState({ payheadOpt: this.state.phOptions, addModalShow: status });
  };

  onEditModalShow = (status, id, rowIndex) => {
    if (status) {
      this.setState({ currentIndex: rowIndex });
      let reqData = new FormData();
      reqData.append("id", id);
      findEmployeeShift(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            this.setState({
              shiftObject: response.data.response,
              selectedShift: response.data.response.shiftId,
              currentIndex: 0,
              editModalShow: status,
            });
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          console.log("errors", error);
        });
    } else {
      this.setState({ currentIndex: 0, editModalShow: status });
    }
  };

  handleShiftSelection = (shiftId, status, setFieldValue) => {
    console.log({ shiftId });
    if (status) {
      this.setState({ selectedShift: shiftId });
      setFieldValue("shiftId", shiftId);
    } else {
      this.setState({ selectedShift: "" });
    }
  };

  getShiftOptions = () => {
    listOfShifts()
      .then((response) => {
        console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;

          this.setState({ shiftList: res.response });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  onDeleteModalShow = (id) => {
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

      let reqData = new FormData();
      reqData.append("id", id);
      deleteEmployeeShiftAssign(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            toast.success("✔ " + response.data.message);
            this.tableManager.current.asyncApi.resetRows();
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          toast.error("✘ " + error);
        });
    });
  };

  componentDidMount() {
    this.getPayheadOptions();
    this.getShiftOptions();
  }

  render() {
    const columns = [
      {
        id: "from_date",
        field: "fromDate",
        label: "From Date",
        resizable: true,
      },
      {
        id: "to_date",
        field: "toDate",
        label: "To Date",
        resizable: true,
      },
      {
        id: "shift_name",
        field: "shiftName",
        label: "Shift Name",
        resizable: true,
      },
      {
        id: "employee_name",
        field: "employeeName",
        label: "Employee Name",
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

    const {
      payheadOpt,
      addModalShow,
      editModalShow,
      isLoading,
      shiftObject,
      currentIndex,
      getShiftListTable,
      shiftList,
      selectedShift,
    } = this.state;
    let { userPermissions } = this.props;
    return (
      <div>
        <>
          <GridTable
            components={{ Header: CustomDTHeader }}
            columns={columns}
            onRowsRequest={this.onRowsRequest}
            onRowClick={(
              { rowIndex, data, column, isEdit, event },
              tableManager
            ) => !isEdit}
            minSearchChars={0}
            additionalProps={{
              header: {
                label: "Employee Shift List",
                addBtn: this.addBtn,
                currentIndex: currentIndex,
                onEditModalShow: this.onEditModalShow.bind(this),
                onDeleteModalShow: this.onDeleteModalShow.bind(this),
                userPermissions: userPermissions,
              },
            }}
            onLoad={this.setTableManager.bind(this)}
          />
        </>

        {/* Edit Modal */}
        <Modal
          className="modal-lg p-2"
          isOpen={editModalShow}
          toggle={() => {
            this.onEditModalShow(null);
          }}
        >
          <ModalHeader
            className="modalheadernew p-2"
            toggle={() => {
              this.onEditModalShow(null);
            }}
          >
            Update Shift
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={{
              employeeId: shiftObject != null ? shiftObject.employeeId : "",
              employeeName: shiftObject != null ? shiftObject.employeeName : "",
              fromDate:
                shiftObject != null ? new Date(shiftObject.fromDate) : "",
              toDate: shiftObject != null ? new Date(shiftObject.toDate) : "",
              shiftId: shiftObject != null ? shiftObject.shiftId : "",
            }}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();

              let reqData = new FormData();
              reqData.append("id", shiftObject.id);
              reqData.append("employeeId", values.employeeId);
              reqData.append("employeeName", values.employeeName);
              reqData.append(
                "fromDate",
                moment(values.fromDate).format("YYYY-MM-DD")
              );
              reqData.append(
                "toDate",
                moment(values.toDate).format("YYYY-MM-DD")
              );
              reqData.append("shiftId", values.shiftId);

              this.setState({ isLoading: true });
              updateEmployeeShift(reqData)
                .then((response) => {
                  if (response.data.responseStatus === 200) {
                    setSubmitting(false);
                    toast.success("✔ " + response.data.message);
                    resetForm();
                    this.setState({ editModalShow: false, isLoading: false });
                    console.log("tableManager", this.tableManager);
                    this.tableManager.current.asyncApi.resetRows();
                  } else {
                    setSubmitting(false);
                    toast.error("✘ " + response.data.message);
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
              <Form autoComplete="off" onSubmit={handleSubmit}>
                <ModalBody className="p-2">
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>Employee Name</Label>
                        <Input
                          type="text"
                          name="employeeName"
                          onChange={handleChange}
                          value={values.employeeName}
                          invalid={errors.employeeName ? true : false}
                          autoFocus={true}
                          readOnly
                        />
                        <FormFeedback>{errors.employeeName}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col lg="3" md="3">
                      <Label className="formlabelsize">From Date</Label>
                      <MyDatePicker
                        className="datepic form-control"
                        name="fromDate"
                        placeholderText="dd/MM/yyyy"
                        id="fromDate"
                        dateFormat="dd/MM/yyyy"
                        value={values.fromDate}
                        onChange={(date) => {
                          setFieldValue("fromDate", date);
                        }}
                        selected={values.fromDate}
                      />
                      <span className="text-danger errormsg">
                        {errors.fromDate}
                      </span>
                    </Col>
                    <Col lg="3" md="3">
                      <Label className="formlabelsize">To Date</Label>
                      <MyDatePicker
                        className="datepic form-control"
                        name="toDate"
                        placeholderText="dd/MM/yyyy"
                        id="toDate"
                        dateFormat="dd/MM/yyyy"
                        value={values.toDate}
                        onChange={(date) => {
                          setFieldValue("toDate", date);
                        }}
                        selected={values.toDate}
                      />
                      <span className="text-danger errormsg">
                        {errors.toDate}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      {/* {JSON.stringify(shiftList)} */}
                      <Label className="formlabelsize">Shift</Label>
                      <Form inline>
                        {shiftList.length > 0 &&
                          shiftList.map((value, i) => {
                            return (
                              <div className="form-check form-check-inline">
                                <CustomInput
                                  type="radio"
                                  id={`shiftId` + i}
                                  name="shiftId"
                                  label={value.name}
                                  value={value.id}
                                  checked={
                                    selectedShift == value.id ? true : false
                                  }
                                  onChange={(e) => {
                                    console.log(
                                      "e.target.checked ",
                                      e.target.checked
                                    );
                                    this.handleShiftSelection(
                                      value.id,
                                      e.target.checked,
                                      setFieldValue
                                    );
                                  }}
                                />
                              </div>
                            );
                          })}
                      </Form>
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
                      this.onEditModalShow(null);
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
}

export default WithUserPermission(EmpShiftList);
