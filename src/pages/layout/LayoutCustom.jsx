import React, { useState, useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import Header from "@/layouts/layout-components/header/Header";
import Sidebar from "@/layouts/layout-components/sidebar/Sidebar";
import Footer from "@/layouts/layout-components/footer/Footer";
// import Customizer from "./layout-components/customizer/Customizer";
import { ThemeRoutes } from "@/routes/Router";
import Spinner from "@/components/spinner/Spinner";
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

  return (
    <div
      id="main-wrapper"
      dir={settings.activeDir}
      data-theme={settings.activeTheme}
      data-layout={settings.activeThemeLayout}
      data-sidebartype={settings.activeSidebarType}
      data-sidebar-position={settings.activeSidebarPos}
      data-header-position={settings.activeHeaderPos}
      data-boxed-layout={settings.activeLayout}
    >
      {/*--------------------------------------------------------------------------------*/}
      {/* Header                                                                         */}
      {/*--------------------------------------------------------------------------------*/}
      <Header {...props} />
      {/*--------------------------------------------------------------------------------*/}
      {/* Sidebar                                                                        */}
      {/*--------------------------------------------------------------------------------*/}
      {/* <Sidebar {...props} routes={ThemeRoutes} /> */}
      {/*--------------------------------------------------------------------------------*/}
      {/* Page Main-Content                                                              */}
      {/*--------------------------------------------------------------------------------*/}
      <div className="page-wrapper mainpage-wrapper d-block">
        {/* <div className="page-content container-fluid"> */}
        <div className="pt-4 pb-5">
          <Suspense fallback={<Spinner />}>
            <ToastContainer
              transition={Flip}
              position="top-center"
              autoClose={1000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

            {props.children}
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
