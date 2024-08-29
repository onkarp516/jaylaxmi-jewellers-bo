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
import { WithUserPermission, MyDatePicker } from "@/helpers";
import Select from "react-select";
import {
  create_receipts,
  listOfEmployee,
  getPayheadList,
  get_deduction_list,
  allocateAllowanceDeductions,
} from "@/services/api_function";
import { Formik, Form } from "formik";
import * as Yup from "yup";
// import { listOfCompany } from "../../services/api_function/company.service";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

const typeOpts = [
  { label: "Dr", value: "dr", type: "dr" },
  { label: "Cr", value: "cr", type: "cr" },
];

class Allocations extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.state = {
      isLoading: false,
      show: false,
      invoice_data: "",
      rows: [],
      initVal: {
        isAllowance: true,
        // empName: "",
        // employeeId: 0,
        // allocationDate: "",
        // amount:0,
      },

      voucher_edit: false,
      voucher_data: {
        voucher_sr_no: 1,
        transaction_dt: moment(new Date()).format("DD-MM-YYYY"),
        payment_dt: moment(new Date()).format("DD-MM-YYYY"),
      },
      rows: [],
      empOptions: [],
      date: "",
      allowanceData: [],
      empName: "",
      empId: 0,
      // amount: [],
      allocations: [{}],
      total: 0,
    };
  }
  // const [allocations, setallocations] = useState([{ beliverse_group: "" }]);

  // Function to handle input changes and update the total
  handleInputChange = (e, index) => {
    console.log(e);
    console.log(index);
    const { name, value } = e.target;
    const list = [...this.state.allocations];
    console.log("In belGroup change handler ", list);
    list[index][name] = value;
    this.setState({ allocations: list });
    const allowanceData = [...this.state.allowanceData];
    allowanceData[index][name] = value;

    // Calculate the total
    const total = allowanceData.reduce(
      (acc, item) => acc + parseFloat(item.amount || 0),
      0
    );

    this.setState({
      allowanceData,
      total, // Update the total
    });
  };

  // handleInputChange = (e, index) => {
  //   console.log(e);
  //   console.log(index);

  //   const { name, value } = e.target;
  //   const list = [...this.state.allocations];
  //   console.log("In belGroup change handler ", list);
  //   list[index][name] = value;
  //   this.setState({ allocations: list });
  //   // let totalVal =this.state.allocations.reduce((n, {ammount}) => n + ammount, 0);
  //   // this.setState({ total: totalVal });
  //   // const sum = list
  //   //   .map((item) => item.amount)
  //   //   .reduce((prev, curr) => prev + curr, 0);
  // };

  // sum = (arrayData, key) => {
  //   console.log(arrayData);
  //   return arrayData.reduce((a, b) => {
  //     return { amount: a.amount + b.amount };
  //   });
  // };

  listGetCompany = () => {
    listOfEmployee()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt = result.map(function (data) {
            let empName = data.firstName.trim();
            if (data.lastName != null)
              // empName = empName + " " + data.lastName.trim();
              return {
                value: data.id,
                label: data.employeeName,
              };
          });
          this.setState({ empOptions: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleRadioChange = (isAllowance) => {
    this.setState({
      // isAllowance,
      total: 0, // Reset the total to 0 when changing the "Allocations for" option
    });
  };

  getAlloCationData = (v, setFieldValue, values) => {
    console.log(setFieldValue);
    console.log(values);
    this.setState({isLoading:false})

    // console.log(v);
    // console.log(v.target.checked);
    // console.log(this.state.initVal)

    if (values.isAllowance == false) {
      getPayheadList()
        .then((response) => {
          this.handleRadioChange(true);
          let res = response.data;
          if (res.responseStatus == 200) {
            let result = res.data;
            console.log(res);
            this.setState({ allowanceData: result });
            this.setState({ allocations: result });
            this.setState({isLoading:true})

          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      get_deduction_list()
        .then((response) => {
          this.handleRadioChange(false);
          let res = response.data;
          if (res.responseStatus == 200) {
            let result = res.data;
            console.log(res);
            // this.setState({ allowanceData: result });
            this.setState({ allowanceData: result });
            this.setState({ allocations: result });
            this.setState({isLoading:true})

          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  getAlloCationDataDefault = () => {
    getPayheadList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.data;
          console.log(res);
          this.setState({ allowanceData: result });
          this.setState({ allocations: result });
          this.setState({isLoading:true})

        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  componentDidMount() {
    this.getAlloCationDataDefault();
    this.listGetCompany();
  }

  validationSchema = () => {
    return Yup.object().shape({
      allocationDate: Yup.string().required("Date is required"),
      // empName: Yup.string().required("Employee is required"),
      employeeId: Yup.object().required("Select Employee"),
      // amount: Yup.string().required("Amount is required"),
      // userName: Yup.string().trim().required("Username is required"),
      // userRole: Yup.object().required("User Role is required"),
      // companyName: Yup.object().required("Company is required"),
      // siteName: Yup.object().required("Site is required")
    });
  };

  render() {
    const { isLoading, initVal, allowanceData } = this.state;

    return (
      <div className="emp">
        <Card>
          <CardBody className="border-bottom p-2">
            <CardTitle>Create Allocations</CardTitle>

            <div>
              <Formik
                // validateOnBlur={false}
                validateOnChange={false}
                initialValues={initVal}
                enableReinitialize={true}
                innerRef={this.ref}
                validationSchema={this.validationSchema()}
                // })}
                onSubmit={(values, { resetForm, setSubmitting }) => {
                  console.log(values);
                  console.log(this.state.allocations);

                  let reqData = new FormData();
                  reqData.append(
                    "employeeId",
                    parseInt(values.employeeId.value)
                  );
                  reqData.append("isAllowance", values.isAllowance);
                  reqData.append(
                    "allocationDate",
                    moment(values.allocationDate).format("yyyy-MM-DD")
                  );
                  reqData.append(
                    "allocations",
                    JSON.stringify(this.state.allocations)
                  );

                  allocateAllowanceDeductions(reqData)
                    .then((response) => {
                      let res = response.data;
                      if (res.responseStatus == 200) {
                        toast.success("✔" + res.message);
                        this.props.history.push("/allocations");
                        // this.props.history.push("/allocations");

                        setSubmitting(false);
                        resetForm();
                        this.initRows();
                        // this.props.history.push("/receipt");
                      } else {
                        setSubmitting(false);
                        if (response.responseStatus == 409) {
                          // toast.error("✘ Please Select Ledger First");
                        } else {
                          // toast.error("✘ Please Select Ledger First");
                        }
                      }
                    })
                    .catch((error) => {
                      console.log("error", error);
                    });
                }}
                render={({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  resetForm,
                  setFieldValue,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="institute-head p-2">
                      <Row>
                        <Col md="2">
                          <FormGroup>
                            <label>
                              Allocations for
                              <span className="text-danger">*</span>
                            </label>
                            <br />
                            <FormGroup className="gender nightshiftlabel">
                              <Label>
                                <input
                                  name="isAllowance"
                                  type="radio"
                                  // value={true}
                                  checked={
                                    values.isAllowance === true ? true : false
                                  }
                                  onChange={(v) => {
                                    setFieldValue("isAllowance", true);
                                    this.getAlloCationData(
                                      v,
                                      setFieldValue,
                                      values
                                    );
                                  }}
                                  className="mr-1"
                                  // value={values.isAllowance}
                                />
                                <span>Payhead</span>
                              </Label>
                              <Label className="ml-3">
                                <input
                                  name="isAllowance"
                                  type="radio"
                                  // value={false}
                                  checked={
                                    values.isAllowance === true ? false : true
                                  }
                                  onChange={(v) => {
                                    setFieldValue("isAllowance", false);
                                    this.getAlloCationData(
                                      v,
                                      setFieldValue,
                                      values
                                    );
                                  }}
                                  className="mr-1"
                                  // value={values.isAllowance}
                                />
                                <span>Deductions</span>
                              </Label>
                            </FormGroup>
                            <span className="text-danger">
                              {errors.isAllowance && "Select Option?"}
                            </span>
                          </FormGroup>
                        </Col>
                        <Col md="4">
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
                                setFieldValue("empName", v);
                                setFieldValue("employeeId", v);
                              }}
                              name="employeeId"
                              options={this.state.empOptions}
                              value={values.employeeId}
                              className="mt-2"
                            />

                            <span className="text-danger">
                              {errors.employeeId && "Please select employee"}
                            </span>
                          </FormGroup>

                          {/* <FormGroup>
                            <Label
                              style={{
                                fontFamily: "Inter",
                                fontStyle: "normal",
                                fontWeight: 500,
                                fontSize: "14px",
                                lineHeight: "17px",
                                alignItems: "center",
                                letterSpacing: "-0.02em",
                                color: "#000000",
                              }}
                            >
                              Select Employee
                              <span className="text-danger">*</span>
                            </Label>

                            <Select
                              id="empName"
                              name="empName"
                              className="empName"
                              placeholder="Select"
                              options={this.state.empOptions}
                              // onChange={(v) => {
                              //   if (v != null) {
                              //     console.log(v);
                              //     setFieldValue("empName", v);
                              //     setFieldValue("employeeId", v.value);
                              //   } else {
                              //     setFieldValue("empName", "");
                              //   }
                              // }}

                              onChange={(v) => {
                                // console.log("e.target.value ", e.target.value);
                                if (v != null && v != "") {
                                  // console.log(e.target.value);
                                  if (v != "") {
                                    setFieldValue("empName", v);
                                    setFieldValue("employeeId", v.value);

                                    // setFieldValue("empName", e.target.value);
                                    // this.handleInputChange(e.target.value, ii);
                                  }
                                } else {
                                  setFieldValue("empName", "");
                                }
                              }}
                              value={values.empName}
                            />
                          </FormGroup> */}
                          <span className="text-danger">
                            {errors.empName && errors.empName}
                          </span>
                        </Col>

                        <Col md="2">
                          <FormGroup>
                            <Label for="exampleDatetime">Date :</Label>
                            <MyDatePicker
                              autoComplete="off"
                              className="datepic form-control"
                              name="allocationDate"
                              placeholderText="dd/MM/yyyy"
                              id="allocationDate"
                              dateFormat="dd/MM/yyyy"
                              // value={values.allocationDate}
                              selected={values.allocationDate}
                              onChange={(e) => {
                                console.log("e.target.value ", e);
                                if (e != null && e != "") {
                                  console.log(
                                    "warn:: isValid",
                                    moment(e, "dd-MM-yyyy").isValid()
                                  );
                                  if (
                                    moment(e, "dd-MM-yyyy").isValid() == true
                                  ) {
                                    setFieldValue("allocationDate", e);
                                  }
                                } else {
                                  setFieldValue("allocationDate", "");
                                }
                              }}
                              value={values.allocationDate}
                            />
                            <span className="text-danger">
                              {errors.allocationDate}
                            </span>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <Row className="px-2 mt-4">
                      <Col md="12" className="mb-3">
                        <Row>
                          <Col md="2">
                            <p className="cardheading mb-0">Allocation List:</p>
                          </Col>
                          <Col md="6"></Col>
                          <Col md="2"></Col>
                          <Col md="2"></Col>
                        </Row>
                      </Col>
                    </Row>
                    <div className="px-2 tblht">
                      {isLoading ? (
                        <Table
                          bordered
                          className="usertblbg tblresponsive"
                          style={{ width: "40%" }}
                        >
                          <thead style={{ position: "sticky", top: "0" }}>
                            <tr>
                              <th>Name</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          {this.state.allowanceData ? (
                            <tbody className="bg-white tblbtmline ">
                              {this.state.allowanceData.map((vi, ii) => {
                                return (
                                  <>
                                    <tr key={vi.id}>
                                      <td>
                                        <Label>{vi.name}</Label>
                                      </td>

                                      <td>
                                        <Input
                                          type="text"
                                          placeholder="Enter amount"
                                          id="amount"
                                          name="amount"
                                          onChange={(e) =>
                                            this.handleInputChange(e, ii)
                                          }
                                          value={vi.amount || ""}
                                          // value={vi.amount}
                                        />
                                        {/* <FormFeedback>{errors.amount}</FormFeedback> */}
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                            </tbody>
                          ) : (
                            <Spinner size="lg" color="secondary" />
                          )}
                        </Table>
                      ) : (
                        <Spinner size="lg" color="secondary" />
                      )}
                      <span className="text-danger">
                        {errors.amount && errors.amount}
                      </span>
                    </div>
                    <div className="tbl-body-style-new">
                      <Table size="sm" className="tbl-font mt-2 mb-2"></Table>
                    </div>
                    {/* Display the total */}
                    <Row className="mb-2 pl-4">
                      <Col sm={9}>
                        <Row className="mt-2" style={{ fontSize: "20px" }}>
                          Total: {this.state.total.toFixed(2)}
                        </Row>
                      </Col>
                    </Row>
                    <Row className="py-1">
                      <Col className="text-end">
                        <Button type="submit" className="successbtn-style me-2">
                          Submit
                        </Button>

                        <Button
                          className="cancel-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            this.props.history.push("/receipt");
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default WithUserPermission(Allocations);
