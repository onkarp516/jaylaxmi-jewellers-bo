import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

import {
  Tooltip,
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Row,
  Col,
  Button,
} from "reactstrap";
import { listOfDocument, createDocument } from "@/services/api_function";
import { getHeader, getSelectValue } from "@/helpers";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";

const CustomClearText = () => "clear all";
const ClearIndicator = (props) => {
  const {
    children = <CustomClearText />,
    getStyles,
    innerProps: { ref, ...restInnerProps },
  } = props;
  return (
    <div
      {...restInnerProps}
      ref={ref}
      style={getStyles("clearIndicator", props)}
    >
      <div style={{ padding: "0px 5px" }}>{children}</div>
    </div>
  );
};
const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

export default function DocumentSelectList(props) {
  const [isLoading, setisLoading] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const [options, setoptions] = useState([]);
  const [initVal, setinitVal] = useState({
    documentName: "",
    isRequired: false,
  });

  const getDocumentOptions = (setVal = null) => {
    listOfDocument()
      .then((response) => {
        if (response.status == 200) {
          let res = response.data.response;

          let options = res.map(function (data) {
            return {
              value: data.id,
              label: data.documentName,
              required: data.isRequired,
            };
          });
          setoptions(options);
          if (setVal != null && options.length > 0) {
            let d_documentId = getSelectValue(options, setVal);
            console.log("d_documentId", d_documentId);
            props.setFieldValue("d_documentId", d_documentId);
            // props.getDocumentOptions();
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const onAddModalShow = (status, inputVal = null) => {
    if (status == true) {
      let initVal = {
        documentName: inputVal,
        isRequired: false,
      };
      setinitVal(initVal);
    }
    setAddModalShow(status);
  };
  const handleChange = (newValue, actionMeta) => {
    props.setFieldValue("d_documentId", newValue);
  };
  const handleCreate = (inputValue) => {
    setisLoading(true);
    onAddModalShow(true, inputValue);
  };
  useEffect(() => {
    getDocumentOptions();
  }, []);

  // console.log("options==>", options);
  return (
    <div>
      <Label htmlFor="shiftId" style={{ marginBottom: "0px" }}>
        Documents <span className="text-danger">*</span>
        <Button
          className="designationbtn mainbtnminus"
          title="Create Document"
          id="createDocument"
          onClick={(e) => {
            e.preventDefault();
            onAddModalShow(true);
          }}
        >
          +
        </Button>
        <Tooltip
          placement="right"
          isOpen={tooltipOpen}
          target="createDocument"
          toggle={toggle}
        >
          Create Document
        </Tooltip>
      </Label>
      <Select
        //isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={handleChange}
        onCreateOption={handleCreate}
        options={options}
        value={props.value}
      />
      {/* Add Modal */}
      <Modal
        className="modal-lg p-2"
        isOpen={addModalShow}
        toggle={() => {
          onAddModalShow(false);
        }}
      >
        <ModalHeader
          className="p-2 modalheadernew"
          toggle={() => {
            onAddModalShow(false);
          }}
        >
          Create Document
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={initVal}
          validationSchema={Yup.object().shape({
            // employeeType: Yup.object().required("Employee Type is required"),
            documentName: Yup.string()
              .trim()
              //   .matches(ALPHANUMSPACEREGEXP, "accept only aplhabets with space")
              .required("Document Name is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            // setStatus();
            console.log({ values });
            let requestData = {
              documentName: values.documentName,
              isRequired: values.isRequired,
            };

            createDocument(requestData)
              .then((response) => {
                let res = response.data;
                if (res.responseStatus === 200) {
                  setSubmitting(false);
                  //   toast.success("✔ " + response.data.message);
                  resetForm();
                  onAddModalShow(false);
                  setisLoading(false);
                  getDocumentOptions(res.response.id);
                  setFieldValue();
                  //   setRefresh(true);
                } else {
                  setSubmitting(false);
                  //   toast.error("✘ " + response.data.message);
                  console.log("error", error);
                }
              })
              .catch((error) => {
                setSubmitting(false);
                // toast.error("✘ " + error);
              });
          }}
          render={({
            errors,
            status,
            touched,
            isSubmitting,
            handleChange,
            handleSubmit,
            setFieldValue,
            values,
          }) => (
            <Form autoComplete="off">
              <ModalBody>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Document Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter Document Name"
                        name="documentName"
                        onChange={handleChange}
                        value={values.documentName}
                        invalid={errors.documentName ? true : false}
                      />
                      <FormFeedback>{errors.documentName}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label for="checkbox2">Mandatary</Label>
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="isRequired"
                            defaultChecked={false}
                            onChange={() => {
                              setFieldValue("isRequired", !values.isRequired);
                            }}
                            value={values.isRequired}
                          />{" "}
                          Yes
                        </Label>
                      </FormGroup>
                      {/* </Col> */}
                    </FormGroup>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter className="p-2">
                <Button
                  type="submit"
                  className="mainbtn1 mainhoverbtn text-white"
                  color="primary"
                  disabled={isSubmitting}
                >
                  Create
                </Button>

                <Button
                  className="mainbtn1 modalcancelbtn"
                  type="button"
                  onClick={() => {
                    onAddModalShow(null);
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          )}
        />
      </Modal>
    </div>
  );
}
