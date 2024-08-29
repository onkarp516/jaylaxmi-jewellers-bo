import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import "./assets/scss/style.scss";
import Spinner from "@/components/spinner/Spinner";

import "regenerator-runtime/runtime";

const App = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("./App")), 0);
    })
);

ReactDOM.render(
  <Suspense fallback={<Spinner />}>
    <App />
  </Suspense>,
  document.getElementById("root")
);
