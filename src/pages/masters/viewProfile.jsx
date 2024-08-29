import React, { useState, useEffect, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AuthenticationService } from "@/services/api_function";
import * as Yup from "yup";
import axios from "axios";
import { getHeader } from "@/helpers";
import { changePasswordUrl } from "@/services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Row,
  Col,
  // Button,
  FormGroup,
  Card,
  CardBody,
  CardHeader,
  Label,
  CardTitle,
  Input,
  Badge,
  FormFeedback,
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import { Formik, Field, ErrorMessage } from "formik";
import Button from "@material-ui/core/Button";
import LayoutCustom from "@/pages/layout/LayoutCustom";

export default (props) => {
  const [width, setWidth] = useState(window.innerWidth);

  const settings = useSelector((state) => state.settings);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisiblity = () => {
    setShowPassword(showPassword ? false : true);
  };

  return (
    <LayoutCustom>
      <div className="">
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            username: AuthenticationService.currentUserValue
              ? AuthenticationService.currentUserValue.username
              : "",
            password: "",
            confirmpassword: "",
          }}
          validationSchema={Yup.object().shape({
            password: Yup.string().trim().required("New Password is required"),
            //  .min(8, "Passworld must be 8 characters"),
            //.matches("Password should like Ex. Abc@1234"),
            confirmpassword: Yup.string()
              .trim()
              .required("Confirm Password is required")
              .oneOf([Yup.ref("password"), null], "Passwords mis-match"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();

            let requestData = {
              username: values.username,
              password: values.password,
            };

            axios({
              method: "POST",
              headers: getHeader(),
              data: requestData,
              url: changePasswordUrl(),
            })
              .then((response) => {
                if (response.data.responseStatus === 200) {
                  setSubmitting(false);
                  toast.success("✔ " + response.data.message);
                  resetForm();
                } else {
                  setSubmitting(false);
                  toast.error("✘ " + response.data.message);
                }
              })
              .catch((error) => {
                setSubmitting(false);
                toast.error("✘ " + error);
              });
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
            <Form onSubmit={handleSubmit}>
              <Card className="m-5">
                <CardHeader
                  className="p-2 editprofile"
                  style={{ background: "#e9ecef" }}
                >
                  <h4 className="mb-0">Change Password</h4>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md="3">
                      <FormGroup>
                        <Label>Username</Label>

                        <Input
                          readOnly
                          type="text"
                          placeholder="Enter new password"
                          name="password"
                          onChange={handleChange}
                          value={values.username}
                          invalid={errors.username ? true : false}
                        />

                        <FormFeedback>{errors.username}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup className="newpwd-field">
                        <Label>New Password</Label>
                        <InputGroup className="mb-3">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            name="password"
                            onChange={handleChange}
                            value={values.password}
                          />
                          <InputGroupAddon addonType="append">
                            <InputGroupText>
                              <i
                                className={`${
                                  showPassword
                                    ? "fas fa-eye-slash"
                                    : "fas fa-eye"
                                }`}
                                onClick={() => {
                                  togglePasswordVisiblity(true);
                                }}
                              ></i>
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        <span className="text-danger">{errors.password}</span>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup className="newpwd-field">
                        <Label>Confirm Password</Label>
                        <InputGroup className="mb-3">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter confirm password"
                            name="confirmpassword"
                            onChange={handleChange}
                            value={values.confirmpassword}
                          />
                          <InputGroupAddon addonType="append">
                            <InputGroupText>
                              <i
                                className={`${
                                  showPassword
                                    ? "fas fa-eye-slash"
                                    : "fas fa-eye"
                                }`}
                                onClick={() => {
                                  togglePasswordVisiblity(true);
                                }}
                              ></i>
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        <span className="text-danger">
                          {errors.confirmpassword}
                        </span>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button
                    className="edityellowbtn text-white mainbtn1 p-0"
                    type="submit"
                  >
                    Submit
                  </Button>
                </CardBody>
              </Card>
            </Form>
          )}
        />
      </div>
    </LayoutCustom>
  );
};
