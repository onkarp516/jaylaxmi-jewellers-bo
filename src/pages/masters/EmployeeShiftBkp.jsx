import React, { Component } from "react";
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
  Form,
  CustomInput,
  Button,
  InputGroupAddon,
  InputGroupText,
  ReactTable,
} from "reactstrap";
import Select, { components } from "react-select";
import "@/assets/scss/all/custom/emp.scss";
import right from "@/assets/images/right.png";
import left from "@/assets/images/left.png";
import {
  listOfEmployee,
  listOfShifts,
  employeeWiseShiftAssign,
} from "@/services/api_function";
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
      isLoading: false,
      shiftList: [],
      empOpt: [],
      selectedEmp: [],
      removeEmp: [],
      selectedEmpForShift: [],
      revEmpForShift: [],
      attendanceData: [],
      isAllChecked: false,
    };
  }

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
    }
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

  shiftAssignToEmp = (from_date, to_date, shiftId, empId) => {
    let reqData = new FormData();
    reqData.append("fromDate", from_date);
    reqData.append("toDate", to_date);
    reqData.append("shiftId", shiftId);
    reqData.append("employeeId", empId);
    employeeWiseShiftAssign()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          this.setState({ opt: res.response });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // handleChange = (e) => {
  //   const { name, label } = e.target;

  //   this.setState({
  //     [name]: label,
  //   });
  // };

  getEmpOptions = () => {
    listOfEmployee()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ empOpt: res.response });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  componentDidMount() {
    this.getEmpOptions();
    this.getShiftOptions();
    // this.shiftAssignToEmp();
  }
  render() {
    const { empOpt, selectedEmp, selectedEmpForShift, removeEmp, shiftList } =
      this.state;
    return (
      <div>
        <div className="empheading">
          <h4>Employee Shift Assign</h4>
          <Row>
            <Col md="1">
              <FormGroup>
                <Label for="exampleDatetime">From Date</Label>
                <Input
                  type="date"
                  name="fromDate"
                  id="fromDate"
                  className="datestyling"
                  // value={values.fromDate}
                />
                {/* <FormFeedback>{errors.fromDate}</FormFeedback> */}
              </FormGroup>
            </Col>
            <Col md="1">
              <FormGroup>
                <Label for="exampleDatetime">To Date</Label>
                <Input
                  type="date"
                  name="toDate"
                  id="toDate"
                  className="datestyling"
                  // value={values.toDate}
                />
                {/* <FormFeedback>{errors.fromDate}</FormFeedback> */}
              </FormGroup>
            </Col>
            {/* {JSON.stringify(shiftList)} */}
            <Col md="6">
              <Form inline style={{ marginTop: "1.8rem" }}>
                {shiftList.length > 0 &&
                  shiftList.map((value, i) => {
                    return (
                      <div className="form-check form-check-inline">
                        <CustomInput
                          type="radio"
                          id={`exampleCustomRadio` + i}
                          name="customRadio"
                          label={value.name}
                          value={value.id}
                          // onChange={ha}
                        />
                      </div>
                    );
                  })}

                <Button className="btn savebtn">Save</Button>
                <Button className="btn cancelbtn ml-2">Cancel</Button>
              </Form>
            </Col>
            {/* <Col md="2"></Col> */}
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
                  name="employeeId"
                  className="mt-2"
                />
              </FormGroup>
            </Col>
            <Col md="2">
              {/* <div> */}
              {/* <input
                  name="my-search"
                  type="search"
                  className="searchbar"
                  placeholder=" Search "
                  value=""
                />
                <i className="fa fa-search"></i>
              </div> */}
              <Form className="searchbar">
                <InputGroup>
                  <Input placeholder="Search" type="search" />
                  <InputGroupAddon addonType="append">
                    <InputGroupText className="searchicon">
                      <i className="fa fa-search " />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Form>
            </Col>
          </Row>
          {JSON.stringify(selectedEmp)}
          {/* {JSON.stringify(empOpt)} */}
          <Row>
            <Col md="5">
              <div className="tableheight section">
                {" "}
                <Table style={{ border: "1px solid #ccc", height: "75vh" }}>
                  <thead className="tblhead" style={{ zIndex: "0" }}>
                    <tr>
                      <th scope="col" className="text-center">
                        Employee ID
                      </th>
                      <th scope="col">Full Name</th>
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
                              <td>{value.employeeName}</td>
                              <td>
                                <div className="form-check form-check-inline">
                                  <CustomInput
                                    type="checkbox"
                                    name="checked"
                                    id={`checked_` + key}
                                    checked={
                                      selectedEmp.includes(value.id) == true
                                        ? true
                                        : false
                                    }
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
              <div style={{ marginTop: "260px" }}>
                <div className="mb-3">
                  <Button className="btn arrowbtn">
                    {/* <i class="fa fa-arrow-right" aria-hidden="true"></i>
                    <i class="fa-solid fa-right"></i> */}
                    <img
                      src={right}
                      alt="rightarrow"
                      onClick={(e) => {
                        e.preventDefault();
                        this.empRightArrow();
                      }}
                    ></img>
                  </Button>
                </div>
                <div>
                  <Button className="btn arrowbtn">
                    <img
                      src={left}
                      alt="leftarrow"
                      onClick={(e) => {
                        e.preventDefault();
                        this.empLeftArrow();
                      }}
                    ></img>
                  </Button>
                </div>
              </div>
            </Col>
            <Col md="5">
              {JSON.stringify(removeEmp)}

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
                      <th scope="col">Full Name</th>
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
                              <td>{v.employeeName}</td>
                            </tr>
                          </tbody>
                        </>
                      );
                    })}
                </Table>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
