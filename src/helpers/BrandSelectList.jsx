import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import {
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  InputGroup,
  FormFeedback,
  Row,
  Col,
  Spinner,
  Tooltip,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SUPPORTED_FORMATS_IMG } from "@/helpers";
import { brandCreate, brandList } from "@/services/api_function";
import Select from "react-select";

export default function BrandSelectList(props) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const [addModalShow, setAddModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const onAddModalShow = (status) => {
    setAddModalShow(status);
  };
  const handleChange = (newValue, actionMeta) => {
    // console.group("Value Changed");
    // console.log(newValue);
    // console.log(`action: ${actionMeta.action}`);
    // console.groupEnd();
    // this.setState({ value: newValue });
    // setValue(newValue);
    props.setFieldValue("brandId", newValue);
  };
  const getBrandOpt = () => {
    brandList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.responseObject;
          let options = result.map(function (data) {
            return {
              value: data.id,
              label: data.brandName,
            };
          });
          setOptions(options);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  useEffect(() => {
    getBrandOpt();
  }, []);

  return (
    <div>
      <Label htmlFor="brandId" style={{ marginBottom: "0px" }}>
        Brand <span className="text-danger">*</span>
        <Button
          className="brandbtn"
          id="createdesg"
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
          target="createdesg"
          toggle={toggle}
        >
          Create Brand
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
          Create Brand
        </ModalHeader>
        <ModalBody>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
              brandName: "",
              brandImage: "",
            }}
            validationSchema={Yup.object().shape({
              brandName: Yup.string().trim().required("Brand name is required"),
              brandImage: Yup.lazy((v) => {
                if (v != undefined) {
                  return Yup.mixed()
                    .test(
                      "fileType",
                      "Upload JPG,JPEG,PNG with MAX. 5MB sizes",
                      (value) => SUPPORTED_FORMATS_IMG.includes(value.type)
                    )
                    .test(
                      "fileSize",
                      "File size should be less than 5MB",
                      (v) => {
                        const size = 1024 * 1024 * 5;
                        return v && v.size <= size;
                      }
                    );
                }
                return Yup.mixed().required("Upload image");
              }),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              setIsLoading(true);
              let requestData = new FormData();
              requestData.append("brandName", values.brandName);
              requestData.append("image", values.brandImage);

              brandCreate(requestData)
                .then((response) => {
                  setIsLoading(false);
                  if (response.data.responseStatus === 200) {
                    setSubmitting(false);
                    toast.success("✔ " + response.data.message);
                    resetForm();
                    onAddModalShow(false);
                    setRefresh(true);
                  } else {
                    setSubmitting(false);
                    toast.error("✘ " + response.data.message);
                  }
                })
                .catch((error) => {
                  setIsLoading(false);
                  setSubmitting(false);
                  toast.error("✘ " + error);
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
                        <Label>Brand Name</Label>
                        <Input
                          type="text"
                          placeholder="Enter brand name"
                          name="brandName"
                          onChange={handleChange}
                          value={values.brandName}
                          invalid={errors.brandName ? true : false}
                        />
                        <FormFeedback>{errors.brandName}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <InputGroup className="mt-4 pt-1">
                          <div className="custom-file">
                            <Input
                              type="file"
                              name="brandImage"
                              className="custom-file-input"
                              onChange={(e) => {
                                setFieldValue("brandImage", e.target.files[0]);
                              }}
                            />
                            <label
                              className="custom-file-label custombrowseclass"
                              htmlFor="brandImage"
                            >
                              {values.brandImage != ""
                                ? values.brandImage.name
                                : "select brand image"}
                            </label>
                          </div>
                        </InputGroup>
                        <span className="text-danger">
                          {errors.brandImage && errors.brandImage}
                        </span>
                      </FormGroup>
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter className="p-2">
                  {isLoading ? (
                    <Button
                      className="mainbtn1 text-white"
                      type="button"
                      disabled={isSubmitting}
                    >
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      Creating...
                    </Button>
                  ) : (
                    <Button type="submit" className="mainbtn1 text-white">
                      Create
                    </Button>
                  )}

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
        </ModalBody>
      </Modal>
    </div>
  );
}
