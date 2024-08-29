import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import moment from "moment";
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
import { Form } from "react-bootstrap";
import { Formik } from "formik";

import Select from "react-select";
import {
  getUnderList,
  getBalancingMethods,
  getIndianState,
  getIndiaCountry,
  getLedgersById,
  editLedger,
  getGSTTypes,
  getValidateLedgermMaster,
  getoutletappConfig,
  getAreaMasterOutlet,
  // getSalesmanMasterOutlet,
} from "@/services/api_function";
import {
  WithUserPermission,
  isActionExist,
  MyDatePicker,
  MyTextDatePicker,
  isUserControl,
  getSelectValue,
  GSTINREX,
  pan,
  OnlyAlphabets,
  OnlyEnterNumbers,
  OnlyEnterAmount,
  getValue,
  getRandomIntInclusive,
  ifsc_code_regex,
  bankAccountNumber,
} from "@/helpers";
import * as Yup from "yup";
import LayoutCustom from "@/pages/layout/LayoutCustom";
import { FormControl, Nav, Tab, Tabs } from "react-bootstrap";

const taxOpt = [
  { value: "central_tax", label: "Central Tax" },
  { value: "state_tax", label: "State Tax" },
  { value: "integrated_tax", label: "Integrated Tax" },
];
const applicable_from_options = [
  { label: "Credit Bill Date", value: "creditBill" },
  { label: "Lr Bill Date", value: "lrBill" },
];

const ledger_options = [
  { label: "Public", value: false },
  { label: "Private", value: true },
  // more options...
];

const sales_rate_options = [
  { label: "Sales Rate A", value: 1 },
  { label: "Sales Rate B", value: 2 },
  { label: "Sales Rate C", value: 3 },
];

const ledger_type_options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
  // more options...
];
const Balancing_method_options = [
  { label: "Bill Date", value: "billDate" },
  { label: "Delivery Date", value: "deliveryDate" },
  // more options...
];

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

export default class LedgerEdit extends React.Component {
  constructor(props) {
    console.log("props");
    console.log(props);
    super(props);
    this.myRef = React.createRef();

    this.state = {
      principleList: [],
      undervalue: [],
      balancingOpt: [],
      stateOpt: [],
      countryOpt: [],
      edit_data: "",
      GSTTypeOpt: [],
      deptRList: [],

      gstList: [],
      rList: [],
      rSList: [],
      rBList: [],
      bankList: [],
      deptList: [],
      shippingList: [],
      billingList: [],

      removeGstList: [],
      removeDeptList: [],
      removeShippingList: [],
      removeBillingList: [],
      removebankList: [],
      initValue: {
        associates_id: "",
        associates_group_name: "",
        underId: "",
        opening_balance: 0,
        is_private: "",
      },

      // initVal: {

      // },

      isEditDataSet: false,
      source: "",
      areaLst: [],
      salesmanLst: [],
      ledgerObject: "",
    };
  }

  listGSTTypes = () => {
    getGSTTypes()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let opt = d.map((v) => {
            return { label: v.gstType, value: v.id };
          });
          this.setState({ GSTTypeOpt: opt });
        }
      })
      .catch((error) => {});
  };

  lstUnders = () => {
    getUnderList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let Opt = res.responseObject.map((v, i) => {
            let innerOpt = {};
            if (v.associates_name != "") {
              innerOpt["value"] =
                v.principle_id +
                "_" +
                v.sub_principle_id +
                "_" +
                v.associates_id;
              innerOpt["label"] = v.associates_name;
              innerOpt["ledger_form_parameter_id"] = v.ledger_form_parameter_id;
              innerOpt["ledger_form_parameter_slug"] =
                v.ledger_form_parameter_slug;
              innerOpt["principle_id"] = v.principle_id;
              innerOpt["principle_name"] = v.principle_name;
              innerOpt["sub_principle_id"] = v.sub_principle_id;
              innerOpt["subprinciple_name"] = v.subprinciple_name;
              innerOpt["under_prefix"] = v.under_prefix;
              innerOpt["associates_id"] = v.associates_id;
              innerOpt["associates_name"] = v.associates_name;
            } else if (v.subprinciple_name != "") {
              innerOpt["value"] = v.principle_id + "_" + v.sub_principle_id;
              innerOpt["label"] = v.subprinciple_name;
              innerOpt["ledger_form_parameter_id"] = v.ledger_form_parameter_id;
              innerOpt["ledger_form_parameter_slug"] =
                v.ledger_form_parameter_slug;
              innerOpt["principle_id"] = v.principle_id;
              innerOpt["principle_name"] = v.principle_name;
              innerOpt["sub_principle_id"] = v.sub_principle_id;
              innerOpt["subprinciple_name"] = v.subprinciple_name;
              innerOpt["under_prefix"] = v.under_prefix;
              innerOpt["associates_id"] = v.associates_id;
              innerOpt["associates_name"] = v.associates_name;
            } else {
              innerOpt["value"] = v.principle_id;
              innerOpt["label"] = v.principle_name;
              innerOpt["ledger_form_parameter_id"] = v.ledger_form_parameter_id;
              innerOpt["ledger_form_parameter_slug"] =
                v.ledger_form_parameter_slug;
              innerOpt["principle_id"] = v.principle_id;
              innerOpt["principle_name"] = v.principle_name;
              innerOpt["sub_principle_id"] = v.sub_principle_id;
              innerOpt["subprinciple_name"] = v.subprinciple_name;
              innerOpt["under_prefix"] = v.under_prefix;
              innerOpt["associates_id"] = v.associates_id;
              innerOpt["associates_name"] = v.associates_name;
            }
            return innerOpt;
          });
          this.setState({ undervalue: Opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ undervalue: [] });
      });
  };
  lstBalancingMethods = () => {
    getBalancingMethods()
      .then((response) => {
        // console.log("response", response);
        let res = response.data;
        let opt = [];
        if (res.responseStatus == 200) {
          opt = res.response.map((v, i) => {
            return { value: v.balancing_id, label: v.balance_method };
          });
          const { initVal } = this.state;
          console.log("initVal--", { initVal });
          let initObj = initVal;
          initObj["opening_balancing_method"] = opt[0];
          console.log("opening_balancing_method", { initObj }, opt);
          this.setState({ initVal: initObj, balancingOpt: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  lstState = () => {
    getIndianState()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.responseObject.map((v) => {
            return { label: v.stateName, value: v.id };
          });
          this.setState({ stateOpt: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  lstCountry = () => {
    getIndiaCountry()
      .then((response) => {
        // console.log("country res", response);
        let opt = [];
        let res = { label: response.data.name, value: response.data.id };
        opt.push(res);
        this.setState({ countryOpt: opt });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  setInitVal = () => {
    let initVal = {
      id: "",
      associates_id: "",
      associates_group_name: "",
      ledger_name: "",
      underId: "",
      district: "",
      shipping_address: "",
      supplier_code: getRandomIntInclusive(1, 1000),
      opening_balance: 0,
      is_private: "false",
    };
    this.setState({ initVal: initVal });
  };
  ValidateLedgermMaster = (
    underId,
    principle_id,
    principle_group_id,
    ledger_name,
    supplier_code
  ) => {
    console.log("Validate", underId, ledger_name, supplier_code);
    let reqData = new FormData();
    reqData.append("ledger_name", ledger_name);
    if (supplier_code && supplier_code != "") {
      reqData.append("ledger_code", supplier_code);
    }

    reqData.append("principle_id", principle_group_id);
    if (principle_id && principle_id != "") {
      reqData.append("principle_group_id", principle_id);
    }

    getValidateLedgermMaster(reqData)
      .then((response) => {
        let res = response.data;
        console.log("res validate", res);
        if (res.responseStatus == 409) {
          if (
            (ledger_name && ledger_name != "") ||
            (supplier_code && supplier_code != "") ||
            (principle_group_id &&
              principle_group_id != "" &&
              principle_id &&
              principle_id != "")
          ) {
            toast.error(res.message);
          }
        }
      })
      .catch((error) => {});
  };
  getLedgerDetails = () => {
    let { edit_data, undervalue, GSTTypeOpt, areaLst, salesmanLst } =
      this.state;
    let formData = new FormData();
    formData.append("id", edit_data);
    console.log("Edit Id", edit_data);
    getLedgersById(formData)
      .then((response) => {
        console.log("response. data ", response.data);
        let data = response.data;

        let gstdetails = [];
        let deptList = [];
        let shippingDetails = [];
        let billingDetails = [];
        let bankDetails = [];

        let initVal = {
          id: "",
          ledger_name: "",
          district: "",
          shipping_address: "",
          underId: "",
          supplier_code: getRandomIntInclusive(1, 1000),
          is_private: ledger_options[0],
        };
        if (data.responseStatus == 200) {
          data = data.response;
          let underOptID;
          if (data.under_prefix_separator == "P") {
            underOptID = getSelectValue(undervalue, data.principle_id);
          } else if (data.under_prefix_separator == "PG") {
            underOptID = getSelectValue(
              undervalue,
              data.principle_id + "_" + data.sub_principle_id
            );
          } else if (data.under_prefix_separator == "AG") {
            underOptID = getSelectValue(
              undervalue,
              data.principle_id +
                "_" +
                data.sub_principle_id +
                "_" +
                data.under_id
            );
          }
          if (data.ledger_form_parameter_slug == "assets") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,

              underId: underOptID,
              is_private: getSelectValue(ledger_options, data.is_private),

              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
            };
          } else if (data.ledger_form_parameter_slug == "sundry_creditors") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              underId: underOptID,
              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
              stateId: getSelectValue(this.state.stateOpt, data.state),
              countryId: getSelectValue(this.state.countryOpt, data.country),
              address: data.address,
              opening_balancing_method:
                data.balancing_method && data.balancing_method != null
                  ? getSelectValue(
                      this.state.balancingOpt,
                      data.balancing_method
                    )
                  : getSelectValue(this.state.balancingOpt, 1),
              tradeOfBusiness: data.businessType,
              natureOfBusiness: data.businessTrade,
              mailing_name: data.mailing_name,
              supplier_code: data.supplier_code,
              pincode: data.pincode != 0 ? data.pincode : "",
              city: data.city,
              email_id: data.email != "NA" ? data.email : "",
              phone_no: data.mobile_no,
              // salesrate: data.sales_rate,
              credit_days: data.credit_days,
              applicable_from:
                data.applicable_from != null
                  ? getValue(applicable_from_options, data.applicable_from)
                  : "",
              credit_bills: data.creditNumBills,
              credit_values: data.creditBillValue,

              dob: data.dob != "" ? moment(data.dob).format("DD/MM/YYYY") : "",
              doa:
                data.anniversary != ""
                  ? moment(data.anniversary).format("DD/MM/YYYY")
                  : "",
              licenseNo: data.licenseNo,
              license_expiry:
                data.licenseExpiryDate != ""
                  ? moment(data.licenseExpiryDate).format("DD/MM/YYYY")
                  : "",
              fssai: data.fssai != "NA" ? data.fssai : "",
              fssai_expiry:
                data.fssai_expiry != ""
                  ? moment(data.fssai_expiry).format("DD/MM/YYYY")
                  : "",
              drug_license_no:
                data.drug_license_no != "NA" ? data.drug_license_no : "",
              drug_expiry:
                data.drug_expiry != ""
                  ? moment(data.drug_expiry).format("DD/MM/YYYY")
                  : "",

              mfg_license_no:
                data.manufacturingLicenseNo != "NA"
                  ? data.manufacturingLicenseNo
                  : "",
              mfg_expiry:
                data.manufacturingLicenseExpiry != ""
                  ? moment(data.manufacturingLicenseExpiry).format("DD/MM/YYYY")
                  : "",

              isTaxation: getSelectValue(ledger_type_options, data.taxable),
              // taxable: getSelectValue(ledger_type_options, data.taxable),
              // salesrate: getSelectValue(sales_rate_options, data.sales_rate),

              tds: String(data.tds),
              tcs: String(data.tcs),
              bank_name: data.bank_name,
              // bank_account_no: data.account_no,
              bank_branch: data.bank_branch,
              // bank_ifsc_code: data.ifsc_code,
              is_private: getSelectValue(ledger_options, data.is_private),
            };
            if (data.deptDetails.length > 0) {
              deptList = data.deptDetails.map((v, i) => {
                return {
                  id: v.id,
                  dept: v.dept,
                  contact_person: v.contact_person,
                  contact_no: v.contact_no,
                  email: v.email != "NA" ? v.email : "",
                };
              });
            }

            if (data.shippingDetails.length > 0) {
              shippingDetails = data.shippingDetails.map((v, i) => {
                return {
                  id: v.id,
                  district: v.district,
                  shipping_address: v.shipping_address,
                };
              });
            }

            if (data.bankDetails.length > 0) {
              bankDetails = data.bankDetails.map((v, i) => {
                return {
                  bid: v.id,
                  bank_name: v.bank_name,
                  bank_account_no: v.bank_account_no,
                  bank_ifsc_code: v.bank_ifsc_code,
                  bank_branch: v.bank_branch,
                };
              });
            }

            if (data.billingDetails.length > 0) {
              billingDetails = data.billingDetails.map((v, i) => {
                return {
                  id: v.id,
                  b_district: v.district,
                  billing_address: v.billing_address,
                };
              });
            }

            if (data.taxable) {
              if (data.gstdetails.length > 0) {
                gstdetails = data.gstdetails.map((v, i) => {
                  return {
                    id: v.id,
                    gstin: v.gstin,
                    dateofregistartion:
                      v.dateOfRegistration != "NA" && v.dateOfRegistration
                        ? moment(v.dateOfRegistration).format("DD/MM/YYYY")
                        : "",
                    pan_no_old: v.pancard != "NA" ? v.pancard : "",
                    pan_no: v.gstin.substring(2, 12),
                  };
                });
              }
              console.log("gstdetails in update", gstdetails);

              initVal["registraion_type"] = getSelectValue(
                GSTTypeOpt,
                data.registration_type
              );
            } else {
              initVal["pan_no"] = data.pancard_no;
            }

            initVal["tds_applicable_date"] =
              data.tds_applicable_date != "NA"
                ? new Date(data.tds_applicable_date)
                : "";

            initVal["tcs_applicable_date"] =
              data.tcs_applicable_date != "NA"
                ? new Date(data.tcs_applicable_date)
                : "";

            console.log({ initVal });
          } else if (data.ledger_form_parameter_slug == "sundry_debtors") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              underId: underOptID,
              is_private: getSelectValue(ledger_options, data.is_private),
              route: data.route,
              areaId: getSelectValue(areaLst, parseInt(data.area)),

              district: "",
              shipping_address: "",
              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
              stateId: getSelectValue(this.state.stateOpt, data.state),
              countryId: getSelectValue(this.state.countryOpt, data.country),
              address: data.address,
              opening_balancing_method: getSelectValue(
                this.state.balancingOpt,
                data.balancing_method
              ),
              salesmanId: getSelectValue(salesmanLst, parseInt(data.salesman)),
              salesrate:
                data.sales_rate != null
                  ? getSelectValue(
                      sales_rate_options,
                      parseInt(data.sales_rate)
                    )
                  : "",
              applicable_from:
                data.applicable_from != null
                  ? getValue(applicable_from_options, data.applicable_from)
                  : "",

              tradeOfBusiness: data.businessType,
              natureOfBusiness: data.businessTrade,

              mailing_name: data.mailing_name,
              supplier_code: data.supplier_code,
              // pincode: data.pincode,
              pincode: data.pincode != 0 ? data.pincode : "",
              city: data.city,
              email_id: data.email != "NA" ? data.email : "",
              phone_no: data.mobile_no,
              credit_days: data.credit_days,
              credit_bills: data.creditNumBills,
              credit_values: data.creditBillValue,

              dob: data.dob != "" ? moment(data.dob).format("DD/MM/YYYY") : "",
              doa:
                data.anniversary != ""
                  ? moment(data.anniversary).format("DD/MM/YYYY")
                  : "",
              licenseNo: data.licenseNo,
              license_expiry:
                data.licenseExpiryDate != ""
                  ? moment(data.licenseExpiryDate).format("DD/MM/YYYY")
                  : "",

              fssai: data.fssai != "NA" ? data.fssai : "",
              fssai_expiry:
                data.fssai_expiry != ""
                  ? moment(data.fssai_expiry).format("DD/MM/YYYY")
                  : "",
              drug_license_no:
                data.drug_license_no != "NA" ? data.drug_license_no : "",
              drug_expiry:
                data.drug_expiry != ""
                  ? moment(data.drug_expiry).format("DD/MM/YYYY")
                  : "",
              mfg_license_no:
                data.manufacturingLicenseNo != "NA"
                  ? data.manufacturingLicenseNo
                  : "",
              mfg_expiry:
                data.manufacturingLicenseExpiry != ""
                  ? moment(data.manufacturingLicenseExpiry).format("DD/MM/YYYY")
                  : "",

              isTaxation: getSelectValue(ledger_type_options, data.taxable),

              tds: String(data.tds),
              tcs: String(data.tcs),
            };

            if (data.deptDetails.length > 0) {
              deptList = data.deptDetails.map((v, i) => {
                return {
                  id: v.id,
                  details_id: v.details_id,
                  dept: v.dept,
                  contact_person: v.contact_person,
                  contact_no: v.contact_no,
                  email: v.email,
                };
              });
            }

            if (data.shippingDetails.length > 0) {
              shippingDetails = data.shippingDetails.map((v, i) => {
                return {
                  id: v.id,
                  details_id: v.details_id,
                  district: v.district,
                  shipping_address: v.shipping_address,
                };
              });
            }
            if (data.bankDetails.length > 0) {
              bankDetails = data.bankDetails.map((v, i) => {
                return {
                  bid: v.id,
                  bankName: v.bank_name,
                  account_no: v.bank_account_no,
                  ifsc: v.bank_ifsc_code,
                  bank_branch: v.bank_branch,
                };
              });
            }

            if (data.billingDetails.length > 0) {
              billingDetails = data.billingDetails.map((v, i) => {
                return {
                  id: v.id,
                  details_id: v.details_id,
                  b_district: v.district,
                  billing_address: v.billing_address,
                };
              });
            }

            if (data.taxable) {
              if (data.gstdetails.length > 0) {
                gstdetails = data.gstdetails.map((v, i) => {
                  return {
                    id: v.id,
                    details_id: v.details_id != 0 ? v.details_id : 0,
                    gstin: v.gstin,
                    dateofregistartion:
                      v.dateOfRegistration != "NA" && v.dateOfRegistration
                        ? moment(v.dateOfRegistration).format("DD/MM/YYYY")
                        : "",
                    pan_no_old: v.pancard != "NA" ? v.pancard : "",
                    pan_no: v.gstin.substring(2, 12),
                  };
                });
              }
              console.log("gstdetails in update", gstdetails);

              initVal["registraion_type"] = getSelectValue(
                GSTTypeOpt,
                data.registration_type
              );
              console.log({ initVal });
            } else {
              initVal["pan_no"] = data.pancard_no;
            }
          } else if (data.ledger_form_parameter_slug == "others") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              underId: underOptID,
              address: data.address,
              stateId: getSelectValue(this.state.stateOpt, data.state),
              countryId: getSelectValue(this.state.countryOpt, data.country),
              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
              pincode: data.pincode,
              phone_no: data.mobile_no,
              is_private: getSelectValue(ledger_options, data.is_private),
            };
          } else if (data.ledger_form_parameter_slug == "duties_taxes") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              underId: underOptID,
              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
              tax_type: data.tax_type,
              is_private: getSelectValue(ledger_options, data.is_private),
            };
          } else if (data.ledger_form_parameter_slug == "bank_account") {
            let underIdOp = data.principle_id + "_" + data.sub_principle_id;
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              underId: underOptID,
              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
              stateId: getSelectValue(this.state.stateOpt, data.state),
              countryId: getSelectValue(this.state.countryOpt, data.country),
              is_private: getSelectValue(ledger_options, data.is_private),

              address: data.address,
              opening_balancing_method: getSelectValue(
                this.state.balancingOpt,
                data.balancing_method
              ),
              mailing_name: data.mailing_name,
              pincode: data.pincode,
              email_id: data.email,
              phone_no: data.mobile_no,
              isTaxation: getSelectValue(ledger_type_options, data.taxable),

              taxable: getSelectValue(ledger_type_options, data.taxable),

              bank_name: data.bank_name !== "NA" ? data.bank_name : "",
              bank_account_no: data.account_no != "NA" ? data.account_no : "",
              bank_ifsc_code: data.ifsc_code != "NA" ? data.ifsc_code : "",
              bank_branch: data.bank_branch,
            };
            if (data.bankDetails.length > 0) {
              bankDetails = data.bankDetails.map((v, i) => {
                return {
                  id: v.id,
                  bank_name: v.bank_name !== "NA" ? v.bank_name : "",
                  bank_account_no:
                    v.bank_account_no != "NA" ? v.bank_account_no : "",
                  bank_ifsc_code:
                    v.bank_ifsc_code != "NA" ? v.bank_ifsc_code : "",
                  bank_branch: v.bank_branch,
                };
              });
            }
            if (data.taxable) {
              // dateofregistartion: data.dateofregistartion,
              initVal["gstin"] = data.gstin;
            }
          }

          // initVal["is_private"] =
          //   data.is_private != null
          //     ? getValue(ledger_options, data.is_private)
          //     : "";

          console.log({
            initVal,
            gstdetails,
            deptList,
            shippingDetails,
            billingDetails,
            bankDetails,
          });
          this.setState({
            isEditDataSet: true,
            initVal: initVal,
            gstList: gstdetails,
            deptList: deptList,
            shippingList: shippingDetails,
            billingList: billingDetails,
            bankList: bankDetails,
          });
          //  console.log("gstList", gstList);
        } else {
          this.setState({ isEditDataSet: true });
          // ShowNotification("Error", data.responseStatus);
          toast.error("Error", data.responseStatus);
        }
      })
      .catch((error) => {});
  };

  clearGSTData = (setFieldValue) => {
    setFieldValue("gstin", "");
    setFieldValue("bid", "");
    setFieldValue("dateofregistartion", "");
    setFieldValue("pan_no", "");

    setFieldValue("gst_detail_id", "");
    setFieldValue("index", -1);
  };

  clearDeptDetails = (setFieldValue) => {
    setFieldValue("index", -1);
    setFieldValue("did", "");
    setFieldValue("dept", "");
    setFieldValue("contact_person", "");
    setFieldValue("contact_no", "");
    setFieldValue("email", "");
    setFieldValue("depart_details_id", "");
  };

  clearShippingBillingData = (setFieldValue) => {
    setFieldValue("index", -1);
    setFieldValue("sid", "");
    setFieldValue("bid", "");
    setFieldValue("b_district", "");
    setFieldValue("district", "");
    setFieldValue("shipping_address", "");
    setFieldValue("billing_address", "");
  };
  handleFetchGstData = (values, setFieldValue, index = -1) => {
    console.log("in handleFetch Gst data", values);
    console.log("Array index No-->", index);

    // if(values.dateofregistartion !=null && values.dateofregistartion!="")
    // {
    //   let gstpandate=moment(values.dateofregistartion,"DD/MM/YYYY").toDate();
    // }
    let gstObj = {
      id: values.id != 0 ? values.id : 0,
      gstin: values.gstin != "" ? values.gstin : "",
      dateofregistartion:
        values.dateofregistartion != "" ? values.dateofregistartion : "",

      pan_no: values.pan_no != "" ? values.pan_no : 0,
      index: index,
    };

    console.log({ gstObj });
    if (gstObj.gstin != "") {
      setFieldValue("gstin", gstObj.gstin);
    }

    if (gstObj.id != "") {
      setFieldValue("bid", gstObj.id);
    }
    let finalpandate = "";
    // if (gstObj.dateofregistartion != null && gstObj.dateofregistartion != "") {
    //   // finalpandate = moment(gstObj.dateofregistartion, "DD/MM/YYYY").toDate();
    // }
    if (gstObj.dateofregistartion != "") {
      // console.warn("gstObj.dateofregistartion ", gstObj.dateofregistartion);
      setFieldValue("dateofregistartion", gstObj.dateofregistartion);
    }
    if (gstObj.pan_no != "") {
      setFieldValue("pan_no", gstObj.pan_no);
    }
    if (gstObj.index != -1) {
      setFieldValue("index", index);
    } else {
      setFieldValue("index", -1);
    }

    setFieldValue(
      "gst_detail_id",
      values.details_id != 0 ? values.details_id : 0
    );
    // gstList = gstList.filter((v, i) => i != index);
    // this.setState({ gstList: gstList });
    // } else {
    //   setFieldValue("gstin", "");
    //   setFieldValue("bid", "");
    //   setFieldValue("dateofregistartion", "");
    //   setFieldValue("pan_no", "");

    //   setFieldValue("gst_detail_id", "");
    // }
  };

  handleFetchDepartmentData = (values, setFieldValue, index = -1) => {
    console.log("in handleFetch department data", values);
    console.log("Array index No-->", index);

    // let { deptList } = this.state;
    let deptObj = {
      dept: values.dept,
      id: values.id != 0 ? values.id : 0,

      contact_no: values.contact_no != "" ? values.contact_no : "",

      contact_person: values.contact_person != "" ? values.contact_person : "",
      email: values.email != "" ? values.email : "",
      index: index,
    };
    console.log("deptObj-->", deptObj);

    if (deptObj.dept != "") {
      setFieldValue("dept", deptObj.dept);
    }
    if (deptObj.id != "") {
      setFieldValue("did", deptObj.id);
    }

    if (deptObj.contact_no != "") {
      setFieldValue("contact_no", deptObj.contact_no);
    }
    if (deptObj.contact_person != "") {
      setFieldValue("contact_person", deptObj.contact_person);
    }
    if (deptObj.email != "") {
      setFieldValue("email", deptObj.email);
    }
    if (deptObj.index != 1) {
      setFieldValue("index", index);
    } else {
      setFieldValue("index", -1);
    }

    setFieldValue(
      "dept_detail_id",
      values.details_id != 0 ? values.details_id : 0
    );

    // deptList = deptList.filter((v, i) => i != index);

    // this.setState({ deptList: deptList });
  };
  handleFetchBankData = (values, setFieldValue, index = -1) => {
    // let { bankList } = this.state;
    console.log("in handleFetch Bank data", values);
    console.log("Array index No-->", index);
    let bankObj = {
      bid: values.id != 0 ? values.id : 0,
      bank_name: values.bank_name != null ? values.bank_name : "",
      bank_account_no:
        values.bank_account_no != null ? values.bank_account_no : "",
      bank_ifsc_code:
        values.bank_ifsc_code != null ? values.bank_ifsc_code : "",
      bank_branch: values.bank_branch != null ? values.bank_branch : "",
      index: index,
    };
    console.log("bankObj", bankObj);

    if (bankObj.bank_name != "") {
      setFieldValue("bank_name", bankObj.bank_name);
    }
    if (bankObj.bank_account_no != "") {
      setFieldValue("bank_account_no", bankObj.bank_account_no);
    }
    if (bankObj.bank_ifsc_code != "") {
      setFieldValue("bank_ifsc_code", bankObj.bank_ifsc_code);
    }

    if (bankObj.bank_branch != "") {
      setFieldValue("bank_branch", bankObj.bank_branch);
    }
    if (bankObj.index != -1) {
      setFieldValue("index", index);
    } else {
      setFieldValue("index", -1);
    }
    if (bankObj.id != "") {
      setFieldValue("bid", bankObj.bid);
    }

    setFieldValue(
      "bank_detail_id",
      values.details_id != 0 ? values.details_id : 0
    );
    // bankList = bankList.filter((v, i) => i != index);

    // this.setState({ bankList: bankList });
  };

  addGSTRow = (values, setFieldValue, index = -1) => {
    console.log(
      "addGstRow ????????????????????????????-------------=====================>>>>>>>>>>>>..",
      values
    );

    let gstObj = {
      id: values.id != 0 ? values.id : 0,
      gstin: values.gstin,
      dateofregistartion: values.dateofregistartion,
      // dateofregistartion: moment(values.dateofregistartion).toDate(),

      pan_no: values.pan_no,
      registraion_type: values.registraion_type,
      index: values.index,
    };

    console.log("gstObj >>>>>>>>>> ", gstObj);
    let { gstList } = this.state;
    if (GSTINREX.test(gstObj.gstin)) {
      if (pan.test(gstObj.pan_no)) {
        let old_lst = gstList;
        let is_updated = false;
        console.log("gstObj", gstObj);
        console.log("old_lst", old_lst);
        let obj = old_lst.filter((value) => {
          return (
            // value.gstin === gstObj.gstin &&
            // value.dateofregistartion === gstObj.dateofregistartion &&
            value.pan_no === gstObj.pan_no
          );
        });
        console.log("obj", obj);
        let final_state = [];
        if (obj.length == 0) {
          if (values.index == -1) {
            final_state = old_lst.map((item) => {
              if (item.id != 0 && item.id === gstObj.id) {
                is_updated = true;
                const updatedItem = gstObj;
                return updatedItem;
              }
              return item;
            });
            console.log("is updated", is_updated);
            if (is_updated == false) {
              final_state = [...gstList, gstObj];
            }
            console.log({ final_state });
          } else {
            final_state = old_lst.map((item, i) => {
              if (i == values.index) {
                return gstObj;
              } else {
                return item;
              }
            });
          }
          console.log("final_state", final_state);

          this.setState({ gstList: final_state }, () => {
            setFieldValue("bid", "");
            setFieldValue("gstin", "");
            setFieldValue("dateofregistartion", "");
            setFieldValue("pan_no", "");
            setFieldValue("index", -1);
          });
        } else if (values.index != -1) {
          final_state = old_lst.map((item, i) => {
            if (i == values.index) {
              return gstObj;
            } else {
              return item;
            }
          });

          console.log("final_state", final_state);

          this.setState({ gstList: final_state }, () => {
            setFieldValue("bid", "");
            setFieldValue("gstin", "");
            setFieldValue("dateofregistartion", "");
            setFieldValue("pan_no", "");
            setFieldValue("index", -1);
          });
        } else {
          toast.warning("GST Details are Already Exist !");
        }
      } else {
        toast.error("PAN NO is not Valid!");
      }
    } else {
      toast.error("GSTIN is Not Valid ");
    }
  };

  // handle click event of the Remove button
  removeGstRow = (index) => {
    console.log("index->", index);
    let { gstList, rList } = this.state;
    // const list = [...gstList];
    // list.splice(index, 1);

    // rList = [...rList, list[1]];
    let list = gstList.filter((v, i) => i != index);
    let robj = gstList.find((v, i) => i == index);
    rList = [...rList, robj];

    this.setState({ gstList: list, rList: rList }, () => {
      console.log("gstlist removed->", this.state.rList);
      if (this.myRef.current) {
        this.myRef.current.setFieldValue("index", -1);
        this.myRef.current.setFieldValue("bid", "");
      }
    });
  };

  removeBankRow = (index) => {
    console.log("index-->", index);
    let { bankList, removebankList } = this.state;
    let list = bankList.filter((v, i) => i != index);
    let robj = bankList.find((v, i) => i == index);
    removebankList = [...removebankList, robj];
    this.setState({ bankList: list, removebankList: removebankList }, () => {
      console.log("banklist removed---->", this.state.removebankList);
      if (this.myRef.current) {
        this.myRef.current.setFieldValue("index", -1);
        this.myRef.current.setFieldValue("bid", "");
      }
    });
  };

  handleFetchShippingData = (values, setFieldValue, index = -1) => {
    console.log("in shiping", values);
    // if (isclear == 0) {
    let shipObj = {
      id: values.id != 0 ? values.id : 0,
      // details_id: values.details_id != 0 ? values.details_id : 0,
      district: values.district != "" ? values.district : "",
      shipping_address:
        values.shipping_address != "" ? values.shipping_address : "",
      index: index,
    };
    console.log({ shipObj });
    setFieldValue("district", shipObj.district);
    if (shipObj.id != "") {
      setFieldValue("sid", shipObj.id);
    }
    setFieldValue("shipping_address", shipObj.shipping_address);
    if (shipObj.index != -1) {
      setFieldValue("index", index);
    } else {
      setFieldValue("index", -1);
    }
    // setFieldValue(
    //   "shipping_detail_id",
    //   values.details_id != 0 ? values.details_id : 0
    // );
    // });
    // } else {
    //   setFieldValue("shipping_address", "");
    //   setFieldValue("sid", "");
    //   setFieldValue("district", "");
    // }
  };

  checkExpiryDate = (setFieldValue, expirydate = 0, ele) => {
    console.log(typeof expirydate);
    console.log("ele--->", ele);
    console.warn("sid :: expirydate", expirydate);
    console.warn("sid:: isValid", moment(expirydate, "DD-MM-YYYY").isValid());
    if (moment(expirydate, "DD-MM-YYYY").isValid() == true) {
      let currentDate = new Date().getTime();
      console.log("currentDate", currentDate);
      // let expdate = new Date(expirydate).getTime();
      let expdate = moment(expirydate, "DD/MM/YYYY").toDate();

      console.warn("--> expirydate", expdate.getTime());
      let etime = expdate.getTime();
      console.log("etime", etime);

      if (ele == "dateofregistartion") {
        if (currentDate >= etime) {
          // setFieldValue("dateofregistartion", etime);
          console.log("Its Correct");
        } else {
          toast.error("Registration Date Should be Less than Current Date");
          setFieldValue(ele, "");
        }
      } else {
        if (currentDate >= etime) {
          toast.error("Expiry Date Should be Grater than Current Date");
          setFieldValue(ele, "");
          // }
          // );
        } else {
          console.log("Correct Date-->", expirydate);
        }
      }
    } else {
      toast.error("Expiry date not valid");
      setFieldValue(ele, "");
    }
  };
  addShippingRow = (values, setFieldValue) => {
    console.log(values);
    let shipObj = {
      id: values.id,
      district: values.district,
      shipping_address: values.shipping_address,
      index: values.index,
    };

    console.log("ShippingRow---.", shipObj);
    const { shippingList } = this.state;
    let old_lst = shippingList;
    let is_updated = false;
    let obj = old_lst.filter((value) => {
      return (
        value.district === shipObj.district &&
        value.shipping_address === shipObj.shipping_address
      );
    });
    console.log("obj", obj);
    let final_state = [];
    if (obj.length == 0) {
      if (values.index == -1) {
        final_state = old_lst.map((item) => {
          if (item.id != 0 && item.id === shipObj.id) {
            is_updated = true;
            const updatedItem = shipObj;
            return updatedItem;
          }
          return item;
        });
        console.log("is updated", is_updated);
        if (is_updated == false) {
          final_state = [...shippingList, shipObj];
        }
        console.log({ final_state });
      } else {
        final_state = old_lst.map((item, i) => {
          if (i == values.index) {
            return shipObj;
          } else {
            return item;
          }
        });
      }

      // if (obj.length == 0) {
      //   final_state = old_lst.map((item, i) => {
      //     if (item.index === shipObj.index) {
      //       is_updated = true;
      //       const newObj = shipObj;
      //       return newObj;
      //     }
      //     return item;
      //   });

      // if (is_updated == false) {
      //   final_state = [...shippingList, shipObj];
      // }
      console.log("Shiiping", { final_state });
      this.setState({ shippingList: final_state }, () => {
        console.log("shippingList", shippingList);
        setFieldValue("sid", "");
        setFieldValue("district", "");
        setFieldValue("shipping_address", "");
        setFieldValue("index", undefined);
      });
    } else if (values.index != -1) {
      final_state = old_lst.map((item, i) => {
        if (i == values.index) {
          return shipObj;
        } else {
          return item;
        }
      });

      console.log({ final_state });
      this.setState({ shippingList: final_state }, () => {
        console.log("shippingList", shippingList);
        setFieldValue("sid", "");
        setFieldValue("district", "");
        setFieldValue("shipping_address", "");
        setFieldValue("index", undefined);
      });
    } else {
      console.log("already exists in row");
      toast.warning("Shipping Details are Already Exist !");
    }
  };

  // handle click event of the Remove button
  removeShippingRow = (index) => {
    console.log("index-->", index);
    // const list = [...shippingList];
    // list.splice(index, 1);

    let { shippingList, rSList } = this.state;
    let list = shippingList.filter((v, i) => i != index);
    let sobj = shippingList.find((v, i) => i == index);
    rSList = [...rSList, sobj];
    this.setState({ shippingList: list, rSList: rSList }, () => {
      console.log("shiplist removed->", this.state.rSList);
    });
  };

  handleFetchBillingData = (values, setFieldValue, index = -1) => {
    console.log("in Billing", values);

    let billAddObj = {
      id: values.id != 0 ? values.id : 0,
      details_id: values.details_id != 0 ? values.details_id : 0,
      b_district: values.b_district,
      billing_address: values.billing_address,
      index: index,
    };

    setFieldValue("b_district", billAddObj.b_district);
    setFieldValue("billing_address", billAddObj.billing_address);
    if (billAddObj.id != "") {
      setFieldValue("bid", billAddObj.id);
    }
    if (billAddObj.index != -1) {
      setFieldValue("index", index);
    } else {
      setFieldValue("index", -1);
    }

    // setFieldValue(
    //   "billing_details_id",
    //   values.details_id != 0 ? values.details_id : 0
    // );
    // });
  };

  addBillingRow = (values, setFieldValue) => {
    console.log(values);
    let billAddObj = {
      id: values.id != 0 ? values.id : 0,
      // details_id: values.details_id != 0 ? values.details_id : 0,
      b_district: values.b_district,
      billing_address: values.billing_address,
    };
    console.log("Billing Obj--->>>", billAddObj);
    const { billingList } = this.state;

    let old_lst = billingList;
    let is_updated = false;
    let obj = old_lst.filter((value) => {
      return (
        value.b_district === billAddObj.b_district &&
        value.billing_address === billAddObj.billing_address
      );
    });
    console.log("obj", obj);
    let final_state = [];
    if (obj.length == 0) {
      if (values.index == -1) {
        final_state = old_lst.map((item) => {
          if (item.id != 0 && item.id === billAddObj.id) {
            is_updated = true;
            const updatedItem = billAddObj;
            return updatedItem;
          }

          return item;
        });
        console.log("is_updated ", is_updated);

        if (is_updated == false) {
          final_state = [...billingList, billAddObj];
        }
        console.log({ final_state });
      } else {
        final_state = old_lst.map((item, i) => {
          if (i == values.index) {
            return billAddObj;
          } else {
            return item;
          }
        });
      }

      this.setState({ billingList: final_state }, () => {
        setFieldValue("bid", "");
        setFieldValue("b_district", "");
        setFieldValue("billing_address", "");
        setFieldValue("billing_details_id", "");
      });
    } else {
      console.log("already Bill Detials exist in row");
      toast.warning("Billing Details are Already Exist !");
    }
  };

  // handle click event of the Remove button
  removeBillingRow = (index) => {
    console.log("index-->", index);
    let { billingList, rBList } = this.state;
    let list = billingList.filter((v, i) => i != index);
    let bobj = billingList.find((v, i) => i == index);
    rBList = [...rBList, bobj];
    // const list = [...billingList];
    // list.splice(index, 1);
    this.setState({ billingList: list, rBList: rBList }, () => {
      console.log("billing list removed->", this.state.rBList);
    });
  };

  addDeptRow = (values, setFieldValue) => {
    console.log("dept--", values);
    let deptObj = {
      id: values.id != 0 ? values.id : 0,

      // details_id: values.details_id != 0 ? values.details_id : 0,
      dept: values.dept,
      contact_person: values.contact_person,
      contact_no: values.contact_no,
      email: values.email,
    };

    const { deptList } = this.state;
    console.log("deptObj check---->>>..", deptObj);
    // if (EMAILREGEXP.test(deptObj.email)) {
    //   if (MobileRegx.test(deptObj.contact_no)) {
    let old_lst = deptList;
    let is_updated = false;
    console.log("deptObj", deptObj);
    console.log("old_lst", old_lst);
    let obj = old_lst.filter((value) => {
      return (
        value.contact_no === deptObj.contact_no && value.email === deptObj.email
      );
    });
    console.log("obj", obj);
    let final_state = [];
    // if (obj.length == 0) {
    if (values.index == -1) {
      final_state = old_lst.map((item) => {
        // if (deptObj.details_id != 0) {
        if (item.id != 0 && item.id === deptObj.id) {
          is_updated = true;
          const updatedItem = deptObj;
          return updatedItem;
        }
        // }
        return item;
      });
      if (is_updated == false) {
        final_state = [...deptList, deptObj];
      }
      console.log({ final_state });
    } else {
      final_state = old_lst.map((item, i) => {
        if (i == values.index) {
          return deptObj;
        } else {
          return item;
        }
      });
    }

    this.setState({ deptList: final_state }, () => {
      setFieldValue("did", "");
      setFieldValue("dept", "");
      setFieldValue("contact_person", "");
      setFieldValue("contact_no", "");
      setFieldValue("email", "");
      setFieldValue("depart_details_id", "");
      setFieldValue("index", -1);
    });
  };

  removeDeptRow = (index) => {
    console.log("index->", index);

    let { deptList, deptRList } = this.state;
    let list = deptList.filter((v, i) => i != index);
    let dobj = deptList.find((v, i) => i == index);
    deptRList = [...deptRList, dobj];
    // list.splice(index, 1);
    this.setState({ deptList: list, deptRList: deptRList }, () => {
      console.log("department removed=->", this.state.deptRList);
      if (this.myRef.current) {
        this.myRef.current.setFieldValue("index", -1);
        this.myRef.current.setFieldValue("did", "");
      }
    });
  };
  setInitValue = () => {
    let initValue = {
      associates_id: "",
      associates_group_name: "",
      underId: "",
      opening_balance: 0,
      is_private: getSelectValue(ledger_options, false),
      salesrate: getValue(sales_rate_options, "Sales Rate A"),
    };
    this.setState({ initValue: initValue });
  };
  getoutletappConfigData = () => {
    getoutletappConfig()
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let opt = d.settings.map((v) => {
            return { key: v.key, label: v.label, value: v.value };
          });
          this.setState({ appConfig: opt });
        }
      })
      .catch((error) => {});
  };

  lstAreaMaster = () => {
    getAreaMasterOutlet()
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 200) {
          let opt = res.responseObject.map((v, i) => {
            return { label: v.areaName, value: v.id };
          });
          this.setState({ areaLst: opt }, () => {});
        }
      })
      .catch((error) => {});
  };
  // lstSalesmanMaster = () => {
  //   getSalesmanMasterOutlet()
  //     .then((response) => {
  //       let res = response.data;

  //       if (res.responseStatus == 200) {
  //         let opt = res.responseObject.map((v, i) => {
  //           return { label: v.firstName + " " + v.lastName, value: v.id };
  //         });
  //         this.setState({ salesmanLst: opt }, () => { });
  //       }
  //     })
  //     .catch((error) => { });
  // };

  findLedgerById = (ledger_id) => {
    // let reqData = {
    //   id: ledger_id,
    // };
    let formData = new FormData();
    formData.append("id", ledger_id);
    getLedgersById(formData)
      .then((response) => {
        if (response.data.responseStatus == 200) {
          console.log(response.data.response);
          this.setState({ ledgerObject: response.data.response });
          // this.setState({ currentIndex: 0 });
          // this.setState({ editModal: true });
        } else {
          toast.error("✘ " + response.data.message);
        }
      })
      .catch((error) => {
        console.log("errors", error);
      });
  };

  componentDidMount() {
    this.lstUnders();
    this.lstBalancingMethods();
    this.lstState();
    this.lstCountry();
    // this.listGSTTypes();
    // this.lstAreaMaster();
    // this.lstSalesmanMaster();

    // const { prop_data } = this.props;
    // console.log("propdata---",{ prop_data });
    console.log("this props", this.props.history.location.state);
    // console.log("this props",this.props);
    this.findLedgerById(this.props.history.location.state.id);

    this.setState({ edit_data: this.props.history.location.state.id });

    // if (prop_data.hasOwnProperty("source")) {
    //   this.setState({ source: prop_data.source, edit_data: prop_data.id });
    // } else {
    //   this.setState({ edit_data: prop_data });
    // }
  }

  componentDidUpdate() {
    const {
      undervalue,
      balancingOpt,
      stateOpt,
      countryOpt,
      GSTTypeOpt,
      edit_data,
      isEditDataSet,
    } = this.state;
    console.log(
      "did update",
      undervalue,
      balancingOpt,
      stateOpt,
      countryOpt,
      GSTTypeOpt,
      edit_data,
      isEditDataSet
    );
    if (
      undervalue.length > 0 &&
      balancingOpt.length > 0 &&
      stateOpt.length > 0 &&
      countryOpt.length > 0 &&
      GSTTypeOpt.length > 0 &&
      isEditDataSet == false &&
      edit_data != ""
    ) {
      console.log("componentDidUpdate call");
      this.getLedgerDetails();
    }
  }
  addBankRow = (values, setFieldValue) => {
    console.log(" In AddBank function-->", values);
    let bankObj = {
      bid: values.id != 0 ? values.id : 0,
      bank_name: values.bank_name,
      bank_account_no: values.bank_account_no,
      bank_ifsc_code: values.bank_ifsc_code,
      bank_branch: values.bank_branch,
      index: values.index,
    };

    console.log(bankObj);
    let { bankList } = this.state;
    if (bankAccountNumber.test(bankObj.bank_account_no)) {
      if (ifsc_code_regex.test(bankObj.bank_ifsc_code)) {
        let old_lst = bankList;
        let is_updated = false;
        console.log("bankObj", bankObj);
        console.log("old_lst", old_lst);
        let obj = old_lst.filter((value) => {
          return value.bank_account_no === bankObj.bank_account_no;
        });
        console.log("obj", obj);
        let final_state = [];
        if (obj.length == 0) {
          if (values.index == -1) {
            final_state = old_lst.map((item) => {
              if (item.bank_account_no === bankObj.bank_account_no) {
                is_updated = true;
                const updatedItem = bankObj;
                return updatedItem;
              }
              return item;
            });
            console.log("is updated", is_updated);
            if (is_updated == false) {
              final_state = [...bankList, bankObj];
            }
            console.log({ final_state });
          } else {
            final_state = old_lst.map((item, i) => {
              if (i == values.index) {
                return bankObj;
              } else {
                return item;
              }
            });
          }
          console.log("final_state", final_state);

          this.setState({ bankList: final_state }, () => {
            setFieldValue("bid", "");
            setFieldValue("bank_name", "");
            setFieldValue("bank_account_no", "");
            setFieldValue("bank_ifsc_code", "");
            setFieldValue("bank_branch", "");
            setFieldValue("index", -1);
          });
        } else if (values.index != -1) {
          final_state = old_lst.map((item, i) => {
            if (i == values.index) {
              return bankObj;
            } else {
              return item;
            }
          });

          console.log("final_state", final_state);

          this.setState({ bankList: final_state }, () => {
            setFieldValue("bid", "");
            setFieldValue("bank_name", "");
            setFieldValue("bank_account_no", "");
            setFieldValue("bank_ifsc_code", "");
            setFieldValue("bank_branch", "");
            setFieldValue("index", -1);
          });
        } else {
          toast.warning("Bank Details are Already Exist !");
        }
      } else {
        toast.error("IFSC is not valid !");
      }
    } else {
      toast.error("AccountNo is not valid !");
    }
  };
  extract_pan_from_GSTIN = (gstinffield, setFieldValue) => {
    if (gstinffield.length >= 15) {
      console.log("gstin", gstinffield);
      let pan = gstinffield.substring(2, 12);
      setFieldValue("pan_no", pan);
    } else if (gstinffield.length == 0) {
      setFieldValue("pan_no", "");
    }
  };
  clearBankData = (setFieldValue) => {
    setFieldValue("index", -1);
    // setFieldValue("sid", "");
    // setFieldValue("bid", "");
    setFieldValue("bank_name", "");
    setFieldValue("bank_account_no", "");
    setFieldValue("bank_ifsc_code", "");
    setFieldValue("bank_branch", "");
  };

  render() {
    const {
      undervalue,
      balancingOpt,
      stateOpt,
      countryOpt,
      initVal,
      GSTTypeOpt,
      bankList,
      gstList,
      deptList,
      shippingList,
      billingList,
      rList,
      rBList,
      rSList,
      deptRList,

      removeGstList,
      removeDeptList,
      removeShippingList,
      removeBillingList,
      removebankList,
      areaLst,
      salesmanLst,
      ledgerObject,
    } = this.state;

    const validate = (values) => {
      const errors = {};
      let { underId } = values;
      let { ledger_form_parameter_slug } = underId;
      switch (ledger_form_parameter_slug) {
        case "sundry_debtors":
          if (!values.mailing_name) {
            errors.mailing_name = "required";
          }
          if (!values.ledger_name) {
            errors.ledger_name = "required";
          }
          if (!values.is_private) {
            errors.is_private = "required";
          }

          // if (!values.address) {
          //   errors.address = "Required";
          // }

          if (!values.city) {
            errors.city = "required";
          }
          // if (!values.salesrate) {
          //   errors.salesrate = "sales rate required";
          // }

          //  if (this.state.gstList.length <= 0) {
          // if (
          //   values.isTaxation
          //   // values.isTaxation.value == true
          //   // values.pan_no == ""
          // ) {
          //   errors.pan_no = "PAN required";
          // } else if (
          //   !values.pan_no == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.pan_no)
          // ) {
          //   errors.pan_no = "Invalid PAN No";
          // }
          //  }

          // if (

          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.registraion_type == ""
          // ) {
          //   errors.registraion_type = "Type required";
          // } else if (
          //   !values.registraion_type == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.registraion_type)
          // ) {
          //   errors.registraion_type = "Type required";
          // }
          console.log("gstList length", this.state.gstList.length);

          // if (
          //   values.isTaxation &&
          //   // values.isTaxation.value == true &&
          //   values.gstin == ""
          //   // this.state.gstList.length < 0
          // ) {
          //   errors.gstin = "Type required";
          // } else if (
          //   !values.gstin == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.gstin)
          // ) {
          //   errors.gstin = "Type required";
          // }

          // console.log(typeof values.credit_days);
          if (parseInt(values.credit_days) > 0) {
            console.log("values.applicable_from", values.applicable_from);
            if (!values.applicable_from) {
              errors.applicable_from = "required";
            }
          }
          // if (!values.opening_balance) {
          //   errors.opening_balance = "opening balance is required";
          // }

          // if (!values.pincode) {
          //   errors.pincode = "Required";
          // } else if (!/^[1-9][0-9]{5}$/i.test(values.pincode)) {
          //   errors.email_id = "pincode is invalid";
          // }
          if (!values.stateId) {
            errors.stateId = "required";
          }
          if (!values.countryId) {
            errors.countryId = "required";
          }

          // if (!values.isTaxation) {
          //   errors.isTaxation = "Required";
          // }
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == false &&
          //   values.pan_no == ""
          // ) {
          //   errors.pan_no = "Required";
          // } else if (
          //   !values.pan_no == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.pan_no)
          // ) {
          //   errors.pan_no = "Invalid Pan no";
          // }
          // if (values.email && values.email == "") {
          //   errors.email = "Invalid email address";
          // } else if (
          //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
          // ) {
          //   errors.email = "Invalid email address";
          // }
          // if (!values.phone_no) {
          //   errors.phone_no = "Required";
          // } else if (
          //   !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
          //     values.phone_no
          //   )
          // ) {
          //   errors.phone_no = "Invalid Mobile No.";
          // }
          // if (!values.mailing_name) {
          //   errors.mailing_name = "Mailing name is required";
          // } else if (!/^(([a-zA-Z\s]))+$/.test(values.mailing_name)) {
          //   errors.mailing_name = "Invalid Mailing Name.";
          // }
          // if (!values.contact_person) {
          //   errors.contact_person = "Contact name is required";
          // } else if (!/^(([a-zA-Z\s]))+$/.test(values.contact_person)) {
          //   errors.contact_person = "Invalid Contact Name.";
          // }
          // if (!values.contact_no) {
          //   errors.contact_no = "Required";
          // } else if (
          //   !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
          //     values.contact_no
          //   )
          // ) {
          //   errors.contact_no = "Invalid Mobile No.";
          // }
          // if (!values.gstin.length(15)) {
          //   errors.gstin = "Invalid GST NO";
          // }
          break;
        case "sundry_creditors":
          if (!values.ledger_name) {
            errors.ledger_name = "required";
          }

          // if (!values.ledger_name) {
          //   errors.ledger_name = "Ledger name is required";
          // } else if (!/^(([a-zA-Z\s]))+$/.test(values.ledger_name)) {
          //   errors.ledger_name = "Invalid Ledger Name.";
          // }
          // if (!values.supplier_code) {
          //   errors.supplier_code = "required";
          // }
          if (!values.is_private) {
            errors.is_private = " required";
          }
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.pan_no == ""
          // ) {
          //   errors.pan_no = "PAN required";
          // } else if (
          //   !values.pan_no == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.pan_no)
          // ) {
          //   errors.pan_no = "Invalid PAN No";
          // }

          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.registraion_type == ""
          // ) {
          //   errors.registraion_type = "Type required";
          // } else if (
          //   !values.registraion_type == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.registraion_type)
          // ) {
          //   errors.registraion_type = "Type required";
          // }

          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.gstin == ""
          // ) {
          //   errors.gstin = "Type required";
          // } else if (
          //   !values.gstin == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.gstin)
          // ) {
          //   errors.gstin = "Type required";
          // }

          // if (!values.opening_balance_type) {
          //   errors.opening_balance_type = "Selection is required";
          // }
          // if (!values.address) {
          //   errors.address = "Address field is required";
          // }
          // if (!values.pincode) {
          //   errors.pincode = "Required";
          // } else if (!/^[1-9][0-9]{5}$/i.test(values.pincode)) {
          //   errors.email_id = "pincode is invalid";
          // }
          if (!values.stateId) {
            errors.stateId = "required";
          }
          if (!values.countryId) {
            errors.countryId = "required";
          }
          if (!values.city) {
            errors.city = "required";
          }
          // if (!values.credit_days) {
          //   errors.credit_days = "Required";
          // }
          // if (!values.opening_balance) {
          //   errors.opening_balance = "Opening balance required";
          // }
          // if (!values.isTaxation) {
          //   errors.isTaxation = "Required";
          // }
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == false &&
          //   values.pan_no == ""
          // ) {
          //   errors.pan_no = "Required";
          // } else if (
          //   !values.pan_no == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.pan_no)
          // ) {
          //   errors.pan_no = "Invalid Pan no";
          // }
          // if (
          //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email_id)
          // ) {
          //   errors.email_id = "Invalid email address";
          // }
          // if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
          //   errors.email = "Invalid email address";
          // }
          // if (/^[0-9\b]+$/.test(values.phone_no)) {
          //   errors.phone_no = "Invalid Mobile No.";
          // }
          // if (!values.phone_no) {
          //   errors.phone_no = "Required";
          // } else if (
          //   !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
          //     values.phone_no
          //   )
          // ) {
          //   errors.phone_no = "Invalid Mobile No.";
          // }
          // if (!values.mailing_name) {
          //   errors.mailing_name = "Mailing name is required";
          // } else if (!/^(([a-zA-Z\s]))+$/.test(values.mailing_name)) {
          //   errors.mailing_name = "Invalid Mailing Name.";
          // }
          // if (!values.contact_person) {
          //   errors.contact_person = "Contact name is required";
          // } else if (!/^(([a-zA-Z\s]))+$/.test(values.contact_person)) {
          //   errors.contact_person = "Invalid Contact Name.";
          // }
          // if (!values.contact_no) {
          //   errors.contact_no = "Required";
          // } else if (
          //   !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
          //     values.contact_no
          //   )
          // ) {
          //   errors.contact_no = "Invalid Mobile No.";
          // }
          break;
        case "bank_account":
          if (!values.ledger_name) {
            errors.ledger_name = "required";
          }
          if (!values.is_private) {
            errors.is_private = "required";
          }
          // if (!values.opening_balance) {
          //   errors.opening_balance = "Selection is required";
          // }
          // if (!values.pincode) {
          //   errors.pincode = "Required";
          // } else if (!/^[1-9][0-9]{5}$/i.test(values.pincode)) {
          //   errors.email_id = "pincode is invalid";
          // }
          // if (!values.bank_account_no) {
          //   errors.bank_account_no = "required";
          // }
          // if (!values.bank_name) {
          //   errors.bank_name = "required";
          // }
          // if (!values.bank_branch) {
          //   errors.bank_branch = "required";
          // }
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.gstin == ""
          // ) {
          //   errors.gstin = "required";
          // } else if (
          //   !values.gstin == "" &&
          //   !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(
          //     values.gstin
          //   )
          // ) {
          //   errors.gstin = "Invalid GSTIN no";
          // }
          // if (values.bank_ifsc_code == "") {
          //   errors.bank_ifsc_code = "Required";
          // } else if (
          //   !values.bank_ifsc_code == "" &&
          //   !/^[A-Za-z]{4}[0-9]{7}$/i.test(values.bank_ifsc_code)
          // ) {
          //   errors.bank_ifsc_code = "Invalid IFSC CODE";
          // }
          // if (!values.stateId) {
          //   errors.stateId = "Required";
          // }
          // if (!values.countryId) {
          //   errors.countryId = "Required";
          // }
          // if (!values.opening_balance_type) {
          //   errors.opening_balance_type = "Selection is required";
          // }
          // if (!values.phone_no) {
          //   errors.phone_no = "Required";
          // } else if (
          //   !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
          //     values.phone_no
          //   )
          // ) {
          //   errors.phone_no = "Invalid Mobile No.";
          // }
          // if (!values.isTaxation) {
          //   errors.isTaxation = "Required";
          // }
          // if (
          //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email_id)
          // ) {
          //   errors.email_id = "Invalid email address";
          // }
          break;
        case "duties_taxes":
          if (!values.ledger_name) {
            errors.ledger_name = "Ledger name is required";
          }
          if (!values.tax_type) {
            errors.tax_type = "Tax type is required";
          }
          if (!values.is_private) {
            errors.is_private = "Ledger type is required";
          }
          break;
        case "assets":
          {
            if (!values.ledger_name) {
              errors.ledger_name = "Ledger name is required";
            }
          }
          if (!values.is_private) {
            errors.is_private = "Ledger type is required";
          }
          // if (!values.opening_balance) {
          //   errors.opening_balance = "Opening balance required";
          // }
          break;
        case "others":
          {
            if (!values.ledger_name) {
              errors.ledger_name = "Ledger name is required";
            }
          }
          if (!values.is_private) {
            errors.is_private = "Ledger type is required";
          }
      }
      return errors;
    };

    const getUnderVal = (val) => {
      console.log("in getUnderVal");
      console.log(val);
      // console.log(undervalue);
      // Specify the ledger_form_parameter_slug you want to search for
      const targetPrincipleName = "Fixed Assets"; // Change this to the desired ledger_form_parameter_slug

      // Use the find method to locate the object with the matching ledger_form_parameter_slug
      const foundObject = undervalue.find(
        (obj) => obj.ledger_form_parameter_slug === val
      );

      if (foundObject) {
        // If an object with the specified ledger_form_parameter_slug is found, you can access it here
        console.log("found->");
        console.log(foundObject);
        return foundObject;
      } else {
        console.log("Principle not found.");
      }

      // return 10
    };

    const getType = (val) => {
      if (val === "Dr") {
        return "dr";
      } else if (val === "Cr") {
        return "cr";
      }
    };

    const getTaxType = (val) => {

      console.log(val);
      if (val === "central_tax") {
        return "Central Tax";
      } else if (val === "state_tax") {
        return "State Tax";
      } else if (val === "integrated_tax") {
        return "Integrated Tax";
      }
    };

    return (
      <div>
        <div className="emp">
          <Card className="mb-0">
            <CardBody className="border-bottom p-2">
              <div style={{ background: "#cee7f1", padding: "10px" }}>
                <CardTitle>Edit Ledger</CardTitle>
                <Formik
                  // validateOnBlur={false}
                  validateOnChange={false}
                  enableReinitialize={true}
                  initialValues={{
                    id: "",
                    bId: 0,
                    district: "",
                    shipping_address: "",
                    // ledger_name: "",
                    // underId: "",
                    associates_id: "",
                    associates_group_name: "",
                    // supplier_code: getRandomIntInclusive(1, 1000),
                    // opening_balance: 0,
                    is_private: "false",
                    gst_detail_id: "",
                    shipping_detail_id: "",
                    billing_details_id: "",
                    depart_details_id: "",
                    salesmanId: "",
                    areaId: "",
                    ledger_name:
                      ledgerObject != null ? ledgerObject.ledger_name : "",
                    supplier_code:
                      ledgerObject != null ? ledgerObject.supplier_code : "",

                    // underId:ledgerObject != null ? ledgerObject.under_id : "",
                    opening_balance:
                      ledgerObject != null ? ledgerObject.opening_bal : 0,
                    opening_balance_type:
                      ledgerObject != null
                        ? getType(ledgerObject.opening_bal_type)
                        : "",
                    tax_type:
                      ledgerObject != null
                        ? getTaxType(ledgerObject.tax_type)
                        : "",

                    bank_name:
                      ledgerObject != null ? ledgerObject.bank_name : "",
                    bank_account_no:
                      ledgerObject != null ? ledgerObject.account_no : "",

                    bank_ifsc_code:
                      ledgerObject != null ? ledgerObject.ifsc_code : "",
                    bank_branch:
                      ledgerObject != null ? ledgerObject.bank_branch : "",
                    dfSelect:
                      ledgerObject != null ? ledgerObject.principle_name : "",
                    underId:
                      ledgerObject != null
                        ? getUnderVal(ledgerObject.ledger_form_parameter_slug)
                        : "",
                    // underId:ledgerObject != null ? undervalue[10] : "",

                    // isAllowance:
                    //   ledgerObject != null ? ledgerObject.isAllowance : "",
                    // amount: ledgerObject != null ? ledgerObject.amount : "", W
                  }}
                  innerRef={this.myRef}
                  validationSchema={Yup.object().shape({
                    // associates_group_name: Yup.string()
                    //   .trim()
                    //   .required("Ledger group name is required"),
                    // underId: Yup.object()
                    //   .nullable()
                    //   .required("Select under type"),
                  })}
                  // validate={validate}
                  onSubmit={(values, { resetForm }) => {
                    // debugger;
                    console.log("values-->", { values, removeGstList });
                    const formData = new FormData();
                    console.log("==>" + values.id);
                    console.log(this.props.location.state.id);

                    formData.append("id", this.props.location.state.id);

                    if (values.underId && values.underId.under_prefix != null) {
                      formData.append(
                        "under_prefix",
                        values.underId ? values.underId.under_prefix : ""
                      );
                    }

                    if (
                      values.underId &&
                      values.underId.associates_id != null
                    ) {
                      formData.append(
                        "associates_id",
                        values.underId ? values.underId.associates_id : ""
                      );
                    }
                    if (
                      values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "sundry_debtors"
                    ) {
                      if (values.ledger_name != null) {
                        formData.append(
                          "ledger_name",
                          values.ledger_name ? values.ledger_name : ""
                        );
                      }
                      if (values.doa != null && undefined) {
                        formData.append("doa", values.doa);
                      }
                      if (values.route != null) {
                        formData.append("route", values.route);
                      }
                      if (values.salesmanId != null) {
                        // formData.append("salesman", values.salesman);
                        formData.append("salesman", values.salesmanId.value);
                      }
                      if (values.areaId != null) {
                        //formData.append("area", values.area);
                        formData.append("area", values.areaId.value);
                      }
                      if (values.supplier_code != null) {
                        formData.append("supplier_code", values.supplier_code);
                      }
                      if (
                        values.underId &&
                        values.underId.sub_principle_id != null
                      ) {
                        formData.append(
                          "principle_group_id",
                          values.underId.sub_principle_id
                            ? values.underId.sub_principle_id
                            : ""
                        );
                      }
                      if (
                        values.underId &&
                        values.underId.principle_id != null
                      ) {
                        formData.append(
                          "principle_id",
                          values.underId.principle_id
                            ? values.underId.principle_id
                            : ""
                        );
                      }

                      if (
                        values.tradeOfBusiness != null &&
                        values.tradeOfBusiness != "" &&
                        values.tradeOfBusiness != undefined
                      ) {
                        formData.append("businessType", values.tradeOfBusiness);
                      }
                      if (
                        values.natureOfBusiness != null &&
                        values.natureOfBusiness != "" &&
                        values.natureOfBusiness != undefined
                      ) {
                        formData.append(
                          "businessTrade",
                          values.natureOfBusiness
                        );
                      }

                      if (values.licenseNo != null && values.licenseNo != "") {
                        formData.append("licenseNo", values.licenseNo);
                      }
                      if (
                        values.license_expiry != null &&
                        values.license_expiry != ""
                      ) {
                        let fexp = moment(
                          values.license_expiry,
                          "DD/MM/YYYY"
                        ).toDate();
                        formData.append(
                          "licenseExpiryDate",
                          moment(new Date(fexp)).format("yyyy-MM-DD")
                        );
                      }

                      if (values.fssai != null) {
                        formData.append("fssai", values.fssai);
                      }
                      if (
                        values.fssai_expiry != null &&
                        values.fssai_expiry != ""
                      ) {
                        let fexp = moment(
                          values.fssai_expiry,
                          "DD/MM/YYYY"
                        ).toDate();
                        formData.append(
                          "foodLicenseExpiryDate",
                          moment(new Date(fexp)).format("yyyy-MM-DD")
                        );
                      }

                      if (values.drug_license_no != null) {
                        formData.append(
                          "drug_license_no",
                          values.drug_license_no
                        );
                      }
                      if (
                        values.drug_expiry != null &&
                        values.drug_expiry != ""
                      ) {
                        let dexp = moment(
                          values.drug_expiry,
                          "DD/MM/YYYY"
                        ).toDate();
                        formData.append(
                          "drug_expiry",
                          moment(new Date(dexp)).format("yyyy-MM-DD")
                        );
                      }

                      if (
                        values.mfg_license_no != null &&
                        values.mfg_license_no != ""
                      ) {
                        formData.append(
                          "manufacturingLicenseNo",
                          values.mfg_license_no
                        );
                      }
                      if (
                        values.mfg_expiry != null &&
                        values.mfg_expiry != ""
                      ) {
                        let dexp = moment(
                          values.mfg_expiry,
                          "DD/MM/YYYY"
                        ).toDate();
                        formData.append(
                          "manufacturingLicenseExpiry",
                          moment(new Date(dexp)).format("yyyy-MM-DD")
                        );
                      }

                      if (values.dob != null && values.dob != "") {
                        let dexp = moment(values.dob, "DD/MM/YYYY").toDate();
                        formData.append(
                          "dob",
                          moment(new Date(dexp)).format("yyyy-MM-DD")
                        );
                      }
                      if (values.doa != null && values.doa != "") {
                        let dexp = moment(values.doa, "DD/MM/YYYY").toDate();
                        formData.append(
                          "anniversary",
                          moment(new Date(dexp)).format("yyyy-MM-DD")
                        );
                      }

                      if (
                        values.underId &&
                        values.underId.ledger_form_parameter_id != null
                      ) {
                        formData.append(
                          "underId",
                          values.underId.ledger_form_parameter_id
                            ? values.underId.ledger_form_parameter_id
                            : ""
                        );
                      }
                      if (values.mailing_name != null) {
                        formData.append("mailing_name", values.mailing_name);
                      }
                      formData.append(
                        "opening_bal_type",
                        values.opening_balance_type
                          ? values.opening_balance_type == "dr"
                            ? "Dr"
                            : "Cr"
                          : "Dr"
                      );
                      formData.append(
                        "opening_bal",
                        values.opening_balance ? values.opening_balance : 0
                      );
                      if (values.opening_balancing_method != null) {
                        formData.append(
                          "balancing_method",
                          values.opening_balancing_method.value
                        );
                      }
                      if (values.address != null) {
                        formData.append("address", values.address);
                      }
                      if (values.stateId != null) {
                        formData.append(
                          "state",
                          values.stateId
                            ? values.stateId != ""
                              ? values.stateId.value
                              : 0
                            : 0
                        );
                      }
                      if (values.countryId != "" && values.countryId != null) {
                        formData.append(
                          "country",
                          values.countryId
                            ? values.countryId != ""
                              ? values.countryId.value
                              : 0
                            : 0
                        );
                      }
                      if (values.pincode != null && values.pincode != "") {
                        formData.append("pincode", values.pincode);
                      }
                      if (values.city != null) {
                        formData.append("city", values.city);
                      }
                      if (values.email_id && values.email_id != null) {
                        formData.append("email", values.email_id);
                      }
                      if (values.phone_no != null) {
                        formData.append("mobile_no", values.phone_no);
                      }
                      if (
                        values.credit_days != null &&
                        values.credit_days != "" &&
                        values.credit_days != undefined
                      ) {
                        formData.append("credit_days", values.credit_days);
                        if (values.applicable_from != null) {
                          formData.append(
                            "applicable_from",
                            values.applicable_from.label
                          );
                        }
                      }

                      if (
                        values.credit_bills != null &&
                        values.credit_bills != "" &&
                        values.credit_bills != undefined
                      ) {
                        formData.append("creditNumBills", values.credit_bills);
                      }

                      if (
                        values.credit_values != null &&
                        values.credit_values != "" &&
                        values.credit_values != undefined
                      ) {
                        formData.append(
                          "creditBillValue",
                          values.credit_values
                        );
                      }

                      if (values.salesrate && values.salesrate != null) {
                        formData.append("salesrate", values.salesrate.value);
                      }
                      if (values.fssai != null) {
                        formData.append("fssai", values.fssai);
                      }
                      if (values.isTaxation != null) {
                        formData.append("taxable", values.isTaxation.value);
                      }

                      let gstdetails = [];
                      if (values.isTaxation.value == true) {
                        if (values.registraion_type != null) {
                          formData.append(
                            "registration_type",
                            values.registraion_type.value
                          );
                        }
                        // console.log("gst", JSON.stringify(gstList));

                        gstdetails = gstList.map((v, i) => {
                          let obj = {};
                          if (v.id != "" && v.id != null) {
                            obj["bid"] = v.id;
                          } else {
                            obj["bid"] = 0;
                          }
                          obj["gstin"] = v.gstin;

                          if (
                            v.dateofregistartion != "" &&
                            v.dateofregistartion != null
                          ) {
                            let pandateofregistration = moment(
                              v.dateofregistartion,
                              "DD/MM/YYYY"
                            ).toDate();
                            obj["dateofregistartion"] = moment(
                              new Date(pandateofregistration)
                            ).format("yyyy-MM-DD");
                          }

                          if (v.pan_no != "") obj["pancard"] = v.pan_no;

                          return obj;
                        });
                      }

                      formData.append("gstdetails", JSON.stringify(gstdetails));
                      let gstremoveddetails = [];

                      gstremoveddetails = rList.map((v) => v.id);
                      console.log("RLIST ------>", rList);

                      console.log("GSTDETAILS", gstremoveddetails);
                      // gstList

                      // formData.append("gstdetails", JSON.stringify(gstdetails));
                      formData.append(
                        "removeGstList",
                        JSON.stringify(gstremoveddetails)
                      );

                      let billingDetails = billingList.map((v, i) => {
                        return {
                          district: v.b_district,
                          billing_address: v.billing_address,
                        };
                      });

                      formData.append(
                        "billingDetails",
                        JSON.stringify(billingDetails)
                      );
                      let billingremovedlist = [];
                      billingremovedlist = rBList.map((v) => v.id);
                      console.log("Removed billing", billingremovedlist);
                      formData.append(
                        "removeBillingList",
                        JSON.stringify(billingremovedlist)
                      );

                      let shippingDetail = [];
                      shippingDetail = shippingList.map((v, i) => {
                        let obj = {};
                        if (v.id != "" && v.id != null) {
                          obj["sid"] = v.id;
                        } else {
                          obj["sid"] = 0;
                        }
                        obj["district"] = v.district;

                        if (v.shipping_address != "")
                          obj["shipping_address"] = v.shipping_address;
                        console.log("obj", obj);
                        return obj;
                      });
                      console.log("shippingDetail", shippingDetail);
                      formData.append(
                        "shippingDetails",
                        JSON.stringify(shippingDetail)
                      );
                      let shipremovedlist = [];
                      shipremovedlist = rSList.map((v) => v.id);
                      console.log("Removed Ship List->", rSList);
                      formData.append(
                        "removeShippingList",
                        JSON.stringify(shipremovedlist)
                      );

                      let deptDetails = [];
                      deptDetails = deptList.map((v, i) => {
                        let obj = {};
                        if (v.id != "" && v.id != null) {
                          obj["did"] = v.id;
                        } else {
                          obj["did"] = 0;
                        }
                        obj["dept"] = v.dept;
                        obj["contact_person"] = v.contact_person;
                        obj["contact_no"] = v.contact_no;

                        if (v.email != "") obj["email"] = v.email;

                        return obj;
                      });
                      formData.append(
                        "deptDetails",
                        JSON.stringify(deptDetails)
                      );
                      console.log("deptDetails", JSON.stringify(deptDetails));
                      let deptRemovedList = [];
                      deptRemovedList = deptRList.map((v) => v.id);
                      console.log("Removed Dept List->", deptRList);
                      formData.append(
                        "removeDeptList",
                        JSON.stringify(deptRemovedList)
                      );
                    }

                    // if (
                    //   values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    //   "sundry_creditors"
                    // ) {
                    //   if (values.ledger_name != null) {
                    //     formData.append(
                    //       "ledger_name",
                    //       values.ledger_name ? values.ledger_name : ""
                    //     );
                    //   }
                    //   if (values.supplier_code != null) {
                    //     formData.append("supplier_code", values.supplier_code);
                    //   }
                    //   if (
                    //     values.underId.sub_principle_id &&
                    //     values.underId.sub_principle_id != ""
                    //   ) {
                    //     formData.append(
                    //       "principle_group_id",
                    //       values.underId.sub_principle_id
                    //     );
                    //   }
                    //   if (
                    //     values.underId.principle_id &&
                    //     values.underId.principle_id != ""
                    //   ) {
                    //     formData.append(
                    //       "principle_id",
                    //       values.underId.principle_id
                    //     );
                    //   }
                    //   if (values.supplier_code != null) {
                    //     formData.append("supplier_code", values.supplier_code);
                    //   }
                    //   if (
                    //     values.underId.ledger_form_parameter_id &&
                    //     values.underId.ledger_form_parameter_id != ""
                    //   ) {
                    //     formData.append(
                    //       "underId",
                    //       values.underId.ledger_form_parameter_id
                    //     );
                    //   }
                    //   if (values.mailing_name != null) {
                    //     formData.append("mailing_name", values.mailing_name);
                    //   }

                    //   formData.append(
                    //     "opening_bal_type",
                    //     values.opening_balance_type
                    //       ? values.opening_balance_type == "dr"
                    //         ? "Dr"
                    //         : "Cr"
                    //       : "Dr"
                    //   );
                    //   formData.append(
                    //     "opening_bal",
                    //     values.opening_balance ? values.opening_balance : 0
                    //   );

                    //   if (values.opening_balancing_method != null) {
                    //     formData.append(
                    //       "balancing_method",
                    //       values.opening_balancing_method.value
                    //     );
                    //   }

                    //   if (values.address != null) {
                    //     formData.append("address", values.address);
                    //   }

                    //   if (values.stateId != "" && values.stateId != null) {
                    //     formData.append(
                    //       "state",
                    //       values.stateId
                    //         ? values.stateId != ""
                    //           ? values.stateId.value
                    //           : 0
                    //         : 0
                    //     );
                    //   }

                    //   if (values.countryId != "" && values.countryId != null) {
                    //     formData.append(
                    //       "country",
                    //       values.countryId
                    //         ? values.countryId != ""
                    //           ? values.countryId.value
                    //           : 0
                    //         : 0
                    //     );
                    //   }

                    //   if (values.pincode != null && values.pincode != "") {
                    //     formData.append("pincode", values.pincode);
                    //   }

                    //   if (values.city != null) {
                    //     formData.append("city", values.city);
                    //   }
                    //   if (values.email_id != "" && values.email_id != null) {
                    //     formData.append("email", values.email_id);
                    //   }

                    //   if (values.phone_no != null) {
                    //     formData.append(
                    //       "mobile_no",
                    //       values.phone_no ? values.phone_no : 0
                    //     );
                    //   }
                    //   if (values.tcs == "true") {
                    //     formData.append(
                    //       "tcs_applicable_date",
                    //       moment(values.tcs_applicable_date).format(
                    //         "YYYY-MM-DD"
                    //       )
                    //     );
                    //   }
                    //   if (
                    //     values.tradeOfBusiness != null &&
                    //     values.tradeOfBusiness != "" &&
                    //     values.tradeOfBusiness != undefined
                    //   ) {
                    //     formData.append("businessType", values.tradeOfBusiness);
                    //   }
                    //   if (
                    //     values.natureOfBusiness != null &&
                    //     values.natureOfBusiness != "" &&
                    //     values.natureOfBusiness != undefined
                    //   ) {
                    //     formData.append(
                    //       "businessTrade",
                    //       values.natureOfBusiness
                    //     );
                    //   }
                    //   if (
                    //     values.credit_days != null &&
                    //     values.credit_days != "" &&
                    //     values.credit_days != undefined
                    //   ) {
                    //     formData.append("credit_days", values.credit_days);
                    //     if (values.applicable_from != null) {
                    //       formData.append(
                    //         "applicable_from",
                    //         values.applicable_from.label
                    //       );
                    //     }
                    //   }

                    //   if (
                    //     values.credit_bills != null &&
                    //     values.credit_bills != "" &&
                    //     values.credit_bills != undefined
                    //   ) {
                    //     formData.append("creditNumBills", values.credit_bills);
                    //   }

                    //   if (
                    //     values.credit_values != null &&
                    //     values.credit_values != "" &&
                    //     values.credit_values != undefined
                    //   ) {
                    //     formData.append(
                    //       "creditBillValue",
                    //       values.credit_values
                    //     );
                    //   }

                    //   if (values.licenseNo != null && values.licenseNo != "") {
                    //     formData.append("licenseNo", values.licenseNo);
                    //   }
                    //   if (
                    //     values.license_expiry != null &&
                    //     values.license_expiry != ""
                    //   ) {
                    //     let fexp = moment(
                    //       values.license_expiry,
                    //       "DD/MM/YYYY"
                    //     ).toDate();
                    //     formData.append(
                    //       "licenseExpiryDate",
                    //       moment(new Date(fexp)).format("yyyy-MM-DD")
                    //     );
                    //   }

                    //   if (values.fssai != null) {
                    //     formData.append("fssai", values.fssai);
                    //   }
                    //   if (
                    //     values.fssai_expiry != null &&
                    //     values.fssai_expiry != ""
                    //   ) {
                    //     let fexp = moment(
                    //       values.fssai_expiry,
                    //       "DD/MM/YYYY"
                    //     ).toDate();
                    //     formData.append(
                    //       "foodLicenseExpiryDate",
                    //       moment(new Date(fexp)).format("yyyy-MM-DD")
                    //     );
                    //   }
                    //   if (values.drug_license_no != null) {
                    //     formData.append(
                    //       "drug_license_no",
                    //       values.drug_license_no
                    //     );
                    //   }
                    //   if (
                    //     values.drug_expiry != null &&
                    //     values.drug_expiry != ""
                    //   ) {
                    //     let dexp = moment(
                    //       values.drug_expiry,
                    //       "DD/MM/YYYY"
                    //     ).toDate();
                    //     formData.append(
                    //       "drug_expiry",
                    //       moment(new Date(dexp)).format("yyyy-MM-DD")
                    //     );
                    //   }

                    //   if (
                    //     values.mfg_license_no != null &&
                    //     values.mfg_license_no != ""
                    //   ) {
                    //     formData.append(
                    //       "manufacturingLicenseNo",
                    //       values.mfg_license_no
                    //     );
                    //   }
                    //   if (
                    //     values.mfg_expiry != null &&
                    //     values.mfg_expiry != ""
                    //   ) {
                    //     let dexp = moment(
                    //       values.mfg_expiry,
                    //       "DD/MM/YYYY"
                    //     ).toDate();
                    //     formData.append(
                    //       "manufacturingLicenseExpiry",
                    //       moment(new Date(dexp)).format("yyyy-MM-DD")
                    //     );
                    //   }
                    //   if (values.dob != null && values.dob != "") {
                    //     let dexp = moment(values.dob, "DD/MM/YYYY").toDate();
                    //     formData.append(
                    //       "dob",
                    //       moment(new Date(dexp)).format("yyyy-MM-DD")
                    //     );
                    //   }
                    //   if (values.doa != null && values.doa != "") {
                    //     let dexp = moment(values.doa, "DD/MM/YYYY").toDate();
                    //     formData.append(
                    //       "anniversary",
                    //       moment(new Date(dexp)).format("yyyy-MM-DD")
                    //     );
                    //   }

                    //   if (values.isTaxation != null) {
                    //     formData.append("taxable", values.isTaxation.value);
                    //   }
                    //   if (values.pan_no != null) {
                    //     formData.append("pan_no", values.pan_no);
                    //   }

                    //   let gstdetails = [];
                    //   if (values.isTaxation.value == true) {
                    //     if (values.registraion_type != null) {
                    //       formData.append(
                    //         "registration_type",
                    //         values.registraion_type.value
                    //       );
                    //     }
                    //     console.log("gst", JSON.stringify(gstList));

                    //     gstdetails = gstList.map((v, i) => {
                    //       let obj = {};
                    //       if (v.id != "" && v.id != null) {
                    //         obj["bid"] = v.id;
                    //       } else {
                    //         obj["bid"] = 0;
                    //       }
                    //       obj["gstin"] = v.gstin;

                    //       if (
                    //         v.dateofregistartion != "" &&
                    //         v.dateofregistartion != null
                    //       ) {
                    //         let pandateofregistration = moment(
                    //           v.dateofregistartion,
                    //           "DD/MM/YYYY"
                    //         ).toDate();
                    //         obj["dateofregistartion"] = moment(
                    //           new Date(pandateofregistration)
                    //         ).format("yyyy-MM-DD");
                    //       }

                    //       if (v.pan_no != "") obj["pancard"] = v.pan_no;

                    //       return obj;
                    //     });
                    //   }

                    //   console.log({ gstdetails });

                    //   formData.append("gstdetails", JSON.stringify(gstdetails));
                    //   let gstremoveddetails = [];

                    //   gstremoveddetails = rList.map((v) => v.id);
                    //   console.log("RLIST ------>", rList);

                    //   console.log("GSTDETAILS", gstremoveddetails);
                    //   // gstList

                    //   // formData.append("gstdetails", JSON.stringify(gstdetails));
                    //   formData.append(
                    //     "removeGstList",
                    //     JSON.stringify(gstremoveddetails)
                    //   );

                    //   let billingDetails = billingList.map((v, i) => {
                    //     let obj = {};
                    //     if (v.id != "" && v.id != null) {
                    //       obj["id"] = v.id;
                    //     } else {
                    //       obj["id"] = 0;
                    //     }
                    //     obj["district"] = v.district;
                    //     obj["billing_address"] = v.billing_address;
                    //     return obj;
                    //   });

                    //   formData.append(
                    //     "billingDetails",
                    //     JSON.stringify(billingDetails)
                    //   );
                    //   let billingremovedlist = [];
                    //   billingremovedlist = rBList.map((v) => v.id);
                    //   console.log("Removed billing", billingremovedlist);
                    //   formData.append(
                    //     "removeBillingList",
                    //     JSON.stringify(billingremovedlist)
                    //   );

                    //   let shippingDetail = [];
                    //   shippingDetail = shippingList.map((v, i) => {
                    //     let obj = {};
                    //     if (v.id != "" && v.id != null) {
                    //       obj["sid"] = v.id;
                    //     } else {
                    //       obj["sid"] = 0;
                    //     }
                    //     obj["district"] = v.district;

                    //     if (v.shipping_address != "")
                    //       obj["shipping_address"] = v.shipping_address;
                    //     console.log("obj", obj);
                    //     return obj;
                    //   });
                    //   console.log("shippingDetail", shippingDetail);
                    //   formData.append(
                    //     "shippingDetails",
                    //     JSON.stringify(shippingDetail)
                    //   );
                    //   let shipremovedlist = [];
                    //   shipremovedlist = rSList.map((v) => v.id);
                    //   console.log("Removed Ship List->", rSList);
                    //   formData.append(
                    //     "removeShippingList",
                    //     JSON.stringify(shipremovedlist)
                    //   );

                    //   let deptDetails = [];
                    //   deptDetails = deptList.map((v, i) => {
                    //     let obj = {};
                    //     if (v.id != "" && v.id != null) {
                    //       obj["did"] = v.id;
                    //     } else {
                    //       obj["did"] = 0;
                    //     }
                    //     obj["dept"] = v.dept;
                    //     obj["contact_person"] = v.contact_person;
                    //     obj["contact_no"] = v.contact_no;

                    //     if (v.email != "") obj["email"] = v.email;

                    //     return obj;
                    //   });
                    //   formData.append(
                    //     "deptDetails",
                    //     JSON.stringify(deptDetails)
                    //   );
                    //   let deptRemovedList = [];
                    //   deptRemovedList = deptRList.map((v) => v.id);
                    //   console.log("Removed Dept List->", deptRList);
                    //   formData.append(
                    //     "removeDeptList",
                    //     JSON.stringify(deptRemovedList)
                    //   );

                    //   console.log("deptDetails", JSON.stringify(deptDetails));
                    //   console.log("bankList", JSON.stringify(bankList));

                    //   formData.append("bankDetails", JSON.stringify(bankList));
                    //   let bankRemovedlist = [];
                    //   bankRemovedlist = removebankList.map((v) => v.bid);
                    //   console.log(
                    //     "Bank Removed billing",
                    //     bankRemovedlist,
                    //     removebankList
                    //   );
                    //   formData.append(
                    //     "removeBankList",
                    //     JSON.stringify(bankRemovedlist)
                    //   );

                    // }
                    if (
                      values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "bank_account"
                    ) {
                      if (values.ledger_name != null) {
                        formData.append(
                          "ledger_name",
                          values.ledger_name ? values.ledger_name : ""
                        );
                      }
                      if (
                        values.underId.sub_principle_id &&
                        values.underId.sub_principle_id != ""
                      ) {
                        formData.append(
                          "principle_group_id",
                          values.underId.sub_principle_id
                        );
                      }
                      if (
                        values.underId.principle_id &&
                        values.underId.principle_id != ""
                      ) {
                        formData.append(
                          "principle_id",
                          values.underId.principle_id
                        );
                      }
                      if (
                        values.underId.ledger_form_parameter_id &&
                        values.underId.ledger_form_parameter_id != ""
                      ) {
                        formData.append(
                          "underId",
                          values.underId.ledger_form_parameter_id
                        );
                      }

                      formData.append(
                        "opening_bal_type",
                        values.opening_balance_type
                          ? values.opening_balance_type == "dr"
                            ? "Dr"
                            : "Cr"
                          : "Dr"
                      );
                      if (values.isTaxation != null) {
                        formData.append("taxable", values.isTaxation.value);
                      }

                      // if (values.isTaxation.value == true) {
                      //   formData.append("gstin", values.gstin);
                      // }
                      formData.append(
                        "opening_bal",
                        values.opening_balance ? values.opening_balance : 0
                      );

                      // if (values.address != null) {
                      //   formData.append("address", values.address);
                      // }

                      // if (values.stateId != "" && values.stateId != null) {
                      //   formData.append(
                      //     "state",
                      //     values.stateId
                      //       ? values.stateId != ""
                      //         ? values.stateId.value
                      //         : 0
                      //       : 0
                      //   );
                      // }

                      // if (values.countryId != "" && values.countryId != null) {
                      //   formData.append(
                      //     "country",
                      //     values.countryId
                      //       ? values.countryId != ""
                      //         ? values.countryId.value
                      //         : 0
                      //       : 0
                      //   );
                      // }
                      // if (values.pincode != null && values.pincode != "") {
                      //   formData.append("pincode", values.pincode);
                      // }
                      // if (values.city != null) {
                      //   formData.append("city", values.city);
                      // }

                      // if (values.email_id != "" && values.email_id) {
                      //   formData.append("email", values.email_id);
                      // }
                      // if (values.phone_no != null)
                      //   formData.append("mobile_no", values.phone_no);

                      if (values.isTaxation != null) {
                        formData.append("taxable", values.isTaxation.value);
                      }
                      // if (values.isTaxation == "true") {
                      //   formData.append("gstin", values.gstin);

                      // }

                      if (values.bank_name != null) {
                        formData.append("bank_name", values.bank_name);
                      }
                      if (values.bank_account_no != null) {
                        formData.append("account_no", values.bank_account_no);
                      }
                      if (values.bank_ifsc_code != null) {
                        formData.append("ifsc_code", values.bank_ifsc_code);
                      }
                      if (values.bank_branch != null) {
                        formData.append("bank_branch", values.bank_branch);
                      }
                    }

                    if (
                      values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "duties_taxes"
                    ) {
                      formData.append(
                        "opening_bal_type",
                        values.opening_balance_type
                          ? values.opening_balance_type == "dr"
                            ? "Dr"
                            : "Cr"
                          : "Dr"
                      );
                      if (values.ledger_name != null) {
                        formData.append("ledger_name", values.ledger_name);
                      }

                      if (
                        values.underId.sub_principle_id &&
                        values.underId.sub_principle_id != ""
                      ) {
                        formData.append(
                          "principle_group_id",
                          values.underId.sub_principle_id
                        );
                      }
                      if (
                        values.underId.principle_id &&
                        values.underId.principle_id != ""
                      ) {
                        formData.append(
                          "principle_id",
                          values.underId.principle_id
                        );
                      }
                      if (
                        values.underId.ledger_form_parameter_id &&
                        values.underId.ledger_form_parameter_id != ""
                      ) {
                        formData.append(
                          "underId",
                          values.underId.ledger_form_parameter_id
                        );
                      }
                      if (values.tax_type != null) {
                        formData.append("tax_type", values.tax_type);
                      }
                    }
                    if (
                      values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "assets"
                    ) {
                      if (values.ledger_name != null) {
                        formData.append("ledger_name", values.ledger_name);
                      }

                      if (
                        values.underId.sub_principle_id &&
                        values.underId.sub_principle_id != ""
                      ) {
                        formData.append(
                          "principle_group_id",
                          values.underId.sub_principle_id
                        );
                      }
                      if (
                        values.underId.principle_id &&
                        values.underId.principle_id != ""
                      ) {
                        formData.append(
                          "principle_id",
                          values.underId.principle_id
                        );
                      }
                      if (
                        values.underId.ledger_form_parameter_id &&
                        values.underId.ledger_form_parameter_id != ""
                      ) {
                        formData.append(
                          "underId",
                          values.underId.ledger_form_parameter_id
                        );
                      }
                      formData.append(
                        "opening_bal_type",
                        values.opening_balance_type
                          ? values.opening_balance_type == "dr"
                            ? "Dr"
                            : "Cr"
                          : "Dr"
                      );
                      formData.append(
                        "opening_bal",
                        values.opening_balance ? values.opening_balance : 0
                      );
                    }

                    if (
                      values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "others"
                    ) {
                      formData.append(
                        "opening_bal_type",
                        values.opening_balance_type
                          ? values.opening_balance_type == "dr"
                            ? "Dr"
                            : "Cr"
                          : "Dr"
                      );
                      
                      if (values.ledger_name != null) {
                        formData.append("ledger_name", values.ledger_name);
                      }
                      if (
                        values.underId.sub_principle_id &&
                        values.underId.sub_principle_id != ""
                      ) {
                        formData.append(
                          "principle_group_id",
                          values.underId.sub_principle_id
                        );
                      }
                      if (
                        values.underId.principle_id &&
                        values.underId.principle_id != ""
                      ) {
                        formData.append(
                          "principle_id",
                          values.underId.principle_id
                        );
                      }
                      if (
                        values.underId.ledger_form_parameter_id &&
                        values.underId.ledger_form_parameter_id != ""
                      ) {
                        formData.append(
                          "underId",
                          values.underId.ledger_form_parameter_id
                        );
                      }
                      if (values.address != null) {
                        formData.append("address", values.address);
                      }
                      if (values.stateId != "" && values.stateId != null) {
                        formData.append(
                          "state",
                          values.stateId
                            ? values.stateId != ""
                              ? values.stateId.value
                              : 0
                            : 0
                        );
                      }

                      if (values.countryId != "" && values.countryId != null) {
                        formData.append(
                          "country",
                          values.countryId
                            ? values.countryId != ""
                              ? values.countryId.value
                              : 0
                            : 0
                        );
                      }
                      if (values.pincode != null && values.pincode != "") {
                        formData.append("pincode", values.pincode);
                      }
                      if (values.city != null) {
                        formData.append("city", values.city);
                      }
                      if (values.phone_no != null) {
                        formData.append("mobile_no", values.phone_no);
                      }
                    }
                    formData.append(
                      "slug",
                      values.underId.ledger_form_parameter_slug.toLowerCase()
                    );
                    if (values.is_private != "" && values.is_private) {
                      formData.append("is_private", values.is_private.value);
                    }

                    for (let [name, value] of formData) {
                      console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                    }

                    editLedger(formData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          toast.success(res.message);
                          resetForm();

                          if (this.state.source != "") {
                            // eventBus.dispatch("page_change", {
                            //   from: "ledgeredit",
                            //   to: this.state.source.from_page,
                            //   prop_data: {
                            //     ...this.state.source,
                            //   },
                            //   isNewTab: false,
                            // });
                            this.props.history.push(`/master/ledger-edit`);
                            this.setState({ source: "" });
                          } else {
                            // eventBus.dispatch("page_change", "ledgerlist");
                            this.props.history.push(
                              `/master/ledger/ledger-list`
                            );
                          }
                        } else {
                          toast.error(res.message);
                        }
                      })
                      .catch((error) => {
                        console.log("error", error);
                      });
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                    submitForm,
                  }) => (
                    <Form onSubmit={handleSubmit} autoComplete="off">
                      {/* {JSON.stringify(errors)} */}
                      {/* {JSON.stringify(values)} */}

                      <div
                        className="mx-0"
                        style={{
                          background: "#CEE7F1",
                          borderBottom: "1px solid #B1BFC5",
                        }}
                      >
                        <Row className="pt-3 pb-3">
                          <Col md={5}>
                            <FormGroup>
                              <Label for="exampleDatetime">
                                Ledger Name{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <FormControl
                                autoFocus="true"
                                type="text"
                                placeholder="Ledger Name"
                                name="ledger_name"
                                className="text-box"
                                onChange={handleChange}
                                onBlur={(v) => {
                                  v.preventDefault();
                                  if (
                                    values.ledger_name != "" &&
                                    values.ledger_name != undefined
                                  ) {
                                    setFieldValue(
                                      "mailing_name",
                                      values.ledger_name
                                    );
                                  }
                                  // this.ValidateLedgermMaster(
                                  //   values.underId,
                                  //   values.underId.sub_principle_id,
                                  //   values.underId.principle_id,
                                  //   values.ledger_name,
                                  //   values.supplier_code
                                  // );
                                }}
                                onInput={(e) => {
                                  e.target.value =
                                    e.target.value.charAt(0).toUpperCase() +
                                    e.target.value.slice(1);
                                }}
                                value={values.ledger_name}
                                autofocus
                                isValid={
                                  touched.ledger_name && !errors.ledger_name
                                }
                                isInvalid={!!errors.ledger_name}
                              />
                              {/* <FormFeedback type="invalid">
                        {errors.ledger_name}
                      </FormFeedback> */}
                            </FormGroup>
                          </Col>

                          <Col md={2}>
                            {console.log("yo")}

                            {console.log(values.underId)}
                            {console.log(values.dfSelect)}
                            {console.log(values.undervalue)}

                            <FormGroup className="">
                              <Label>Under Group </Label>
                              <Select
                                className="selectTo"
                                onChange={(v) => {
                                  setFieldValue("underId", v);
                                  if (v.sub_principle_id) {
                                    if (v.sub_principle_id == 5) {
                                      setFieldValue(
                                        "opening_balance_type",
                                        "cr"
                                      );
                                      setFieldValue("tds", "false");
                                      setFieldValue("tcs", "false");
                                      setFieldValue(
                                        "applicable_from",
                                        applicable_from_options[0]
                                      );
                                      setFieldValue(
                                        "isTaxation",
                                        ledger_type_options[1]
                                      );
                                      setFieldValue("pan_no", "");
                                    } else if (v.sub_principle_id == 1) {
                                      setFieldValue(
                                        "opening_balance_type",
                                        "dr"
                                      );
                                      setFieldValue("tds", "false");
                                      setFieldValue("tcs", "false");
                                      setFieldValue(
                                        "applicable_from",
                                        applicable_from_options[0]
                                      );
                                      setFieldValue(
                                        "isTaxation",
                                        ledger_type_options[1]
                                      );
                                      setFieldValue("pan_no", "");
                                    }
                                  }
                                }}
                                name="underId"
                                // styles={customStyles}
                                // styles={ledger_select}
                                options={undervalue}
                                // {console.log(values.underId)}
                                value={values.underId}
                                invalid={errors.underId ? true : false}
                                // defaultValue={undervalue[1] || "Select"}

                                // dfSelect
                                // onBlur={(e) => {
                                //   e.preventDefault();
                                //   this.ValidateLedgermMaster(
                                //     values.underId,
                                //     values.underId.sub_principle_id,
                                //     values.underId.principle_id,
                                //     values.ledger_name,
                                //     values.supplier_code
                                //   );
                                // }}
                                //styles={customStyles}
                              />
                              <p className="displaygroup pl-4 mb-0">
                                {/* {values.underId
                                ? values.underId.sub_principle_id
                                  ? values.underId.principle_name
                                  : ""
                                : ""} */}
                                {/* {values.underId
                                  ? values.underId.associates_id
                                    ? values.underId.sub_principle_id
                                      ? values.underId.subprinciple_name
                                      : values.underId.principle_name
                                    : values.underId.principle_name
                                  : values.underId.principle_name} */}
                              </p>
                              <span className="text-danger">
                                {errors.underId}
                              </span>
                            </FormGroup>
                          </Col>

                          <Col md="2">
                            <Label>Opening Balance </Label>
                            <FormGroup className="">
                              <div className="jointdropdown">
                                <FormControl
                                  type="number"
                                  placeholder=""
                                  aria-label="Opening Balance"
                                  aria-describedby="basic-addon2"
                                  name="opening_balance"
                                  onChange={handleChange}
                                  className="text-box"
                                  value={values.opening_balance}
                                  isValid={
                                    touched.opening_balance &&
                                    !errors.opening_balance
                                  }
                                  isInvalid={!!errors.opening_balance}
                                />
                                <FormFeedback type="invalid">
                                  {errors.opening_balance_type}
                                </FormFeedback>
                              </div>
                              <span className="text-danger errormsg">
                                {errors.opening_balance &&
                                  errors.opening_balance}
                              </span>
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <Label style={{ color: "#cee7f1" }}>.</Label>
                            <Input
                              type="select"
                              // styles={ledger_select}
                              onChange={(e) => {
                                setFieldValue(
                                  "opening_balance_type",
                                  e.target.value
                                );
                              }}
                              name="opening_balance_type"
                              className="select-text-box"
                              value={values.opening_balance_type}
                              // value={`cr`}
                            >
                              <option value="dr">Dr</option>
                              <option value="cr">Cr</option>
                            </Input>
                          </Col>
                          {/* </Row>
                    </Col> */}
                        </Row>
                        <Row></Row>
                      </div>

                      {/* Bank account start  **/}
                      {values.underId &&
                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "bank_account" && (
                          <div className=" form-style">
                            <div className="mt-2 mx-0">
                              <Row>
                                <Col>
                                  <h5 className="Mail-title ms-2 form-label">
                                    Bank Details
                                  </h5>
                                </Col>
                              </Row>
                              {/* <Col md={10}> */}
                              <Row className="mb-2">
                                <Col md={1}>
                                  <Label>Bank Name </Label>
                                </Col>
                                <Col md={2}>
                                  <FormGroup>
                                    <FormControl
                                      type="text"
                                      placeholder="Bank Name"
                                      name="bank_name"
                                      className="text-box"
                                      onChange={handleChange}
                                      onKeyPress={(e) => {
                                        OnlyAlphabets(e);
                                      }}
                                      value={values.bank_name}
                                      isValid={
                                        touched.bank_name && !errors.bank_name
                                      }
                                      isInvalid={!!errors.bank_name}
                                    />
                                    <FormFeedback type="invalid">
                                      {errors.bank_name}
                                    </FormFeedback>
                                  </FormGroup>
                                </Col>
                                <Col md={1}>
                                  <Label>Account Number </Label>
                                </Col>
                                <Col md={2}>
                                  <FormGroup>
                                    <FormControl
                                      type="text"
                                      placeholder="Account Number"
                                      name="bank_account_no"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={values.bank_account_no}
                                      onKeyPress={(e) => {
                                        OnlyEnterNumbers(e);
                                      }}
                                      isValid={
                                        touched.bank_account_no &&
                                        !errors.bank_account_no
                                      }
                                      maxLength={14}
                                      isInvalid={!!errors.bank_account_no}
                                    />
                                    <FormFeedback type="invalid">
                                      {errors.bank_account_no}
                                    </FormFeedback>
                                  </FormGroup>
                                </Col>
                                <Col md={1}>
                                  <Label>IFSC Code </Label>
                                </Col>
                                <Col md={2}>
                                  <FormGroup>
                                    <FormControl
                                      type="text"
                                      placeholder="IFSC Code"
                                      name="bank_ifsc_code"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={
                                        values.bank_ifsc_code &&
                                        values.bank_ifsc_code.toUpperCase()
                                      }
                                      isValid={
                                        touched.bank_ifsc_code &&
                                        !errors.bank_ifsc_code
                                      }
                                      maxLength={11}
                                      isInvalid={!!errors.bank_ifsc_code}
                                    />
                                    <FormFeedback type="invalid">
                                      {errors.bank_ifsc_code}
                                    </FormFeedback>
                                  </FormGroup>
                                </Col>
                                {/* </Row>
                        <Row> */}
                                <Col md={1}>
                                  <Label>Branch </Label>
                                </Col>
                                <Col md={2}>
                                  <FormGroup>
                                    <FormControl
                                      type="text"
                                      placeholder="Branch"
                                      name="bank_branch"
                                      className="text-box"
                                      onChange={handleChange}
                                      onKeyPress={(e) => {
                                        OnlyAlphabets(e);
                                      }}
                                      value={values.bank_branch}
                                      isValid={
                                        touched.bank_branch &&
                                        !errors.bank_branch
                                      }
                                      isInvalid={!!errors.bank_branch}
                                    />
                                    <FormFeedback type="invalid">
                                      {errors.bank_branch}
                                    </FormFeedback>
                                  </FormGroup>
                                </Col>
                                <Col md={8} className="text-end">
                                  <FormControl
                                    type="text"
                                    placeholder="index"
                                    name="index"
                                    className="text-box"
                                    onChange={handleChange}
                                    hidden
                                    value={values.index}
                                  />
                                </Col>
                              </Row>
                            </div>
                            <hr />
                            <Row className="btm-button-row">
                              <Col
                                md="12"
                                className="text-end"
                                style={{ textAlign: "end", marginTop: "10px" }}
                              >
                                <Button
                                  className="submit-btn mx-3"
                                  type="submit"
                                  color="info"
                                >
                                  Update
                                </Button>
                                <Button
                                  variant="secondary"
                                  className="cancel-btn me-3"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // toast.error("Do you want cancel !");
                                    if (this.state.source != "") {
                                      // eventBus.dispatch("page_change", {
                                      //   from: "ledgeredit",
                                      //   to: this.state.source.from_page,
                                      //   prop_data: {
                                      //     rows: this.state.source.rows,
                                      //     invoice_data:
                                      //       this.state.source.invoice_data,
                                      //     ...this.state.source,
                                      //   },
                                      //   isNewTab: false,
                                      // });
                                      this.props.history.push(
                                        `/master/ledger/ledger-edit`
                                      );
                                      this.setState({ source: "" });
                                    } else {
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "ledgerlist"
                                      // );
                                      this.props.history.push(
                                        `/master/ledger/ledger-list`
                                      );
                                    }
                                  }}
                                >
                                  Cancel
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        )}
                      {/* Bank account end */}
                      {/* duties and taxes start  **/}
                      {values.underId &&
                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "duties_taxes" && (
                          <>
                            <Row className="mx-0" style={{ margin: "12px" }}>
                              <Col md="12" className="mb-4">
                                <Row className="m-0">
                                  
                                  <Col md="2">
                                  <Label>
                                      Tax Type{" "}
                                      {/* <span className="pt-1 pl-1 req_validation">
                                *
                              </span> */}
                                    </Label>
                                      

                                      <Input
                                        type="select"
                                        // styles={ledger_select}
                                        onChange={(e) => {
                                          setFieldValue(
                                            "tax_type",
                                            e.target.value
                                          );
                                        }}
                                        name="tax_type"
                                        className="select-text-box"
                                        value={values.tax_type}
                                        // value={`cr`}
                                      >
                                        <option value="central_tax">
                                          Central Tax
                                        </option>
                                        <option value="state_tax">
                                          State Tax
                                        </option>
                                        <option value="integrated_tax">
                                          Integrated Tax
                                        </option>
                                      </Input>
                                      {/* <h1>{values.tax_type}</h1> */}

                                      <span className="text-danger">
                                        {errors.tax_type}
                                      </span>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            <Row className="btm-button-row">
                              <Col
                                md="12"
                                className="text-end"
                                style={{ textAlign: "end", marginTop: "10px" }}
                              >
                                <Button
                                  className="submit-btn mx-3"
                                  type="submit"
                                  color="info"
                                >
                                  Update
                                </Button>
                                <Button
                                  variant="secondary"
                                  className="cancel-btn me-3"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // toast.error("Do you want cancel !");
                                    if (this.state.source != "") {
                                      // eventBus.dispatch("page_change", {
                                      //   from: "ledgeredit",
                                      //   to: this.state.source.from_page,
                                      //   prop_data: {
                                      //     rows: this.state.source.rows,
                                      //     invoice_data:
                                      //       this.state.source.invoice_data,
                                      //     ...this.state.source,
                                      //   },
                                      //   isNewTab: false,
                                      // });
                                      this.props.history.push(
                                        `/master/ledger-edit`
                                      );
                                      this.setState({ source: "" });
                                    } else {
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "ledgerlist"
                                      // );
                                      this.props.history.push(
                                        `/master/ledger/ledger-list`
                                      );
                                    }
                                  }}
                                >
                                  Cancel
                                </Button>
                              </Col>
                            </Row>
                          </>
                        )}
                      {/* duties and taxes end  */}
                      {/* Other start ***/}
                      {values.underId &&
                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "sundry_creditors" && (
                          <div className="duties">
                            <Row className="btm-button-row">
                              <Col
                                md="12"
                                className="text-end"
                                style={{ textAlign: "end", marginTop: "10px" }}
                              >
                                <Button
                                  className="submit-btn mx-3"
                                  type="submit"
                                  color="info"
                                >
                                  Update
                                </Button>
                                <Button
                                  variant="secondary"
                                  className="cancel-btn me-3"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // toast.error("Do you want cancel !");
                                    if (this.state.source != "") {
                                      // eventBus.dispatch("page_change", {
                                      //   from: "ledgeredit",
                                      //   to: this.state.source.from_page,
                                      //   prop_data: {
                                      //     rows: this.state.source.rows,
                                      //     invoice_data:
                                      //       this.state.source.invoice_data,
                                      //     ...this.state.source,
                                      //   },
                                      //   isNewTab: false,
                                      // });
                                      this.props.history.push(
                                        `/master/ledger/ledger-edit`
                                      );
                                      this.setState({ source: "" });
                                    } else {
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "ledgerlist"
                                      // );
                                      this.props.history.push(
                                        `/master/ledger/ledger-list`
                                      );
                                    }
                                  }}
                                >
                                  Cancel
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        )}
                      {/* Other end */}
                      {values.underId &&
                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "others" && (
                          <div className="duties">
                            <Row className="btm-button-row">
                              <Col
                                md="12"
                                className="text-end"
                                style={{ textAlign: "end", marginTop: "10px" }}
                              >
                                <Button
                                  className="submit-btn mx-3"
                                  type="submit"
                                  color="info"
                                >
                                  Update
                                </Button>
                                <Button
                                  variant="secondary"
                                  className="cancel-btn me-3"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // toast.error("Do you want cancel !");
                                    if (this.state.source != "") {
                                      // eventBus.dispatch("page_change", {
                                      //   from: "ledgeredit",
                                      //   to: this.state.source.from_page,
                                      //   prop_data: {
                                      //     rows: this.state.source.rows,
                                      //     invoice_data:
                                      //       this.state.source.invoice_data,
                                      //     ...this.state.source,
                                      //   },
                                      //   isNewTab: false,
                                      // });
                                      this.props.history.push(
                                        `/master/ledger/ledger-edit`
                                      );
                                      this.setState({ source: "" });
                                    } else {
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "ledgerlist"
                                      // );
                                      this.props.history.push(
                                        `/master/ledger/ledger-list`
                                      );
                                    }
                                  }}
                                >
                                  Cancel
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        )}

                      {/* Assets start  **/}
                      {values.underId &&
                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "assets" && (
                          <>
                            <Row className="btm-button-row">
                              <Col
                                md="12"
                                className="text-end"
                                style={{ textAlign: "end", marginTop: "10px" }}
                              >
                                <Button
                                  className="submit-btn mx-3"
                                  type="submit"
                                  color="info"
                                >
                                  Update
                                </Button>
                                <Button
                                  variant="secondary"
                                  className="cancel-btn me-3"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // toast.error("Do you want cancel !");
                                    if (this.state.source != "") {
                                      // eventBus.dispatch("page_change", {
                                      //   from: "ledgeredit",
                                      //   to: this.state.source.from_page,
                                      //   prop_data: {
                                      //     rows: this.state.source.rows,
                                      //     invoice_data:
                                      //       this.state.source.invoice_data,
                                      //     ...this.state.source,
                                      //   },
                                      //   isNewTab: false,
                                      // });
                                      this.props.history.push(
                                        `/master/ledger/ledger-edit`
                                      );
                                      this.setState({ source: "" });
                                    } else {
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "ledgerlist"
                                      // );
                                      this.props.history.push(
                                        `/master/ledger/ledger-list`
                                      );
                                    }
                                  }}
                                >
                                  Cancel
                                </Button>
                              </Col>
                            </Row>
                          </>
                        )}
                      {/* Assets end  */}
                    </Form>
                  )}
                </Formik>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}
