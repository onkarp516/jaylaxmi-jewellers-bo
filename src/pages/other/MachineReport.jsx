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
  Table, // CardHeader,
} from "reactstrap";
import Select from "react-select";
import { WithUserPermission, isActionExist, MyDatePicker } from "@/helpers";
import { getMachineReport, listOfMachine } from "@/services/api_function";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

class MachineReport extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.state = {
      isLoading: false,
      machineData: [],
      mainData: "",
      mainInnerData: "",
      machineOpts: [],
    };
  }

  listOfMachineFun() {
    listOfMachine()
      .then((response) => {
        let machineOpts =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.machineNo,
            };
          });
        this.setState({ machineOpts: machineOpts });
      })
      .catch((error) => {
        console.log({ error });
      });
  }

  componentDidMount() {
    this.listOfMachineFun();
  }

  render() {
    const { isLoading, machineData, mainData, machineOpts } = this.state;

    return (
      <div className="emp">
        <Card>
          <CardBody className="border-bottom p-2">
            <CardTitle>Machine Report</CardTitle>

            <div>
              <Formik
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={{
                  fromDate: new Date(),
                  toDate: new Date(),
                  machineId: "",
                }}
                validationSchema={Yup.object().shape({
                  fromDate: Yup.string().required("From Date is required"),
                  toDate: Yup.string().required("To Date is required"),
                })}
                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                  this.setState({ isLoading: true, machineData: [] });
                  setStatus();
                  let requestData = {
                    fromDate: moment(values.fromDate).format("YYYY-MM-DD"),
                    toDate: moment(values.toDate).format("YYYY-MM-DD"),
                    machineId:
                      values.machineId != "" && values.machineId != null
                        ? values.machineId.value
                        : "",
                  };

                  getMachineReport(requestData)
                    .then((response) => {
                      // resetForm();
                      var result = response.data;
                      console.log({ result });
                      console.log("result.response", result.response);
                      if (result.responseStatus == 200) {
                        setSubmitting(false);
                        this.setState({
                          isLoading: false,
                          machineData: result.response,
                          mainData: "",
                          mainInnerData: "",
                        });
                      } else {
                        setSubmitting(false);
                        this.setState({ isLoading: false, machineData: [] });
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
                            Select From Date{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          {/* <Input
                            type="date"
                            name="fromDate"
                            id="fromDate"
                            onChange={handleChange}
                            value={values.fromDate}
                            invalid={errors.fromDate ? true : false}
                          />
                          <FormFeedback>{errors.fromDate}</FormFeedback> */}
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
                            Select To Date{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          {/* <Input
                            type="date"
                            name="toDate"
                            id="toDate"
                            onChange={handleChange}
                            value={values.toDate}
                            invalid={errors.toDate ? true : false}
                          />
                          <FormFeedback>{errors.toDate}</FormFeedback> */}
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
                        &nbsp;
                        <FormGroup>
                          {/* <Label for="exampleDatetime">Select Machine</Label> */}
                          <Select
                            placeholder="Select Machine"
                            ////isClearable={true}
                            styles={{
                              clearIndicator: ClearIndicatorStyles,
                            }}
                            onChange={(v) => {
                              setFieldValue("machineId", "");
                              if (v != null) {
                                setFieldValue("machineId", v);
                              }
                            }}
                            name="machineId"
                            id="machineId"
                            options={machineOpts}
                            value={values.machineId}
                            className="mt-2"
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
                            "machine-wise-production",
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

            {machineData && machineData.length > 0 && (
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
                          <th className="th-style" style={{ zIndex: 99 }}></th>
                          <th>Machine No.</th>
                          <th>Item Name</th>
                          <th>Prod. Qty.</th>
                        </tr>
                      </thead>
                      <tbody
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {machineData.map((v, i) => {
                          return (
                            <>
                              <tr>
                                <td style={{ width: "2%" }}>
                                  <Button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (parseInt(mainData) == parseInt(i))
                                        this.setState({ mainData: "" });
                                      else {
                                        this.setState({
                                          mainData: i,
                                          mainInnerData: "",
                                        });
                                      }
                                    }}
                                    className="btn-arrow-style"
                                  >
                                    {parseInt(mainData) == parseInt(i) ? (
                                      <i
                                        class="fa fa-caret-down"
                                        aria-hidden="true"
                                      ></i>
                                    ) : (
                                      <i
                                        class="fa fa-caret-right"
                                        aria-hidden="true"
                                      ></i>
                                    )}
                                  </Button>
                                </td>
                                <td>{v.machineNumber}</td>
                                <td>{v.itemName}</td>
                                <td>{v.productionQty}</td>
                              </tr>
                              {v.taskList && v.taskList.length > 0 ? (
                                <tr
                                  className={`${
                                    parseInt(mainData) == parseInt(i)
                                      ? ""
                                      : " d-none"
                                  }`}
                                >
                                  <td
                                    colSpan={20}
                                    className="bg-white inner-tbl-td"
                                    // style={{ padding: "0px" }}
                                  >
                                    <Table
                                      bordered
                                      responsive
                                      size="sm"
                                      className={`${
                                        parseInt(mainData) == parseInt(i)
                                          ? "mb-0"
                                          : "mb-0 d-none"
                                      }`}
                                    >
                                      <thead
                                        style={{
                                          background: "#FBF3D0",
                                        }}
                                        className="datastyle-head"
                                      >
                                        <tr>
                                          <th></th>
                                          <th>Employee</th>
                                          {/* <th>Item/Break</th> */}
                                          <th>Operation</th>
                                          <th>Cycle Time</th>
                                          {/* <th>Working Time</th> */}
                                          <th>Time (MIN.)</th>
                                          <th>AT (MIN.)</th>
                                          <th>Total Qty.</th>
                                          <th>REQ. Qty.</th>
                                          <th>ACT. Qty.</th>
                                          {/* <th>% Of Task</th> */}
                                          {/* <th>Remark</th> */}
                                        </tr>
                                      </thead>
                                      <tbody
                                        style={{
                                          background: "#FEFCF3",
                                          textAlign: "center",
                                        }}
                                      >
                                        {v.taskList &&
                                          v.taskList.map((vi, ii) => {
                                            return (
                                              <>
                                                <tr>
                                                  <td style={{ width: "2%" }}>
                                                    {" "}
                                                  </td>
                                                  <td>{vi.employeeName}</td>
                                                  {/* <td>
                                                    {vi.jobName != null
                                                      ? vi.jobName
                                                      : vi.breakName != null
                                                      ? vi.breakName
                                                      : "-"}
                                                  </td> */}
                                                  <td>{vi.operationName}</td>
                                                  <td>{vi.cycleTime}</td>
                                                  {/* <td>
                                                    {vi.startTime +
                                                      " - " +
                                                      vi.endTime}
                                                  </td> */}
                                                  <td>
                                                    {parseFloat(
                                                      vi.totalTime
                                                    ).toFixed(2)}
                                                  </td>
                                                  <td>
                                                    {parseFloat(
                                                      vi.actualWorkTime
                                                    ).toFixed(2)}
                                                  </td>
                                                  <td>
                                                    {parseFloat(
                                                      vi.totalCount
                                                    ).toFixed(2)}
                                                  </td>
                                                  <td>
                                                    {parseFloat(
                                                      vi.requiredProduction
                                                    ).toFixed(2)}
                                                  </td>
                                                  <td>
                                                    {parseFloat(
                                                      vi.actualProduction
                                                    ).toFixed(2)}
                                                  </td>
                                                  {/* <td>{vi.percentageOfTask}</td> */}
                                                  {/* <td>{vi.remark}</td> */}
                                                </tr>
                                              </>
                                            );
                                          })}
                                      </tbody>
                                    </Table>
                                  </td>
                                </tr>
                              ) : (
                                ""
                              )}
                            </>
                          );
                        })}
                      </tbody>
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

export default WithUserPermission(MachineReport);