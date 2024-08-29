import React from "react";
import indexRoutes from "./routes";
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "./redux/Store";
import { History } from "@/helpers";
import { PrivateRoute } from "@/routes/PrivateRoutes";
import BlankLayout from "@/layouts/BlankLayout";
import viewProfile from "./pages/masters/viewProfile";
import EmployeeCreate from "@/pages/masters/Employee/EmployeeCreate";
import EmployeeEdit from "@/pages/masters/Employee/EmployeeEdit";
import SiteCreate from "@/pages/masters/Site/SiteCreate";
import SiteEdit from "@/pages/masters/Site/SiteEdit";
import axios from "axios";
import config from "config";
import { AuthenticationService } from "@/services/api_function";
import RoleEdit from "./pages/users/RoleEdit";
import RoleCreate from "./pages/users/RoleCreate";
import UserCreate from "./pages/users/UserCreate";
import UserEdit from "./pages/users/UserEdit";
import ReceiptEdit from "./pages/AccountEntry/Receipt/ReceiptEdit";
import PaymentEdit from "./pages/AccountEntry/Payment/PaymentEdit";
import JournalEdit from "./pages/AccountEntry/Journal/JournalEdit";
import ContraEdit from "./pages/AccountEntry/Contra/ContraEdit";
import EmpSalaryData from "./pages/AccountEntry/Payroll/EmpSalaryData";
import AllocationsEdit from "./pages/AccountEntry/Allocations/AllocationsEdit";

axios.interceptors.response.use(
  (response) => {
    // console.log("response==>", response);
    return response;
  },
  (error) => {
    console.log("error response==---++++>", error.response);
    console.log("error req==---++++>", error.request);
    // console.log("error config==---++++>", error.config);

    return new Promise((resolve) => {
      const originalRequest = error.config;
      const refreshToken = localStorage.getItem("refreshToken");
      if (
        error.response &&
        error.response.status === 403 &&
        error.config &&
        !error.config.__isRetryRequest &&
        refreshToken
      ) {
        originalRequest._retry = true;

        const response = fetch(`${config.apiUrl}/token/refresh`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        })
          .then((res) => {
            console.log("res", res);
            return res.json();
          })
          .then((res) => {
            // console.log("res", res);
            if (res.responseStatus == 403) {
              AuthenticationService.logout();
              window.location.reload();
            } else {
              let r = AuthenticationService.setAccessRefreshToken(res);
              originalRequest.headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${r.token}`,
              };
            }

            return axios(originalRequest);
          });
        resolve(response);
      }

      return Promise.reject(error);
    });
  }
);
const App = () => {
  return (
    <Provider store={configureStore()}>
      <Router history={History}>
        <Switch>
          <Route exact path="/authentication/Login" component={BlankLayout} />
          <PrivateRoute path="/master/viewProfile" component={viewProfile} />
          <PrivateRoute
            path="/emp/emp-create"
            key={"/emp/emp-create"}
            component={EmployeeCreate}
          />
           <PrivateRoute
            path="/emp-salary-data/:id"
            key={"/emp-salary-data"}
            component={EmpSalaryData}
          />
          <PrivateRoute
            path="/emp/emp-edit/:id"
            key={"/emp/emp-edit"}
            component={EmployeeEdit}
          />
          <PrivateRoute
            path="/site/create-site"
            key={"/site/create-site"}
            component={SiteCreate}
          />
          <PrivateRoute
            path="/site/edit-site/:id"
            key={"/site/edit-site"}
            component={SiteEdit}
          />
          <PrivateRoute
            path="/master/role-create"
            key={"/master/role-create"}
            component={RoleCreate}
          />
          <PrivateRoute
            path="/master/role-edit/:id"
            key={"/master/role-edit"}
            component={RoleEdit}
          />
          <PrivateRoute
            path="/master/user-create"
            key={"/master/user-create"}
            component={UserCreate}
          />
          <PrivateRoute
            path="/master/user-edit/:id"
            key={"/master/user-edit"}
            component={UserEdit}
          />
          <PrivateRoute
            path="/master/receipt-edit/:id"
            key={"/master/receipt-edit"}
            component={ReceiptEdit}
          />
          <PrivateRoute
            path="/master/payment-edit/:id"
            key={"/master/payment-edit"}
            component={PaymentEdit}
          />
          <PrivateRoute
            path="/master/journal-edit/:id"
            key={"/master/journal-edit"}
            component={JournalEdit}
          />
          <PrivateRoute
            path="/master/contra-edit/:id"
            key={"/master/contra-edit"}
            component={ContraEdit}
          />
          <PrivateRoute
            path="/master/allocations-edit/:id"
            key={"/master/allocations-edit"}
            component={AllocationsEdit}
          />
          {indexRoutes.map((prop, key) => {
            return (
              <PrivateRoute
                path={prop.path}
                key={key}
                component={prop.component}
              />
            );
          })}
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
