import React, { useEffect, useState } from "react";
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
import { getHeader, getSelectValue } from "@/helpers";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { listOfShifts, createShift } from "@/services/api_function";

export default function ShiftSelectList(props) {
  const [isLoading, setisLoading] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const [options, setoptions] = useState([]);
  const [initVal, setinitVal] = useState({
    shiftName: "",
    fromTime: "",
    toTime: "",
    lunchTime: "",
    isNightShift: false,
    workingHours: "",
  });

  const getShiftOptions = (setVal = null) => {
    listOfShifts()
      .then((response) => {
        if (response.data.responseStatus == 200) {
          let res = response.data.response;
          let opts = res.map(function (data) {
            return {
              value: data.id,
              label: data.name,
            };
          });
          setoptions(opts);
          if (setVal != null && opts.length > 0) {
            let shift_d = getSelectValue(opts, setVal);
            props.setFieldValue("shiftId", shift_d);
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
        shiftName: inputVal,
        shiftName: "",
        fromTime: "",
        toTime: "",
        lunchTime: "",
        isNightShift: false,
        workingHours: "",
      };
      setinitVal(initVal);
    }
    setAddModalShow(status);
  };

  const handleChange = (newValue, actionMeta) => {
    props.setFieldValue("shiftId", newValue);
  };

  const handleCreate = (inputValue) => {
    setisLoading(true);
    onAddModalShow(true, inputValue);
  };
  useEffect(() => {
    getShiftOptions();
  }, []);

  const calculateTime = (values, setFieldValue) => {
    let { isNightShift, shiftFrom, shiftTo } = values;
    if (values.shiftFrom != "" && values.shiftTo != "") {
      if (values.isNightShift) {
        var dt1 = new Date("2019-1-8 " + shiftFrom);
        var dt2 = new Date("2019-1-9 " + shiftTo);
      } else {
        var dt1 = new Date("2019-1-8 " + shiftFrom);
        var dt2 = new Date("2019-1-8 " + shiftTo);
      }

      var diff = dt2.getTime() - dt1.getTime();
      var hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);
      var mins = Math.floor(diff / (1000 * 60));
      diff -= mins * (1000 * 60);

      hours = String(hours).padStart(2, "0");
      mins = String(mins).padStart(2, "0");
      var result = hours + ":" + mins;
      setFieldValue("isNightShift", isNightShift);
      setFieldValue("fromTime", shiftFrom);
      setFieldValue("toTime", shiftTo);
      setFieldValue("workingHours", result);
    }
  };
  // console.log("props==>", props);
  return (
    <div>
      <Label htmlFor="shiftId" style={{ marginBottom: "0px" }}>
        Shift
        <Button
          className="designationbtn mainbtnminus"
          title="Create Shift"
          id="createShift"
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
          target="createShift"
          toggle={toggle}
        >
          Create Shift
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
        style={{ width: "67%" }}
        className="modal-xl p-2"
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
          Create Shift
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize={true}
          initialValues={initVal}
          validationSchema={Yup.object().shape({
            shiftName: Yup.string()
              .trim()
              .nullable()
              .required("Shift name is required"),
            fromTime: Yup.string()
              .trim()
              .nullable()
              .required("From time is required"),
            toTime: Yup.string()
              .trim()
              .nullable()
              .required("To time is required"),
            lunchTime: Yup.string()
              .trim()
              .nullable()
              .required("Lunch time is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            let requestData = {
              shiftName: values.shiftName,
              fromTime: values.fromTime,
              toTime: values.toTime,
              lunchTime: values.lunchTime,
              isNightShift: values.isNightShift,
              workingHours: values.workingHours,
            };

            createShift(requestData)
              .then((response) => {
                if (response.data.responseStatus === 200) {
                  console.log(
                    "response.data.response.id ",
                    response.data.response.id
                  );
                  setSubmitting(false);
                  resetForm();
                  onAddModalShow(false);
                  setisLoading(false);
                  getShiftOptions(response.data.response.id);
                } else {
                  setSubmitting(false);
                }
              })
              .catch((error) => {
                console.log("error", error);
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
                      <Label>Shift Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter shift name"
                        name="shiftName"
                        onChange={handleChange}
                        value={values.shiftName}
                        invalid={errors.shiftName ? true : false}
                      />
                      <FormFeedback>{errors.shiftName}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <Label for="checkbox2">Is Night Shift?</Label>
                      <FormGroup check className="nightshiftlabel">
                        <Label check>
                          <Input
                            type="checkbox"
                            name="isNightShift"
                            defaultChecked={false}
                            onChange={() => {
                              setFieldValue(
                                "isNightShift",
                                !values.isNightShift
                              );
                            }}
                            value={values.isNightShift}
                          />{" "}
                          Yes
                        </Label>
                      </FormGroup>
                      {/* </Col> */}
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>From Time</Label>
                      <Input
                        type="time"
                        placeholder="Enter from time"
                        name="fromTime"
                        onChange={handleChange}
                        value={values.fromTime}
                        invalid={errors.fromTime ? true : false}
                      />
                      <FormFeedback>{errors.fromTime}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>To Time</Label>
                      <Input
                        type="time"
                        placeholder="Enter to time"
                        name="toTime"
                        onChange={handleChange}
                        onBlur={(e) => {
                          calculateTime(
                            {
                              isNightShift: values.isNightShift,
                              shiftFrom: values.fromTime,
                              shiftTo: values.toTime,
                            },
                            setFieldValue
                          );
                        }}
                        value={values.toTime}
                        invalid={errors.toTime ? true : false}
                      />
                      <FormFeedback>{errors.toTime}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Lunch Time</Label>
                      <Input
                        type="text"
                        placeholder="Enter lunch time in minutes"
                        name="lunchTime"
                        onChange={handleChange}
                        value={values.lunchTime}
                        invalid={errors.lunchTime ? true : false}
                      />
                      <FormFeedback>{errors.lunchTime}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Working Hours</Label>
                      <Input
                        type="time"
                        readOnly={true}
                        placeholder="Enter working Hours"
                        name="workingHours"
                        onChange={handleChange}
                        value={values.workingHours}
                        invalid={errors.workingHours ? true : false}
                      />
                      <FormFeedback>{errors.workingHours}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter className="p-2">
                <Button
                  type="submit"
                  className="mainbtn1 mainhoverbtn text-white"
                  disabled={isSubmitting}
                  color="primary"
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
