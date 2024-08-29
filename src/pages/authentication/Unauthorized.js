import React from "react";
import { Button } from "reactstrap";

import img1 from "../../assets/images/logo-icon.png";

const Maintanance = (props) => {
  return (
    <div>
      <div className="">
        <div className="error-body text-center">
          <img src={img1} alt="" />
          <h4 className="text-dark font-24">BTOC</h4>
          <div className="mt-4">
            <h3>Your not authorized user to access this page...</h3>
            {/* <h5 className="mb-0 text-muted font-medium">
              Something wrong going on this page.
            </h5>
            <h5 className="text-muted font-medium">Please Check back again.</h5> */}
          </div>
          <div className="mt-4 mb-4">
            <Button
              onClick={() => {
                window.location.href = "/dashboard/dashboard";
              }}
            >
              Back to home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintanance;
