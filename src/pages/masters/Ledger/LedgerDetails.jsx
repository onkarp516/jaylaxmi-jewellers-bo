import React from "react";
import { Button, Col, Row, Form, Table, InputGroup } from "react-bootstrap";

import {
  ShowNotification,
  AuthenticationCheck,
  eventBus,
  isActionExist,
  MyNotifications,
  MyDatePicker,
  MyTextDatePicker,
} from "@/helpers";
import * as Yup from "yup";
import {
  getLedgers,
  getLedgerTranxDetailsReport,
  getLedgerTranxDetailsReportDate,
} from "@/services/api_functions";
import { Formik } from "formik";
import moment from "moment";
// import TableRow from "TableRow";

import delete_icon from "@/assets/images/delete_icon.svg";
import view_icon from "@/assets/images/view_icon_3.svg";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class LedgerDetails extends React.Component {
  constructor(props) {
    super(props);
    this.LedgerRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.tableManager = React.createRef(null);
    this.state = {
      show: false,
      lstLedger: [],
      lstDetails: [],
      openingStock: 0,
      crdrType: 0,
      lstLedgerFiltered: [],
      isLedgerFilterd: true,
      opendiv: false,
      showDiv: true,
      orgData: [],
      totalDr: 0,
      totalCr: 0,
    };
  }
  getlstLedger = () => {
    getLedgers()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          this.setState(
            { lstLedger: res.responseList, orgData: res.responseList },
            () => {
              this.getFilterLstLedger();
              this.LedgerRef.current.setFieldValue("search", "");
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };

  getlstLedgerTranxDetailsReports = (id) => {
    // let { edit_data } = this.state;
    // const startDate = moment(d_start_date).format("YYYY-MM-DD");
    // const endDate = moment(d_end_date).format("YYYY-MM-DD");
    let reqData = new FormData();
    // reqData.append("id", id);
    // reqData.append("d_start_date", startDate);
    // reqData.append("d_end_date", endDate);
    reqData.append("id", id);

    getLedgerTranxDetailsReport(reqData)
      .then((response) => {
        let res = response.data;
        // let openingbal = reqData.opening_stock.data;
        console.log("response--->", response);
        if (res.responseStatus === 200) {
          let opt = res.response.map((v) => {
            return {
              credit: v.credit,
              debit: v.debit,
              invoice_no: v.invoice_no,
              particulars: v.particulars,
              invoice_id: v.invoice_id,
              id: v.id,
              // transaction_date: v.transaction_date,
              transaction_date: moment(v.transaction_date).format("YYYY-MM-DD"),
              voucher_type: v.voucher_type,
            };
          });
          this.setState(
            {
              lstDetails: opt,
              openingStock: res.opening_stock,
              crdrtype: res.crdrType,
            },
            () => {}
          );
        }
        console.log("res---->", res);
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };

  getlstLedgerTranxDetailsReportsPageLoad = (value) => {
    let { edit_data, d_start_date, d_end_date } = this.state;
    const startDate = moment(
      moment(value.d_start_date, "DD/MM/YYYY").toDate()
    ).format("YYYY-MM-DD");
    const endDate = moment(
      moment(value.d_end_date, "DD/MM/YYYY").toDate()
    ).format("YYYY-MM-DD");
    let reqData = new FormData();
    // reqData.append("id", id);
    reqData.append("startDate", startDate);
    reqData.append("endDate", endDate);
    reqData.append("id", edit_data);
    getLedgerTranxDetailsReport(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          let opt = res.response.map((v) => {
            return {
              credit: v.credit,
              debit: v.debit,
              invoice_no: v.invoice_no,
              particulars: v.particulars,
              invoice_id: v.invoice_id,
              id: v.id,
              // transaction_date: v.transaction_date,
              transaction_date: moment(v.transaction_date).format("YYYY-MM-DD"),
              voucher_type: v.voucher_type,
            };
          });
          this.setState(
            {
              lstDetails: opt,
              openingStock: res.opening_stock,
              crdrtype: res.crdrType,
            },
            () => {}
          );
        }
        console.log("res---->", res);
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };

  getFilterLstLedger = () => {
    let { isLedgerFilterd, lstLedger } = this.state;

    if (lstLedger.length > 0) {
      let filterLst = lstLedger;
      if (isLedgerFilterd) {
        filterLst = filterLst.filter(
          (v) => v.dr > 0 || v.cr > 0 || v.rdr > 0 || v.rcr > 0
        );
      }
      this.setState({ lstLedgerFiltered: filterLst });
    }
  };

  getDrOpeningAmount = () => {
    let { openingStock, crdrtype } = this.state;
    console.log({ openingStock });
    let openingDramt = openingStock;
    if (crdrtype == "dr") {
      return isNaN(openingDramt) ? 0 : parseFloat(openingDramt).toFixed(2);
    } else {
      let openingDramt = 0;
      return openingDramt;
    }
  };
  getCrOpeningAmount = () => {
    let { openingStock, crdrtype } = this.state;
    console.log({ openingStock, crdrtype });
    let openingCramt = openingStock;
    if (crdrtype == "cr") {
      return isNaN(openingCramt) ? 0 : parseFloat(openingCramt).toFixed(2);
    } else {
      let openingCramt = 0;
      return openingCramt;
    }
  };

  getDebitTotalAmount = () => {
    let { lstDetails } = this.state;
    console.log({ lstDetails });
    let debitamt = 0;
    lstDetails.map((v) => {
      debitamt = parseFloat(debitamt) + parseFloat(v["debit"]);
    });

    return isNaN(debitamt) ? 0 : parseFloat(debitamt).toFixed(2);
  };

  getCreditTotalAmount = () => {
    let { lstDetails } = this.state;
    let creditamt = 0;
    lstDetails.map((v) => {
      creditamt = parseFloat(creditamt) + parseFloat(v["credit"]);
    });

    return isNaN(creditamt) ? 0 : parseFloat(creditamt).toFixed(2);
  };

  getClosingDrTotalAmount = () => {
    // let { lstDetails } = this.state;
    // debugger;
    let closing = 0;

    let debitamt = this.getDebitTotalAmount();
    let creditamt = this.getCreditTotalAmount();
    // let openingCramt = this.getCrOpeningAmount();
    let openingDramt = this.getDrOpeningAmount();
    console.log("debitamt---->", debitamt);
    console.log("creditamt---->", creditamt);
    console.log("openingDramt---->", openingDramt);

    if (debitamt >= creditamt) {
      closing =
        parseFloat(openingDramt) + parseFloat(debitamt) - parseFloat(creditamt);
      console.log("closing---->", closing);
      return isNaN(closing) ? 0 : parseFloat(closing).toFixed(2);
    } else {
      return closing;
    }
  };

  getClosingCrTotalAmount = () => {
    // let { lstDetails } = this.state;
    // debugger;
    let closing = 0;

    let debitamt = this.getDebitTotalAmount();
    let creditamt = this.getCreditTotalAmount();
    let openingCramt = this.getCrOpeningAmount();
    // let openingDramt = this.getDrOpeningAmount();
    console.log("debitamt---->", debitamt);
    console.log("creditamt---->", creditamt);
    console.log("openingCramt---->", openingCramt);

    if (creditamt >= debitamt) {
      closing =
        parseFloat(openingCramt) + parseFloat(creditamt) - parseFloat(debitamt);
      console.log("closing---->", closing);
      return isNaN(closing) ? 0 : parseFloat(closing).toFixed(2);
    } else {
      return closing;
    }
  };
  pageReload = () => {
    this.componentDidMount();
  };

  setUpdateValue = (id) => {
    eventBus.dispatch("page_change", {
      from: "ledgerlist",
      to: "ledgeredit",
      prop_data: id,
      isNewTab: false,
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.getlstLedger();
      // this.getlstLedgerTranxDetailsReportsPageLoad();
      const { prop_data } = this.props.block;
      console.log("prop_data====>>>>>", prop_data);
      this.setState({
        edit_data: prop_data,
      });

      this.getlstLedgerTranxDetailsReports(prop_data);
      // this.getlstLedgerTranxDetailsReportsPageLoad(prop_data);
    }
  }

  // componentDidUpdate() {
  //   if (AuthenticationCheck()) {
  //     let { isEditDataSet, edit_data } = this.state;
  //     if (isEditDataSet == false && edit_data != "") {
  //       this.getlstLedgerTranxDetailsReports();
  //     }
  //   }
  // }

  render() {
    const {
      show,
      lstLedgerFiltered,
      isLedgerFilterd,
      lstLedger,
      lstDetails,
      totalDr,
      totalCr,
    } = this.state;

    return (
      <div className="ledger_form_style">
        <div className="cust_table">
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.LedgerRef}
            initialValues={{ search: "" }}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              groupName: Yup.string().trim().required("Group name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {}}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              resetForm,
            }) => (
              // {!opendiv && (
              <Form>
                <Row
                  style={{ padding: "8px" }}
                  className="justify-content-center"
                >
                  <Col lg={7}>
                    <Row>
                      <Col lg={5}>
                        <Row>
                          <Col lg={4}>
                            <Form.Label>From Date</Form.Label>
                          </Col>
                          <Col lg={7}>
                            <MyTextDatePicker
                              innerRef={(input) => {
                                this.invoiceDateRef.current = input;
                              }}
                              className="form-control"
                              name="d_start_date"
                              id="d_start_date"
                              placeholder="DD/MM/YYYY"
                              dateFormat="dd/MM/yyyy"
                              value={values.d_start_date}
                              onChange={handleChange}
                              onBlur={(e) => {
                                console.log("e ", e);
                                console.log("e.target.value ", e.target.value);
                                if (
                                  e.target.value != null &&
                                  e.target.value != ""
                                ) {
                                  console.warn(
                                    "warn:: isValid",
                                    moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).isValid()
                                  );
                                  if (
                                    moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).isValid() == true
                                  ) {
                                    setFieldValue(
                                      "d_start_date",
                                      e.target.value
                                    );
                                  } else {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Invalid Start date",
                                      is_button_show: true,
                                    });
                                    this.invoiceDateRef.current.focus();
                                    setFieldValue("d_start_date", "");
                                  }
                                } else {
                                  setFieldValue("d_start_date", "");
                                }
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={5}>
                        <Row>
                          <Col lg={4}>
                            <Form.Label>To Date</Form.Label>
                          </Col>
                          <Col lg={7}>
                            <MyTextDatePicker
                              innerRef={(input) => {
                                this.invoiceDateRef.current = input;
                              }}
                              className="form-control"
                              name="d_end_date"
                              id="d_end_date"
                              placeholder="DD/MM/YYYY"
                              dateFormat="dd/MM/yyyy"
                              value={values.d_end_date}
                              onChange={handleChange}
                              onFocus={() => {
                                this.setState({ hideDp: true });
                              }}
                              onBlur={(e) => {
                                console.log("e ", e);
                                console.log("e.target.value ", e.target.value);
                                if (
                                  e.target.value != null &&
                                  e.target.value != ""
                                ) {
                                  console.warn(
                                    "warn:: isValid",
                                    moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).isValid()
                                  );
                                  if (
                                    moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).isValid() == true
                                  ) {
                                    setFieldValue("d_end_date", e.target.value);
                                    this.getlstLedgerTranxDetailsReportsPageLoad(
                                      values
                                    );
                                  } else {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Invalid End date",
                                      is_button_show: true,
                                    });
                                    this.invoiceDateRef.current.focus();
                                    setFieldValue("d_end_date", "");
                                  }
                                } else {
                                  setFieldValue("d_end_date", "");
                                }
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={2} className="text-end">
                        <Button
                          className="cancel-btn"
                          onClick={(e) => {
                            e.preventDefault();

                            eventBus.dispatch("page_change", "ledgerlist");
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={1}></Col>
                </Row>
              </Form>
            )}
          </Formik>

          {/* {lstLedger.length > 0 && ( */}
          <div className="tbl-body-style-lV">
            {isActionExist("ledger", "list", this.props.userPermissions) && (
              <Table size="sm" className="tbl-font">
                <thead>
                  <tr>
                    <th
                      style={{
                        // width: "169px",
                        width: "10%",
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        // width: "205px",
                        width: "10%",
                      }}
                    >
                      Voucher No
                    </th>
                    <th
                      style={{
                        // width: "205px",
                        width: "10%",
                      }}
                    >
                      Voucher Type
                    </th>
                    <th
                      style={{
                        // width: "169px",
                        width: "49%",
                      }}
                    >
                      Particular
                    </th>
                    <th
                      style={{
                        // width: "170px",
                        width: "7%",
                      }}
                    >
                      Debit
                    </th>
                    <th
                      style={{
                        // width: "290px",
                        width: "7%",
                      }}
                    >
                      Credit
                    </th>
                    <th
                      style={{
                        // width: "290px",
                        width: "7%",
                      }}
                    >
                      Action
                    </th>
                    {/* <th
                      className="text-end"
                      style={{ width: "15%", paddingRight: "30px" }}
                    >
                      Action
                    </th> */}
                  </tr>
                </thead>
                {/* <tfoot>
                <tr>
                  {this.state.showDiv && <th>Sr.</th>}
                  <th>Ledger Name</th>
                  <th>Group Name</th>
                  <th className="btn_align">Debit</th>
                  <th className="btn_align">Credit</th>
                </tr>
              </tfoot> */}
                <tbody style={{ borderTop: "2px solid transparent" }}>
                  {lstDetails.map((v, i) => {
                    // let grpName = "";
                    // if (v.particulars !== "") {
                    //   grpName = v.particulars;
                    // } else if (v.particulars !== "") {
                    //   grpName = v.particulars;
                    // }
                    return (
                      <tr
                        // onDoubleClick={(e) => {

                        //   if (isActionExist("ledger-edit", "edit")) {
                        //     if (v.default_ledger == false) {
                        //       this.setUpdateValue(v);
                        //     }
                        //   } else {
                        //     MyNotifications.fire({
                        //       show: true,
                        //       icon: "error",
                        //       title: "Error",
                        //       msg: "Permission is denied!",
                        //       is_button_show: true,
                        //     });
                        //   }
                        // }}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          if (
                            isActionExist(
                              "ledger",
                              "edit",
                              this.props.userPermissions
                            )
                          ) {
                            if (v.default_ledger === false) {
                              this.setUpdateValue(v.id);
                            } else {
                              ShowNotification(
                                "Error",
                                "Permission denied to update (Default Ledgers)"
                              );
                            }
                          } else {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: "Permission is denied!",
                              is_button_show: true,
                            });
                          }
                        }}
                        className="cursur_pointer"
                      >
                        {/* <td style={{ width: "10%" }}>{i + 1}</td> */}
                        <td style={{ width: "10%" }}>
                          {moment(v.transaction_date).format("DD-MM-YYYY")}
                        </td>
                        <td style={{ width: "10%" }}>{v.invoice_no}</td>
                        <td style={{ width: "10%" }}>{v.voucher_type}</td>
                        <td style={{ width: "49%" }}>{v.particulars}</td>
                        <td style={{ width: "7%" }}>{v.debit}</td>
                        <td style={{ width: "7%" }}>{v.credit}</td>
                        <td style={{ width: "7%" }}>
                          {" "}
                          <img
                            src={view_icon}
                            // style={{ width: "8%" }}

                            title="View"
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                isActionExist(
                                  "ledger",
                                  "edit",
                                  this.props.userPermissions
                                )
                              ) {
                                if (v.voucher_type == "purchase invoice") {
                                  let prop_d = v;
                                  prop_d["ledgerId"] = this.state.edit_data;

                                  eventBus.dispatch("page_change", {
                                    from: "ledgerdetails",
                                    to: "tranx_purchase_invoice_edit",
                                    prop_data: v,
                                  });
                                } else if (v.voucher_type == "sales invoice") {
                                  eventBus.dispatch("page_change", {
                                    from: "ledgerdetails",
                                    to: "tranx_sales_invoice_edit",
                                    prop_data: {
                                      ...v,
                                      ledgerId: this.state.edit_data,
                                    },
                                  });
                                } else if (v.voucher_type == "receipt") {
                                  eventBus.dispatch("page_change", {
                                    from: "ledgerdetails",
                                    to: "voucher_receipt_edit",
                                    prop_data: {
                                      ...v,
                                      ledgerId: this.state.edit_data,
                                    },
                                  });
                                } else if (v.voucher_type == "payment") {
                                  eventBus.dispatch("page_change", {
                                    from: "ledgerdetails",
                                    to: "voucher_payment_edit",
                                    prop_data: {
                                      ...v,
                                      ledgerId: this.state.edit_data,
                                    },
                                  });
                                } else if (
                                  v.voucher_type == "purchase return"
                                ) {
                                  eventBus.dispatch("page_change", {
                                    from: "ledgerdetails",
                                    to: "tranx_debit_note_edit_B2B",
                                    prop_data: {
                                      ...v,
                                      ledgerId: this.state.edit_data,
                                    },
                                  });
                                } else if (v.voucher_type == "sales return") {
                                  eventBus.dispatch("page_change", {
                                    from: "ledgerdetails",
                                    to: "tranx_credit_note_edit",
                                    prop_data: {
                                      ...v,
                                      ledgerId: this.state.edit_data,
                                    },
                                  });

                                  // } else if (v.voucher_type == "contra") {
                                  //   eventBus.dispatch("page_change", {
                                  //     from: "ledgerdetails",
                                  //     to: "tranx_contra_List",
                                  //     prop_data: {
                                  //       ...v,
                                  //       ledgerId: this.state.edit_data,
                                  //     },
                                  //   });
                                  // } else if (v.voucher_type == "journal") {
                                  //   eventBus.dispatch("page_change", {
                                  //     from: "ledgerdetails",
                                  //     to: "voucher_journal_list",
                                  //     prop_data: {
                                  //       ...v,
                                  //       ledgerId: this.state.edit_data,
                                  //     },
                                  //   });
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: "Permission is denied!",
                                    is_button_show: true,
                                  });
                                }
                              } else {
                                MyNotifications.fire({
                                  show: true,
                                  icon: "error",
                                  title: "Error",
                                  msg: "Permission is denied!",
                                  is_button_show: true,
                                });
                              }
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                  {lstDetails.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
                <thead style={{ borderTop: "2px solid #dee2e6" }}>
                  <tr style={{ borderBottom: "1px solid transparent" }}>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "49%", textAlign: "right" }}>
                      Opening Balance:
                    </td>
                    <td style={{ width: "7%" }}>
                      <b> {this.getDrOpeningAmount()}</b>
                    </td>
                    <td style={{ width: "7%" }}>
                      <b> {this.getCrOpeningAmount()}</b>
                    </td>
                    <td style={{ width: "7%" }}></td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "49%", textAlign: "right" }}>
                      Current Total:
                    </td>
                    <td style={{ width: "7%" }}>
                      <b> {this.getDebitTotalAmount()}</b>
                    </td>
                    <td style={{ width: "7%" }}>
                      <b> {this.getCreditTotalAmount()}</b>
                    </td>
                    <td style={{ width: "7%" }}></td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "49%", textAlign: "right" }}>
                      <b>Closing Balance:</b>
                    </td>
                    <td style={{ width: "7%" }}>
                      <b> {this.getClosingDrTotalAmount()}</b>
                    </td>
                    <td style={{ width: "7%" }}>
                      <b>{this.getClosingCrTotalAmount()}</b>
                    </td>
                    <td style={{ width: "7%" }}></td>
                  </tr>
                </thead>
              </Table>
            )}
          </div>
          {/* )} */}
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ userPermissions }) => {
  return { userPermissions };
};

const mapActionsToProps = (dispatch) => {
  return bindActionCreators(
    {
      setUserPermissions,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapActionsToProps)(LedgerDetails);
