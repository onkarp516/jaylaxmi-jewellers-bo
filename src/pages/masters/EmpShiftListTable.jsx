import React, { useState, useEffect, Suspense } from "react";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Card,
  CardBody,
  CardTitle,
  Button,
  Form,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CustomInput,
} from "reactstrap";
import { CloseButton, Dropdown } from "react-bootstrap";
import moment from "moment";
import "react-table/react-table.css";
import Select from "react-select";
import ReactTable from "react-table";
import "@/assets/scss/all/custom/emp.scss";
import treeTableHOC from "react-table/lib/hoc/treeTable";

import {
  todayEmployeeAttendance,
  todayEmployeeTaskData,
  deleteLeaveType,
} from "@/services/api_function";
const TreeTable = treeTableHOC(ReactTable);

export default function dashboard(props) {
  const [taskModal, setTaskModalShow] = useState(false);
  const treedata = [
    {
      id: 7,
      fromDate: "2022-06-20",
      toDate: "2022-06-27",
      employeeName: "Shivsai Ramesh Gundeti",
      shiftName: "1st Shift",
      createdBy: null,
      createdAt: null,
      updatedBy: null,
      updatedAt: null,
      status: null,
    },
    {
      id: 8,
      fromDate: "2022-06-04",
      toDate: "2022-06-16",
      employeeName: "Ghalappa Najunde",
      shiftName: "2nd Shift",
      createdBy: null,
      createdAt: null,
      updatedBy: null,
      updatedAt: null,
      status: null,
    },
    {
      id: 9,
      fromDate: "2022-06-02",
      toDate: "2022-06-21",
      employeeName: "Ghalappa Najunde",
      shiftName: "1st Shift",
      createdBy: null,
      createdAt: null,
      updatedBy: null,
      updatedAt: null,
      status: null,
    },
    {
      id: 10,
      fromDate: "2022-06-01",
      toDate: "2022-06-14",
      employeeName: "Abhishek Chavan",
      shiftName: "2nd Shift",
      createdBy: null,
      createdAt: null,
      updatedBy: null,
      updatedAt: null,
      status: null,
    },
    {
      id: 11,
      fromDate: "2022-06-01",
      toDate: "2022-06-14",
      employeeName: "Ibrahim Shaik",
      shiftName: "2nd Shift",
      createdBy: null,
      createdAt: null,
      updatedBy: null,
      updatedAt: null,
      status: null,
    },
    {
      id: 12,
      fromDate: "2022-06-01",
      toDate: "2022-06-08",
      employeeName: "Ghalappa Najunde",
      shiftName: "2nd Shift",
      createdBy: null,
      createdAt: null,
      updatedBy: null,
      updatedAt: null,
      status: null,
    },
    {
      id: 13,
      fromDate: "2022-06-02",
      toDate: "2022-06-01",
      employeeName: "Ghalappa Najunde",
      shiftName: "2nd Shift",
      createdBy: null,
      createdAt: null,
      updatedBy: null,
      updatedAt: null,
      status: null,
    },
  ];
  console.warn("treedata :", treedata);

  const [attendanceData, setAttendanceData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const createModalShow = () => {
    setCreateModal(true);
  };
  const onEditModalShow = () => {
    setEditModal(true);
  };
  const onDeleteModalShow = () => {
    setDeleteModal(true);
  };
  const getAttendanceData = () => {
    let reqData = {
      id: 1,
    };
    todayEmployeeAttendance(reqData)
      .then((response) => {
        let res = response.data;
        console.log({ res });
        if (res.responseStatus == 200) {
          setAttendanceData(res.response);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getTaskData = (attendanceId) => {
    let reqData = {
      attendanceId: attendanceId,
    };
    todayEmployeeTaskData(reqData)
      .then((response) => {
        let res = response.data;
        console.log({ res });
        if (res.responseStatus == 200) {
          setTaskData(res.response);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getAttendanceData();
  }, []);
  const ClearIndicatorStyles = (base, state) => ({
    ...base,
    cursor: "pointer",
    color: state.isFocused ? "blue" : "black",
  });
  return (
    <div>
      {
        <div className="container-fluid">
          <Row>
            <Col md="9">
              <div className="searchprdct mt-4">
                <h4>Employee Shift List</h4>
              </div>
            </Col>

            {/* <Col md="2"></Col> */}

            <Col md="2">
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
            <Col md="1">
              <>
                <button
                  title="CREATE"
                  onClick={(e) => {
                    e.preventDefault();
                    createModalShow();
                  }}
                  className="mt-4 addbtn"
                >
                  <i className="fa fa-plus"></i>
                </button>
              </>
              <FormGroup className="mt-3 float-right">
                <div
                  className="dropdowncheck dropdown d-flex"
                  //style={{ marginLeft: "61px" }}
                >
                  <Dropdown
                    className="mt-2 "
                    onSelect={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Dropdown.Toggle
                      // variant="success"
                      id="dropdown-basic"
                    ></Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1" className="drpdstyle">
                        <FormGroup check className="nightshiftlabel">
                          <Label check>
                            <Input type="checkbox" name="isPaid" /> From Date
                          </Label>
                        </FormGroup>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-1" className="drpdstyle">
                        <FormGroup check className="nightshiftlabel">
                          <Label check>
                            <Input type="checkbox" name="isPaid" /> To Date
                          </Label>
                        </FormGroup>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-1" className="drpdstyle">
                        <FormGroup check className="nightshiftlabel">
                          <Label check>
                            <Input type="checkbox" name="isPaid" /> Shift Name
                            Of
                          </Label>
                        </FormGroup>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-2" className="drpdstyle">
                        <FormGroup check className="nightshiftlabel">
                          <Label check>
                            <Input type="checkbox" name="isPaid" /> Employee
                            Name
                          </Label>
                        </FormGroup>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-3" className="drpdstyle">
                        <FormGroup check className="nightshiftlabel">
                          <Label check>
                            <Input type="checkbox" name="isPaid" /> Action
                          </Label>
                        </FormGroup>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </FormGroup>
            </Col>
          </Row>
          {/* <Card>
            <CardBody> */}

          <ReactTable
            data={treedata}
            columns={[
              {
                Header: (
                  <p style={{ textAlign: "left" }} className="mb-0">
                    From Date
                  </p>
                ),
                accessor: "fromDate",
                Cell: (props) => (
                  <p style={{ textAlign: "left" }} className="mb-0">
                    {props.original.name}
                  </p>
                ),
              },
              {
                Header: "To Date",
                accessor: "toDate",
              },
              {
                Header: "Shift Name",
                accessor: "shiftName",
              },
              {
                Header: "Employee Name",
                accessor: "employeeName",
              },

              {
                //width: 300,
                Header: "Action",
                accessor: "name",
                Cell: ({ cell }) => (
                  <>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        onEditModalShow();
                      }}
                      color="white"
                      size="sm"
                      round="true"
                      icon="true"
                    >
                      <i className="fa fa-edit" style={{ color: "#ffb22b" }} />
                    </Button>

                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        onDeleteModalShow();
                      }}
                      color="white"
                      size="sm"
                      round="true"
                      icon="true"
                    >
                      <i className="fa fa-trash" style={{ color: "red" }} />
                    </Button>
                  </>
                ),
              },
            ]}
            defaultPageSize={20}
            style={{
              height: "70vh",
            }}
            className=""
          />
          {/* </CardBody>
          
          </Card> */}

          {/* Delete Modal */}
          <Modal
            className="modal-md p-2"
            isOpen={deleteModal}
            toggle={() => {
              onDeleteModalShow();
            }}
          >
            <Form autoComplete="off">
              <ModalBody>
                <h2 className="text-center deletepopup">Are You Sure?</h2>
                <h6 className="text-center deletecontent">
                  You won't be able to revert this!
                </h6>
              </ModalBody>
              <div className="text-center pb-4">
                <Button
                  type="submit"
                  className="mainbtn1 text-white mr-3"
                  style={{ backgroundColor: "red" }}
                >
                  Delete
                </Button>

                <Button
                  className="mainbtn1 modalcancelbtn"
                  type="button"
                  onClick={() => {
                    setDeleteModal(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Modal>
        </div>

        //  : ("")
      }
      {/* <Spinner /> */}
    </div>
  );
}
