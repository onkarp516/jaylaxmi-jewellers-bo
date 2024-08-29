import React, { Component } from "react";
import moment from "moment";
import {
  WithUserPermission,
  isActionExist,
  MyDatePicker,
  checkInvoiceDateIsBetweenFYFun,
  getSelectValue,
} from "@/helpers";
import Select from "react-select";
import {
  get_last_record_journal,
  get_ledger_list_by_company,
  update_journal,
  get_journal_by_id,
} from "@/services/api_function";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import LayoutCustom from "@/pages/layout/LayoutCustom";
import {
  Input,
  FormFeedback,
  Row,
  Col,
  Spinner,
  FormGroup,
  Label,
  Button,
  Card,
  CardBody,
  CardTitle,
  Table, // CardHeader,
} from "reactstrap";

const typeOpts = [
  { label: "Dr", value: "dr", type: "dr" },
  { label: "Cr", value: "cr", type: "cr" },
];

class JournalEdit extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.state = {
      isEditDataSet: false,
      ledgersLst: [],
      isLoading: false,
      show: false,
      invoice_data: "",
      amtledgershow: false,
      onaccountmodal: false,
      billadjusmentmodalshow: false,
      billadjusmentDebitmodalshow: false,
      bankledgershow: false,
      isDisabled: false,
      bankchequeshow: false,
      isAllCheckeddebit: false,
      sundryindirect: [],
      cashAcbankLst: [],
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      selectedBillsdebit: [],
      selectedBillsCredit: [],
      billLst: [],
      billLstSc: [],
      selectedBills: [],
      accountLst: [],
      invoiceedit: false,
      adjusmentbillmodal: false,
      createproductmodal: false,
      pendingordermodal: false,
      pendingorderprdctsmodalshow: false,
      productLst: [],
      unitLst: [],
      rows: [],
      serialnopopupwindow: false,

      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      taxcal: { igst: [], cgst: [], sgst: [] },
      isAllChecked: false,
      selectedProductDetails: [],
      selectedPendingOrder: [],
      purchasePendingOrderLst: [],
      selectedPendingChallan: [],
      initVal: {
        journal_sr_no: 1,
        journal_code: 1,
        transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
      },

      voucher_edit: false,
      voucher_data: {
        voucher_sr_no: 1,
        transaction_dt: moment().format("YYYY-MM-DD"),
        payment_dt: moment().format("YYYY-MM-DD"),
      },
      rows: [],
      sundryCreditorLst: [],
      cashAccLedgerLst: [],
      lstSundryCreditorsPayment: [],

      index: 0,
      crshow: false,
      onaccountcashaccmodal: false,
      bankaccmodal: false,
    };
  }

  get_last_record_journalFun = () => {
    get_last_record_journal()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { initVal } = this.state;
          initVal["journal_sr_no"] = res.journal_sr_no;
          initVal["journal_code"] = res.journal_code;
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleChangeArrayElement = (element, value, index) => {
    let debitBal = 0;
    let creditBal = 0;
    let { rows } = this.state;
    let debitamt = 0;
    let creditamt = 0;
    let frows = rows.map((v, i) => {
      if (v["type"] == "dr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["debit"]);
        if (v["debit"] != "" && !isNaN(v["debit"])) {
          debitBal = debitBal + parseFloat(v["debit"]);
        }
      } else if (v["type"] == "cr") {
        if (v["credit"] != "" && !isNaN(v["credit"]))
          creditBal = creditBal + parseFloat(v["credit"]);
      }
      if (i == index) {
        if (element == "debit") {
          v["paid_amt"] = value;
        } else if (element == "credit") {
          v["paid_amt"] = value;
        }
        v[element] = value;
        return v;
      } else {
        return v;
      }
    });

    let lastCrBal = debitBal - creditBal;

    if (element == "perticulars") {
      let obj = frows.find((v, i) => i == index);
      frows = rows.map((vi, ii) => {
        if (ii == index && vi.type == "cr") {
          vi["credit"] = lastCrBal;
        } else if (ii == index && vi.type == "dr") {
          vi["debit"] = lastCrBal;
        }
        return vi;
      });
    }

    this.setState({ rows: frows, index: index });
  };

  getTotalDebitAmt = () => {
    let { rows } = this.state;
    let debitamt = 0;
    rows.map((v) => {
      if (v.type.value == "dr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["debit"]);
      }
    });
    return isNaN(debitamt) ? 0 : debitamt;
  };

  getTotalCreditAmt = () => {
    let { rows } = this.state;
    let creditamt = 0;
    rows.map((v) => {
      if (v.type.value == "cr" && v["credit"] != "") {
        creditamt = parseFloat(creditamt) + parseFloat(v["credit"]);
      }
    });
    return isNaN(creditamt) ? 0 : creditamt;
  };

  lstgetledgerDetails = () => {
    get_ledger_list_by_company()
      .then((response) => {
        let res = response.data ? response.data : [];
        let resLst = [];
        if (res.responseStatus == 200) {
          if (res.list.length > 0) {
            resLst = res.list.map((v) => {
              let innerrow = {
                id: v.id,
                type: v.type,
                value: v.id,
                label: v.name,
              };
              return innerrow;
            });
          }
          console.log("resLst", resLst);
          this.setState({ ledgersLst: resLst });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  initRows = (len = 10) => {
    let { rows } = this.state;
    for (let index = 0; index < len; index++) {
      let innerrow = {
        type: "",
        perticulars: "",
        paid_amt: "",
        bank_payment_type: "",
        bank_payment_no: "",
        debit: "",
        credit: "",
        narration: "",
      };
      rows.push(innerrow);
    }
    this.setState({ rows: rows });
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    return elementCheck ? elementCheck[element] : "";
  };

  getElementObject = (index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    return elementCheck ? elementCheck : "";
  };

  handleClearPayment = (index) => {
    const { rows } = this.state;
    let frows = [...rows];
    let data = {
      type: "",
      paid_amt: "",
      perticulars: "",
      credit: "",
      debit: "",
      bank_payment_type: "",
      bank_payment_no: "",
    };
    frows[index] = data;
    this.setState({ rows: frows }, () => { });
  };

  getCurrentOpt = (index) => {
    let { rows, sundryCreditorLst, cashAcbankLst } = this.state;
    let currentObj = rows.find((v, i) => i == index);
    if (currentObj.type.value == "cr") {
      return sundryCreditorLst;
    } else if (currentObj.type.value == "dr") {
      return cashAcbankLst;
    }
    return [];
  };

  componentDidMount() {
    this.get_last_record_journalFun();
    this.lstgetledgerDetails();
    this.initRows();

    this.setState({ journalEditData: this.props.match.params.id });
  }

  componentDidUpdate() {
    const { isEditDataSet, journalEditData, ledgersLst } = this.state;
    console.log("contraEdit ", journalEditData);

    if (
      isEditDataSet == false
      // journalEditData != "" &&
      // ledgersLst.length > 0
      //   journalEditData.id != ""
    ) {
      this.setJournalEditData();
    }
  }

  setJournalEditData = () => {
    let formData = new FormData();
    formData.append("journal_id", this.state.journalEditData);
    get_journal_by_id(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { journal_details } = res;
          let { ledgersLst } = this.state;
          if (this.myRef.current) {
            this.myRef.current.setFieldValue(
              "journal_sr_no",
              res.journal_sr_no
            );
            this.myRef.current.setFieldValue("journal_id", res.journal_id);
            this.myRef.current.setFieldValue("journal_code", res.journal_code);
            this.myRef.current.setFieldValue(
              "transaction_dt",
              moment(res.tranx_date).format("DD-MM-YYYY")
            );
            this.myRef.current.setFieldValue("total_amt", res.total_amt);

            this.myRef.current.setFieldValue("narration", res.narrations);
          }

          let initRowData = [];
          if (journal_details.length > 0) {
            journal_details.map((v) => {
              let per = "";
              if (v.type != "") {
                per = getSelectValue(ledgersLst, v.ledger_id);
              }
              let inner_data = {
                details_id: v.details_id != 0 ? v.details_id : 0,
                type: v.type != null ? getSelectValue(typeOpts, v.type) : "",
                perticulars: per,
                // paid_amt: v.type == "cr" ? v.cr : v.dr,
                bank_payment_no:
                  v.paymentTranxNo != null ? v.paymentTranxNo : "",
                bank_payment_type:
                  v.bank_payment_type != null ? v.bank_payment_type : "",
                debit: v.type == "dr" ? v.paid_amt : "",
                credit: v.type == "cr" ? v.paid_amt : "",
                narration: "",
              };
              initRowData.push(inner_data);
            });
          }

          this.setState(
            {
              rows: initRowData,
              isEditDataSet: true,
            },
            () => {
              if (this.state.rows.length != 10) {
                this.initRows(10 - this.state.rows.length);
              }
            }
          );
        }
      })
      .catch((error) => { });
  };

  render() {
    const { isLoading, initVal, rows, ledgersLst, isEditDataSet } = this.state;

    return (
      <LayoutCustom>
        <div className="emp">
          <Card>
            <CardBody className="border-bottom p-2">
              {" "}
              <div>
                <Formik
                  validateOnBlur={false}
                  validateOnChange={false}
                  initialValues={initVal}
                  innerRef={this.myRef}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                    // receipt_sr_no: Yup.string()
                    //   .trim()
                    //   .required("Receipt  no is required"),
                    // transaction_dt: Yup.string().required(
                    //   "Transaction date is required"
                    // ),
                    // sundryindirectid: Yup.string().required().value,
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    // debugger
                    console.log("object")
                    console.log("values ----", values);
                    if (
                      this.getTotalDebitAmt() == this.getTotalCreditAmt() &&
                      this.getTotalCreditAmt() > 0 &&
                      this.getTotalDebitAmt() > 0
                    ) {
                      let requestData = new FormData();
                      this.setState({
                        invoice_data: values,
                      });

                      let frow = rows.filter((v) => v.type != "");
                      console.log("rows", JSON.stringify(frow));
                      console.log(rows);

                      frow = frow.map((v, i) => {
                        let perObj = {
                          id: v.perticulars.id,
                          type: v.perticulars.type,
                          label: v.perticulars.label,
                        };
                        if (v["debit"] != "" && v["type"]["value"] == "dr") {
                          v["paid_amt"] = v.debit;
                        } else if (
                          v["credit"] != "" &&
                          v["type"]["value"] == "cr"
                        ) {
                          v["paid_amt"] = v.credit;
                        }

                        return {
                          type: v.type,
                          details_id: v.details_id != "" ? v.details_id : 0,
                          paid_amt: v.paid_amt,
                          perticulars: perObj,
                        };
                      });
                      console.log("frow ---------", JSON.stringify(frow));

                    let formData = new FormData();

                    if (values.narration != null && values.narration != "")
                      formData.append("narration", values.narration);
                      formData.append("rows", JSON.stringify(frow));
                    formData.append(
                      "transaction_dt",
                      moment().format("YYYY-MM-DD")
                    );
                    formData.append("journal_sr_no", values.journal_sr_no);
                    formData.append("journal_id", values.journal_id);
                      let total_amt = this.getTotalDebitAmt();
                      formData.append("total_amt", total_amt);
                    formData.append("journal_code", values.journal_code);

                    update_journal(formData)
                      .then((response) => {
                        let res = response.data;

                        if (res.responseStatus == 200) {
                          this.props.history.push("/journal");
                          toast.success("✔", res.message);

                          setSubmitting(false);
                          resetForm();
                          this.initRows();
                        } else {
                          setSubmitting(false);
                          if (response.responseStatus == 401) {
                            toast.error("✘", response.message);
                          } else {
                            toast.error(
                              "Server Error! Please Check Your Connectivity"
                            );
                            console.log(
                              "Server Error! Please Check Your Connectivity"
                            );
                          }
                        }
                      })
                      .catch((error) => {
                        console.log("error", error);
                      });
                    }
                    else {
                      toast.error("Please Select check credit & debit Amount");
                    }
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
                    <Form onSubmit={handleSubmit}>
                      <div
                        className="institute-head p-2"
                        style={{
                          background: "#cee7f1",
                          padding: "10px",
                          paddingBottom: "0px",
                          marginBottom: "5px",
                        }}
                      >
                        <CardTitle>Edit Journal</CardTitle>
                        <Row>
                          <Col md="2">
                            <FormGroup>
                              <Label for="journal_sr_no">
                                Voucher Sr. No. :
                              </Label>
                              <Input
                                type="text"
                                name="journal_sr_no                              "
                                id="journal_sr_no"
                                onChange={handleChange}
                                value={values.journal_sr_no}
                                // isValid={
                                //   touched.receipt_sr_no && !errors.receipt_sr_no
                                // }
                                // isInvalid={!!errors.receipt_sr_no}
                                readOnly={true}
                              />
                              <span className="text-danger">
                                {errors.journal_sr_no}
                              </span>
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Label for="journal_code">Voucher No.:</Label>
                              <Input
                                type="text"
                                readOnly={true}
                                placeholder="1234"
                                name="journal_code"
                                id="journal_code"
                                value={values.journal_code}
                                className="tnx-pur-inv-text-box mb-0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Label for="transaction_dt">
                                Transaction Date :
                              </Label>
                              <MyDatePicker
                                innerRef={(input) => {
                                  this.invoiceDateRef.current = input;
                                }}
                                autoComplete="off"
                                readOnly={true}
                                className="datepic form-control"
                                name="transaction_dt"
                                placeholderText="dd/MM/yyyy"
                                id="transaction_dt"
                                dateFormat="dd/MM/yyyy"
                                // onChange={handleChange}
                                value={values.transaction_dt}
                                // selected={values.transaction_dt}
                                // maxDate={new Date()}
                                onChange={(e) => {
                                  console.log("e.target.value ", e);
                                  if (e != null && e != "") {
                                    console.log(
                                      "warn:: isValid",
                                      moment(e, "DD-MM-YYYY").isValid()
                                    );
                                    if (
                                      moment(e, "DD-MM-YYYY").isValid() == true
                                    ) {
                                      setFieldValue("transaction_dt", e);
                                      checkInvoiceDateIsBetweenFYFun(
                                        e,
                                        setFieldValue
                                      );
                                    }
                                  } else {
                                    this.invoiceDateRef.current.focus();
                                    setFieldValue("transaction_dt", "");
                                  }
                                }}
                              />
                              <span className="text-danger">
                                {errors.transaction_dt}
                              </span>
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                      <div
                        className="tbl-body-style-new"
                      // style={{ maxHeight: "67vh", height: "67vh" }}
                      >
                        <Table size="sm" className="tbl-font mt-2 mb-2">
                          <thead>
                            <tr>
                              <th style={{ width: "10%", textAlign: "center" }}>
                                Type
                              </th>
                              <th style={{ width: "70%", textAlign: "center" }}>
                                Particulars
                              </th>
                              <th style={{ width: "10%", textAlign: "center" }}>
                                Debit &nbsp;
                              </th>
                              <th
                                style={{ width: "10%", textAlign: "center" }}
                                className="pl-4"
                              >
                                Credit &nbsp;
                              </th>
                            </tr>
                          </thead>

                          <tbody style={{ borderTop: "2px solid transparent" }}>
                            {rows.length > 0 &&
                              rows.map((vi, ii) => {
                                return (
                                  <tr className="entryrow">
                                    <td
                                      style={{
                                        width: "10%",
                                      }}
                                    >
                                      <FormGroup>
                                        <Select
                                          //isClearable={true}
                                          required
                                          onChange={(v) => {
                                            this.handleChangeArrayElement(
                                              "type",
                                              v,
                                              ii
                                            );
                                          }}
                                          value={this.setElementValue(
                                            "type",
                                            ii
                                          )}
                                          placeholder="select type"
                                          options={typeOpts}
                                          name="type"
                                          id="type"
                                        ></Select>
                                      </FormGroup>
                                    </td>

                                    <td
                                      style={{
                                        width: "70%",
                                        background: "#f5f5f5",
                                      }}
                                    >
                                      <FormGroup>
                                        <Select
                                          className="selectTo"
                                          components={{
                                            DropdownIndicator: () => null,
                                            IndicatorSeparator: () => null,
                                          }}
                                          name="perticular"
                                          id="perticular"
                                          placeholder=""
                                          //isClearable
                                          options={ledgersLst}
                                          theme={(theme) => ({
                                            ...theme,
                                            height: "26px",
                                            borderRadius: "5px",
                                          })}
                                          onChange={(v, triggeredAction) => {
                                            console.log({ triggeredAction });
                                            console.log(
                                              "In a Particular On Change.!",
                                              v
                                            );
                                            if (v == null) {
                                              // Clear happened
                                              console.log("clear index=>", ii);
                                              this.handleClearPayment(ii);
                                            } else {
                                              this.handleChangeArrayElement(
                                                "perticulars",
                                                v,
                                                ii
                                              );
                                            }
                                          }}
                                          value={this.setElementValue(
                                            "perticulars",
                                            ii
                                          )}
                                        />
                                      </FormGroup>
                                    </td>

                                    <td
                                      style={{
                                        width: "10%",
                                      }}
                                    >
                                      <FormGroup>
                                        <Input
                                          id="debit"
                                          name="debit"
                                          type="text"
                                          onChange={(e) => {
                                            let v = e.target.value;
                                            this.handleChangeArrayElement(
                                              "debit",
                                              v,
                                              ii
                                            );
                                          }}
                                          style={{ textAlign: "center" }}
                                          value={this.setElementValue(
                                            "debit",
                                            ii
                                          )}
                                          readOnly={
                                            this.setElementValue("type", ii) &&
                                              this.setElementValue("type", ii)[
                                              "value"
                                              ] == "dr"
                                              ? false
                                              : true
                                          }
                                        />
                                      </FormGroup>
                                    </td>
                                    <td
                                      style={{
                                        width: "10%",
                                      }}
                                    >
                                      <FormGroup>
                                        <Input
                                          name="credit"
                                          id="credit"
                                          type="text"
                                          onChange={(e) => {
                                            let v = e.target.value;
                                            this.handleChangeArrayElement(
                                              "credit",
                                              v,
                                              ii
                                            );
                                          }}
                                          style={{ textAlign: "center" }}
                                          value={this.setElementValue(
                                            "credit",
                                            ii
                                          )}
                                          readOnly={
                                            this.setElementValue("type", ii) &&
                                              this.setElementValue("type", ii)[
                                              "value"
                                              ] == "cr"
                                              ? false
                                              : true
                                          }
                                        />
                                      </FormGroup>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                          <thead>
                            <tr style={{ background: "#DDE2ED" }}>
                              <td
                                className="pr-2 qtotalqty"
                                style={{ width: "10%" }}
                              >
                                {" "}
                                Total
                              </td>
                              <td style={{ width: "70%" }}></td>
                              <td
                                style={{
                                  width: "10 %",
                                }}
                              >
                                <FormGroup>
                                  <Input
                                    name="totaldebitamt"
                                    id="totaldebitamt"
                                    style={{
                                      textAlign: "center",
                                      // width: "8%",
                                      background: "transparent",
                                      border: "none",
                                    }}
                                    type="text"
                                    placeholder=""
                                    value={this.getTotalDebitAmt()}
                                    readOnly={true}
                                  />
                                </FormGroup>
                              </td>
                              <td style={{ width: "10%" }}>
                                {" "}
                                <FormGroup>
                                  <Input
                                    style={{
                                      textAlign: "center",
                                      //width: '8%',
                                      background: "transparent",
                                      border: "none",
                                    }}
                                    id="totalcreditamt"
                                    name="totalcreditamt"
                                    type="text"
                                    placeholder=""
                                    value={this.getTotalCreditAmt()}
                                    readOnly={true}
                                  />
                                </FormGroup>
                              </td>
                              {/* <td></td> */}
                            </tr>
                          </thead>
                        </Table>
                      </div>

                      <Row className="mb-2">
                        <Col sm={9}>
                          <Row className="mt-2">
                            <Col sm={1}>
                              <Label className="text-label">Narration:</Label>
                            </Col>
                            <Col sm={10}>
                              <FormGroup>
                                <Input
                                  type="textarea"
                                  placeholder="Enter Narration"
                                  style={{ height: "72px", resize: "none" }}
                                  className="text-box"
                                  id="narration"
                                  onChange={handleChange}
                                  // rows={5}
                                  // cols={25}
                                  name="narration"
                                  value={values.narration}
                                />
                              </FormGroup>
                              {/* <Form.Control
                              as="textarea"
                              resize="none"
                              placeholder="Enter Narration"
                              style={{ height: "72px" }}
                              className="text-box"
                              id="narration"
                              onChange={handleChange}
                              name="narration"
                              value={values.narration}
                            /> */}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="py-1">
                        <Col className="text-end">
                          <Button
                            type="submit"
                            className="successbtn-style me-2"
                          >
                            Update
                          </Button>

                          <Button
                            className="cancel-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              this.props.history.push("/journal");
                            }}
                          >
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </LayoutCustom>
    );
  }
}

export default WithUserPermission(JournalEdit);
