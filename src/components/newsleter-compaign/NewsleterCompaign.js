import React from "react";
import { Card, CardBody, CardTitle, CardSubtitle, Row, Col } from "reactstrap";

import Newsdata from "./NewsData.js";
import Chart from "react-apexcharts";

const NewsleterCompaign = (props) => {
  // console.log("dashboard_data ", props.dashboard_data);
  console.log("props.dashboard_data.teams  ", props.dashboard_data.teams);

  const optionsnewslatter = {
    grid: {
      show: true,
      // borderColor: "rgba(0, 0, 0, .2)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    chart: {
      toolbar: {
        show: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    // colors: ["#26c6da", "#1e88e5"],
    // fill: {
    //   type: "gradient",
    //   opacity: ["0.1", "0.1"],
    // },
    xaxis: {
      categories: props.dashboard_data.teams,
      // categories: [
      //   "Site 1 asd asd as",
      //   "Site 2",
      //   "Site 3",
      //   "Site 4",
      //   "Site 5",
      //   "Site 6",
      //   "Site 7",
      //   "Site 8",
      //   "Site 9",
      // ],
      type:"category",
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color  ",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    markers: {
      size: 3,
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
      theme: "dark",
    },
    legend: {
      show: false,
    },
  };
  const seriesnewslatter = [
    {
      name: "Total Employees",
      data: props.dashboard_data.t_emp_array,
    },
    {
      name: "Present Employees",
      data: props.dashboard_data.p_emp_array,
    },
    {
      name: "Absent Employees",
      data: props.dashboard_data.a_emp_array,
    },
  ];

  // const t_arr = props.dashboard_data.t_emp_array;
  // const sum = t_arr.reduce((prev, next) => prev + next.totalAmount, 0);

  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1,2                                                          */
    /*--------------------------------------------------------------------------------*/
    <Card>
      {props.dashboard_data && (
        <CardBody>
          <div className="d-flex flex-wrap">
            <div>
              <CardTitle>Employees Attendance</CardTitle>
              {/* <CardSubtitle>Overview of Newsletter Campaign</CardSubtitle> */}
            </div>
          </div>
          <Row className="text-center">
            <Col lg="3" md="3" className="mt-3">
              <Newsdata
                texttitle={`${props.dashboard_data.all_emp_p}`}
                textsubtitle="Present All Employees"
              />
            </Col>
            <Col lg="3" md="3" className="mt-3">
              <Newsdata
                texttitle={`${props.dashboard_data.all_emp_a}`}
                textsubtitle="Absent All Employees"
              />
            </Col>
          </Row>
          <hr />
          <div className="d-flex flex-wrap">
            <div>
              <CardTitle>On Site Employees Attendance</CardTitle>
              {/* <CardSubtitle>Overview of Newsletter Campaign</CardSubtitle> */}
            </div>
            <div className="ml-auto align-self-center">
              <div className="d-flex no-block align-items-center justify-content-center">
                <div>
                  <h6 className="text-info">
                    <i className="fa fa-circle font-10 mr-2" />
                    Total Site Employees
                  </h6>
                </div>
                <div className="ml-3">
                  <h6 className="text-success">
                    <i className="fa fa-circle font-10 mr-2" />
                    Present Site Employees
                  </h6>
                </div>
                <div className="ml-3">
                  <h6 className="text-warning">
                    <i className="fa fa-circle font-10 mr-2" />
                    Absent Site Employees
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="campaign ct-charts mt-3">
            <Chart
              options={optionsnewslatter}
              series={seriesnewslatter}
              type="area"
              height="250px"
            />
          </div>
          <Row className="text-center">
            <Col lg="3" md="3" className="mt-3">
              <Newsdata
                texttitle={`${props.dashboard_data.teamCount}`}
                textsubtitle="Total Teams"
              />
            </Col>
            <Col lg="3" md="3" className="mt-3">
              <Newsdata
                texttitle={`${props.dashboard_data.t_emp_cnt}`}
                textsubtitle="Total All Sites Employees"
              />
            </Col>

            <Col lg="3" md="3" className="mt-3">
              <Newsdata
                texttitle={`${props.dashboard_data.p_emp_cnt}`}
                textsubtitle="Present Site Employees"
              />
            </Col>
            <Col lg="3" md="3" className="mt-3">
              <Newsdata
                texttitle={`${props.dashboard_data.a_emp_cnt}`}
                textsubtitle="Absent Site Employees"
              />
            </Col>
          </Row>
        </CardBody>
      )}
    </Card>
  );
};

export default NewsleterCompaign;
