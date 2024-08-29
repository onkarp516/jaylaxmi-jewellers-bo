import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
  Form,
} from "reactstrap";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { ToastContainer, toast, Flip } from "react-toastify";
import { Redirect } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import img1 from "@/assets/images/logo1.png";
import loginimg from "@/assets/images/loginimg4.png";

// import img2 from "@/assets/images/background/bg8.jpg";
import { Formik, Field, ErrorMessage } from "formik";
// import { Form } from "formik";
import * as Yup from "yup";
import {
  AuthenticationService,
  getUserPermission,
} from "@/services/api_function";

const sidebarBackground = {
  // backgroundImage: "url(" + bg7 + ")",
  backgroundColor: "#e6f4fd",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "bottom center",
};

const Login = (props) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisiblity = () => {
    setShowPassword(showPassword ? false : true);
  };
  const handleClick = () => {
    var elem = document.getElementById("loginform");
    elem.style.transition = "all 2s ease-in-out";
    elem.style.display = "none";
    document.getElementById("recoverform").style.display = "block";
  };
  const [isRedirect, setIsRedirect] = useState(false);
  const redirect = () => {
    if (isRedirect == true) {
      return (
        <Redirect
          to={{
            pathname: "/dashboard",
            state: { from: props.location },
          }}
        />
      );
    } else {
      return "";
    }
  };
  useEffect(() => {
    if (AuthenticationService.currentUserValue) {
      setIsRedirect(true);
    }
  }, []);

  const callUserPermission = (userId) => {
    const requestData = new FormData();
    requestData.append("user_id", userId);
    getUserPermission(requestData)
      .then((response) => {
        console.log("user permission : ", response);
        if (response.status === 200) {
          console.log("data", response.data.userActions);
          let userPerm = response.data.userActions;
          dispatch(setUserPermissions(userPerm));
          toast.success("✔ Login Success", {
            // onClose: () => props.history.push(from),
            // window.location.href = "/dashboard"
            onClose: () => props.history.push("/dashboard", true),
          });
        } else {
          toast.error("✘ You are not authorized user");
        }
      })
      .catch((error) => {
        console.log("error : ", error);
      });
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
        {redirect()}
        <div className="auth-box on-sidebar">
          <div id="loginform">
            <div className="logo">
              {/* <span className="db">
                <img src={img1} alt="logo" />
              </span> */}
              {/* <h2>Renuka Enggineering</h2> */}
              <h6 className="font-medium mb-3">Sign In </h6>
              <img
                className="logoimg mt-3 login_desk"
                src={loginimg}
                alt="login"
              />
              {/* <div className="alert alert-success">
                Username: test & Password: test
              </div> */}
            </div>
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
                    // console.log({ username, password });
                    AuthenticationService.login(username, password).then(
                      (user) => {
                        console.log("user object : ", { user });
                        if (user.status == "OK") {
                          localStorage.setItem(
                            "authenticationService",
                            user.token
                          );
                          const { from } = props.location.state || {
                            from: { pathname: "/" },
                          };
                          // console.log("from");
                          callUserPermission(user.userId);
                          // toast.success("✔ Login Success", {
                          //   // onClose: () => props.history.push(from),
                          //   onClose: () =>
                          //     (window.location.href = "/dashboard"),
                          // });
                        } else {
                          setSubmitting(false);
                          if (user.responseStatus == 404) {
                            toast.error("✘ " + user.message);
                            setStatus(user.message);
                          } else {
                            toast.error("✘ You are not authorized user");
                            setStatus(
                              "Server Error! Please Check Your Connectivity"
                            );
                          }
                        }
                      },
                      (error) => {
                        setSubmitting(false);
                        setStatus("Check your username and password");
                        console.log("error", error);
                        // toast.error(error);
                        toast.error("✘ Check your username and password");
                      }
                    );
                  }}
                  render={({
                    errors,
                    status,
                    touched,
                    isSubmitting,
                    handleSubmit,
                    handleReset,
                  }) => (
                    <Form
                      className="mt-3"
                      id="loginform"
                      autoComplete="off"
                      onSubmit={handleSubmit}
                      onReset={handleReset}
                    >
                      <InputGroup className="mb-3">
                        <Field
                          autoFocus={true}
                          name="username"
                          type="text"
                          className={
                            "form-control" +
                            (errors.username && touched.username
                              ? " is-invalid"
                              : "")
                          }
                          placeholder="Username"
                        />
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="invalid-feedback"
                        />
                      </InputGroup>
                      <InputGroup className="mb-3 newpwd-field">
                        {/* <Field
                          name="password"
                          type="password"
                          className={
                            "form-control" +
                            (errors.password && touched.password
                              ? " is-invalid"
                              : "")
                          }
                          placeholder="******"
                        /> */}
                        <Field
                          name="password"
                          // type="password"
                          type={showPassword ? "text" : "password"}
                          className={
                            "form-control" +
                            (errors.password && touched.password
                              ? " is-invalid"
                              : "")
                          }
                          placeholder="******"
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText>
                            <i
                              className={`${
                                showPassword ? "fas fa-eye-slash" : "fas fa-eye"
                              }`}
                              onClick={() => {
                                togglePasswordVisiblity(true);
                              }}
                            ></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </InputGroup>
                      {/* <div className="d-flex no-block align-items-center mb-3">
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
                            {/* <i className="fa fa-lock mr-1"></i> Forgot pwd?
                          </a>
                        </div>
                      </div> */}
                      <Row className="mb-3">
                        <Col xs="12">
                          <button
                            type="submit"
                            className="btn btn-block btn-primary loginsubmit"
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

export default Login;
