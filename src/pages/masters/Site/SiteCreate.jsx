import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import {
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Row,
  Col,
  Form,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";
import { createSite } from "@/services/api_function";
import MyMapComponent from "./MyMapComponent";
import LayoutCustom from "@/pages/layout/LayoutCustom";

export default function SiteCreate(props) {
  const formRef = useRef();

  const [customlat, setCustomLat] = useState(20.5937);
  const [customlng, setCustomLng] = useState(78.9629);
  const [initData, setInitData] = useState();
  useEffect(() => {
    if (formRef.current) {
      // console.log(formRef);
      // formRef.current.handleSubmit();
      formRef.current.setFieldValue("siteLat", customlat);
    }
  }, [customlat]);
  useEffect(() => {
    if (formRef.current) {
      formRef.current.setFieldValue("siteLong", customlng);
    }
  }, [customlng]);
  return (
    <LayoutCustom>
      <div>
        <Card>
          <CardBody className="border-bottom p-2">
            <Row>
              <Col md={6}>
                <MyMapComponent
                  isMarkerShown
                  customlat={customlat}
                  customlng={customlng}
                  setCustomLat={setCustomLat}
                  setCustomLng={setCustomLng}
                />
              </Col>
              <Col md={6}>
                <Card>
                  <CardBody className="border-bottom">
                    <CardTitle className="mb-0">
                      <i className="mdi mdi-plus mr-2"></i>
                      Site Creation
                    </CardTitle>
                  </CardBody>
                  <CardBody>
                    <Formik
                      validateOnBlur={false}
                      validateOnChange={false}
                      // enableReinitialize={true}
                      initialValues={{
                        siteName: "",
                        siteHindiName: "",
                        siteCode: "",
                        siteLat: customlat,
                        siteLong: customlng,
                        siteRadius: "",
                      }}
                      innerRef={formRef}
                      validationSchema={Yup.object().shape({
                        siteName: Yup.string()
                          .trim()
                          .required("Site name is required"),
                        siteHindiName: Yup.string()
                          .trim()
                          .required("Site hindi name is required"),
                        siteCode: Yup.string()
                          .trim()
                          .required("Site code is required"),
                        siteLat: Yup.string()
                          .trim()
                          .required("Site latitude is required"),
                        siteLong: Yup.string()
                          .trim()
                          .required("Site logitude is required"),
                        siteRadius: Yup.string()
                          .trim()
                          .required("Site radious is required"),
                      })}
                      onSubmit={(
                        values,
                        { resetForm, setStatus, setSubmitting }
                      ) => {
                        setStatus();

                        createSite(values)
                          .then((response) => {
                            // console.log("response", response);
                            if (response.data.responseStatus == 200) {
                              setSubmitting(false);
                              toast.success("✔ " + response.data.message);
                              // resetForm();
                              setTimeout(() => {
                                props.history.push("/master/site");
                              }, 2000);
                            } else {
                              setSubmitting(false);
                              toast.error("✘ " + response.data.message);
                            }
                          })
                          .catch((error) => {
                            console.log("error", error);
                          });
                        // console.log({ requestData });
                      }}
                      render={({
                        errors,
                        status,
                        touched,
                        isSubmitting,
                        handleChange,
                        handleSubmit,
                        setFieldValue,
                        values,
                      }) => (
                        <Form autoComplete="off" onSubmit={handleSubmit}>
                          <Row>
                            <Col md="6">
                              <FormGroup>
                                <Label>Latitude</Label>
                                <Input
                                  type="text"
                                  placeholder="Enter Site Latitude"
                                  name="siteLat"
                                  value={values.siteLat}
                                  invalid={errors.siteLat ? true : false}
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    setFieldValue("siteLat", v);
                                    // setCustomLat(parseFloat(v));
                                  }}
                                />
                                <FormFeedback>{errors.siteLat}</FormFeedback>
                              </FormGroup>
                            </Col>
                            <Col md="6">
                              <FormGroup>
                                <Label>Logitude</Label>
                                <Input
                                  type="text"
                                  name="siteLong"
                                  placeholder="Enter Site Logitude"
                                  value={values.siteLong}
                                  invalid={errors.siteLong ? true : false}
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    // console.log(v);
                                    setFieldValue("siteLong", v);
                                    // setCustomLng(parseFloat(v));
                                  }}
                                />
                                <FormFeedback>{errors.siteLong}</FormFeedback>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="6">
                              <FormGroup>
                                <Label>Site Name</Label>
                                <Input
                                  type="text"
                                  placeholder="Enter Site Name"
                                  name="siteName"
                                  onChange={handleChange}
                                  value={values.siteName}
                                  invalid={errors.siteName ? true : false}
                                />
                                <FormFeedback>{errors.siteName}</FormFeedback>
                              </FormGroup>
                            </Col>
                            <Col md="6">
                              <FormGroup>
                                <Label>Site Hindi Name</Label>
                                <Input
                                  type="text"
                                  placeholder="Enter Site Hindi Name"
                                  name="siteHindiName"
                                  onChange={handleChange}
                                  value={values.siteHindiName}
                                  invalid={errors.siteHindiName ? true : false}
                                />
                                <FormFeedback>
                                  {errors.siteHindiName}
                                </FormFeedback>
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                            <Col md="6">
                              <FormGroup>
                                <Label>Site Code</Label>
                                <Input
                                  type="text"
                                  name="siteCode"
                                  placeholder="Enter Site Code"
                                  onChange={handleChange}
                                  value={values.siteCode}
                                  invalid={errors.siteCode ? true : false}
                                />
                                <FormFeedback>{errors.siteCode}</FormFeedback>
                              </FormGroup>
                            </Col>
                            <Col md="6">
                              <FormGroup>
                                <Label>Allowed Radious in meter</Label>
                                <Input
                                  type="text"
                                  placeholder="Enter radious"
                                  name="siteRadius"
                                  onChange={handleChange}
                                  value={values.siteRadius}
                                  invalid={errors.siteRadius ? true : false}
                                />
                                <FormFeedback>{errors.siteRadius}</FormFeedback>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            {/* <Button
                          type="submit"
                          className="btn-success text-white ml-2 mr-4"
                          disabled={isSubmitting}
                        >
                          Create
                        </Button> */}
                            <Button
                              type="submit"
                              className="mainbtn1 text-white"
                              disabled={isSubmitting}
                            >
                              Create
                            </Button>

                            <Button
                              className="mainbtn1 modalcancelbtn mr-4"
                              type="button"
                              onClick={() => {
                                // onAddModalShow(null);
                                props.history.push("/master/site");
                              }}
                            >
                              Cancel
                            </Button>
                          </Row>
                        </Form>
                      )}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </LayoutCustom>
  );
}
