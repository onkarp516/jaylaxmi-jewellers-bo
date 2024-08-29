import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  InputGroup,
  ButtonGroup,
  FormControl,
  Table,
  Tabs,
  Tab,
  Card,
} from "react-bootstrap";
import { Formik } from "formik";

import Select from "react-select";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import phone from "@/assets/images/phone_icon.png";
import whatsapp from "@/assets/images/whatsapp_icon.png";
import Delete from "@/assets/images/delete.png";
import * as Yup from "yup";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Add from "@/assets/images/add_blue_circle@3x.png";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

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
  getSalesmanMasterOutlet,
} from "@/services/api_functions";
import moment, { deprecationHandler } from "moment";
import {
  ShowNotification,
  getRandomIntInclusive,
  getSelectValue,
  eventBus,
  AuthenticationCheck,
  customStyles,
  MyDatePicker,
  ifsc_code_regex,
  pan,
  MyNotifications,
  MobileRegx,
  GSTINREX,
  pincodeReg,
  EMAILREGEXP,
  bankAccountNumber,
  ledger_select,
  alphaNumericRegExp,
  MOBILEREGEXP,
  PINCODEREGEXP,
  alphaRegExp,
  getValue,
  OnlyAlphabets,
  OnlyEnterNumbers,
  MyTextDatePicker,
  isUserControl,
} from "@/helpers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser as faSolidUser,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

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

const licencesType = [
  // { label: "Licence No", value: 1 },
  { label: "FSSAI No", value: 1, slug_name: "fssai_number" },
  { label: "Drug License No", value: 2, slug_name: "drug_number" },
  { label: "Mfg. Licence No", value: 3, slug_name: "mfg_number" },
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

class LedgerEdit extends React.Component {
  constructor(props) {
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
      licensesList: [],
      salesmanList: [],
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
      removelicensesList: [],
      initValue: {
        associates_id: "",
        associates_group_name: "",
        underId: "",
        opening_balance: 0,
        is_private: "",
      },

      initVal: {
        id: "",
        bId: 0,
        district: "",
        shipping_address: "",
        ledger_name: "",
        underId: "",
        associates_id: "",
        associates_group_name: "",
        supplier_code: getRandomIntInclusive(1, 1000),
        opening_balance: 0,
        is_private: "false",
        gst_detail_id: "",
        shipping_detail_id: "",
        billing_details_id: "",
        depart_details_id: "",
        salesmanId: "",
        areaId: "",
      },
      isEditDataSet: false,
      source: "",
      areaLst: [],
      salesmanLst: [],
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
            MyNotifications.fire({
              show: true,
              icon: "error",
              title: "Error",
              msg: res.message,
              is_button_show: true,
            });
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
        let licensesDetails = [];

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

            if (data.licensesDetails.length > 0) {
              licensesDetails = data.licensesDetails.map((v, i) => {
                return {
                  bid: v.id,
                  licences_type: v.licences_type,
                  licenses_num: v.licenses_num,
                  licenses_exp: v.licenses_exp,
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

            if (data.licensesDetails.length > 0) {
              licensesDetails = data.licensesDetails.map((v, i) => {
                return {
                  bid: v.id,
                  licences_type: v.licences_type,
                  licenses_num: v.licenses_num,
                  licenses_exp: v.licenses_exp,
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
              tax_type: getSelectValue(taxOpt, data.tax_type),
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
            if (data.licensesDetails.length > 0) {
              licensesDetails = data.licensesDetails.map((v, i) => {
                return {
                  id: v.id,
                  licences_type:
                    v.licences_type !== "NA" ? v.licences_type : "",
                  licenses_num: v.licenses_num != "NA" ? v.licenses_num : "",
                  licenses_exp: v.licenses_exp != "NA" ? v.licenses_exp : "",
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
            licensesDetails,
          });
          this.setState({
            isEditDataSet: true,
            initVal: initVal,
            gstList: gstdetails,
            deptList: deptList,
            shippingList: shippingDetails,
            billingList: billingDetails,
            bankList: bankDetails,
            licensesList: licensesDetails,
          });
          //  console.log("gstList", gstList);
        } else {
          this.setState({ isEditDataSet: true });
          ShowNotification("Error", data.responseStatus);
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
          MyNotifications.fire({
            show: true,
            icon: "warning",
            title: "Warning",
            msg: "GST Details are Already Exist !",
            is_button_show: false,
          });
        }
      } else {
        MyNotifications.fire({
          show: true,
          icon: "error",
          title: "Error",
          msg: "PAN NO is not Valid!",
          is_button_show: false,
        });
      }
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "GSTIN is Not Valid ",
        is_button_show: false,
      });
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

  handleFetchLicensesData = (values, setFieldValue) => {
    console.log("in handleFetch License data", values);
    let licensesObj = {
      id: values.id,
      licences_type: values.licences_type != null ? values.licences_type : "",
      licenses_num: values.licenses_num != null ? values.licenses_num : "",
      licenses_exp: values.licenses_exp != null ? values.licenses_exp : "",
      index: values.index,
    };
    console.log("licensesObj", licensesObj);
    if (licensesObj.licences_type != "") {
      setFieldValue("licences_type", licensesObj.licences_type);
    }
    if (licensesObj.licenses_num != "") {
      setFieldValue("licenses_num", licensesObj.licenses_num);
    }
    if (licensesObj.licenses_exp != "") {
      setFieldValue("licenses_exp", licensesObj.licenses_exp);
    }

    setFieldValue("index", licensesObj.index);
  };

  addLicensesRow = (values, setFieldValue) => {
    console.log("values", values);
    let licensesObj = {
      id: values.id,
      licences_type: values.licences_type,
      licenses_num: values.licenses_num,
      licenses_exp: values.licenses_exp,
      index: values.index,
    };
    console.log({ licensesObj });
    const { licensesList } = this.state;
    let old_lst = licensesList;
    let is_updated = false;
    let obj = old_lst.filter((value) => {
      return (
        value.licences_type === licensesObj.licences_type &&
        value.licenses_num === licensesObj.licenses_num &&
        value.licenses_exp === licensesObj.licenses_exp
      );
    });
    let final_state = [];
    if (obj.length == 0) {
      final_state = old_lst.map((item) => {
        if (item.index == licensesObj.index) {
          is_updated = true;
          const updatedItem = licensesObj;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...licensesList, licensesObj];
      }
      console.log({ final_state });
      this.setState({ licensesList: final_state }, () => {
        setFieldValue("licences_type", "");
        setFieldValue("licenses_num", "");
        setFieldValue("licenses_exp", "");
        setFieldValue("index", undefined);
      });
    } else {
      console.log("already exists in row");
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Licenses Details are Already Exist !",
        is_button_show: false,
      });
    }
  };
  removeLicensesRow = (index) => {
    console.log("index-->", index);
    const { licensesList, removelicensesList } = this.state;
    let list = licensesList.filter((v, i) => i != index);
    let robj = licensesList.find((v, i) => i == index);
    removelicensesList = [...removelicensesList, robj];
    this.setState(
      { bankList: list, removelicensesList: removelicensesList },
      () => {
        console.log("banklist removed---->", this.state.removelicensesList);
        if (this.myRef.current) {
          this.myRef.current.setFieldValue("index", -1);
          this.myRef.current.setFieldValue("bid", "");
        }
      }
    );
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
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: "Registration Date Should be Less than Current Date",
            is_button_show: true,
          });
          setFieldValue(ele, "");
        }
      } else {
        if (currentDate >= etime) {
          // MyNotifications.fire(
          // {
          //   show: true,
          //   icon: "confirm",
          //   title: "Expiry date not valid ",
          //   msg: "Do you want continue with this Expiry Date",
          //   is_button_show: false,
          //   is_timeout: false,
          //   delay: 0,
          //   handleSuccessFn: () => {
          //     console.warn("sid:: continue invoice");
          //   },
          //   handleFailFn: () => {
          //     console.warn("sid:: exit from invoice or reload page");
          //     this.handlefail();
          //   },
          // },
          // () => {
          //   console.warn("sid :: return_data");
          // }

          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: "Expiry Date Should be Grater than Current Date",
            is_button_show: true,
          });
          setFieldValue(ele, "");
          // }
          // );
        } else {
          console.log("Correct Date-->", expirydate);
        }
      }
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Expiry date not valid",
        is_button_show: true,
      });
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
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Shipping Details are Already Exist !",
        is_button_show: false,
      });
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
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Billing Details are Already Exist !",
        is_button_show: false,
      });
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
    // } else {
    //   MyNotifications.fire({
    //     show: true,
    //     icon: "warning",
    //     title: "Warning",
    //     msg: " Department details are Exist!",
    //     is_button_show: false,
    //   });
    // }
    //   } else {
    //     MyNotifications.fire({
    //       show: true,
    //       icon: "error",
    //       title: "Error",
    //       msg: "Mobile No is not valid !",
    //       is_button_show: false,
    //     });
    //   }
    // } else {
    //   MyNotifications.fire({
    //     show: true,
    //     icon: "error",
    //     title: "Error",
    //     msg: "Email is not Valid!",
    //     is_button_show: false,
    //   });
    // }
  };

  // handle click event of the Remove button
  // removeDeptRow = (values, index) => {
  //   const { deptList, removeDeptList } = this.state;
  //   const list = [...deptList];
  //   list.splice(index, 1);

  //   const list1 = [...removeDeptList];
  //   if (values.id > 0) {
  //     list1.push(values.id);
  //   }
  //   this.setState({ deptList: list, removeDeptList: list1 });
  // };

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
  lstSalesmanMaster = () => {
    getSalesmanMasterOutlet()
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 200) {
          let opt = res.responseObject.map((v, i) => {
            return { label: v.firstName + " " + v.lastName, value: v.id };
          });
          this.setState({ salesmanLst: opt }, () => {});
        }
      })
      .catch((error) => {});
  };
  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "ledgeredit",
      to: "ledgerlist",
    });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstUnders();
      this.lstBalancingMethods();
      this.lstState();
      this.lstCountry();
      this.listGSTTypes();
      this.lstAreaMaster();
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      this.lstSalesmanMaster();
      // this.setInitValue();
      // this.getoutletappConfigData();

      const { prop_data } = this.props.block;
      console.log({ prop_data });

      // if ("source" in prop_data) {
      if (prop_data.hasOwnProperty("source")) {
        this.setState({ source: prop_data.source, edit_data: prop_data.id });
      } else {
        this.setState({ edit_data: prop_data });
      }
    }
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
          MyNotifications.fire({
            show: true,
            icon: "warning",
            title: "Warning",
            msg: "Bank Details are Already Exist !",
            is_button_show: false,
          });
        }
      } else {
        MyNotifications.fire({
          show: true,
          icon: "error",
          title: "Error",
          msg: "IFSC is not valid !",
          is_button_show: false,
        });
      }
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "AccountNo is not valid !",
        is_button_show: false,
      });
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
      licensesList,
      salesmanList,
      rList,
      rBList,
      rSList,
      deptRList,

      removeGstList,
      removeDeptList,
      removeShippingList,
      removeBillingList,
      removebankList,
      removelicensesList,
      areaLst,
      salesmanLst,
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

    return (
      <div id="example-collapse-text" className="new_ledger_create_style p-0">
        <div className="main-div mb-2 m-0 px-2">
          {/* <h4 className="form-header">Update Ledger</h4> */}
          <Formik
            // validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={initVal}
            innerRef={this.myRef}
            validate={validate}
            onSubmit={(values, { resetForm }) => {
              MyNotifications.fire(
                {
                  show: true,
                  icon: "confirm",
                  title: "Confirm",
                  msg: "Do you want to update",
                  is_button_show: false,
                  is_timeout: false,
                  handleSuccessFn: () => {
                    // debugger;
                    console.log({ values, removeGstList });
                    const formData = new FormData();
                    formData.append("id", values.id);

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

                    if (
                      values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "sundry_creditors"
                    ) {
                      if (values.ledger_name != null) {
                        formData.append(
                          "ledger_name",
                          values.ledger_name ? values.ledger_name : ""
                        );
                      }
                      if (values.supplier_code != null) {
                        formData.append("supplier_code", values.supplier_code);
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
                      if (values.supplier_code != null) {
                        formData.append("supplier_code", values.supplier_code);
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
                      if (values.email_id != "" && values.email_id != null) {
                        formData.append("email", values.email_id);
                      }

                      if (values.phone_no != null) {
                        formData.append(
                          "mobile_no",
                          values.phone_no ? values.phone_no : 0
                        );
                      }
                      if (values.tcs == "true") {
                        formData.append(
                          "tcs_applicable_date",
                          moment(values.tcs_applicable_date).format(
                            "YYYY-MM-DD"
                          )
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

                      if (values.isTaxation != null) {
                        formData.append("taxable", values.isTaxation.value);
                      }
                      if (values.pan_no != null) {
                        formData.append("pan_no", values.pan_no);
                      }

                      let gstdetails = [];
                      if (values.isTaxation.value == true) {
                        if (values.registraion_type != null) {
                          formData.append(
                            "registration_type",
                            values.registraion_type.value
                          );
                        }
                        console.log("gst", JSON.stringify(gstList));

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

                      console.log({ gstdetails });

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
                        let obj = {};
                        if (v.id != "" && v.id != null) {
                          obj["id"] = v.id;
                        } else {
                          obj["id"] = 0;
                        }
                        obj["district"] = v.district;
                        obj["billing_address"] = v.billing_address;
                        return obj;
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
                      let deptRemovedList = [];
                      deptRemovedList = deptRList.map((v) => v.id);
                      console.log("Removed Dept List->", deptRList);
                      formData.append(
                        "removeDeptList",
                        JSON.stringify(deptRemovedList)
                      );

                      console.log("deptDetails", JSON.stringify(deptDetails));
                      console.log("bankList", JSON.stringify(bankList));

                      formData.append("bankDetails", JSON.stringify(bankList));
                      let bankRemovedlist = [];
                      bankRemovedlist = removebankList.map((v) => v.bid);
                      console.log(
                        "Bank Removed billing",
                        bankRemovedlist,
                        removebankList
                      );
                      formData.append(
                        "removeBankList",
                        JSON.stringify(bankRemovedlist)
                      );

                      console.log("bankList", JSON.stringify(bankList));
                      formData.append(
                        "licensesDetails",
                        JSON.stringify(licensesList)
                      );
                      let licensesRemovedlist = [];
                      licensesRemovedlist = removelicensesList.map(
                        (v) => v.bid
                      );
                      console.log(
                        "Bank Removed billing",
                        licensesRemovedlist,
                        removelicensesList
                      );
                      formData.append(
                        "removelicensesList",
                        JSON.stringify(licensesRemovedlist)
                      );

                      // if (values.bank_name != null) {
                      //   formData.append("bank_name", values.bank_name);
                      // }
                      // if (values.bank_account_no != null) {
                      //   formData.append("bank_account_no", values.bank_account_no);
                      // }
                      // if (values.bank_ifsc_code != null) {
                      //   formData.append("bank_ifsc_code", values.bank_ifsc_code);
                      // }
                      // if (values.bank_branch != null) {
                      //   formData.append("bank_branch", values.bank_branch);
                      // }
                    }
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
                      // formData.append("mailing_name", values.mailing_name);

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

                      if (values.isTaxation.value == true) {
                        formData.append("gstin", values.gstin);
                      }
                      formData.append(
                        "opening_bal",
                        values.opening_balance ? values.opening_balance : 0
                      );
                      // formData.append(
                      //   "balancing_method",
                      //   values.opening_balancing_method.value
                      // );
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

                      if (values.email_id != "" && values.email_id) {
                        formData.append("email", values.email_id);
                      }
                      if (values.phone_no != null)
                        formData.append("mobile_no", values.phone_no);

                      if (values.isTaxation != null) {
                        formData.append("taxable", values.isTaxation.value);
                      }
                      if (values.isTaxation == "true") {
                        formData.append("gstin", values.gstin);
                        // formData.append(
                        //   "registration_type",
                        //   values.registraion_type.value
                        // );
                        // formData.append("pancard_no", values.pan_no);
                        // formData.append(
                        //   "dateofregistartion",
                        //   moment(values.dateofregistartion).format("YYYY-MM-DD")
                        // );
                      }

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
                        formData.append("tax_type", values.tax_type.value);
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
                    formData.append("is_private", values.is_private.value);

                    for (let [name, value] of formData) {
                      console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                    }

                    editLedger(formData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          MyNotifications.fire({
                            show: true,
                            icon: "success",
                            title: "Success",
                            msg: res.message,
                            is_timeout: true,
                            delay: 1000,
                          });
                          resetForm();
                          // this.initRow();
                          // eventBus.dispatch("page_change", {
                          //   from: "ledgeredit",
                          //   to: "ledgerlist",
                          // });

                          if (this.state.source != "") {
                            eventBus.dispatch("page_change", {
                              from: "ledgeredit",
                              to: this.state.source.from_page,
                              prop_data: {
                                ...this.state.source,
                              },
                              isNewTab: false,
                            });
                            this.setState({ source: "" });
                          } else {
                            eventBus.dispatch("page_change", "ledgerlist");
                          }
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: res.message,
                            is_button_show: true,
                          });
                        }
                      })
                      .catch((error) => {
                        console.log("error", error);
                      });
                  },
                  handleFailFn: () => {},
                },
                () => {
                  console.warn("return_data");
                }
              );
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

                <Row className="top_bar">
                  <Card className="top_card_style">
                    <Card.Body>
                      <Row>
                        <Col lg={2}>
                          <Row>
                            <Col lg={4} className="my-auto">
                              <Form.Label>Ledger Type </Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group className="">
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
                                  styles={ledger_select}
                                  options={undervalue}
                                  value={values.underId}
                                  invalid={errors.underId ? true : false}
                                />
                                {/* <p className="displaygroup pl-4 mb-0">
                          {values.underId
                            ? values.underId.associates_id
                              ? values.underId.sub_principle_id
                                ? values.underId.subprinciple_name
                                : values.underId.principle_name
                              : values.underId.principle_name
                            : values.underId.principle_name}
                        </p> */}
                                <span className="text-danger">
                                  {errors.underId}
                                </span>
                              </Form.Group>
                            </Col>
                            {/*  */}
                          </Row>
                        </Col>
                        {values.underId &&
                          values.underId.ledger_form_parameter_slug.toLowerCase() ==
                            "sundry_creditors" && (
                            <>
                              <Col lg={2}>
                                <Row>
                                  <Col lg={2} className="my-auto">
                                    <Form.Label>Code</Form.Label>
                                  </Col>
                                  <Col lg={10}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Code"
                                        name="supplier_code"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.supplier_code}
                                        isValid={
                                          touched.supplier_code &&
                                          !errors.supplier_code
                                        }
                                        isInvalid={!!errors.supplier_code}
                                        onBlur={(e) => {
                                          e.preventDefault();
                                        }}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.supplier_code}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          )}
                        {values.underId &&
                          values.underId.ledger_form_parameter_slug.toLowerCase() ==
                            "sundry_debtors" && (
                            <>
                              <Col lg={2}>
                                <Row>
                                  <Col lg={2} className="my-auto">
                                    <Form.Label>
                                      Code{" "}
                                      <span className="text-danger">*</span>
                                    </Form.Label>
                                  </Col>
                                  <Col lg={10}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Code"
                                        name="supplier_code"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.supplier_code}
                                        isValid={
                                          touched.supplier_code &&
                                          !errors.supplier_code
                                        }
                                        isInvalid={!!errors.supplier_code}
                                        onBlur={(e) => {
                                          e.preventDefault();
                                        }}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.supplier_code}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          )}
                        <Col lg={4}>
                          <Row>
                            <Col lg={2} className="my-auto">
                              <Form.Label>Ledger Name </Form.Label>
                            </Col>
                            <Col lg={10}>
                              <Form.Group>
                                <Form.Control
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
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        {values.underId &&
                          values.underId.ledger_form_parameter_slug.toLowerCase() ==
                            "sundry_creditors" && (
                            <>
                              <Col lg={2}>
                                <Row>
                                  <Col md={6} className="my-auto">
                                    <Form.Label>Balancing Method </Form.Label>
                                  </Col>
                                  <Col md={6}>
                                    <Form.Group className="">
                                      <Select
                                        className="selectTo"
                                        onChange={(v) => {
                                          setFieldValue(
                                            "opening_balancing_method",
                                            v
                                          );
                                        }}
                                        name="opening_balancing_method"
                                        // styles={customStyles}
                                        styles={ledger_select}
                                        options={balancingOpt}
                                        value={values.opening_balancing_method}
                                        invalid={
                                          errors.opening_balancing_method
                                            ? true
                                            : false
                                        }
                                        //styles={customStyles}
                                      />
                                      <span className="text-danger">
                                        {errors.opening_balancing_method}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          )}
                        {values.underId &&
                          values.underId.ledger_form_parameter_slug.toLowerCase() ==
                            "sundry_debtors" && (
                            <>
                              <Col lg={2}>
                                <Row>
                                  <Col lg={6} className="my-auto">
                                    <Form.Label>Balancing Method </Form.Label>
                                  </Col>
                                  <Col lg={6}>
                                    <Form.Group className="">
                                      <Select
                                        className="selectTo"
                                        onChange={(v) => {
                                          setFieldValue(
                                            "opening_balancing_method",
                                            v
                                          );
                                        }}
                                        name="opening_balancing_method"
                                        // styles={customStyles}
                                        styles={ledger_select}
                                        options={balancingOpt}
                                        value={values.opening_balancing_method}
                                        invalid={
                                          errors.opening_balancing_method
                                            ? true
                                            : false
                                        }
                                        //styles={customStyles}
                                      />
                                      <span className="text-danger">
                                        {errors.opening_balancing_method}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          )}
                        <Col lg={2}>
                          <Row>
                            <Col lg={4} className="my-auto">
                              <Form.Label>Opening Bal. </Form.Label>
                            </Col>
                            <Col lg={5}>
                              <Form.Group className="">
                                <InputGroup className="jointdropdown">
                                  <FormControl
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
                                  <Form.Control.Feedback type="invalid">
                                    {errors.opening_balance_type}
                                  </Form.Control.Feedback>
                                </InputGroup>
                                <span className="text-danger errormsg">
                                  {errors.opening_balance &&
                                    errors.opening_balance}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col lg={3} className="ps-0">
                              <Form.Select
                                as="select"
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
                              >
                                <option value="dr">Dr</option>
                                <option value="cr">Cr</option>
                              </Form.Select>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Row>
                {values.underId &&
                  values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    "sundry_creditors" && (
                    <>
                      <div className="middle_card_main">
                        <Card className="middle_card">
                          <Card.Body>
                            <Row>
                              <Col lg={4}>
                                <Row>
                                  <Col lg={3} className="my-auto">
                                    <Form.Label>Registered Name</Form.Label>
                                  </Col>
                                  <Col lg={9}>
                                    <Form.Group>
                                      <Form.Control
                                        autoFocus="true"
                                        type="text"
                                        placeholder="Registered Name"
                                        name="mailing_name"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.mailing_name}
                                        isValid={
                                          touched.mailing_name &&
                                          !errors.mailing_name
                                        }
                                        isInvalid={!!errors.mailing_name}
                                      />
                                      <span className="text-danger errormsg">
                                        {errors.mailing_name}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={6}>
                                <Row>
                                  <Col lg={1} className="my-auto">
                                    <Form.Label>Address</Form.Label>
                                  </Col>
                                  <Col lg={11}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Address"
                                        name="address"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.address}
                                        isValid={
                                          touched.address && !errors.address
                                        }
                                        isInvalid={!!errors.address}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.address}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={2}>
                                <Row>
                                  <Col lg={3} className="my-auto">
                                    <Form.Label>State</Form.Label>
                                  </Col>
                                  <Col lg={9}>
                                    <Form.Group className="">
                                      <Select
                                        className="selectTo"
                                        onChange={(v) => {
                                          setFieldValue("stateId", v);
                                        }}
                                        name="stateId"
                                        styles={ledger_select}
                                        options={stateOpt}
                                        value={values.stateId}
                                        invalid={errors.stateId ? true : false}
                                      />
                                      <span className="text-danger">
                                        {errors.stateId}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col lg={1}>
                                <Row>
                                  <Col lg={4} className="my-auto">
                                    <Form.Label>Pin</Form.Label>
                                  </Col>
                                  <Col lg={8}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Pin"
                                        name="pincode"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.pincode}
                                        onKeyPress={(e) => {
                                          OnlyEnterNumbers(e);
                                        }}
                                        maxLength={6}
                                        isValid={
                                          touched.pincode && !errors.pincode
                                        }
                                        isInvalid={!!errors.pincode}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.pincode}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={4} className="my-auto">
                                <Row>
                                  <Col lg={1}>
                                    <img
                                      src={phone}
                                      alt=""
                                      className="ledger_small_icons"
                                    />
                                  </Col>
                                  <Col lg={5}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter"
                                        name="phone_no"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.phone_no}
                                        onKeyPress={(e) => {
                                          OnlyEnterNumbers(e);
                                        }}
                                        isValid={
                                          touched.phone_no && !errors.phone_no
                                        }
                                        isInvalid={!!errors.phone_no}
                                        maxLength={10}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.phone_no}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  <Col lg={1}>
                                    <img
                                      src={whatsapp}
                                      alt=""
                                      className="ledger_small_icons"
                                    />
                                  </Col>
                                  <Col lg={5}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter"
                                        name="whatsapp_no"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.whatsapp_no}
                                        onKeyPress={(e) => {
                                          OnlyEnterNumbers(e);
                                        }}
                                        isValid={
                                          touched.whatsapp_no &&
                                          !errors.whatsapp_no
                                        }
                                        isInvalid={!!errors.whatsapp_no}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.whatsapp_no}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3}>
                                <Row>
                                  <Col lg={2} className="my-auto">
                                    <Form.Label>Email</Form.Label>
                                  </Col>
                                  <Col lg={10}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Email"
                                        name="email_id"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.email_id}
                                        isValid={
                                          touched.email_id && !errors.email_id
                                        }
                                        isInvalid={!!errors.email_id}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.email_id}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={2}>
                                <Row>
                                  <Col lg={4} className="my-auto">
                                    <Form.Label>Reg. No.</Form.Label>
                                  </Col>
                                  <Col lg={8}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Registration No."
                                        name="licenseNo"
                                        className="text-box"
                                        id="licenseNo"
                                        onChange={handleChange}
                                        value={values.licenseNo}
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={2}>
                                <Row>
                                  <Col lg={3} className="my-auto">
                                    <Form.Label>Reg. Date</Form.Label>
                                  </Col>
                                  <Col lg={9}>
                                    <MyTextDatePicker
                                      id="license_expiry"
                                      name="license_expiry"
                                      placeholder="DD/MM/YYYY"
                                      className="form-control"
                                      value={values.license_expiry}
                                      onChange={handleChange}
                                      onBlur={(e) => {
                                        console.log("e ", e);
                                        console.log(
                                          "e.target.value ",
                                          e.target.value
                                        );
                                        if (
                                          e.target.value != null &&
                                          e.target.value != ""
                                        ) {
                                          setFieldValue(
                                            "license_expiry",
                                            e.target.value
                                          );
                                          this.checkExpiryDate(
                                            setFieldValue,
                                            e.target.value,
                                            "license_expiry"
                                          );
                                        } else {
                                          setFieldValue("license_expiry", "");
                                        }
                                      }}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col lg={6} style={{ borderRight: "1px solid" }}>
                                <Row>
                                  <Col lg={2} className="d-flex">
                                    <Form.Label>Credit</Form.Label>
                                    <Form.Check
                                      type="switch"
                                      className="ms-1 my-auto"
                                      onClick={this.handleSwitchClick}
                                      onChange={(e) => {
                                        console.log(
                                          "Is Checked:--->",
                                          e.target.checked
                                        );
                                        // this.gstFieldshow(e.target.checked);
                                        setFieldValue(
                                          "isCredit",
                                          e.target.checked
                                        );
                                      }}
                                      name="isCredit"
                                      id="isCredit"
                                      value={
                                        values.isCredit == true ? "Yes" : "No"
                                      }
                                    />
                                  </Col>
                                  {values.isCredit == true ? (
                                    <>
                                      <Col lg={2}>
                                        <Row>
                                          <Col lg={4}>
                                            <Form.Label>Days</Form.Label>
                                          </Col>
                                          <Col lg={8}>
                                            <Form.Group>
                                              <Form.Control
                                                type="text"
                                                // disabled={isInputDisabled}
                                                placeholder="Days"
                                                name="credit_days"
                                                id="credit_days"
                                                className="text-box"
                                                onChange={handleChange}
                                                value={values.credit_days}
                                                maxLength={3}
                                                onKeyPress={(e) => {
                                                  OnlyEnterNumbers(e);
                                                }}
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                {errors.credit_days}
                                              </Form.Control.Feedback>
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                      </Col>

                                      {/* <Col lg={2}> */}
                                      {parseInt(values.credit_days) > 0 ? (
                                        <Col lg={4}>
                                          <Row>
                                            <Col md={5}>
                                              <Form.Label className="mb-2">
                                                Applicable From
                                              </Form.Label>{" "}
                                            </Col>
                                            <Col md={7}>
                                              <Form.Group className="mb-2">
                                                <Select
                                                  // disabled={isInputDisabled}
                                                  ////isClearable={true}
                                                  styles={ledger_select}
                                                  className="selectTo"
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      "applicable_from",
                                                      e
                                                    );
                                                  }}
                                                  options={
                                                    applicable_from_options
                                                  }
                                                  name="applicable_from"
                                                  id="applicable_from"
                                                  value={values.applicable_from}
                                                  invalid={
                                                    errors.applicable_from
                                                      ? true
                                                      : false
                                                  }
                                                />
                                                <span className="text-danger">
                                                  {errors.applicable_from}
                                                </span>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                      ) : (
                                        <></>
                                      )}
                                      {/* </Col> */}
                                      <Col lg={2}>
                                        <Row>
                                          <Col lg={4}>
                                            <Form.Label>Bills</Form.Label>
                                          </Col>
                                          <Col lg={8}>
                                            <Form.Group>
                                              <Form.Control
                                                type="text"
                                                // disabled={isInputDisabled}
                                                placeholder="Bills"
                                                name="credit_bills"
                                                id="credit_bills"
                                                className="text-box"
                                                onChange={handleChange}
                                                value={values.credit_bills}
                                                maxLength={3}
                                                onKeyPress={(e) => {
                                                  OnlyEnterNumbers(e);
                                                }}
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                {errors.credit_bills}
                                              </Form.Control.Feedback>
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                      </Col>
                                      <Col lg={2}>
                                        <Row>
                                          <Col lg={4}>
                                            <Form.Label>Values</Form.Label>
                                          </Col>
                                          <Col lg={8}>
                                            <Form.Group>
                                              <Form.Control
                                                type="text"
                                                // disabled={isInputDisabled}
                                                placeholder="Values"
                                                name="credit_values"
                                                id="credit_values"
                                                className="text-box"
                                                onChange={handleChange}
                                                value={values.credit_values}
                                                onKeyPress={(e) => {
                                                  OnlyEnterNumbers(e);
                                                }}
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                {errors.credit_values}
                                              </Form.Control.Feedback>
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                      </Col>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </Row>
                              </Col>
                              <Col lg={6}>
                                <Row>
                                  <Col lg={6}>
                                    <Row>
                                      <Col lg={2} className="d-flex">
                                        <Form.Label>Trade</Form.Label>
                                      </Col>
                                      <Col lg={10}>
                                        <Form.Group className="mt-1 d-flex">
                                          <Form.Check
                                            type="radio"
                                            label="Retailer"
                                            className="pr-3"
                                            id="Retailer"
                                            name="tradeOfBusiness"
                                            value="retailer"
                                            checked={
                                              values.tradeOfBusiness ==
                                              "retailer"
                                                ? true
                                                : false
                                            }
                                            onChange={handleChange}
                                          />
                                          <Form.Check
                                            className="ms-2"
                                            type="radio"
                                            label="Manufaturer"
                                            id="Manufaturer"
                                            name="tradeOfBusiness"
                                            value="manufacturer"
                                            checked={
                                              values.tradeOfBusiness ==
                                              "manufacturer"
                                                ? true
                                                : false
                                            }
                                            onChange={handleChange}
                                          />
                                          <Form.Check
                                            className="ms-2"
                                            type="radio"
                                            label="Distributor"
                                            id="distributor"
                                            name="tradeOfBusiness"
                                            value="distributor"
                                            checked={
                                              values.tradeOfBusiness ==
                                              "distributor"
                                                ? true
                                                : false
                                            }
                                            onChange={handleChange}
                                          />
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col lg={6}>
                                    <Row>
                                      <Col lg={4}>
                                        <Form.Label>Business Nature</Form.Label>
                                      </Col>
                                      <Col lg={8}>
                                        <Form.Group>
                                          <Form.Control
                                            type="text"
                                            placeholder="Business Nature"
                                            name="natureOfBusiness"
                                            className="text-box"
                                            id="natureOfBusiness"
                                            onChange={handleChange}
                                            value={values.natureOfBusiness}
                                          />
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                        <Row className="middleGapTop">
                          <Col lg={6} className="column_height">
                            <Card className="bottom_card_style">
                              <Card.Header className="d-flex">
                                <h3 className="my-auto">GST</h3>
                                <Form.Check
                                  type="switch"
                                  className="ms-1"
                                  onClick={this.handleSwitchClick}
                                  // label={values.isTaxation == true ? "Yes" : "No"}
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // this.gstFieldshow(e.target.checked);
                                    setFieldValue(
                                      "isTaxation",
                                      e.target.checked
                                    );
                                  }}
                                  name="isTaxation"
                                  id="isTaxation"
                                  value={
                                    values.isTaxation == true ? "Yes" : "No"
                                  }
                                />
                              </Card.Header>
                              <Card.Body>
                                <div className="card_sub_header">
                                  <Row>
                                    <Col lg={6}>
                                      {values.isTaxation == true ? (
                                        <>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Type</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group className="">
                                                <Select
                                                  className="selectTo"
                                                  styles={ledger_select}
                                                  // disabled={isInputDisabled}
                                                  onChange={(v) => {
                                                    setFieldValue(
                                                      "registraion_type",
                                                      v
                                                    );
                                                  }}
                                                  name="registraion_type"
                                                  options={GSTTypeOpt}
                                                  value={
                                                    values.registraion_type
                                                  }
                                                  invalid={
                                                    errors.registraion_type
                                                      ? true
                                                      : false
                                                  }
                                                  maxDate={new Date()}
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Reg. Date</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <MyTextDatePicker
                                                id="dateofregistartion"
                                                name="dateofregistartion"
                                                placeholder="DD/MM/YYYY"
                                                className="form-control"
                                                // disabled={isInputDisabled}
                                                value={
                                                  values.dateofregistartion
                                                }
                                                onChange={handleChange}
                                                onBlur={(e) => {
                                                  console.log("e ", e);
                                                  console.log(
                                                    "e.target.value ",
                                                    e.target.value
                                                  );
                                                  if (
                                                    e.target.value != null &&
                                                    e.target.value != ""
                                                  ) {
                                                    setFieldValue(
                                                      "dateofregistartion",
                                                      e.target.value
                                                    );
                                                    this.checkExpiryDate(
                                                      setFieldValue,
                                                      e.target.value,
                                                      "dateofregistartion"
                                                    );
                                                  } else {
                                                    setFieldValue(
                                                      "dateofregistartion",
                                                      ""
                                                    );
                                                  }
                                                }}
                                              />
                                              <span className="text-danger errormsg">
                                                {errors.dateofregistartion}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : (
                                        <Row>
                                          <Col lg={1} className="my-auto">
                                            <Form.Label>PAN</Form.Label>
                                          </Col>
                                          <Col lg={4}>
                                            <Form.Group>
                                              <Form.Control
                                                type="text"
                                                // readOnly
                                                // disabled={isInputDisabled}
                                                placeholder="PAN Number"
                                                name="pan_no"
                                                id="pan_no"
                                                className="text-box"
                                                onChange={handleChange}
                                                value={
                                                  values.pan_no &&
                                                  values.pan_no.toUpperCase()
                                                }
                                                isValid={
                                                  touched.pan_no &&
                                                  !errors.pan_no
                                                }
                                                isInvalid={!!errors.pan_no}
                                                maxLength={10}
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                {errors.pan_no}
                                              </Form.Control.Feedback>
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                      )}
                                    </Col>

                                    {values.isTaxation == true && (
                                      <>
                                        <Col lg={6}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>GSTIN</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder="GSTIN"
                                                  name="gstin"
                                                  maxLength={15}
                                                  className="text-box"
                                                  id="gstin"
                                                  onChange={handleChange}
                                                  value={
                                                    values.gstin &&
                                                    values.gstin.toUpperCase()
                                                  }
                                                  isValid={
                                                    touched.gstin &&
                                                    !errors.gstin
                                                  }
                                                  isInvalid={!!errors.gstin}
                                                  onBlur={(e) => {
                                                    e.preventDefault();

                                                    if (
                                                      values.gstin != "" &&
                                                      values.gstin != undefined
                                                    ) {
                                                      this.extract_pan_from_GSTIN(
                                                        values.gstin,
                                                        setFieldValue
                                                      );
                                                    } else {
                                                      setFieldValue(
                                                        "pan_no",
                                                        ""
                                                      );
                                                    }
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.gstin}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1} className="my-auto">
                                              <Form.Label>PAN</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // readOnly
                                                  // disabled={isInputDisabled}
                                                  placeholder="PAN Number"
                                                  name="pan_no"
                                                  id="pan_no"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={
                                                    values.pan_no &&
                                                    values.pan_no.toUpperCase()
                                                  }
                                                  isValid={
                                                    touched.pan_no &&
                                                    !errors.pan_no
                                                  }
                                                  isInvalid={!!errors.pan_no}
                                                  maxLength={10}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.pan_no}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1}>
                                              <Form.Control
                                                type="text"
                                                placeholder="index"
                                                name="index"
                                                className="text-box"
                                                onChange={handleChange}
                                                hidden
                                                value={values.index}
                                              />
                                              <Button
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  console.log(
                                                    "AADDD GSTR 76r327621834 gst values =-> ",
                                                    values
                                                  );
                                                  e.preventDefault();
                                                  if (
                                                    values.gstin != "" &&
                                                    values.gstin != null
                                                  ) {
                                                    let gstObj = {
                                                      id:
                                                        values.bid != null
                                                          ? values.bid
                                                          : "",
                                                      gstin:
                                                        values.gstin != null
                                                          ? values.gstin
                                                          : "",
                                                      dateofregistartion:
                                                        values.dateofregistartion !=
                                                          null &&
                                                        values.dateofregistartion !=
                                                          "NA" &&
                                                        values.dateofregistartion
                                                          ? values.dateofregistartion
                                                          : "",

                                                      pan_no:
                                                        values.pan_no != null
                                                          ? values.pan_no
                                                          : "",
                                                      index: !isNaN(
                                                        parseInt(values.index)
                                                      )
                                                        ? values.index
                                                        : -1,

                                                      registraion_type:
                                                        values.registraion_type !=
                                                        null
                                                          ? values.registraion_type
                                                          : "",
                                                    };
                                                    console.log(
                                                      "addGSTROW gstObj <<<<<<<<<<<<< ",
                                                      gstObj
                                                    );
                                                    this.addGSTRow(
                                                      gstObj,
                                                      setFieldValue
                                                    );
                                                  }
                                                  // else {
                                                  //   MyNotifications.fire({
                                                  //     show: true,
                                                  //     icon: "error",
                                                  //     title: "Error",
                                                  //     msg: "Please Enter GST Details ",
                                                  //     is_button_show: false,
                                                  //   });
                                                  // }
                                                }}
                                              >
                                                <FontAwesomeIcon
                                                  icon={faPlus}
                                                  className="plus-color"
                                                />
                                              </Button>
                                            </Col>
                                          </Row>
                                          {/* <Row className="mb-2">
                                          <Col md="4" className="">
                                            <Form.Control
                                              type="text"
                                              placeholder="index"
                                              name="index"
                                              className="text-box"
                                              onChange={handleChange}
                                              hidden
                                              value={values.index}
                                            />                                            
                                          </Col>
                                        </Row> */}
                                        </Col>
                                      </>
                                    )}
                                  </Row>
                                </div>
                                {/* {JSON.stringify(gstList)} */}
                                {gstList.length > 0 && (
                                  <div className="bottom_card_table">
                                    <Table hover>
                                      {/* <thead>
                                        <tr>
                                          <th>Sr.</th>                                          
                                          <th>Registration Date</th>
                                          <th>GST No.</th>
                                          <th>PAN No.</th>
                                          <th className="text-center">
                                            -
                                          </th>
                                        </tr>
                                      </thead> */}
                                      <tbody>
                                        {gstList.map((v, i) => {
                                          return (
                                            <tr
                                              onDoubleClick={(e) => {
                                                e.preventDefault();
                                                console.log("sneha", i, "v", v);
                                                let gstObj = {
                                                  id: v.id,
                                                  registraion_type:
                                                    v.registraion_type.label,
                                                  gstin: v.gstin,
                                                  dateofregistartion:
                                                    v.dateofregistartion,

                                                  pan_no: v.pan_no,
                                                };
                                                this.handleFetchGstData(
                                                  gstObj,
                                                  setFieldValue
                                                );
                                              }}
                                            >
                                              <td>
                                                {v.registraion_type.label}
                                              </td>
                                              <td>{v.dateofregistartion}</td>
                                              <td>{v.gstin.toUpperCase()}</td>
                                              <td>{v.pan_no}</td>
                                              <td className="text-center">
                                                <img
                                                  src={Delete}
                                                  alt=""
                                                  className="table_delete_icon"
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    this.removeGstRow(i);
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </Table>
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                            <Card className="bottom_card_style">
                              <Card.Header className="d-flex">
                                <h3 className="my-auto">License</h3>
                                <Form.Check
                                  type="switch"
                                  className="ms-1"
                                  onClick={this.handleSwitchClick}
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // this.gstFieldshow(e.target.checked);
                                    setFieldValue(
                                      "isLicense",
                                      e.target.checked
                                    );
                                  }}
                                  name="isLicense"
                                  id="isLicense"
                                  value={
                                    values.isLicense == true ? "Yes" : "No"
                                  }
                                />
                              </Card.Header>
                              <Card.Body>
                                <div className="card_sub_header">
                                  <Row>
                                    {values.isLicense == true ? (
                                      <>
                                        <Col lg={8}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Type</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group className="">
                                                <Select
                                                  className="selectTo"
                                                  styles={ledger_select}
                                                  // disabled={isInputDisabled}
                                                  options={licencesType}
                                                  onChange={(v) => {
                                                    setFieldValue(
                                                      "licences_type",
                                                      v
                                                    );
                                                  }}
                                                  name="licences_type"
                                                  value={values.licences_type}
                                                  invalid={
                                                    errors.licences_type
                                                      ? true
                                                      : false
                                                  }
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Number</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder=" Number"
                                                  name="licenses_num"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={values.licenses_num}
                                                  isValid={
                                                    touched.licenses_num &&
                                                    !errors.licenses_num
                                                  }
                                                  isInvalid={
                                                    !!errors.licenses_num
                                                  }
                                                />
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg={4}>
                                          <Row>
                                            <Col lg={4} className="my-auto">
                                              <Form.Label>
                                                Expity Date
                                              </Form.Label>
                                            </Col>
                                            <Col lg={6}>
                                              <MyTextDatePicker
                                                id="licenses_exp"
                                                name="licenses_exp"
                                                placeholder="DD/MM/YYYY"
                                                className="form-control"
                                                // disabled={isInputDisabled}
                                                value={values.licenses_exp}
                                                onChange={handleChange}
                                                onBlur={(e) => {
                                                  console.log("e ", e);
                                                  console.log(
                                                    "e.target.value ",
                                                    e.target.value
                                                  );
                                                  if (
                                                    e.target.value != null &&
                                                    e.target.value != ""
                                                  ) {
                                                    setFieldValue(
                                                      "licenses_exp",
                                                      e.target.value
                                                    );
                                                    this.checkExpiryDate(
                                                      setFieldValue,
                                                      e.target.value,
                                                      "licenses_exp"
                                                    );
                                                  } else {
                                                    setFieldValue(
                                                      "licenses_exp",
                                                      ""
                                                    );
                                                  }
                                                }}
                                              />
                                            </Col>

                                            <Col lg={2} className="text-end">
                                              <Button
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  if (
                                                    values.licences_type !=
                                                      "" &&
                                                    values.licences_type != null
                                                  ) {
                                                    let licensesObj = {
                                                      id:
                                                        values.did != null
                                                          ? values.did
                                                          : "",
                                                      licences_type:
                                                        values.licences_type !=
                                                        null
                                                          ? values.licences_type
                                                          : "",
                                                      licenses_num:
                                                        values.licenses_num !=
                                                        null
                                                          ? values.licenses_num
                                                          : "",
                                                      licenses_exp:
                                                        values.licenses_exp !=
                                                        null
                                                          ? values.licenses_exp
                                                          : "",
                                                      index:
                                                        values.index !==
                                                        undefined
                                                          ? values.index
                                                          : licensesList.length,
                                                    };
                                                    this.addLicensesRow(
                                                      licensesObj,
                                                      setFieldValue
                                                    );
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Please Enter Licenses Details ",
                                                      is_button_show: false,
                                                    });
                                                  }
                                                }}
                                              >
                                                <FontAwesomeIcon
                                                  icon={faPlus}
                                                  className="plus-color"
                                                />
                                              </Button>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </Row>
                                </div>
                                {/* {JSON.stringify(licensesList)} */}
                                {licensesList.length > 0 && (
                                  <div className="bottom_card_table">
                                    <Table hover>
                                      <tbody>
                                        {licensesList.map((v, i) => {
                                          return (
                                            <tr
                                              onDoubleClick={(e) => {
                                                e.preventDefault();
                                                console.log("sneha", i, "v", v);
                                                let licensesObj = {
                                                  id: v.id,
                                                  licences_type:
                                                    v.licences_type,
                                                  licenses_num: v.licenses_num,
                                                  licenses_exp: v.licenses_exp,
                                                  index: v.index,
                                                };
                                                this.handleFetchLicensesData(
                                                  licensesObj,
                                                  setFieldValue
                                                );
                                              }}
                                            >
                                              <td>{v.licences_type.label}</td>
                                              <td>{v.licenses_num}</td>
                                              <td>{v.licenses_exp}</td>
                                              <td className="text-center">
                                                <img
                                                  src={Delete}
                                                  alt=""
                                                  className="table_delete_icon"
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    this.removeLicensesRow(i);
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </Table>
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                            <Card className="bottom_card_style">
                              <Card.Header className="d-flex">
                                <h3 className="my-auto">Department</h3>
                                <Form.Check
                                  type="switch"
                                  className="ms-1"
                                  onClick={this.handleSwitchClick}
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // this.gstFieldshow(e.target.checked);
                                    setFieldValue(
                                      "isDepartment",
                                      e.target.checked
                                    );
                                  }}
                                  name="isDepartment"
                                  id="isDepartment"
                                  value={
                                    values.isDepartment == true ? "Yes" : "No"
                                  }
                                />
                              </Card.Header>
                              <Card.Body>
                                <div className="card_sub_header">
                                  <Row>
                                    {values.isDepartment == true ? (
                                      <>
                                        <Col lg={6}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Name</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group className="">
                                                <Form.Control
                                                  className="text-box"
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder="Department"
                                                  name="dept"
                                                  onChange={handleChange}
                                                  value={values.dept}
                                                  isValid={
                                                    touched.dept && !errors.dept
                                                  }
                                                  isInvalid={!!errors.dept}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.dept}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Number</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  placeholder="Contact Person"
                                                  name="contact_person"
                                                  className="text-box"
                                                  // disabled={isInputDisabled}
                                                  onChange={handleChange}
                                                  value={values.contact_person}
                                                  isValid={
                                                    touched.contact_person &&
                                                    !errors.contact_person
                                                  }
                                                  isInvalid={
                                                    !!errors.contact_person
                                                  }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.contact_person}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg={6}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Email</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=" Email"
                                                  name="email"
                                                  className="text-box"
                                                  // disabled={isInputDisabled}
                                                  onChange={handleChange}
                                                  value={values.email}
                                                  isValid={
                                                    touched.email &&
                                                    !errors.email
                                                  }
                                                  isInvalid={!!errors.email}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.email}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1}>
                                              <img
                                                src={phone}
                                                alt=""
                                                className="ledger_small_icons"
                                              />
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=" Enter"
                                                  name="contact_no"
                                                  className="text-box"
                                                  // disabled={isInputDisabled}
                                                  onChange={handleChange}
                                                  value={values.contact_no}
                                                  onKeyPress={(e) => {
                                                    OnlyEnterNumbers(e);
                                                  }}
                                                  isValid={
                                                    touched.contact_no &&
                                                    !errors.contact_no
                                                  }
                                                  isInvalid={
                                                    !!errors.contact_no
                                                  }
                                                  maxLength={10}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.contact_no}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>

                                            <Col lg={1} className="text-end">
                                              <Button
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();

                                                  if (
                                                    values.dept != "" &&
                                                    values.dept != null &&
                                                    values.contact_person !=
                                                      "" &&
                                                    values.contact_person !=
                                                      null
                                                  ) {
                                                    let deptObj = {
                                                      id:
                                                        values.did != null
                                                          ? values.did
                                                          : "",
                                                      dept:
                                                        values.dept != null
                                                          ? values.dept
                                                          : "",
                                                      contact_no:
                                                        values.contact_no !=
                                                        null
                                                          ? values.contact_no
                                                          : "",
                                                      contact_person:
                                                        values.contact_person !=
                                                        null
                                                          ? values.contact_person
                                                          : "",
                                                      email:
                                                        values.email != null
                                                          ? values.email
                                                          : "",
                                                      index: values.index
                                                        ? values.index
                                                        : -1,
                                                    };
                                                    this.addDeptRow(
                                                      deptObj,
                                                      setFieldValue
                                                    );
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Please Enter Department Details ",
                                                      is_button_show: false,
                                                    });
                                                  }
                                                }}
                                              >
                                                <FontAwesomeIcon
                                                  icon={faPlus}
                                                  className="plus-color"
                                                />
                                              </Button>
                                            </Col>
                                          </Row>
                                          <Row className="mb-2">
                                            <Col md="4" className="">
                                              <Form.Control
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
                                        </Col>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </Row>
                                </div>
                                {deptList.length > 0 && (
                                  <div className="bottom_card_table">
                                    <Table hover>
                                      {/* <thead>
                                        <tr>
                                          <th>Sr.</th>
                                          <th>Dept. Name</th>
                                          <th>Contact Person</th>
                                          <th>Contact No.</th>
                                          <th colSpan={2}>
                                            Email
                                          </th>
                                        </tr>
                                      </thead> */}
                                      <tbody>
                                        {deptList.map((v, i) => {
                                          return (
                                            <tr
                                              onDoubleClick={(e) => {
                                                e.preventDefault();
                                                console.log("sid", i, "v", v);

                                                let deptObj = {
                                                  dept: v.dept,
                                                  id: v.id,
                                                  contact_no: v.contact_no,

                                                  contact_person:
                                                    v.contact_person,
                                                  email: v.email,
                                                  // index: v.index,
                                                };
                                                this.handleFetchDepartmentData(
                                                  deptObj,
                                                  setFieldValue
                                                );
                                              }}
                                            >
                                              <td>{v.dept}</td>
                                              <td>{v.contact_person}</td>
                                              <td>{v.email}</td>
                                              <td>{v.contact_no}</td>
                                              <td className="text-center">
                                                <img
                                                  src={Delete}
                                                  alt=""
                                                  className="table_delete_icon"
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    this.removeDeptRow(i);
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </Table>
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col lg={6} className="column_height">
                            <Card className="bottom_card_style">
                              <Card.Header className="d-flex">
                                <h3 className="my-auto">Bank Details</h3>
                                <Form.Check
                                  type="switch"
                                  className="ms-1"
                                  onClick={this.handleSwitchClick}
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // this.gstFieldshow(e.target.checked);
                                    setFieldValue(
                                      "isBankDetails",
                                      e.target.checked
                                    );
                                  }}
                                  name="isBankDetails"
                                  id="isBankDetails"
                                  value={
                                    values.isBankDetails == true ? "Yes" : "No"
                                  }
                                />
                              </Card.Header>
                              <Card.Body>
                                <div className="card_sub_header">
                                  <Row>
                                    {values.isBankDetails == true ? (
                                      <>
                                        <Col lg={6}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Bank</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder="Bank Name"
                                                  name="bank_name"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={values.bank_name}
                                                  onKeyPress={(e) => {
                                                    OnlyAlphabets(e);
                                                  }}
                                                  isValid={
                                                    touched.bank_name &&
                                                    !errors.bank_name
                                                  }
                                                  isInvalid={!!errors.bank_name}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.bank_name}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1} className="my-auto">
                                              <Form.Label>A/C</Form.Label>
                                            </Col>
                                            <Col lg={5}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder=" Number"
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
                                                  isInvalid={
                                                    !!errors.bank_account_no
                                                  }
                                                  maxLength={14}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.bank_account_no}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg={6}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>IFSC</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder=" IFSC Code"
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
                                                  isInvalid={
                                                    !!errors.bank_ifsc_code
                                                  }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.bank_ifsc_code}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Branch</Form.Label>
                                            </Col>
                                            <Col lg={3}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder=" Branch"
                                                  name="bank_branch"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={values.bank_branch}
                                                  isValid={
                                                    touched.bank_branch &&
                                                    !errors.bank_branch
                                                  }
                                                  isInvalid={
                                                    !!errors.bank_branch
                                                  }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.bank_branch}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1}>
                                              <Button
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();

                                                  if (
                                                    values.bank_name != "" &&
                                                    values.bank_name != null &&
                                                    values.bank_account_no !=
                                                      "" &&
                                                    values.bank_account_no !=
                                                      null &&
                                                    values.bank_ifsc_code !=
                                                      "" &&
                                                    values.bank_ifsc_code !=
                                                      null &&
                                                    values.bank_branch != "" &&
                                                    values.bank_branch != null
                                                  ) {
                                                    let bankObj = {
                                                      bank_name:
                                                        values.bank_name != null
                                                          ? values.bank_name
                                                          : "",
                                                      bank_account_no:
                                                        values.bank_account_no !=
                                                        null
                                                          ? values.bank_account_no
                                                          : "",
                                                      bank_ifsc_code:
                                                        values.bank_ifsc_code !=
                                                        null
                                                          ? values.bank_ifsc_code
                                                          : "",
                                                      bank_branch:
                                                        values.bank_branch !=
                                                        null
                                                          ? values.bank_branch
                                                          : "",
                                                      id:
                                                        values.bid != null
                                                          ? values.bid
                                                          : "",
                                                      index: !isNaN(
                                                        parseInt(values.index)
                                                      )
                                                        ? values.index
                                                        : -1,
                                                    };
                                                    console.log(
                                                      "ADDBANKROW bankObj <<<<<<<<<<<<< ",
                                                      bankObj,
                                                      values
                                                    );
                                                    this.addBankRow(
                                                      bankObj,
                                                      setFieldValue
                                                    );
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Please Enter Bank Details ",
                                                      is_button_show: false,
                                                    });
                                                  }
                                                }}
                                              >
                                                <FontAwesomeIcon
                                                  icon={faPlus}
                                                  className="plus-color"
                                                />
                                              </Button>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </Row>
                                </div>
                                {bankList.length > 0 && (
                                  <div className="bottom_card_table">
                                    <Table hover>
                                      <tbody>
                                        {bankList.map((v, i) => {
                                          return (
                                            <tr
                                              onDoubleClick={(e) => {
                                                e.preventDefault();
                                                console.log("sneha", v);
                                                let bankObj = {
                                                  id: v.bid,
                                                  bank_name:
                                                    v.bank_name != null
                                                      ? v.bank_name
                                                      : "",
                                                  bank_account_no:
                                                    v.bank_account_no != null
                                                      ? v.bank_account_no
                                                      : "",
                                                  bank_ifsc_code:
                                                    v.bank_ifsc_code != null
                                                      ? v.bank_ifsc_code
                                                      : "",
                                                  bank_branch:
                                                    v.bank_branch != null
                                                      ? v.bank_branch
                                                      : "",
                                                  index: v.index,
                                                };
                                                this.handleFetchBankData(
                                                  bankObj,
                                                  setFieldValue
                                                );
                                              }}
                                            >
                                              <td> {v.bank_name}</td>
                                              <td> {v.bank_account_no}</td>
                                              <td>{v.bank_ifsc_code}</td>
                                              <td>{v.bank_branch}</td>
                                              <td className="text-end">
                                                <Button
                                                  style={{
                                                    marginTop: "-12px",
                                                  }}
                                                  className=""
                                                  variant=""
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    this.removeBankRow(i);
                                                  }}
                                                >
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                  />
                                                </Button>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </Table>
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                            <Card className="bottom_card_style">
                              <Card.Header className="d-flex">
                                <h3 className="my-auto">Shipping Details</h3>
                                <Form.Check
                                  type="switch"
                                  className="ms-1"
                                  onClick={this.handleSwitchClick}
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // this.gstFieldshow(e.target.checked);
                                    setFieldValue(
                                      "isShippingDetails",
                                      e.target.checked
                                    );
                                  }}
                                  name="isShippingDetails"
                                  id="isShippingDetails"
                                  value={
                                    values.isShippingDetails == true
                                      ? "Yes"
                                      : "No"
                                  }
                                />
                              </Card.Header>
                              <Card.Body>
                                <div className="card_sub_header">
                                  <Row>
                                    {values.isShippingDetails == true ? (
                                      <>
                                        <Col lg={8}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Address</Form.Label>
                                            </Col>
                                            <Col lg={10}>
                                              <Form.Group className="">
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  className="text-box"
                                                  name="shipping_address"
                                                  onChange={handleChange}
                                                  value={
                                                    values.shipping_address
                                                  }
                                                  isValid={
                                                    touched.shipping_address &&
                                                    !errors.shipping_address
                                                  }
                                                  isInvalid={
                                                    !!errors.shipping_address
                                                  }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.shipping_address}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg={4}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>State</Form.Label>
                                            </Col>
                                            <Col lg={8}>
                                              <Form.Group>
                                                {/* <Form.Control
                                                type="text"
                                                disabled={isInputDisabled}                                                
                                                name="district"
                                                className="text-box"
                                                onChange={handleChange}
                                                value={values.district}
                                                isValid={
                                                  touched.district &&
                                                  !errors.district
                                                }
                                                isInvalid={!!errors.district}
                                                onKeyPress={(e) => {
                                                  OnlyAlphabets(e);
                                                }}
                                              /> */}
                                                <Select
                                                  className="selectTo"
                                                  styles={ledger_select}
                                                  // disabled={isInputDisabled}
                                                  onChange={(v) => {
                                                    setFieldValue(
                                                      "district",
                                                      v
                                                    );
                                                  }}
                                                  name="district"
                                                  options={stateOpt}
                                                  value={values.district}
                                                  invalid={
                                                    errors.district
                                                      ? true
                                                      : false
                                                  }
                                                />
                                                <span className="text-danger">
                                                  {errors.district}
                                                </span>
                                              </Form.Group>
                                            </Col>

                                            <Col lg={2} className="text-end">
                                              <Button
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  console.log(
                                                    "values.index",
                                                    values.index
                                                  );
                                                  if (
                                                    values.district != "" &&
                                                    values.district != null &&
                                                    values.shipping_address !=
                                                      "" &&
                                                    values.shipping_address !=
                                                      null
                                                  ) {
                                                    let shipObj = {
                                                      id:
                                                        values.sid != null
                                                          ? values.sid
                                                          : "",
                                                      district:
                                                        values.district != null
                                                          ? values.district
                                                          : "",
                                                      shipping_address:
                                                        values.shipping_address !=
                                                        null
                                                          ? values.shipping_address
                                                          : "",
                                                      index: values.index
                                                        ? values.index
                                                        : -1,
                                                    };
                                                    console.log(
                                                      "addShip shipObj <<<<<<<<<<<<< ",
                                                      shipObj
                                                    );
                                                    this.addShippingRow(
                                                      shipObj,
                                                      setFieldValue
                                                    );
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Please Enter Shipping Details ",
                                                      is_button_show: false,
                                                    });
                                                  }
                                                }}
                                              >
                                                <FontAwesomeIcon
                                                  icon={faPlus}
                                                  className="plus-color"
                                                />
                                              </Button>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </Row>
                                </div>
                                {/* {JSON.stringify(shippingList)} */}
                                {shippingList.length > 0 && (
                                  <div className="bottom_card_table">
                                    <Table hover>
                                      <tbody>
                                        {shippingList.map((v, i) => {
                                          return (
                                            <tr
                                              onDoubleClick={(e) => {
                                                e.preventDefault();
                                                console.log("sid", i, "v", v);

                                                let shipObj = {
                                                  district: v.district,
                                                  id: v.id,
                                                  shipping_address:
                                                    v.shipping_address,
                                                  // index: v.index,
                                                };
                                                this.handleFetchShippingData(
                                                  shipObj,
                                                  setFieldValue
                                                );
                                              }}
                                            >
                                              <td>{v.shipping_address}</td>
                                              <td>{v.district.label}</td>

                                              <td className="text-end">
                                                <img
                                                  src={Delete}
                                                  alt=""
                                                  className="table_delete_icon"
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    this.removeShippingRow(i);
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </Table>
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>

                        <Row className="mt-2">
                          <Col lg={6}></Col>
                        </Row>

                        <Row className="btm-button-row">
                          <Col md="12" className="text-end">
                            <Button className="submit-btn me-2" type="submit">
                              Update
                            </Button>
                            <Button
                              variant="secondary"
                              className="cancel-btn me-3"
                              onClick={(e) => {
                                e.preventDefault();
                                MyNotifications.fire(
                                  {
                                    show: true,
                                    icon: "confirm",
                                    title: "Confirm",
                                    msg: "Do you want to cancel",
                                    is_button_show: false,
                                    is_timeout: false,
                                    delay: 0,
                                    handleSuccessFn: () => {
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "ledgerlist"
                                      // );

                                      if (this.state.source != "") {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: this.state.source.from_page,
                                          prop_data: {
                                            rows: this.state.source.rows,
                                            invoice_data:
                                              this.state.source.invoice_data,
                                            ...this.state.source,
                                          },
                                          isNewTab: false,
                                        });
                                        this.setState({ source: "" });
                                      } else {
                                        eventBus.dispatch(
                                          "page_change",
                                          "ledgerlist"
                                        );
                                      }
                                    },
                                    handleFailFn: () => {},
                                  },
                                  () => {
                                    console.warn("return_data");
                                  }
                                );
                              }}
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </>
                  )}
                {values.underId &&
                  values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    "sundry_debtors" && (
                    <>
                      {/* sundry debetor form start  */}
                      <div className="middle_card_main">
                        <Card className="middle_card">
                          <Card.Body>
                            <Row>
                              <Col lg={4}>
                                <Row>
                                  <Col lg={3} className="my-auto">
                                    <Form.Label>Registered Name</Form.Label>
                                  </Col>
                                  <Col lg={9}>
                                    <Form.Group>
                                      <Form.Control
                                        autoFocus="true"
                                        type="text"
                                        placeholder="Registered Name"
                                        name="mailing_name"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.mailing_name}
                                        isValid={
                                          touched.mailing_name &&
                                          !errors.mailing_name
                                        }
                                        isInvalid={!!errors.mailing_name}
                                      />
                                      <span className="text-danger errormsg">
                                        {errors.mailing_name}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={6}>
                                <Row>
                                  <Col lg={1} className="my-auto">
                                    <Form.Label>Address</Form.Label>
                                  </Col>
                                  <Col lg={11}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Address"
                                        name="address"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.address}
                                        isValid={
                                          touched.address && !errors.address
                                        }
                                        isInvalid={!!errors.address}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.address}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={2}>
                                <Row>
                                  <Col lg={3} className="my-auto">
                                    <Form.Label>State</Form.Label>
                                  </Col>
                                  <Col lg={9}>
                                    <Form.Group className="">
                                      <Select
                                        className="selectTo"
                                        styles={ledger_select}
                                        options={stateOpt}
                                        value={values.stateId}
                                        invalid={errors.stateId ? true : false}
                                      />
                                      <span className="text-danger">
                                        {errors.stateId}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col lg={1}>
                                <Row>
                                  <Col lg={4} className="my-auto">
                                    <Form.Label>Pin</Form.Label>
                                  </Col>
                                  <Col lg={8}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Pin"
                                        name="pincode"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.pincode}
                                        onKeyPress={(e) => {
                                          OnlyEnterNumbers(e);
                                        }}
                                        maxLength={6}
                                        isValid={
                                          touched.pincode && !errors.pincode
                                        }
                                        isInvalid={!!errors.pincode}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.pincode}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={4} className="my-auto">
                                <Row>
                                  <Col lg={1}>
                                    <img
                                      src={phone}
                                      alt=""
                                      className="ledger_small_icons"
                                    />
                                  </Col>
                                  <Col lg={5}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter"
                                        name="phone_no"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.phone_no}
                                        onKeyPress={(e) => {
                                          OnlyEnterNumbers(e);
                                        }}
                                        isValid={
                                          touched.phone_no && !errors.phone_no
                                        }
                                        isInvalid={!!errors.phone_no}
                                        maxLength={10}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.phone_no}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  <Col lg={1}>
                                    <img
                                      src={whatsapp}
                                      alt=""
                                      className="ledger_small_icons"
                                    />
                                  </Col>
                                  <Col lg={5}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter"
                                        name="whatsapp_no"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.whatsapp_no}
                                        onKeyPress={(e) => {
                                          OnlyEnterNumbers(e);
                                        }}
                                        isValid={
                                          touched.whatsapp_no &&
                                          !errors.whatsapp_no
                                        }
                                        isInvalid={!!errors.whatsapp_no}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.whatsapp_no}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3}>
                                <Row>
                                  <Col lg={2} className="my-auto">
                                    <Form.Label>Email</Form.Label>
                                  </Col>
                                  <Col lg={10}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Email"
                                        name="email_id"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.email_id}
                                        isValid={
                                          touched.email_id && !errors.email_id
                                        }
                                        isInvalid={!!errors.email_id}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.email_id}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={2}>
                                <Row>
                                  <Col lg={4} className="my-auto">
                                    <Form.Label>Reg. No.</Form.Label>
                                  </Col>
                                  <Col lg={8}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Registration No."
                                        name="licenseNo"
                                        className="text-box"
                                        id="licenseNo"
                                        onChange={handleChange}
                                        value={values.licenseNo}
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={2}>
                                <Row>
                                  <Col lg={3} className="my-auto">
                                    <Form.Label>Reg. Date</Form.Label>
                                  </Col>
                                  <Col lg={9}>
                                    <MyTextDatePicker
                                      id="license_expiry"
                                      name="license_expiry"
                                      placeholder="DD/MM/YYYY"
                                      className="form-control"
                                      value={values.license_expiry}
                                      onChange={handleChange}
                                      onBlur={(e) => {
                                        console.log("e ", e);
                                        console.log(
                                          "e.target.value ",
                                          e.target.value
                                        );
                                        if (
                                          e.target.value != null &&
                                          e.target.value != ""
                                        ) {
                                          setFieldValue(
                                            "license_expiry",
                                            e.target.value
                                          );
                                          this.checkExpiryDate(
                                            setFieldValue,
                                            e.target.value,
                                            "license_expiry"
                                          );
                                        } else {
                                          setFieldValue("license_expiry", "");
                                        }
                                      }}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col lg={6} style={{ borderRight: "1px solid" }}>
                                <Row>
                                  <Col lg={2} className="d-flex">
                                    <Form.Label>Credit</Form.Label>
                                    <Form.Check
                                      type="switch"
                                      className="ms-1 my-auto"
                                      onClick={this.handleSwitchClick}
                                      onChange={(e) => {
                                        console.log(
                                          "Is Checked:--->",
                                          e.target.checked
                                        );
                                        // this.gstFieldshow(e.target.checked);
                                        setFieldValue(
                                          "isCredit",
                                          e.target.checked
                                        );
                                      }}
                                      name="isCredit"
                                      id="isCredit"
                                      value={
                                        values.isCredit == true ? "Yes" : "No"
                                      }
                                    />
                                  </Col>
                                  {values.isCredit == true ? (
                                    <>
                                      <Col lg={2}>
                                        <Row>
                                          <Col lg={4}>
                                            <Form.Label>Days</Form.Label>
                                          </Col>
                                          <Col lg={8}>
                                            <Form.Group>
                                              <Form.Control
                                                type="text"
                                                // disabled={isInputDisabled}
                                                placeholder="Days"
                                                name="credit_days"
                                                id="credit_days"
                                                className="text-box"
                                                onChange={handleChange}
                                                value={values.credit_days}
                                                maxLength={3}
                                                onKeyPress={(e) => {
                                                  OnlyEnterNumbers(e);
                                                }}
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                {errors.credit_days}
                                              </Form.Control.Feedback>
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                      </Col>
                                      {/* <Col lg={2}> */}
                                      {parseInt(values.credit_days) > 0 ? (
                                        <Col lg={4}>
                                          <Row>
                                            <Col md={5}>
                                              <Form.Label className="mb-2">
                                                Applicable From
                                              </Form.Label>{" "}
                                            </Col>
                                            <Col md={7}>
                                              <Form.Group className="mb-2">
                                                <Select
                                                  // disabled={isInputDisabled}
                                                  ////isClearable={true}
                                                  styles={ledger_select}
                                                  className="selectTo"
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      "applicable_from",
                                                      e
                                                    );
                                                  }}
                                                  options={
                                                    applicable_from_options
                                                  }
                                                  name="applicable_from"
                                                  id="applicable_from"
                                                  value={values.applicable_from}
                                                  invalid={
                                                    errors.applicable_from
                                                      ? true
                                                      : false
                                                  }
                                                />
                                                <span className="text-danger">
                                                  {errors.applicable_from}
                                                </span>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                      ) : (
                                        <></>
                                      )}
                                      {/* </Col> */}
                                      <Col lg={2}>
                                        <Row>
                                          <Col lg={4}>
                                            <Form.Label>Bills</Form.Label>
                                          </Col>
                                          <Col lg={8}>
                                            <Form.Group>
                                              <Form.Control
                                                type="text"
                                                // disabled={isInputDisabled}
                                                placeholder="Bills"
                                                name="credit_bills"
                                                id="credit_bills"
                                                className="text-box"
                                                onChange={handleChange}
                                                value={values.credit_bills}
                                                maxLength={3}
                                                onKeyPress={(e) => {
                                                  OnlyEnterNumbers(e);
                                                }}
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                {errors.credit_bills}
                                              </Form.Control.Feedback>
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                      </Col>
                                      <Col lg={2}>
                                        <Row>
                                          <Col lg={4}>
                                            <Form.Label>Values</Form.Label>
                                          </Col>
                                          <Col lg={8}>
                                            <Form.Group>
                                              <Form.Control
                                                type="text"
                                                // disabled={isInputDisabled}
                                                placeholder="Values"
                                                name="credit_values"
                                                id="credit_values"
                                                className="text-box"
                                                onChange={handleChange}
                                                value={values.credit_values}
                                                onKeyPress={(e) => {
                                                  OnlyEnterNumbers(e);
                                                }}
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                {errors.credit_values}
                                              </Form.Control.Feedback>
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                      </Col>
                                      <Col lg={4}>
                                        {isUserControl(
                                          "is_multi_rates",
                                          this.props.userControl
                                        ) ? (
                                          <Row>
                                            <Col lg={3}>
                                              <Form.Label>
                                                Sales Rate
                                              </Form.Label>
                                            </Col>
                                            <Col lg={7}>
                                              <Form.Group className="">
                                                <Select
                                                  className="selectTo"
                                                  id="salesrate"
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      "salesrate",
                                                      e
                                                    );
                                                  }}
                                                  options={sales_rate_options}
                                                  name="salesrate"
                                                  styles={ledger_select}
                                                  value={values.salesrate}
                                                />
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        ) : (
                                          <></>
                                        )}
                                      </Col>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </Row>
                              </Col>
                              <Col lg={6}>
                                <Row>
                                  <Col lg={6}>
                                    <Row>
                                      <Col lg={2} className="d-flex">
                                        <Form.Label>Trade</Form.Label>
                                      </Col>
                                      <Col lg={10}>
                                        <Row>
                                          <Col lg={3}>
                                            <Form.Check // prettier-ignore
                                              type="radio"
                                              id="Retailer"
                                              label="Retailer"
                                              name="tradeOfBusiness"
                                              value="retailer"
                                              checked={
                                                values.tradeOfBusiness ==
                                                "retailer"
                                                  ? true
                                                  : false
                                              }
                                              onChange={handleChange}
                                            />
                                          </Col>
                                          <Col lg={4}>
                                            <Form.Check // prettier-ignore
                                              type="radio"
                                              id="Manufaturer"
                                              label="Manufacturer"
                                              name="tradeOfBusiness"
                                              value="manufacturer"
                                              checked={
                                                values.tradeOfBusiness ==
                                                "manufacturer"
                                                  ? true
                                                  : false
                                              }
                                              onChange={handleChange}
                                            />
                                          </Col>
                                          <Col lg={4}>
                                            <Form.Check // prettier-ignore
                                              type="radio"
                                              id="distributor"
                                              label="Distributor"
                                              name="tradeOfBusiness"
                                              value="distributor"
                                              checked={
                                                values.tradeOfBusiness ==
                                                "distributor"
                                                  ? true
                                                  : false
                                              }
                                              onChange={handleChange}
                                            />
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col lg={6}>
                                    <Row>
                                      <Col lg={4}>
                                        <Form.Label>Business Nature</Form.Label>
                                      </Col>
                                      <Col lg={8}>
                                        <Form.Group>
                                          <Form.Control
                                            type="text"
                                            placeholder="Business Nature"
                                            className="text-box"
                                            name="natureOfBusiness"
                                            id="natureOfBusiness"
                                            onChange={handleChange}
                                            value={values.natureOfBusiness}
                                          />
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                        <Row className="mt-2">
                          <Col lg={6}>
                            <Card className="bottom_card_style">
                              <Card.Header className="d-flex">
                                <h3 className="my-auto">GST</h3>
                                <Form.Check
                                  type="switch"
                                  className="ms-1"
                                  onClick={this.handleSwitchClick}
                                  // label={values.isTaxation == true ? "Yes" : "No"}
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // this.gstFieldshow(e.target.checked);
                                    setFieldValue(
                                      "isTaxation",
                                      e.target.checked
                                    );
                                  }}
                                  name="isTaxation"
                                  id="isTaxation"
                                  value={
                                    values.isTaxation == true ? "Yes" : "No"
                                  }
                                />
                              </Card.Header>
                              <Card.Body>
                                <div className="card_sub_header">
                                  <Row>
                                    <Col lg={6}>
                                      {values.isTaxation == true ? (
                                        <>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Type</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group className="">
                                                <Select
                                                  className="selectTo"
                                                  styles={ledger_select}
                                                  // disabled={isInputDisabled}
                                                  onChange={(v) => {
                                                    setFieldValue(
                                                      "registraion_type",
                                                      v
                                                    );
                                                  }}
                                                  name="registraion_type"
                                                  options={GSTTypeOpt}
                                                  value={
                                                    values.registraion_type
                                                  }
                                                  invalid={
                                                    errors.registraion_type
                                                      ? true
                                                      : false
                                                  }
                                                  maxDate={new Date()}
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Reg. Date</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <MyTextDatePicker
                                                id="dateofregistartion"
                                                name="dateofregistartion"
                                                placeholder="DD/MM/YYYY"
                                                className="form-control"
                                                // disabled={isInputDisabled}
                                                value={
                                                  values.dateofregistartion
                                                }
                                                onChange={handleChange}
                                                onBlur={(e) => {
                                                  console.log("e ", e);
                                                  console.log(
                                                    "e.target.value ",
                                                    e.target.value
                                                  );
                                                  if (
                                                    e.target.value != null &&
                                                    e.target.value != ""
                                                  ) {
                                                    setFieldValue(
                                                      "dateofregistartion",
                                                      e.target.value
                                                    );
                                                    this.checkExpiryDate(
                                                      setFieldValue,
                                                      e.target.value,
                                                      "dateofregistartion"
                                                    );
                                                  } else {
                                                    setFieldValue(
                                                      "dateofregistartion",
                                                      ""
                                                    );
                                                  }
                                                }}
                                              />
                                              <span className="text-danger errormsg">
                                                {errors.dateofregistartion}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : (
                                        <Row>
                                          <Col lg={1} className="my-auto">
                                            <Form.Label>PAN</Form.Label>
                                          </Col>
                                          <Col lg={4}>
                                            <Form.Group>
                                              <Form.Control
                                                type="text"
                                                // readOnly
                                                // disabled={isInputDisabled}
                                                placeholder="PAN Number"
                                                name="pan_no"
                                                id="pan_no"
                                                className="text-box"
                                                onChange={handleChange}
                                                value={
                                                  values.pan_no &&
                                                  values.pan_no.toUpperCase()
                                                }
                                                isValid={
                                                  touched.pan_no &&
                                                  !errors.pan_no
                                                }
                                                isInvalid={!!errors.pan_no}
                                                maxLength={10}
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                {errors.pan_no}
                                              </Form.Control.Feedback>
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                      )}
                                    </Col>

                                    {values.isTaxation == true && (
                                      <>
                                        <Col lg={6}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>GSTIN</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder="GSTIN"
                                                  name="gstin"
                                                  maxLength={15}
                                                  className="text-box"
                                                  id="gstin"
                                                  onChange={handleChange}
                                                  value={
                                                    values.gstin &&
                                                    values.gstin.toUpperCase()
                                                  }
                                                  isValid={
                                                    touched.gstin &&
                                                    !errors.gstin
                                                  }
                                                  isInvalid={!!errors.gstin}
                                                  onBlur={(e) => {
                                                    e.preventDefault();

                                                    if (
                                                      values.gstin != "" &&
                                                      values.gstin != undefined
                                                    ) {
                                                      this.extract_pan_from_GSTIN(
                                                        values.gstin,
                                                        setFieldValue
                                                      );
                                                    } else {
                                                      setFieldValue(
                                                        "pan_no",
                                                        ""
                                                      );
                                                    }
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.gstin}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1} className="my-auto">
                                              <Form.Label>PAN</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // readOnly
                                                  // disabled={isInputDisabled}
                                                  placeholder="PAN Number"
                                                  name="pan_no"
                                                  id="pan_no"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={
                                                    values.pan_no &&
                                                    values.pan_no.toUpperCase()
                                                  }
                                                  isValid={
                                                    touched.pan_no &&
                                                    !errors.pan_no
                                                  }
                                                  isInvalid={!!errors.pan_no}
                                                  maxLength={10}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.pan_no}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1}>
                                              <Form.Control
                                                type="text"
                                                placeholder="index"
                                                name="index"
                                                className="text-box"
                                                onChange={handleChange}
                                                hidden
                                                value={values.index}
                                              />
                                              <Button
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  if (
                                                    values.gstin != "" &&
                                                    values.gstin != null
                                                  ) {
                                                    let gstObj = {
                                                      id:
                                                        values.bid != null
                                                          ? values.bid
                                                          : "",
                                                      gstin:
                                                        values.gstin != null
                                                          ? values.gstin
                                                          : "",
                                                      dateofregistartion:
                                                        values.dateofregistartion !=
                                                          null &&
                                                        values.dateofregistartion !=
                                                          "NA" &&
                                                        values.dateofregistartion
                                                          ? values.dateofregistartion
                                                          : "",
                                                      pan_no:
                                                        values.pan_no != null
                                                          ? values.pan_no
                                                          : "",
                                                      index: !isNaN(
                                                        parseInt(values.index)
                                                      )
                                                        ? values.index
                                                        : -1,
                                                      registraion_type:
                                                        values.registraion_type !=
                                                        null
                                                          ? values.registraion_type
                                                          : "",
                                                    };
                                                    this.addGSTRow(
                                                      gstObj,
                                                      setFieldValue
                                                    );
                                                  }
                                                  // else {
                                                  //   MyNotifications.fire({
                                                  //     show: true,
                                                  //     icon: "error",
                                                  //     title: "Error",
                                                  //     msg: "Please Enter GST Details ",
                                                  //     is_button_show: false,
                                                  //   });
                                                  // }
                                                }}
                                              >
                                                <FontAwesomeIcon
                                                  icon={faPlus}
                                                  className="plus-color"
                                                />
                                              </Button>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </>
                                    )}
                                  </Row>
                                </div>
                                {gstList.length > 0 && (
                                  <div className="bottom_card_table">
                                    <Table hover>
                                      <tbody>
                                        {gstList.map((v, i) => {
                                          return (
                                            <tr
                                              onDoubleClick={(e) => {
                                                e.preventDefault();
                                                console.log("sneha", i, "v", v);
                                                let gstObj = {
                                                  id: v.id,

                                                  gstin: v.gstin,
                                                  dateofregistartion:
                                                    v.dateofregistartion,

                                                  pan_no: v.pan_no,
                                                  // index:
                                                  //   v.index,
                                                };
                                                this.handleFetchGstData(
                                                  gstObj,
                                                  setFieldValue
                                                );
                                              }}
                                            >
                                              <td>
                                                {v.registraion_type.label}
                                              </td>
                                              <td>{v.dateofregistartion}</td>
                                              <td>{v.gstin.toUpperCase()}</td>
                                              <td>{v.pan_no}</td>
                                              <td className="text-center">
                                                <img
                                                  src={Delete}
                                                  alt=""
                                                  className="table_delete_icon"
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    this.removeGstRow(i);
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </Table>
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col lg={6}>
                            <Card className="bottom_card_style">
                              <Card.Header className="d-flex">
                                <h3 className="my-auto">Salesman</h3>
                                <Form.Check
                                  type="switch"
                                  className="ms-1"
                                  onClick={this.handleSwitchClick}
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // this.gstFieldshow(e.target.checked);
                                    setFieldValue(
                                      "isSalesman",
                                      e.target.checked
                                    );
                                  }}
                                  name="isSalesman"
                                  id="isSalesman"
                                  value={
                                    values.isSalesman == true ? "Yes" : "No"
                                  }
                                />
                              </Card.Header>
                              <Card.Body>
                                <div className="card_sub_header">
                                  <Row>
                                    {values.isSalesman == true ? (
                                      <>
                                        <Col lg={8}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Salesman</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group className="">
                                                <Select
                                                  className="selectTo"
                                                  // disabled={isInputDisabled}
                                                  components={{
                                                    IndicatorSeparator: () =>
                                                      null,
                                                  }}
                                                  // styles={purchaseSelect}
                                                  ////isClearable={true}
                                                  options={salesmanLst}
                                                  name="salesmanId"
                                                  id="salesmanId"
                                                  onChange={(v) => {
                                                    setFieldValue(
                                                      "salesmanId",
                                                      v
                                                    );
                                                  }}
                                                  value={values.salesmanId}
                                                  styles={ledger_select}
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1} className="my-auto">
                                              <Form.Label>Area</Form.Label>
                                            </Col>
                                            <Col lg={5}>
                                              <Form.Group>
                                                <Select
                                                  className="selectTo"
                                                  // disabled={isInputDisabled}
                                                  components={{
                                                    IndicatorSeparator: () =>
                                                      null,
                                                  }}
                                                  // styles={purchaseSelect}
                                                  ////isClearable={true}
                                                  options={areaLst}
                                                  name="areaId"
                                                  id="areaId"
                                                  onChange={(v) => {
                                                    setFieldValue("areaId", v);
                                                  }}
                                                  value={values.areaId}
                                                  styles={ledger_select}
                                                />
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg={4}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Route</Form.Label>
                                            </Col>
                                            <Col lg={8}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  placeholder="Enter Route"
                                                  name="route"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={values.route}
                                                />
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </Row>
                                </div>
                                {salesmanList.length > 0 && (
                                  <div className="bottom_card_table">
                                    <Table hover>
                                      <tbody>
                                        {salesmanList.map((v, i) => {
                                          return (
                                            <tr
                                              onDoubleClick={(e) => {
                                                e.preventDefault();
                                                console.log("sneha", i, "v", v);
                                                let salesmanObj = {
                                                  id: v.id,
                                                  salesmanId: v.salesmanId,
                                                  areaId: v.areaId,
                                                  route: v.route,
                                                  index: v.index,
                                                };
                                                this.handleFetchSalesmanData(
                                                  salesmanObj,
                                                  setFieldValue
                                                );
                                              }}
                                            >
                                              <td>{v.salesmanId.label}</td>
                                              <td>{v.areaId}</td>
                                              <td>{v.route}</td>
                                              <td className="text-center">
                                                <img
                                                  src={Delete}
                                                  alt=""
                                                  className="table_delete_icon"
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    this.removeSalesmanRow(i);
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </Table>
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={6}>
                            <Card className="bottom_card_style">
                              <Card.Header className="d-flex">
                                <h3 className="my-auto">License</h3>
                                <Form.Check
                                  type="switch"
                                  className="ms-1"
                                  onClick={this.handleSwitchClick}
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // this.gstFieldshow(e.target.checked);
                                    setFieldValue(
                                      "isLicense",
                                      e.target.checked
                                    );
                                  }}
                                  name="isLicense"
                                  id="isLicense"
                                  value={
                                    values.isLicense == true ? "Yes" : "No"
                                  }
                                />
                              </Card.Header>
                              <Card.Body>
                                <div className="card_sub_header">
                                  <Row>
                                    {values.isLicense == true ? (
                                      <>
                                        <Col lg={8}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Type</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group className="">
                                                <Select
                                                  className="selectTo"
                                                  styles={ledger_select}
                                                  // disabled={isInputDisabled}
                                                  options={licencesType}
                                                  onChange={(v) => {
                                                    setFieldValue(
                                                      "licences_type",
                                                      v
                                                    );
                                                  }}
                                                  name="licences_type"
                                                  value={values.licences_type}
                                                  invalid={
                                                    errors.licences_type
                                                      ? true
                                                      : false
                                                  }
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Number</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder=" Number"
                                                  name="licenses_num"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={values.licenses_num}
                                                  isValid={
                                                    touched.licenses_num &&
                                                    !errors.licenses_num
                                                  }
                                                  isInvalid={
                                                    !!errors.licenses_num
                                                  }
                                                />
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg={4}>
                                          <Row>
                                            <Col lg={4} className="my-auto">
                                              <Form.Label>
                                                Expity Date
                                              </Form.Label>
                                            </Col>
                                            <Col lg={6}>
                                              <MyTextDatePicker
                                                id="licenses_exp"
                                                name="licenses_exp"
                                                placeholder="DD/MM/YYYY"
                                                className="form-control"
                                                // disabled={isInputDisabled}
                                                value={values.licenses_exp}
                                                onChange={handleChange}
                                                onBlur={(e) => {
                                                  console.log("e ", e);
                                                  console.log(
                                                    "e.target.value ",
                                                    e.target.value
                                                  );
                                                  if (
                                                    e.target.value != null &&
                                                    e.target.value != ""
                                                  ) {
                                                    setFieldValue(
                                                      "licenses_exp",
                                                      e.target.value
                                                    );
                                                    this.checkExpiryDate(
                                                      setFieldValue,
                                                      e.target.value,
                                                      "licenses_exp"
                                                    );
                                                  } else {
                                                    setFieldValue(
                                                      "licenses_exp",
                                                      ""
                                                    );
                                                  }
                                                }}
                                              />
                                            </Col>

                                            <Col lg={2} className="text-end">
                                              <Button
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  if (
                                                    values.licences_type !=
                                                      "" &&
                                                    values.licences_type != null
                                                  ) {
                                                    let licensesObj = {
                                                      id:
                                                        values.did != null
                                                          ? values.did
                                                          : "",
                                                      licences_type:
                                                        values.licences_type !=
                                                        null
                                                          ? values.licences_type
                                                          : "",
                                                      licenses_num:
                                                        values.licenses_num !=
                                                        null
                                                          ? values.licenses_num
                                                          : "",
                                                      licenses_exp:
                                                        values.licenses_exp !=
                                                        null
                                                          ? values.licenses_exp
                                                          : "",
                                                      index:
                                                        values.index !==
                                                        undefined
                                                          ? values.index
                                                          : licensesList.length,
                                                    };
                                                    this.addLicensesRow(
                                                      licensesObj,
                                                      setFieldValue
                                                    );
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Please Enter Licenses Details ",
                                                      is_button_show: false,
                                                    });
                                                  }
                                                }}
                                              >
                                                <FontAwesomeIcon
                                                  icon={faPlus}
                                                  className="plus-color"
                                                />
                                              </Button>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </Row>
                                </div>
                                {licensesList.length > 0 && (
                                  <div className="bottom_card_table">
                                    <Table hover>
                                      <tbody>
                                        {licensesList.map((v, i) => {
                                          return (
                                            <tr
                                              onDoubleClick={(e) => {
                                                e.preventDefault();
                                                console.log("sneha", i, "v", v);
                                                let licensesObj = {
                                                  id: v.id,
                                                  licences_type:
                                                    v.licences_type,
                                                  licenses_num: v.licenses_num,
                                                  licenses_exp: v.licenses_exp,
                                                  index: v.index,
                                                };
                                                this.handleFetchLicensesData(
                                                  licensesObj,
                                                  setFieldValue
                                                );
                                              }}
                                            >
                                              <td>{v.licences_type.label}</td>
                                              <td>{v.licenses_num}</td>
                                              <td>{v.licenses_exp}</td>
                                              <td className="text-center">
                                                <img
                                                  src={Delete}
                                                  alt=""
                                                  className="table_delete_icon"
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    this.removeLicensesRow(i);
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </Table>
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col lg={6}>
                            <Card className="bottom_card_style">
                              <Card.Header className="d-flex">
                                <h3 className="my-auto">Shipping Details</h3>
                                <Form.Check
                                  type="switch"
                                  className="ms-1"
                                  onClick={this.handleSwitchClick}
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // this.gstFieldshow(e.target.checked);
                                    setFieldValue(
                                      "isShippingDetails",
                                      e.target.checked
                                    );
                                  }}
                                  name="isShippingDetails"
                                  id="isShippingDetails"
                                  value={
                                    values.isShippingDetails == true
                                      ? "Yes"
                                      : "No"
                                  }
                                />
                              </Card.Header>
                              <Card.Body>
                                <div className="card_sub_header">
                                  <Row>
                                    {values.isShippingDetails == true ? (
                                      <>
                                        <Col lg={8}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Address</Form.Label>
                                            </Col>
                                            <Col lg={10}>
                                              <Form.Group className="">
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  className="text-box"
                                                  name="shipping_address"
                                                  onChange={handleChange}
                                                  value={
                                                    values.shipping_address
                                                  }
                                                  isValid={
                                                    touched.shipping_address &&
                                                    !errors.shipping_address
                                                  }
                                                  isInvalid={
                                                    !!errors.shipping_address
                                                  }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.shipping_address}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg={4}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>State</Form.Label>
                                            </Col>
                                            <Col lg={8}>
                                              <Form.Group>
                                                <Select
                                                  className="selectTo"
                                                  styles={ledger_select}
                                                  // disabled={isInputDisabled}
                                                  onChange={(v) => {
                                                    setFieldValue(
                                                      "district",
                                                      v
                                                    );
                                                  }}
                                                  name="district"
                                                  options={stateOpt}
                                                  value={values.district}
                                                  invalid={
                                                    errors.district
                                                      ? true
                                                      : false
                                                  }
                                                />
                                                <span className="text-danger">
                                                  {errors.district}
                                                </span>
                                              </Form.Group>
                                            </Col>

                                            <Col lg={2} className="text-end">
                                              <Button
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  console.log(
                                                    "values.index",
                                                    values.index
                                                  );
                                                  if (
                                                    values.district != "" &&
                                                    values.district != null &&
                                                    values.shipping_address !=
                                                      "" &&
                                                    values.shipping_address !=
                                                      null
                                                  ) {
                                                    let shipObj = {
                                                      id:
                                                        values.sid != null
                                                          ? values.sid
                                                          : "",
                                                      district:
                                                        values.district != null
                                                          ? values.district
                                                          : "",
                                                      shipping_address:
                                                        values.shipping_address !=
                                                        null
                                                          ? values.shipping_address
                                                          : "",
                                                      index: values.index
                                                        ? values.index
                                                        : -1,
                                                    };
                                                    console.log(
                                                      "addShip shipObj <<<<<<<<<<<<< ",
                                                      shipObj
                                                    );
                                                    this.addShippingRow(
                                                      shipObj,
                                                      setFieldValue
                                                    );
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Please Enter Shipping Details ",
                                                      is_button_show: false,
                                                    });
                                                  }
                                                }}
                                              >
                                                <FontAwesomeIcon
                                                  icon={faPlus}
                                                  className="plus-color"
                                                />
                                              </Button>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </Row>
                                </div>
                                {shippingList.length > 0 && (
                                  <div className="bottom_card_table">
                                    <Table hover>
                                      <tbody>
                                        {shippingList.map((v, i) => {
                                          return (
                                            <tr
                                              onDoubleClick={(e) => {
                                                e.preventDefault();
                                                console.log("sid", i, "v", v);

                                                let shipObj = {
                                                  district: v.district,
                                                  id: v.id,
                                                  shipping_address:
                                                    v.shipping_address,
                                                  // index: v.index,
                                                };
                                                this.handleFetchShippingData(
                                                  shipObj,
                                                  setFieldValue
                                                );
                                              }}
                                            >
                                              <td>{v.shipping_address}</td>
                                              <td>{v.district.label}</td>

                                              <td className="text-end">
                                                <img
                                                  src={Delete}
                                                  alt=""
                                                  className="table_delete_icon"
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    this.removeShippingRow(i);
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </Table>
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={6}>
                            <Card className="bottom_card_style">
                              <Card.Header className="d-flex">
                                <h3 className="my-auto">Department</h3>
                                <Form.Check
                                  type="switch"
                                  className="ms-1"
                                  onClick={this.handleSwitchClick}
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // this.gstFieldshow(e.target.checked);
                                    setFieldValue(
                                      "isDepartment",
                                      e.target.checked
                                    );
                                  }}
                                  name="isDepartment"
                                  id="isDepartment"
                                  value={
                                    values.isDepartment == true ? "Yes" : "No"
                                  }
                                />
                              </Card.Header>
                              <Card.Body>
                                <div className="card_sub_header">
                                  <Row>
                                    {values.isDepartment == true ? (
                                      <>
                                        <Col lg={6}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Name</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group className="">
                                                <Form.Control
                                                  className="text-box"
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder="Department"
                                                  name="dept"
                                                  onChange={handleChange}
                                                  value={values.dept}
                                                  isValid={
                                                    touched.dept && !errors.dept
                                                  }
                                                  isInvalid={!!errors.dept}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.dept}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Number</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  placeholder="Contact Person"
                                                  name="contact_person"
                                                  className="text-box"
                                                  // disabled={isInputDisabled}
                                                  onChange={handleChange}
                                                  value={values.contact_person}
                                                  isValid={
                                                    touched.contact_person &&
                                                    !errors.contact_person
                                                  }
                                                  isInvalid={
                                                    !!errors.contact_person
                                                  }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.contact_person}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg={6}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Email</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=" Email"
                                                  name="email"
                                                  className="text-box"
                                                  // disabled={isInputDisabled}
                                                  onChange={handleChange}
                                                  value={values.email}
                                                  isValid={
                                                    touched.email &&
                                                    !errors.email
                                                  }
                                                  isInvalid={!!errors.email}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.email}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1}>
                                              <img
                                                src={phone}
                                                alt=""
                                                className="ledger_small_icons"
                                              />
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=" Enter"
                                                  name="contact_no"
                                                  className="text-box"
                                                  // disabled={isInputDisabled}
                                                  onChange={handleChange}
                                                  value={values.contact_no}
                                                  onKeyPress={(e) => {
                                                    OnlyEnterNumbers(e);
                                                  }}
                                                  isValid={
                                                    touched.contact_no &&
                                                    !errors.contact_no
                                                  }
                                                  isInvalid={
                                                    !!errors.contact_no
                                                  }
                                                  maxLength={10}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.contact_no}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>

                                            <Col lg={1} className="text-end">
                                              <Button
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();

                                                  if (
                                                    values.dept != "" &&
                                                    values.dept != null &&
                                                    values.contact_person !=
                                                      "" &&
                                                    values.contact_person !=
                                                      null
                                                  ) {
                                                    let deptObj = {
                                                      id:
                                                        values.did != null
                                                          ? values.did
                                                          : "",
                                                      dept:
                                                        values.dept != null
                                                          ? values.dept
                                                          : "",
                                                      contact_no:
                                                        values.contact_no !=
                                                        null
                                                          ? values.contact_no
                                                          : "",
                                                      contact_person:
                                                        values.contact_person !=
                                                        null
                                                          ? values.contact_person
                                                          : "",
                                                      email:
                                                        values.email != null
                                                          ? values.email
                                                          : "",
                                                      index:
                                                        values.index != null
                                                          ? values.index
                                                          : -1,
                                                    };
                                                    this.addDeptRow(
                                                      deptObj,
                                                      setFieldValue
                                                    );
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Please Enter Department Details ",
                                                      is_button_show: false,
                                                    });
                                                  }
                                                }}
                                              >
                                                <FontAwesomeIcon
                                                  icon={faPlus}
                                                  className="plus-color"
                                                />
                                              </Button>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </Row>
                                </div>
                                {deptList.length > 0 && (
                                  <div className="bottom_card_table">
                                    <Table hover>
                                      <tbody>
                                        {deptList.map((v, i) => {
                                          return (
                                            <tr
                                              onDoubleClick={(e) => {
                                                e.preventDefault();
                                                console.log("sid", i, "v", v);

                                                let deptObj = {
                                                  dept: v.dept,

                                                  contact_no: v.contact_no,

                                                  contact_person:
                                                    v.contact_person,
                                                  email: v.email,
                                                  // index: v.index,
                                                };
                                                this.handleFetchDepartmentData(
                                                  deptObj,
                                                  setFieldValue
                                                );
                                              }}
                                            >
                                              <td>{v.dept}</td>
                                              <td>{v.contact_person}</td>
                                              <td>{v.email}</td>
                                              <td>{v.contact_no}</td>
                                              <td className="text-center">
                                                <img
                                                  src={Delete}
                                                  alt=""
                                                  className="table_delete_icon"
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    this.removeDeptRow(i);
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </Table>
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>

                        <Row className="btm-button-row">
                          <Col md="12" className="text-end">
                            <Button className="submit-btn me-2" type="submit">
                              Update
                            </Button>
                            <Button
                              variant="secondary"
                              className="cancel-btn me-3"
                              onClick={(e) => {
                                e.preventDefault();
                                MyNotifications.fire(
                                  {
                                    show: true,
                                    icon: "confirm",
                                    title: "Confirm",
                                    msg: "Do you want to cancel",
                                    is_button_show: false,
                                    is_timeout: false,
                                    delay: 0,
                                    handleSuccessFn: () => {
                                      if (this.state.source != "") {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: this.state.source.from_page,
                                          prop_data: {
                                            rows: this.state.source.rows,
                                            invoice_data:
                                              this.state.source.invoice_data,
                                            ...this.state.source,
                                          },
                                          isNewTab: false,
                                        });
                                        this.setState({ source: "" });
                                      } else {
                                        eventBus.dispatch(
                                          "page_change",
                                          "ledgerlist"
                                        );
                                      }
                                    },
                                    handleFailFn: () => {},
                                  },
                                  () => {
                                    console.warn("return_data");
                                  }
                                );
                              }}
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                      </div>
                      {/* sundry debetor form end  */}
                    </>
                  )}
                {/* Bank account start  **/}
                {values.underId &&
                  values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    "bank_account" && (
                    <div className=" form-style">
                      <div className="middle_card_main">
                        <Card className="middle_card">
                          <Card.Body>
                            <Row>
                              <Col>
                                <h5 className="Mail-title ms-2">
                                  Taxation Details
                                </h5>
                              </Col>
                            </Row>
                            <Row className="mt-3">
                              {/* <Col md={10}> */}

                              <Row className="m-0">
                                <Col md={1}>
                                  <Form.Label>
                                    Taxation Available{" "}
                                    {/* <span className="pt-1 pl-1 req_validation">
                                        *
                                      </span> */}
                                  </Form.Label>{" "}
                                </Col>
                                <Col md={2}>
                                  <Form.Group>
                                    <Select
                                      // styles={customStyles}
                                      styles={ledger_select}
                                      className="selectTo"
                                      onChange={(e) => {
                                        setFieldValue("isTaxation", e);
                                      }}
                                      options={ledger_type_options}
                                      name="isTaxation"
                                      value={values.isTaxation}
                                    />
                                  </Form.Group>
                                </Col>
                                {values.isTaxation &&
                                  values.isTaxation.value == true && (
                                    <>
                                      <Col lg={3}>
                                        <Row>
                                          <Col lg={2}>
                                            <Form.Label>GSTIN</Form.Label>
                                          </Col>
                                          <Col lg={10}>
                                            <Form.Group>
                                              <Form.Control
                                                type="text"
                                                placeholder="GSTIN"
                                                name="gstin"
                                                maxLength={15}
                                                className="text-box"
                                                id="gstin"
                                                onChange={handleChange}
                                                value={
                                                  values.gstin &&
                                                  values.gstin.toUpperCase()
                                                }
                                                isValid={
                                                  touched.gstin && !errors.gstin
                                                }
                                                isInvalid={!!errors.gstin}
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                {errors.gstin}
                                              </Form.Control.Feedback>
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                      </Col>
                                    </>
                                  )}
                              </Row>
                              {/* </Col> */}
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>

                      {/* <hr /> */}

                      <div className="middle_card_main">
                        <Card className="middle_card">
                          <Card.Body>
                            <Row className="mt-2 mx-0">
                              <Row>
                                <Col>
                                  <h5 className="Mail-title">Bank Details</h5>
                                </Col>
                              </Row>
                              {/* <Col md={10}> */}
                              <Row className="mb-2">
                                <Col md={1}>
                                  <Form.Label>Bank Name </Form.Label>
                                </Col>
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Control
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
                                    <Form.Control.Feedback type="invalid">
                                      {errors.bank_name}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md={1}>
                                  <Form.Label>Account Number </Form.Label>
                                </Col>
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Control
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
                                    <Form.Control.Feedback type="invalid">
                                      {errors.bank_account_no}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md={1}>
                                  <Form.Label>IFSC Code </Form.Label>
                                </Col>
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Control
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
                                    <Form.Control.Feedback type="invalid">
                                      {errors.bank_ifsc_code}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                {/* </Row>
                              <Row> */}
                                <Col md={1}>
                                  <Form.Label>Branch </Form.Label>
                                </Col>
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Control
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
                                    <Form.Control.Feedback type="invalid">
                                      {errors.bank_branch}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md={8} className="text-end">
                                  <Form.Control
                                    type="text"
                                    placeholder="index"
                                    name="index"
                                    className="text-box"
                                    onChange={handleChange}
                                    hidden
                                    value={values.index}
                                  />
                                  {/* <Button
                                      className="create-btn successbtn-style"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        if (
                                          values.bank_name != "" &&
                                          values.bank_name != null &&
                                          values.bank_account_no != "" &&
                                          values.bank_account_no != null &&
                                          values.bank_ifsc_code != "" &&
                                          values.bank_ifsc_code != null &&
                                          values.bank_branch != "" &&
                                          values.bank_branch != null
                                        ) {
                                          let bankObj = {
                                            bank_name:
                                              values.bank_name != null
                                                ? values.bank_name
                                                : "",
                                            bank_account_no:
                                              values.bank_account_no != null
                                                ? values.bank_account_no
                                                : "",
                                            bank_ifsc_code:
                                              values.bank_ifsc_code != null
                                                ? values.bank_ifsc_code
                                                : "",
                                            bank_branch:
                                              values.bank_branch != null
                                                ? values.bank_branch
                                                : "",
                                            id: values.bid != null ? values.bid : "",
                                            index: !isNaN(parseInt(values.index))
                                              ? values.index
                                              : -1,
                                          };
                                          this.addBankRow(bankObj, setFieldValue);
                                        } else {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Please Enter Bank Details ",
                                            is_button_show: false,
                                          });
                                        }
                                      }}
                                    >
                                      ADD ROW
                                    </Button> */}
                                  {/* <Button
                                      className="create-btn me-0 successbtn-style"
                                      onClick={(e) => {
                                        console.log("handle Fetch GST called");
                                        e.preventDefault();
                                        this.clearBankData(setFieldValue);
                                      }}
                                    >
                                      CLEAR
                                    </Button> */}
                                </Col>
                              </Row>
                              {/* {bankList.length > 0 && (
                                  <Row className="mt-2">
                                    <Col md={12}>
                                      <div className="">
                                        <Table
                                          hover
                                          size="sm"
                                          style={{ fontSize: "13px" }}
                                          //responsive
                                        >
                                          <thead>
                                            <tr>
                                              <th>Sr.</th>
                                              <th>Bank Name</th>
                                              <th>Account Number</th>
                                              <th>IFSC Code</th>
                                              <th>Branch</th>
                                              <th className="text-center">-</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {bankList.map((v, i) => {
                                              return (
                                                <tr
                                                  onDoubleClick={(e) => {
                                                    e.preventDefault();
                                                    console.log("sneha", v);
                                                    let bankObj = {
                                                      id: v.id,
                                                      bank_name:
                                                        v.bank_name != null
                                                          ? v.bank_name
                                                          : "",
                                                      bank_account_no:
                                                        v.bank_account_no != null
                                                          ? v.bank_account_no
                                                          : "",
                                                      bank_ifsc_code:
                                                        v.bank_ifsc_code != null
                                                          ? v.bank_ifsc_code
                                                          : "",
                                                      bank_branch:
                                                        v.bank_branch != null
                                                          ? v.bank_branch
                                                          : "",
                                                    };
                                                    this.handleFetchBankData(
                                                      bankObj,
                                                      setFieldValue,
                                                      i
                                                    );
                                                  }}
                                                >
                                                  <td>{i + 1}</td>
                                                  <td>{v.bank_name}</td>
                                                  <td>{v.bank_account_no}</td>
                                                  <td>{v.bank_ifsc_code}</td>
                                                  <td>{v.bank_branch}</td>
                                                  <td className="text-center">
                                                    <Button
                                                      style={{
                                                        marginTop: "-12px",
                                                      }}
                                                      className="mainbtnminus"
                                                      variant=""
                                                      type="button"
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        this.removeBankRow(i);
                                                      }}
                                                    >
                                                      <FontAwesomeIcon
                                                        icon={faTrash}
                                                      />
                                                    </Button>
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </Table>
                                      </div>
                                    </Col>
                                  </Row>
                                )} */}
                              {/* </Col> */}
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>

                      {/* <hr /> */}
                      <Row className="btm-button-row">
                        <Col md="12" className="text-end">
                          <Button className="submit-btn me-2" type="submit">
                            Update
                          </Button>
                          <Button
                            variant="secondary"
                            className="cancel-btn me-3"
                            onClick={(e) => {
                              e.preventDefault();
                              MyNotifications.fire(
                                {
                                  show: true,
                                  icon: "confirm",
                                  title: "Confirm",
                                  msg: "Do you want to cancel",
                                  is_button_show: false,
                                  is_timeout: false,
                                  delay: 0,
                                  handleSuccessFn: () => {
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "ledgerlist"
                                    // );

                                    if (this.state.source != "") {
                                      eventBus.dispatch("page_change", {
                                        from: "ledgeredit",
                                        to: this.state.source.from_page,
                                        prop_data: {
                                          rows: this.state.source.rows,
                                          invoice_data:
                                            this.state.source.invoice_data,
                                          ...this.state.source,
                                        },
                                        isNewTab: false,
                                      });
                                      this.setState({ source: "" });
                                    } else {
                                      eventBus.dispatch(
                                        "page_change",
                                        "ledgerlist"
                                      );
                                    }
                                  },
                                  handleFailFn: () => {},
                                },
                                () => {
                                  console.warn("return_data");
                                }
                              );
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
                            <Col md={1}>
                              <Form.Label>
                                Tax Type{" "}
                                {/* <span className="pt-1 pl-1 req_validation">
                                *
                              </span> */}
                              </Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group className="">
                                <Select
                                  autoFocus="true"
                                  className="selectTo"
                                  onChange={(v) => {
                                    setFieldValue("tax_type", v);
                                  }}
                                  name="tax_type"
                                  // styles={customStyles}
                                  styles={ledger_select}
                                  options={taxOpt}
                                  value={values.tax_type}
                                  invalid={errors.tax_type ? true : false}
                                  //styles={customStyles}
                                />
                                <span className="text-danger">
                                  {errors.tax_type}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      <Row className="btm-button-row">
                        <Col md="12" className="text-end">
                          <Button className="submit-btn me-2" type="submit">
                            Update
                          </Button>
                          <Button
                            variant="secondary"
                            className="cancel-btn me-3"
                            onClick={(e) => {
                              e.preventDefault();
                              MyNotifications.fire(
                                {
                                  show: true,
                                  icon: "confirm",
                                  title: "Confirm",
                                  msg: "Do you want to cancel",
                                  is_button_show: false,
                                  is_timeout: false,
                                  delay: 0,
                                  handleSuccessFn: () => {
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "ledgerlist"
                                    // );

                                    if (this.state.source != "") {
                                      eventBus.dispatch("page_change", {
                                        from: "ledgeredit",
                                        to: this.state.source.from_page,
                                        prop_data: {
                                          rows: this.state.source.rows,
                                          invoice_data:
                                            this.state.source.invoice_data,
                                          ...this.state.source,
                                        },
                                        isNewTab: false,
                                      });
                                      this.setState({ source: "" });
                                    } else {
                                      eventBus.dispatch(
                                        "page_change",
                                        "ledgerlist"
                                      );
                                    }
                                  },
                                  handleFailFn: () => {},
                                },
                                () => {
                                  console.warn("return_data");
                                }
                              );
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
                    "others" && (
                    <div className="duties">
                      <Row className="btm-button-row">
                        <Col md="12" className="text-end">
                          <Button className="submit-btn me-2" type="submit">
                            Update
                          </Button>
                          <Button
                            variant="secondary"
                            className="cancel-btn me-3"
                            onClick={(e) => {
                              e.preventDefault();
                              MyNotifications.fire(
                                {
                                  show: true,
                                  icon: "confirm",
                                  title: "Confirm",
                                  msg: "Do you want to cancel",
                                  is_button_show: false,
                                  is_timeout: false,
                                  delay: 0,
                                  handleSuccessFn: () => {
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "ledgerlist"
                                    // );

                                    if (this.state.source != "") {
                                      eventBus.dispatch("page_change", {
                                        from: "ledgeredit",
                                        to: this.state.source.from_page,
                                        prop_data: {
                                          rows: this.state.source.rows,
                                          invoice_data:
                                            this.state.source.invoice_data,
                                          ...this.state.source,
                                        },
                                        isNewTab: false,
                                      });
                                      this.setState({ source: "" });
                                    } else {
                                      eventBus.dispatch(
                                        "page_change",
                                        "ledgerlist"
                                      );
                                    }
                                  },
                                  handleFailFn: () => {},
                                },
                                () => {
                                  console.warn("return_data");
                                }
                              );
                            }}
                          >
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  )}
                {/* Other end */}
                {/* Assets start  **/}
                {values.underId &&
                  values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    "assets" && (
                    <>
                      <Row className="btm-button-row">
                        <Col md="12" className="text-end">
                          <Button className="submit-btn me-2" type="submit">
                            Update
                          </Button>
                          <Button
                            variant="secondary"
                            className="cancel-btn me-3"
                            onClick={(e) => {
                              e.preventDefault();
                              MyNotifications.fire(
                                {
                                  show: true,
                                  icon: "confirm",
                                  title: "Confirm",
                                  msg: "Do you want to cancel",
                                  is_button_show: false,
                                  is_timeout: false,
                                  delay: 0,
                                  handleSuccessFn: () => {
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "ledgerlist"
                                    // );

                                    if (this.state.source != "") {
                                      eventBus.dispatch("page_change", {
                                        from: "ledgeredit",
                                        to: this.state.source.from_page,
                                        prop_data: {
                                          rows: this.state.source.rows,
                                          invoice_data:
                                            this.state.source.invoice_data,
                                          ...this.state.source,
                                        },
                                        isNewTab: false,
                                      });
                                      this.setState({ source: "" });
                                    } else {
                                      eventBus.dispatch(
                                        "page_change",
                                        "ledgerlist"
                                      );
                                    }
                                  },
                                  handleFailFn: () => {},
                                },
                                () => {
                                  console.warn("return_data");
                                }
                              );
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
      </div>
    );
  }
}
const mapStateToProps = ({ userPermissions, userControl }) => {
  return { userPermissions, userControl };
};

const mapActionsToProps = (dispatch) => {
  return bindActionCreators(
    {
      setUserPermissions,
      setUserControl,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapActionsToProps)(LedgerEdit);
