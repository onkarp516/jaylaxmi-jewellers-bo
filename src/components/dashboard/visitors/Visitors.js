import React, { useEffect, useState, useStates } from "react";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

import Chart from "react-apexcharts";

const Visitors = (props) => {
  // console.log("visitors props", props);
  // const seriesvisitors = [50, 40, 30, 10];
  const seriesvisitors = [
    props.data ? (props.data.pendingOrders ? props.data.pendingOrders : 0) : 0,
    props.data
      ? props.data.generatedOrders
        ? props.data.generatedOrders
        : 0
      : 0,
    props.data ? (props.data.placedOrders ? props.data.placedOrders : 0) : 0,
    props.data
      ? props.data.confirmedOrders
        ? props.data.confirmedOrders
        : 0
      : 0,
    props.data
      ? props.data.completedOrders
        ? props.data.completedOrders
        : 0
      : 0,
    props.data
      ? props.data.cancelledOrders
        ? props.data.cancelledOrders
        : 0
      : 0,
  ];
  const optionsvisitors = {
    labels: [
      "Pending",
      "Generated",
      "Placed",
      "Confirmed",
      "Completed",
      "Cancelled",
    ],
    dataLabels: {
      enabled: false,
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
      },
      borderColor: "transparent",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "82px",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "18px",
              color: undefined,
              offsetY: -10,
            },
            value: {
              show: true,
              color: "#99abb4",
            },
            total: {
              show: true,
              label: "Total Orders",
              color: "#99abb4",
            },
          },
        },
      },
    },
    stroke: {
      width: 1,
      colors: "transparent",
    },
    legend: {
      show: false,
    },
    colors: ["#47e0e0", "#7460ee", "#ffb22b", "#1e88e5", "#ac67b9", "#fc4b6c"],
    tooltip: {
      fillSeriesColor: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
          },
        },
      },
    ],
  };
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1,2                                                          */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <CardBody>
        <CardTitle>{props.title ? props.title : ""}</CardTitle>
        {/* <CardSubtitle className="mb-3">
          Different Devices Used to Visit
        </CardSubtitle> */}
        <Chart
          options={optionsvisitors}
          series={seriesvisitors}
          type="donut"
          height="255px"
        />
      </CardBody>
      <div>
        <hr className="mt-0 mb-0" />
      </div>
      <CardBody>
        <div className="d-flex no-block align-items-center justify-content-center">
          <div>
            <h6 className="" style={{ color: "#38b9b9" }}>
              <i className="fa fa-circle font-10 mr-2" />
              {/* Completed Order */}
              Pending
            </h6>
          </div>
          <div className="ml-3">
            <h6 className="text-primary">
              <i className="fa fa-circle font-10 mr-2" />
              Generated
            </h6>
          </div>
          <div className="ml-3">
            <h6 className="text-warning" style={{}}>
              <i className="fa fa-circle font-10 mr-2" />
              Placed
            </h6>
          </div>
          <div className="ml-3">
            <h6 className="text-info">
              <i className="fa fa-circle font-10 mr-2" />
              Confirm
            </h6>
          </div>
          <div className="ml-3">
            <h6 className="" style={{ color: "#ac67b9" }}>
              <i className="fa fa-circle font-10 mr-2" />
              Completed
            </h6>
          </div>
          <div className="ml-3">
            <h6 className="text-danger">
              <i className="fa fa-circle font-10 mr-2" />
              Cancelled
            </h6>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Visitors;
