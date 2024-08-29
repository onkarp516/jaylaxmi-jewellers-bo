import React, { Component, useRef } from "react";

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
} from "@/helpers";
import { getValue } from "../../helpers/constants";
import Select from "react-select";
import {
  getUnderList,
  getValidateLedgermMaster,
  getIndianState,
  getIndiaCountry,
  // getGSTTypes,
  getBalancingMethods,
  getAreaMasterOutlet,
  getSalesmanMasterOutlet,
  createLedger,
} from "@/services/api_function";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import LayoutCustom from "@/pages/layout/LayoutCustom";
import { FormControl, Nav, Tab, Tabs } from "react-bootstrap";

// const crdrDrop = [
//   { label: "DR", value: 'dr' },
//   { label: "CR", value: 'cr' },
// ];
const ledger_type_options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
  // more options...
];
const dr_options = [
  { label: "Dr", value: "dr" },
  { label: "Cr", value: "cr" },
  // more options...
];
const applicable_from_options = [
  { label: "Credit Bill Date", value: "creditBill" },
  { label: "Lr Bill Date", value: "lrBill" },
];

const sales_rate_options = [
  { label: "Sales Rate A", value: 1 },
  { label: "Sales Rate B", value: 2 },
  { label: "Sales Rate C", value: 3 },
];
const ledger_options = [
  { label: "Public", value: false },
  { label: "Private", value: true },
];

const taxOpt = [
  { value: "central_tax", label: "Central Tax" },
  { value: "state_tax", label: "State Tax" },
  { value: "integrated_tax", label: "Integrated Tax" },
];

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

export default class LedgerCreate extends React.Component {
  constructor(props) {
    super(props);

    const curDate = new Date();
    this.myRef = React.createRef();
    this.state = {
      show: false,
      principleList: [],
      undervalue: [],
      balancingOpt: [],
      stateOpt: [],
      countryOpt: [],
      GSTTypeOpt: [],
      gstList: [],
      dt: moment(curDate).format("DD/MM/YYYY"),
      bankList: [],
      deptList: [],
      shippingList: [],
      billingList: [],
      cityOpt: [],
      appConfig: [],
      initValue: {
        associates_id: "",
        associates_group_name: "",
        underId: "",
        opening_balance: 0,
        is_private: "",
        salesmanId: "",
        areaId: "",
      },
      source: "",
      areaId: "",
      areaLst: [],
      salesmanLst: [],
    };
  }

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

  lstUnders = () => {
    // alert("tesr")
    getUnderList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          const filteredData = d.filter(
            item =>
              item.unique_code !== "SLAC"&&
              item.associates_name !== "Payable"&&
              item.unique_code !== "BAOD"&&
              item.ledger_form_parameter_slug !== "sundry_creditors"&&
              item.ledger_form_parameter_slug !== "sundry_debtors"
          );
          
         
          let Opt = filteredData.map((v, i) => {
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
        this.setState({ undervalue: [] });
      });
  };
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
  lstBalancingMethods = () => {
    getBalancingMethods()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.response.map((v, i) => {
            return { value: v.balancing_id, label: v.balance_method };
          });

          const { initValue } = this.state;
          console.log("initValue", { initValue });
          let initObj = initValue;
          initObj["opening_balancing_method"] = opt[0];
          console.log("opening_balancing_method", { initObj });
          this.setState({ initValue: initObj, balancingOpt: opt });
        }
      })
      .catch((error) => {});
  };
  lstState = () => {
    getIndianState()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let opt = d.map((v) => {
            return { label: v.stateName, value: v.id };
          });
          this.setState({ stateOpt: opt });
        }
      })
      .catch((error) => {});
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
  lstCountry = () => {
    getIndiaCountry()
      .then((response) => {
        let { initValue } = this.state;
        let opt = [];
        let res = { label: response.data.name, value: response.data.id };
        opt.push(res);
        this.setState({ countryOpt: opt }, () => {
          initValue["countryId"] = opt[0];
          this.setState({ initValue: initValue });
        });
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

  componentDidMount() {
    // this.getUnderList();
    this.lstUnders();
    // this.listGSTTypes();
    // listGSTTypes not implemented in renuka API's
    this.lstBalancingMethods();
    this.lstState();
    this.lstCountry();
    // this.lstAreaMaster();
    // this.lstSalesmanMaster();
    this.setInitValue();
  }

  setLedgerCode = () => {
    let supplier_code = getRandomIntInclusive(1, 1000);
    this.myRef.current.setFieldValue("supplier_code", supplier_code);
  };
  handleFetchGstData = (values, setFieldValue) => {
    console.log("in handleFetch Gst data");
    let gstObj = {
      id: values.id != 0 ? values.id : 0,

      gstin: values.gstin != "" ? values.gstin : "",
      dateofregistartion:
        values.dateofregistartion != "" ? values.dateofregistartion : "",
      pan_no: values.pan_no != "" ? values.pan_no : 0,
      index: values.index,
    };

    if (gstObj.gstin != "") {
      setFieldValue("gstin", gstObj.gstin);
    }

    if (gstObj.dateofregistartion != "") {
      setFieldValue("dateofregistartion", gstObj.dateofregistartion);
    }
    if (gstObj.pan_no != "") {
      setFieldValue("pan_no", gstObj.pan_no);
    }

    setFieldValue(
      "gst_detail_id",
      values.details_id != 0 ? values.details_id : 0
    );
    setFieldValue("index", gstObj.index);
  };

  handleFetchShippingData = (values, setFieldValue) => {
    console.log("in shiping", values);
    // if (isclear == 0) {
    let shipObj = {
      // id: values.id != 0 ? values.id : 0,
      // details_id: values.details_id != 0 ? values.details_id : 0,
      district: values.district != "" ? values.district : "",
      shipping_address:
        values.shipping_address != "" ? values.shipping_address : "",
      index: values.index,
    };
    console.log({ shipObj });
    setFieldValue("district", shipObj.district);
    // if (shipObj.id != "") {
    //   setFieldValue("sid", shipObj.id);
    // }
    setFieldValue("shipping_address", shipObj.shipping_address);
    setFieldValue("index", shipObj.index);

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
  handleFetchBillingData = (values, setFieldValue) => {
    console.log("in shiping", values);
    let billAddObj = {
      b_district: values.b_district != "" ? values.b_district : "",
      billing_address:
        values.billing_address != "" ? values.billing_address : "",
      index: values.index,
    };
    console.log({ billAddObj });
    setFieldValue("b_district", billAddObj.b_district);

    setFieldValue("billing_address", billAddObj.billing_address);
    setFieldValue("index", billAddObj.index);
  };

  handleFetchDepartmentData = (values, setFieldValue) => {
    console.log("in handleFetch department data", values);
    // let { deptList } = this.state;
    let deptObj = {
      dept: values.dept,

      contact_no: values.contact_no,

      contact_person: values.contact_person,
      email: values.email,
      index: values.index,
    };

    if (deptObj.dept != "") {
      setFieldValue("dept", deptObj.dept);
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
    setFieldValue("index", deptObj.index);
    setFieldValue(
      "dept_detail_id",
      values.details_id != 0 ? values.details_id : 0
    );

    // deptList = deptList.filter((v, i) => i != index);

    // this.setState({ deptList: deptList });
  };
  handleFetchBankData = (values, setFieldValue) => {
    console.log("in handleFetch Bank data", values);
    let bankObj = {
      id: values.id,
      bank_name: values.bank_name != null ? values.bank_name : "",
      bank_account_no:
        values.bank_account_no != null ? values.bank_account_no : "",
      bank_ifsc_code:
        values.bank_ifsc_code != null ? values.bank_ifsc_code : "",
      bank_branch: values.bank_branch != null ? values.bank_branch : "",
      index: values.index,
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
    setFieldValue("index", bankObj.index);

    setFieldValue(
      "bank_detail_id",
      values.details_id != 0 ? values.details_id : 0
    );
  };

  addGSTRow = (values, setFieldValue) => {
    let gstObj = {
      id: values.id,
      gstin: values.gstin,
      dateofregistartion: values.dateofregistartion,
      pan_no: values.pan_no,
      // registraion_type: values.registraion_type.value,
      index: values.index,
    };
    console.log("gstObj", gstObj);
    const { gstList } = this.state;
    if (GSTINREX.test(gstObj.gstin)) {
      if (pan.test(gstObj.pan_no)) {
        let old_lst = gstList;
        let is_updated = false;
        let obj = old_lst.filter((value) => {
          return (
            value.gstin === gstObj.gstin &&
            value.dateofregistartion === gstObj.dateofregistartion
            // value.pan_no === gstObj.pan_no
            // value.registraion_type.value === gstObj.registraion_type.value
          );
        });
        console.log("obj", obj);
        let final_state = [];
        if (obj.length == 0) {
          final_state = old_lst.map((item) => {
            // if (item.gstin === gstObj.gstin) {
            if (item.index === gstObj.index) {
              is_updated = true;
              const updatedItem = gstObj;
              return updatedItem;
            }
            return item;
          });
          if (is_updated == false) {
            final_state = [...gstList, gstObj];
          }
          console.log({ final_state });

          this.setState({ gstList: final_state }, () => {
            setFieldValue("gstin", "");
            setFieldValue("dateofregistartion", "");
            setFieldValue("pan_no", "");
            setFieldValue("index", undefined);
          });
        } else {
          console.log("already exists in row");
          toast.warning("Gst Details are Already Exist !");
        }
      } else {
        toast.error("PAN NO is Not Valid ");
      }
    } else {
      toast.error("GSTIN is not Valid!");
    }
  };
  // handle click event of the Remove button
  removeGstRow = (index) => {
    const { gstList } = this.state;
    const list = [...gstList];
    list.splice(index, 1);
    this.setState({ gstList: list });
  };

  // handle click event of the Remove button
  addShippingRow = (values, setFieldValue) => {
    console.log(values);
    let shipObj = {
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
      final_state = old_lst.map((item, i) => {
        if (item.index == shipObj.index) {
          is_updated = true;
          const newObj = shipObj;
          return newObj;
        }
        return item;
      });

      if (is_updated == false) {
        final_state = [...shippingList, shipObj];
      }
      console.log({ final_state });
      this.setState({ shippingList: final_state }, () => {
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

  removeShippingRow = (index) => {
    console.log("index-->", index);
    const { shippingList } = this.state;
    const list = [...shippingList];
    list.splice(index, 1);
    this.setState({ shippingList: list });
  };

  addBillingRow = (values, setFieldValue) => {
    console.log(values);
    let billAddObj = {
      b_district: values.b_district,
      billing_address: values.billing_address,
      index: values.index,
    };

    console.log("Billing Row---.", billAddObj);
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
      final_state = old_lst.map((item, i) => {
        if (item.index == billAddObj.index) {
          is_updated = true;
          const newObj = billAddObj;
          return newObj;
        }
        return item;
      });

      if (is_updated == false) {
        final_state = [...billingList, billAddObj];
      }
      console.log({ final_state });
      this.setState({ billingList: final_state }, () => {
        setFieldValue("sid", "");
        setFieldValue("b_district", "");
        setFieldValue("billing_address", "");
        setFieldValue("index", undefined);
      });
    } else {
      console.log("already exists in row");
      toast.warning("Billing Details are Already Exist !");
    }
  };

  // handle click event of the Remove button
  removeBillingRow = (index) => {
    const { billingList } = this.state;
    const list = [...billingList];
    list.splice(index, 1);
    this.setState({ billingList: list });
  };

  addDeptRow = (values, setFieldValue) => {
    let deptObj = {
      dept: values.dept,
      contact_person: values.contact_person,
      contact_no: values.contact_no,
      email: values.email,
      index: values.index,
    };

    console.log("DeptObj", { deptObj });
    const { deptList } = this.state;

    // if (EMAILREGEXP.test(deptObj.email)) {
    //   if (MobileRegx.test(deptObj.contact_no)) {
    let old_lst = deptList;
    let is_updated = false;

    let obj = old_lst.filter((value) => {
      return (
        value.dept === deptObj.dept &&
        value.contact_person === deptObj.contact_person &&
        value.email === deptObj.email &&
        value.contact_no === deptObj.contact_no
      );
    });
    let final_state = [];
    if (obj.length == 0) {
      final_state = old_lst.map((item) => {
        if (item.index == deptObj.index) {
          is_updated = true;
          const updatedItem = deptObj;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...deptList, deptObj];
      }
      console.log({ final_state });
      this.setState({ deptList: final_state }, () => {
        setFieldValue("dept", "");
        setFieldValue("contact_person", "");
        setFieldValue("contact_no", "");
        setFieldValue("email", "");
        setFieldValue("index", undefined);
      });
    } else {
      console.log("already exists in row");
      toast.warning("Department Details are Already Exist !");
    }
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
  handlefail = () => {
    console.log("close Called");
  };

  // handle click event of the Remove button
  removeDeptRow = (index) => {
    const { deptList } = this.state;
    const list = [...deptList];
    list.splice(index, 1);
    this.setState({ deptList: list });
  };

  addBankRow = (values, setFieldValue) => {
    let bankObj = {
      bank_name: values.bank_name,
      bank_account_no: values.bank_account_no,
      bank_ifsc_code: values.bank_ifsc_code,
      bank_branch: values.bank_branch,
      index: values.index,
    };

    console.log({ bankObj });
    const { bankList } = this.state;
    // if (bankAccountNumber.test(bankObj.bank_account_no)) {
    // if (ifsc_code_regex.test(bankObj.bank_ifsc_code)) {
    let old_lst = bankList;
    let is_updated = false;

    let obj = old_lst.filter((value) => {
      return (
        value.bank_name === bankObj.bank_name &&
        value.bank_account_no === bankObj.bank_account_no &&
        value.bank_ifsc_code === bankObj.bank_ifsc_code &&
        value.bank_branch === bankObj.bank_branch
      );
    });
    let final_state = [];
    if (obj.length == 0) {
      final_state = old_lst.map((item) => {
        // if (item.bank_account_no === bankObj.bank_account_no) {
        if (item.index == bankObj.index) {
          is_updated = true;
          const updatedItem = bankObj;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...bankList, bankObj];
      }
      console.log({ final_state });
      this.setState({ bankList: final_state }, () => {
        setFieldValue("bank_name", "");
        setFieldValue("bank_account_no", "");
        setFieldValue("bank_ifsc_code", "");
        setFieldValue("bank_branch", "");
        setFieldValue("index", undefined);
      });
    } else {
      console.log("already exists in row");
      toast.warning("Bank Details are Already Exist !");
    }
  };
  removeBankRow = (index) => {
    const { bankList } = this.state;
    const list = [...bankList];
    list.splice(index, 1);
    this.setState({ bankList: list });
  };
  extract_pan_from_GSTIN = (gstinffield, setFieldValue) => {
    //;
    let pan = gstinffield.substring(2, 12);
    console.log("Pan From Gstin", pan);
    setFieldValue("pan_no", pan);
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
      show,
      undervalue,
      balancingOpt,
      stateOpt,
      countryOpt,
      GSTTypeOpt,
      dt,
      cityOpt,
      initValue,
      gstList,
      options,
      deptList,
      shippingList,
      billingList,
      bankList,
      appConfig,
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

          // if (!values.ledger_name) {
          //   errors.ledger_name = "required";
          // } else if (!/^(([a-zA-Z\s]))+$/.test(values.ledger_name)) {
          //   errors.ledger_name = "Invalid Ledger Name.";
          // }
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
          console.log("values.gstList.length->", values);
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.pan_no == ""
          // ) {
          //   errors.pan_no = "PAN Required";
          // }
          // } else if (
          //   !values.pan_no == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.pan_no)
          // ) {
          //   errors.pan_no = "Invalid PAN No";
          // }
          // console.log(typeof values.credit_days);
          if (parseInt(values.credit_days) > 0) {
            console.log("values.applicable_from", values.applicable_from);
            if (!values.applicable_from) {
              errors.applicable_from = "required";
            }
          }
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.gstin == ""
          // ) {
          //   errors.gstin = "Required";
          // }
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.registraion_type == ""
          // ) {
          //   errors.registraion_type = "Required";
          // }
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
          // if (!values.ledger_name) {
          //   errors.ledger_name = "Ledger name is required";
          // } else if (!/^(([a-zA-Z\s]))+$/.test(values.ledger_name)) {
          //   errors.ledger_name = "Invalid Ledger Name.";
          // }
          // if (!values.supplier_code) {
          //   errors.supplier_code = "Supplier Code is required";
          // }
          // if (!values.is_private) {
          //   errors.is_private = "Ledger Type is required";
          // }
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.pan_no == ""
          // ) {
          //   errors.pan_no = "PAN required";
          // }
          // } else if (
          //   !values.pan_no == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.pan_no)
          // ) {
          //   errors.pan_no = "Invalid PAN No";
          // }

          if (
            values.isTaxation &&
            values.isTaxation.value == true &&
            values.registraion_type == ""
          ) {
            errors.registraion_type = "Registration Type required";
          }
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
          //   errors.gstin = "required";
          // }
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
          if (!values.ledger_name) {
            errors.ledger_name = "required";
          }
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
      // <LayoutCustom>
      <div className="emp">
        <Card className="mb-0">
          <CardBody className="border-bottom p-2">
            <div style={{ background: "#cee7f1", padding: "10px" }}>
              <CardTitle>Create Ledger</CardTitle>
              <Formik
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={initValue}
                validationSchema={Yup.object().shape({
                  // associates_group_name: Yup.string()
                  //   .trim()
                  //   .required("Ledger group name is required"),
                  // underId: Yup.object()
                  //   .nullable()
                  //   .required("Select under type"),
                })}
                onSubmit={(values, { resetForm }) => {
                  const formData = new FormData();
                  console.log("Values--------", values);
                  if (values.underId && values.underId.under_prefix != null) {
                    formData.append(
                      "under_prefix",
                      values.underId ? values.underId.under_prefix : ""
                    );
                  }

                  if (values.underId && values.underId.associates_id != null) {
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
                    if (values.supplier_code != null) {
                      formData.append("supplier_code", values.supplier_code);
                    }
                    if (values.route != null) {
                      formData.append("route", values.route);
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
                    if (values.underId && values.underId.principle_id != null) {
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
                      formData.append("businessTrade", values.natureOfBusiness);
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
                    if (values.mfg_expiry != null && values.mfg_expiry != "") {
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
                    if (values.pincode != null) {
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
                      formData.append("creditBillValue", values.credit_values);
                    }

                    if (values.salesrate != null) {
                      formData.append("salesrate", values.salesrate.value);
                    }
                    if (
                      values.salesmanId != "" &&
                      values.salesmanId != null &&
                      values.salesmanId != undefined
                    ) {
                      // formData.append("salesman", values.salesman);
                      formData.append("salesman", values.salesmanId.value);
                    }
                    if (
                      values.areaId != null &&
                      values.areaId != "" &&
                      values.areaId != undefined
                    ) {
                      //formData.append("area", values.area);
                      formData.append("area", values.areaId.value);
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
                        obj["gstin"] = v.gstin;

                        if (
                          v.dateofregistartion != "" &&
                          v.dateofregistartion != null
                        ) {
                          let pandateofregistration = moment(
                            new Date(),
                            "DD/MM/YYYY"
                          ).toDate();
                          obj["dateofregistartion"] = moment(
                            new Date(pandateofregistration)
                          ).format("yyyy-MM-DD");
                        }
                        // obj["dateofregistartion"] = moment(
                        //   v.dateofregistartion
                        // ).format("YYYY-MM-DD");

                        if (v.pan_no != "") obj["pancard"] = v.pan_no;

                        return obj;
                      });
                    }

                    formData.append("gstdetails", JSON.stringify(gstdetails));

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

                    formData.append(
                      "shippingDetails",
                      JSON.stringify(shippingList)
                    );

                    let deptDetails = [];
                    deptDetails = deptList.map((v, i) => {
                      let obj = {
                        dept: v.dept,
                        contact_person: v.contact_person,
                        contact_no: v.contact_no,
                      };

                      if (v.email != "") obj["email"] = v.email;

                      return obj;
                    });
                    formData.append("deptDetails", JSON.stringify(deptDetails));
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
                  //   alert("test4")

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

                  //   if (values.pincode != null) {
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
                  //       moment(values.tcs_applicable_date).format("YYYY-MM-DD")
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
                  //     formData.append("businessTrade", values.natureOfBusiness);
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
                  //     formData.append("creditBillValue", values.credit_values);
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
                  //   if (values.mfg_expiry != null && values.mfg_expiry != "") {
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
                  //     // console.log("gst", JSON.stringify(gstList));

                  //     gstdetails = gstList.map((v, i) => {
                  //       let obj = {};
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

                  //   let billingDetails = billingList.map((v, i) => {
                  //     return {
                  //       district: v.b_district,
                  //       billing_address: v.billing_address,
                  //     };
                  //   });

                  //   formData.append(
                  //     "billingDetails",
                  //     JSON.stringify(billingDetails)
                  //   );

                  //   formData.append(
                  //     "shippingDetails",
                  //     JSON.stringify(shippingList)
                  //   );

                  //   let deptDetails = [];
                  //   deptDetails = deptList.map((v, i) => {
                  //     let obj = {
                  //       dept: v.dept,
                  //       contact_person: v.contact_person,
                  //       contact_no: v.contact_no,
                  //     };

                  //     if (v.email != "") obj["email"] = v.email;

                  //     return obj;
                  //   });
                  //   formData.append("deptDetails", JSON.stringify(deptDetails));
                  //   formData.append("bankDetails", JSON.stringify(bankList));

                  //   // if (values.bank_name != null) {
                  //   //   formData.append("bank_name", values.bank_name);
                  //   // }
                  //   // if (values.bank_account_no != null) {
                  //   //   formData.append("bank_account_no", values.bank_account_no);
                  //   // }
                  //   // if (values.bank_ifsc_code != null) {
                  //   //   formData.append("bank_ifsc_code", values.bank_ifsc_code);
                  //   // }
                  //   // if (values.bank_branch != null) {
                  //   //   formData.append("bank_branch", values.bank_branch);
                  //   // }
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
                    console.log("bank_account");

                    if (
                      values.underId.sub_principle_id &&
                      values.underId.sub_principle_id != ""
                    ) {
                      formData.append(
                        "principle_group_id",
                        values.underId.sub_principle_id
                      );
                      console.log("bank_account1");
                    }
                    if (
                      values.underId.principle_id &&
                      values.underId.principle_id != ""
                    ) {
                      formData.append(
                        "principle_id",
                        values.underId.principle_id
                      );
                      console.log("bank_account2");
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
                    console.log("bank_account3_0");
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
                    // formData.append(
                    //   "balancing_method",
                    //   values.opening_balancing_method.value
                    // );

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
                    // if (values.pincode != null) {
                    //   formData.append("pincode", values.pincode);
                    // }

                    // if (values.email_id != "" && values.email_id) {
                    //   formData.append("email", values.email_id);
                    // }
                    // if (values.phone_no != null)
                    //   formData.append("mobile_no", values.phone_no);

                    if (values.isTaxation != null) {
                      formData.append("taxable", values.isTaxation.value);
                    }

                    // if (values.isTaxation.value == true) {
                    //   formData.append(
                    //     "gstin",
                    //     values.gstin && values.gstin != "" ? values.gstin : ""
                    //   );

                     
                    // }

                    if (values.bank_name != null) {
                      formData.append("bank_name", values.bank_name);
                    }

                    if (values.bank_account_no != null) {
                      formData.append("account_no", values.bank_account_no);
                    }
                    console.log("bank_account3_6");
                    if (values.bank_ifsc_code != null) {
                      formData.append("ifsc_code", values.bank_ifsc_code);
                    }
                    if (values.bank_branch != null) {
                      formData.append("bank_branch", values.bank_branch);
                    }
                  }

                  // alert("test4");

                  formData.append("bankDetails", JSON.stringify(bankList));

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
                    if (values.pincode != null) {
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
                  if (values.is_private != "") {
                    formData.append("is_private", values.is_private.value);
                  }
                  formData.append("bankDetails", JSON.stringify(bankList));

                  for (let [name, value] of formData) {
                    console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                  }
                  createLedger(formData)
                    .then((response) => {
                      let res = response.data;
                      if (res.responseStatus == 200) {
                        // toast.success("Success", res.message);
                        toast.success("✔ " + res.message);

                        // if (this.state.source != "") {
                        //   eventBus.dispatch("page_change", {
                        //     from: "ledgercreate",
                        //     to: this.state.source.from_page,
                        //     prop_data: {
                        //       ...this.state.source,
                        //     },
                        //     isNewTab: false,
                        //   });
                        //   this.setState({ source: "" });
                        // } else {
                        //   eventBus.dispatch("page_change", "ledgerlist");
                        // }

                        this.props.history.push(`/master/ledger/ledger-list`);
                        resetForm();

                        this.setLedgerCode();
                      } else {
                        // toast.error("Error" + response.message);
                      }
                    })
                    .catch((error) => {});
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
                  <Form onSubmit={handleSubmit} autoComplete="off">
                    {/* {JSON.stringify(
                          values.underId
                        )} */}
                    <Row style={{ borderBottom: "5px white solid" }}>
                      <Col md="3">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            Ledger Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            placeholder="Ledger Name"
                            name="ledger_name"
                            id="ledger_name"
                            onChange={handleChange}
                            // value={values.associates_group_name}
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
                              this.ValidateLedgermMaster(
                                values.underId,
                                values.underId.sub_principle_id,
                                values.underId.principle_id,
                                values.ledger_name,
                                values.supplier_code
                              );
                            }}
                            onInput={(e) => {
                              e.target.value =
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1);
                            }}
                            value={values.ledger_name}
                            autofocus
                            isvalid={touched.ledger_name && !errors.ledger_name}
                            // isInvalid={!!errors.ledger_name}
                          />
                          <span className="text-danger">
                            {errors.associates_group_name}
                          </span>
                        </FormGroup>
                      </Col>

                      {values.underId &&
                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "sundry_creditors" && (
                          <div>
                            <Col md={12}>
                              <Label>Supplier Code </Label>
                            </Col>
                            <Col md={12}>
                              <FormGroup>
                                <FormControl
                                  type="text"
                                  placeholder="Supplier Code"
                                  name="supplier_code"
                                  className="text-box"
                                  onChange={handleChange}
                                  value={values.supplier_code}
                                  onBlur={(v) => {
                                    v.preventDefault();
                                    // if (
                                    //   values.ledger_name != "" &&
                                    //   values.ledger_name != undefined
                                    // ) {
                                    //   setFieldValue(
                                    //     "mailing_name",
                                    //     values.ledger_name
                                    //   );
                                    // }
                                    this.ValidateLedgermMaster(
                                      values.underId,
                                      values.underId.sub_principle_id,
                                      values.underId.principle_id,
                                      values.ledger_name,
                                      values.supplier_code
                                    );
                                  }}
                                  isvalid={
                                    touched.supplier_code &&
                                    !errors.supplier_code
                                  }
                                  // isInvalid={!!errors.supplier_code}
                                />
                                <FormFeedback type="invalid">
                                  {errors.supplier_code}
                                </FormFeedback>
                              </FormGroup>
                            </Col>
                          </div>
                        )}
                      {values.underId &&
                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "sundry_debtors" && (
                          <div>
                            {/* <h1>Sundry Debtor main div</h1> */}
                            <Col md={12}>
                              <Label>Supplier Code </Label>
                            </Col>
                            <Col md={12}>
                              <FormGroup>
                                <FormControl
                                  type="text"
                                  placeholder="Supplier Code"
                                  name="supplier_code"
                                  className="text-box"
                                  onChange={handleChange}
                                  value={values.supplier_code}
                                  isvalid={
                                    touched.supplier_code &&
                                    !errors.supplier_code
                                  }
                                  // isInvalid={!!errors.supplier_code}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    // console.log("onblur", values.underId);
                                    this.ValidateLedgermMaster(
                                      values.underId,
                                      values.underId.sub_principle_id,
                                      values.underId.principle_id,
                                      values.ledger_name,
                                      values.supplier_code
                                    );
                                  }}
                                />
                                <FormFeedback type="invalid">
                                  {errors.supplier_code}
                                </FormFeedback>
                              </FormGroup>
                            </Col>
                          </div>
                        )}

                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            Under Group <span className="text-danger">*</span>
                          </Label>
                          <Select
                            placeholder="Select Group..."
                            ////isClearable={true}
                            styles={{
                              clearIndicator: ClearIndicatorStyles,
                            }}
                            onChange={(v) => {
                              console.log("underId", v);
                              setFieldValue("underId", v);
                              console.log(ledger_type_options[1]);
                              if (v.sub_principle_id) {
                                console.log(1);
                                if (v.sub_principle_id == 5) {
                                  console.log(5);
                                  setFieldValue("opening_balance_type", "cr");
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
                                  console.log("elseif");
                                  setFieldValue("opening_balance_type", "dr");
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
                            id="underId"
                            onBlur={(e) => {
                              e.preventDefault();
                              this.ValidateLedgermMaster(
                                values.underId,
                                values.underId.sub_principle_id,
                                values.underId.principle_id,
                                values.ledger_name,
                                values.supplier_code
                              );
                            }}
                            options={undervalue}
                            value={values.underId}
                            invalid={errors.underId ? true : false}
                          />
                          <p className="displaygroup pl-4 mb-0">
                            {values.underId
                              ? values.underId.associates_id
                                ? values.underId.sub_principle_id
                                  ? values.underId.subprinciple_name
                                  : values.underId.principle_name
                                : values.underId.principle_name
                              : values.underId.principle_name}
                          </p>
                          <span className="text-danger errormsg">
                            {errors.underId}
                          </span>
                        </FormGroup>
                      </Col>

                      {values.underId &&
                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "sundry_creditors" && (
                          <>
                            <Col md={3} className="mt-3">
                              <Row
                                style={{ marginTop: "-13px" }}
                                className="mb-2"
                              >
                                <Col md={8} className="pe-0">
                                  <Label>Balancing Method </Label>
                                </Col>
                                <Col md={8}>
                                  <FormGroup className="">
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
                                      // styles={ledger_select}
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
                                  </FormGroup>
                                </Col>
                              </Row>
                            </Col>
                          </>
                        )}

                      {values.underId &&
                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "sundry_debtors" && (
                          <>
                            {/* <h1>Sundry Debtor</h1> */}
                            <Col lg={2} className="mt-3">
                              <Row
                                style={{ marginTop: "-13px" }}
                                className="mb-2"
                              >
                                <Col md={8} className="pe-0">
                                  <Label>Balancing Method </Label>
                                </Col>
                                <Col md={8}>
                                  <FormGroup className="">
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
                                      // styles={ledger_select}
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
                                  </FormGroup>
                                </Col>
                              </Row>
                            </Col>
                          </>
                        )}

                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            Opening Balance
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            placeholder="Ledger Group"
                            name="opening_balance"
                            id="opening_balance"
                            onChange={handleChange}
                            onKeyPress={(e) => {
                              OnlyEnterAmount(e);
                            }}
                            value={values.opening_balance}
                            isvalid={
                              touched.opening_balance && !errors.opening_balance
                            }
                            // isInvalid={!!errors.opening_balance}
                          />
                          <span className="text-danger">
                            {errors.opening_balance_type}
                          </span>
                        </FormGroup>
                      </Col>
                      <Col md="1">
                        <FormGroup>
                          <Label
                            for="exampleDatetime"
                            style={{ color: "#cee7f1" }}
                          >
                            .
                          </Label>
                          <Input
                            onChange={(e) => {
                              setFieldValue(
                                "opening_balance_type",
                                e.target.value
                              );
                            }}
                            name="opening_balance_type"
                            type="select"
                            value={values.opening_balance_type}
                          >
                            <option value="dr">Dr</option>
                            <option value="cr">Cr</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    {/* {values.underId &&
                      values.underId.ledger_form_parameter_slug.toLowerCase() ==
                        "sundry_debtors" &&
                      console.log(values)}
                    {values.underId &&
                      values.underId.ledger_form_parameter_slug.toLowerCase() ==
                        "bank_account" &&
                      console.log(values)} */}

                    {values.underId &&
                      values.underId.ledger_form_parameter_slug.toLowerCase() ==
                        "sundry_debtors" && (
                        <>
                          {/* sundry debetor form start  */}
                          {/* <h1>Sundry Debtor last</h1> */}
                          <div className=" form-style p-0">
                            {/* <div className="mt-2"> */}

                            <Row
                              style={{
                                borderBottom: "5px white solid",
                                marginTop: "4px",
                              }}
                            >
                              <Col md="4">
                                <FormGroup>
                                  <Label for="exampleDatetime">
                                    Mailing Name
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <FormGroup>
                                    <FormControl
                                      autoFocus="true"
                                      type="text"
                                      placeholder="Mailing Name"
                                      name="mailing_name"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={values.mailing_name}
                                      isvalid={
                                        touched.mailing_name &&
                                        !errors.mailing_name
                                      }
                                      // isInvalid={!!errors.mailing_name}
                                    />
                                    <span className="text-danger errormsg">
                                      {errors.mailing_name}
                                    </span>
                                  </FormGroup>
                                  {/* <span className="text-danger">
                                    {errors.associates_group_name}
                                  </span> */}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label for="exampleDatetime">
                                    Address
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <FormGroup className="mt-1">
                                    <FormControl
                                      style={{
                                        height: "58px",
                                        resize: "none",
                                      }}
                                      as="textarea"
                                      placeholder="Address"
                                      name="address"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={values.address}
                                      isvalid={
                                        touched.address && !errors.address
                                      }
                                      // isInvalid={!!errors.address}
                                    />
                                    <FormFeedback type="invalid">
                                      {errors.address}
                                    </FormFeedback>
                                  </FormGroup>
                                </FormGroup>
                              </Col>

                              <Col md="4">
                                <FormGroup>
                                  <Label>Email ID</Label>
                                  <span className="text-danger">*</span>
                                  <FormGroup className="">
                                    <FormControl
                                      type="text"
                                      placeholder="Email ID"
                                      name="email_id"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={values.email_id}
                                      isvalid={
                                        touched.email_id && !errors.email_id
                                      }
                                      // isInvalid={!!errors.email_id}
                                    />
                                    <FormFeedback type="invalid">
                                      {errors.email_id}
                                    </FormFeedback>
                                  </FormGroup>
                                </FormGroup>
                              </Col>

                              <Col md="3">
                                <FormGroup>
                                  <Label>Phone No.</Label>
                                  <span className="text-danger">*</span>
                                  <FormGroup className="">
                                    <FormControl
                                      type="text"
                                      placeholder="Phone No."
                                      name="phone_no"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={values.phone_no}
                                      onKeyPress={(e) => {
                                        OnlyEnterNumbers(e);
                                      }}
                                      isvalid={
                                        touched.phone_no && !errors.phone_no
                                      }
                                      // isInvalid={!!errors.phone_no}
                                      maxLength={10}
                                    />
                                    <FormFeedback type="invalid">
                                      {errors.phone_no}
                                    </FormFeedback>
                                  </FormGroup>
                                </FormGroup>
                              </Col>

                              <Col md="2">
                                <FormGroup>
                                  <Label>Country</Label>
                                  <span className="text-danger">*</span>
                                  <FormGroup className="">
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("countryId", v);
                                      }}
                                      name="countryId"
                                      options={countryOpt}
                                      value={values.countryId}
                                      invalid={errors.countryId ? true : false}
                                    />
                                    <span className="text-danger">
                                      {errors.countryId}
                                    </span>
                                  </FormGroup>
                                </FormGroup>
                              </Col>

                              <Col md="2">
                                <FormGroup>
                                  <Label>
                                    State
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <FormGroup className="">
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("stateId", v);
                                      }}
                                      name="stateId"
                                      options={stateOpt}
                                      value={values.stateId}
                                      invalid={errors.stateId ? true : false}
                                    />
                                    <span className="text-danger">
                                      {errors.stateId}
                                    </span>
                                  </FormGroup>
                                </FormGroup>
                              </Col>

                              <Col md="2">
                                <FormGroup>
                                  <Label>
                                    City
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <FormGroup className="">
                                    <FormControl
                                      type="text"
                                      placeholder="City"
                                      name="city"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={values.city}
                                      isvalid={touched.city && !errors.city}
                                      // isInvalid={!!errors.city}
                                      onKeyPress={(e) => {
                                        OnlyAlphabets(e);
                                      }}
                                    />
                                    <FormFeedback type="invalid">
                                      {errors.city}
                                    </FormFeedback>
                                  </FormGroup>
                                </FormGroup>
                              </Col>

                              <Col md="3">
                                <FormGroup>
                                  <Label>
                                    Pincode
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <FormGroup className="">
                                    <FormControl
                                      type="text"
                                      placeholder="Pincode"
                                      name="pincode"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={values.pincode}
                                      // onBlur={(e) => {
                                      //   if (
                                      //     e.target.value != null &&
                                      //     e.target.value != ""
                                      //   ) {
                                      //     this.getStateCityByPincode(
                                      //       e.target.value,
                                      //       setFieldValue
                                      //     );
                                      //   }
                                      // }}
                                      onKeyPress={(e) => {
                                        OnlyEnterNumbers(e);
                                      }}
                                      maxLength={6}
                                      isvalid={
                                        touched.pincode && !errors.pincode
                                      }
                                      // isInvalid={!!errors.pincode}
                                    />
                                    <FormFeedback type="invalid">
                                      {errors.pincode}
                                    </FormFeedback>
                                  </FormGroup>
                                </FormGroup>
                              </Col>
                            </Row>

                            <Row className="mx-0">
                              <Col md={12} className="column-height">
                                {/* <Row className="my-3">
                                  <Col>
                                    <Label className="Mail-title">
                                      Mailling Details :
                                    </Label>
                                  </Col>
                                </Row> */}

                                <Row className="mt-2"></Row>
                                {/* <hr /> */}
                              </Col>

                              <Col
                                className="column-height"
                                md={12}
                                style={{
                                  borderLeft:
                                    "1px solid rgba(211, 212, 214, 0.5)",
                                }}
                              >
                                <Row className="mt-2">
                                  <Col>
                                    <Tabs
                                      defaultActiveKey="TaxDetails"
                                      id="uncontrolled-tab-example"
                                      className="mb-2 mt-0"
                                      style={{
                                        background: "rgb(217, 240, 251)",
                                      }}

                                      // style={{ background: "#fff" }}
                                    >
                                      <Tab
                                        eventKey="TaxDetails"
                                        title="Tax Details"
                                        style={{ padding: "20px" }}
                                      >
                                        <Row>
                                          <Col>
                                            <Label className="Mail-title">
                                              Tax Details :
                                            </Label>
                                          </Col>
                                        </Row>
                                        <Row className="mt-2">
                                          <Col>
                                            <Row>
                                              <Col md={4}>
                                                <Row className="mb-2">
                                                  <Col md={6}>
                                                    <Label>
                                                      Tax Applicable{" "}
                                                      {/* <span className="pt-1 pl-1 req_validation">
                                              *
                                            </span> */}
                                                    </Label>{" "}
                                                  </Col>
                                                  <Col md={6}>
                                                    <FormGroup>
                                                      <Select
                                                        className="selectTo"
                                                        onChange={(e) => {
                                                          setFieldValue(
                                                            "isTaxation",
                                                            e
                                                          );
                                                        }}
                                                        options={
                                                          ledger_type_options
                                                        }
                                                        name="isTaxation"
                                                        id="isTaxation"
                                                        // styles={customStyles}

                                                        value={
                                                          values.isTaxation
                                                        }
                                                      />
                                                    </FormGroup>
                                                  </Col>
                                                </Row>
                                              </Col>
                                              {values.isTaxation.value ==
                                              true ? (
                                                <>
                                                  <Row className="mb-1 mx-0">
                                                    <Col
                                                      md={2}
                                                      className="me-1 pe-0"
                                                    >
                                                      <Label>
                                                        Registration Type
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </Label>
                                                    </Col>
                                                    <Col md={4}>
                                                      <FormGroup className="">
                                                        <Select
                                                          className="selectTo"
                                                          onChange={(v) => {
                                                            setFieldValue(
                                                              "registraion_type",
                                                              v
                                                            );
                                                          }}
                                                          name="registraion_type"
                                                          // styles={customStyles}

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
                                                      </FormGroup>
                                                    </Col>

                                                    <Col
                                                      md={2}
                                                      className="me-2 pe-0"
                                                    >
                                                      {/* <Row>
                                                      <Col lg={5}> */}
                                                      <Label className="lbl">
                                                        Registration Date
                                                      </Label>
                                                    </Col>
                                                    <Col
                                                      lg={4}
                                                      // className="for_padding_left"
                                                    >
                                                      <MyTextDatePicker
                                                        id="dateofregistartion"
                                                        name="dateofregistartion"
                                                        className="form-control"
                                                        placeholder="DD/MM/YYYY"
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
                                                            e.target.value !=
                                                              null &&
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
                                                        {
                                                          errors.dateofregistartion
                                                        }
                                                      </span>
                                                    </Col>
                                                  </Row>
                                                </>
                                              ) : (
                                                <Col md={6}>
                                                  <Row>
                                                    <Col md={4}>
                                                      <Label>
                                                        Pan Card No.
                                                        {/* <span className="text-danger">
                                                        *
                                                      </span> */}
                                                      </Label>
                                                    </Col>
                                                    <Col md={8}>
                                                      <FormGroup>
                                                        <FormControl
                                                          type="text"
                                                          placeholder="Pan Card No."
                                                          id="pan_no"
                                                          name="pan_no"
                                                          className="text-box"
                                                          onChange={
                                                            handleChange
                                                          }
                                                          value={
                                                            values.pan_no &&
                                                            values.pan_no.toUpperCase()
                                                          }
                                                          isvalid={
                                                            touched.pan_no &&
                                                            !errors.pan_no
                                                          }
                                                          // isInvalid={ !!errors.pan_no }
                                                          maxLength={10}
                                                        />
                                                        <FormFeedback type="invalid">
                                                          {errors.pan_no}
                                                        </FormFeedback>
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>
                                                </Col>
                                              )}
                                            </Row>
                                          </Col>
                                        </Row>
                                      </Tab>

                                      <Tab
                                        eventKey="bankDetails"
                                        title="Bank Details"
                                        style={{ padding: "20px" }}
                                      >
                                        <Row className="mb-2">
                                          <Col>
                                            <Label className="Mail-title">
                                              Bank Account :
                                            </Label>
                                          </Col>
                                        </Row>
                                        <Row className="mb-5">
                                          <Col md={12}>
                                            <Row className="mb-2">
                                              <Col md={2}>
                                                <Label>Bank Name </Label>
                                              </Col>
                                              <Col md={3}>
                                                <FormGroup>
                                                  <FormControl
                                                    type="text"
                                                    placeholder="Bank Name"
                                                    name="bank_name"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={values.bank_name}
                                                    onKeyPress={(e) => {
                                                      OnlyAlphabets(e);
                                                    }}
                                                    isvalid={
                                                      touched.bank_name &&
                                                      !errors.bank_name
                                                    }
                                                    // isInvalid={!!errors.bank_name}
                                                  />
                                                  <FormFeedback type="invalid">
                                                    {errors.bank_name}
                                                  </FormFeedback>
                                                </FormGroup>
                                              </Col>
                                              <Col md={2}>
                                                <Label>Account Number </Label>
                                              </Col>
                                              <Col md={4}>
                                                <FormGroup>
                                                  <FormControl
                                                    type="text"
                                                    placeholder="Account Number"
                                                    name="bank_account_no"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={
                                                      values.bank_account_no
                                                    }
                                                    onKeyPress={(e) => {
                                                      OnlyEnterNumbers(e);
                                                    }}
                                                    isvalid={
                                                      touched.bank_account_no &&
                                                      !errors.bank_account_no
                                                    }
                                                    // isInvalid={ !!errors.bank_account_no }
                                                    maxLength={14}
                                                  />
                                                  <FormFeedback type="invalid">
                                                    {errors.bank_account_no}
                                                  </FormFeedback>
                                                </FormGroup>
                                              </Col>
                                            </Row>
                                            <Row className="mb-2">
                                              <Col md={2}>
                                                <Label>IFSC Code </Label>
                                              </Col>
                                              <Col md={3}>
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
                                                    isvalid={
                                                      touched.bank_ifsc_code &&
                                                      !errors.bank_ifsc_code
                                                    }
                                                    maxLength={11}
                                                    // isInvalid={ !!errors.bank_ifsc_code }
                                                  />
                                                  <FormFeedback type="invalid">
                                                    {errors.bank_ifsc_code}
                                                  </FormFeedback>
                                                </FormGroup>
                                              </Col>
                                              <Col md={2}>
                                                <Label>Branch </Label>
                                              </Col>
                                              <Col md={4}>
                                                <FormGroup>
                                                  <FormControl
                                                    type="text"
                                                    placeholder="Branch"
                                                    name="bank_branch"
                                                    onKeyPress={(e) => {
                                                      OnlyAlphabets(e);
                                                    }}
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={values.bank_branch}
                                                    isvalid={
                                                      touched.bank_branch &&
                                                      !errors.bank_branch
                                                    }
                                                    // isInvalid={ !!errors.bank_branch }
                                                  />
                                                  <FormFeedback type="invalid">
                                                    {errors.bank_branch}
                                                  </FormFeedback>
                                                </FormGroup>
                                              </Col>
                                              <Col lg={1}>
                                                <div
                                                  className="rowPlusBtn"
                                                  onClick={(e) => {
                                                    e.preventDefault();

                                                    if (
                                                      values.bank_name != "" &&
                                                      values.bank_name != null
                                                    ) {
                                                      let bankObj = {
                                                        bank_name:
                                                          values.bank_name !=
                                                          null
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
                                                        index:
                                                          values.index !==
                                                          undefined
                                                            ? values.index
                                                            : bankList.length,
                                                      };
                                                      this.addBankRow(
                                                        bankObj,
                                                        setFieldValue
                                                      );
                                                    } else {
                                                      toast.error(
                                                        "Please Submit All Bank Details "
                                                      );
                                                    }
                                                  }}
                                                >
                                                  {/* <img
                                          src={Add}
                                          alt=""
                                          className="Add_icon_style"
                                        /> */}
                                                  {/* <FontAwesomeIcon
                                                  icon={faPlus}
                                                  className="plus-color"
                                                /> */}
                                                  <i
                                                    class="fa fa-plus-circle mt-2"
                                                    aria-hidden="true"
                                                    style={{
                                                      fontSize: "25px",
                                                      color: "#ffb12b",
                                                    }}
                                                  ></i>
                                                </div>
                                              </Col>
                                            </Row>
                                            <Row className="mb-2">
                                              <Col md="4" className="">
                                                <FormControl
                                                  type="text"
                                                  placeholder="index"
                                                  name="index"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  hidden
                                                  value={values.index}
                                                />
                                                {/* <Button
                                        className="create-btn me-0 successbtn-style"
                                        onClick={(e) => {
                                          console.log(
                                            "handle Fetch GST called"
                                          );
                                          e.preventDefault();
                                          this.clearBankData(setFieldValue);
                                        }}
                                      >
                                        CLEAR
                                      </Button> */}
                                              </Col>
                                            </Row>{" "}
                                            {bankList.length > 0 && (
                                              <Row className="mt-3 m-0">
                                                <Col md={12}>
                                                  <div className="add-row-tbl-style">
                                                    <Table
                                                      // bordered
                                                      hover
                                                      size="sm"
                                                      style={{
                                                        fontSize: "13px",
                                                        border:
                                                          "1px solid rgb(206, 231, 241)",
                                                      }}
                                                      //responsive
                                                    >
                                                      <thead
                                                        style={{
                                                          background:
                                                            "antiquewhite",
                                                        }}
                                                      >
                                                        <tr>
                                                          <th>Sr.</th>
                                                          <th>Bank Name</th>
                                                          <th>
                                                            Account Number
                                                          </th>
                                                          <th>IFSC Code</th>
                                                          <th colSpan={2}>
                                                            Branch
                                                          </th>
                                                          {/* <th className="text-center">-</th> */}
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        {bankList.map(
                                                          (v, i) => {
                                                            return (
                                                              <tr
                                                                onDoubleClick={(
                                                                  e
                                                                ) => {
                                                                  e.preventDefault();
                                                                  console.log(
                                                                    "sneha",
                                                                    v
                                                                  );
                                                                  let bankObj =
                                                                    {
                                                                      id: v.id,
                                                                      bank_name:
                                                                        v.bank_name !=
                                                                        null
                                                                          ? v.bank_name
                                                                          : "",
                                                                      bank_account_no:
                                                                        v.bank_account_no !=
                                                                        null
                                                                          ? v.bank_account_no
                                                                          : "",
                                                                      bank_ifsc_code:
                                                                        v.bank_ifsc_code !=
                                                                        null
                                                                          ? v.bank_ifsc_code
                                                                          : "",
                                                                      bank_branch:
                                                                        v.bank_branch !=
                                                                        null
                                                                          ? v.bank_branch
                                                                          : "",
                                                                      index:
                                                                        v.index,
                                                                    };
                                                                  this.handleFetchBankData(
                                                                    bankObj,
                                                                    setFieldValue
                                                                  );
                                                                }}
                                                              >
                                                                <td>{i + 1}</td>
                                                                <td>
                                                                  {v.bank_name}
                                                                </td>
                                                                <td>
                                                                  {
                                                                    v.bank_account_no
                                                                  }
                                                                </td>
                                                                <td>
                                                                  {
                                                                    v.bank_ifsc_code
                                                                  }
                                                                </td>
                                                                <td>
                                                                  {
                                                                    v.bank_branch
                                                                  }
                                                                </td>
                                                                <td className="text-end">
                                                                  <div
                                                                    style={{
                                                                      marginTop:
                                                                        "-12px",
                                                                    }}
                                                                    className="rowMinusBtn"
                                                                    variant=""
                                                                    type="button"
                                                                    onClick={(
                                                                      e
                                                                    ) => {
                                                                      e.preventDefault();
                                                                      this.removeBankRow(
                                                                        i
                                                                      );
                                                                    }}
                                                                  >
                                                                    {/* <FontAwesomeIcon
                                                          icon={faTrash}
                                                        /> */}
                                                                    {/* <FontAwesomeIcon
                                                                  icon={faMinus}
                                                                  className="minus-color"
                                                                /> */}
                                                                    <i
                                                                      class="fa fa-minus-circle mt-3"
                                                                      aria-hidden="true"
                                                                      style={{
                                                                        fontSize:
                                                                          "19px",
                                                                        color:
                                                                          "#FD5201",
                                                                      }}
                                                                    ></i>
                                                                  </div>
                                                                </td>
                                                              </tr>
                                                            );
                                                          }
                                                        )}
                                                      </tbody>
                                                    </Table>
                                                  </div>
                                                </Col>
                                              </Row>
                                            )}
                                          </Col>
                                        </Row>
                                      </Tab>

                                      <Tab
                                        eventKey="AdditionalDetails"
                                        title="Additional Details"
                                        style={{ padding: "20px" }}
                                      >
                                        <Row>
                                          <Col lg={2}>
                                            <Label>Date of Birth</Label>
                                          </Col>

                                          {console.log(values.dob)}
                                          <Col lg={3}>
                                            <MyTextDatePicker
                                              // style={{ borderRadius: "0" }}
                                              id="dob"
                                              name="dob"
                                              placeholder="DD/MM/YYYY"
                                              className="form-control"
                                              value={values.dob}
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
                                                  if (
                                                    moment(
                                                      e.target.value,
                                                      "DD-MM-YYYY"
                                                    ).isValid() == true
                                                  ) {
                                                    let cDate = moment(
                                                      dt,
                                                      "DD-MM-YYYY"
                                                    ).toDate();
                                                    let expDate = moment(
                                                      e.target.value,
                                                      "DD-MM-YYYY"
                                                    ).toDate();

                                                    if (
                                                      expDate.getTime() <=
                                                      cDate.getTime()
                                                    ) {
                                                      setFieldValue(
                                                        "dob",
                                                        e.target.value
                                                      );
                                                    } else {
                                                      console.log(
                                                        "date is greater than current date"
                                                      );
                                                      toast.error(
                                                        "Birth Date cann't be greater than Current Date"
                                                      );
                                                      setFieldValue("dob", "");
                                                    }
                                                  } else {
                                                    toast.error("Invalid Date");
                                                    setFieldValue("dob", "");
                                                  }
                                                } else {
                                                  setFieldValue("dob", "");
                                                }
                                              }}
                                            />
                                          </Col>
                                          <Col
                                            lg={3}
                                            className="for_padding for_padding_left pe-0"
                                          >
                                            <Label>Date of Anniversary</Label>
                                          </Col>
                                          <Col lg={3}>
                                            <MyTextDatePicker
                                              // style={{ borderRadius: "0" }}
                                              id="doa"
                                              name="doa"
                                              placeholder="DD/MM/YYYY"
                                              className="form-control"
                                              value={values.doa}
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
                                                  if (
                                                    moment(
                                                      e.target.value,
                                                      "DD-MM-YYYY"
                                                    ).isValid() == true
                                                  ) {
                                                    let cDate = moment(
                                                      dt,
                                                      "DD-MM-YYYY"
                                                    ).toDate();
                                                    let expDate = moment(
                                                      e.target.value,
                                                      "DD-MM-YYYY"
                                                    ).toDate();

                                                    if (
                                                      expDate.getTime() <=
                                                      cDate.getTime()
                                                    ) {
                                                      setFieldValue(
                                                        "doa",
                                                        e.target.value
                                                      );
                                                    } else {
                                                      console.log(
                                                        "date is greater than current date"
                                                      );
                                                      toast.error(
                                                        "Anniversary Date cann't be greater than Current Date"
                                                      );
                                                      setFieldValue("doa", "");
                                                    }
                                                  } else {
                                                    toast.error("Invalid Date");
                                                    setFieldValue("doa", "");
                                                  }
                                                } else {
                                                  setFieldValue("doa", "");
                                                }
                                              }}
                                            />
                                          </Col>
                                        </Row>
                                      </Tab>
                                      <Tab
                                        eventKey="licence"
                                        title="Licences"
                                        style={{ padding: "20px" }}
                                      >
                                        <Row className="mb-2">
                                          <Col lg={3}>
                                            <Label>Licence No.</Label>
                                          </Col>
                                          <Col lg={3}>
                                            <FormGroup className="">
                                              <FormControl
                                                type="text"
                                                placeholder="Licence No"
                                                className="text-box"
                                                name="licenseNo"
                                                id="licenseNo"
                                                onChange={handleChange}
                                                value={values.licenseNo}
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col
                                            lg={3}
                                            className="for_padding for_padding_left pe-0"
                                          >
                                            <Label>Licence Expiry Date</Label>
                                          </Col>
                                          <Col lg={3}>
                                            <MyTextDatePicker
                                              id="license_expiry"
                                              name="license_expiry"
                                              placeholder="DD/MM/YYYY"
                                              className="form-control"
                                              value={values.license_expiry}
                                              onChange={handleChange}
                                              onBlur={(e) => {
                                                if (
                                                  e.target.value != null &&
                                                  e.target.value != ""
                                                ) {
                                                  if (
                                                    moment(
                                                      e.target.value,
                                                      "DD-MM-YYYY"
                                                    ).isValid() == true
                                                  ) {
                                                    // setFieldValue(
                                                    //   "b_expiry",
                                                    //   e.target.value
                                                    // );
                                                    let mfgDate = new Date();
                                                    if (
                                                      mfgDate == "" ||
                                                      mfgDate == null ||
                                                      mfgDate == "Invalid Date"
                                                    ) {
                                                      toast.error(
                                                        "First input manufacturing date"
                                                      );
                                                      console.log(
                                                        "this is if Block "
                                                      );
                                                      setFieldValue(
                                                        "license_expiry",
                                                        ""
                                                      );
                                                      this.mfgDateRef.current.focus();
                                                    } else {
                                                      mfgDate = new Date(
                                                        moment(
                                                          new Date(),
                                                          "DD-MM-yyyy"
                                                        ).toDate()
                                                      );

                                                      let expDate = new Date(
                                                        moment(
                                                          e.target.value,
                                                          "DD/MM/YYYY"
                                                        ).toDate()
                                                      );
                                                      console.log(
                                                        "rahul:: mfgDate, expDate",
                                                        mfgDate,
                                                        expDate
                                                      );
                                                      console.warn(
                                                        "rahul::compare",
                                                        mfgDate <= expDate
                                                      );

                                                      if (expDate >= mfgDate) {
                                                        setFieldValue(
                                                          "license_expiry",
                                                          e.target.value
                                                        );
                                                        // this.checkInvoiceDateIsBetweenFYFun(
                                                        //   e.target.value
                                                        // );
                                                      } else {
                                                        toast.error(
                                                          "Expiry date exceding current date"
                                                        );
                                                        setFieldValue(
                                                          "license_expiry",
                                                          ""
                                                        );
                                                        this.batchdpRef.current.focus();
                                                      }
                                                    }
                                                  } else {
                                                    toast.error("Invalid Date");
                                                    this.batchdpRef.current.focus();
                                                    setFieldValue(
                                                      "license_expiry",
                                                      ""
                                                    );
                                                  }
                                                } else {
                                                  setFieldValue(
                                                    "license_expiry",
                                                    ""
                                                  );
                                                }
                                              }}
                                            />
                                          </Col>
                                        </Row>
                                        <Row className="mt-2">
                                          <Col md={3}>
                                            <Label>FSSAI No. </Label>
                                          </Col>
                                          <Col md={3}>
                                            <FormGroup className="">
                                              <FormControl
                                                type="text"
                                                placeholder="FSSAI No."
                                                name="fssai"
                                                id="fssai"
                                                className="text-box"
                                                onChange={handleChange}
                                                value={values.fssai}
                                              />
                                              <FormFeedback type="invalid">
                                                {errors.fssai}
                                              </FormFeedback>
                                            </FormGroup>
                                          </Col>

                                          <Col md={3}>
                                            <Label className="lbl">
                                              FSSAI Expiry
                                            </Label>
                                          </Col>
                                          <Col md={3}>
                                            <FormGroup>
                                              <MyTextDatePicker
                                                id="fssai_expiry"
                                                name="fssai_expiry"
                                                placeholder="DD/MM/YYYY"
                                                className="form-control"
                                                value={values.fssai_expiry}
                                                onChange={handleChange}
                                                onBlur={(e) => {
                                                  if (
                                                    e.target.value != null &&
                                                    e.target.value != ""
                                                  ) {
                                                    if (
                                                      moment(
                                                        e.target.value,
                                                        "DD-MM-YYYY"
                                                      ).isValid() == true
                                                    ) {
                                                      let mfgDate = new Date(
                                                        moment(
                                                          new Date(),
                                                          "DD-MM-yyyy"
                                                        ).toDate()
                                                      );
                                                      let expDate = new Date(
                                                        moment(
                                                          e.target.value,
                                                          "DD/MM/YYYY"
                                                        ).toDate()
                                                      );
                                                      console.log(
                                                        "rahul:: mfgDate, expDate",
                                                        mfgDate,
                                                        expDate
                                                      );
                                                      console.warn(
                                                        "rahul::compare",
                                                        mfgDate <= expDate
                                                      );

                                                      if (expDate >= mfgDate) {
                                                        setFieldValue(
                                                          "fssai_expiry",
                                                          e.target.value
                                                        );
                                                      } else {
                                                        toast.error(
                                                          "Expiry date exceding current date"
                                                        );
                                                        setFieldValue(
                                                          "license_expiry",
                                                          ""
                                                        );
                                                        this.batchdpRef.current.focus();
                                                      }
                                                    } else {
                                                      toast.error(
                                                        "Invalid Date"
                                                      );

                                                      setFieldValue(
                                                        "fssai_expiry",
                                                        ""
                                                      );
                                                    }
                                                  } else {
                                                    setFieldValue(
                                                      "fssai_expiry",
                                                      ""
                                                    );
                                                  }
                                                }}
                                              />

                                              <span className="text-danger errormsg">
                                                {errors.fssai_expiry}
                                              </span>

                                              {/* </Col> */}
                                            </FormGroup>
                                          </Col>
                                        </Row>

                                        <Row className="mt-2 mb-2">
                                          <Col md={3}>
                                            <Label>Drug License No. </Label>
                                          </Col>
                                          <Col md={3}>
                                            <FormGroup className="">
                                              <FormControl
                                                type="text"
                                                placeholder="Drug License No."
                                                name="drug_license_no"
                                                id="drug_license_no"
                                                onChange={handleChange}
                                                className="text-box"
                                                value={values.drug_license_no}
                                              />
                                              <FormFeedback type="invalid">
                                                {errors.drug_license_no}
                                              </FormFeedback>
                                            </FormGroup>
                                          </Col>

                                          <Col md={3}>
                                            <Label className="lbl">
                                              Drug Expiry
                                            </Label>
                                          </Col>
                                          <Col md={3}>
                                            <FormGroup className="">
                                              <MyTextDatePicker
                                                // style={{ borderRadius: "0" }}
                                                id="drug_expiry"
                                                name="drug_expiry"
                                                className="form-control"
                                                placeholder="DD/MM/YYYY"
                                                value={values.drug_expiry}
                                                onChange={handleChange}
                                                onBlur={(e) => {
                                                  if (
                                                    e.target.value != null &&
                                                    e.target.value != ""
                                                  ) {
                                                    if (
                                                      moment(
                                                        e.target.value,
                                                        "DD-MM-YYYY"
                                                      ).isValid() == true
                                                    ) {
                                                      let mfgDate = new Date(
                                                        moment(
                                                          new Date(),
                                                          "DD-MM-yyyy"
                                                        ).toDate()
                                                      );
                                                      let expDate = new Date(
                                                        moment(
                                                          e.target.value,
                                                          "DD/MM/YYYY"
                                                        ).toDate()
                                                      );

                                                      if (expDate >= mfgDate) {
                                                        setFieldValue(
                                                          "drug_expiry",
                                                          e.target.value
                                                        );
                                                      } else {
                                                        toast.error(
                                                          "Expiry date exceding current date"
                                                        );
                                                        setFieldValue(
                                                          "drug_expiry",
                                                          ""
                                                        );
                                                        this.batchdpRef.current.focus();
                                                      }
                                                    } else {
                                                      toast.error(
                                                        "Invalid Date"
                                                      );

                                                      setFieldValue(
                                                        "drug_expiry",
                                                        ""
                                                      );
                                                    }
                                                  } else {
                                                    setFieldValue(
                                                      "drug_expiry",
                                                      ""
                                                    );
                                                  }
                                                }}
                                              />

                                              <span className="text-danger errormsg">
                                                {errors.drug_expiry}
                                              </span>
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                        <Row className="">
                                          <Col lg={3}>
                                            <Label>Mfg. Licence No.</Label>
                                          </Col>
                                          <Col lg={3}>
                                            <FormGroup className="">
                                              <FormControl
                                                type="text"
                                                placeholder="Mfg. Licence No"
                                                name="mfg_license_no"
                                                id="mfg_license_no"
                                                onChange={handleChange}
                                                className="text-box"
                                                value={values.mfg_license_no}
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col lg={3}>
                                            <Label>Mfg. Expiry Date</Label>
                                          </Col>
                                          <Col lg={3}>
                                            <MyTextDatePicker
                                              // style={{ borderRadius: "0" }}
                                              id="mfg_expiry"
                                              name="mfg_expiry"
                                              placeholder="DD/MM/YYYY"
                                              className="form-control"
                                              value={values.mfg_expiry}
                                              onChange={handleChange}
                                              onBlur={(e) => {
                                                if (
                                                  e.target.value != null &&
                                                  e.target.value != ""
                                                ) {
                                                  if (
                                                    moment(
                                                      e.target.value,
                                                      "DD-MM-YYYY"
                                                    ).isValid() == true
                                                  ) {
                                                    let mfgDate = new Date(
                                                      moment(
                                                        new Date(),
                                                        "DD-MM-yyyy"
                                                      ).toDate()
                                                    );
                                                    let expDate = new Date(
                                                      moment(
                                                        e.target.value,
                                                        "DD/MM/YYYY"
                                                      ).toDate()
                                                    );

                                                    if (expDate >= mfgDate) {
                                                      setFieldValue(
                                                        "mfg_expiry",
                                                        e.target.value
                                                      );
                                                    } else {
                                                      toast.error(
                                                        "Expiry date exceding current date"
                                                      );
                                                      setFieldValue(
                                                        "mfg_expiry",
                                                        ""
                                                      );
                                                      this.batchdpRef.current.focus();
                                                    }
                                                  } else {
                                                    toast.error("Invalid Date");

                                                    setFieldValue(
                                                      "mfg_expiry",
                                                      ""
                                                    );
                                                  }
                                                } else {
                                                  setFieldValue(
                                                    "mfg_expiry",
                                                    ""
                                                  );
                                                }
                                              }}
                                            />
                                          </Col>
                                        </Row>
                                      </Tab>
                                    </Tabs>
                                  </Col>
                                </Row>
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
                          {/* <Row>
                            <Col>
                              <h5 className="Mail-title ms-2 form-label">
                                Taxation Details
                              </h5>
                            </Col>
                          </Row>
                          <Row className="mx-0" style={{ margin: "12px" }}>
                            <Col md={12}>
                              <Row className="mb-2">
                                <Col md={1}>
                                  <Label>Taxation Available</Label>
                                </Col>
                                <Col md={2}>
                                  <FormGroup>
                                    <Select
                                      className="selectTo"
                                      onChange={(e) => {
                                        setFieldValue("isTaxation", e);
                                      }}
                                      options={ledger_type_options}
                                      name="isTaxation"
                                      value={values.isTaxation}
                                    />
                                  </FormGroup>
                                </Col>
                                {values.isTaxation &&
                                  values.isTaxation.value == true && (
                                    <>
                                      <Col lg={3}>
                                        <Row>
                                          <Col lg={2}>
                                            <Label>GSTIN</Label>
                                          </Col>
                                          <Col lg={10}>
                                            <FormGroup>
                                              <FormControl
                                                type="text"
                                                placeholder="GSTIN"
                                                name="gstin"
                                                className="text-box"
                                                id="gstin"
                                                onChange={handleChange}
                                                value={
                                                  values.gstin &&
                                                  values.gstin.toUpperCase()
                                                }
                                                isvalid={
                                                  touched.gstin && !errors.gstin
                                                }
                                                maxLength={15}
                                              />
                                              <FormFeedback type="invalid">
                                                {errors.gstin}
                                              </FormFeedback>
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                      </Col>
                                    </>
                                  )}
                              </Row>
                            </Col>
                          </Row> */}
                          <hr />
                          <div className="mt-2 mx-0">
                            <Row>
                              <Col>
                                <h5 className="Mail-title ms-2 form-label">
                                  Bank Details
                                </h5>
                              </Col>
                            </Row>

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
                                    value={values.bank_name}
                                    onKeyPress={(e) => {
                                      OnlyAlphabets(e);
                                    }}
                                    isvalid={
                                      touched.bank_name && !errors.bank_name
                                    }
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
                                    isvalid={
                                      touched.bank_account_no &&
                                      !errors.bank_account_no
                                    }
                                    maxLength={14}
                                  />
                                  <FormFeedback type="invalid">
                                    {errors.bank_account_no}
                                  </FormFeedback>
                                </FormGroup>
                              </Col>
                              <Col lg={3}>
                                <Row>
                                  <Col lg={3}>
                                    <Label>IFSC Code </Label>
                                  </Col>
                                  <Col lg={8}>
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
                                        isvalid={
                                          touched.bank_ifsc_code &&
                                          !errors.bank_ifsc_code
                                        }
                                        maxLength={11}
                                      />
                                      <FormFeedback type="invalid">
                                        {errors.bank_ifsc_code}
                                      </FormFeedback>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>

                              <Col md={1}>
                                <Label>Branch </Label>
                              </Col>
                              <Col md={2}>
                                <FormGroup>
                                  <FormControl
                                    type="text"
                                    placeholder="Branch"
                                    name="bank_branch"
                                    onKeyPress={(e) => {
                                      OnlyAlphabets(e);
                                    }}
                                    className="text-box"
                                    onChange={handleChange}
                                    value={values.bank_branch}
                                    isvalid={
                                      touched.bank_branch && !errors.bank_branch
                                    }
                                    // isInvalid={!!errors.bank_branch}
                                  />
                                  <FormFeedback type="invalid">
                                    {errors.bank_branch}
                                  </FormFeedback>
                                </FormGroup>
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
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn mx-2 me-2"
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // toast.confirm("Do you want to cancel !");
                                  this.props.history.push(
                                    `/master/ledger/ledger-list`
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
                                  <Label>
                                    Tax Type{" "}
                                    {/* <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span> */}
                                  </Label>
                                </Col>
                                <Col md="2">
                                  <FormGroup className="">
                                    <Select
                                      autoFocus="true"
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("tax_type", v);
                                      }}
                                      name="tax_type"
                                      // styles={customStyles}

                                      options={taxOpt}
                                      value={values.tax_type}
                                      invalid={errors.tax_type ? true : false}
                                      //styles={customStyles}
                                    />
                                    <span className="text-danger">
                                      {errors.tax_type}
                                    </span>
                                  </FormGroup>
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
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn mx-2 me-2"
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // toast.confirm("Do you want to cancel !");
                                  this.props.history.push(
                                    `/master/ledger/ledger-list`
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
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn mx-2 me-2"
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // toast.confirm("Do you want to cancel !");
                                  this.props.history.push(
                                    `/master/ledger/ledger-list`
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
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn mx-2 me-2"
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // toast.confirm("Do you want to cancel !");
                                  this.props.history.push(
                                    `/master/ledger/ledger-list`
                                  );
                                }}
                              >
                                Cancel
                              </Button>
                            </Col>
                          </Row>
                        </>
                      )}

                    {values.underId == "" && (
                      <Row
                        className="mx-0 btm-rows-btn"
                        style={{
                          position: "absolute",
                          bottom: "0",
                          right: "0",
                        }}
                      >
                        <Col className="text-end">
                          <Button
                            variant="secondary cancel-btn mx-2 me-2"
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              // toast.confirm("Do you want you cancel !");
                              this.props.history.push(
                                `/master/ledger/ledger-list`
                              );
                            }}
                          >
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    )}
                    {/* Assets end  */}
                  </Form>
                )}
              />
            </div>
          </CardBody>
        </Card>

        {/* button end */}
      </div>
      //  </LayoutCustom>
    );
  }
}

// export default WithUserPermission(LedgerCreate);
