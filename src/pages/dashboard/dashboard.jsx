import React, { useState, useEffect, Suspense } from "react";
import { Row, Col, FormGroup, Label, CardTitle, Button } from "reactstrap";
import moment from "moment";
import { listOfShifts, getShiftWiseAttendance } from "@/services/api_function";

import Select from "react-select";

import {
  RevenueCards,
  SalesOverview,
  ItemOverview,
} from "@/components/dashboard/index.js";

import Table from "react-bootstrap/Table";

import Paper from "@material-ui/core/Paper";
import Spinner from "@/components/spinner/Spinner";
import { getDashboardData } from "@/services/api_function";
import { MyDatePicker, WithUserPermission } from "@/helpers";
import { Dashboard } from "@material-ui/icons";

function dashboard(props) {
  const [dashboarddata, setDashboarddata] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date());

  const [shift_op, setShift_op] = useState([]);
  const [selectedShift, setSelectedShift] = useState("");
  const [shiftData, setShiftData] = useState(null);

  let [mainData, setMainData] = useState("");
  const [mainInnerData, setMainInnerData] = useState("");

  const getShiftOptions = () => {
    listOfShifts()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt =
            result.length > 0
              ? result.map(function (data) {
                  return {
                    value: data.id,
                    label: data.name,
                  };
                })
              : [];
          setShift_op(opt);
          setSelectedShift(opt.length > 0 ? opt[0] : "");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getDashboardFun = () => {
    let reqData = new FormData();
    reqData.append("shiftId", selectedShift !== "" ? selectedShift.value : "");
    reqData.append(
      "attendanceDate",
      attendanceDate !== "" ? moment(attendanceDate).format("YYYY-MM-DD") : ""
    );
    getDashboardData(reqData)
      .then((response) => {
        console.log({ response });
        let result = response.data;
        if (result.responseStatus == 200) {
          setDashboarddata(result.response);
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  const selectCustomStyles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "16px",
    }),
    control: (provided, state) => ({
      ...provided,
      borderColor: "transparent !important",
      border: "none !important",
      boxShadow: "none !important",
      fontSize: "16px",
      lineHeight: "normal",
      borderBottom: "1px solid #cacaca !important",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "5px",
    }),
  };

  useEffect(() => {
    console.log("dash", props);
    getShiftOptions();
  }, []);

  useEffect(() => {
    getDashboardFun();
  }, [selectedShift, attendanceDate]);

  return (
    <div className="emp">
      {dashboarddata != "" ? (
        <div className="container-fluid mt-3">
          <Row>
            {/* <Col lg="2" md="4">
              <h4 className="orderstatus">
                Today Date : {moment().format("DD-MM-YYYY")}{" "}
              </h4>
            </Col> */}
            <Col>
              <FormGroup>
                <Row>
                  <Col lg="2" md="4">
                    <Label> Today Date :</Label>
                  </Col>
                  <Col lg="3" md="4">
                    <MyDatePicker
                      className="datepic form-control"
                      name="attendanceDate"
                      placeholderText="dd/MM/yyyy"
                      id="attendanceDate"
                      dateFormat="dd/MM/yyyy"
                      value={attendanceDate}
                      onChange={(date) => {
                        setAttendanceDate(date);
                        // getDashboardFun();
                      }}
                      selected={attendanceDate}
                      maxDate={new Date()}
                    />
                  </Col>
                </Row>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Row>
                  <Col lg="1" md="4">
                    <Label
                      htmlFor="employeeType"
                      className="mt-2"
                      style={{ marginBottom: "0px", marginLeft: "0px" }}
                    >
                      Shift
                    </Label>
                  </Col>
                  <Col lg="2" md="4">
                    <Select
                      ////isClearable={true}
                      name="shiftId"
                      id="shiftId"
                      options={shift_op}
                      onChange={(v) => {
                        console.log({ v });
                        if (v != null) {
                          setSelectedShift(v);
                          // getDashboardFun(v.value);
                        } else {
                          setSelectedShift("");
                          setShiftData(null);
                          // getDashboardFun("");
                        }
                      }}
                      styles={selectCustomStyles}
                      //className="shift"
                      value={selectedShift}
                    />
                  </Col>
                </Row>
              </FormGroup>
            </Col>
          </Row>
          <RevenueCards
            selectedShift={selectedShift}
            data={dashboarddata}
            {...props}
          />

          {dashboarddata && dashboarddata.machineList.length > 0 && (
            <Row>
              <Col lg="12" md="12">
                <SalesOverview data={dashboarddata} />
              </Col>
            </Row>
          )}
          {dashboarddata && dashboarddata.itemList.length > 0 && (
            <Row>
              <Col lg="12" md="12">
                <ItemOverview data={dashboarddata} />
              </Col>
            </Row>
          )}

          {dashboarddata && dashboarddata.itemCountList.length > 0 && (
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
                        <th>Item Name</th>
                        <th>M/R Qty.</th>
                        <th>R/W Qty.</th>
                        <th>D/F Qty.</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {dashboarddata.itemCountList.map((v, i) => {
                        return (
                          <>
                            <tr>
                              <td style={{ width: "2%" }}>
                                <Button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (parseInt(mainData) == parseInt(i))
                                      setMainData("");
                                    else {
                                      setMainData(i);
                                      setMainInnerData("");
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
                              <td>{v.itemName}</td>
                              <td>{v.rejectCount}</td>
                              <td>{v.reworkCount}</td>
                              <td>{v.doubtfulCount}</td>
                            </tr>
                            {v.empItemArray && v.empItemArray.length > 0 ? (
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
                                        <th>Operation No.</th>
                                        <th>Operation</th>
                                        <th>M/R Qty.</th>
                                        <th>R/W Qty.</th>
                                        <th>D/F Qty.</th>
                                      </tr>
                                    </thead>
                                    <tbody
                                      style={{
                                        background: "#FEFCF3",
                                        textAlign: "center",
                                      }}
                                    >
                                      {v.empItemArray &&
                                        v.empItemArray.map((vi, ii) => {
                                          return (
                                            <>
                                              <tr>
                                                <td style={{ width: "2%" }}>
                                                  {" "}
                                                </td>
                                                <td>{vi.employeeName}</td>
                                                <td>{vi.operationNo}</td>
                                                <td>{vi.operationName}</td>
                                                <td>{vi.rejectCount}</td>
                                                <td>{vi.reworkCount}</td>
                                                <td>{vi.doubtfulCount}</td>
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
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default WithUserPermission(dashboard);
