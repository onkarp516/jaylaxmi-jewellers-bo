import React, { useState, useEffect } from "react";
import AdvanceDatatable from "@/helpers/AdvanceDatatable";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import { IconButton } from "@material-ui/core";
import Select from "react-select";
const customStyles = {
  control: (base) => ({
    ...base,
    height: 26,
    minHeight: 26,
    border: "none",

    boxShadow: "none",
  }),
};
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
} from "reactstrap";
import { Image } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import {
  SUPPORTED_FORMATS_IMG,
  isWriteAuthorized,
  isReadAuthorized,
} from "@/helpers";
import { brandDataUrl } from "@/services/api";
import { EmployeeDocumentCreate, documentList } from "@/services/api_function";
import noimage from "@/assets/images/noimage.png";
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
export default function brand(props) {
  const [refresh, setRefresh] = useState(true);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [brandObject, setBrandObject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [documentOpts, setDocumentOpts] = useState([]);

  const columns = [
    {
      name: "Name",
      selector: "brandName",
      sortable: false,
    },
    {
      name: "Image",
      selector: "brandImage",
      sortable: true,
      cell: (row) => {
        if (row.brandImage != null) {
          return (
            <>
              <a href={row.brandImage} target="_blank">
                <Image src={row.brandImage} width="100px" height="100px" />
              </a>
            </>
          );
        } else {
          return (
            <>
              <Image src={noimage} width="100px" height="100px" />
            </>
          );
        }
      },
    },
    {
      name: "Created Date",
      selector: "createdAt",
      cell: (row) => moment(row.createdAt).format("Do MMM YYYY"),
      sortable: false,
    },
    {
      name: "Action",
      cell: (row) =>
        isWriteAuthorized("master", "designationPermission") && (
          <>
            <Button
              title="EDIT"
              id="Tooltipedit"
              className="edityellowbtn"
              onClick={() => {
                onEditModalShow(true, row.id);
              }}
            >
              <i className="fa fa-edit"></i>
            </Button>
            <Button
              title="DELETE"
              id="Tooltipdelete"
              className="deleteredbtn"
              onClick={() => {
                onDeleteModalShow(row.id);
              }}
            >
              <i className="fa fa-trash"></i>
            </Button>
          </>
        ),
      button: true,
    },
  ];

  const addBtn = isWriteAuthorized("master", "designationPermission") && (
    <>
      {" "}
      <IconButton
        id="TooltipExample"
        color="primary"
        title="CREATE"
        onClick={() => {
          onAddModalShow(true);
        }}
      >
        <AddIcon />
      </IconButton>
    </>
  );
  const onAddModalShow = (status) => {
    setAddModalShow(status);
  };

  const onEditModalShow = (status, id) => {
    if (status) {
      brandFind(id)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            setBrandObject(response.data.responseObject);
            setEditModalShow(status);
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          console.log("errors", error);
        });
    } else {
      setEditModalShow(status);
    }
  };

  const getDocumentList = () => {
    documentList()
      .then((response) => {
        let documentOpts =
          response.data.responseObject &&
          response.data.responseObject.map(function (values) {
            return {
              value: values.id,
              label: values.name,
            };
          });
        setDocumentOpts(documentOpts);
      })
      .catch((error) => {
        console.log({ error });
      });
  };
  useEffect(() => {
    getDocumentList();
  }, []);

  const onDeleteModalShow = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      // icon: "warning",
      customClass: "sweetclass",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (!result.isConfirmed) {
        return false;
      }

      brandDelete(id)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            toast.success("✔ " + response.data.message);
            setRefresh(true);
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          toast.error("✘ " + error);
        });
    });
  };

  return (
    <div>
      {(isReadAuthorized("master", "designationPermission") ||
        isWriteAuthorized("master", "designationPermission")) && (
        <AdvanceDatatable
          title="Brands"
          columns={columns}
          actionUrl={brandDataUrl()}
          addBtn={addBtn}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
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
          Create Employee Document
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            imagePath: "",
            imageKey: "",
            documentId: "",
          }}
          validationSchema={Yup.object().shape({
            // imagePath: Yup.string().trim().required("Designation name is required"),
            // imageKey: Yup.string().trim().required("Designation code is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = new FormData();
            let keys = Object.keys(initVal);
            keys.map((sv) => {
              // console.log("v", v);
              if (values[v] != "" && v != "documentId") {
                // console.log(values[v]);
                requestData.append(v, values[v]);
              }
            });

            requestData.append("imagePath", values.imagePath);
            requestData.append("imageKey", values.imageKey);
            requestData.append("documentId", values.documentId.value);

            EmployeeDocumentCreate(requestData)
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
                  {/* <Col md="4">
                          <Form.Group className="createnew">
                            <Form.Label>Document Name</Form.Label>
                            <Select
                              className="selectTo"
                              onChange={(v) => {
                                setFieldValue("documentId", v);
                              }}
                              name="documentId"
                              styles={customStyles}
                              options={documentOpts}
                              value={values.documentId}
                              invalid={errors.documentId ? true : false}
                              //styles={customStyles}
                            />
                            <span className="text-danger">
                              {errors.documentId}
                            </span>
                          </Form.Group>
                        </Col>
                   */}
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="documentId"> Select Document </Label>

                      <Select
                        ////isClearable={true}
                        // closeMenuOnSelect={TramRounded}
                        // components={{ ClearIndicator }}
                        styles={{
                          clearIndicator: ClearIndicatorStyles,
                        }}
                        onChange={(v) => {
                          setFieldValue("documentId", v);
                        }}
                        name="documentId"
                        options={documentOpts}
                        value={values.documentId}
                      />
                      <span className="text-danger">
                        {errors.documentId && "Please select Trade."}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      {/* <Label>Upload Document</Label> */}
                      <InputGroup className="mt-4 pt-1">
                        <div className="custom-file">
                          <Input
                            type="file"
                            name="imagePath"
                            className="custom-file-input"
                            onChange={(e) => {
                              setFieldValue("imagePath", e.target.files[0]);
                            }}
                          />
                          <label
                            className="custom-file-label custombrowseclass"
                            htmlFor="imagePath"
                          >
                            {values.imagePath != ""
                              ? values.imagePath.name
                              : "select  image"}
                          </label>
                        </div>
                      </InputGroup>
                      <span className="text-danger">
                        {errors.imagePath && errors.imagePath}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>image Key</Label>
                      <Input
                        type="text"
                        placeholder="Enter image key"
                        name="imageKey"
                        onChange={handleChange}
                        value={values.imageKey}
                        invalid={errors.imageKey ? true : false}
                      />
                      <FormFeedback>{errors.imageKey}</FormFeedback>
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

      {/* Edit Modal */}
      <Modal
        className="modal-lg p-2"
        isOpen={editModalShow}
        toggle={() => {
          onEditModalShow(null);
        }}
      >
        <ModalHeader
          className="modalheadernew p-2"
          toggle={() => {
            onEditModalShow(null);
          }}
        >
          Update Brand
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            brandName: brandObject != null ? brandObject.brandName : "",
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
              return Yup.mixed().notRequired("Upload image");
            }),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = new FormData();
            requestData.append("id", brandObject.id);
            requestData.append("brandName", values.brandName);
            if (values.brandImage != null && values.brandImage != undefined) {
              requestData.append("image", values.brandImage);
            }

            brandUpdate(requestData)
              .then((response) => {
                setIsLoading(false);
                if (response.data.responseStatus === 200) {
                  setSubmitting(false);
                  toast.success("✔ " + response.data.message);
                  resetForm();
                  onEditModalShow(false);
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
                  <Col md="2">
                    <FormGroup>
                      <Label>OLD Image</Label>
                      <br />
                      {brandObject && brandObject.brandImage != null ? (
                        <Image
                          src={brandObject.brandImage}
                          width="100px"
                          height="100px"
                        />
                      ) : (
                        <Image src={noimage} width="100px" height="100px" />
                      )}
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
                              : "select new image"}
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
                    Updating...
                  </Button>
                ) : (
                  <Button type="submit" className="mainbtn1 text-white">
                    Update
                  </Button>
                )}

                <Button
                  className="mainbtn1 modalcancelbtn"
                  type="button"
                  onClick={() => {
                    onEditModalShow(null);
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
