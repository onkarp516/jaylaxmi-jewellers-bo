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

import { getAttendanceHistory } from "@/services/api_function";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
// import "@/assets/scss/all/react-datatable-export.css";

class AttendanceHistory extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.state = {
      isLoading: false,
      attendanceData: [],
    };
    this.innercolumns = [
      {
        name: "Machine",
        selector: "machineNumber",
        sortable: true,
        wrap: true,
      },
      {
        name: "Item/Break",
        cell: (row) =>
          row.jobName != null
            ? row.jobName
            : row.breakName != null
            ? row.breakName
            : "-",
        sortable: true,
        wrap: true,
      },
      {
        name: "Operation",
        selector: "operationName",
        sortable: true,
        wrap: true,
      },
      {
        name: "Cycle Time",
        selector: "cycleTime",
        sortable: true,
        wrap: true,
      },
      {
        name: "Working Time",
        cell: (row) => row.startTime + " - " + row.endTime,
        sortable: true,
        wrap: true,
      },
      {
        name: "Time (MIN.)",
        selector: "totalTime",
        sortable: true,
        wrap: true,
      },
      {
        name: "Actual Time (MIN.)",
        selector: "actualWorkTime",
        sortable: true,
        wrap: true,
      },
      {
        name: "Total Qty",
        selector: "totalCount",
        sortable: true,
        wrap: true,
      },
      {
        name: "REQ. Qty",
        selector: "requiredProduction",
        sortable: true,
        wrap: true,
      },
      {
        name: "ACT. Qty",
        selector: "actualProduction",
        sortable: true,
        wrap: true,
      },
      {
        name: "% Of Task",
        selector: "percentageOfTask",
        sortable: true,
        wrap: true,
      },
      {
        name: "Remark",
        selector: "remark",
        sortable: true,
        wrap: true,
      },
    ];
  }

  render() {
    const ExpandedSiteComponent = ({ data }) => (
      <DataTable
        columns={this.innercolumns}
        data={data.taskDTOList}
        pagination
      />
    );
    const attendanceColumns = [
      {
        name: "Employee Name",
        selector: "fullName",
        sortable: true,
        wrap: true,
      },
      {
        name: "In Time",
        selector: "checkInTime",
        sortable: true,
        wrap: true,
      },
      {
        name: "Out Time",
        selector: "checkOutTime",
        sortable: true,
        wrap: true,
      },
      {
        name: "Total Time",
        selector: "totalTime",
        sortable: true,
        wrap: true,
      },
      {
        name: "PRD. Qty",
        selector: "totalProdQty",
        sortable: true,
        wrap: true,
      },
      {
        name: "Work Pts",
        selector: "totalWorkPoint",
        sortable: true,
        wrap: true,
      },
      {
        name: "Wages In Hrs",
        selector: "wagesHourBasis",
        sortable: true,
        wrap: true,
      },
      {
        name: "Wages In Pts",
        selector: "wagesPointBasis",
        sortable: true,
        wrap: true,
      },
      {
        name: "Final Salary",
        selector: "finalDaySalary",
        sortable: true,
        wrap: true,
      },
    ];
    const { isLoading, attendanceData } = this.state;

    return (
      <div>
        <Card>
          <CardBody className="border-bottom p-2">
            <CardTitle>History</CardTitle>

            <div>
              <Formik
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={{
                  fromDate: "",
                  toDate: "",
                }}
                validationSchema={Yup.object().shape({
                  fromDate: Yup.string().required("From Date is required"),
                  toDate: Yup.string().required("To Date is required"),
                })}
                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                  this.setState({ isLoading: true, attendanceData: [] });
                  setStatus();
                  let requestData = {
                    fromDate: values.fromDate,
                    toDate: values.toDate,
                  };

                  getAttendanceHistory(requestData)
                    .then((response) => {
                      // resetForm();
                      var result = response.data;
                      console.log({ result });
                      console.log("result.response", result.response);
                      if (result.responseStatus == 200) {
                        setSubmitting(false);
                        this.setState({
                          isLoading: false,
                          attendanceData: result.response,
                        });
                      } else {
                        setSubmitting(false);
                        this.setState({ isLoading: false, attendanceData: [] });
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
                      <Col md="3">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            Select From Date{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            name="fromDate"
                            id="fromDate"
                            onChange={handleChange}
                            value={values.fromDate}
                            invalid={errors.fromDate ? true : false}
                          />
                          <FormFeedback>{errors.fromDate}</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            Select To Date{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            name="toDate"
                            id="toDate"
                            onChange={handleChange}
                            value={values.toDate}
                            invalid={errors.toDate ? true : false}
                          />
                          <FormFeedback>{errors.toDate}</FormFeedback>
                        </FormGroup>
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
                          <Button
                            type="submit"
                            className="mainbtn1 text-white report-show-btn"
                          >
                            Show
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Form>
                )}
              />
            </div>
            {/* <pre>{JSON.stringify(attendanceData)}</pre> */}
            {attendanceData && attendanceData.length > 0 && (
              <>
                <DataTableExtensions
                  columns={attendanceColumns}
                  data={attendanceData}
                  print={true}
                  exportHeaders={true}
                  filter={true}
                >
                  <DataTable
                    // title="Employee Data"
                    columns={this.innercolumns}
                    data={attendanceData}
                    // actions={actionsMemo}
                    pagination
                    expandableRows
                    expandableRowsComponent={<ExpandedSiteComponent />}
                  />
                </DataTableExtensions>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default AttendanceHistory;
