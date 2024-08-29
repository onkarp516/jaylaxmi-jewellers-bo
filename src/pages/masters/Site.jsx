import React, { useState } from "react";
import GridTable from "@nadavshaar/react-grid-table";
import { DTSiteUrl } from "@/services/api";
import { changeSiteStatus } from "@/services/api_function";
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
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import moment from "moment";

import {
  isWriteAuthorized,
  isReadAuthorized,
  getHeader,
  CustomDTHeader,
  WithUserPermission,
  isActionExist,
} from "@/helpers";

function Site(props) {
  const [refresh, setRefresh] = useState(true);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const [addModalShow, setAddModalShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(0);
  const [siteObj, setSiteObj] = useState({});

  const tableManager = React.useRef(null);
  const setTableManager = (tm) => (tableManager.current = tm);
  const columns = [
    {
      id: "site_name",
      field: "siteName",
      label: "Site Name",
      resizable: true,
    },
    {
      id: "site_hindi_name",
      field: "siteHindiName",
      label: "Site Hindi Name",
      resizable: true,
    },
    {
      id: "site_code",
      field: "siteCode",
      label: "Site Code",
      resizable: true,
    },
    {
      id: "site_lat",
      field: "siteLat",
      label: "Site Lat",
      resizable: true,
    },
    {
      id: "site_long",
      field: "siteLong",
      label: "Site Long",
      resizable: true,
    },
    {
      id: "site_radius",
      field: "siteRadius",
      label: "Site Radius",
      resizable: true,
    },
    {
      id: "created_at",
      label: "Created Date",
      cellRenderer: ({ data }) => {
        return (
          <div className="nightshift">
            {moment(data.createdAt).format("Do MMM YYYY")}
          </div>
        );
      },
      resizable: true,
    },
    {
      id: "buttons",
      label: "Action",
      pinned: true,
      width: "100px",
      sortable: false,
      resizable: false,
      width: "100px",
      cellRenderer: ({ value, data, column, colIndex, rowIndex }) => (
        <>
          {isActionExist("site", "edit", props.userPermissions) && (
            <Button
              title="EDIT"
              id="Tooltipedit"
              className="edityellowbtn"
              onClick={(e) => {
                e.preventDefault();
                props.history.push("/site/edit-site/" + data.id);
              }}
            >
              <i className="fa fa-edit"></i>
            </Button>
          )}
          {isActionExist("site", "delete", props.userPermissions) &&
            (data.status == true ? (
              <Button
                title="DEACTIVATE"
                id="Tooltipedit"
                className="deleteredbtn"
                onClick={(e) => {
                  e.preventDefault();
                  onStatusEnableDisable(data.id, !data.status);
                }}
              >
                <i className="fa fa-times-circle" aria-hidden="true"></i>
              </Button>
            ) : (
              <Button
                title="ACTIVATE"
                id="Tooltipedit"
                className="creategreenbtn"
                onClick={(e) => {
                  e.preventDefault();
                  onStatusEnableDisable(data.id, !data.status);
                }}
              >
                <i className="fa fa-check-circle"></i>
              </Button>
            ))}
        </>
      ),
    },
  ];

  const addBtn = isWriteAuthorized("master", "designationPermission") &&
    isActionExist("site", "create", props.userPermissions) && (
      <>
        <button
          title="CREATE"
          onClick={(e) => {
            e.preventDefault();
            props.history.push("/site/create-site");
          }}
        >
          <i className="fa fa-plus"></i>
        </button>
      </>
    );

  const onStatusEnableDisable = (siteId, status) => {
    Swal.fire({
      title: `Are you sure? `,
      customClass: "sweetclass",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes ${status ? "Active" : "Deactive"}`,
    }).then((result) => {
      if (!result.isConfirmed) {
        return false;
      }

      let request_data = {
        id: siteId,
        status: status,
      };
      changeSiteStatus(request_data)
        .then((response) => {
          // console.log("response", response);
          if (response.data.responseStatus == 200) {
            toast.success("✔ " + response.data.message);

            tableManager.current.asyncApi.resetRows();
          } else {
            toast.error("✘ Something went wrong!");
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    });
  };

  const onRowsRequest = async (requestData, tableManager) => {
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
    };
    const response = await axios({
      url: DTSiteUrl(),
      method: "POST",
      headers: getHeader(),
      data: JSON.stringify(req),
    })
      .then((response) => response.data)
      .catch((e) => {
        console.log("e--->", e);
      });

    if (!response?.rows) return;

    return {
      rows: response.rows,
      totalRows: response.totalRows,
    };
  };

  return (
    <div>
      {(isReadAuthorized("master", "sitePermission") ||
        isWriteAuthorized("master", "sitePermission")) && (
        <GridTable
          components={{ Header: CustomDTHeader }}
          columns={columns}
          onRowsRequest={onRowsRequest}
          onRowClick={(
            { rowIndex, data, column, isEdit, event },
            tableManager
          ) => !isEdit}
          minSearchChars={0}
          additionalProps={{
            header: {
              label: "Sites",
              addBtn: addBtn,
              currentIndex: currentIndex,
            },
          }}
          onLoad={setTableManager}
        />
      )}

      {/* Add Modal */}
      <Modal
        className="p-2"
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
          Create Site
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            siteName: "",
            siteCode: "",
          }}
          validationSchema={Yup.object().shape({
            siteName: Yup.string()
              .trim()
              // .matches(tradeRegExp, "accept only aplhabets")
              .required("Site Name is required"),
            siteCode: Yup.string()
              .trim()
              // .matches(tradeRegExp, "accept only aplhabets")
              .required("Site Code is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            console.log({ values });
            let requestData = {
              siteName: values.siteName,
              siteCode: values.siteCode,
            };

            console.log({ requestData });
            return axios({
              method: "POST",
              headers: getHeader(),
              data: requestData,
              url: createSiteUrl(),
            })
              .then((response) => {
                if (response.data.status === 200) {
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
            <Form autoComplete="off" onSubmit={handleSubmit}>
              <ModalBody>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label>Site Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter site name"
                        name="siteName"
                        onChange={handleChange}
                        value={values.siteName}
                        invalid={errors.siteName ? true : false}
                      />
                      <FormFeedback>{errors.siteName}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>Site Code</Label>
                      <Input
                        type="text"
                        placeholder="Enter site code"
                        name="siteCode"
                        onChange={handleChange}
                        value={values.siteCode}
                        invalid={errors.siteCode ? true : false}
                      />
                      <FormFeedback>{errors.siteCode}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter className="p-2">
                <Button
                  type="submit"
                  className="mainbtn1 text-white"
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

      {/* update Holiday */}

      <Modal
        className="p-2"
        isOpen={showEditModal}
        toggle={() => {
          onEditModalShow(false);
        }}
      >
        <ModalHeader
          className="p-2 modalheadernew"
          toggle={() => {
            onEditModalShow(false);
          }}
        >
          Update Site
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={siteObj}
          validationSchema={Yup.object().shape({
            siteName: Yup.string()
              .trim()
              // .matches(tradeRegExp, "accept only aplhabets")
              .required("site Name is required"),
            siteCode: Yup.string()
              .trim()
              // .matches(tradeRegExp, "accept only aplhabets")
              .required("Site Code is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            console.log({ values });
            let requestData = {
              siteName: values.siteName,
              siteCode: values.siteCode,
            };

            console.log({ requestData });
            return axios({
              method: "POST",
              headers: getHeader(),
              data: requestData,
              url: updateSiteUrl(siteObj.id),
            })
              .then((response) => {
                if (response.data.status === 200) {
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
            <Form autoComplete="off" onSubmit={handleSubmit}>
              <ModalBody>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label>Site Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter site name"
                        name="siteName"
                        onChange={handleChange}
                        value={values.siteName}
                        invalid={errors.siteName ? true : false}
                      />
                      <FormFeedback>{errors.siteName}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>Site Code</Label>
                      <Input
                        type="text"
                        placeholder="Enter site code"
                        name="siteCode"
                        onChange={handleChange}
                        value={values.siteCode}
                        invalid={errors.siteCode ? true : false}
                      />
                      <FormFeedback>{errors.siteCode}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter className="p-2">
                <Button
                  type="submit"
                  className="mainbtn1 text-white"
                  disabled={isSubmitting}
                >
                  Create
                </Button>

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

export default WithUserPermission(Site);
