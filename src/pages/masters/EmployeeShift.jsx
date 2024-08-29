import React, { Component } from "react";
import {
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
  CustomInput,
  Button,
} from "reactstrap";
import { MyDatePicker } from "@/helpers";
import * as Yup from "yup";
import Select, { components } from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import "@/assets/scss/all/custom/emp.scss";
import right from "@/assets/images/right.png";
import left from "@/assets/images/left.png";
import moment from "moment";
import {
  listOfEmployee,
  listOfShifts,
  employeeWiseShiftAssign,
  orderByEmployee,
  getNonShiftEmployee,
} from "@/services/api_function";
import { Formik, Form } from "formik";
const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});
export default class EmployeeShift extends Component {
  constructor(props) {
    super(props);
    this.tableManager = React.createRef(null);
    this.state = {
      orderBy: "",
      isLoading: false,
      shiftList: [],
      empOpt: [],
      nonShiftEmp: [],
      orgempOpt: [],
      selectedEmp: [],
      removeEmp: [],
      selectedEmpForShift: [],
      revEmpForShift: [],
      attendanceData: [],
      isAllChecked: false,
      selectedShift: "",
    };
  }

  orderByOpt = [
    {
      label: "FirstName LastName",
      value: "1",
    },
    {
      label: "LastName FirstName",
      value: "2",
    },
  ];

  listGetOrderBy = (orderById) => {
    let reqData = new FormData();
    reqData.append("orderById", orderById);
    orderByEmployee(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          console.log("res.response ", res.response);
          this.setState({ empOpt: res.response });
        }
      })
      .catch((error) => {
        this.setState({ orderByOpt: [] });
        console.log("error", error);
      });
  };

  getNonShiftEmp = (fromDate, toDate) => {
    let reqData = new FormData();
    reqData.append("fromDate", moment().format("YYYY-MM-DD"));
    reqData.append("toDate", moment().format("YYYY-MM-DD"));
    getNonShiftEmployee(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          console.log("res.response ", res.response);
          this.setState({ empOpt: res.response, orgempOpt: res.response });
        }
      })
      .catch((error) => {
        this.setState({ empOpt: [] });
        console.log("error", error);
      });
  };

  getShiftOptions = () => {
    listOfShifts()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          // let opt = result.map(function (data) {
          //   return {
          //     value: data.id,
          //     label: data.name,
          //   };
          // });
          this.setState({ shiftList: res.response });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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

  addSelectionEmployees = (id, status) => {
    let { selectedEmp, empOpt } = this.state;
    let f_selectedEmps = selectedEmp;
    let f_emps = empOpt;
    if (status == true) {
      if (selectedEmp.length > 0) {
        if (!selectedEmp.includes(id)) {
          f_selectedEmps = [...f_selectedEmps, id];
        }
      } else {
        f_selectedEmps = [...f_selectedEmps, id];
      }
    } else {
      f_selectedEmps = f_selectedEmps.filter((v, i) => v != id);
    }

    this.setState({
      isAllChecked: f_emps.length == f_selectedEmps.length ? true : false,
      selectedEmp: f_selectedEmps,
      empOpt: f_emps,
    });
  };

  empRightArrow = () => {
    let { selectedEmp, selectedEmpForShift, empOpt } = this.state;
    if (selectedEmp.length > 0) {
      let f_empOpt = empOpt;
      this.setState({ selectedEmpForShift: [] });
      console.log({ selectedEmp });
      selectedEmp.map((empId) => {
        empOpt.map((v, i) => {
          if (v.id == empId) {
            selectedEmpForShift.push(v);

            f_empOpt = f_empOpt.filter((v, i) => v.id != empId);
          }
        });
      });

      console.log({ f_empOpt, selectedEmpForShift });
      this.setState({
        selectedEmpForShift: selectedEmpForShift.sort((a, b) => a.id - b.id),
        empOpt: f_empOpt,
        selectedEmp: [],
      });
    } else {
      toast.error("PLease Check Employee");
    }
  };

  removeSelectionEmployees = (id, status) => {
    let { removeEmp, selectedEmpForShift } = this.state;
    let f_selectedEmps = removeEmp;
    console.log("Remove", removeEmp);
    console.log("selectedEmpForShift  ", selectedEmpForShift);
    let f_emps = selectedEmpForShift;
    if (status == true) {
      if (removeEmp.length > 0) {
        if (!removeEmp.includes(id)) {
          f_selectedEmps = [...f_selectedEmps, id];
        }
      } else {
        f_selectedEmps = [...f_selectedEmps, id];
      }
    } else {
      f_selectedEmps = f_selectedEmps.filter((v, i) => v != id);
    }

    this.setState({
      isAllChecked: f_emps.length == f_selectedEmps.length ? true : false,
      removeEmp: f_selectedEmps,
      selectedEmpForShift: f_emps,
    });
  };

  empLeftArrow = () => {
    let { removeEmp, selectedEmpForShift, empOpt } = this.state;
    if (removeEmp.length > 0) {
      let f_empOpt = selectedEmpForShift;
      this.setState({ empOpt: [] });
      console.log({ removeEmp });
      removeEmp.map((empId) => {
        selectedEmpForShift.map((v, i) => {
          if (v.id == empId) {
            empOpt.push(v);
            f_empOpt = f_empOpt.filter((v, i) => v.id != empId);
          }
        });
      });

      console.log({ f_empOpt, empOpt });
      this.setState({
        empOpt: empOpt.sort((a, b) => a.id - b.id),
        selectedEmpForShift: f_empOpt,
        removeEmp: [],
      });
    } else if (selectedEmpForShift.length == 0) {
      toast.error("No Found Data");
    } else {
      toast.error("Please Check Employee");
    }
  };

  getEmpOptions = () => {
    listOfEmployee()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ empOpt: res.response, orgempOpt: res.response });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  componentDidMount() {
    // this.getEmpOptions();
    this.getShiftOptions();
    // this.shiftAssignToEmp();
  }
  handleSearch = (vi) => {
    let { orgempOpt } = this.state;
    console.log({ orgempOpt });
    let empOpt_F = orgempOpt.filter(
      (v) =>
        v.firstName.toLowerCase().includes(vi.toLowerCase()) ||
        v.lastName.toLowerCase().includes(vi.toLowerCase())
    );
    this.setState({ empOpt: empOpt_F.length > 0 ? empOpt_F : orgempOpt });
  };
  render() {
    const {
      empOpt,
      selectedEmp,
      selectedEmpForShift,
      removeEmp,
      shiftList,
      selectedShift,
    } = this.state;
    return (
      <div>
        <div className="empheading">
          <h4>Employee Shift Assign</h4>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
              fromDate: "",
              toDate: "",
              shiftId: "",
              search: "",
              orderBy: "",
            }}
            validationSchema={Yup.object().shape({
              fromDate: Yup.string()
                .nullable()
                .required("from Date Is Requirewd"),
              toDate: Yup.string().required("To Date Is Required"),
              shiftId: Yup.string().required("Shift Is Required"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              console.log({ values });

              if (selectedEmpForShift.length > 0) {
                setStatus();
                let reqData = new FormData();
                reqData.append(
                  "fromDate",
                  moment(values.fromDate).format("yyyy-MM-DD")
                );
                reqData.append(
                  "toDate",
                  moment(values.toDate).format("yyyy-MM-DD")
                );
                reqData.append(
                  "employeeList",
                  JSON.stringify(selectedEmpForShift)
                );

                reqData.append("shiftId", values.shiftId);

                employeeWiseShiftAssign(reqData)
                  .then((response) => {
                    if (response.data.responseStatus === 200) {
                      setSubmitting(false);
                      toast.success("✔ " + response.data.message);
                      resetForm();
                      this.props.history.push("/master/empShiftList");
                    } else {
                      setSubmitting(false);
                      toast.error("✘ " + response.data.message);
                    }
                  })
                  .catch((error) => {
                    setSubmitting(false);
                    toast.error("✘ " + error);
                  });
              }
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
                {/* {JSON.stringify(values)} */}
                {/* {JSON.stringify(errors)} */}
                <Row>
                  <Col lg="1" md="1">
                    <Label className="formlabelsize">From Date</Label>
                    <MyDatePicker
                      className="datepic form-control"
                      // styles={customStyles}
                      name="fromDate"
                      placeholderText="dd/MM/yyyy"
                      id="fromDate"
                      dateFormat="dd/MM/yyyy"
                      value={values.fromDate}
                      onChange={(date) => {
                        setFieldValue("fromDate", date);
                        // getAge(date, setFieldValue);
                      }}
                      selected={values.fromDate}
                      // maxDate={new Date()}
                    />
                    <span className="text-danger errormsg">
                      {errors.fromDate}
                    </span>
                  </Col>
                  <Col lg="1" md="1">
                    <Label className="formlabelsize">To Date</Label>
                    <MyDatePicker
                      className="datepic form-control"
                      // styles={customStyles}
                      name="toDate"
                      placeholderText="dd/MM/yyyy"
                      id="toDate"
                      dateFormat="dd/MM/yyyy"
                      value={values.toDate}
                      onChange={(date) => {
                        setFieldValue("toDate", date);
                        // getAge(date, setFieldValue);
                      }}
                      selected={values.toDate}
                      // maxDate={new Date()}
                    />
                    <span className="text-danger errormsg">
                      {errors.toDate}
                    </span>
                  </Col>

                  <Col lg="1" md="1">
                    <Button
                      type="button"
                      className="btn savebtn"
                      style={{ marginTop: "1.8rem" }}
                      onClick={(e) => {
                        this.getNonShiftEmp(values.fromDate, values.toDate);
                      }}
                    >
                      Ok
                    </Button>
                  </Col>
                  <Col md="5">
                    {/* {JSON.stringify(shiftList)} */}

                    <Form inline style={{ marginTop: "1.8rem" }}>
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

                      <Button type="submit" className="btn savebtn">
                        Save
                      </Button>
                      <Button
                        type="button"
                        className="btn cancelbtn ml-2"
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.history.push("/master/empShiftList");
                        }}
                      >
                        Cancel
                      </Button>
                    </Form>
                  </Col>

                  <Col md="2">
                    <FormGroup>
                      <Label style={{ marginBottom: "0px" }} htmlFor="level">
                        Order By:
                      </Label>

                      <Select
                        ////isClearable={true}
                        styles={{
                          clearIndicator: ClearIndicatorStyles,
                          menu: (provided) => ({ ...provided, zIndex: 9999 }),
                        }}
                        className="mt-2"
                        name="orderBy"
                        value={values.orderBy}
                        options={this.orderByOpt}
                        onChange={(v) => {
                          setFieldValue("orderBy", "");
                          if (v !== null) {
                            setFieldValue("orderBy", v);
                            this.listGetOrderBy(v.value);
                          } else {
                            this.setState({ orderByOpt: [] });
                          }
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <Label>
                        Search Employee <span className="text-danger"></span>
                      </Label>
                      <Input
                        className=""
                        placeholder="Search For"
                        type="text"
                        name="Search"
                        id="Search"
                        onChange={(e) => {
                          let v = e.target.value;
                          setFieldValue("search", v);
                          this.handleSearch(v);
                        }}
                        value={values.search}
                        invalid={errors.search ? true : false}
                      />
                      <FormFeedback>{errors.search}</FormFeedback>
                    </FormGroup>
                  </Col>
                  {/* <Col md="2"> */}
                  {/* <Form className="searchbar">
                      <InputGroup>
                        <Input placeholder="Search" type="search" />
                        <InputGroupAddon addonType="append">
                          <InputGroupText className="searchicon">
                            <i className="fa fa-search " />
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Search"
                        className="main_search"
                      />
                    </Form> */}
                  {/* </Col> */}
                </Row>

                <Row>
                  <Col md="5">
                    <div className="tableheight section">
                      {" "}
                      <Table style={{ border: "1px solid #ccc" }}>
                        <thead className="tblhead">
                          <tr>
                            <th scope="col" className="text-center">
                              Employee ID
                            </th>
                            <th scope="col">First Name</th>
                            <th scope="col">Middle Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Select</th>
                          </tr>
                        </thead>
                        {empOpt &&
                          empOpt.map((value, key) => {
                            return (
                              <>
                                <tbody>
                                  <tr>
                                    <td className="text-center">{value.id}</td>
                                    <td>{value.firstName}</td>
                                    <td>{value.middleName}</td>
                                    <td>{value.lastName}</td>
                                    <td>
                                      <div className="form-check form-check-inline">
                                        <CustomInput
                                          type="checkbox"
                                          name="checked"
                                          id={`checked_` + key}
                                          checked={
                                            selectedEmp.includes(value.id) ==
                                            true
                                              ? true
                                              : false
                                          }
                                          value={value.checked}
                                          onChange={(e) => {
                                            this.addSelectionEmployees(
                                              value.id,
                                              e.target.checked
                                            );
                                          }}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </>
                            );
                          })}
                      </Table>
                    </div>
                  </Col>
                  <Col md="2">
                    <div style={{ marginTop: "260px", textAlign: "center" }}>
                      <div className="mb-3">
                        <Button
                          type="button"
                          className="btn arrowbtn"
                          onClick={(e) => {
                            e.preventDefault();
                            this.empRightArrow();
                          }}
                        >
                          {/* <i class="fa fa-arrow-right" aria-hidden="true"></i>
                    <i class="fa-solid fa-right"></i> */}
                          <img src={right} alt="rightarrow"></img>
                        </Button>
                      </div>
                      <div>
                        <Button
                          type="button"
                          className="btn arrowbtn"
                          onClick={(e) => {
                            e.preventDefault();
                            this.empLeftArrow();
                          }}
                        >
                          <img src={left} alt="leftarrow"></img>
                        </Button>
                      </div>
                    </div>
                  </Col>
                  <Col md="5">
                    {/* {JSON.stringify(removeEmp)} */}
                    {/* {JSON.stringify(selectedEmpForShift)} */}

                    <div className="tableheight">
                      <Table style={{ border: "1px solid #ccc" }}>
                        <thead className="tblhead">
                          <tr>
                            <th scope="col" className="text-center">
                              Select
                            </th>
                            <th scope="col" className="text-center">
                              Employee ID
                            </th>
                            <th scope="col">First Name</th>
                            <th scope="col">Middle Name</th>
                            <th scope="col">Last Name</th>
                          </tr>
                        </thead>
                        {selectedEmpForShift &&
                          selectedEmpForShift.map((v, i) => {
                            return (
                              <>
                                <tbody>
                                  <tr>
                                    <td className="text-center">
                                      <div className="form-check form-check-inline ">
                                        <CustomInput
                                          type="checkbox"
                                          name="removechecked"
                                          id={`removechecked_` + i}
                                          checked={
                                            removeEmp.includes(v.id) == true
                                              ? true
                                              : false
                                          }
                                          onChange={(e) => {
                                            this.removeSelectionEmployees(
                                              v.id,
                                              e.target.checked
                                            );
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td className="text-center">{v.id}</td>
                                    <td>{v.firstName}</td>
                                    <td>{v.middleName}</td>
                                    <td>{v.lastName}</td>
                                  </tr>
                                </tbody>
                              </>
                            );
                          })}
                      </Table>
                    </div>
                  </Col>
                </Row>
              </Form>
            )}
          />
        </div>
      </div>
    );
  }
}
