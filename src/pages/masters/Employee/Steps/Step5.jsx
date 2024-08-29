import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
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
import { MyDatePicker } from "@/helpers";
import moment from "moment";

export default function Step5(props) {
  const {
    values,
    handleChange,
    errors,
    setFieldValue,
    wagesOpt,
    addSalaryList,
    editSalaryList,
    salaryList,
    removeSalaryList,
    oldSalaryList,
  } = props;

  // console.log("step5 props ---==> ", props);
  const handleWagesOptions = (status, val, setFieldValue, values) => {
    if (status == true) {
      if (!values.wagesOptions.includes(val)) {
        let lst_val = [...values.wagesOptions, val];
        setFieldValue("wagesOptions", lst_val);
      }
    } else if (status == false) {
      if (values.wagesOptions.includes(val)) {
        let lst_val = values.wagesOptions.filter((v) => v != val);
        setFieldValue("wagesOptions", lst_val);
      }
    }
  };

  const getWageOptions = (values, val) => {
    console.log("values.wagesOptions ", values.wagesOptions, val);
    return values
      ? values.wagesOptions
        ? values.wagesOptions.includes(val)
        : false
      : false;
  };
  return (
    <>
      <Row className="mt-4 emp_step1">
        <Col md="1">
          <FormGroup>
            <label>
              Apply PF<span className="text-danger">*</span>
            </label>
            <br />
            <FormGroup className="gender nightshiftlabel">
              <Label>
                <input
                  name="employeeHavePf"
                  type="radio"
                  value={true}
                  checked={values.employeeHavePf === true ? true : false}
                  onChange={(v) => {
                    setFieldValue("employeeHavePf", true);
                  }}
                  className="mr-1"
                />
                <span>Yes</span>
              </Label>
              <Label className="ml-3">
                <input
                  name="employeeHavePf"
                  type="radio"
                  value={false}
                  checked={values.employeeHavePf === false ? true : false}
                  onChange={(v) => {
                    setFieldValue("employeeHavePf", false);
                  }}
                  className="mr-1"
                />
                <span>No</span>
              </Label>
            </FormGroup>
            <span className="text-danger">
              {errors.employeeHavePf && "Select Option"}
            </span>
          </FormGroup>
        </Col>

        {values.employeeHavePf === true ? (
          <>
            {/* <Col md="1">
              <FormGroup>
                <Label>
                  PF 1<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="employerPf"
                  placeholder="Employer"
                  onChange={handleChange}
                  value={values.employerPf}
                  invalid={errors.employerPf ? true : false}
                />
              </FormGroup>
            </Col> */}
            <Col md="1">
              <FormGroup>
                <Label>
                  Employee PF<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="employeePf"
                  placeholder="Employee"
                  onChange={handleChange}
                  value={values.employeePf}
                  invalid={errors.employeePf ? true : false}
                />
              </FormGroup>
            </Col>
          </>
        ) : (
          ""
        )}

        <Col md="1">
          <FormGroup>
            <label>
              Apply ESI<span className="text-danger">*</span>
            </label>
            <br />
            <FormGroup className="gender nightshiftlabel">
              <Label>
                <input
                  name="employeeHaveEsi"
                  type="radio"
                  value={true}
                  checked={values.employeeHaveEsi === true ? true : false}
                  onChange={(v) => {
                    setFieldValue("employeeHaveEsi", true);
                  }}
                  className="mr-1"
                />
                <span>Yes</span>
              </Label>
              <Label className="ml-3">
                <input
                  name="employeeHaveEsi"
                  type="radio"
                  value={false}
                  checked={values.employeeHaveEsi === false ? true : false}
                  onChange={(v) => {
                    setFieldValue("employeeHaveEsi", false);
                  }}
                  className="mr-1"
                />
                <span>No</span>
              </Label>
            </FormGroup>
            <span className="text-danger">
              {errors.employeeHaveEsi && "Select Option"}
            </span>
          </FormGroup>
        </Col>
        {values.employeeHaveEsi === true ? (
          <>
            {/* <Col md="1">
              <FormGroup>
                <Label>
                  ESI 1<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="employerEsi"
                  placeholder="Employer"
                  onChange={handleChange}
                  value={values.employerEsi}
                  invalid={errors.employerEsi ? true : false}
                />
              </FormGroup>
            </Col> */}
            <Col md="1">
              <FormGroup>
                <Label>
                  Employee ESI<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="employeeEsi"
                  placeholder="Employee"
                  onChange={handleChange}
                  value={values.employeeEsi}
                  invalid={errors.employeeEsi ? true : false}
                />
              </FormGroup>
            </Col>
          </>
        ) : (
          ""
        )}

        <Col md="1">
          <FormGroup>
            <label>
              Apply Prof. Tax<span className="text-danger">*</span>
            </label>
            <br />
            <FormGroup className="gender nightshiftlabel">
              <Label>
                <input
                  name="employeeHaveProfTax"
                  type="radio"
                  value={true}
                  checked={values.employeeHaveProfTax === true ? true : false}
                  onChange={(v) => {
                    setFieldValue("employeeHaveProfTax", true);
                  }}
                  className="mr-1"
                />
                <span>Yes</span>
              </Label>
              <Label className="ml-3">
                <input
                  name="employeeHaveProfTax"
                  type="radio"
                  value={false}
                  checked={values.employeeHaveProfTax === false ? true : false}
                  onChange={(v) => {
                    setFieldValue("employeeHaveProfTax", false);
                  }}
                  className="mr-1"
                />
                <span>No</span>
              </Label>
            </FormGroup>
            <span className="text-danger">
              {errors.employeeHaveProfTax && "Select Option"}
            </span>
          </FormGroup>
        </Col>

        <Col md="2">
          <FormGroup>
            <label>
              Show Salary Sheet<span className="text-danger">*</span>
            </label>
            <br />
            <FormGroup className="gender nightshiftlabel">
              <Label>
                <input
                  name="showSalarySheet"
                  type="radio"
                  value={true}
                  checked={values.showSalarySheet === true ? true : false}
                  onChange={(v) => {
                    setFieldValue("showSalarySheet", true);
                  }}
                  className="mr-1"
                />
                <span>Yes</span>
              </Label>
              <Label className="ml-3">
                <input
                  name="showSalarySheet"
                  type="radio"
                  value={false}
                  checked={values.showSalarySheet === false ? true : false}
                  onChange={(v) => {
                    setFieldValue("showSalarySheet", false);
                  }}
                  className="mr-1"
                />
                <span>No</span>
              </Label>
            </FormGroup>
            <span className="text-danger">
              {errors.showSalarySheet && "Select Option"}
            </span>
          </FormGroup>
        </Col>

        <Col md="4">
          {/* {values && JSON.stringify(values.wagesOptions)} */}
          <FormGroup>
            <label>
              Choose Options To show <span className="text-danger">*</span>
            </label>
          </FormGroup>

          <FormGroup check className="nightshiftlabel" inline>
            {wagesOpt
              ? wagesOpt.map((v) => {
                  return (
                    <Label check>
                      <Input
                        type="checkbox"
                        name="wagesOptions"
                        defaultChecked={false}
                        checked={getWageOptions(values, v.value)}
                        onChange={(e) => {
                          handleWagesOptions(
                            e.target.checked,
                            v.value,
                            setFieldValue,
                            values
                          );
                        }}
                        value={getWageOptions(values, v.value)}
                      />{" "}
                      {v.label}
                      &nbsp; &nbsp;
                    </Label>
                  );
                })
              : ""}
          </FormGroup>
          {/* {JSON.stringify(values.wagesOptions)} */}
          {/* <FormGroup>
            {" "}
            <span className="text-danger">
              {values.wagesOptions
                ? values.wagesOptions.length == 0
                  ? "Select Option"
                  : ""
                : ""}
            </span>
          </FormGroup> */}
        </Col>
      </Row>

      <br />
      {/* {JSON.stringify(oldSalaryList)} */}
      {/* {JSON.stringify(salaryList)} */}
      <Row>
        <div className="pl-3 pr-3 pt-0">
          <h4 className="">Salary Details: </h4>
          <Row>
            <Col md="4">
              <FormGroup>
                <Label htmlFor="r_name">Effective Date</Label>
                <MyDatePicker
                  className="datepic form-control"
                  name="s_effectiveDate"
                  placeholderText="dd/MM/yyyy"
                  id="s_effectiveDate"
                  dateFormat="dd/MM/yyyy"
                  value={values.s_effectiveDate}
                  onChange={(date) => {
                    setFieldValue("s_effectiveDate", date);
                  }}
                  selected={values.s_effectiveDate}
                  // maxDate={new Date()}
                />
                <FormFeedback>{errors.s_effectiveDate}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label htmlFor="r_address">Salary Per Day</Label>
                <Input
                  type="text"
                  placeholder="Salary"
                  name="s_salary"
                  onChange={handleChange}
                  value={values.s_salary}
                  invalid={errors.s_salary ? true : false}
                />
                <FormFeedback>{errors.s_salary}</FormFeedback>
              </FormGroup>
            </Col>

            <Col md="2">
              <Button
                className="mainbtn1 addrowbtn1"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (values.s_effectiveDate != "" && values.s_salary != "") {
                    addSalaryList(
                      {
                        s_id: values.s_id != null ? values.s_id : "",
                        s_effectiveDate: values.s_effectiveDate,
                        s_salary: values.s_salary,
                      },
                      setFieldValue
                    );
                  } else {
                    toast.error("✘ Please give inputs");
                  }
                }}
              >
                Add Row
              </Button>
            </Col>
          </Row>

          {salaryList.length > 0 && (
            <Row className="mb-4">
              <Col md="12">
                <TableContainer component={Paper} className="mt-2">
                  <Table aria-label="simple table">
                    <TableHead className="" style={{ background: "#f9f9f9" }}>
                      <TableRow className="orderdetail-tbl">
                        <TableCell className="p-1">Effective Date</TableCell>
                        <TableCell className="p-1">Salary Per Day</TableCell>
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
                      {salaryList &&
                        salaryList.map((v, key) => (
                          <TableRow key={key}>
                            <TableCell>
                              {moment(v.s_effectiveDate).format("DD MMM yyyy")}
                            </TableCell>
                            <TableCell>{v.s_salary}</TableCell>
                            <TableCell>
                              <Button
                                className="mainbtnminus"
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  editSalaryList(key, v, setFieldValue);
                                }}
                              >
                                <i className="mdi mdi-pencil"></i>
                              </Button>
                              <Button
                                className="mainbtnminus"
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeSalaryList(key);
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
      </Row>
    </>
  );
}
