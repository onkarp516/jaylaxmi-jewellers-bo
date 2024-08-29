import React from "react";
import { Link } from "react-router-dom";
export default (props) => {
  const bodyRef = React.createRef();
  const createPdf = () => props.createPdf(bodyRef.current, props.filename);

  return (
    <section className="pdf-container salaryContainer">
      <section className="pdf-toolbar">
        {/* <button onClick={createPdf}>Download</button> */}
        <div style={{ textAlign: "left" }}>
          <Link onClick={createPdf}>
            <i className="fa fa-download mr-2" aria-hidden="true"></i> Download
          </Link>
        </div>
      </section>
      <section className="pdf-body" ref={bodyRef}>
        {props.children}
      </section>
    </section>
  );
};
