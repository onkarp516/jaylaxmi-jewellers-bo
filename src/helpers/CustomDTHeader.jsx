import React from "react";
import { Row, Col, Button, Dropdown, InputGroup } from "react-bootstrap";

import Select from "react-select";

function CustomDTHeader({ tableManager }) {
  const { searchApi, columnsVisibilityApi, columnsApi, config } = tableManager;

  const { searchText, setSearchText } = searchApi;
  const { toggleColumnVisibility } = columnsVisibilityApi;
  const { columns } = columnsApi;
  const { additionalProps } = config;
  const { header } = additionalProps;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px 20px",
        background: "#fff",
        width: "100%",
        borderBottom: "1px solid #eee",
      }}
    >
      <div className="searchprdct">
        <h4>{header.label}</h4>
        <Row>
          <Col md="4" xs="8" className="pr-1 pl-2">
            <input
              name="my-search"
              type="search"
              value={searchText}
              className="searchinput1"
              onChange={(e) => setSearchText(e.target.value)}
              placeholder=" Search For"
            />
          </Col>

          {header.radioBtn ? (
            <Col md="4" xs="8" className="pr-1 pl-2">
              <div className="container">
                <div className="row">
                  <div
                    className="radio"
                    style={{
                      padding: "10px",
                      fontFamily: "Poppins !important",
                    }}
                    onClick={(e) => {
                      header.toggleUserStatus(e);
                    }}
                  >
                    <label>
                      <input
                        type="radio"
                        value="1"
                        name="Active"
                        checked={header.userStatus === "1"}
                      />{" "}
                      Active
                    </label>
                  </div>
                  <div
                    className="radio"
                    style={{ padding: "10px" }}
                    onClick={(e) => {
                      header.toggleUserStatus(e);
                    }}
                  >
                    <label>
                      <input
                        type="radio"
                        value="0"
                        name="In-Active"
                        checked={header.userStatus === "0"}
                      />{" "}
                      In-Active
                    </label>
                  </div>
                </div>
              </div>
            </Col>
          ) : // <Col md="2" xs="8" className="pr-1 pl-2">
          //   {"Radio Button Else part"}
          // </Col>
          null}

          {header.jobOpts && header.jobOperationOpts ? (
            <Col md="2" xs="8" className="pr-1 pl-2"></Col>
          ) : header.radioBtn ? (
            <Col></Col>
          ) : (
            <Col md="3" xs="8" className="pr-1 pl-2"></Col>
          )}
          {header.jobOpts ? (
            <Col md="2" xs="8" className="pr-1 pl-2">
              <Select
                ////isClearable={true}
                onChange={(v) => {
                  header.toggleJobData(v);
                }}
                options={header.jobOpts}
                placeholder="Select Item"
                value={header.jobId}
              />
            </Col>
          ) : header.radioBtn ? (
            <Col></Col>
          ) : (
            <Col md="2" xs="8" className="pr-1 pl-2"></Col>
          )}
          {header.jobOperationOpts ? (
            <Col md="2" xs="8" className="pr-1 pl-2">
              <Select
                ////isClearable={true}
                onChange={(v) => {
                  header.toggleJobOperationData(v);
                }}
                options={header.jobOperationOpts}
                placeholder="Select Operation"
                value={header.jobOpId}
              />
            </Col>
          ) : header.radioBtn ? (
            <Col></Col>
          ) : (
            <Col md="1" xs="8" className="pr-1 pl-2"></Col>
          )}
          <Col md="2" xs="4" className="searchprdctbtn pl-1 pl-1 pr-2">
            <InputGroup style={{ justifyContent: "end" }}>
              {header.showDate}
              {header.addBtn}
              {header.empStatusOpt && (
                <Dropdown className="dropdowncheck mr-2">
                  <Dropdown.Toggle variant="success">
                    <i className="fa fa-filter" aria-hidden="true"></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {header.empStatusOpt.map((column, idx) => (
                      <div className="checkvisibility mr-2">
                        <div key={idx} style={{ flex: 1 }}>
                          <input
                            id={`checkbox-${idx}`}
                            type="checkbox"
                            onClick={(e) => {
                              header.toggleEmployeeData(column.value);
                            }}
                            checked={column.visible !== false}
                          />
                          <label
                            htmlFor={`checkbox-${idx}`}
                            style={{ flex: 1, cursor: "pointer" }}
                          >
                            {column.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
              <Dropdown className="dropdowncheck">
                <Dropdown.Toggle variant="success"></Dropdown.Toggle>

                <Dropdown.Menu>
                  {columns.map((column, idx) => (
                    <div className="checkvisibility">
                      <div key={idx} style={{ flex: 1 }}>
                        <input
                          id={`checkbox-${idx}`}
                          type="checkbox"
                          onClick={(e) => toggleColumnVisibility(column.id)}
                          checked={column.visible !== false}
                        />
                        <label
                          htmlFor={`checkbox-${idx}`}
                          style={{ flex: 1, cursor: "pointer" }}
                        >
                          {column.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </InputGroup>
            {/* <button
              onClick={(e) => {
                e.preventDefault();
                // console.log("new create");
                header.callFun();
              }}
            >
              <i className="fa fa-plus"></i>
            </button> */}
          </Col>
        </Row>
      </div>
    </div>
  );
}

export { CustomDTHeader };
