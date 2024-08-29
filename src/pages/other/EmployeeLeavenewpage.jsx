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
      id: 20,
      employeeName: "Kailash Pogul",
      leaveName: "Personal Leave ",
      fromDate: "2022-05-06",
      toDate: "2022-05-07",
      totalDays: 2,
      reason: "half day for 2 days 1.00pm to 3.30 pm ,for family  reasons ",
      leaveStatus: "Pending",
      leaveApprovedBy: null,
      leaveRemark: null,
      status: true,
      createdBy: 16,
      updatedBy: null,
      createdAt: "2022-05-05T18:29:44",
      updatedAt: null,
    },
    {
      id: 19,
      employeeName: "Bhagyesh Sharanappa Pujari",
      leaveName: "Personal Leave ",
      fromDate: "2022-05-05",
      toDate: "2022-05-06",
      totalDays: 2,
      reason:
        "सर मला 2 दिवस सुट्टी हवी आहे. कारण शेता कडे काम आहे Karnatak madhe काम आहे तरी माझी सुट्टी मंजूर करण्यात यावी अशी मी आपणांस विनंती करतो🙏",
      leaveStatus: "Pending",
      leaveApprovedBy: null,
      leaveRemark: null,
      status: true,
      createdBy: 18,
      updatedBy: null,
      createdAt: "2022-05-03T21:57:30",
      updatedAt: null,
    },
    {
      id: 18,
      employeeName: "Lavanya Shitole",
      leaveName: "Personal Leave ",
      fromDate: "2022-04-30",
      toDate: "2022-05-02",
      totalDays: 3,
      reason: " आत्याच्या मुलाचं लग्न आहे म्हणून.",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: "OK",
      status: true,
      createdBy: 8,
      updatedBy: null,
      createdAt: "2022-04-29T21:36:14",
      updatedAt: null,
    },
    {
      id: 17,
      employeeName: "Rahul Pola",
      leaveName: "Casual Leave",
      fromDate: "2022-04-24",
      toDate: "2022-04-25",
      totalDays: 2,
      reason: "A",
      leaveStatus: "Pending",
      leaveApprovedBy: null,
      leaveRemark: null,
      status: true,
      createdBy: 28,
      updatedBy: null,
      createdAt: "2022-04-23T11:50:02",
      updatedAt: null,
    },
    {
      id: 16,
      employeeName: "Rahul Pola",
      leaveName: "Casual Leave",
      fromDate: "2022-04-25",
      toDate: "2022-04-29",
      totalDays: 5,
      reason: "all all ep cm",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: "only 25-27 have to take leave",
      status: true,
      createdBy: 28,
      updatedBy: null,
      createdAt: "2022-04-23T11:46:59",
      updatedAt: null,
    },
    {
      id: 15,
      employeeName: "Balmani Tavti",
      leaveName: "Personal Leave ",
      fromDate: "2022-04-24",
      toDate: "2022-04-24",
      totalDays: 1,
      reason: "भावाच्या मुलांचं नामकरण आहे...",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: "Ok",
      status: true,
      createdBy: 30,
      updatedBy: null,
      createdAt: "2022-04-22T11:56:54",
      updatedAt: null,
    },
    {
      id: 14,
      employeeName: "Ibrahim Shaik",
      leaveName: "Casual Leave",
      fromDate: "2022-04-21",
      toDate: "2022-04-21",
      totalDays: 1,
      reason:
        "मला दिनांक 21/4/22या दिवशी मला सुट्टी हवी आहे. ITI मध्ये काम आहे सर .  माझी सुट्टी मंजूर करण्यात यावी अशी मी आपणांस विनंती करतो🙏",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: "Ok",
      status: true,
      createdBy: 4,
      updatedBy: null,
      createdAt: "2022-04-20T13:18:55",
      updatedAt: null,
    },
    {
      id: 13,
      employeeName: "Govardhan Chavan",
      leaveName: "Personal Leave ",
      fromDate: "2022-04-23",
      toDate: "2022-04-24",
      totalDays: 2,
      reason: "rcm training",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: "Ok",
      status: true,
      createdBy: 7,
      updatedBy: null,
      createdAt: "2022-04-17T12:36:32",
      updatedAt: null,
    },
    {
      id: 12,
      employeeName: "Atharva Vibhute",
      leaveName: "Personal Leave ",
      fromDate: "2022-04-17",
      toDate: "2022-04-17",
      totalDays: 1,
      reason:
        "माझ्या मावशी च्या मुलाचं लग्न असल्यामुळे मी फॅमिली सोबत गावी जात आहे त्या मुळे माझी सुट्टी मंजूर करावी ही विनंती 🙏",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: "OK",
      status: true,
      createdBy: 5,
      updatedBy: null,
      createdAt: "2022-04-16T19:26:08",
      updatedAt: null,
    },
    {
      id: 11,
      employeeName: "Jamir Shaikh",
      leaveName: "Personal Leave ",
      fromDate: "2022-04-17",
      toDate: "2022-04-20",
      totalDays: 3,
      reason: " family eshoe",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: "OK",
      status: true,
      createdBy: 36,
      updatedBy: null,
      createdAt: "2022-04-14T16:38:23",
      updatedAt: null,
    },
    {
      id: 10,
      employeeName: "Aarti A Kamble",
      leaveName: "Casual Leave",
      fromDate: "2022-04-17",
      toDate: "2022-04-18",
      totalDays: 2,
      reason:
        " Dr Babasaheb Ambedkar  jayanti mirvnuk 17 april 2022 ya diwahi aslya karnane mla tya diwshi sutti havi ahe anni ghari pahune yetil ya  karnane mla 18 april  2022 ya diwahi pn sutti haavi ahe mazi sutti manjur karavi hi vinanti 🙏",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: "ONE DAY APPROVED",
      status: true,
      createdBy: 32,
      updatedBy: null,
      createdAt: "2022-04-14T15:33:56",
      updatedAt: null,
    },
    {
      id: 9,
      employeeName: "Bhagyesh Sharanappa Pujari",
      leaveName: "Personal Leave ",
      fromDate: "2022-04-14",
      toDate: "2022-04-16",
      totalDays: 3,
      reason:
        "सर मला 3 दिवस सुट्टी हवी आहे. कारण  भावाच लग्न आहे तरी माझी सुट्टी मंजूर करण्यात यावी अशी मी आपणांस विनंती करतो🙏",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: null,
      status: true,
      createdBy: 18,
      updatedBy: null,
      createdAt: "2022-04-08T16:25:41",
      updatedAt: null,
    },
    {
      id: 8,
      employeeName: "Pavan Narayan Pogul",
      leaveName: "Casual Leave",
      fromDate: "2022-04-23",
      toDate: "2022-04-25",
      totalDays: 3,
      reason: "3 दिवसाची सुटी पाहिजे करण चुलत भवाचं लग्न आहे",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: "1 DAY LEAVE APPD.",
      status: true,
      createdBy: 19,
      updatedBy: null,
      createdAt: "2022-04-04T19:10:06",
      updatedAt: null,
    },
    {
      id: 7,
      employeeName: "Kailash Pogul",
      leaveName: "Personal Leave ",
      fromDate: "2022-04-02",
      toDate: "2022-04-02",
      totalDays: 1,
      reason: " half day leave half day leave garbhvati karna",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: "OK",
      status: true,
      createdBy: 16,
      updatedBy: null,
      createdAt: "2022-04-01T14:07:37",
      updatedAt: null,
    },
    {
      id: 6,
      employeeName: "Balmani Tavti",
      leaveName: "Casual Leave",
      fromDate: "2022-04-02",
      toDate: "2022-04-02",
      totalDays: 1,
      reason: "Festival Tomorrow...",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: "OK",
      status: true,
      createdBy: 30,
      updatedBy: null,
      createdAt: "2022-04-01T12:47:44",
      updatedAt: null,
    },
    {
      id: 5,
      employeeName: "Rahul Pola",
      leaveName: "Casual Leave",
      fromDate: "2022-04-01",
      toDate: "2022-04-03",
      totalDays: 3,
      reason: "vhggg",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: null,
      status: true,
      createdBy: 28,
      updatedBy: null,
      createdAt: "2022-04-01T12:41:09",
      updatedAt: null,
    },
    {
      id: 4,
      employeeName: "Ibrahim Shaik",
      leaveName: "Personal Leave ",
      fromDate: "2022-03-30",
      toDate: "2022-03-30",
      totalDays: 1,
      reason:
        "sir maza hat lai dukhat ahe tiya mode me aj kama var yu shakat nahi mazi sutti manjur karave ....c/f",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: "ok",
      status: true,
      createdBy: 4,
      updatedBy: null,
      createdAt: "2022-03-30T09:32:34",
      updatedAt: null,
    },
    {
      id: 3,
      employeeName: "Atharva Vibhute",
      leaveName: "Personal Leave ",
      fromDate: "2022-03-30",
      toDate: "2022-03-31",
      totalDays: 2,
      reason:
        "सर मी आजारी आहे खूप च आजारी आहे सर त्यामुळे मी येऊ शकत नाही सर तरी माजी सुट्टी मंजूर करावी ही विनंती🙏",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: "OK",
      status: true,
      createdBy: 5,
      updatedBy: null,
      createdAt: "2022-03-30T08:38:47",
      updatedAt: null,
    },
    {
      id: 2,
      employeeName: "Pavan Narayan Pogul",
      leaveName: "Personal Leave ",
      fromDate: "2022-03-22",
      toDate: "2022-03-22",
      totalDays: 1,
      reason: "holi ",
      leaveStatus: "Rejected",
      leaveApprovedBy: "superadmin",
      leaveRemark: "not holiday",
      status: true,
      createdBy: 19,
      updatedBy: null,
      createdAt: "2022-03-21T20:05:44",
      updatedAt: null,
    },
    {
      id: 1,
      employeeName: "Kailash Pogul",
      leaveName: "Casual Leave",
      fromDate: "2022-03-25",
      toDate: "2022-03-26",
      totalDays: 2,
      reason: "family function ",
      leaveStatus: "Approved",
      leaveApprovedBy: "superadmin",
      leaveRemark: "OK",
      status: true,
      createdBy: 16,
      updatedBy: null,
      createdAt: "2022-03-18T07:06:04",
      updatedAt: null,
    },
  ];
  console.warn("treedata :", treedata);

  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const createModalShow = () => {
    setCreateModal(true);
  };
  const onEditModalShow = () => {
    setEditModal(true);
  };
  const onDeleteModalShow = () => {
    setDeleteModal(true);
  };
  const onApproveModalShow = () => {
    setApproveModal(true);
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
                <h4>EMPLOYEE LEAVE REQUESTS</h4>
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
                            <Input type="checkbox" name="isPaid" /> Employee
                            Name
                          </Label>
                        </FormGroup>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-1" className="drpdstyle">
                        <FormGroup check className="nightshiftlabel">
                          <Label check>
                            <Input type="checkbox" name="isPaid" /> Leave Name
                          </Label>
                        </FormGroup>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-2" className="drpdstyle">
                        <FormGroup check className="nightshiftlabel">
                          <Label check>
                            <Input type="checkbox" name="isPaid" /> From Date
                          </Label>
                        </FormGroup>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-3" className="drpdstyle">
                        <FormGroup check className="nightshiftlabel">
                          <Label check>
                            <Input type="checkbox" name="isPaid" /> To Date
                          </Label>
                        </FormGroup>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-3" className="drpdstyle">
                        <FormGroup check className="nightshiftlabel">
                          <Label check>
                            <Input type="checkbox" name="isPaid" /> Total Days
                          </Label>
                        </FormGroup>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-3" className="drpdstyle">
                        <FormGroup check className="nightshiftlabel">
                          <Label check>
                            <Input type="checkbox" name="isPaid" /> Reason
                          </Label>
                        </FormGroup>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-3" className="drpdstyle">
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
                    Employee Name
                  </p>
                ),
                accessor: "employeeName",
                Cell: (props) => (
                  <p style={{ textAlign: "left" }} className="mb-0">
                    {props.original.name}
                  </p>
                ),
              },
              {
                Header: "Leave Name",
                accessor: "leaveName",
              },
              {
                Header: "From Date",
                accessor: "fromDate",
              },
              {
                Header: "To Date",
                accessor: "toDate",
              },
              {
                Header: "Total Days",
                accessor: "totalDays",
              },
              {
                Header: "Reason",
                accessor: "reason",
              },
              {
                Header: "Created Date",
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
                        onDeleteModalShow();
                      }}
                      color="white"
                      size="sm"
                      round="true"
                      icon="true"
                    >
                      <i
                        className="fa fa-times-circle"
                        style={{ color: "#df5e5e" }}
                      />
                    </Button>

                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        onApproveModalShow();
                      }}
                      color="white"
                      size="sm"
                      round="true"
                      icon="true"
                    >
                      <i
                        className="fa fa-check-circle"
                        style={{ color: "#A1C880" }}
                      />
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

          {/* Approve Modal */}
          <Modal
            className="modal-md p-2"
            isOpen={deleteModal}
            toggle={() => {
              onDeleteModalShow();
            }}
          >
            <Form autoComplete="off">
              <ModalBody>
                <h2 className="text-center deletepopup">
                  Sure To Delete Request?
                </h2>
                <textarea
                  rows={4}
                  className="reqmodal"
                  placeholder="Type your remark here ..."
                ></textarea>
              </ModalBody>
              <div className="text-center pb-4">
                <Button
                  type="submit"
                  className="mainbtn1 text-white mr-3"
                  style={{ backgroundColor: "#df5e5e" }}
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
          {/* Delete Modal */}
          <Modal
            className="modal-md p-2"
            isOpen={approveModal}
            toggle={() => {
              onApproveModalShow();
            }}
          >
            <Form autoComplete="off">
              <ModalBody>
                <h2 className="text-center deletepopup">
                  Sure To Approve Request?
                </h2>
                <textarea
                  rows={4}
                  className="reqmodal"
                  placeholder="Type your remark here ..."
                ></textarea>
              </ModalBody>
              <div className="text-center pb-4">
                <Button
                  type="submit"
                  className="mainbtn1 text-white mr-3"
                  style={{ backgroundColor: "#A1C880" }}
                >
                  Approve
                </Button>

                <Button
                  className="mainbtn1 modalcancelbtn"
                  type="button"
                  onClick={() => {
                    setApproveModal(false);
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
