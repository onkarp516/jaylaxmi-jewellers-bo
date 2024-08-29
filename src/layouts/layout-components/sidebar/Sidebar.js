import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Collapse } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector } from "react-redux";

const Sidebar = (props) => {
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

  /*--------------------------------------------------------------------------------*/
  /*To Expand SITE_LOGO With Sidebar-Menu on Hover                                  */
  /*--------------------------------------------------------------------------------*/
  const expandLogo = () => {
    document.getElementById("logobg").classList.toggle("expand-logo");
  };
  /*--------------------------------------------------------------------------------*/
  /*Verifies if routeName is the one active (in browser input)                      */
  /*--------------------------------------------------------------------------------*/
  // const expandList = () => {
  //   document
  //     .getElementsByClassName("sidebar-item")
  //     .classList.toggleClass("show-list");
  // };
  /*--------------------------------------------------------------------------------*/
  /*Its for scroll to to                    */
  /*--------------------------------------------------------------------------------*/

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showMobilemenu = () => {
    if (window.innerWidth < 800) {
      document.getElementById("main-wrapper").classList.toggle("show-sidebar");
    }
  };

  return (
    <aside
      className="left-sidebar"
      id="sidebarbg"
      data-sidebarbg={settings.activeSidebarBg}
      onMouseEnter={expandLogo.bind(null)}
      onMouseLeave={expandLogo.bind(null)}
    >
      <PerfectScrollbar className="scroll-sidebar">
        <div className="sidebar-nav">
          {/*--------------------------------------------------------------------------------*/}
          {/* Sidebar Menus will go here                                                */}
          {/*--------------------------------------------------------------------------------*/}
          <Nav id="sidebarnav" className="mynavbar">
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
                /*--------------------------------------------------------------------------------*/
                /* Child Menus wiil be goes here                                                    */
                /*--------------------------------------------------------------------------------*/
              } else if (prop.collapse) {
                let firstdd = {};
                firstdd[prop.state] = !state[prop.state];

                return (
                  <li
                    className={activeRoute(prop.path) + " sidebar-item"}
                    key={key}
                  >
                    <span
                      className="sidebar-link p-1 has-arrow"
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
                      {/* </PerfectScrollbar> */}
                    </Collapse>
                  </li>
                );
              } else {
                return (
                  /*--------------------------------------------------------------------------------*/
                  /* Adding Sidebar Item                                                            */
                  /*--------------------------------------------------------------------------------*/
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
          </Nav>
        </div>
      </PerfectScrollbar>
    </aside>
  );
};

export default Sidebar;
