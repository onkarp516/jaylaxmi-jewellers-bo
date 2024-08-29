import React, { useState, useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import Header from "./layout-components/header/Header";
import Sidebar from "./layout-components/sidebar/Sidebar";
import Footer from "./layout-components/footer/Footer";
// import Customizer from "./layout-components/customizer/Customizer";
import { ThemeRoutes } from "@/routes/Router";
import Spinner from "@/components/spinner/Spinner";
import { AuthenticationService } from "@/services/api_function";
import { Flip, ToastContainer } from "react-toastify";

export default (props) => {
  const [width, setWidth] = useState(window.innerWidth);

  const settings = useSelector((state) => state.settings);

  useEffect(() => {
    const updateDimensions = () => {
      let element = document.getElementById("main-wrapper");
      setWidth(window.innerWidth);
      switch (settings.activeSidebarType) {
        case "full":
          break;
        case "iconbar":
          if (width < 1170) {
            element.setAttribute("data-sidebartype", "mini-sidebar");
            element.classList.add("mini-sidebar");
          } else {
            element.setAttribute(
              "data-sidebartype",
              settings.activeSidebarType
            );
            element.classList.remove("mini-sidebar");
          }
          break;

        case "overlay":
          if (width < 767) {
            element.setAttribute("data-sidebartype", "mini-sidebar");
          } else {
            element.setAttribute(
              "data-sidebartype",
              settings.activeSidebarType
            );
          }
          break;

        default:
          break;
      }
    };
    if (document.readyState === "complete") {
      updateDimensions();
    }
    window.addEventListener("load", updateDimensions.bind(null));
    window.addEventListener("resize", updateDimensions.bind(null));
    return () => {
      window.removeEventListener("load", updateDimensions.bind(null));
      window.removeEventListener("resize", updateDimensions.bind(null));
    };
  }, [settings.activeSidebarType, width]);

  // console.log("props ==> full layout==>", props);
  return (
    <div
      id="main-wrapper"
      dir={settings.activeDir}
      data-theme={settings.activeTheme}
      // data-layout={settings.activeThemeLayout}
      data-layout={"horizontal"}
      data-sidebartype={settings.activeSidebarType}
      data-sidebar-position={settings.activeSidebarPos}
      data-header-position={settings.activeHeaderPos}
      data-boxed-layout={settings.activeLayout}
    >
      {/*--------------------------------------------------------------------------------*/}
      {/* Header                                                                         */}
      {/*--------------------------------------------------------------------------------*/}
      <Header {...props} routes={ThemeRoutes} />
      {/*--------------------------------------------------------------------------------*/}
      {/* Sidebar                                                                        */}
      {/*--------------------------------------------------------------------------------*/}
      {/* <Sidebar {...props} routes={ThemeRoutes} /> */}
      {/*--------------------------------------------------------------------------------*/}
      {/* Page Main-Content                                                              */}
      {/*--------------------------------------------------------------------------------*/}
      {/* <div className="page-wrapper d-block"> */}
      <div className="d-block mainpage-wrapper page-wrapper pt-0">
        <div className="pt-4">
          <Suspense fallback={<Spinner />}>
            <ToastContainer
              transition={Flip}
              position="top-center"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Switch>
              {ThemeRoutes.map((prop, key) => {
                if (prop.navlabel) {
                  return null;
                } else if (prop.collapse) {
                  return prop.child.map((prop2, key2) => {
                    if (prop2.collapse) {
                      return prop2.subchild.map((prop3, key3) => {
                        return (
                          <Route
                            path={prop3.path}
                            component={prop3.component}
                            key={key3}
                          />
                        );
                      });
                    }
                    return (
                      <Route
                        path={prop2.path}
                        component={prop2.component}
                        key={key2}
                      />
                    );
                  });
                } else if (prop.redirect) {
                  return (
                    <Redirect from={prop.path} to={prop.pathTo} key={key} />
                  );
                } else {
                  return (
                    <Route
                      path={prop.path}
                      component={prop.component}
                      key={key}
                    />
                  );
                }
              })}
            </Switch>
          </Suspense>
        </div>
        <Footer />
      </div>
      {/*--------------------------------------------------------------------------------*/}
      {/* Customizer from which you can set all the Layout Settings                      */}
      {/*--------------------------------------------------------------------------------*/}
      {/* <Customizer /> */}
    </div>
  );
};
