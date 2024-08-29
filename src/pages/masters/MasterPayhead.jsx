import React, { Component } from "react";
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
import { DTMasterPayheadUrl } from "@/services/api";
import {
  payheadList,
  findMasterPayhead,
  updatePayhead,
  deletePayhead,
  listOfCompany,
  createMasterPayhead,
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

class MasterPayhead extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.state = {
      refresh: true,
      addMasterPayhead: false,
      addModalShow: false,
      editModalShow: false,
      isLoading: false,
      currentIndex: 0,

      payheadObject: "",
      payheadOpt: [],
      phOptions: [],
      companyOpt: [],
    };
  }
  setTableManager = (tm) => (this.tableManager.current = tm);
  addBtn = isWriteAuthorized("master", "designationPermission") && (
    <>
      <button
        title="CREATE"
        onClick={(e) => {
          e.preventDefault();
          this.onAddModalShow(true);
        }}
      >
        <i className="fa fa-plus"></i>
      </button>
    </>
  );

  getCompanyOptions = () => {
    listOfCompany()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt = result.map(function (data) {
            return {
              value: data.id,
              label: data.companyName,
            };
          });
          opt.push({
            value: 0,
            label: "Both",
          });
          this.setState({ companyOpt: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

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
      url: DTMasterPayheadUrl(),
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

  onAddModalShow = (status) => {
    this.setState({ payheadOpt: this.state.phOptions, addModalShow: status });
  };

  onEditModalShow = (status, id, rowIndex) => {
    if (status) {
      this.setState({ currentIndex: rowIndex });
      let reqData = {
        id: id,
      };
      findMasterPayhead(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            let result = response.data.response;
            let options = this.state.companyOpt;
            let cp_opt = getSelectValue(options, result.companyId);
            result.companyId = cp_opt;
            this.setState({
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
    this.getCompanyOptions();
  }

  render() {
    const columns = [
      {
        id: "name",
        field: "name",
        label: "Payhead Name",
        resizable: true,
      },
      {
        id: "employer_per",
        field: "employerPer",
        label: "Employer %",
        resizable: true,
      },
      {
        id: "employee_per",
        field: "employeePer",
        label: "Employee %",
        resizable: true,
      },
      {
        id: "company_name",
        field: "companyName",
        label: "Company Name",
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

    const {
      payheadOpt,
      addModalShow,
      editModalShow,
      isLoading,
      payheadObject,
      currentIndex,
      companyOpt,
      addMasterPayhead,
    } = this.state;

    return (
      <div>
        {(isReadAuthorized("master", "designationPermission") ||
          isWriteAuthorized("master", "designationPermission")) && (
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
                  label: "Master Payheads",
                  addBtn: this.addBtn,
                  currentIndex: currentIndex,
                  onEditModalShow: this.onEditModalShow.bind(this),
                  onDeleteModalShow: this.onDeleteModalShow.bind(this),
                },
              }}
              onLoad={this.setTableManager.bind(this)}
            />
          </>
        )}
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
            Create Master Payhead
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={{
              masterPayheadName: "",
              erPercentage: "",
              eePercentage: "",
              companyId: "",
              payheadId: "",
            }}
            validationSchema={Yup.object().shape({
              masterPayheadName: Yup.string()
                .nullable()
                .trim()
                .required("Master Payhead Name is required"),

              erPercentage: Yup.string()
                .nullable()
                .trim()
                .required("Employer % is required"),
              eePercentage: Yup.string()
                .nullable()
                .trim()
                .required("Employee % is required"),
              companyId: Yup.object().required("Select Company"),
              payheadId: Yup.object().required("Select Payhead"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();

              let requestData = {
                name: values.masterPayheadName,
                employerPer: values.erPercentage,
                employeePer: values.eePercentage,
                companyId: values.companyId.value,
                payheadId: values.payheadId.value,
              };

              createMasterPayhead(requestData)
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
                    <Col md="3">
                      <FormGroup>
                        <Label>Name</Label>
                        <Input
                          type="text"
                          placeholder="Enter Name"
                          name="masterPayheadName"
                          onChange={handleChange}
                          value={values.masterPayheadName}
                          invalid={errors.masterPayheadName ? true : false}
                        />
                        <FormFeedback>{errors.masterPayheadName}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label>Employer %</Label>
                        <Input
                          type="text"
                          placeholder="Employer %"
                          name="erPercentage"
                          onChange={handleChange}
                          value={values.erPercentage}
                          invalid={errors.erPercentage ? true : false}
                        />
                        <FormFeedback>{errors.erPercentage}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label>Employee %</Label>
                        <Input
                          type="text"
                          placeholder="Employee %"
                          name="eePercentage"
                          onChange={handleChange}
                          value={values.eePercentage}
                          invalid={errors.eePercentage ? true : false}
                        />
                        <FormFeedback>{errors.eePercentage}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label style={{ marginBottom: "0px" }} htmlFor="level">
                          Select Company
                        </Label>

                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("companyId", v);
                          }}
                          name="companyId"
                          options={companyOpt}
                          value={values.companyId}
                        />

                        <span className="text-danger">
                          {errors.companyId && "Please select company"}
                        </span>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3">
                      <FormGroup>
                        <Label style={{ marginBottom: "0px" }} htmlFor="level">
                          Select Payhead
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
              masterPayheadName:
                payheadObject != null ? payheadObject.name : "",
              erPercentage:
                payheadObject != null ? payheadObject.employerPer : "",
              eePercentage:
                payheadObject != null ? payheadObject.employeePer : "",
              companyId: payheadObject != null ? payheadObject.companyId : "",
            }}
            validationSchema={Yup.object().shape({
              masterPayheadName: Yup.string()
                .nullable()
                .trim()
                .required("Master Payhead Name is required"),

              erPercentage: Yup.string()
                .nullable()
                .trim()
                .required("Employer % is required"),
              eePercentage: Yup.string()
                .nullable()
                .trim()
                .required("Employee % is required"),
              companyId: Yup.object().required("Select Company"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              let requestData = {
                id: values.payheadObject.id,
                name: values.masterPayheadName,
                employerPer: values.erPercentage,
                employeePer: values.eePercentage,
                companyId: values.companyId.value,
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
                    <Col md="3">
                      <FormGroup>
                        <Label>Name</Label>
                        <Input
                          type="text"
                          placeholder="Enter Name"
                          name="masterPayheadName"
                          onChange={handleChange}
                          value={values.masterPayheadName}
                          invalid={errors.masterPayheadName ? true : false}
                        />
                        <FormFeedback>{errors.masterPayheadName}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label>Employer %</Label>
                        <Input
                          type="text"
                          placeholder="Employer %"
                          name="erPercentage"
                          onChange={handleChange}
                          value={values.erPercentage}
                          invalid={errors.erPercentage ? true : false}
                        />
                        <FormFeedback>{errors.erPercentage}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label>Employee %</Label>
                        <Input
                          type="text"
                          placeholder="Employee %"
                          name="eePercentage"
                          onChange={handleChange}
                          value={values.eePercentage}
                          invalid={errors.eePercentage ? true : false}
                        />
                        <FormFeedback>{errors.eePercentage}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label style={{ marginBottom: "0px" }} htmlFor="level">
                          Select Company
                        </Label>

                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("companyId", v);
                          }}
                          name="companyId"
                          options={companyOpt}
                          value={values.companyId}
                        />

                        <span className="text-danger">
                          {errors.companyId && "Please select Percentage Of."}
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

export default MasterPayhead;
