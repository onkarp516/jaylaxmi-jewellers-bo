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
      id: 2,
      name: "Personal LEave ",
      isPaid: "false",
      status: true,
      createdBy: null,
      createdAt: "2022-03-21T20:05:12",
      updatedBy: null,
      updatedAt: null,
    },
    {
      id: 1,
      name: "Casual Leave",
      isPaid: "false",
      status: true,
      createdBy: null,
      createdAt: "2022-03-13T13:22:22",
      updatedBy: null,
      updatedAt: null,
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
                <h4>LEAVE TYPE</h4>
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
                            <Input type="checkbox" name="isPaid" /> Leave Type
                            Name
                          </Label>
                        </FormGroup>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-1" className="drpdstyle">
                        <FormGroup check className="nightshiftlabel">
                          <Label check>
                            <Input type="checkbox" name="isPaid" /> Is Paid?
                          </Label>
                        </FormGroup>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-2" className="drpdstyle">
                        <FormGroup check className="nightshiftlabel">
                          <Label check>
                            <Input type="checkbox" name="isPaid" /> Created At
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
                    Leave Type Name
                  </p>
                ),
                accessor: "name",
                Cell: (props) => (
                  <p style={{ textAlign: "left" }} className="mb-0">
                    {props.original.name}
                  </p>
                ),
              },
              {
                Header: "Is Paid?",
                accessor: "isPaid",
              },
              {
                Header: "Created At",
                accessor: "createdAt",
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
          {/* create Modal */}
          <Modal
            className="modal-lg p-2"
            isOpen={createModal}
            toggle={() => {
              createModalShow();
            }}
          >
            <ModalHeader
              className="modalheader-style p-2"
              toggle={() => {
                createModalShow();
              }}
              // style={{ width: "100%" }}
            >
              Create Leave Type:
              <CloseButton
                className="pull-right"
                onClick={() => {
                  setCreateModal(false);
                }}
              />
            </ModalHeader>

            <Form autoComplete="off">
              <ModalBody>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Leave Type Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter break name"
                        name="name"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="2">
                    <FormGroup>
                      <Label for="checkbox2">Is Paid?</Label>
                      <FormGroup check className="nightshiftlabel">
                        <Label check>
                          <Input type="checkbox" name="isPaid" /> Yes
                        </Label>
                      </FormGroup>
                    </FormGroup>
                  </Col>
                </Row>
              </ModalBody>

              <ModalFooter className="p-2">
                <Button type="submit" className="mainbtn1 text-white">
                  Create
                </Button>

                <Button
                  className="mainbtn1 modalcancelbtn"
                  type="button"
                  onClick={() => {
                    setCreateModal(false);
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
          {/* Update Modal */}
          <Modal
            className="modal-lg p-2"
            isOpen={editModal}
            toggle={() => {
              onEditModalShow();
            }}
          >
            <ModalHeader
              className="p-2 modalheader-style"
              toggle={() => {
                onEditModalShow();
              }}
            >
              Update Leave Type
              <CloseButton
                className="pull-right"
                onClick={() => {
                  setEditModal(false);
                }}
              />
            </ModalHeader>

            <Form autoComplete="off">
              <ModalBody>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Leave Type Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter leave type name"
                        name="name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <Label for="checkbox2">Is Paid?</Label>
                      <FormGroup check className="nightshiftlabel">
                        <Label check>
                          <Input type="checkbox" name="isPaid" /> Yes
                        </Label>
                      </FormGroup>
                      {/* </Col> */}
                    </FormGroup>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter className="p-2">
                <Button type="submit" className="mainbtn1 text-white">
                  Update
                </Button>

                <Button
                  className="mainbtn1 modalcancelbtn"
                  type="button"
                  onClick={() => {
                    setEditModal(false);
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
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
