import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Nav,
  NavItem,
  // NavLink,
  Button,
  Navbar,
  NavbarBrand,
  Collapse,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledCarousel,
  Progress,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
} from "reactstrap";
import * as data from "./Data";

/*--------------------------------------------------------------------------------*/
/* Import images which are need for the HEADER                                    */
/*--------------------------------------------------------------------------------*/
// import { AuthenticationService } from "../../jwt/_services";
import { Route, Redirect, NavLink } from "react-router-dom";
import { AuthenticationService } from "@/services/api_function";
import img1 from "@/assets/images/users/1.jpg";
// const ViewProfileModel = lazy(() =>
//   import("../views/AdminView/ViewProfile/ViewProfileModel")
// );

import { ThemeRoutes } from "@/routes/Router";
import CustomNav from "./CustomNav";

export default (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  // const settings = useSelector((state) => state.settings);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const activeRoute = (routeName) => {
    return props.locatsion
      ? props.location.pathname.indexOf(routeName) > -1
        ? "selected"
        : ""
      : "";
  };
  const [state, setState] = useState({
    authentication: activeRoute("/authentication") !== "" ? true : false,
    uicomponents: activeRoute("/ui-components") !== "" ? true : false,
    samplepages: activeRoute("/sample-pages") !== "" ? true : false,
    dashboardpages: activeRoute("/dashboards") !== "" ? true : false,
    iconsPages: activeRoute("/icons") !== "" ? true : false,
    formlayoutPages: activeRoute("/form-layouts") !== "" ? true : false,
    formpickerPages: activeRoute("/form-pickers") !== "" ? true : false,
  });
  const [cstate, csetState] = useState({
    extrapages: activeRoute("/sample-pages/extra-pages") !== "" ? true : false,
  });
  const settings = useSelector((state) => state.settings);

  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);
  const myRef = useRef(null);
  const executeScroll = () => scrollToRef(myRef);
  /*--------------------------------------------------------------------------------*/
  /*To Expand SITE_LOGO With Sidebar-Menu on Hover                                  */
  /*--------------------------------------------------------------------------------*/
  const expandLogo = () => {
    document.getElementById("logobg").classList.toggle("expand-logo");
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showMobilemenu = () => {
    if (window.innerWidth < 800) {
      document.getElementById("main-wrapper").classList.toggle("show-sidebar");
    }
  };
  // constructor(props){
  //   super(props)
  //   this.navRef = React.createRef();
  // }
  const sidebarHandler = () => {
    let element = document.getElementById("main-wrapper");
    switch (settings.activeSidebarType) {
      case "full":
      case "iconbar":
        element.classList.toggle("mini-sidebar");
        if (element.classList.contains("mini-sidebar")) {
          element.setAttribute("data-sidebartype", "mini-sidebar");
        } else {
          element.setAttribute("data-sidebartype", settings.activeSidebarType);
        }
        break;

      case "overlay":
      case "mini-sidebar":
        element.classList.toggle("full");
        if (element.classList.contains("full")) {
          element.setAttribute("data-sidebartype", "full");
        } else {
          element.setAttribute("data-sidebartype", settings.activeSidebarType);
        }
        break;
      default:
    }
  };
  const redirect = () => {
    if (isRedirect == true) {
      return (
        <Redirect
          to={{
            pathname: "/authentication/login",
            // state: { from: props.location },
          }}
        />
      );
    } else {
      return "";
    }
  };

  return (
    <header className="topbar navbarbg" data-navbarbg={settings.activeNavbarBg}>
      <Navbar
        className={
          "top-navbar top-navbar1 " +
          (settings.activeNavbarBg === "skin6" ? "navbar-light" : "navbar-dark")
        }
        expand="md"
      >
        <div
          className="navbar-header mynavigation"
          id="logobg"
          data-logobg={settings.activeLogoBg}
        >
          {redirect()}
          {/*--------------------------------------------------------------------------------*/}
          {/* Mobile View Toggler  [visible only after 768px screen]                         */}
          {/*--------------------------------------------------------------------------------*/}
          <span
            className="nav-toggler d-block d-md-none"
            onClick={showMobilemenu.bind(null)}
          >
            <i className="ti-menu ti-close" />
          </span>
          {/*--------------------------------------------------------------------------------*/}
          {/* Logos Or Icon will be goes here for Light Layout && Dark Layout                */}
          {/*--------------------------------------------------------------------------------*/}
          {/* <NavbarBrand href="/dashboard">
            <b className="logo-icon">
              <img src={rlogo} alt="homepage" className="dark-logo" />
              <img src={rlogo} alt="homepage" className="light-logo" />
            </b>
            <span className="logo-text">
              // {/* <img src={logodarktext} alt="homepage" className="dark-logo" />
              // <img src={logolighttext} className="light-logo" alt="homepage" />
              // <strong>Renuka Engg</strong> 
            </span>
          </NavbarBrand> */}
          {/*--------------------------------------------------------------------------------*/}
          {/* Mobile View Toggler  [visible only after 768px screen]                         */}
          {/*--------------------------------------------------------------------------------*/}
          <span
            className="topbartoggler d-block d-md-none"
            onClick={toggle.bind(null)}
          >
            <i className="ti-more" />
          </span>
        </div>
        {/* 
        <aside
          className="left-sidebar "
          id="sidebarbg"
          data-sidebarbg={settings.activeSidebarBg}
          onMouseEnter={expandLogo.bind(null)}
          onMouseLeave={expandLogo.bind(null)}
        > */}
        {/* <PerfectScrollbar className=""> */}
        <div className="sidebar-nav newsidebar">
          {/*--------------------------------------------------------------------------------*/}
          {/* Sidebar Menus will go here                                                */}
          {/*--------------------------------------------------------------------------------*/}
          {/* <Nav
            id="sidebarnav"
            className="mynavbar horizontal-scroll-wrapper squares"
          >
            {props.routes.map((prop, key) => {
              if (prop.parentPermission != undefined) {
                if (prop.parentPermission == false) {
                  return null;
                }
              }
              if (prop.redirect) {
                return null;
              } else if (prop.navlabel) {
                return (
                  <li className="nav-small-cap" key={key}>
                    <i className={prop.icon}></i>
                    <span className="hide-menu">{prop.name}</span>
                  </li>
                );
                
              } else if (prop.collapse) {
                let firstdd = {};
                firstdd[prop.state] = !state[prop.state];

                return (
                  <li
                    className={activeRoute(prop.path) + " sidebar-item"}
                    key={key}
                  >
                    <span
                      className="sidebar-link p-1"
                      onClick={() => setState(firstdd)}
                    >
                      <i className={prop.icon} />
                      <span className="hide-menu">{prop.name}</span>
                      <i className="mdi mdi-chevron-right rightarrow"></i>
                    </span>
                    <Collapse isOpen={state[prop.state]}>
                      <ul className="first-level">
                        {prop.child.map((prop, key) => {
                          if (prop.permission != undefined) {
                            if (prop.permission == "none") {
                              return null;
                            }
                          }
                          if (prop.redirect) return null;
                          if (prop.collapse) {
                            let seconddd = {};
                            seconddd[prop["cstate"]] = !cstate[prop.cstate];

                            return (
                              <li
                                className={
                                  activeRoute(prop.path) + " sidebar-item"
                                }
                                key={key}
                              >
                                <span
                                  data-toggle="collapse"
                                  className="sidebar-link p-1 has-arrow"
                                  aria-expanded={cstate[prop.cstate]}
                                  onClick={() => csetState(seconddd)}
                                >
                                  <i className={prop.icon} />
                                  <span className="hide-menu">{prop.name}</span>
                                </span>
                                <Collapse isOpen={cstate[prop.cstate]}>
                                  <ul className="second-level">
                                    {prop.subchild.map((prop, key) => {
                                      if (prop.redirect) return null;
                                      return (
                                        <li
                                          className={
                                            activeRoute(prop.path) +
                                            " sidebar-item"
                                          }
                                          key={key}
                                        >
                                          <NavLink
                                            to={prop.path}
                                            activeClassName="active"
                                            className="sidebar-link"
                                          >
                                            <i className={prop.icon} />
                                            <span className="hide-menu">
                                              {" "}
                                              {prop.name}
                                            </span>
                                          </NavLink>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </Collapse>
                              </li>
                            );
                          } else {
                            // User Access Code
                            if (prop.permission && prop.permission == true) {
                              return (
                                <li
                                  onClick={scrollTop}
                                  className={
                                    activeRoute(prop.path) +
                                    (prop.pro ? " active active-pro" : "") +
                                    " sidebar-item"
                                  }
                                  key={key}
                                >
                                  <NavLink
                                    to={prop.path}
                                    className="sidebar-link p-1"
                                    activeClassName="active"
                                    onClick={showMobilemenu}
                                  >
                                    <i className={prop.icon} />
                                    <span className="hide-menu">
                                      {prop.name}
                                    </span>
                                  </NavLink>
                                </li>
                              );
                            }
                          }
                        })}
                      </ul>
                     
                    </Collapse>
                  </li>
                );
              } else {
                return (
                  
                  <li
                    onClick={scrollTop}
                    className={
                      activeRoute(prop.path) +
                      (prop.pro ? " active active-pro" : "") +
                      " sidebar-item"
                    }
                    key={key}
                  >
                    <NavLink
                      to={prop.path}
                      onClick={showMobilemenu}
                      className="sidebar-link p-1"
                      activeClassName="active"
                    >
                      <i className={prop.icon} />
                      <span className="hide-menu">{prop.name}</span>
                    </NavLink>
                  </li>
                );
              }
            })}
          </Nav> */}

          <CustomNav />
        </div>
        {/* </PerfectScrollbar> */}
        {/* </aside> */}
        <Collapse
          className="navbarbg"
          isOpen={isOpen}
          navbar
          data-navbarbg={settings.activeNavbarBg}
        >
          <Nav className="float-left" navbar>
            {/* <NavItem>
              <NavLink
                href="#"
                className="d-none d-md-block pl-4"
                onClick={sidebarHandler.bind(null)}
              >
                <i className="mdi mdi-menu" />
              </NavLink>
            </NavItem> */}
            {/*--------------------------------------------------------------------------------*/}
            {/* Start Mega Menu Dropdown                                                       */}
            {/*--------------------------------------------------------------------------------*/}
            <UncontrolledDropdown nav inNavbar className="mega-dropdown">
              {/* <DropdownToggle nav>
                <span>
                  <i className="mdi mdi-view-grid"></i>
                </span>
              </DropdownToggle> */}
              <DropdownMenu>
                <Row>
                  {/*--------------------------------------------------------------------------------*/}
                  {/* Carousel [Item-1]                                                              */}
                  {/*--------------------------------------------------------------------------------*/}
                  <Col xs="12" sm="12" md="12" lg="3">
                    <h5 className="mb-3 text-uppercase">Carousel</h5>
                    <UncontrolledCarousel items={data.items} />
                  </Col>
                  {/*--------------------------------------------------------------------------------*/}
                  {/* Progress [Item-2]                                                              */}
                  {/*--------------------------------------------------------------------------------*/}
                  <Col xs="12" sm="12" md="12" lg="3">
                    <h5 className="mb-3 text-uppercase">Progress</h5>
                    <div className="d-flex no-block align-items-center mb-2">
                      <span>Sales</span>
                      <div className="ml-auto">
                        <span className="text-primary">
                          <i className="mdi mdi-chart-areaspline" />
                        </span>
                      </div>
                    </div>
                    <Progress className="mb-3" animated value={2 * 5} />
                    <div className="d-flex no-block align-items-center mb-2">
                      <span>Marketing</span>
                      <div className="ml-auto">
                        <span className="text-success">
                          <i className="mdi mdi-chart-line" />
                        </span>
                      </div>
                    </div>
                    <Progress
                      className="mb-3"
                      animated
                      color="success"
                      value="25"
                    />
                    <div className="d-flex no-block align-items-center mb-2">
                      <span>Accouting</span>
                      <div className="ml-auto">
                        <span className="text-danger">
                          <i className="mdi mdi-chart-arc" />
                        </span>
                      </div>
                    </div>
                    <Progress
                      className="mb-3"
                      animated
                      color="danger"
                      value={50}
                    />
                    <div className="d-flex no-block align-items-center mb-2">
                      <span>Sales Ratio</span>
                      <div className="ml-auto">
                        <span className="text-warning">
                          <i className="mdi mdi-chart-pie" />
                        </span>
                      </div>
                    </div>
                    <Progress
                      className="mb-3"
                      animated
                      color="warning"
                      value={70}
                    />
                  </Col>
                  {/*--------------------------------------------------------------------------------*/}
                  {/* Contact Us [Item-3]                                                            */}
                  {/*--------------------------------------------------------------------------------*/}
                  <Col xs="12" sm="12" md="12" lg="3">
                    <h5 className="mb-3 text-uppercase">Contact Us</h5>
                    <Form>
                      <FormGroup>
                        <Input
                          type="text"
                          name="name"
                          id="textname"
                          placeholder="Enter Name Here"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Input
                          type="email"
                          name="email"
                          id="exampleEmail"
                          placeholder="Enter Email Here"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Input
                          type="textarea"
                          name="text"
                          id="exampleText"
                          placeholder="Message"
                        />
                      </FormGroup>
                      <Button color="primary">Submit</Button>
                    </Form>
                  </Col>
                  {/*--------------------------------------------------------------------------------*/}
                  {/* List Style [Item-4]                                                            */}
                  {/*--------------------------------------------------------------------------------*/}
                  <Col xs="12" sm="12" md="12" lg="3">
                    <h5 className="mb-3 text-uppercase">List Style</h5>
                    <ListGroup flush>
                      <ListGroupItem
                        tag="a"
                        href=""
                        className="border-0 pl-0 text-dark pt-0"
                      >
                        <i className="fa fa-check text-success mr-2" />
                        Cras justo odio
                      </ListGroupItem>
                      <ListGroupItem
                        tag="a"
                        href=""
                        className="border-0 pl-0 text-dark pt-0"
                      >
                        <i className="fa fa-check text-success mr-2" />
                        Dapibus ac facilisis in
                      </ListGroupItem>
                      <ListGroupItem
                        tag="a"
                        href=""
                        className="border-0 pl-0 text-dark pt-0"
                      >
                        <i className="fa fa-check text-success mr-2" />
                        Morbi leo risus
                      </ListGroupItem>
                      <ListGroupItem
                        tag="a"
                        href=""
                        className="border-0 pl-0 text-dark pt-0"
                      >
                        <i className="fa fa-check text-success mr-2" />
                        Porta ac consectetur ac
                      </ListGroupItem>
                      <ListGroupItem
                        tag="a"
                        href=""
                        className="border-0 pl-0 text-dark pt-0"
                      >
                        <i className="fa fa-check text-success mr-2" />
                        Vestibulum at eros
                      </ListGroupItem>
                    </ListGroup>
                  </Col>
                </Row>
              </DropdownMenu>
            </UncontrolledDropdown>
            {/*--------------------------------------------------------------------------------*/}
            {/* End Mega Menu Dropdown                                                         */}
            {/*--------------------------------------------------------------------------------*/}
            {/*--------------------------------------------------------------------------------*/}
            {/* Start Create New Dropdown                                                      */}
            {/*--------------------------------------------------------------------------------*/}

            {/*--------------------------------------------------------------------------------*/}
            {/* End Create New Dropdown                                                        */}
            {/*--------------------------------------------------------------------------------*/}
          </Nav>
          <Nav className="ml-auto float-right" navbar>
            {/*--------------------------------------------------------------------------------*/}
            {/* Start Notifications Dropdown                                                   */}
            {/*--------------------------------------------------------------------------------*/}

            {/*--------------------------------------------------------------------------------*/}
            {/* End Notifications Dropdown                                                     */}
            {/*--------------------------------------------------------------------------------*/}
            {/*--------------------------------------------------------------------------------*/}
            {/* Start Messages Dropdown                                                        */}
            {/*--------------------------------------------------------------------------------*/}

            {/*--------------------------------------------------------------------------------*/}
            {/* End Messages Dropdown                                                          */}
            {/*--------------------------------------------------------------------------------*/}
            {/*--------------------------------------------------------------------------------*/}
            {/* Start Profile Dropdown                                                         */}
            {/*--------------------------------------------------------------------------------*/}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret className="pro-pic">
                {AuthenticationService.currentUserValue && (
                  <img
                    // src={
                    //   "https://stonearts.s3.ap-south-1.amazonaws.com/TEAMID/06022021/1_UPLOADFILE-1612604383.886114.png"
                    // }
                    src={img1}
                    // src={AuthenticationService.currentUserValue.imagePath}
                    alt="user"
                    className="rounded-circle"
                    width="30"
                  />
                )}
              </DropdownToggle>
              <DropdownMenu right className="user-dd user-dd-logout">
                <span className="with-arrow">
                  <span className="bg-primary" />
                </span>
                <div className="d-flex no-block align-items-center p-1 bg-primary text-white mb-2">
                  <div className="">
                    {AuthenticationService.currentUserValue && (
                      <img
                        src={img1}
                        // src={AuthenticationService.currentUserValue.imagePath}
                        alt="user"
                        className="rounded-circle"
                        width="25"
                      />
                    )}
                  </div>
                  <div className="ml-2">
                    <h6 className="mb-0 text-white">
                      {AuthenticationService.currentUserValue
                        ? AuthenticationService.currentUserValue.username
                        : ""}
                    </h6>
                    <p className=" mb-0">
                      {AuthenticationService.currentUserValue
                        ? AuthenticationService.currentUserValue.roleName
                        : ""}
                    </p>
                  </div>
                </div>
                <DropdownItem
                  className="loginrow p-1"
                  onClick={() => {
                    props.history.push(`/master/viewProfile`);
                  }}
                >
                  <i className="ti-user mr-1 ml-1" />
                  Change Password
                </DropdownItem>
                <DropdownItem
                  className="loginrow p-1"
                  onClick={() => {
                    AuthenticationService.logout();
                    setIsRedirect(true);
                  }}
                >
                  <i className="mdi mdi-logout mr-1 ml-1" />
                  Logout
                </DropdownItem>
                {/* <DropdownItem divider />
                <Button
                  color="success"
                  className="mainbtn btn-rounded ml-3 mb-2 mt-2"
                  onClick={() => {
                    AuthenticationService.logout();
                    setIsRedirect(true);
                  }}
                >
                  Logout
                </Button> */}
              </DropdownMenu>
            </UncontrolledDropdown>
            {/*--------------------------------------------------------------------------------*/}
            {/* End Profile Dropdown                                                           */}
            {/*--------------------------------------------------------------------------------*/}
          </Nav>
        </Collapse>
      </Navbar>
    </header>
  );
};
