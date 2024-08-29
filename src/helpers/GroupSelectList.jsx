import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { IconButton } from "@material-ui/core";
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
import Select from "react-select";
import {
  SUPPORTED_FORMATS_IMG,
  isWriteAuthorized,
  isReadAuthorized,
} from "@/helpers";
import { groupCreate, groupList } from "@/services/api_function";

export default function group(props) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const [refresh, setRefresh] = useState(true);
  const [addModalShow, setAddModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const onAddModalShow = (status) => {
    setAddModalShow(status);
  };

  const handleChange = (newValue, actionMeta) => {
    props.setFieldValue("groupId", newValue);
  };

  useEffect(() => {
    getGroupList();
  }, []);

  const getGroupList = () => {
    groupList()
      .then((response) => {
        console.log({ response });
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.responseObject;
          let options = result.map(function (data) {
            return {
              value: data.id,
              label: data.groupName,
            };
          });
          setOptions(options);
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  return (
    <div>
      <Label htmlFor="groupId" style={{ marginBottom: "0px" }}>
        Group <span className="text-danger">*</span>
        <Button
          className="groupbtn"
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
          Create Group
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
          Create Group
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            groupName: "",
            groupImage: "",
          }}
          validationSchema={Yup.object().shape({
            groupName: Yup.string().trim().required("Group name is required"),
            groupImage: Yup.lazy((v) => {
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
            requestData.append("groupName", values.groupName);
            requestData.append("groupImage", values.groupImage);

            groupCreate(requestData)
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
                  setIsLoading(false);
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
                      <Label>Group Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter Group name"
                        name="groupName"
                        onChange={handleChange}
                        value={values.groupName}
                        invalid={errors.groupName ? true : false}
                      />
                      <FormFeedback>{errors.groupName}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <InputGroup className="mt-4 pt-1">
                        <div className="custom-file">
                          <Input
                            type="file"
                            name="groupImage"
                            className="custom-file-input"
                            onChange={(e) => {
                              setFieldValue("groupImage", e.target.files[0]);
                            }}
                          />
                          <label
                            className="custom-file-label custombrowseclass"
                            htmlFor="groupImage"
                          >
                            {values.groupImage != ""
                              ? values.groupImage.name
                              : "select group image"}
                          </label>
                        </div>
                      </InputGroup>
                      <span className="text-danger">
                        {errors.groupImage && errors.groupImage}
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
      </Modal>
    </div>
  );
}
