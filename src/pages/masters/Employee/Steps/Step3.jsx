import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
  InputGroup,
  tbody,
} from "reactstrap";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export default function Step3(props) {
  const {
    values,
    handleChange,
    errors,
    addExperienceList,
    removeExperienceList,
    experiencelist,
    addReferenceList,
    referencelist,
    removeReferenceList,
    setFieldValue,
  } = props;

  return (
    <Row className="mt-4 emp_step1">
      <Col md="3">
        <FormGroup>
          <label>
            Have Any Experience?<span className="text-danger">*</span>
          </label>
          <br />
          <FormGroup className="gender nightshiftlabel">
            <Label>
              <input
                name="isExperienceEmployee"
                type="radio"
                value="true"
                checked={values.isExperienceEmployee === "true" ? true : false}
                onChange={(v) => {
                  setFieldValue("isExperienceEmployee", "true");
                }}
                className="mr-1"
              />
              <span>Yes</span>
            </Label>
            <Label className="ml-3">
              <input
                name="isExperienceEmployee"
                type="radio"
                value="false"
                checked={values.isExperienceEmployee === "false" ? true : false}
                onChange={(v) => {
                  setFieldValue("isExperienceEmployee", "false");
                }}
                className="mr-1"
              />
              <span>No</span>
            </Label>
          </FormGroup>
          <span className="text-danger">
            {errors.isExperienceEmployee && "Select Option"}
          </span>
        </FormGroup>
      </Col>

      {values.isExperienceEmployee == "true" && (
        <>
          <Col md="4">
            <FormGroup>
              <label>
                Can We Contact Previous Company
                <span className="text-danger">*</span>
              </label>
              <br />
              <FormGroup className="gender nightshiftlabel">
                <Label>
                  <input
                    name="canWeContactPreviousCompany"
                    type="radio"
                    value={true}
                    checked={
                      values.canWeContactPreviousCompany === true ? true : false
                    }
                    onChange={(v) => {
                      setFieldValue("canWeContactPreviousCompany", true);
                    }}
                    className="mr-1"
                  />
                  <span>Yes</span>
                </Label>
                <Label className="ml-3">
                  <input
                    name="canWeContactPreviousCompany"
                    type="radio"
                    value={false}
                    checked={
                      values.canWeContactPreviousCompany === false
                        ? true
                        : false
                    }
                    onChange={(v) => {
                      setFieldValue("canWeContactPreviousCompany", false);
                    }}
                    className="mr-1"
                  />
                  <span>No</span>
                </Label>
              </FormGroup>
              <span className="text-danger">
                {errors.canWeContactPreviousCompany && "Select Option"}
              </span>
            </FormGroup>
          </Col>
          <br />
          <div className="pl-3 pr-3 pt-0">
            <h4 className="">Experience Details: </h4>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label htmlFor="ee_companyName">Company Name</Label>
                  <Input
                    type="text"
                    placeholder="Company Name"
                    name="ee_companyName"
                    onChange={handleChange}
                    value={values.ee_companyName}
                    invalid={errors.ee_companyName ? true : false}
                  />
                  <FormFeedback>{errors.ee_companyName}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md="2">
                <FormGroup>
                  <Label htmlFor="ee_designationName">Designation Name</Label>
                  <Input
                    type="text"
                    placeholder="Designation"
                    name="ee_designationName"
                    onChange={handleChange}
                    value={values.ee_designationName}
                    invalid={errors.ee_designationName ? true : false}
                    maxLength={10}
                  />
                  <FormFeedback>{errors.ee_designationName}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md="1">
                <FormGroup>
                  <Label htmlFor="ee_duration">Duration</Label>
                  <Input
                    type="text"
                    placeholder="Duration"
                    name="ee_duration"
                    onChange={handleChange}
                    value={values.ee_duration}
                    invalid={errors.ee_duration ? true : false}
                  />
                  <FormFeedback>{errors.ee_duration}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md="2">
                <FormGroup>
                  <Label htmlFor="ee_incomePerMonth">Income Per Month</Label>
                  <Input
                    type="text"
                    placeholder="Income Per Month"
                    name="ee_incomePerMonth"
                    onChange={handleChange}
                    value={values.ee_incomePerMonth}
                    invalid={errors.ee_incomePerMonth ? true : false}
                  />
                  <FormFeedback>{errors.ee_incomePerMonth}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label htmlFor="ee_reasonToResign">Reason To Resign</Label>
                  <Input
                    type="textarea"
                    placeholder="Reason"
                    name="ee_reasonToResign"
                    onChange={handleChange}
                    value={values.ee_reasonToResign}
                    invalid={errors.ee_reasonToResign ? true : false}
                  />
                  <FormFeedback>{errors.ee_reasonToResign}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md="1">
                <Button
                  className="experienceplus mainbtnminus"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    addExperienceList(
                      {
                        ee_companyName: values.ee_companyName,
                        ee_designationName: values.ee_designationName,
                        ee_duration: values.ee_duration,
                        ee_incomePerMonth: values.ee_incomePerMonth,
                        ee_percentage: values.ee_percentage,
                        ee_reasonToResign: values.ee_reasonToResign,
                      },
                      setFieldValue
                    );
                  }}
                >
                  {/* <svg
                    class="MuiSvgIcon-root"
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                  </svg> */}
                  <i className="mdi mdi-plus"></i>
                </Button>
              </Col>
            </Row>
            {experiencelist.length > 0 && (
              <Row className="mb-4">
                <Col md="12">
                  <TableContainer component={Paper} className="mt-2">
                    <Table aria-label="simple table">
                      <TableHead className="" style={{ background: "#f9f9f9" }}>
                        <TableRow className="orderdetail-tbl">
                          <TableCell className="p-1">Company Name</TableCell>
                          <TableCell className="p-1">Designation</TableCell>
                          <TableCell className="p-1">Duration</TableCell>
                          <TableCell className="p-1">
                            Income per Month
                          </TableCell>
                          <TableCell className="p-1">
                            Reason to Resign
                          </TableCell>
                          <TableCell className="p-1">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody
                        className="prescriptiontable"
                        style={{
                          width: "320px",
                          height: "80px",
                          overflow: "auto",
                        }}
                      >
                        {experiencelist &&
                          experiencelist.map((v, key) => (
                            <TableRow key={key}>
                              <TableCell>{v.companyName}</TableCell>
                              <TableCell>{v.designationName}</TableCell>
                              <TableCell>{v.duration}</TableCell>
                              <TableCell>{v.incomePerMonth}</TableCell>
                              <TableCell>{v.reasonToResign}</TableCell>
                              <TableCell>
                                <Button
                                  className="mainbtnminus"
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeExperienceList(key);
                                  }}
                                >
                                  <i className="mdi mdi-minus"></i>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Col>
              </Row>
            )}
          </div>
          <br />
        </>
      )}

      <div className="pl-3 pr-3 pt-0">
        <h4 className="">Reference Details: </h4>
        <Row>
          <Col md="2">
            <FormGroup>
              <Label htmlFor="r_name"> Name</Label>
              <Input
                type="text"
                placeholder="Person Name"
                name="r_name"
                onChange={handleChange}
                value={values.r_name}
                invalid={errors.r_name ? true : false}
              />
              <FormFeedback>{errors.r_name}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label htmlFor="r_address">Address</Label>
              <Input
                type="textarea"
                placeholder="Address"
                name="r_address"
                onChange={handleChange}
                value={values.r_address}
                invalid={errors.r_address ? true : false}
              />
              <FormFeedback>{errors.r_address}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="2">
            <FormGroup>
              <Label htmlFor="r_business">Business</Label>
              <Input
                type="text"
                placeholder="Business"
                name="r_business"
                onChange={handleChange}
                value={values.r_business}
                invalid={errors.r_business ? true : false}
              />
              <FormFeedback>{errors.r_business}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="2">
            <FormGroup>
              <Label htmlFor="r_mobileNumber">Mobile Number</Label>
              <Input
                type="text"
                placeholder="Mobile Number"
                name="r_mobileNumber"
                onChange={handleChange}
                value={values.r_mobileNumber}
                invalid={errors.r_mobileNumber ? true : false}
              />
              <FormFeedback>{errors.r_mobileNumber}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="2">
            <FormGroup>
              <Label htmlFor="r_knownFromWhen">Known From When</Label>
              <Input
                type="text"
                placeholder="Known From When"
                name="r_knownFromWhen"
                onChange={handleChange}
                value={values.r_knownFromWhen}
                invalid={errors.r_knownFromWhen ? true : false}
              />
              <FormFeedback>{errors.r_knownFromWhen}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="1">
            <Button
              className="mainbtn1 addrowbtn1"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (
                  values.r_name != "" &&
                  values.r_address != "" &&
                  values.r_business != "" &&
                  values.r_mobileNumber != "" &&
                  values.r_knownFromWhen != ""
                ) {
                  addReferenceList(
                    {
                      r_name: values.r_name,
                      r_address: values.r_address,
                      r_business: values.r_business,
                      r_mobileNumber: values.r_mobileNumber,
                      r_knownFromWhen: values.r_knownFromWhen,
                    },
                    setFieldValue
                  );
                } else {
                  toast.error("✘ Please give inputs");
                }
              }}
            >
              {/* <svg
                class="MuiSvgIcon-root"
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
              </svg> */}
              Add Row
            </Button>
          </Col>
        </Row>

        {referencelist.length > 0 && (
          <Row className="mb-4">
            <Col md="12">
              <TableContainer component={Paper} className="mt-2">
                <Table aria-label="simple table">
                  <TableHead className="" style={{ background: "#f9f9f9" }}>
                    <TableRow className="orderdetail-tbl">
                      <TableCell className="p-1">Name</TableCell>
                      <TableCell className="p-1">Address</TableCell>
                      <TableCell className="p-1">Business</TableCell>
                      <TableCell className="p-1">Mobile No.</TableCell>
                      <TableCell className="p-1">Known From When</TableCell>
                      <TableCell className="p-1">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody
                    className="prescriptiontable"
                    style={{
                      width: "320px",
                      height: "80px",
                      overflow: "auto",
                    }}
                  >
                    {referencelist &&
                      referencelist.map((v, key) => (
                        <TableRow key={key}>
                          <TableCell>{v.name}</TableCell>
                          <TableCell>{v.address}</TableCell>
                          <TableCell>{v.business}</TableCell>
                          <TableCell>{v.mobileNumber}</TableCell>
                          <TableCell>{v.knownFromWhen}</TableCell>
                          <TableCell>
                            <Button
                              className="mainbtnminus"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                removeReferenceList(key);
                              }}
                            >
                              <i className="mdi mdi-minus"></i>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Col>
          </Row>
        )}
      </div>

      <br />
    </Row>
  );
}
