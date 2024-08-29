import React, { Component, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import moment from "moment";
import {
  Input,
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
  Table, // CardHeader,
} from "reactstrap";
import {
  WithUserPermission,
  isActionExist,
  MyDatePicker,
  getSelectValue,
} from "@/helpers";
import Select from "react-select";
import { Form as bootstrapForm } from "react-bootstrap";

import {
  getUnderList,
  getAssociateGroups,
  updateAssociateGroup,
  getSundryDebtorsIndirectIncome,
  create_emp_payroll,
} from "@/services/api_function";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import arrow from "@/assets/images/arrow.png";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

class PayrollList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sundryDebtorsList: [],
      debtorsData: [],
      search: "",
      CheckList: [],
      employeeIdStatus: true,
      initValue: {
        associates_id: "",
        associates_group_name: "",
        underId: "",
      },
    };
  }

  pageReload = () => {
    this.componentDidMount();
  };
  componentDidMount() {
    this.lstSundryDebtors();
  }

  getEmployeeSalaryData = (data) => {
    console.log("Data>>>", data);
    this.props.history.push("/emp-salary-data/" + data.id);
  };

  setInitValue = () => {
    let initValue = {
      associates_id: "",
      underId: "",
      associates_group_name: "",
    };

    this.setState({ initValue: initValue });
  };

  lstSundryDebtors = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const monthStr = month < 10 ? "0" + month : month;
    const yearMonth = year + "-" + monthStr;

    let formData = new FormData();
    formData.append("fromMonth", yearMonth);

    getSundryDebtorsIndirectIncome(formData)
      .then((response) => {
        console.log("response", response);
        let res = response.data ? response.data : [];
        if (res.responseStatus == 200) {
          let opt = [];
          res.list.map(function (data) {
            opt.push({
              ...data,
              attendanceStatus: false,
              // label: data.employeeName,
            });
          });

          this.setState({ sundryDebtorsList: opt, debtorsData: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleSearch = (vi) => {
    this.setState({ search: vi }, () => {
      let { sundryDebtorsList } = this.state;
      console.log("handleSearch:", { sundryDebtorsList });
      let sundryDebtorsList_F = sundryDebtorsList.filter(
        (v) =>
          (v.balancing_method != null &&
            v.ledger_name != null &&
            v.balancing_method.toLowerCase().includes(vi.toLowerCase())) ||
          v.ledger_name.toLowerCase().includes(vi.toLowerCase())
      );

      if (vi.length == 0) {
        this.setState({
          debtorsData: sundryDebtorsList,
        });
      } else {
        this.setState({
          debtorsData: sundryDebtorsList_F.length > 0 ? sundryDebtorsList_F : [],
        });
      }
    });
  };

  isBtn = (salProc) => {
    console.log(
      "🚀 ~ file: PayrollList.jsx:140 ~ PayrollList ~ salProc:",
      salProc
    );
    return salProc == true ? false : true;
  };

  isAmt = (amt) => {
    console.log(
      "🚀 ~ file: PayrollList.jsx:146 ~ PayrollList ~ isAmt ~ amt:",
      amt
    );
    return amt == "" ? true : false;
  };

  isChecked = (employeeId) => {
    console.log("employeeId-->" + employeeId);

    // debugger
    const foundObject = this.state.debtorsData.find(
      (item) => item.employeeId === employeeId
    );

    if (foundObject) {
      // console.log("Object found:", foundObject);
      return foundObject.attendanceStatus;
    } else {
      console.log("Object not found");
    }
  };

  handleCheckboxSelection = (e, v, index, employeeWagesType, wagesPerDay) => {
    console.log("v", v);
    // console.log("wagesPerDay", wagesPerDay);
    // debugger

    const { name, checked } = e.target; // Use "checked" instead of "value" for checkboxes

    console.log("in group  debtorsData-->", this.state.debtorsData);

    //Binding the array for selecting all
    if (name === "all") {
      let opt = [];

      this.state.debtorsData.map((v) => {
        
        opt.push({
          ...v,
          // attendanceStatus: checked,
          attendanceStatus: v.payableAmount !== undefined && v.isSalaryProcessed !== true ? checked : false,

        });

      });

    
      console.log(opt);
      // this.setState({ CheckList: opt });
      this.setState({ debtorsData: opt });

      
    } else {
      const list = [...this.state.debtorsData];

      // Update the specific object in the array
      list[index] = {
        ...list[index],
        attendanceStatus: checked,
      };

      console.log("in group  list-->", list);

      this.setState({ debtorsData: list });
    }
  };

  render() {
    const { initValue, sundryDebtorsList, CheckList, debtorsData } = this.state;

    return (
      <div className="emp">
        <Card>
          <CardBody className="border-bottom p-2">
            <div
              style={{
                background: "#cee7f1",
                padding: "10px",
                paddingBottom: "0px",
                marginBottom: "10px",
              }}
            >
              <CardTitle className="text-dark">Payroll Process</CardTitle>
            </div>
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
              <Col md="1">
                <FormGroup>
                  {this.state.employeeIdStatus ? (
                    <FormGroup className="d-flex my-auto p-2">
                      <bootstrapForm.Check type={"checkbox"}>
                        <bootstrapForm.Check.Input
                          type={"checkbox"}
                          defaultChecked={false}
                          name="all"
                          onChange={(e) => {
                            this.handleCheckboxSelection(
                              e
                              // v.id,
                              // i,
                              // v.employeeWagesType,
                              // v.wagesPerDay,
                            );
                          }}
                        />
                        <bootstrapForm.Check.Label
                          style={{
                            color: "#00a0f5",
                            textDecoration: "underline",
                          }}
                        >
                          {`Check all`}
                        </bootstrapForm.Check.Label>
                      </bootstrapForm.Check>
                    </FormGroup>
                  ) : null}
                </FormGroup>
              </Col>
              <Col md="2">
                <FormGroup>
                  {/* <Label> Approve</Label> */}

                  <Button
                    type="button"
                    className="mainbtn1 text-white mr-2 report-show-btn"
                    disabled={debtorsData.filter(
                      (item) => item.attendanceStatus != false
                    ).length > 0 ? false : true}
                    onClick={(e) => {
                      console.log("debtorsData", debtorsData);
                      const filteredArray = debtorsData.filter(
                        (item) => item.attendanceStatus != false
                      );
                      console.log(
                        "🚀 ~ file: PayrollList.jsx:300 ~ PayrollList ~ render ~ filteredArray:",
                        filteredArray
                      );

                      e.preventDefault();
                      let frmData = new FormData();
                      frmData.append("list", JSON.stringify(filteredArray));
                      create_emp_payroll(frmData)
                        .then((response) => {
                          // setIsLoading(false);
                          if (response.data.responseStatus == 200) {
                            toast.success("✔ " + response.data.message);
                            // getAttendanceData();
                            this.lstSundryDebtors();
                          } else {
                            // setSubmitting(false);
                            toast.error("✘ " + response.data.message);
                          }
                        })
                        .catch((error) => {
                          // setIsLoading(false);
                          // setSubmitting(false);
                          toast.error("✘" + error);
                        });
                    }}
                  >
                    <i className="fa fa-check" style={{ color: "red" }} />
                    &nbsp; &nbsp;Process Salary
                  </Button>
                </FormGroup>
              </Col>
              <Col md="12">
                <div className="attendance-tbl">
                  <Table bordered size="sm" className="main-tbl-style">
                    <thead
                      style={{
                        backgroundColor: "#F6F5F7",
                      }}
                      className="datastyle-head"
                    >
                      <tr>
                        {/* <th className="th-style" style={{ zIndex: 99 }}></th> */}
                        <th>Select</th>
                        <th>Date</th>
                        <th>Employee Name</th>
                        <th>Balancing Method</th>
                        <th>Type</th>
                        <th>Present Days</th>
                        <th>Payble Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {debtorsData.length > 0 ? (
                        debtorsData.map((v, i) => {
                          // {console.log("checkk->"+v.isSalaryProcessed=="true" +"||"+ v.payableAmount=="")}

                          return (
                            <tr>
                              {/* <td style={{ width: "20%" }}>{i + 1}</td> */}

                              <td>
                                <FormGroup className="d-flex my-auto p-2">
                                  <FormGroup className="d-flex my-auto p-2">
                                    <bootstrapForm.Check type={"checkbox"}>
                                      <bootstrapForm.Check.Input
                                        type={"checkbox"}
                                        defaultChecked={false}
                                        disabled={v.isSalaryProcessed==true || v.payableAmount===undefined || v.payableAmount===""}

                                        name="attendanceStatus"
                                        checked={v.attendanceStatus}
                                        onChange={(e) => {
                                          this.handleCheckboxSelection(
                                            e,
                                            v,
                                            i,
                                            v.employeeWagesType,
                                            v.wagesPerDay
                                          );
                                        }}
                                      />
                                    </bootstrapForm.Check>
                                  </FormGroup>
                                </FormGroup>
                              </td>
                              {console.log(
                                ("checkk->" + v.isSalaryProcessed ==
                                  "true" + "||" + v.payableAmount) ==
                                  ""
                              )}

                              <td
                                style={{
                                  width: "10%",
                                  verticalAlign: "middle ",
                                }}
                              >
                                {v.payrollDate}
                              </td>
                              <td
                                style={{
                                  width: "60%",
                                  verticalAlign: "middle ",
                                }}
                              >
                                {v.ledger_name}
                              </td>

                              <td
                                style={{
                                  width: "60%",
                                  verticalAlign: "middle ",
                                }}
                              >
                                {v.balancing_method}
                              </td>

                              <td
                                style={{
                                  width: "80%",
                                  verticalAlign: "middle ",
                                }}
                              >
                                {v.type}
                              </td>

                              <td
                                style={{
                                  width: "80%",
                                  verticalAlign: "middle ",
                                }}
                              >
                                {v.noDaysPresent}
                              </td>

                              <td
                                style={{
                                  width: "80%",
                                  verticalAlign: "middle ",
                                }}
                              >
                                {v.payableAmount}
                              </td>

                              {/* <td style={{ width: "40%" }}>{v.type}</td> */}
                              <td>
                                {" "}
                                <img
                                  src={arrow}
                                  style={{
                                    // width: "12%",
                                    margin: "8px 0px 8px 0px",
                                    height: "24px",
                                    width: "24px",
                                  }}
                                  title="salary process"
                                  onClick={(e) => {
                                    if (
                                      isActionExist(
                                        "payroll",
                                        "view",
                                        this.props.userPermissions
                                      ) &&
                                      this.isBtn(v.isSalaryProcessed) &&
                                      v.payableAmount
                                    )
                                      this.getEmployeeSalaryData(v);
                                    else {
                                      toast.error("Permission is denied!");
                                    }
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center">
                            No Data Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default WithUserPermission(PayrollList);
