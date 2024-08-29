import React, { Component, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import moment from "moment";
import {
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
  FormFeedback,
  Row,
  Col,
  Spinner,
  FormGroup,
  Label,
  Button,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import Swal from "sweetalert2";

import Select, { components } from "react-select";
import Table from "react-bootstrap/Table";
import Paper from "@material-ui/core/Paper";
import { Badge } from "reactstrap";

import {
  listOfEmployee,
  getSalaryReportMonthWise,
  exportEmployeeAttendanceReport,
  getAllocationList,
  getPayheadList,
  findAllocation,
  updateAllocation,
  deleteAllocation,
  ManualAttendanceReport,
} from "@/services/api_function";

import {
  getHeader,
  WithUserPermission,
  isActionExist,
  MyDatePicker,
} from "@/helpers";

import {
  exportEmployeeAttendanceReportUrl,
  downloadReceiptUrl,
  getEmployeeSalaryReportInExcelUrl,
} from "@/services/api";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { date } from "yup/lib/locale";
import { CloseButton } from "react-bootstrap";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

class AllocationsList extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.state = {
      isLoading: true,
      empOpt: [],
      allocationData: [],
      breakInnerData: "",
      mainData: "",
      attendanceDate: moment(new Date()).format("YYYY-MM"),
      secureData: JSON.parse(localStorage.getItem("loginUser")),
      editModal: false,
      allocations: [{}],
      allowanceObject: "",
      currentIndex: 0,
      fromDate: "",
    };
  }

  ManualAttendanceReport = () => {
    console.log("ManualAttendanceReport");
    console.log(moment(new Date()).format("YYYY-MM-DD"));

    let requestData = {
      // fromMonth: moment(values.fromDate).format("YYYY-MM-DD"),
      fromMonth: this.state.attendanceDate,
      employeeId: "all",
    };
    ManualAttendanceReport(requestData)
      .then((response) => {
        // resetForm();
        var result = response.data;
        console.log({ result });
        console.log("resultA.response", result);
        if (result.responseStatus == 200) {
          console.log("200");
          // setSubmitting(false);
          this.setState({
            isLoading: true,
            allocationData: result.response,
          });

          //   if (result.response.length == 0) {
          //     toast.error("✘ No Task Data Found");
          //   }
        } else {
          // setSubmitting(false);
          //   this.setState({ isLoading: false, allocationData: [] });
          toast.error("✘ No Data Found");
        }
      })
      .catch((error) => {
        setSubmitting(false);
        toast.error("✘ " + error);
      });
  };

  getAlloCationDataDefault = () => {
    getPayheadList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.data;
          console.log(res);
          this.setState({ allocations: result });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  getEmpOptions = () => {
    listOfEmployee()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        // if (res.responseStatus == 200) {
        //   let result = res.response;
        //   console.log(res.response);

        //   let opt = result.map(function (data) {
        //     return {
        //       value: data.id,
        //       label: data.employeeName,
        //     };
        //   });
        //   this.setState({ empOpt: opt });
        // }

        if (res.responseStatus == 200) {
          let result = res.response;
          let opt = [
            {
              value: "all",
              label: "All",
            },
          ];
          result.map(function (data) {
            opt.push({
              value: data.id,
              label: data.employeeName,
            });
          });
          console.log(opt);
          this.setState({ empOpt: opt });
          //   , () => {
          //   this.formRef.current.setFieldValue("employeeId", opt[0]);
          // });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  onEditModalShow = (idOfRec) => {
    // setEditModal(true);
    console.log(idOfRec);

    let reqData = {
      id: idOfRec,
    };
    findAllocation(reqData)
      .then((response) => {
        if (response.data.responseStatus == 200) {
          this.setState({ allowanceObject: response.data.response });
          this.setState({ currentIndex: 0 });
          this.setState({ editModal: true });
        } else {
          toast.error("✘ " + response.data.message);
        }
      })
      .catch((error) => {
        console.log("errors", error);
      });
  };

  getReport = (values) => {
    let filename =
      "emp_salary_report" + moment().format("YYYY-MM-DD HH:MM:ss") + ".xlsx";

    const requestOption = {
      method: "GET",
      headers: getHeader(),
    };

    return fetch(
      getEmployeeSalaryReportInExcelUrl(
        values.employeeId.value == undefined ? "all" : values.employeeId.value,
        moment(values.fromMonth).format("YYYY-MM")
      ),
      requestOption
    )
      .then((response) => response.blob())
      .then((blob) => {
        s;
        // 1. Convert the data into 'blob'
        console.log({ blob });

        if (blob.size > 0) {
          // 2. Create blob link to download
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${filename}`);
          // 3. Append to html page
          document.body.appendChild(link);
          // 4. Force download
          link.click();
          // 5. Clean up and remove the link
          link.parentNode.removeChild(link);
          return true;
        } else {
          console.warn("Data Not Found");
          toast.error("✘ No Data Found");
        }
      });
  };

  componentDidMount() {
    this.getEmpOptions();
    // this.ManualAttendanceReport();
    // this.getAlloCationDataDefault();
  }

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
      deleteAllocation(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            toast.success("✔ " + response.data.message);
            // tableManager.current.asyncApi.resetRows();
            this.ManualAttendanceReport();
            this.getAlloCationDataDefault();
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          // toast.error("✘ " + error);
        });
    });
  };

  hasEmployeeNameKey = (array) => {
    for (var i = 0; i < array.length; i++) {
      if (array[i].hasOwnProperty("employeeName")) {
        return true; // Return true if at least one object has the key
      }
    }
    return false; // Return false if none of the objects have the key
  };

  render() {
    const {
      isLoading,
      empOpt,
      allocationData,
      currMonth,
      secureData,
      editModal,
      allocations,
      currentIndex,
      allowanceObject,
    } = this.state;

    return (
      <div className="emp">
        {console.log(this.state)}
        <Card>
          <CardBody className="border-bottom p-2">
            <CardTitle>Manual Attendance</CardTitle>

            <div>
              <Formik
                innerRef={this.formRef}
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={{
                  fromMonth: "",
                  employeeId: "",
                }}
                validationSchema={Yup.object().shape({
                  fromMonth: Yup.string().required("From Date is required"),
                  employeeId: Yup.object().required("Select Employee"),
                })}
                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                  console.log("values.employeeId.value");
                  console.log(values);
                  // console.log(values.employeeId.value);

                  this.setState(
                    {
                      isLoading: false,
                      // allocationData: [],
                    },
                    () => {
                      // let requestData = {
                      //   // fromMonth: moment(values.fromDate).format("YYYY-MM-DD"),
                      //   fromMonth: values.fromMonth,
                      //   employeeId: values.employeeId.value,
                      // };

                      let requestData = {
                        // fromMonth: moment(values.fromDate).format("YYYY-MM-DD"),
                        fromMonth: values.fromMonth,
                        employeeId: values.employeeId.value,
                      };
                      ManualAttendanceReport(requestData)
                        .then((response) => {
                          // resetForm();
                          var result = response.data;
                          console.log({ result });
                          console.log("resultA.response", result);
                          if (result.responseStatus == 200) {
                            console.log("200");
                            // setSubmitting(false);
                            this.setState({
                              isLoading: true,
                              allocationData: result.response,
                            });

                            //   if (result.response.length == 0) {
                            //     toast.error("✘ No Task Data Found");
                            //   }
                          } else {
                            // setSubmitting(false);
                            //   this.setState({ isLoading: false, allocationData: [] });
                            toast.error("✘ No Data Found");
                          }
                        })
                        .catch((error) => {
                          setSubmitting(false);
                          toast.error("✘ " + error);
                        });
                    }
                  );
                  setStatus();
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
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            Select Month <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="month"
                            name="fromMonth"
                            id="fromMonth"
                            onChange={handleChange}
                            value={values.fromMonth}
                            invalid={errors.fromMonth ? true : false}
                          />
                          <FormFeedback>{errors.fromMonth}</FormFeedback>
                        </FormGroup>
                      </Col>

                      {/* <Col md="1">
                        <FormGroup>
                          <Label> From Date</Label>
                          <MyDatePicker
                            autoComplete="off"
                            className="datepic form-control"
                            name="fromMonth"
                            placeholderText="dd/MM/yyyy"
                            id="fromMonth"
                            dateFormat="dd/MM/yyyy"
                            // value={values.fromMonth}
                            onChange={(e) => {
                              console.log("date ", e);
                              // setFromDate(e);
                              this.setState({ fromMonth: e });
                            }}
                            selected={fromDate}
                            maxDate={new Date()}
                          />
                        </FormGroup>
                      </Col> */}
                      <Col md="3">
                        <FormGroup>
                          <Label
                            style={{ marginBottom: "0px" }}
                            htmlFor="level"
                          >
                            Employee
                          </Label>

                          <Select
                            ////isClearable={true}
                            styles={{
                              clearIndicator: ClearIndicatorStyles,
                            }}
                            onChange={(v) => {
                              setFieldValue("employeeId", v);
                            }}
                            name="employeeId"
                            options={empOpt}
                            value={values.employeeId}
                            className="mt-2"
                          />

                          <span className="text-danger">
                            {errors.employeeId && "Please select employee"}
                          </span>
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        &nbsp;
                        {isLoading ? (
                          <FormGroup>
                            <Button
                              style={{ marginTop: "30px" }}
                              type="submit"
                              className="mainbtn1 text-white report-show-btn"
                            >
                              Show
                            </Button>
                          </FormGroup>
                        ) : (
                          isActionExist(
                            "manual-attendance",
                            "view",
                            this.props.userPermissions
                          ) && (
                            <Button
                              className="mainbtn1 text-white report-show-btn"
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
                          )
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col md="3">
                        <div className="my-2 mx-3">
                          <input
                            style={{ marginBottom: "5px" }}
                            // name="my-search"
                            type="search"
                            // // value={searchText}
                            className="searchinput1"
                            // // onChange={(e) => setSearchText(e.target.value)}
                            // placeholder=" Search For"
                            // type="text"
                            name="Search"
                            id="Search"
                            onChange={(e) => {
                              let v = e.target.value;
                              console.log({ v });
                              this.handleSearch(v);
                            }}
                            placeholder="Search"
                          />
                        </div>
                      </Col>
                      {/* <Col md="9" style={{ textAlign: "end" }}>
                        <Button
                          className="mainbtn1 text-white report-show-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            this.props.history.push(`/allocations-create`);
                          }}
                        >
                          Create New
                        </Button>
                      </Col> */}
                    </Row>
                  </Form>
                )}
              />
            </div>

            {/* <pre>{JSON.stringify(allocationData)}</pre> */}
            {/* {allocationData && allocationData.length > 0 && ( */}
            <div className="container-fluid">
              <div className="attendance-tbl">
                {allocationData.length > 0 ? (
                  <Table bordered size="sm" className="main-tbl-style">
                    <thead
                      style={{
                        backgroundColor: "#F6F5F7",
                      }}
                      className="datastyle-head"
                    >
                      <tr>
                        {/* <th className="th-style"></th> */}

                        <th className="th-style">Date </th>
                        {this.hasEmployeeNameKey(allocationData) ? (
                          <th className="th-style">Employee Name</th>
                        ) : null}
                        <th className="th-style">Check In</th>
                        <th className="th-style">Check Out</th>
                        {/* <th className="th-style">Total Time</th> */}
                        <th className="th-style">Actual Working Hours</th>
                      </tr>
                    </thead>
                    {isLoading ? (
                      <tbody
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {allocationData &&
                          allocationData.map((v, i) => {
                            console.log(v);
                            return (
                              <>
                                <tr>
                                  <td>{v.attendanceDate}</td>
                                  {v.employeeName ? (
                                    <td>{v.employeeName}</td>
                                  ) : null}

                                  <td>
                                    {moment(v.checkInTime).format("HH:mm:ss")}
                                  </td>
                                  <td>
                                    {moment(v.checkOutTime).format("HH:mm:ss")}
                                  </td>
                                  {/* <td>{v.totalTime}</td> */}
                                  <td>{v.actualWorkingHoursInMinutes}</td>
                                </tr>
                              </>
                            );
                          })}
                      </tbody>
                    ) : (
                      // <Spinner size="lg" color="secondary" />
                      <td>No Data Found</td>
                    )}
                  </Table>
                ) : (
                  <Table bordered size="sm" className="main-tbl-style">
                    <thead
                      style={{
                        backgroundColor: "#F6F5F7",
                      }}
                      className="datastyle-head"
                    >
                      <tr>
                        <th className="th-style">No Data Found</th>
                      </tr>
                    </thead>
                  </Table>
                )}
              </div>
            </div>

            <Modal
              className="modal-lg p-2"
              isOpen={editModal}
              toggle={() => {
                this.onEditModalShow();
              }}
            >
              <Formik
                validateOnBlur={false}
                validateOnChange={false}
                enableReinitialize={true}
                initialValues={{
                  allocation_name:
                    allowanceObject != null
                      ? allowanceObject.allocation_name
                      : "",
                  allocation_date:
                    allowanceObject != null
                      ? allowanceObject.allocation_date
                      : "",
                  isAllowance:
                    allowanceObject != null ? allowanceObject.isAllowance : "",
                  amount: allowanceObject != null ? allowanceObject.amount : "",
                }}
                validationSchema={Yup.object().shape({
                  // name: Yup.string()
                  //   .trim()
                  //   .nullable()
                  //   .required("Allowance name is required"),
                  amount: Yup.string()
                    .trim()
                    .nullable()
                    .required("Allowance amount is required"),
                })}
                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                  // setStatus();
                  // setIsLoading(true);
                  let requestData = {
                    id: allowanceObject.id,
                    allocation_date: values.allocation_date,
                    amount: parseInt(values.amount),
                  };

                  updateAllocation(requestData)
                    .then((response) => {
                      // setIsLoading(false);
                      if (response.data.responseStatus === 200) {
                        // setSubmitting(false);
                        toast.success("✔ " + response.data.message);
                        // resetForm();
                        // onEditModalShow(false);
                        this.ManualAttendanceReport();
                        this.getAlloCationDataDefault();
                        this.setState({ editModal: false });
                        tableManager.current.asyncApi.resetRows();
                      } else {
                        // setSubmitting(false);
                        toast.error("✘ " + response.data.message);
                      }
                    })
                    .catch((error) => {
                      // setIsLoading(false);
                      // setSubmitting(false);
                      // toast.error("✘ " + error);
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
                  <>
                    <ModalHeader
                      className="p-2 modalheader-style"
                      toggle={() => {
                        this.onEditModalShow();
                      }}
                    >
                      {console.log(values.isAllowance)}
                      Update{" "}
                      {values.isAllowance == true
                        ? "Allowance"
                        : "Deduction"}{" "}
                      Amount
                      <CloseButton
                        className="pull-right"
                        onClick={() => {
                          this.setState({ editModal: false });
                        }}
                      />
                    </ModalHeader>
                    <Form autoComplete="off">
                      <ModalBody>
                        <Row>
                          <Col md="4">
                            <FormGroup>
                              <Label>Allowance Name </Label>
                              {console.log(values)}
                              <Input
                                type="text"
                                placeholder="Enter allowance name"
                                name="allocation_name"
                                onChange={handleChange}
                                readOnly
                                value={values.allocation_name}
                                invalid={errors.name ? true : false}
                              />
                              <FormFeedback>{errors.name}</FormFeedback>
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label>Date</Label>
                              <Input
                                type="date"
                                placeholder="Enter allowance amount"
                                name="allocation_date"
                                onChange={handleChange}
                                value={values.allocation_date}
                                // invalid={errors.amount ? true : false}
                              />
                              <FormFeedback>{errors.amount}</FormFeedback>
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label>Allowance Amount</Label>
                              <Input
                                type="text"
                                placeholder="Enter allowance amount"
                                name="amount"
                                onChange={handleChange}
                                value={values.amount}
                                // invalid={errors.amount ? true : false}
                              />
                              <FormFeedback>{errors.amount}</FormFeedback>
                            </FormGroup>
                          </Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter className="p-2">
                        {false ? (
                          <Button
                            className="mainbtn1 text-white"
                            type="button"
                            // disabled={isSubmitting}
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
                            // this.onEditModalShow(null);
                            this.setState({ editModal: false });
                          }}
                        >
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Form>
                  </>
                )}
              />
            </Modal>

            {/* )} */}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default WithUserPermission(AllocationsList);
