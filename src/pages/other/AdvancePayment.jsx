import React, { useState, useEffect, Component, useRef } from "react";
import GridTable from "@nadavshaar/react-grid-table";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import Select, { components } from "react-select";
import {
  isWriteAuthorized,
  isReadAuthorized,
  getHeader,
  CustomDTHeader,
  getSelectValue,
  WithUserPermission,
  isActionExist,
} from "@/helpers";
import {
  approveAdvancePayment,
  rejectAdvancePayment,
} from "@/services/api_function";
import { DTAdvancePaymentUrl } from "@/services/api";

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
  Dropdown,
  Button,
} from "reactstrap";
import axios from "axios";

class AdvancePayment extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.state = {
      isLoading: false,
      currentIndex: 0,
      showApproveModal: false,
      paymentObj: {
        paymentId: "",
        requestAmount: "",
        paymentAmount: "",
        paymentStatus: "",
        remark: "",
      },
    };
  }
  setTableManager = (tm) => (this.tableManager.current = tm);

  onRowsRequest = async (requestData, tableManager) => {
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
    };
    const response = await axios({
      url: DTAdvancePaymentUrl(),
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

  onViewRejectModal = (paymentId = null, paymentStatus = null) => {
    Swal.fire({
      title: `Sure to reject request?`,
      input: "textarea",
      // inputLabel: "Remark",
      inputPlaceholder: "Type your remark here...",
      inputAttributes: {
        "aria-label": "Type your remark here",
      },
      customClass: "sweetclass",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Reject`,

      inputValidator: (value) => {
        console.log({ value });
        if (!value) {
          return "You need to write something!";
        }
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return false;
      }

      let Obj = {
        paymentId: paymentId,
        paymentAmount: 0,
        paymentStatus: paymentStatus,
        remark: result.value,
      };
      rejectAdvancePayment(Obj)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            toast.success("✔ " + res.message);
            this.tableManager.current.asyncApi.resetRows();
          } else {
            toast.error("✘ Something went wrong!");
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    });
  };

  onApproveModalShow = (
    status,
    paymentId = null,
    paymentStatus = null,
    requestAmount = null
  ) => {
    if (status) {
      let Obj = {
        paymentId: paymentId,
        requestAmount: requestAmount,
        paymentAmount: requestAmount,
        paymentStatus: paymentStatus,
        remark: "",
      };
      this.setState({
        paymentObj: Obj,
        showApproveModal: status,
      });
    } else {
      this.setState({
        showApproveModal: status,
      });
    }
  };

  render() {
    const columns = [
      {
        id: "employee_name",
        field: "employeeName",
        label: "Employee Name",
        width: "100px",
        resizable: true,
      },
      {
        id: "request_amount",
        field: "requestAmount",
        label: "Amount",
        width: "100px",
        resizable: true,
      },
      {
        id: "reason",
        field: "reason",
        label: "Reason",
        width: "100px",
        resizable: true,
      },
      {
        id: "date_of_request",
        label: "DOR",
        width: "120px",
        cellRenderer: ({ data }) => {
          return (
            <div className="nightshift">
              {moment(data.dateOfRequest).format("Do MMM YYYY")}
            </div>
          );
        },
        resizable: true,
      },
      {
        id: "approved_by",
        field: "approvedBy",
        label: "Approved By",
        width: "110px",
        resizable: true,
      },
      // {
      //   id: "payment_status",
      //   field: "paymentStatus",
      //   width: "130px",
      //   label: "Payment Status",
      //   resizable: true,
      // },
      {
        id: "remark",
        field: "remark",
        label: "Remark",
        resizable: true,
      },
      {
        id: "paid_amount",
        field: "paidAmount",
        width: "130px",
        label: "Paid Amount",
        resizable: true,
      },
      {
        id: "paymentDate",
        width: "200px",
        label: "Payment Dt.",
        cellRenderer: ({ data }) => {
          return (
            <div className="nightshift">
              {data.paymentDate != null
                ? moment(data.paymentDate).format("Do MMM YYYY")
                : ""}
            </div>
          );
        },
        resizable: true,
      },
      {
        id: "created_at",
        width: "200px",
        label: "Created Dt.",
        cellRenderer: ({ data }) => {
          return (
            <div className="nightshift">
              {moment(new Date(data.createdAt)).format("DD MMM YYYY")}
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
        cellRenderer: ({ value, data, column, colIndex, rowIndex }) =>
          data.paymentStatus == "Pending"
            ? isActionExist(
                "advance-payments",
                "edit",
                this.props.userPermissions
              ) && (
                <>
                  <Button
                    title="DEACTIVATE"
                    id="Tooltipedit"
                    className="deleteredbtn"
                    onClick={(e) => {
                      e.preventDefault();
                      this.onViewRejectModal(data.id, "Rejected");
                    }}
                  >
                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                  </Button>

                  <Button
                    title="ACTIVATE"
                    id="Tooltipedit"
                    className="creategreenbtn"
                    onClick={(e) => {
                      e.preventDefault();
                      this.onApproveModalShow(
                        true,
                        data.id,
                        "Approved",
                        data.requestAmount
                      );
                    }}
                  >
                    <i className="fa fa-check-circle"></i>
                  </Button>
                </>
              )
            : data.paymentStatus,
      },
    ];

    const { isLoading, currentIndex, showApproveModal, paymentObj } =
      this.state;

    return (
      <div>
        <GridTable
          components={{ Header: CustomDTHeader }}
          columns={columns}
          onRowsRequest={this.onRowsRequest}
          onRowClick={(
            { rowIndex, data, column, isEdit, event },
            tableManager
          ) => !isEdit}
          minSearchChars={0}
          additionalProps={{
            header: {
              label: "Advance Payment",
              addBtn: "",
              currentIndex: currentIndex,
            },
          }}
          onLoad={this.setTableManager.bind(this)}
        />

        {/* Approve Modal */}
        <Modal
          className="modal-lg p-2"
          isOpen={showApproveModal}
          toggle={() => {
            this.onApproveModalShow(null);
          }}
        >
          <ModalHeader
            className="modalheadernew p-2"
            toggle={() => {
              this.onApproveModalShow(null);
            }}
          >
            Advance Payment
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={paymentObj}
            validationSchema={Yup.object().shape({
              requestAmount: Yup.string()
                .trim()
                .nullable()
                .required("Request amount is required"),
              paymentAmount: Yup.string()
                .trim()
                .nullable()
                .required("Payable amount is required"),
              remark: Yup.string()
                .trim()
                .nullable()
                .required("Remark is required"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();

              approveAdvancePayment(values)
                .then((response) => {
                  if (response.data.responseStatus === 200) {
                    setSubmitting(false);
                    toast.success("✔ " + response.data.message);
                    this.onApproveModalShow(false);
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
                {/* {JSON.stringify(values)} */}
                <ModalBody>
                  <Row>
                    <Col md="3">
                      <FormGroup>
                        <Label>Request Amount</Label>
                        <Input
                          type="text"
                          readOnly={true}
                          placeholder="Enter designation name"
                          name="requestAmount"
                          onChange={handleChange}
                          value={values.requestAmount}
                          invalid={errors.requestAmount ? true : false}
                        />
                        <FormFeedback>{errors.requestAmount}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Payable Amount</Label>
                        <Input
                          type="text"
                          placeholder="Enter payable"
                          name="paymentAmount"
                          onChange={handleChange}
                          value={values.paymentAmount}
                          invalid={errors.paymentAmount ? true : false}
                        />
                        <FormFeedback>{errors.paymentAmount}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Remark</Label>
                        <Input
                          type="text"
                          placeholder="Enter remark here..."
                          name="remark"
                          onChange={handleChange}
                          value={values.remark}
                          invalid={errors.remark ? true : false}
                        />
                        <FormFeedback>{errors.remark}</FormFeedback>
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
                      updating...
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
                      this.onApproveModalShow(null);
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
}

export default WithUserPermission(AdvancePayment);
