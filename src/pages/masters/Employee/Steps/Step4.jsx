import React, { useState, useEffect } from "react";
import { Row, Col, FormGroup, Label, Input, FormFeedback } from "reactstrap";
import DesignationSelectList from "@/helpers/DesignationSelectList";
import ShiftSelectList from "@/helpers/ShiftSelectList";
import Select, { components } from "react-select";
import { TramRounded } from "@material-ui/icons";
import { MyDatePicker } from "@/helpers";

const CustomClearText = () => "clear all";
const ClearIndicator = (props) => {
  const {
    children = <CustomClearText />,
    getStyles,
    innerProps: { ref, ...restInnerProps },
  } = props;
  return (
    <div
      {...restInnerProps}
      ref={ref}
      style={getStyles("clearIndicator", props)}
    >
      <div style={{ padding: "0px 5px" }}>{children}</div>
    </div>
  );
};
const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

export default function Step4(props) {
  const {
    values,
    handleChange,
    errors,
    setFieldValue,
    designation_op,
    shift_op,
    company_op,
    wagesOpt,
    sitesOpt,
    weeklyOffOpt,
  } = props;
  console.log("props ---==> ", props);

  return (
    <>
      <Row className="mt-4 emp_step1">
        <Col md="2">
          <FormGroup>
            <Label htmlFor="employeeType" style={{ marginBottom: "0px" }}>
              Company <span className="text-danger">*</span>
            </Label>
            <Select
              closeMenuOnSelect={TramRounded}
              components={{ ClearIndicator }}
              styles={{
                clearIndicator: ClearIndicatorStyles,
              }}
              options={company_op}
              onChange={(v) => {
                setFieldValue("companyId", v);
              }}
              name="companyId"
              value={values.companyId}
            />
            <span className="text-danger">
              {errors.companyId && errors.companyId}
            </span>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label htmlFor="employeeType" style={{ marginBottom: "0px" }}>
              Site <span className="text-danger">*</span>
            </Label>
            <Select
              closeMenuOnSelect={TramRounded}
              components={{ ClearIndicator }}
              styles={{
                clearIndicator: ClearIndicatorStyles,
              }}
              options={sitesOpt}
              onChange={(v) => {
                setFieldValue("siteId", v);
              }}
              name="siteId"
              value={values.siteId}
            />
            <span className="text-danger">
              {errors.siteId && errors.siteId}
            </span>
          </FormGroup>
        </Col>

        <Col md="2">
          <FormGroup>
            <DesignationSelectList
              {...props}
              name="designationId"
              options={designation_op}
              value={values.designationId}
            />

            <span className="text-danger">
              {errors.designationId && errors.designationId}
            </span>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <ShiftSelectList
              {...props}
              name="shiftId"
              options={shift_op}
              value={values.shiftId}
            />
            <span className="text-danger">
              {errors.shiftId && errors.shiftId}
            </span>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label htmlFor="employeeType" style={{ marginBottom: "0px" }}>
              Wages Type <span className="text-danger">*</span>
            </Label>

            <Select
              closeMenuOnSelect={TramRounded}
              components={{ ClearIndicator }}
              styles={{
                clearIndicator: ClearIndicatorStyles,
              }}
              onChange={(v) => {
                setFieldValue("employeeWagesType", v);
              }}
              name="employeeWagesType"
              options={wagesOpt}
              value={values.employeeWagesType}
            />
            <span className="text-danger">
              {errors.employeeWagesType && errors.employeeWagesType}
            </span>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label htmlFor="employeeType" style={{ marginBottom: "0px" }}>
              Weekly Off Day<span className="text-danger">*</span>
            </Label>

            <Select
              closeMenuOnSelect={TramRounded}
              components={{ ClearIndicator }}
              styles={{
                clearIndicator: ClearIndicatorStyles,
              }}
              onChange={(v) => {
                setFieldValue("weeklyOffDay", v);
              }}
              name="weeklyOffDay"
              id="weeklyOffDay"
              options={weeklyOffOpt}
              value={values.weeklyOffDay}
            />
            <span className="text-danger">
              {errors.weeklyOffDay && errors.weeklyOffDay}
            </span>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="3">
          <FormGroup>
            <Label>
              CTC<span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="expectedSalary"
              placeholder="Enter Expected Salary"
              onChange={handleChange}
              value={values.expectedSalary}
              invalid={errors.expectedSalary ? true : false}
            />
            <FormFeedback>{errors.expectedSalary}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              DOJ <span className="text-danger">*</span>
            </Label>
            {/* <Input
              type="date"
              name="doj"
              //placeholder="Enter doj"
              onChange={handleChange}
              value={values.doj}
              invalid={errors.doj ? true : false}
            />
            <FormFeedback>{errors.doj}</FormFeedback> */}
            <MyDatePicker
              autoComplete="off"
              className="datepic form-control"
              name="doj"
              placeholderText="dd/MM/yyyy"
              id="doj"
              dateFormat="dd/MM/yyyy"
              onChange={(e) => {
                console.log("date ", e);
                setFieldValue("doj", e);
                // getNextDate(e.target.value);
              }}
              value={values.doj}
              selected={values.doj}
              maxDate={new Date()}
            />
            <span className="text-danger">{errors.doj}</span>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <label>
              Ready To Work In Three Shift<span className="text-danger">*</span>
            </label>
            <br />
            <FormGroup className="gender nightshiftlabel">
              <Label>
                <input
                  name="readyToWorkInThreeShift"
                  type="radio"
                  value={true}
                  checked={
                    values.readyToWorkInThreeShift === true ? true : false
                  }
                  onChange={(v) => {
                    setFieldValue("readyToWorkInThreeShift", true);
                  }}
                  className="mr-1"
                />
                <span>Yes</span>
              </Label>
              <Label className="ml-3">
                <input
                  name="readyToWorkInThreeShift"
                  type="radio"
                  value={false}
                  checked={
                    values.readyToWorkInThreeShift === false ? true : false
                  }
                  onChange={(v) => {
                    setFieldValue("readyToWorkInThreeShift", false);
                  }}
                  className="mr-1"
                />
                <span>No</span>
              </Label>
            </FormGroup>
            <span className="text-danger">
              {errors.readyToWorkInThreeShift && "Select Option"}
            </span>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              Ready To Work In Months <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="readyToWorkInMonths"
              placeholder="Enter Months"
              onChange={handleChange}
              value={values.readyToWorkInMonths}
              invalid={errors.readyToWorkInMonths ? true : false}
            />
            <FormFeedback>{errors.readyToWorkInMonths}</FormFeedback>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="3">
          <FormGroup>
            <Label>
              Wages Per Day <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="wagesPerDay"
              placeholder="Enter Wages Per Day"
              onChange={handleChange}
              value={values.wagesPerDay}
              invalid={errors.wagesPerDay ? true : false}
            />
            <FormFeedback>{errors.wagesPerDay}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              Bank Name <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="bankName"
              placeholder="Enter Bank Name"
              onChange={handleChange}
              value={values.bankName}
              invalid={errors.bankName ? true : false}
            />
            <FormFeedback>{errors.bankName}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              Branch Name <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="branchName"
              placeholder="Enter Branch Name"
              onChange={handleChange}
              value={values.branchName}
              invalid={errors.branchName ? true : false}
            />
            <FormFeedback>{errors.branchName}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              Account No<span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="accountNo"
              placeholder="Enter Account No"
              onChange={handleChange}
              value={values.accountNo}
              invalid={errors.accountNo ? true : false}
            />
            <FormFeedback>{errors.accountNo}</FormFeedback>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="3">
          <FormGroup>
            <Label>
              IFSC Code<span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="ifscCode"
              placeholder="Enter Ifsc Code"
              onChange={handleChange}
              value={values.ifscCode.toUpperCase()}
              invalid={errors.ifscCode ? true : false}
            />
            <FormFeedback>{errors.ifscCode}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              PF Number <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="pfNumber"
              placeholder="Enter Pf Number"
              onChange={handleChange}
              value={values.pfNumber}
              invalid={errors.pfNumber ? true : false}
            />
            <FormFeedback>{errors.pfNumber}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              ESI Number <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="esiNumber"
              placeholder="Enter ESI Number"
              onChange={handleChange}
              value={values.esiNumber}
              invalid={errors.esiNumber ? true : false}
            />
            <FormFeedback>{errors.esiNumber}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              Pan Number <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="panNumber"
              placeholder="Enter PAN Number"
              onChange={handleChange}
              value={values.panNumber}
              invalid={errors.panNumber ? true : false}
            />
            <FormFeedback>{errors.panNumber}</FormFeedback>
          </FormGroup>
        </Col>
      </Row>
      {/* <Row>
      </Row> */}
    </>
  );
}
