import React, { Component, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom";
import moment from "moment";
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
import {
  WithUserPermission,
  isActionExist,
  MyDatePicker,
  checkInvoiceDateIsBetweenFYFun,
  getSelectValue,
} from "@/helpers";
import Select from "react-select";
import {
  AuthenticationCheck,
  getPOPendingOrderWithIds,
  getReceiptLastRecords,
  getSundryDebtorsIndirectIncome,
  getdebtorspendingbills,
  getCashACBankAccountDetails,
  get_receipt_by_id,
  update_receipt,
} from "@/services/api_function";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

const typeOpts = [
  { label: "Dr", value: "dr", type: "dr" },
  { label: "Cr", value: "cr", type: "cr" },
];
const BankOpt = [
  { label: "Cheque / DD", value: "cheque-dd" },
  { label: "NEFT", value: "neft" },
  { label: "IMPS", value: "imps" },
  { label: "UPI", value: "upi" },
  { label: "Others", value: "others" },
];

class ReceiptEdit extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.state = {
      show: false,
      invoice_data: "",
      receiptEditData: "",
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
      isEditDataSet: false,
      initVal: {
        receipt_sr_no: 1,
        receipt_code: "",
        transaction_dt: "",
        po_sr_no: 1,
        sundryindirectid: "",
        id: "",
        type: "",
        balancing_method: "",
        amount: "",
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
  // const { i, productLst, setFieldValue, isDisabled } = props;
  handleClose = () => {
    this.setState({ show: false });
  };
  getElementObject = (index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    console.log("elementCheck", elementCheck);
    return elementCheck ? elementCheck : "";
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
      //   if (index == 0) {
      //     // innerrow["type"] = "cr";
      //     innerrow["type"] = getSelectValue(typeOpts, "cr");
      //   }
      rows.push(innerrow);
    }
    this.setState({ rows: rows });
  };

  setElementValue = (element, index) => {
    debugger
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
  getPayableAmt = (index, type) => {
    // return i == index;
    let elementCheck;
    let res = 0;
    if (elementCheck) {
      if (elementCheck["type"] == type) {
        res = elementCheck
          ? elementCheck["paid_amt"]
            ? elementCheck["paid_amt"]
            : 0
          : 0;
      }
    }
    console.log({ res });
    return res;
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
    this.setState({ rows: frows }, () => {});
  };

  setreceiptlastrecords = () => {
    getReceiptLastRecords()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;
          //initVal['payment_sr_no'] = res.count;
          initVal["receipt_sr_no"] = res.receipt_sr_no;
          initVal["receipt_code"] = res.receipt_code;

          console.log({ initVal });
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstgetsundrydebtors_indirectexpenses = () => {
    getSundryDebtorsIndirectIncome()
      .then((response) => {
        console.log("response", response);
        let res = response.data ? response.data : [];
        let resLst = [];

        if (res.responseStatus == 200) {
          if (res.list.length > 0) {
            res.list.map((v) => {
              let innerrow = {
                id: v.id,
                //ledger_id: v.ledger_id,
                type: v.type,
                ledger_name: v.ledger_name,
                balancing_method: v.balancing_method,
                value: v.id,
                label: v.ledger_name,
              };
              resLst.push(innerrow);
            });
          }
          this.setState({ sundryCreditorLst: resLst });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  lstgetcashAcbankaccount = () => {
    getCashACBankAccountDetails()
      .then((response) => {
        let res = response.data ? response.data : [];
        let resLst = [];

        if (res.responseStatus == 200) {
          if (res.list.length > 0) {
            res.list.map((v) => {
              let innerrow = {
                id: v.id,
                type: v.type,
                value: v.id,
                label: v.name,
                billids: [],
              };
              resLst.push(innerrow);
            });
          }
          this.setState({ cashAcbankLst: resLst });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  getCurrentOpt = (index) => {
    let { rows, sundryCreditorLst, cashAcbankLst } = this.state;

    // console.log({ sundryCreditorLst });
    // console.log({ cashAcbankLst });
    let currentObj = rows.find((v, i) => i == index);
    // console.log("currentObject", currentObj);
    if (currentObj.type.value == "cr") {
      return sundryCreditorLst;
    } else if (currentObj.type.value == "dr") {
      return cashAcbankLst;
    }
    return [];
  };

  setReceiptEditData = () => {
    // const { id } = this.state.receiptEditData;
    // console.log("receivedId", id);
    // console.log("ID", this.state.receiptEditData);
    let formData = new FormData();
    console.log("id of receipt edit", this.state.receiptEditData);
    formData.append("receiptId", this.state.receiptEditData);
    get_receipt_by_id(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { perticulars } = res;
          const {
            purchaseAccLst,
            supplierNameLst,
            supplierCodeLst,
            lstAdditionalLedger,
            lstDisLedger,
            receiptEditData,
            sundryCreditorLst,
            cashAcbankLst,
          } = this.state;
          this.myRef.current.setFieldValue("receiptId", res.receiptId);
          this.myRef.current.setFieldValue("receipt_sr_no", res.receipt_sr_no);

          this.myRef.current.setFieldValue("receipt_code", res.receipt_no);
          this.myRef.current.setFieldValue(
            "transaction_dt",
            moment(res.tranx_date).format("DD-MM-YYYY")
          );
          this.myRef.current.setFieldValue("total_amt", res.total_amt);

          this.myRef.current.setFieldValue("narration", res.narrations);

          // let initInvoiceData = {
          //   type: perticulars.type,
          //   ledger_type: perticulars.ledger_type,
          //   ledger_name: perticulars.ledger_name,
          //   paid_amt: perticulars.paid_amt,
          //   bank_payment_no: perticulars.bank_payment_no,
          //   bank_payment_type: perticulars.bank_payment_type,
          // };

          console.log("receipt_peritculars", perticulars);
          let initRowData = [];

          if (perticulars.length > 0) {
            perticulars.map((v) => {
              console.log("==='''vvvv", v.type);
              let per = "";
              if (v.type == "cr") {
                per = getSelectValue(sundryCreditorLst, v.ledger_id);
              }
              if (v.type == "dr") {
                per = getSelectValue(cashAcbankLst, v.ledger_id);
              }
              console.log("per", per);

              let inner_data = {
                details_id: v.details_id != 0 ? v.details_id : 0,
                type: v.type != null ? getSelectValue(typeOpts, v.type) : "",
                perticulars: per,
                paid_amt: v.type == "cr" ? v.cr : v.dr,
                bank_payment_no:
                  v.paymentTranxNo != null ? v.paymentTranxNo : "",
                bank_payment_type:
                  v.bank_payment_type != null ? v.bank_payment_type : "",
                debit: v.type == "cr" ? v.cr : "",
                credit: v.type == "dr" ? v.dr : "",
                narration: "",
              };
              // let innerrow = {
              //   type: "",
              //   perticulars: "",
              //   paid_amt: "",
              //   bank_payment_type: "",
              //   bank_payment_no: "",
              //   debit: "",
              //   credit: "",
              //   narration: "",
              // };
              initRowData.push(inner_data);
            });
          }
          console.log("Edit Row ==>", initRowData);

          this.setState(
            {
              rows: initRowData,
              isEditDataSet: true,
            },
            () => {
              const { rows } = this.state;
              console.log("rows in edit data", rows);
              if (this.state.rows.length != 10) {
                this.initRows(10 - this.state.rows.length);
              }
            }
          );
        }
      })
      .catch((error) => {});
  };

  handleBillselection = (id, index, status) => {
    let { billLst, selectedBills } = this.state;
    // console.log({ id, index, status });
    let f_selectedBills = selectedBills;
    let f_billLst = billLst;
    if (status == true) {
      if (selectedBills.length > 0) {
        if (!selectedBills.includes(id)) {
          f_selectedBills = [...f_selectedBills, id];
        }
      } else {
        f_selectedBills = [...f_selectedBills, id];
      }
    } else {
      f_selectedBills = f_selectedBills.filter((v, i) => v != id);
    }
    f_billLst = f_billLst.map((v, i) => {
      if (v.source == "sales_invoice") {
        if (f_selectedBills.includes(v.invoice_no)) {
          v["paid_amt"] = parseFloat(v.amount);
          v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);
        } else {
          v["paid_amt"] = 0;
          v["remaining_amt"] = parseFloat(v.amount);
        }
      }

      return v;
    });

    this.setState({
      isAllChecked: f_billLst.length == f_selectedBills.length ? true : false,
      selectedBills: f_selectedBills,
      billLst: f_billLst,
    });
  };
  handleBillselectionCredit = (id, index, status) => {
    let { billLst, selectedBillsCredit } = this.state;
    // console.log({ id, index, status });
    let f_selectedBills = selectedBillsCredit;
    let f_billLst = billLst;
    if (status == true) {
      if (selectedBillsCredit.length > 0) {
        if (!selectedBillsCredit.includes(id)) {
          f_selectedBills = [...f_selectedBills, id];
        }
      } else {
        f_selectedBills = [...f_selectedBills, id];
      }
    } else {
      f_selectedBills = f_selectedBills.filter((v, i) => v != id);
    }
    f_billLst = f_billLst.map((v, i) => {
      if (v.source == "credit_note") {
        if (f_selectedBills.includes(v.credit_note_no)) {
          v["credit_paid_amt"] = parseFloat(v.Total_amt);
          v["credit_remaining_amt"] =
            parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);
        } else {
          v["credit_paid_amt"] = 0;
          v["credit_remaining_amt"] = parseFloat(v.Total_amt);
        }
      }

      return v;
    });

    this.setState({
      isAllCheckeddebit:
        f_billLst.length == f_selectedBills.length ? true : false,
      selectedBillsCredit: f_selectedBills,
      billLst: f_billLst,
    });
  };

  handleBillsSelectionAllCredit = (status) => {
    // ;
    let { billLst } = this.state;
    console.log({ billLst });
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.debit_note_no);
      console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        v["credit_paid_amt"] = parseFloat(v.Total_amt);
        v["credit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);

        return v;

        return v;
      });

      console.log("fBills", fBills);
    } else {
      fBills = billLst.map((v) => {
        if (v.source == "credit_note") {
          v["credit_paid_amt"] = 0;
          v["credit_remaining_amt"] = parseFloat(v.Total_amt);
          return v;
        }

        // return v;
      });
    }
    this.setState({
      isAllCheckeddebit: status,
      selectedBillsCredit: lstSelected,
      billLst: fBills,
    });
  };

  handleBillselectionDebit = (id, index, status) => {
    let { billLstSc, selectedBillsdebit } = this.state;
    console.log({ id, index, status });
    let f_selectedBills = selectedBillsdebit;
    let f_billLst = billLstSc;
    if (status == true) {
      if (selectedBillsdebit.length > 0) {
        console.log("selectedBillsdebit", selectedBillsdebit);
        if (!selectedBillsdebit.includes(id)) {
          f_selectedBills = [...f_selectedBills, id];
        }
      } else {
        f_selectedBills = [...f_selectedBills, id];
      }
    } else {
      f_selectedBills = f_selectedBills.filter((v, i) => v != id);
    }
    f_billLst = f_billLst.map((v, i) => {
      if (f_selectedBills.includes(v.debit_note_no)) {
        v["debit_paid_amt"] = parseFloat(v.Total_amt);
        v["debit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);
      } else {
        v["debit_paid_amt"] = 0;
        v["debit_remaining_amt"] = parseFloat(v.Total_amt);
      }

      return v;
    });

    this.setState({
      isAllCheckeddebit:
        f_billLst.length == f_selectedBills.length ? true : false,
      selectedBillsdebit: f_selectedBills,
      billLstSc: f_billLst,
    });
  };

  handleBillsSelectionAllDebit = (status) => {
    let { billLstSc } = this.state;
    let fBills = billLstSc;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLstSc.map((v) => v.debit_note_no);
      console.log("All BillLst Selection", billLstSc);
      fBills = billLstSc.map((v) => {
        if (v.source === "debit_note") {
          v["debit_paid_amt"] = parseFloat(v.Total_amt);
          v["debit_remaining_amt"] =
            parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);

          return v;
        }

        return v;
      });

      console.log("fBills", fBills);
    } else {
      fBills = billLstSc.map((v) => {
        v["debit_paid_amt"] = 0;
        v["debit_remaining_amt"] = parseFloat(v.Total_amt);
        return v;

        // return v;
      });
    }
    this.setState({
      isAllCheckeddebit: status,
      selectedBillsDebit: lstSelected,
      billLstSc: fBills,
    });
  };

  finalBillAmt = () => {
    const { billLst, billLstSc } = this.state;
    console.log({ billLst, billLstSc });

    let paidAmount = 0;
    billLst.map((next) => {
      if ("paid_amt" in next) {
        paidAmount = paidAmount + parseFloat(next.paid_amt ? next.paid_amt : 0);
      }
    });

    let creditPaidAmount = 0;
    billLst.map((next) => {
      if ("credit_paid_amt" in next) {
        creditPaidAmount =
          creditPaidAmount +
          parseFloat(next.credit_paid_amt ? next.credit_paid_amt : 0);
      }
    });

    // console.log({ paidAmount, creditPaidAmount, debitPaidAmount });

    if (paidAmount >= creditPaidAmount) {
      let amt = paidAmount - creditPaidAmount;
      return amt;
      // billLst.map((v, i) => {
      //   v['paid_amt'] = paidAmount - debitPaidAmount;
      //   return v;
      // });
      // this.handleChangeArrayElement(amt);
    } else {
      return "Go To Payment";
    }
  };

  FetchPendingBills = (id, type, balancing_method) => {
    console.log("balancing_method", balancing_method);
    let reqData = new FormData();
    reqData.append("ledger_id", id);
    reqData.append("type", type);
    reqData.append("balancing_method", balancing_method);
    getdebtorspendingbills(reqData)
      .then((response) => {
        let res = response.data;
        console.log("Res Bill List ", res);
        if (res.responseStatus == 200) {
          let data = res.list;
          console.log("data", data);
          if (data.length > 0) {
            if (balancing_method === "bill-by-bill" && type === "SD") {
              //console.log('OPT', opt);
              this.setState({ billLst: data, billadjusmentmodalshow: true });
            } else if (balancing_method === "bill-by-bill" && type === "SC") {
              this.setState({
                billLstSc: data,
                billadjusmentDebitmodalshow: true,
              });
            } else if (balancing_method === "on-account") {
              this.setState({
                billLst: data,
                onaccountmodal: true,
              });
            }
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ billLst: [] });
      });
  };

  lstPOPendingOrder = (values) => {
    const { invoice_data } = this.state;
    let { supplierCodeId } = invoice_data;

    let reqData = new FormData();
    reqData.append(
      "supplier_code_id",
      supplierCodeId ? supplierCodeId.value : ""
    );
    getPOPendingOrderWithIds(reqData)
      .then((response) => {
        console.log("Pending Order Response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ purchasePendingOrderLst: res.data });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ purchasePendingOrderLst: [] });
      });
  };

  handlePendingOrderSelection = (id, status) => {
    let { selectedPendingOrder } = this.state;
    if (status == true) {
      if (!selectedPendingOrder.includes(id)) {
        selectedPendingOrder = [...selectedPendingOrder, id];
      }
    } else {
      selectedPendingOrder = selectedPendingOrder.filter((v) => v != id);
    }
    this.setState({
      selectedPendingOrder: selectedPendingOrder,
    });
  };
  handleOnAccountSubmit = (v) => {
    let { index, rows } = this.state;

    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        v["debit"] = v.paid_amt;
        console.log(" on account v", v);
        return v;
      } else {
        return vi;
      }
    });

    this.setState(
      {
        rows: frow,
      },
      () => {
        this.setState({ onaccountmodal: false, index: -1 });
      }
    );
  };
  handleBillByBillDebitSubmit = (v) => {
    let { index, rows, billLstSc } = this.state;

    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        console.log("vi", vi);
        console.log("v", v);

        v["perticulars"]["billids"] = billLstSc;

        v["debit_paid_amt"] = billLstSc.reduce(function (prev, next) {
          return (
            parseFloat(prev) +
            parseFloat(next.debit_paid_amt ? next.debit_paid_amt : 0)
          );
        }, 0);

        let total = v["debit_paid_amt"] != null ? v["debit_paid_amt"] : 0;

        v["debit"] = total;

        v["paid_amt"] = total;
        return v;
      } else {
        return vi;
      }
    });

    this.setState(
      {
        rows: frow,
        billLstSc: [],
      },
      () => {
        this.setState({ billadjusmentDebitmodalshow: false, index: -1 });
      }
    );
  };
  handleBillByBillSubmit = (v) => {
    let { index, rows, billLst } = this.state;

    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        console.log("vi", vi);
        console.log("v", v);

        v["perticulars"]["billids"] = billLst;
        v["paid_amt"] = billLst.reduce(function (prev, next) {
          return (
            parseFloat(prev) + parseFloat(next.paid_amt ? next.paid_amt : 0)
          );
        }, 0);

        v["credit_paid_amt"] = billLst.reduce(function (prev, next) {
          return (
            parseFloat(prev) +
            parseFloat(next.credit_paid_amt ? next.credit_paid_amt : 0)
          );
        }, 0);

        let total =
          v["paid_amt"] -
          (v["credit_paid_amt"] != null ? v["credit_paid_amt"] : 0);

        v["debit"] = total;

        v["paid_amt"] = total;
        return v;
      } else {
        return vi;
      }
    });

    this.setState(
      {
        rows: frow,
        billLst: [],
      },
      () => {
        this.setState({ billadjusmentmodalshow: false, index: -1 });
      }
    );
  };
  handleBillsSelectionAll = (status) => {
    let { billLst } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.id);
      fBills = billLst.map((v) => {
        v["paid_amt"] = parseFloat(v.amount);
        v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(v.amount);

        return v;
      });

      console.log("lst", lstSelected);
    } else {
      fBills = billLst.map((v) => {
        v["paid_amt"] = parseFloat(0);
        v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(0);

        return v;
      });

      console.log("lst", lstSelected);
    }
    this.setState({
      isAllChecked: status,
      selectedBills: lstSelected,
      billLst: fBills,
    });
  };

  componentDidMount() {
    // if (AuthenticationCheck()) {
    this.setreceiptlastrecords();
    this.lstgetsundrydebtors_indirectexpenses();
    this.lstgetcashAcbankaccount();
    this.initRows();
    console.log("params", this.props.match.params.id);
    this.setState({ receiptEditData: this.props.match.params.id });
    // }
  }

  componentDidUpdate() {
    const { isEditDataSet, receiptEditData, cashAcbankLst, sundryCreditorLst } =
      this.state;
    console.log("receiptEditData", receiptEditData);

    if (
      typeOpts.length > 0 &&
      isEditDataSet == false &&
      receiptEditData != "" &&
      cashAcbankLst.length > 0 &&
      sundryCreditorLst.length > 0 &&
      receiptEditData.id != ""
    ) {
      this.setReceiptEditData();
    }
  }

  /**
   *
   * @param {*} element
   * @param {*} value
   * @param {*} index
   * @param {*} setFieldValue
   * @description on change of each element in row function will recalculate amt
   */

  handleChangeArrayElement = (element, value, index) => {
    let debitBal = 0;
    let creditBal = 0;
    console.log({ element, value, index });
    let { rows } = this.state;
    console.log("rows>>>>", rows);
    let debitamt = 0;
    let creditamt = 0;
    let frows = rows.map((v, i) => {
      //   console.log("v-type => ", v["type"]);
      //   console.log("i => ", { v, i });
      if (v["type"]["value"] == "cr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
        // bal = parseFloat(bal);
        if (v["paid_amt"] != "")
          debitBal = debitBal + parseFloat(v["paid_amt"]);
        // console.log('bal', bal);
      } else if (v["type"]["value"] == "dr") {
        if (v["credit"] != "" && !isNaN(v["credit"]))
          creditBal = creditBal + parseFloat(v["credit"]);
      }
      if (i == index) {
        if (element == "debit") {
          v["paid_amt"] = value;
          console.log("Dr value", value);
        } else if (element == "credit") {
          v["paid_amt"] = value;
          console.log("cr value", value);
        }
        v[element] = value;
        return v;
      } else {
        return v;
      }
    });

    console.log("debitBal, creditBal ", { debitBal, creditBal });
    let lastCrBal = debitBal - creditBal;
    console.log("lastCrBal ", lastCrBal);

    console.log("frows", { frows });

    if (element == "perticulars") {
      let obj = frows.find((v, i) => i == index);
      if (obj.type.value == "cr") {
        // this.FetchPendingBills(
        //   obj.perticulars.id,
        //   obj.perticulars.type,
        //   obj.perticulars.balancing_method
        // );
      } else if (obj.type.value == "dr") {
        console.log("obj", obj);
        frows = rows.map((vi, ii) => {
          if (ii == index) {
            // (lastCrBal = lastCrBal - vi['paid_amt']),
            vi["credit"] = lastCrBal;
            console.log("vi", vi);
          }
          return vi;
        });
        if (obj.perticulars.type == "others") {
        } else if (obj.perticulars.type == "bank_account") {
          this.setState({ bankaccmodal: true });
        }
      }
    }
    console.log("frows", { frows });

    this.setState({ rows: frows, index: index });
  };

  handleUnitLstOpt = (productId) => {
    // console.log("productId", productId);
    if (productId != undefined && productId) {
      return productId.unitOpt;
    }
  };
  handleUnitLstOptLength = (productId) => {
    // console.log("productId", productId);
    if (productId != undefined && productId) {
      return productId.unitOpt.length;
    }
  };
  handleSerialNoQty = (element, index) => {
    let { rows } = this.state;
    console.log("serial no", rows);
    console.log({ element, index });
    // this.setState({ serialnopopupwindow: true });
  };

  handleSerialNoValue = (index, value) => {
    let { serialnoarray } = this.state;
    let fn = serialnoarray.map((v, i) => {
      if (i == index) {
        v["no"] = value;
      }
      return v;
    });

    this.setState({ serialnoarray: fn });
  };

  handeladjusmentbillmodal = (status) => {
    this.setState({ adjusmentbillmodal: status });
  };

  // New code

  handleElementClick = (index) => {
    let type = this.setElementValue("type", index);
    if (type == "dr") {
      // this.setState({ show: true, index: index });
      this.setState({ index: index });
    } else if (type == "cr") {
      // this.setState({ crshow: true, index: index });
      this.setState({ index: index });
    }
  };
  handleOnAccountSubmit = (v) => {
    let { index, rows } = this.state;

    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        v["debit"] = v.paid_amt;
        console.log("On account -->", v);
        return v;
      } else {
        return vi;
      }
    });

    this.setState(
      {
        rows: frow,
      },
      () => {
        this.setState({ onaccountmodal: false, index: -1 });
      }
    );
  };

  handleOnAccountCashAccSubmit = (v) => {
    let { index, rows } = this.state;
    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        return v;
      } else {
        return vi;
      }
    });
    // debit;
    this.setState(
      {
        rows: frow,
      },
      () => {
        this.setState({ onaccountcashaccmodal: false, index: -1 });
      }
    );
  };

  handleBankAccountCashAccSubmit = (v) => {
    let { index, rows } = this.state;
    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        v["credit"] = v["credit"];
        // v['credit'] = v['paid_amt'];

        return v;
      } else {
        return vi;
      }
    });
    this.setState(
      {
        rows: frow,
      },
      () => {
        this.setState({ bankaccmodal: false, index: -1 });
      }
    );
  };

  handleBillPayableAmtChange = (value, index) => {
    console.log({ value, index });
    const { billLst, billLstSc } = this.state;
    let fBilllst = billLst.map((v, i) => {
      // console.log('v', v);
      // console.log('payable_amt', v['payable_amt']);
      if (i == index && v.source == "sales_invoice") {
        v["paid_amt"] = parseFloat(value);
        v["remaining_amt"] = parseFloat(v["amount"]) - parseFloat(value);
      } else if (i == index && v.source == "credit_note") {
        v["credit_paid_amt"] = parseFloat(value);
        v["credit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(value);
      }
      return v;
    });
    let fDBilllst = billLstSc.map((v, i) => {
      // console.log('v', v);
      // console.log('payable_amt', v['payable_amt']);
      if (i == index && v.source == "debit_note") {
        v["debit_paid_amt"] = parseFloat(value);
        v["debit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(value);
      }
      return v;
    });

    this.setState({ billLst: fBilllst });
    this.setState({ billLstSc: fDBilllst });
  };

  getTotalDebitAmt = () => {
    let { rows } = this.state;
    let debitamt = 0;
    rows.map((v) => {
      if (v.type.value == "cr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
      }
    });
    return isNaN(debitamt) ? 0 : debitamt;
  };
  getTotalCreditAmt = () => {
    let { rows } = this.state;
    // console.log("Total Credit ", rows);
    let creditamt = 0;
    rows.map((v) => {
      if (v.type.value == "dr") {
        creditamt = parseFloat(creditamt) + parseFloat(v["credit"]);
      }
    });
    return isNaN(creditamt) ? 0 : creditamt;
  };

  render() {
    const {
      invoice_data,
      invoiceedit,
      createproductmodal,
      adjusmentbillmodal,
      billadjusmentmodalshow,
      billadjusmentDebitmodalshow,
      bankledgershow,
      bankchequeshow,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      rows,
      amtledgershow,
      selectedBills,
      onaccountmodal,
      productLst,
      serialnopopupwindow,
      pendingordermodal,
      pendingorderprdctsmodalshow,
      additionchargesyes,
      lstDisLedger,
      additionalCharges,
      lstAdditionalLedger,
      additionalChargesTotal,
      taxcal,
      purchasePendingOrderLst,
      isAllChecked,
      selectedPendingOrder,
      initVal,
      sundryindirect,
      billLst,
      cashAcbankLst,
      accountLst,
      isAllCheckeddebit,
      voucher_data,
      voucher_edit,
      sundryCreditorLst,
      show,
      crshow,
      cashAccLedgerLst,
      onaccountcashaccmodal,
      bankaccmodal,
      isDisabled,
      selectedBillsdebit,
      selectedBillsCredit,
      billLstSc,
      isEditDataSet,
    } = this.state;
    console.log("rows", rows);

    return (
      <LayoutCustom>
        <div className="emp">
          <Card>
            <CardBody className="border-bottom p-2">
              <CardTitle>Edit Receipt</CardTitle>

              <div>
                {/* {JSON.stringify(initVal)} */}
                <Formik
                  validateOnBlur={false}
                  validateOnChange={false}
                  innerRef={this.myRef}
                  initialValues={initVal}
                  validationSchema={Yup.object().shape({
                    receipt_sr_no: Yup.string()
                      .trim()
                      .required("Receipt  no is required"),
                    transaction_dt: Yup.string().required(
                      "Transaction date is required"
                    ),
                    sundryindirectid: Yup.string().required().value,
                  })}
                  onSubmit={(
                    values,
                    { resetForm, setStatus, setSubmitting }
                  ) => {
                    this.setState({
                      isLoading: true,
                    });
                    setStatus();
                    if (
                      this.getTotalDebitAmt() == this.getTotalCreditAmt() &&
                      this.getTotalCreditAmt() > 0 &&
                      this.getTotalDebitAmt() > 0
                    ) {
                      let requestData = new FormData();
                      this.setState({
                        invoice_data: values,
                      });
                      let filterRow = rows.filter((v) => {
                        if (v.bank_payment_type != "") {
                          v.bank_payment_type = v.bank_payment_type.value;
                        }
                        return v;
                      });
                      // if (creditamt == debitamt) {
                      let frow = filterRow.filter((v) => v.type != "");
                      let formData = new FormData();

                      frow = frow.map((v, i) => {
                        if (
                          v.perticulars &&
                          v.perticulars.balancing_method == "bill-by-bill"
                        ) {
                          let billRow =
                            v.perticulars &&
                            v.perticulars.billids &&
                            v.perticulars.billids.map((vi, ii) => {
                              if ("paid_amt" in vi && vi["paid_amt"] > 0) {
                                return vi;
                              }
                              if (
                                "credit_paid_amt" in vi &&
                                vi["credit_paid_amt"] > 0
                              ) {
                                // return vi;
                                return {
                                  invoice_id: vi.credit_note_id,
                                  amount: vi.Total_amt,

                                  invoice_date: moment(
                                    vi.credit_note_date
                                  ).format("YYYY-MM-DD"),
                                  invoice_no: vi.credit_note_no,
                                  source: vi.source,
                                  paid_amt: vi.credit_paid_amt,
                                  remaining_amt: vi.credit_remaining_amt,
                                };
                              }
                              if (
                                "debit_paid_amt" in vi &&
                                vi["debit_paid_amt"] > 0
                              ) {
                                // return vi;
                                return {
                                  invoice_id: vi.debit_note_id,
                                  amount: vi.Total_amt,
                                  // details_id: v.details_id != "" ? v.details_id : 0,
                                  invoice_date: moment(
                                    vi.debit_note_date
                                  ).format("YYYY-MM-DD"),
                                  invoice_no: vi.debit_note_no,
                                  source: vi.source,
                                  paid_amt: vi.debit_paid_amt,
                                  remaining_amt: vi.debit_remaining_amt,
                                };
                              }
                            });

                          // console.log("billrow >>>>>>", billRow);
                          // billRow = billRow.filter((v) => v != undefined);
                          // console.log("billrow >>>>>>", billRow);

                          let perObj = {
                            id: v.perticulars.id,
                            type: v.perticulars.type,
                            ledger_name: v.perticulars.ledger_name,
                            balancing_method: v.perticulars.balancing_method,
                            // billids: billRow,
                          };
                          return {
                            type: v.type,
                            paid_amt: v.paid_amt,
                            details_id: v.details_id != "" ? v.details_id : 0,

                            perticulars: perObj,
                          };
                        } else if (
                          v.perticulars &&
                          v.perticulars.balancing_method == "on-account"
                        ) {
                          let perObj = {
                            id: v.perticulars.id,
                            type: v.perticulars.type,
                            ledger_name: v.perticulars.ledger_name,
                            balancing_method: v.perticulars.balancing_method,
                          };
                          return {
                            type: v.type,
                            paid_amt: v.paid_amt,
                            details_id: v.details_id != "" ? v.details_id : 0,
                            perticulars: perObj,
                          };
                        } else {
                          let perObj = {
                            id: v.perticulars.id,
                            type: v.perticulars.type,
                            ledger_name: v.perticulars.label,
                          };
                          return {
                            type: v.type,
                            paid_amt: v.credit,
                            details_id: v.details_id != "" ? v.details_id : 0,
                            bank_payment_type: v.bank_payment_type,
                            bank_payment_no: v.bank_payment_no,
                            perticulars: perObj,
                          };
                        }
                      });
                      console.log("frow ---------", frow);

                      // var filtered = frow.filter(function (el) {
                      //   return el != null;
                      // });
                      formData.append("row", JSON.stringify(frow));

                      // formData.append('rows', JSON.stringify(frow));
                      // console.log("rows", rows);
                      formData.append(
                        "transaction_dt",
                        moment(values.transaction_dt).format("YYYY-MM-DD")
                      );
                      formData.append("receiptId", values.receiptId);

                      formData.append("receipt_sr_no", values.receipt_sr_no);
                      formData.append("receipt_code", values.receipt_code);
                      let total_amt = this.getTotalDebitAmt();
                      formData.append("total_amt", total_amt);

                      if (values.narration != null) {
                        formData.append("narration", values.narration);
                      }
                      console.log("Form Date ", formData);
                      for (var pair of formData.entries()) {
                        console.log(pair[0] + ", " + pair[1]);
                      }

                      update_receipt(formData)
                        .then((response) => {
                          console.log("response", response);
                          let res = response.data;
                          if (res.responseStatus == 200) {
                            // toast.success("✔ " + "res.message");
                            toast.success("✔ " + res.message)
                            setSubmitting(false);


                            resetForm();
                            this.initRows();
                            this.props.history.push("/receipt");

                          } else {
                            setSubmitting(false);
                            toast.error("✘ " + res.message);
                          }
                        })
                        .catch((error) => {
                          console.log("error", error);
                        });
                    } else {
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
                      <div className="institute-head p-2">
                        <Row>
                          <Col md="2">
                            <FormGroup>
                              <Label for="exampleDatetime">
                                Voucher Sr. No. :
                              </Label>
                              <Input
                                type="text"
                                name="receipt_sr_no"
                                id="receipt_sr_no"
                                onChange={handleChange}
                                value={values.receipt_sr_no}
                                // isValid={
                                //   touched.receipt_sr_no && !errors.receipt_sr_no
                                // }
                                // isInvalid={!!errors.receipt_sr_no}
                                readOnly={true}
                              />
                              <span className="text-danger">
                                {errors.receipt_sr_no}
                              </span>
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Label for="exampleDatetime">Voucher No.:</Label>
                              <Input
                                type="text"
                                readOnly={true}
                                placeholder="1234"
                                value={values.receipt_code}
                                className="tnx-pur-inv-text-box mb-0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Label for="exampleDatetime">
                                Transaction Date :
                              </Label>
                              <MyDatePicker
                                autoComplete="off"
                                className="datepic form-control"
                                name="transaction_dt"
                                placeholderText="dd/MM/yyyy"
                                id="transaction_dt"
                                dateFormat="dd/MM/yyyy"
                                // onChange={handleChange}
                                value={values.transaction_dt}
                                //   selected={values.transaction_dt}
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
                                Credit &nbsp;
                              </th>
                              <th
                                style={{ width: "10%", textAlign: "center" }}
                                className="pl-4"
                              >
                                Debit &nbsp;
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
                                          placeholder=""
                                          //isClearable
                                          options={this.getCurrentOpt(ii)}
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
                                            ] == "cr"
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
                                            ] == "dr"
                                              ? false
                                              : true
                                          }
                                        />
                                      </FormGroup>
                                    </td>
                                  </tr>
                                );
                              })}
                            <tr className="entryrow">
                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Select
                                    placeholder="select type"
                                    // options={typeOpts}
                                  />
                                </FormGroup>
                              </td>
                              <td
                                style={{
                                  width: "70%",
                                  background: "#f5f5f5",
                                }}
                              >
                                {/* <Select
                            placeholder=""
                            styles={customStyles1}
                            //isClearable
                          /> */}
                              </td>

                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Input
                                    type="text"
                                    style={{ textAlign: "center" }}
                                  />
                                </FormGroup>
                              </td>
                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Input
                                    type="text"
                                    style={{ textAlign: "center" }}
                                  />
                                </FormGroup>
                              </td>
                            </tr>
                            <tr className="entryrow">
                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Select
                                    placeholder="select type"
                                    // options={typeOpts}
                                  />
                                </FormGroup>
                              </td>
                              <td
                                style={{
                                  width: "70%",
                                  background: "#f5f5f5",
                                }}
                              >
                                {/* <Select
                            placeholder=""
                            styles={customStyles1}
                            //isClearable
                          /> */}
                              </td>

                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Input
                                    type="text"
                                    style={{ textAlign: "center" }}
                                  />
                                </FormGroup>
                              </td>
                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Input
                                    type="text"
                                    style={{ textAlign: "center" }}
                                  />
                                </FormGroup>
                              </td>
                            </tr>
                            <tr className="entryrow">
                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Select
                                    placeholder="select type"
                                    // options={typeOpts}
                                  />
                                </FormGroup>
                              </td>
                              <td
                                style={{
                                  width: "70%",
                                  background: "#f5f5f5",
                                }}
                              >
                                {/* <Select
                            placeholder=""
                            styles={customStyles1}
                            //isClearable
                          /> */}
                              </td>

                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Input
                                    type="text"
                                    style={{ textAlign: "center" }}
                                  />
                                </FormGroup>
                              </td>
                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Input
                                    type="text"
                                    style={{ textAlign: "center" }}
                                  />
                                </FormGroup>
                              </td>
                            </tr>
                            <tr className="entryrow">
                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Select
                                    placeholder="select type"
                                    // options={typeOpts}
                                  />
                                </FormGroup>
                              </td>
                              <td
                                style={{
                                  width: "70%",
                                  background: "#f5f5f5",
                                }}
                              ></td>

                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Input
                                    type="text"
                                    style={{ textAlign: "center" }}
                                  />
                                </FormGroup>
                              </td>
                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Input
                                    type="text"
                                    style={{ textAlign: "center" }}
                                  />
                                </FormGroup>
                              </td>
                            </tr>
                            <tr className="entryrow">
                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Select
                                    placeholder="select type"
                                    // options={typeOpts}
                                  />
                                </FormGroup>
                              </td>
                              <td
                                style={{
                                  width: "70%",
                                  background: "#f5f5f5",
                                }}
                              ></td>

                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Input
                                    type="text"
                                    style={{ textAlign: "center" }}
                                  />
                                </FormGroup>
                              </td>
                              <td style={{ width: "10%" }}>
                                <FormGroup>
                                  <Input
                                    type="text"
                                    style={{ textAlign: "center" }}
                                  />
                                </FormGroup>
                              </td>
                            </tr>
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
                                    style={{
                                      textAlign: "center",
                                      // width: "8%",
                                      background: "transparent",
                                      border: "none",
                                    }}
                                    type="text"
                                    placeholder=""
                                    value={this.getTotalDebitAmt()}
                                    readonly
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
                                    type="text"
                                    placeholder=""
                                    value={this.getTotalCreditAmt()}
                                    readonly
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
                                  onChange={handleChange}
                                  id="narration"
                                  name="narration"
                                  value={values.narration}
                                />
                              </FormGroup>
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
                            Submit
                          </Button>

                          <Button
                            className="cancel-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              this.props.history.push("/receipt");
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

export default WithUserPermission(ReceiptEdit);
