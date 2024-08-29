import React from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthenticationService } from "@/services/api_function";

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const currentUser = AuthenticationService.currentUserValue;
      if (!currentUser) {
        console.log("Not logged in");
        // not logged in so redirect to login page with the return url
        return (
          <Redirect
            to={{
              pathname: "/authentication/login",
              state: { from: props.location },
            }}
          />
        );
      } else {
        return <Component {...props} />;
        // let current_role = currentUser.role;
        // if (props.role.includes(current_role)) {
        // } else {
        //   return (
        //     <Redirect
        //       to={{
        //         pathname: "/authentication/login",
        //         state: { from: props.location },
        //       }}
        //     />
        //   );
        // }
        // authorised so return component
      }
    }}
  />
);

export default PrivateRoute;
