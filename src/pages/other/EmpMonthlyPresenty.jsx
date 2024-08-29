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
import { WithUserPermission, isActionExist } from "@/helpers";
import Select, { components } from "react-select";
import Table from "react-bootstrap/Table";
import Paper from "@material-ui/core/Paper";
import "@/assets/scss/all/custom/tbl.scss";
import { listOfEmployee, getEmpMonthlyPresenty } from "@/services/api_function";

import { Formik, Form } from "formik";
import * as Yup from "yup";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

// const customStyles1 = {
//   control: (base) => ({
//     ...base,
//      padding: "1px",

//   }),
// };

class EmpMonthlyPresenty extends Component {
  constructor(props) {
    super(props);

    this.formRef = React.createRef(null);
    this.state = {
      isLoading: false,
      empOpt: [],
      attendanceData: [],
      totalDays: 0,
      sumofAllEmployeeTotalDays: 0,
      sumOfAllEmployeePresenty: 0,
      sumOfAllEmployeeAbsenty: 0,
      sumOfAllEmployeeLeaves: 0,
      sumOfAllEmployeeHalfDays: 0,
      pDays: 0,
      pList: [],
      abList: [],
      lList: [],
      days: [],
      tAbAndLeaveList: [],
      absentPercentage: [],
      hList: [],
    };
  }

  getEmpOptions = () => {
    listOfEmployee()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt1 = [
            {
              value: "all",
              label: "All",
            },
          ];
          result.map(function (data) {
            opt1.push({
              value: data.id,
              label: data.employeeName,
            });
          });
          console.log(opt1)
          this.setState({ empOpt: opt1 }, () => {
            this.formRef.current.setFieldValue("employeeId", opt1[0]);
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  componentDidMount() {
    this.getEmpOptions();
  }

  render() {
    let {
      isLoading,
      empOpt,
      attendanceData,
      totalDays,
      days,
      sumofAllEmployeeTotalDays,
      sumOfAllEmployeePresenty,
      sumOfAllEmployeeAbsenty,
      sumOfAllEmployeeLeaves,
      sumOfAllEmployeeHalfDays,
      pDays,
      pList,
      abList,
      lList,
      hList,
      tAbAndLeaveList,
      absentPercentage,
    } = this.state;

    const extraHalfDays = attendanceData.reduce((acc, currentValue) => acc + currentValue.extraHalfDays, 0);
    const extraDays = attendanceData.reduce((acc, currentValue) => acc + currentValue.extraDays, 0);


    return (
      <div className="emp">
        <Card>
          <CardBody className="border-bottom p-2">
            <CardTitle>Employee Monthly Presenty</CardTitle>

            <div>
              <Formik
                innerRef={this.formRef}
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={{
                  currentMonth: moment(new Date()).format("YYYY-MM"),
                  employeeId: "",
                }}
                validationSchema={Yup.object().shape({
                  currentMonth: Yup.string().required("From Date is required"),

                  employeeId: Yup.object().required("Select Employee"),
                })}
                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                  this.setState(
                    {
                      isLoading: true,
                      attendanceData: [],
                    },
                    () => {
                      console.log("totalDays :", totalDays);
                      let requestData = {
                        currentMonth: values.currentMonth,
                        employeeId: values.employeeId.value,
                      };
                      getEmpMonthlyPresenty(requestData)
                        .then((response) => {
                          // resetForm();
                          var result = response.data;
                          console.log(result.totalDays);
                          console.log(
                            "result.sumofAllEmployeeTotalDays",
                            result.sumofAllEmployeeTotalDays
                          );
                          if (result.responseStatus == 200) {
                            setSubmitting(false);
                            abList: [];
                            pList = [];
                            lList = [];
                            hList = [];
                            tAbAndLeaveList: [];
                            absentPercentage: [];
                            days = [];
                            for (
                              let i = 0;
                              i <= result.response.absentPercentage;
                              i++
                            ) {
                              absentPercentage.push(i);
                            }
                            for (
                              let i = 0;
                              i <= result.response.tAbAndLeaveList;
                              i++
                            ) {
                              tAbAndLeaveList.push(i);
                            }
                            for (let i = 0; i <= result.response.lList; i++) {
                              lList.push(i);
                            }
                            for (let i = 0; i <= result.response.abList; i++) {
                              abList.push(i);
                            }
                            for (let i = 0; i <= result.response.hList; i++) {
                              hList.push(i);
                            }
                            for (
                              let i = 1;
                              i <= result.response.totalDays;
                              i++
                            ) {
                              days.push(i);
                            }
                            for (let i = 0; i <= result.response.pList; i++) {
                              pList.push(i);
                            }

                            this.setState({
                              isLoading: false,
                              attendanceData: result.response.list,
                              totalDays: result.response.totalDays,
                              days: days,
                              sumofAllEmployeeTotalDays:
                                result.response.sumofAllEmployeeTotalDays,
                              sumOfAllEmployeePresenty:
                                result.response.sumOfAllEmployeePresenty,
                              sumOfAllEmployeeAbsenty:
                                result.response.sumOfAllEmployeeAbsenty,
                              sumOfAllEmployeeLeaves:
                                result.response.sumOfAllEmployeeLeaves,
                              sumOfAllEmployeeHalfDays: result.response.sumOfAllEmployeeHalfDays,
                              pDays: result.response.pDays,
                              pList: result.response.pList,
                              abList: result.response.abList,
                              hList: result.response.hList,
                              lList: result.response.lList,
                              tAbAndLeaveList: result.response.tAbAndLeaveList,
                              absentPercentage:
                                result.response.absentPercentage,
                            });
                          } else {
                            setSubmitting(false);
                            this.setState({
                              isLoading: false,
                              attendanceData: [],
                            });
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
                            name="currentMonth"
                            id="currentMonth"
                            onChange={handleChange}
                            value={values.currentMonth}
                            invalid={errors.currentMonth ? true : false}
                          />
                          <FormFeedback>{errors.currentMonth}</FormFeedback>
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label
                            style={{ marginBottom: "0px" }}
                            htmlFor="level"
                          >
                            Employee
                          </Label>
                          {console.log(empOpt)}
                          <Select
                            isClearable={true}
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
                        <FormGroup>
                          {isLoading ? (
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
                          ) : (
                            isActionExist(
                              "monthly-presenty",
                              "view",
                              this.props.userPermissions
                            ) && (
                              <>
                                <Button
                                  type="submit"
                                  className="mainbtn1 text-white report-show-btn"
                                >
                                  Show
                                </Button>
                              </>
                            )
                          )}
                        </FormGroup>
                        {/* </Col>
                      <Col md="2"> */}
                      </Col>
                    </Row>
                  </Form>
                )}
              />
            </div>

            {attendanceData && attendanceData.length > 0 && (
              <Row>
                <Col md="12" className="tbl-style">
                  <div className="attendance-tbl">
                    <Table
                      aria-label="simple table"
                      // responsive
                      bordered
                      size="sm"
                      className="main-tbl-style"
                    >
                      <thead
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <tr>
                          <th className="tblalignment">SR NO</th>
                          <th className="tblalignment">Name</th>
                          {/* <th className="tblalignment">CNC</th> */}
                          <th className="tblalignment">Total Days</th>
                          <th className="tblalignment">Present</th>
                          <th className="tblalignment">Absent</th>
                          <th className="tblalignment">Leave</th>
                          <th className="tblalignment">Half</th>
                          <th className="tblalignment">Extra Half</th>
                          <th className="tblalignment">Extra Present</th>
                          {days &&
                            days.map((v) => {
                              return <th className="tblalignment">{v}</th>;
                            })}
                        </tr>
                      </thead>

                      <tbody
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {attendanceData.map((value, key) => {
                          return (
                            <tr key={key}>
                              <td className="tblalignment">{key + 1}</td>
                              <td className="tblalignment">
                                {value.employeeName}
                              </td>
                              {/* <td className="tblalignment">VMC</td> */}
                              <td className="tblalignment">
                                {value.totalDays}
                              </td>
                              {/* <td className="tblalignment">{value.pDays+value.weeklyOffDays+(value.hDays/2)+value.extraDays+(value.extraHalfDays/2)}</td> */}
                              <td className="tblalignment">{value.pDays+value.weeklyOffDays+(value.hDays/2)}</td>
                              <td className="tblalignment">{value.aDays}</td>
                              <td className="tblalignment">{value.lDays}</td>
                              <td className="tblalignment">{value.hDays}</td>
                              <td className="tblalignment">{value.extraHalfDays}</td>
                              <td className="tblalignment">{value.extraDays}</td>
                              {days &&
                                days.map((v) => {
                                  v = v - 1;
                                  return (
                                    <td
                                      className={`tblalignment  ${value["attendanceStatus" + v] != ""
                                          ? value["attendanceStatus" + v] == "A"
                                            ? "td-style"
                                            : value["attendanceStatus" + v] ==
                                              "L"
                                            ? "td-style2"
                                            : value["attendanceStatus" + v] ==
                                              "P" || value["attendanceStatus" + v] == "EP"
                                              ? "td-style1"
                                            : value["attendanceStatus" + v] ==
                                                "H" || value["attendanceStatus" + v] == "EH" ? "td-style4" : "td-style3"
                                          : ""
                                        }`}
                                    >
                                      {value["attendanceStatus" + v]}
                                    </td>
                                  );
                                })}
                            </tr>
                          );
                        })}
                      </tbody>
                      {attendanceData.length > 1 ?
                        <tfoot>
                          <tr className="tfoot1">
                            <th className="tblalignment"> </th>
                            <th className="tblalignment">Present</th>
                            {/* <th className="tblalignment">VMC</th> */}
                            <th className="tblalignment">
                              {sumofAllEmployeeTotalDays}
                            </th>
                            <th className="tblalignment">
                              {sumOfAllEmployeePresenty}
                            </th>
                            <th className="tblalignment">
                              {sumOfAllEmployeeAbsenty}
                            </th>
                            <th className="tblalignment">
                              {sumOfAllEmployeeLeaves}
                            </th>
                            <th className="tblalignment">
                              {sumOfAllEmployeeHalfDays}
                            </th>
                            <th className="tblalignment">
                              {extraHalfDays}
                            </th>
                            <th className="tblalignment">
                              {extraDays}
                            </th>
                            {pList &&
                              pList.map((v) => {
                                return <th className="tblalignment">{v}</th>;
                              })}
                          </tr>
                          <tr className="tfoot2">
                            <th className="tblalignment"> </th>
                            <th className="tblalignment">Half Days</th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            {hList &&
                              hList.map((v) => {
                                return <th className="tblalignment">{v}</th>;
                              })}
                          </tr>
                          <tr className="tfoot2">
                            <th className="tblalignment"> </th>
                            <th className="tblalignment">Absent</th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            {abList &&
                              abList.map((v) => {
                                return <th className="tblalignment">{v}</th>;
                              })}
                          </tr>
                          <tr className="tfoot3">
                            <th className="tblalignment"> </th>
                            <th className="tblalignment">Leave</th>
                            <th className="tblalignment"></th>
                            <th className="tblalignment"></th>
                            <th className="tblalignment"></th>
                            <th className="tblalignment"></th>
                            <th className="tblalignment"></th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            {lList &&
                              lList.map((v) => {
                                return <th className="tblalignment">{v}</th>;
                              })}
                          </tr>
                          <tr className="tfoot4">
                            <th className="tblalignment"> </th>
                            <th className="tblalignment">Total Absent & Leave</th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            {tAbAndLeaveList &&
                              tAbAndLeaveList.map((v) => {
                                return <th className="tblalignment">{v}</th>;
                              })}
                          </tr>
                          <tr className="tfoot5">
                            <th className="tblalignment"> </th>
                            <th className="tblalignment">Absent %</th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            <th className="tblalignment"> </th>
                            {absentPercentage &&
                              absentPercentage.map((v) => {
                                return <th className="tblalignment">{v}</th>;
                              })}
                          </tr>
                        </tfoot>
                        : <></>}
                    </Table>
                  </div>
                </Col>
              </Row>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default WithUserPermission(EmpMonthlyPresenty);
