import React, { useState, useRef, useEffect } from "react";
import GridTable from "@nadavshaar/react-grid-table";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import {
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
  Spinner,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { Badge } from "reactstrap";
import Select, { components } from "react-select";

import {
  isWriteAuthorized,
  isReadAuthorized,
  getHeader,
  CustomDTHeader,
  WithUserPermission,
  isActionExist,
  getSelectValue,
} from "@/helpers";
import { DTDeductionUrl } from "@/services/api";
import {
  createDeduction,
  findDeduction,
  updateDeduction,
  deleteDeduction,
  payheadList,
} from "@/services/api_function";

import axios from "axios";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

const ActionsCellRender = ({
  tableManager,
  value,
  field,
  data,
  column,
  colIndex,
  rowIndex,
  props,
}) => {
  const { additionalProps } = tableManager.config;
  const { header } = additionalProps;
  const { currentIndex, onEditModalShow, onDeleteModalShow, userPermissions } =
    header;
  return (
    <>
      {currentIndex === rowIndex ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : (
        isActionExist("deduction", "edit", userPermissions) && (
          <Button
            title="EDIT"
            id="Tooltipedit"
            className="edityellowbtn"
            onClick={(e) => {
              e.preventDefault();
              onEditModalShow(true, data.id, rowIndex);
            }}
          >
            <i className="fa fa-edit"></i>
          </Button>
        )
      )}
      {/* {isActionExist("deduction", "delete", userPermissions) && (
        <Button
          title="DELETE"
          id="Tooltipdelete"
          className="deleteredbtn"
          onClick={(e) => {
            e.preventDefault();
            onDeleteModalShow(data.id);
          }}
        >
          <i className="fa fa-trash"></i>
        </Button>
      )} */}
    </>
  );
};

function Deduction(props) {
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deductionObject, setDeductionObject] = useState("");
  const [currentIndex, setcurrentIndex] = useState(0);
  const [payheadOpt, setPayheadOpt] = useState([]);
  const tableManager = React.useRef(null);
  const setTableManager = (tm) => (tableManager.current = tm);

  const getColumns = [
    {
      id: "name",
      field: "name",
      label: "Deduction Name",
      resizable: true,
    },
    {
      id: "percentage",
      field: "percentage",
      label: "Percentage",
      resizable: true,
    },
    {
      id: "parent_payhead",
      field: "payheadParentName",
      label: "Percentage Of",
      resizable: true,
    },
    {
      id: "deductionStatus",
      // field: "deductionStatus",
      label: "Status",
      resizable: true,
      cellRenderer: ({ data }) => {
        return (
          <div className="nightshift">
            {/* {console.log(data.allowanceStatus)} */}
            <h1>{data.deductionStatus}</h1>
            <h4>
              <Badge
                pill
                style={{
                  backgroundColor:
                    data.deductionStatus == true ? "#A1C880" : "",
                }}
              >
                {data.deductionStatus == true ? "active" : "de-active"}
              </Badge>
            </h4>
            {/* {moment(data.createdAt).format("Do MMM YYYY")} */}
          </div>
        );
      },
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
      cellRenderer: ActionsCellRender,
    },
  ];

  const onRowsRequest = async (requestData, tableManager) => {
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
    };
    const response = await axios({
      url: DTDeductionUrl(),
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

  const addBtn = isWriteAuthorized("master", "designationPermission") &&
    isActionExist("deduction", "create", props.userPermissions) && (
      <>
        <button
          onClick={(e) => {
            e.preventDefault();
            onAddModalShow(true);
          }}
        >
          <i className="fa fa-plus"></i>
        </button>
      </>
    );
  const onAddModalShow = (status) => {
    setAddModalShow(status);
  };

  const onEditModalShow = (status, id, rowIndex) => {
    if (status) {
      setcurrentIndex(rowIndex);
      let reqData = {
        id: id,
      };
      findDeduction(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            let result = response.data.response;
            let options = payheadOpt;
            let ph_opt = getSelectValue(options, result.payheadParentId);
            result.payheadId = ph_opt;
            let final_state = options.filter((item) => item.value != result.id);

            setPayheadOpt(final_state);
            setDeductionObject(result);
            setEditModalShow(true);
            // setpay
            // this.setState({
            //   payheadOpt: final_state,
            //   payheadObject: result,
            //   currentIndex: 0,
            //   editModalShow: status,
            // });

            // setDeductionObject(response.data.response);
            // setcurrentIndex(0);
            // setEditModalShow(status);
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          console.log("errors", error);
        });
    } else {
      setcurrentIndex(0);
      setEditModalShow(status);
    }
  };

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

      let reqData = {
        id: id,
      };
      deleteDeduction(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            toast.success("✔ " + response.data.message);
            tableManager.current.asyncApi.resetRows();
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          toast.error("✘ " + error);
        });
    });
  };

  useEffect(() => {
    getPayheadOptions();
  }, []);

  const getPayheadOptions = () => {
    payheadList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let selectOptions = response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.payheadName,
            };
          });
          // this.setState({
          //   payheadOpt: selectOptions,
          //   phOptions: selectOptions,
          // });
          setPayheadOpt(selectOptions);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  let { userPermissions } = props;
  return (
    <div>
      {(isReadAuthorized("master", "designationPermission") ||
        isWriteAuthorized("master", "designationPermission")) && (
        <GridTable
          components={{ Header: CustomDTHeader }}
          columns={getColumns}
          onRowsRequest={onRowsRequest}
          onRowClick={(
            { rowIndex, data, column, isEdit, event },
            tableManager
          ) => !isEdit}
          minSearchChars={0}
          additionalProps={{
            header: {
              label: "Deduction",
              addBtn: addBtn,
              currentIndex: currentIndex,
              onEditModalShow: onEditModalShow,
              onDeleteModalShow: onDeleteModalShow,
              userPermissions: userPermissions,
            },
          }}
          onLoad={setTableManager}
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
          Create Deduction
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            name: "",
            deductionStatus: false,
            percentage: "",
            payheadId: "",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .trim()
              .nullable()
              .required("Deduction name is required"),
            // deductionStatus: Yup.string()
            //   .trim()
            //   .nullable()
            //   .required("Deduction status is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = {
              deductionName: values.name,
              deductionStatus: values.deductionStatus,
              percentage: values.percentage,
              payheadId: values.payheadId.value,
            };

            createDeduction(requestData)
              .then((response) => {
                setIsLoading(false);
                if (response.data.responseStatus === 200) {
                  setSubmitting(false);
                  toast.success("✔ " + response.data.message);
                  resetForm();
                  onAddModalShow(false);
                  tableManager.current.asyncApi.resetRows();
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
                      <Label>Deduction Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter deduction name"
                        name="name"
                        onChange={handleChange}
                        value={values.name}
                        invalid={errors.name ? true : false}
                      />
                      <FormFeedback>{errors.name}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Percentage(%)</Label>
                      <Input
                        type="text"
                        placeholder="Enter Percentage(%)"
                        name="percentage"
                        onChange={handleChange}
                        value={values.percentage}
                        invalid={errors.percentage ? true : false}
                      />
                      <FormFeedback>{errors.percentage}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label style={{ marginBottom: "0px" }} htmlFor="level">
                        Percentage Of
                      </Label>

                      <Select
                        isClearable={true}
                        styles={{
                          clearIndicator: ClearIndicatorStyles,
                        }}
                        onChange={(v) => {
                          setFieldValue("payheadId", v);
                        }}
                        name="payheadId"
                        options={payheadOpt}
                        value={values.payheadId}
                      />

                      <span className="text-danger">
                        {errors.payheadId && "Please select Percentage Of."}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                  <FormGroup check className="nightshiftlabel" inline>
                      <Label check><label className="p-2">Deduction status</label>
                        <Input
                          type="checkbox"
                          name="deductionStatus"
                          defaultChecked={false}
                          onChange={handleChange}
                        />
                        &nbsp; &nbsp;
                      </Label>
                    </FormGroup>
                    {/* <FormGroup>
                      <label>
                        Deduction status
                        <span className="text-danger">*</span>
                      </label>
                    </FormGroup>
                    <FormGroup check className="nightshiftlabel" inline>
                      <Label check>
                        <Input
                          type="checkbox"
                          name="deductionStatus"
                          defaultChecked={false}
                          onChange={handleChange}

                        
                        />
                        &nbsp; &nbsp;
                      </Label>
                    </FormGroup> */}
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter className="p-0">
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
                  className="modalcancelbtn"
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
          Update Deduction
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize={true}
          initialValues={{
            name: deductionObject != null ? deductionObject.name : "",
            percentage:
              deductionObject != null ? deductionObject.percentage : "",
            payheadId: deductionObject != null ? deductionObject.payheadId : "",
            deductionStatus:
              deductionObject != null ? deductionObject.deductionStatus : "",
          }}
          // validationSchema={Yup.object().shape({
          //   name: Yup.string()
          //     .trim()
          //     .nullable()
          //     .required("Deduction name is required"),
          // })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setIsLoading(false);
            let requestData = {
              id: deductionObject.id,
              deductionName: values.name,
              percentage: values.percentage?values.percentage:"",
              payheadId: values.payheadId ? values.payheadId.value : "",
              deductionStatus: values.deductionStatus
                ? values.deductionStatus
                : "",
            };
            console.log(
              "🚀 ~ file: Deduction.jsx:607 ~ Deduction ~ requestData:",
              requestData
            );

            updateDeduction(requestData)
              .then((response) => {
                setIsLoading(true);
                if (response.data.responseStatus === 200) {
                  setSubmitting(false);
                  toast.success("✔ " + response.data.message);
                  setIsLoading(false);
                  resetForm();
                  onEditModalShow(false);
                  tableManager.current.asyncApi.resetRows();
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
                      <Label>Deduction Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter deduction name"
                        name="name"
                        onChange={handleChange}
                        value={values.name}
                        invalid={errors.name ? true : false}
                      />
                      <FormFeedback>{errors.name}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Percentage(%)</Label>
                      <Input
                        type="text"
                        placeholder="Enter Percentage(%)"
                        name="percentage"
                        onChange={handleChange}
                        value={values.percentage}
                        invalid={errors.percentage ? true : false}
                      />
                      <FormFeedback>{errors.percentage}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label style={{ marginBottom: "0px" }} htmlFor="level">
                        Percentage Of
                      </Label>

                      <Select
                        isClearable={true}
                        styles={{
                          clearIndicator: ClearIndicatorStyles,
                        }}
                        onChange={(v) => {
                          setFieldValue("payheadId", v);
                        }}
                        name="payheadId"
                        options={payheadOpt}
                        value={values.payheadId}
                      />
                      <span className="text-danger">
                        {errors.payheadId && "Please select Percentage Of."}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                   
                    <FormGroup check className="nightshiftlabel" inline>
                      <Label check><label className="p-2">Deduction status</label>
                        <Input
                          type="checkbox"
                          name="deductionStatus"
                          defaultChecked={values.deductionStatus === true}
                          onChange={handleChange}
                        />
                        &nbsp; &nbsp;
                      </Label>
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

export default WithUserPermission(Deduction);
