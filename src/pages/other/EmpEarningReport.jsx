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
import { WithUserPermission, isActionExist, MyDatePicker } from "@/helpers";
import Select from "react-select";
import {
  getEmployeeEarningReport,
  listOfEmployee,
} from "@/services/api_function";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

class EmpEarningReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      sumData: "",
      empEarningData: [],
      empOpts: [],
    };
  }

  getEmpOptions = () => {
    listOfEmployee()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt1 = [];
          result.map(function (data) {
            opt1.push({
              value: data.id,
              label: data.employeeName,
            });
          });
          this.setState({ empOpts: opt1 });
        } else {
          this.setState({ empOpts: [] });
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
    const { isLoading, itemData, mainData, empEarningData, sumData, empOpts } =
      this.state;

    return (
      <div className="emp">
        <Card>
          <CardBody className="border-bottom p-2">
            <CardTitle>Employee Earning Report</CardTitle>

            <div>
              <Formik
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={{
                  fromDate: new Date(),
                  toDate: new Date(),
                  empId: "",
                }}
                validationSchema={Yup.object().shape({
                  fromDate: Yup.string().required("From Date is required"),
                  toDate: Yup.string().required("To Date is required"),
                })}
                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                  this.setState({
                    isLoading: true,
                    sumData: "",
                    empEarningData: [],
                  });
                  setStatus();
                  let requestData = new FormData();
                  requestData.append(
                    "fromDate",
                    moment(values.fromDate).format("YYYY-MM-DD")
                  );
                  requestData.append(
                    "toDate",
                    moment(values.toDate).format("YYYY-MM-DD")
                  );
                  requestData.append("empId", values.empId);

                  getEmployeeEarningReport(requestData)
                    .then((response) => {
                      var result = response.data;
                      console.log("result.response", result.empEarningData);
                      if (result.responseStatus == 200) {
                        setSubmitting(false);
                        this.setState({
                          isLoading: false,
                          empEarningData: result.empEarningData,
                          sumData: result.sumData,
                        });
                        toast.success("✔ " + result.message);
                      } else {
                        setSubmitting(false);
                        this.setState({
                          isLoading: false,
                          empEarningData: [],
                          sumData: [],
                        });
                        toast.error("✘ No Data Found");
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
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            From Date <span className="text-danger">*</span>
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
                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            To Date <span className="text-danger">*</span>
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
                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">Select Employee</Label>
                          <Select
                            placeholder="Select Employee"
                            ////isClearable={true}
                            styles={{
                              clearIndicator: ClearIndicatorStyles,
                            }}
                            onChange={(v) => {
                              console.log("emp id ", v);
                              setFieldValue("empId", "");
                              if (v != null) {
                                setFieldValue("empId", v.value);
                              }
                            }}
                            name="empId"
                            id="empId"
                            options={empOpts}
                            value={values.id}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        {isLoading ? (
                          <Button
                            className="mainbtn1 text-white mr-2 report-show-btn"
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
                            "emp-earning-report",
                            "view",
                            this.props.userPermissions
                          ) && (
                            <Button
                              type="submit"
                              className="mainbtn1 text-white mr-2 report-show-btn"
                            >
                              Show
                            </Button>
                          )
                        )}
                      </Col>
                    </Row>
                  </Form>
                )}
              />
            </div>

            {empEarningData && empEarningData.length > 0 ? (
              <Row>
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
                          <th>Employee Name</th>
                          <th>Hour Wise Salary</th>
                          <th>Piece Wise Salary</th>
                          <th>Day Wise Salary</th>
                          <th>Point Wise Salary</th>
                        </tr>
                      </thead>
                      <tbody
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {empEarningData.map((v, i) => {
                          return (
                            <>
                              <tr>
                                <td>{v.employeeName}</td>
                                <td>{parseFloat(v.hourSalary).toFixed(2)}</td>
                                <td>{parseFloat(v.pieceSalary).toFixed(2)}</td>
                                <td>{parseFloat(v.daySalary).toFixed(2)}</td>
                                <td>{parseFloat(v.pointSalary).toFixed(2)}</td>
                              </tr>
                            </>
                          );
                        })}
                        <tr>
                          <td style={{ fontWeight: "bold" }}>TOTAL</td>
                          <td style={{ fontWeight: "bold" }}>
                            {parseFloat(sumData.hourSum).toFixed(2)}
                          </td>
                          <td style={{ fontWeight: "bold" }}>
                            {parseFloat(sumData.pieceSum).toFixed(2)}
                          </td>
                          <td style={{ fontWeight: "bold" }}>
                            {parseFloat(sumData.daySum).toFixed(2)}
                          </td>
                          <td style={{ fontWeight: "bold" }}>
                            {parseFloat(sumData.pointSum).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col md="12">
                  <div className="attendance-tbl">
                    <Table bordered size="sm" className="main-tbl-style">
                      <tr>
                        <td>No Data Exists</td>
                      </tr>
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

export default WithUserPermission(EmpEarningReport);
