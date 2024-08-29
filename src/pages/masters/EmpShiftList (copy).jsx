import React, { Component } from "react";
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
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import Select, { components } from "react-select";
import {
  isWriteAuthorized,
  isReadAuthorized,
  getHeader,
  CustomDTHeader,
  getSelectValue,
} from "@/helpers";
import { DTShiftAssignUrl } from "@/services/api";
import {
  createPayhead,
  payheadList,
  findPayhead,
  updatePayhead,
  deletePayhead,
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
}) => {
  const { additionalProps } = tableManager.config;
  const { header } = additionalProps;
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
      payheadObject: "",
      payheadOpt: [],
      phOptions: [],
    };
  }
  setTableManager = (tm) => (this.tableManager.current = tm);
  addBtn = isWriteAuthorized("master", "designationPermission") && (
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
      let reqData = {
        id: id,
      };
      findPayhead(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            let result = response.data.response;
            let options = this.state.payheadOpt;
            let ph_opt = getSelectValue(options, result.payheadParentId);
            result.payheadId = ph_opt;
            let final_state = options.filter((item) => item.value != result.id);
            this.setState({
              payheadOpt: final_state,
              payheadObject: result,
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

      let reqData = {
        id: id,
      };
      deletePayhead(reqData)
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
    // this.letShiftAssignList();
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
    ];

    const {
      payheadOpt,
      addModalShow,
      editModalShow,
      isLoading,
      payheadObject,
      currentIndex,
      getShiftListTable,
    } = this.state;

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
                // onEditModalShow: this.onEditModalShow.bind(this),
                // onDeleteModalShow: this.onDeleteModalShow.bind(this),
              },
            }}
            onLoad={this.setTableManager.bind(this)}
          />
        </>
        {/* Add Modal */}
        <Modal
          className="modal-lg p-2"
          isOpen={addModalShow}
          toggle={() => {
            this.onAddModalShow(null);
          }}
        >
          <ModalHeader
            className="modalheadernew p-2"
            toggle={() => {
              this.onAddModalShow(null);
            }}
          >
            Create Payhead
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={{
              name: "",
              percentage: "",
              payheadId: "",
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().nullable().trim().required("Name is required"),
              percentage: Yup.string()
                .nullable()
                .trim()
                .required("Percentage is required"),
              payheadId: Yup.object().required("Select Payhead"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              let requestData = {
                payheadName: values.name,
                percentage: values.percentage,
                payheadId: values.payheadId.value,
              };

              createPayhead(requestData)
                .then((response) => {
                  if (response.data.responseStatus === 200) {
                    setSubmitting(false);
                    toast.success("✔ " + response.data.message);
                    resetForm();
                    this.onAddModalShow(false);

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
                        <Label>Name</Label>
                        <Input
                          type="text"
                          placeholder="Enter Name"
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
                        <Label>Percentage(%)</Label>
                        <Input
                          type="text"
                          placeholder="Enter Percentage(%)"
                          name="percentage"
                          onChange={handleChange}
                          value={values.percentage}
                          invalid={errors.percentage ? true : false}
                        />
                        <FormFeedback>{errors.percentage}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label style={{ marginBottom: "0px" }} htmlFor="level">
                          Percentage Of
                        </Label>

                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("payheadId", v);
                          }}
                          name="payheadId"
                          options={payheadOpt}
                          value={values.payheadId}
                        />

                        <span className="text-danger">
                          {errors.payheadId && "Please select Percentage Of."}
                        </span>
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
                      this.onAddModalShow(null);
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
            this.onEditModalShow(null);
          }}
        >
          <ModalHeader
            className="modalheadernew p-2"
            toggle={() => {
              this.onEditModalShow(null);
            }}
          >
            Update Payhead
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={{
              name: payheadObject != null ? payheadObject.name : "",
              percentage: payheadObject != null ? payheadObject.percentage : "",
              payheadId: payheadObject != null ? payheadObject.payheadId : "",
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().trim().required("Name is required"),
              percentage: Yup.string()
                .trim()
                .required("Percentage is required"),
              payheadId: Yup.object().required("Select Payhead"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              let requestData = {
                id: payheadObject.id,
                payheadName: values.name,
                percentage: values.percentage,
                payheadId: values.payheadId.value,
              };

              this.setState({ isLoading: true });
              updatePayhead(requestData)
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
                        <Label>Name</Label>
                        <Input
                          type="text"
                          placeholder="Enter Name"
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
                        <Label>Percentage(%)</Label>
                        <Input
                          type="text"
                          placeholder="Enter Percentage(%)"
                          name="percentage"
                          onChange={handleChange}
                          value={values.percentage}
                          invalid={errors.percentage ? true : false}
                        />
                        <FormFeedback>{errors.percentage}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label style={{ marginBottom: "0px" }} htmlFor="level">
                          Percentage Of
                        </Label>

                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("payheadId", v);
                          }}
                          name="payheadId"
                          options={payheadOpt}
                          value={values.payheadId}
                        />
                        <span className="text-danger">
                          {errors.payheadId && "Please select Percentage Of."}
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

export default EmpShiftList;
