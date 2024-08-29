import React from "react";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { MyDatePicker } from "@/helpers";

export default function Step1(props) {
  function getAge(dateString, setFieldValue) {
    console.log("date of birth:", { dateString });

    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    console.log({ age });
    setFieldValue("age", age);
    // return age;
  }

  // function daysInYear(year) {
  //   return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
  // }

  // function getNextDate(dateString) {
  //   console.log({ dateString });

  //   let months = 36;
  //   console.log({ months });
  //   let totalMonths = months / 12;
  //   console.log({ totalMonths });

  //   var now = new Date(dateString);
  //   console.log({ now });

  //   for (var i = 0; i < totalMonths; i++) {
  //     // debugger;
  //     // now.setMonth(now.getMonth() + 12);
  //     //Date().getFullYear()
  //     let currentYear = now.getFullYear();
  //     console.log("currentYear ", currentYear);

  //     let currentYearDays = daysInYear(currentYear);
  //     console.log("currentYearDays ", currentYearDays);
  //     now.setDate(now.getDate() + currentYearDays);
  //   }

  //   console.log("now ", now.toLocaleDateString());
  // }

  const {
    values,
    handleChange,
    errors,
    setFieldValue,
    addFamilyList,
    familylist,
    removeFamilyList,
  } = props;
  // console.log("values", values);

  return (
    <div className="emp_step1">
      <Row className="mt-4">
        <Col md="2">
          <FormGroup>
            <Label>
              First Name <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter First Name"
              name="firstName"
              onChange={handleChange}
              value={values.firstName}
              invalid={errors.firstName ? true : false}
            />
            <FormFeedback>{errors.firstName}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>
              Middle Name <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter Middle Name"
              name="middleName"
              onChange={handleChange}
              value={values.middleName}
              invalid={errors.middleName ? true : false}
            />
            <FormFeedback>{errors.middleName}</FormFeedback>
          </FormGroup>
        </Col>{" "}
        <Col md="2">
          <FormGroup>
            <Label>
              Last Name <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter Last Name"
              name="lastName"
              onChange={handleChange}
              value={values.lastName}
              invalid={errors.lastName ? true : false}
            />
            <FormFeedback>{errors.lastName}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>
              Full Address <span className="text-danger">*</span>
            </Label>
            <Input
              className="p-add"
              type="textarea"
              placeholder="Enter Full Address"
              name="fullAddress"
              onChange={handleChange}
              value={values.fullAddress}
              invalid={errors.fullAddress ? true : false}
            />
            <FormFeedback>{errors.fullAddress}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>
              Mobile Number <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Mobile Number"
              name="mobileNumber"
              onChange={handleChange}
              value={values.mobileNumber}
              invalid={errors.mobileNumber ? true : false}
            />
            <FormFeedback>{errors.mobileNumber}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>
              DOB<span className="text-danger">*</span>
            </Label>
            {/* <Input
              type="date"
              placeholder="Enter dob"
              name="dob"
              // onChange={handleChange}
              onChange={(e) => {
                console.log("date ", e.target.value);
                setFieldValue("dob", e.target.value);
                getAge(e.target.value, setFieldValue);
                // getNextDate(e.target.value);
              }}
              value={values.dob}
              invalid={errors.dob ? true : false}
            />
            <FormFeedback>{errors.dob}</FormFeedback> */}
            <MyDatePicker
              autoComplete="off"
              className="datepic form-control"
              name="dob"
              placeholderText="dd/MM/yyyy"
              id="dob"
              dateFormat="dd/MM/yyyy"
              onChange={(e) => {
                console.log("date ", e);
                setFieldValue("dob", e);
                getAge(e, setFieldValue);
                // getNextDate(e.target.value);
              }}
              value={values.dob}
              selected={values.dob}
              maxDate={new Date()}
            />
            <span className="text-danger">{errors.dob}</span>
          </FormGroup>
        </Col>
        <Col md="1">
          <FormGroup>
            <Label>Age</Label>
            <Input
              readOnly={true}
              type="text"
              name="age"
              placeholder="Age"
              onChange={handleChange}
              value={values.age}
              invalid={errors.age ? true : false}
            />
            <FormFeedback>{errors.age}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="1">
          <FormGroup>
            <Label>Height</Label>
            <Input
              type="text"
              name="height"
              placeholder="Height"
              onChange={handleChange}
              value={values.height}
              invalid={errors.height ? true : false}
            />
            <FormFeedback>{errors.height}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>Weight</Label>
            <Input
              type="text"
              name="weight"
              placeholder="Weight"
              onChange={handleChange}
              value={values.weight}
              invalid={errors.weight ? true : false}
            />
            <FormFeedback>{errors.weight}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>Blood Group</Label>
            <Input
              type="text"
              name="bloodGroup"
              placeholder="Blood Group"
              onChange={handleChange}
              value={values.bloodGroup}
              invalid={errors.bloodGroup ? true : false}
            />
            <FormFeedback>{errors.bloodGroup}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <label>
              Gender <span className="text-danger">*</span>
            </label>
            <br />
            <FormGroup className="gender nightshiftlabel">
              <Label>
                <input
                  name="gender"
                  type="radio"
                  value="Female"
                  checked={
                    values.gender
                      ? values.gender.toLowerCase() === "female"
                        ? true
                        : false
                      : ""
                  }
                  onChange={handleChange}
                  className="mr-1"
                />
                <span>Female</span>
              </Label>
              <Label className="ml-3">
                <input
                  name="gender"
                  type="radio"
                  value="Male"
                  onChange={handleChange}
                  checked={
                    values.gender
                      ? values.gender.toLowerCase() === "male"
                        ? true
                        : false
                      : ""
                  }
                  className="mr-1"
                />
                <span>Male</span>
              </Label>
            </FormGroup>
            <span className="text-danger">
              {errors.gender && "Select Option"}
            </span>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <label>
              Marital Status <span className="text-danger">*</span>
            </label>
            <br />
            <FormGroup className="gender nightshiftlabel">
              <Label>
                <input
                  name="marriageStatus"
                  type="radio"
                  value="married"
                  checked={values.marriageStatus === "married" ? true : false}
                  onChange={(v) => {
                    setFieldValue("marriageStatus", "married");
                  }}
                  className="mr-1"
                />
                <span>Married</span>
              </Label>
              <Label className="ml-3">
                <input
                  name="marriageStatus"
                  type="radio"
                  value="single"
                  checked={values.marriageStatus === "single" ? true : false}
                  onChange={(v) => {
                    setFieldValue("marriageStatus", "single");
                  }}
                  className="mr-1"
                />
                <span>UnMarried</span>
              </Label>
            </FormGroup>
            <span className="text-danger">
              {errors.marriageStatus && "Select Option"}
            </span>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>
              Religion <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="religion"
              placeholder="Enter Religion"
              onChange={handleChange}
              value={values.religion}
              invalid={errors.religion ? true : false}
            />
            <FormFeedback>{errors.religion}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>
              Cast <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="cast"
              placeholder="Enter Cast"
              onChange={handleChange}
              value={values.cast}
              invalid={errors.cast ? true : false}
            />
            <FormFeedback>{errors.cast}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label>
              Hobbies <span className="text-danger">*</span>
            </Label>
            <Input
              type="textarea"
              name="hobbies"
              placeholder="Enter Hobbies"
              onChange={handleChange}
              value={values.hobbies}
              invalid={errors.hobbies ? true : false}
            />
            <FormFeedback>{errors.hobbies}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label>
              Reason To Join <span className="text-danger">*</span>
            </Label>
            <Input
              className="p-add"
              type="textarea"
              name="reasonToJoin"
              placeholder="Enter Reason"
              onChange={handleChange}
              value={values.reasonToJoin}
              invalid={errors.reasonToJoin ? true : false}
            />
            <FormFeedback>{errors.reasonToJoin}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <label>
              Is Specks <span className="text-danger">*</span>
            </label>
            <br />
            <FormGroup className="gender nightshiftlabel">
              <Label>
                <input
                  name="isSpecks"
                  type="radio"
                  value={true}
                  checked={values.isSpecks === true ? true : false}
                  onChange={(v) => {
                    setFieldValue("isSpecks", true);
                  }}
                  className="mr-1"
                />
                <span>Yes</span>
              </Label>
              <Label className="ml-3">
                <input
                  name="isSpecks"
                  type="radio"
                  value={false}
                  checked={values.isSpecks === false ? true : false}
                  onChange={(v) => {
                    setFieldValue("isSpecks", false);
                  }}
                  className="mr-1"
                />
                <span>No</span>
              </Label>
            </FormGroup>
            <span className="text-danger">
              {errors.isSpecks && "Select Option?"}
            </span>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <label>
              Is Disability <span className="text-danger">*</span>
            </label>
            <br />
            <FormGroup className="gender nightshiftlabel">
              <Label>
                <input
                  name="isDisability"
                  type="radio"
                  value="true"
                  checked={values.isDisability === "true" ? true : false}
                  onChange={(v) => {
                    setFieldValue("isDisability", "true");
                  }}
                  className="mr-1"
                />
                <span>Yes</span>
              </Label>
              <Label className="ml-3">
                <input
                  name="isDisability"
                  type="radio"
                  value="false"
                  checked={values.isDisability === "false" ? true : false}
                  onChange={(v) => {
                    setFieldValue("isDisability", "false");
                    setFieldValue("disabilityDetails", "");
                  }}
                  className="mr-1"
                />
                <span>No</span>
              </Label>
            </FormGroup>
            <span className="text-danger">
              {errors.isDisability && "Select Option?"}
            </span>
          </FormGroup>
        </Col>
        {values.isDisability == "true" ? (
          <Col md="3">
            <FormGroup>
              <Label>
                Disability Details <span className="text-danger">*</span>
              </Label>
              <Input
                type="text"
                name="disabilityDetails"
                placeholder="Enter Disability Details"
                onChange={handleChange}
                value={values.disabilityDetails}
                invalid={errors.disabilityDetails ? true : false}
              />
              <FormFeedback>{errors.disabilityDetails}</FormFeedback>
            </FormGroup>
          </Col>
        ) : (
          ""
        )}
        <Col md="2">
          <FormGroup>
            <label>
              Is Injured<span className="text-danger">*</span>
            </label>
            <br />
            <FormGroup className="gender nightshiftlabel">
              <Label>
                <input
                  name="isInjured"
                  type="radio"
                  value="true"
                  checked={values.isInjured === "true" ? true : false}
                  onChange={(v) => {
                    setFieldValue("isInjured", "true");
                  }}
                  className="mr-1"
                />
                <span>Yes</span>
              </Label>
              <Label className="ml-3">
                <input
                  name="isInjured"
                  type="radio"
                  value="false"
                  checked={values.isInjured === "false" ? true : false}
                  onChange={(v) => {
                    setFieldValue("isInjured", "false");
                    setFieldValue("injureDetails", "");
                  }}
                  className="mr-1"
                />
                <span>No</span>
              </Label>
            </FormGroup>
            <span className="text-danger">
              {errors.isInjured && "Select Option?"}
            </span>
          </FormGroup>
        </Col>
        {values.isInjured == "true" ? (
          <Col md="3">
            <FormGroup>
              <Label>
                Injured Details <span className="text-danger">*</span>
              </Label>
              <Input
                type="text"
                name="injureDetails"
                placeholder="Enter Injured Details"
                onChange={handleChange}
                value={values.injureDetails}
                invalid={errors.injureDetails ? true : false}
              />
              <FormFeedback>{errors.injureDetails}</FormFeedback>
            </FormGroup>
          </Col>
        ) : (
          ""
        )}
        <Col md="3">
          <FormGroup>
            <Label>
              Police Case Details <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="policeCaseDetails"
              placeholder="Enter Police Case Details"
              onChange={handleChange}
              value={values.policeCaseDetails}
              invalid={errors.policeCaseDetails ? true : false}
            />
            <FormFeedback>{errors.policeCaseDetails}</FormFeedback>
          </FormGroup>
        </Col>
      </Row>

      <div className="pt-0">
        <fieldset className=" mb-3">
          <h4 className="mt-5">Family Details:</h4>
          <Row>
            <Col md="3">
              <FormGroup>
                <Label htmlFor="f_fullName">Full Name</Label>
                <Input
                  type="text"
                  placeholder="Full Name"
                  name="f_fullName"
                  onChange={handleChange}
                  value={values.f_fullName}
                  invalid={errors.f_fullName ? true : false}
                />
                <FormFeedback>{errors.f_fullName}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md="1">
              <FormGroup>
                <Label htmlFor="f_age">Age</Label>
                <Input
                  type="text"
                  placeholder="Age"
                  name="f_age"
                  onChange={handleChange}
                  value={values.f_age}
                  invalid={errors.f_age ? true : false}
                />
                <FormFeedback>{errors.f_age}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md="2">
              <FormGroup>
                <Label htmlFor="f_relation">Relation</Label>
                <Input
                  type="text"
                  placeholder="Relation"
                  name="f_relation"
                  onChange={handleChange}
                  value={values.f_relation}
                  invalid={errors.f_relation ? true : false}
                />
                <FormFeedback>{errors.f_relation}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md="1">
              <FormGroup>
                <Label htmlFor="f_education">Education</Label>
                <Input
                  type="text"
                  placeholder="Education"
                  name="f_education"
                  onChange={handleChange}
                  value={values.f_education}
                  invalid={errors.f_education ? true : false}
                />
                <FormFeedback>{errors.f_education}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md="2">
              <FormGroup>
                <Label htmlFor="f_business">Business</Label>
                <Input
                  type="text"
                  placeholder="Business"
                  name="f_business"
                  onChange={handleChange}
                  value={values.f_business}
                  invalid={errors.f_business ? true : false}
                />
                <FormFeedback>{errors.f_business}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md="2">
              <FormGroup>
                <Label htmlFor="f_incomePerMonth">Income(Per Month)</Label>
                <Input
                  type="text"
                  placeholder="Income"
                  name="f_incomePerMonth"
                  onChange={handleChange}
                  value={values.f_incomePerMonth}
                  invalid={errors.f_incomePerMonth ? true : false}
                />
                <FormFeedback>{errors.f_incomePerMonth}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md="1">
              <Button
                className="btn mainbtn1 addrowbtn1 p-1"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    values.f_fullName != "" &&
                    values.f_age != "" &&
                    values.f_relation != "" &&
                    values.f_business != "" &&
                    values.f_incomePerMonth != ""
                  ) {
                    addFamilyList(
                      {
                        f_fullName: values.f_fullName,
                        f_age: values.f_age,
                        f_relation: values.f_relation,
                        f_education: values.f_education,
                        f_business: values.f_business,
                        f_incomePerMonth: values.f_incomePerMonth,
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
        </fieldset>
        {familylist.length > 0 && (
          <Row className="mb-4">
            <Col md="12">
              <TableContainer component={Paper} className="mt-2">
                <Table aria-label="simple table">
                  <TableHead className="" style={{ background: "#f9f9f9" }}>
                    <TableRow className="orderdetail-tbl">
                      <TableCell className="p-1">Name</TableCell>
                      <TableCell className="p-1">Age</TableCell>
                      <TableCell className="p-1">Relation</TableCell>
                      <TableCell className="p-1">Education</TableCell>
                      <TableCell className="p-1">Business</TableCell>
                      <TableCell className="p-1">Income</TableCell>
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
                    {familylist &&
                      familylist.map((v, key) => (
                        <TableRow key={key}>
                          <TableCell>{v.fullName}</TableCell>
                          <TableCell>{v.age}</TableCell>
                          <TableCell>{v.relation}</TableCell>
                          <TableCell>{v.education}</TableCell>
                          <TableCell>{v.business}</TableCell>
                          <TableCell>{v.incomePerMonth}</TableCell>
                          <TableCell>
                            <Button
                              className="mainbtnminus"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                removeFamilyList(key);
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
    </div>
  );
}
