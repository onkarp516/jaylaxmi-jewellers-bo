import React from "react";
import { useSelector } from "react-redux";

const WithUserPermission = (WrappedComp) => (props) => {
  // console.log("in user Permission : ", props);
  const userPermissions = useSelector((state) => state.userPermissions);
  // console.log("userPermissions", userPermissions);
  return <WrappedComp {...props} userPermissions={userPermissions} />;
};

export { WithUserPermission };
