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

import { Image } from "react-bootstrap";
import Select from "react-select";
import { truncateString } from "@/helpers";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import DocumentSelectList from "@/helpers/DocumentSelectList";

export default function Step2(props) {
  // console.log("props", props);
  const {
    values,
    handleChange,
    errors,
    document_op,
    addDocumentList,
    documentlist,
    removeDocumentList,
    addEducationList,
    educationlist,
    removeEducationList,
    setFieldValue,

    removeOldDocument,
    oldDocumentList,
    oldDocRemoveList,
  } = props;

  return (
    <div className="emp_step1">
      <br />
      {/* <Row className="mt-4"> */}
      {/* <h4 className="mt-4">Education Details: </h4> */}
      <Row>
        <Col md="2">
          <FormGroup>
            <Label htmlFor="e_designationName">Designation Name</Label>
            <Input
              type="text"
              placeholder="Enter Designation Name"
              name="e_designationName"
              onChange={handleChange}
              value={values.e_designationName}
              invalid={errors.e_designationName ? true : false}
            />
            <FormFeedback>{errors.e_designationName}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label htmlFor="e_schoolName">School Name</Label>
            <Input
              type="text"
              placeholder="Enter School Name"
              name="e_schoolName"
              onChange={handleChange}
              value={values.e_schoolName}
              invalid={errors.e_schoolName ? true : false}
            />
            <FormFeedback>{errors.e_schoolName}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="1">
          <FormGroup>
            <Label htmlFor="e_year">Year</Label>
            <Input
              type="text"
              placeholder="Enter Year"
              name="e_year"
              onChange={handleChange}
              value={values.e_year == 'NA' ? 0 : values.e_year}
              invalid={errors.e_year ? true : false}
            />
            <FormFeedback>{errors.e_year}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="1">
          <FormGroup>
            <Label htmlFor="e_grade">Grade</Label>
            <Input
              type="text"
              placeholder="Enter Grade"
              name="e_grade"
              onChange={handleChange}
              value={values.e_grade}
              invalid={errors.e_grade ? true : false}
            />
            <FormFeedback>{errors.e_grade}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label htmlFor="e_percentage">Percentage</Label>
            <Input
              type="text"
              placeholder="Enter Percentage"
              name="e_percentage"
              onChange={handleChange}
              value={values.e_percentage}
              invalid={errors.e_percentage ? true : false}
            />
            <FormFeedback>{errors.e_percentage}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label htmlFor="e_mainSubject">Main Subject</Label>
            <Input
              type="text"
              placeholder="Enter mainSubject"
              name="e_mainSubject"
              onChange={handleChange}
              value={values.e_mainSubject}
              invalid={errors.e_mainSubject ? true : false}
            />
            <FormFeedback>{errors.e_mainSubject}</FormFeedback>
          </FormGroup>
        </Col>
        {/* <Col md="3">
          <Button
            className="mt-4 btn mainbtn1 addrowbtn1"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (
                values.e_designationName != "" &&
                values.e_schoolName != "" &&
                values.e_year != "" &&
                values.e_grade != "" &&
                values.e_percentage != "" &&
                values.e_mainSubject != ""
              ) {
                addEducationList(
                  {
                    e_designationName: values.e_designationName,
                    e_schoolName: values.e_schoolName,
                    e_year: values.e_year,
                    e_grade: values.e_grade,
                    e_percentage: values.e_percentage,
                    e_mainSubject: values.e_mainSubject,
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
        </Col> */}
        <Col md="1">
          {/* <Button className="experienceplus mainbtnminus">
            <svg
              class="MuiSvgIcon-root "
              focusable="false"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
            </svg>
          </Button> */}
          <Button
            className="mainbtn1 addrowbtn1"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (
                values.e_designationName != "" &&
                values.e_schoolName != "" &&
                values.e_year != "" &&
                values.e_grade != "" &&
                values.e_percentage != "" &&
                values.e_mainSubject != ""
              ) {
                addEducationList(
                  {
                    e_designationName: values.e_designationName,
                    e_schoolName: values.e_schoolName,
                    e_year: values.e_year == 'NA' ? 0 : values.e_year,
                    e_grade: values.e_grade,
                    e_percentage: values.e_percentage,
                    e_mainSubject: values.e_mainSubject,
                  },
                  setFieldValue
                );
              } else {
                toast.error("✘ Please give inputs");
              }
            }}
          >
            Add Row
            {/* <i className="mdi mdi-plus"></i> */}
          </Button>
        </Col>
      </Row>
      {educationlist.length > 0 && (
        <Row className="mb-4">
          <Col md="12">
            <TableContainer component={Paper} className="mt-2">
              <Table aria-label="simple table">
                <TableHead className="" style={{ background: "#f9f9f9" }}>
                  <TableRow className="orderdetail-tbl">
                    <TableCell className="p-1">Designation Name</TableCell>
                    <TableCell className="p-1">School Name</TableCell>
                    <TableCell className="p-1">Year</TableCell>
                    <TableCell className="p-1">Grade</TableCell>
                    <TableCell className="p-1">Percentage</TableCell>
                    <TableCell className="p-1">Main Subject</TableCell>
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
                  {educationlist &&
                    educationlist.map((v, key) => (
                      <TableRow key={key}>
                        <TableCell>{v.designationName}</TableCell>
                        <TableCell>{v.schoolName}</TableCell>
                        <TableCell>{v.year}</TableCell>
                        <TableCell>{v.grade}</TableCell>
                        <TableCell>{v.percentage}</TableCell>
                        <TableCell>{v.mainSubject}</TableCell>

                        <TableCell>
                          <Button
                            className="mainbtnminus"
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeEducationList(key);
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

      <h4 className="mt-4"> Documents Details: </h4>

      {document_op.length > 0 && (
        <div className="">
          {/* <h6 className="mt-4">REQUIRED DOCUMENTS : &nbsp;</h6> */}
          <div>
            <ul className="documentdet">
              {document_op.map((v) => {
                if (v.required == true) {
                  return <li className="bg-success">{v.label}</li>;
                }
              })}
            </ul>
          </div>
        </div>
      )}

      <Row>
        <Col md="3">
          <FormGroup>
            <DocumentSelectList
              {...props}
              name="d_documentId"
              options={document_op}
              value={values.d_documentId}
            />

            <span className="text-danger">
              {errors.d_documentId && errors.d_documentId}
            </span>
          </FormGroup>
        </Col>

        <Col md="3">
          <FormGroup>
            <Label htmlFor="employeeType">Upload Document</Label>
            <InputGroup className="">
              <div className="custom-file">
                <Input
                  type="file"
                  name="d_imagePath"
                  className="custom-file-input"
                  onChange={(e) => {
                    setFieldValue("d_imagePath", e.target.files[0]);
                  }}
                />

                <label className="custom-file-label" htmlFor="d_imagePath">
                  {values.d_imagePath ? "FILE SELECTED" : "Upload Document"}
                </label>
              </div>
            </InputGroup>
            <span className="text-danger">{errors.d_imagePath}</span>
          </FormGroup>
        </Col>
        <Col md="3">
          <Button
            className="mt-4 btn mainbtn1 addrowbtn1"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (values.d_documentId != "" && values.d_imagePath != "") {
                addDocumentList(
                  {
                    d_documentId: values.d_documentId,
                    d_imagePath: values.d_imagePath,
                  },
                  setFieldValue
                );
              } else {
                toast.error("✘ Please check the documents inputs");
              }
            }}
          >
            Add Row
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        {oldDocumentList && oldDocumentList.length > 0 && (
          <Col md="12">
            <h5>Old Documents</h5>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead className="" style={{ background: "#f9f9f9" }}>
                  <TableRow className="orderdetail-tbl">
                    <TableCell className="p-1">Document Name</TableCell>
                    <TableCell className="p-1">Document</TableCell>
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
                  {oldDocumentList &&
                    oldDocumentList.map((v, key) => (
                      <TableRow key={key}>
                        <TableCell>
                          {v.d_documentId ? v.d_documentId.label : ""}
                        </TableCell>

                        <TableCell>
                          <Image src={v.imagePath} width="10%" height="10%" />
                        </TableCell>

                        <TableCell>
                          <Button
                            className="mainbtnminus"
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeOldDocument(key);
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
        )}

        {documentlist.length > 0 && (
          <Col md="12">
            <h5 className="mt-2">New Documents</h5>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead className="p-1" style={{ background: "#f9f9f9" }}>
                  <TableRow className="orderdetail-tbl">
                    <TableCell className="p-1">Document Name</TableCell>
                    <TableCell className="p-1">Document</TableCell>
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
                  {documentlist &&
                    documentlist.map((v, key) => (
                      <TableRow key={key}>
                        <TableCell>
                          {v.d_documentId}
                        </TableCell>

                        <TableCell>
                          {v.imagePath != undefined ? (
                            <a href={v.imagePath} target="_blank">
                              Download Document
                            </a>
                          ) : v.imagePath ? (
                            truncateString(v.imagePath.name, 20)
                          ) : (
                            "-"
                          )}
                        </TableCell>

                        <TableCell>
                          <Button
                            className="mainbtnminus"
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeDocumentList(key);
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
        )}
      </Row>
    </div>
  );
}
