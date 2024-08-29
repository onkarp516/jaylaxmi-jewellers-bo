import React, { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  CustomInput,
  FormGroup,
  Row,
  Col,
  UncontrolledTooltip,
  Button,
} from "reactstrap";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img1 from "../../assets/images/logo-icon.png";
import img2 from "../../assets/images/background/bg4.jpg";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthenticationService } from "../../jwt/_services";

const sidebarBackground = {
  backgroundImage: "url(" + img2 + ")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "bottom center",
};

const UserLogin = (props) => {
  const handleClick = () => {
    var elem = document.getElementById("loginform");
    elem.style.transition = "all 2s ease-in-out";
    elem.style.display = "none";
    document.getElementById("recoverform").style.display = "block";
  };

  return (
    <div className="">
      {/*--------------------------------------------------------------------------------*/}
      {/*Login Cards*/}
      {/*--------------------------------------------------------------------------------*/}
      <div
        className="auth-wrapper d-flex no-block justify-content-center align-items-center"
        style={sidebarBackground}
      >
        <div className="">{/* <h4>Hi</h4> */}</div>
        <div className="auth-box on-sidebar">
          <div id="loginform">
            <div className="logo">
              <span className="db">
                <img src={img1} alt="logo" />
              </span>
              <h5 className="font-medium mb-3">User Login</h5>
              {/* <div className="alert alert-success">
                Username: test & Password: test
              </div> */}
            </div>
            <Row>
              <Col xs="12">
                <Formik
                  initialValues={{
                    username: "",
                    password: "",
                  }}
                  validationSchema={Yup.object().shape({
                    username: Yup.string().required("Username is required"),
                    password: Yup.string().required("Password is required"),
                  })}
                  onSubmit={(
                    { username, password },
                    { setStatus, setSubmitting }
                  ) => {
                    setStatus();
                    AuthenticationService.userLogin(username, password).then(
                      (user) => {
                        if (user.responseStatus == "success") {
                          const { from } = props.location.state || {
                            from: { pathname: "/" },
                          };
                          toast.success("✔ " + user.message, {
                            // onClose: () => props.history.push(from),
                            onClose: () => (window.location.href = "/"),
                          });
                        } else {
                          toast.error("✘ " + user.message);
                          setSubmitting(false);
                        }
                      },
                      (error) => {
                        setSubmitting(false);
                        setStatus(error);
                        toast.error(error);
                        // toast.error("✘ Check your username and password");
                      }
                    );
                  }}
                  render={({ errors, status, touched, isSubmitting }) => (
                    <Form className="mt-3" id="loginform" autoComplete="off">
                      <ToastContainer
                        transition={Flip}
                        position="top-right"
                        autoClose={750}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                      />
                      <InputGroup className="mb-3">
                        {/* <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ti-user"></i>
                          </InputGroupText>
                        </InputGroupAddon> */}

                        <Field
                          name="username"
                          type="text"
                          className={
                            "form-control" +
                            (errors.username && touched.username
                              ? " is-invalid"
                              : "")
                          }
                          placeholder="mobile"
                        />
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="invalid-feedback"
                        />
                      </InputGroup>
                      <InputGroup className="mb-3">
                        {/* <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ti-pencil"></i>
                          </InputGroupText>
                        </InputGroupAddon> */}
                        <Field
                          name="password"
                          type="password"
                          className={
                            "form-control" +
                            (errors.password && touched.password
                              ? " is-invalid"
                              : "")
                          }
                          placeholder="******"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </InputGroup>
                      <div className="d-flex no-block align-items-center mb-3">
                        <CustomInput
                          type="checkbox"
                          id="exampleCustomCheckbox"
                          label="Remember Me"
                        />
                        <div className="ml-auto">
                          <a
                            href="#recoverform"
                            id="to-recover"
                            onClick={handleClick.bind(null)}
                            className="forgot text-dark float-right"
                          >
                            <i className="fa fa-lock mr-1"></i> Forgot pwd?
                          </a>
                        </div>
                      </div>
                      <Row className="mb-3">
                        <Col xs="12">
                          <button
                            type="submit"
                            className="btn btn-block btn-primary"
                            disabled={isSubmitting}
                          >
                            Login
                          </button>
                        </Col>
                      </Row>
                      <div className="text-center mb-2"></div>
                      {status && (
                        <div className={"alert alert-danger"}>{status}</div>
                      )}
                    </Form>
                  )}
                />
              </Col>
            </Row>
          </div>
          <div id="recoverform">
            <div className="logo">
              <span className="db">
                <img src={img1} alt="logo" />
              </span>
              <h5 className="font-medium mb-3">Recover Password</h5>
              <span>
                Enter your Email and instructions will be sent to you!
              </span>
            </div>
            <Row className="mt-3">
              <Col xs="12">
                <Form action="/dashbaord">
                  <FormGroup>
                    <Input
                      type="text"
                      name="uname"
                      bsSize="lg"
                      id="Name"
                      placeholder="Username"
                      required
                    />
                  </FormGroup>
                  <Row className="mt-3">
                    <Col xs="12">
                      <Button color="danger" size="lg" type="submit" block>
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
