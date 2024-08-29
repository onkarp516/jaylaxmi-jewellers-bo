import React, { useEffect, useState } from "react";
import Select from "react-select";
import { listOfDesignation, createDesignation } from "@/services/api_function";
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
  Button,
  Col,
} from "reactstrap";
import { getHeader, getSelectValue } from "@/helpers";
import { Formik, Form } from "formik";
import * as Yup from "yup";

export default function DesignationSelectList(props) {
  const [isLoading, setisLoading] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const [options, setoptions] = useState([]);
  const [initVal, setinitVal] = useState({
    designationName: "",
    designationCode: "",
  });

  const getDesignationOptions = (setVal = null) => {
    listOfDesignation()
      .then((response) => {
        if (response.status == 200) {
          let res = response.data.response;
          let options = res.map(function (data) {
            return {
              value: data.id,
              label: data.name + " (" + data.code + ")",
            };
          });
          setoptions(options);
          if (setVal != null && options.length > 0) {
            let desg = getSelectValue(options, setVal);
            props.setFieldValue("designationId", desg);
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
        designationName: inputVal,
        designationLevel: "",
      };
      setinitVal(initVal);
    }
    setAddModalShow(status);
  };
  const handleChange = (newValue, actionMeta) => {
    props.setFieldValue("designationId", newValue);
  };
  const handleCreate = (inputValue) => {
    setisLoading(true);
    onAddModalShow(true, inputValue);
  };
  useEffect(() => {
    getDesignationOptions();
  }, []);

  // console.log("props==>", props);
  return (
    <div>
      <Label htmlFor="designationId" style={{ marginBottom: "0px" }}>
        Designation <span className="text-danger">*</span>
        <Button
          className="designationbtn mainbtnminus"
          id="createdesg"
          onClick={(e) => {
            e.preventDefault();
            onAddModalShow(true);
          }}
        >
          <i className="mdi mdi-plus"></i>
        </Button>
        <Tooltip
          placement="right"
          isOpen={tooltipOpen}
          target="createdesg"
          toggle={toggle}
        >
          Create Designation
        </Tooltip>
      </Label>
      <Select
        //isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={handleChange}
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
          Create Designation
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={initVal}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            designationName: Yup.string()
              .trim()
              .nullable()
              .required("Designation name is required"),
            designationCode: Yup.string()
              .trim()
              .nullable()
              .required("Designation code is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();

            let requestData = new FormData();
            requestData.append("name", values.designationName);
            requestData.append("code", values.designationCode);

            createDesignation(requestData)
              .then((response) => {
                if (response.data.responseStatus === 200) {
                  setSubmitting(false);
                  resetForm();
                  onAddModalShow(false);
                  setisLoading(false);
                  getDesignationOptions(response.data.response.id);
                  setFieldValue();
                } else {
                  setSubmitting(false);
                }
              })
              .catch((error) => {
                setSubmitting(false);
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
                      <Label>Designation Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter designation name"
                        name="designationName"
                        onChange={handleChange}
                        value={values.designationName}
                        invalid={errors.designationName ? true : false}
                      />
                      <FormFeedback>{errors.designationName}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Designation Code</Label>
                      <Input
                        type="text"
                        placeholder="Enter designation code"
                        name="designationCode"
                        onChange={handleChange}
                        value={values.designationCode}
                        invalid={errors.designationCode ? true : false}
                      />
                      <FormFeedback>{errors.designationCode}</FormFeedback>
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
