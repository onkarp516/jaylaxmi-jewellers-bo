import React, { Component, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";

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
} from "reactstrap";
import { WithUserPermission, isActionExist } from "@/helpers";
import {
  getEmployeePaymentSheet,
  listOfCompany,
} from "@/services/api_function";
import { getExcelEmployeePaymentSheetUrl } from "@/services/api";
import { getHeader } from "@/helpers";
import moment from "moment";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Select, { components } from "react-select";
import { TramRounded } from "@material-ui/icons";

const CustomClearText = () => "clear all";
const ClearIndicator = (props) => {
  const {
    children = <CustomClearText />,
    getStyles,
    innerProps: { ref, ...restInnerProps },
  } = props;
  return (
    <div
      {...restInnerProps}
      ref={ref}
      style={getStyles("clearIndicator", props)}
    >
      <div style={{ padding: "0px 5px" }}>{children}</div>
    </div>
  );
};
const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

class EmpSalarySheet extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      isLoading: false,
      empOpt: [],
      salaryShit: [],
      companyOpt: [],
      totalObject: "",
    };
  }

  getCompanyOptions = () => {
    listOfCompany()
      .then((response) => {
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
              label: data.companyName,
            });
          });

          this.setState({ companyOpt: opt1 }, () => {
            this.myRef.current.setFieldValue("companyId", opt1[0]);
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  exportData = (values) => {
    this.setState({ isLoading: true });
    let filename =
      "emp_salary_sheet_" +
      moment(values.yearMonth).format("YYYY-MM") +
      ".xlsx";

    const requestOption = {
      method: "GET",
      headers: getHeader(),
    };

    let companyId =
      values.companyId != null && values.companyId != ""
        ? values.companyId.value
        : "all";

    return fetch(
      getExcelEmployeePaymentSheetUrl(values.yearMonth, companyId),
      requestOption
    )
      .then((response) => response.blob())
      .then((blob) => {
        this.setState({ isLoading: false });
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
    this.getCompanyOptions();
  }

  render() {
    const { isLoading, salaryShit, totalObject, companyOpt } = this.state;

    return (
      <div className="emp">
        <Card>
          <CardBody className="border-bottom p-2">
            <CardTitle>View Salary Sheet</CardTitle>

            <div>
              <Formik
                validateOnBlur={false}
                validateOnChange={false}
                innerRef={this.myRef}
                initialValues={{
                  fromDate: "",
                  toDate: "",
                  companyId: "",
                  yearMonth: moment(new Date()).format("YYYY-MM"),
                }}
                validationSchema={Yup.object().shape({
                  yearMonth: Yup.string().required("Month is required"),
                })}
                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                  this.setState({ isLoading: true, salaryShit: [] });
                  setStatus();
                  let requestData = {
                    yearMonth: values.yearMonth,
                    companyId:
                      values.companyId != null && values.companyId != ""
                        ? values.companyId.value
                        : "all",
                  };

                  getEmployeePaymentSheet(requestData)
                    .then((response) => {
                      // resetForm();
                      var result = response.data;
                      console.log({ result });
                      console.log("result.response", result.response);
                      if (result.responseStatus == 200) {
                        setSubmitting(false);

                        let data = result.response;
                        data["month"] = values.fromMonth;
                        this.setState({
                          isLoading: false,
                          salaryShit: data,
                          totalObject: result.totalObject,
                        });
                      } else {
                        setSubmitting(false);
                        this.setState({ isLoading: false, salaryShit: [] });
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
                            Select Month <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="month"
                            name="yearMonth"
                            id="yearMonth"
                            onChange={handleChange}
                            value={values.yearMonth}
                            invalid={errors.yearMonth ? true : false}
                          />
                          <FormFeedback>{errors.yearMonth}</FormFeedback>
                        </FormGroup>
                      </Col>

                      <Col md="2">
                        <FormGroup>
                          <Label htmlFor="employeeType">
                            Company <span className="text-danger">*</span>
                          </Label>
                          <Select
                            styles={{
                              clearIndicator: ClearIndicatorStyles,
                            }}
                            placeholder="Select Employee"
                            //isClearable={true}
                            options={companyOpt}
                            onChange={(v) => {
                              setFieldValue("companyId", "");
                              if (v != null) setFieldValue("companyId", v);
                            }}
                            name="companyId"
                            value={values.companyId}
                          />
                          <span className="text-danger">
                            {errors.companyId && errors.companyId}
                          </span>
                        </FormGroup>
                      </Col>

                      <Col md="1">
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
                            "employee-salary-sheet",
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
                      </Col>

                      <Col md="2">
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
                          <>
                            <Button
                              type="button"
                              className="mainbtn1 text-white report-show-btn"
                              onClick={(e) => {
                                e.preventDefault();

                                if (values.yearMonth != "") {
                                  this.exportData(values);
                                }
                              }}
                            >
                              Export To Excel
                            </Button>
                          </>
                        )}
                      </Col>
                    </Row>
                  </Form>
                )}
              />
            </div>

            <div className="attendance-tbl">
              <Table bordered size="sm" className="main-tbl-style">
                <thead
                  style={{
                    backgroundColor: "#F6F5F7",
                  }}
                  className="datastyle-head"
                >
                  <tr>
                    <th>Sr. No.</th>
                    <th>Employee Name</th>
                    <th>Company</th>
                    <th>Days</th>
                    <th>WH(HR)</th>
                    <th>WPH</th>
                    <th>Day Wages</th>
                    <th>Hour Wages</th>
                    <th>Point Wages</th>
                    <th>Pcs Wages</th>
                    <th>Total Salary</th>
                    <th>Basic</th>
                    <th>Spl. Allowance</th>
                    {/* <th>P/F</th> */}
                    {/* <th>ESI</th> */}
                    <th>Total Ded.</th>
                    <th>Payable</th>
                    <th>Advance</th>
                    <th>Incentive</th>
                    <th>Net Payable</th>
                  </tr>
                </thead>
                <tbody
                  style={{
                    textAlign: "center",
                  }}
                >
                  {salaryShit.length > 0 &&
                    salaryShit.map((v, i) => {
                      return (
                        <>
                          <tr>
                            <td style={{ width: "2%" }}>{i + 1}</td>
                            <td>{v.employeeName}</td>
                            <td>{v.companyName}</td>
                            <td>{v.days}</td>
                            <td>{v.workingHour}</td>
                            <td>{v.perHourSalary}</td>
                            <td>{v.netSalaryInDays}</td>
                            <td>{v.netSalaryInHours}</td>
                            <td>{v.netSalaryInPoints}</td>
                            <td>{v.netSalaryInPcs}</td>
                            <td>{v.netSalary}</td>
                            {/* <td>{v.basic + "(" + v.basicPer + "%)"}</td> */}
                            <td>{v.basic}</td>
                            <td>{v.specialAllowance}</td>
                            {/* <td>{v.pf + "(" + v.pfPer + "%)"}</td> */}
                            {/* <td>{v.pf}</td> */}
                            {/* <td>{v.esi + "(" + v.esiPer + "%)"}</td> */}
                            {/* <td>{v.esi}</td> */}
                            <td>{v.totalDeduction}</td>
                            <td>{v.payableAmount}</td>
                            <td>{v.advance}</td>
                            <td>{v.incentive}</td>
                            <td>{v.netPayableAmount}</td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
                <thead
                  style={{
                    backgroundColor: "#F6F5F7",
                  }}
                  className="datastyle-head"
                >
                  <tr>
                    <th colSpan={3}>Total</th>
                    <th>{totalObject.totalDs}</th>
                    <th>{totalObject.totalWH}</th>
                    <th>{totalObject.totalPHS}</th>
                    <th>{totalObject.totalSD}</th>
                    <th>{totalObject.totalSH}</th>
                    <th>{totalObject.totalSPt}</th>
                    <th>{totalObject.totalSPcs}</th>
                    <th>{totalObject.totalNS}</th>
                    <th>{totalObject.totalBc}</th>
                    <th>{totalObject.totalSA}</th>
                    <th>{totalObject.totalPf}</th>
                    <th>{totalObject.totalEi}</th>
                    <th>{totalObject.totalTD}</th>
                    <th>{totalObject.totalPA}</th>
                    <th>{totalObject.totalAdv}</th>
                    <th>{totalObject.totalIve}</th>
                    <th>{totalObject.totalNPA}</th>
                  </tr>
                </thead>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default WithUserPermission(EmpSalarySheet);
