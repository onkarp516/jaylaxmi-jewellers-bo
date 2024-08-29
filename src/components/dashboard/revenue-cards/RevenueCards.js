import React, { useState, useEffect } from "react";
import { Col, Row, Card, CardBody, FormGroup, Label } from "reactstrap";

const RevenueCards = (props) => {
  console.log("props", props);

  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-2                                                            */
    /*--------------------------------------------------------------------------------*/
    <>
      <Row>
        <Col lg="3" md="6">
          <Card>
            <CardBody
              className="dashboardcard p-3 card-style"
              onClick={(e) => {
                e.preventDefault();
                props.history.push(
                  `/master/employeeList`,
                  props.selectedShift != "" ? props.selectedShift.value : ""
                );
              }}
            >
              <div className="d-flex flex-row">
                <div className="round round-lg align-self-center round-info cust-icon">
                  <i class=" icon-people"></i>
                </div>
                <div className="ml-2 align-self-center dashboardh5">
                  <h3 className="mb-0 font-light">
                    {props && props.data ? props.data.totalEmployees : 0}
                  </h3>
                  <h5 className="text-muted mb-0">Total Employee's</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="3" md="6">
          <Card>
            <CardBody
              className="dashboardcard p-3 card-style"
              onClick={(e) => {
                e.preventDefault();
                props.history.push(
                  `/attendance2`,
                  props.selectedShift != "" ? props.selectedShift.value : ""
                );
              }}
            >
              <div className="d-flex flex-row">
                <div className="round round-lg align-self-center round-warning cust-icon">
                  {/* <img src={porder} alt="Pending Order"></img> */}
                  <i class="  icon-user-following"></i>
                </div>
                <div className="ml-2 align-self-center dashboardh5">
                  <h3 className="mb-0 font-lgiht">
                    {props && props.data ? props.data.presentEmployees : 0}
                  </h3>
                  <h5 className="text-muted mb-0">Total Present's</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="3" md="6">
          <Card>
            <CardBody
              className="dashboardcard p-3 card-style"
              onClick={(e) => {
                e.preventDefault();
                props.history.push(
                  `/todayAbsenty`,
                  props.selectedShift != "" ? props.selectedShift.value : ""
                );
              }}
            >
              <div className="d-flex flex-row">
                <div className="round round-lg align-self-center round-primary cust-icon">
                  {/* <img src={generatedorder}></img> */}
                  <i className=" icon-user-unfollow"></i>
                </div>
                <div className="ml-2 align-self-center dashboardh5">
                  <h3 className="mb-0 font-lgiht">
                    {props && props.data ? props.data.absentEmployees : 0}
                  </h3>
                  <h5 className="text-muted mb-0">Total Absent's</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default RevenueCards;
