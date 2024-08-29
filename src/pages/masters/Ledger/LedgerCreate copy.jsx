import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  InputGroup,
  ButtonGroup,
  FormControl,
  CloseButton,
  Modal,
  Table,
  Tabs,
  Tab,
} from "react-bootstrap";
import { Formik } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import Add from "@/assets/images/add_blue_circle@3x.png";
import { faL, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

import {
  getUnderList,
  getBalancingMethods,
  getIndianState,
  getIndiaCountry,
  createLedger,
  getGSTTypes,
  createAssociateGroup,
  updateAssociateGroup,
  getValidateLedgermMaster,
  getoutletappConfig,
  getAreaMasterOutlet,
  getSalesmanMasterOutlet,
} from "@/services/api_functions";
import moment from "moment";
import {
  ShowNotification,
  getRandomIntInclusive,
  AuthenticationCheck,
  customStyles,
  MyDatePicker,
  eventBus,
  customStylesForJoin,
  ifsc_code_regex,
  pan,
  MyNotifications,
  MobileRegx,
  GSTINREX,
  pincodeReg,
  EMAILREGEXP,
  ledger_select,
  onlydigitsRegExp,
  FSSAIno,
  bankAccountNumber,
  getSelectValue,
  OnlyEnterNumbers,
  OnlyEnterAmount,
  OnlyAlphabets,
  MyTextDatePicker,
  isUserControl,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getValue } from "../../helpers/constants";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import { bindActionCreators } from "redux";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import { connect } from "react-redux";

const taxOpt = [
  { value: "central_tax", label: "Central Tax" },
  { value: "state_tax", label: "State Tax" },
  { value: "integrated_tax", label: "Integrated Tax" },
];

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
class LedgerCreate extends React.Component {
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
  handleClose = () => {
    this.setState({ show: false });
  };
  handleModal = (status) => {
    if (status == true) {
      let initValue = {
        associates_id: "",
        associates_group_name: "",
        underId: "",
        opening_balance: 0,
        is_private: "",
      };
      this.setState({ initValue: initValue }, () => {
        this.setState({ show: status });
      });
    } else {
      this.setState({ show: status });
    }
  };

  lstUnders = () => {
    getUnderList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let Opt = d.map((v, i) => {
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
  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "ledgercreate",
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
      this.setInitValue();
      this.getoutletappConfigData();
      this.lstAreaMaster();
      this.lstSalesmanMaster();
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);

      let x = (x) => {};
      const { prop_data } = this.props.block;
      console.log("ledger prop_data", prop_data);
      this.setState({ source: prop_data }, () => {
        // console.log("source", this.state.source);
      });
    }
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
          MyNotifications.fire({
            show: true,
            icon: "warning",
            title: "Warning",
            msg: "Gst Details are Already Exist !",
            is_button_show: false,
          });
        }
      } else {
        MyNotifications.fire({
          show: true,
          icon: "error",
          title: "Error",
          msg: "PAN NO is Not Valid ",
          is_button_show: false,
        });
      }
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "GSTIN is not Valid!",
        is_button_show: false,
      });
    }
    // if (gstObj.registraion_type != "") {
    //   console.log("GSTIN ", gstObj.gstin);
    //   console.log("pan", gstObj.pan);
    //   if (GSTINREX.test(gstObj.gstin)) {
    //     if (pan.test(gstObj.pan_no)) {
    //       let old_lst = gstList;
    //       let is_updated = false;

    //       let final_state = old_lst.map((item) => {
    //         if (item.id === gstObj.id) {
    //           is_updated = true;
    //           const updatedItem = gstObj;
    //           return updatedItem;
    //         }
    //         return item;
    //       });
    //       if (is_updated == false) {
    //         final_state = [...gstList, gstObj];
    //       }
    //       this.setState({ gstList: final_state }, () => {
    //         setFieldValue("gstin", "");
    //         setFieldValue("dateofregistartion", "");
    //         setFieldValue("pan_no", "");
    //         setFieldValue("registraion_type", "");
    //       });
    //     } else {
    //       MyNotifications.fire({
    //         show: true,
    //         icon: "error",
    //         title: "Error",
    //         msg: "GSTIN is not valid !",
    //         is_button_show: false,
    //       });
    //     }
    //   } else {
    //     MyNotifications.fire({
    //       show: true,
    //       icon: "error",
    //       title: "Error",
    //       msg: "PAN NO. not valid !",
    //       is_button_show: false,
    //     });
    //   }
    // } else {
    //   MyNotifications.fire({
    //     show: true,
    //     icon: "error",
    //     title: "Error",
    //     msg: "Registration type is Required!",
    //     is_button_show: false,
    //   });
    // }
  };
  // handle click event of the Remove button
  removeGstRow = (index) => {
    const { gstList } = this.state;
    const list = [...gstList];
    list.splice(index, 1);
    this.setState({ gstList: list });
  };

  //   let shipObj = {
  //     district: values.district,
  //     shipping_address: values.shipping_address,
  //     index: values.index,
  //   };

  //   let { shippingList } = this.state;

  //   let old_lst = shippingList;
  //   let is_updated = false;

  //   let obj = old_lst.filter((value) => {
  //     return (
  //       value.district === shipObj.district,
  //       value.shipping_address === shipObj.shipping_address
  //     );
  //   });
  //   console.log("obj", obj);
  //   let final_state = [];
  //   if (obj.length == 0) {
  //     if (values.index == -1) {
  //       final_state = old_lst.map((item) => {
  //         // if (item.id != 0 && item.id === shipObj.id) {
  //         is_updated = true;
  //         const updatedItem = shipObj;
  //         return updatedItem;
  //         // }
  //         return item;
  //       });
  //       console.log("is_updated ", is_updated);
  //       if (is_updated == false) {
  //         final_state = [...shippingList, shipObj];
  //       }
  //       console.log({ final_state });
  //     } else {
  //       final_state = old_lst.map((item, i) => {
  //         if (i == values.index) {
  //           return shipObj;
  //         } else {
  //           return item;
  //         }
  //       });
  //     }
  //   } else {
  //     console.log("already exists in row");
  //     MyNotifications.fire({
  //       show: true,
  //       icon: "warning",
  //       title: "Warning",
  //       msg: "Shipping Details are Already Exist !",
  //       is_button_show: false,
  //     });
  //   }

  //   if (is_updated == false) {
  //     final_state = [...shippingList, shipObj];
  //   }
  //   this.setState({ shippingList: final_state }, () => {
  //     setFieldValue("district", "");
  //     setFieldValue("shipping_address", "");
  //   });
  // };

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
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Shipping Details are Already Exist !",
        is_button_show: false,
      });
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
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Department Details are Already Exist !",
        is_button_show: false,
      });
    }
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
    //     msg: "Email id is not valid !",
    //     is_button_show: false,
    //   });
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
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Bank Details are Already Exist !",
        is_button_show: false,
      });
    }
    // } else {
    //   MyNotifications.fire({
    //     show: true,
    //     icon: "error",
    //     title: "Error",
    //     msg: "IFSC Code is not valid !",
    //     is_button_show: false,
    //   });
    // }
    // } else {
    //   MyNotifications.fire({
    //     show: true,
    //     icon: "error",
    //     title: "Error",
    //     msg: "Account No is not valid!",
    //     is_button_show: false,
    //   });
    // }
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
      <div>
        <div id="example-collapse-text" className="ledger-form-style p-0">
          <div className="main-div mb-2 m-0 px-2">
            {/* <h4 className="form-header">Create Ledger</h4> */}
            <Formik
              validateOnChange={false}
              innerRef={this.myRef}
              enableReinitialize={true}
              initialValues={initValue}
              validate={validate}
              onSubmit={(values, { resetForm }) => {
                MyNotifications.fire(
                  {
                    show: true,
                    icon: "confirm",
                    title: "Confirm",
                    msg: "Do you want to save",
                    is_button_show: false,
                    is_timeout: false,
                    handleSuccessFn: () => {
                      const formData = new FormData();
                      console.log("Values--------", values);
                      if (
                        values.underId &&
                        values.underId.under_prefix != null
                      ) {
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
                        if (values.supplier_code != null) {
                          formData.append(
                            "supplier_code",
                            values.supplier_code
                          );
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
                          formData.append(
                            "businessType",
                            values.tradeOfBusiness
                          );
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
                          values.licenseNo != null &&
                          values.licenseNo != ""
                        ) {
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
                        if (
                          values.countryId != "" &&
                          values.countryId != null
                        ) {
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
                          formData.append(
                            "creditNumBills",
                            values.credit_bills
                          );
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

                        if (values.salesrate != null) {
                          formData.append("salesrate", values.salesrate.value);
                        }
                        if (values.salesmanId != null) {
                          // formData.append("salesman", values.salesman);
                          formData.append("salesman", values.salesmanId.value);
                        }
                        if (values.areaId != null) {
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
                                v.dateofregistartion,
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

                        formData.append(
                          "gstdetails",
                          JSON.stringify(gstdetails)
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
                        formData.append(
                          "deptDetails",
                          JSON.stringify(deptDetails)
                        );
                      }

                      console.log("this.state ", this.state);
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
                          formData.append(
                            "supplier_code",
                            values.supplier_code
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
                        if (values.supplier_code != null) {
                          formData.append(
                            "supplier_code",
                            values.supplier_code
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

                        if (
                          values.countryId != "" &&
                          values.countryId != null
                        ) {
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
                          formData.append(
                            "businessType",
                            values.tradeOfBusiness
                          );
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
                          formData.append(
                            "creditNumBills",
                            values.credit_bills
                          );
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

                        if (
                          values.licenseNo != null &&
                          values.licenseNo != ""
                        ) {
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
                          // console.log("gst", JSON.stringify(gstList));

                          gstdetails = gstList.map((v, i) => {
                            let obj = {};
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

                        formData.append(
                          "gstdetails",
                          JSON.stringify(gstdetails)
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
                        formData.append(
                          "deptDetails",
                          JSON.stringify(deptDetails)
                        );
                        formData.append(
                          "bankDetails",
                          JSON.stringify(bankList)
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
                        formData.append(
                          "balancing_method",
                          values.opening_balancing_method.value
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

                        if (values.isTaxation.value == true) {
                          formData.append(
                            "gstin",
                            values.gstin && values.gstin != ""
                              ? values.gstin
                              : ""
                          );
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

                        if (
                          values.countryId != "" &&
                          values.countryId != null
                        ) {
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
                      formData.append("is_private", values.is_private.value);
                      formData.append("bankDetails", JSON.stringify(bankList));

                      for (let [name, value] of formData) {
                        console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                      }
                      createLedger(formData)
                        .then((response) => {
                          let res = response.data;
                          if (res.responseStatus == 200) {
                            MyNotifications.fire(
                              {
                                show: true,
                                icon: "success",
                                title: "Success",
                                msg: res.message,
                                is_timeout: true,
                                delay: 1000,
                              }

                              //eventBus.dispatch("page_change", "ledgerlist")
                            );

                            if (this.state.source != "") {
                              eventBus.dispatch("page_change", {
                                from: "ledgercreate",
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
                            resetForm();

                            this.setLedgerCode();
                          } else {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: response.message,
                              is_button_show: true,
                            });
                          }
                        })
                        .catch((error) => {});
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
                  {/* {JSON.stringify(values.underId)} */}
                  <Row
                    className="mx-0"
                    style={{
                      background: "#CEE7F1",
                      borderBottom: "1px solid #B1BFC5",
                    }}
                  >
                    <Row className="pt-3 pb-3">
                      <Col md={1}>
                        <Form.Label>
                          Ledger Name{" "}
                          {/* <span className="pt-1 pl-1 req_validation">*</span> */}
                        </Form.Label>
                      </Col>
                      <Col md={3}>
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
                            isValid={touched.ledger_name && !errors.ledger_name}
                            isInvalid={!!errors.ledger_name}
                          />
                          {/* <Form.Control.Feedback type="invalid">
                        {errors.ledger_name}
                      </Form.Control.Feedback> */}
                        </Form.Group>
                      </Col>

                      {values.underId &&
                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "sundry_creditors" && (
                          <>
                            <Col md={1}>
                              <Form.Label>Supplier Code </Form.Label>
                            </Col>
                            <Col md={1}>
                              <Form.Group>
                                <Form.Control
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
                                  isValid={
                                    touched.supplier_code &&
                                    !errors.supplier_code
                                  }
                                  isInvalid={!!errors.supplier_code}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.supplier_code}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </>
                        )}
                      {values.underId &&
                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "sundry_debtors" && (
                          <>
                            <Col md={1}>
                              <Form.Label>Supplier Code </Form.Label>
                            </Col>
                            <Col md={1}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Supplier Code"
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
                                <Form.Control.Feedback type="invalid">
                                  {errors.supplier_code}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </>
                        )}

                      <Col md={1}>
                        <Form.Label>
                          Under Group{" "}
                          {/* <span className="pt-1 pl-1 req_validation">
                            *
                          </span> */}
                        </Form.Label>
                      </Col>
                      <Col md={2}>
                        <Form.Group className="">
                          <Select
                            className="selectTo"
                            onChange={(v) => {
                              setFieldValue("underId", v);
                              if (v.sub_principle_id) {
                                if (v.sub_principle_id == 5) {
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
                            // styles={customStyles}
                            styles={ledger_select}
                            options={undervalue}
                            value={values.underId}
                            invalid={errors.underId ? true : false}
                            //styles={customStyles}
                          />
                          <p className="displaygroup pl-4 mb-0">
                            {/* {values.underId
                                ? values.underId.sub_principle_id
                                  ? values.underId.principle_name
                                  : ""
                                : ""} */}
                            {values.underId
                              ? values.underId.associates_id
                                ? values.underId.sub_principle_id
                                  ? values.underId.subprinciple_name
                                  : values.underId.principle_name
                                : values.underId.principle_name
                              : values.underId.principle_name}
                          </p>
                          <span className="text-danger">{errors.underId}</span>
                        </Form.Group>
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
                                <Col md={4} className="pe-0">
                                  <Form.Label>Balancing Method </Form.Label>
                                </Col>
                                <Col md={8}>
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
                            <Col lg={3} className="mt-3">
                              <Row
                                style={{ marginTop: "-13px" }}
                                className="mb-2"
                              >
                                <Col md={4} className="pe-0">
                                  <Form.Label>Balancing Method </Form.Label>
                                </Col>
                                <Col md={8}>
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
                      {/* </Row> */}
                      {/* <Row> */}
                      {/* <Col md="3"> */}
                      {/* <Row className="my-2"> */}
                      <Col md="1">
                        <Form.Label>
                          Opening Balance{" "}
                          {/* <span className="pt-1 pl-1 req_validation">*</span> */}
                        </Form.Label>
                      </Col>
                      <Col md="2">
                        <Form.Group className="">
                          <InputGroup className="jointdropdown">
                            <FormControl
                              placeholder=""
                              // aria-label="Opening Balance"
                              // aria-describedby="basic-addon2"
                              name="opening_balance"
                              onChange={handleChange}
                              className="text-box"
                              onKeyPress={(e) => {
                                OnlyEnterAmount(e);
                              }}
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
                            {errors.opening_balance && errors.opening_balance}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="1">
                        <Form.Select
                          as="select"
                          style={{ boxShadow: "none" }}
                          //styles={ledger_select}
                          onChange={(e) => {
                            setFieldValue(
                              "opening_balance_type",
                              e.target.value
                            );
                          }}
                          className="selectTo"
                          styles={ledger_select}
                          name="opening_balance_type"
                          // className="select-text-box"
                          value={values.opening_balance_type}
                        >
                          <option value="dr">Dr</option>
                          <option value="cr">Cr</option>
                        </Form.Select>
                      </Col>
                      {/* </Row> */}
                      {/* </Col> */}

                      {/* </Row> */}
                    </Row>
                  </Row>
                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "sundry_creditors" && (
                      <>
                        <div className=" form-style mt-2">
                          <Row className="mx-0">
                            <Col md={6} className="column-height">
                              <Row className="my-3">
                                <Col>
                                  <Form.Label className="Mail-title">
                                    Mailling Details :
                                  </Form.Label>
                                </Col>
                              </Row>
                              <Row className="mb-2">
                                <Col md={2}>
                                  <Form.Label>Mailing Name </Form.Label>
                                </Col>
                                <Col md={10}>
                                  <Form.Group>
                                    <Form.Control
                                      autoFocus="true"
                                      type="text"
                                      placeholder="Mailing Name"
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
                              <Row className="mb-2">
                                <Col md={2}>
                                  <Form.Label>Address </Form.Label>
                                </Col>
                                <Col md={10}>
                                  <Form.Group className="mt-1">
                                    <Form.Control
                                      style={{ height: "58px", resize: "none" }}
                                      as="textarea"
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

                              <Row className="mb-2">
                                {/* <Col lg={4}>
                                  <Row> */}
                                <Col lg={2}>
                                  <Form.Label>
                                    Country
                                    <span className="text-danger">*</span>{" "}
                                  </Form.Label>
                                </Col>
                                <Col lg={3}>
                                  <Form.Group className="">
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("countryId", v);
                                      }}
                                      name="countryId"
                                      styles={ledger_select}
                                      options={countryOpt}
                                      value={values.countryId}
                                      invalid={errors.countryId ? true : false}
                                    />
                                    <span className="text-danger">
                                      {errors.countryId}
                                    </span>
                                  </Form.Group>
                                </Col>
                                {/* </Row>
                                </Col> */}
                                <Col md="2"></Col>
                                <Col lg={1} md={1} className="pe-0">
                                  {/* <Row>
                                    <Col md={3}> */}
                                  <Form.Label>
                                    State
                                    <span className="text-danger">*</span>{" "}
                                  </Form.Label>
                                </Col>
                                <Col md={3}>
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
                                  {/* </Col>
                                  </Row> */}
                                </Col>
                              </Row>

                              <Row className="mb-2">
                                <Col lg={2} md={2} sm={2} xs={2}>
                                  <Form.Label>
                                    City <span className="text-danger">*</span>{" "}
                                  </Form.Label>
                                </Col>
                                <Col md={3}>
                                  <Form.Group className="">
                                    <Form.Control
                                      type="text"
                                      placeholder="City"
                                      name="city"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={values.city}
                                      isValid={touched.city && !errors.city}
                                      isInvalid={!!errors.city}
                                      onKeyPress={(e) => {
                                        OnlyAlphabets(e);
                                      }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.city}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="2"></Col>
                                <Col lg={1} md={2}>
                                  <Form.Label>Pincode </Form.Label>
                                </Col>
                                <Col md={3}>
                                  <Form.Group className="">
                                    <Form.Control
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
                              <Row className="mb-2 mt-3">
                                <Col md={2} className="for_padding">
                                  <Form.Label>Email ID</Form.Label>
                                </Col>
                                <Col md={5}>
                                  <Form.Group className="">
                                    <Form.Control
                                      type="text"
                                      placeholder="Email ID"
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
                                <Col
                                  md={1}
                                  className="for_padding for_padding_left"
                                >
                                  <Form.Label>Phone No. </Form.Label>
                                </Col>
                                <Col md={3}>
                                  <Form.Group className="">
                                    <Form.Control
                                      type="text"
                                      placeholder="Phone No."
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
                              </Row>
                              <Row className="mb-2">
                                <Col lg={2} className="pe-0">
                                  <Form.Label>Trade Of Business</Form.Label>
                                </Col>
                                <Col lg={5}>
                                  <Form.Group className="mt-1 d-flex">
                                    <Form.Check
                                      type="radio"
                                      label="Retailer"
                                      className="pr-3"
                                      id="Retailer"
                                      name="tradeOfBusiness"
                                      value="retailer"
                                      checked={
                                        values.tradeOfBusiness == "retailer"
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
                                        values.tradeOfBusiness == "manufacturer"
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
                                        values.tradeOfBusiness == "distributor"
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row className="mt-3">
                                <Col md={2} className="pe-0">
                                  <Form.Label>Nature Of Business</Form.Label>
                                </Col>
                                <Col lg={5}>
                                  <Form.Group className="">
                                    <Form.Control
                                      type="text"
                                      className="text-box"
                                      placeholder="Nature of business"
                                      name="natureOfBusiness"
                                      id="natureOfBusiness"
                                      onChange={handleChange}
                                      value={values.natureOfBusiness}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row className="mb-2">
                                {/* <Col lg={1}>
                                  <Form.Label>Place</Form.Label>
                                </Col>
                                <Col lg={2}>
                                  <Form.Group className="">
                                    <Form.Control
                                      type="email"
                                      placeholder="Business trade"
                                      name="email_id"
                                      className="text-box"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col lg={1}>
                                  <Form.Label>Route</Form.Label>
                                </Col>
                                <Col lg={2}>
                                  <Form.Group className="">
                                    <Form.Control
                                      type="email"
                                      placeholder="Business trade"
                                      name="email_id"
                                      className="text-box"
                                    />
                                  </Form.Group>
                                </Col> */}
                              </Row>

                              <hr />
                            </Col>
                            <Col
                              className="column-height"
                              md={6}
                              style={{
                                borderLeft:
                                  "1px solid rgba(211, 212, 214, 0.5)",
                              }}
                            >
                              {/* <Row className="my-3">
                                <Col>
                                  <Form.Label className="Mail-title">
                                    Address :
                                  </Form.Label>
                                </Col>
                              </Row> */}
                              <Row className="mt-2">
                                <Col>
                                  <Tabs
                                    defaultActiveKey="taxDetails"
                                    id="uncontrolled-tab-example"
                                    className="mb-2"
                                    style={{ background: "rgb(217, 240, 251)" }}

                                    // style={{ background: "#fff" }}
                                  >
                                    <Tab
                                      eventKey="taxDetails"
                                      title="Tax Details"
                                    >
                                      <Row className="mb-2">
                                        <Col>
                                          <Form.Label className="Mail-title">
                                            Tax Details :
                                          </Form.Label>
                                        </Col>
                                      </Row>
                                      <Row className="mb-2">
                                        <Col md={12}>
                                          <Row className="mb-2">
                                            <Col md={4}>
                                              <Row>
                                                <Col md={6}>
                                                  <Form.Label>
                                                    Tax Applicable{" "}
                                                  </Form.Label>{" "}
                                                </Col>
                                                <Col md={6}>
                                                  <Form.Group>
                                                    <Select
                                                      styles={ledger_select}
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
                                                      value={values.isTaxation}
                                                    />
                                                  </Form.Group>
                                                </Col>
                                              </Row>
                                            </Col>
                                            {values.isTaxation.value == true ? (
                                              <>
                                                <Row className="mb-1 mt-2">
                                                  {/* <Col lg={4}> */}
                                                  {/* <Row> */}
                                                  <Col
                                                    md={2}
                                                    className="me-1 pe-0"
                                                  >
                                                    <Form.Label>
                                                      Registration Type
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Form.Label>
                                                  </Col>
                                                  <Col lg={3}>
                                                    <Form.Group className="">
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
                                                        styles={ledger_select}
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
                                                  {/* </Row> */}
                                                  {/* </Col> */}

                                                  <Col
                                                    md={2}
                                                    className="me-2 pe-0"
                                                  >
                                                    {/* <Row>
                                                    <Col lg={6}> */}
                                                    <Form.Label className="lbl">
                                                      Registration Date
                                                    </Form.Label>
                                                  </Col>
                                                  <Col
                                                    lg={3}
                                                    // className="for_padding_left"
                                                  >
                                                    <Form.Group>
                                                      {/* <Col sm={6}> */}

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

                                                      {/* </Col> */}
                                                    </Form.Group>
                                                    {/* </Col>
                                                  </Row> */}
                                                  </Col>
                                                  {/* <Col md={4}></Col> */}
                                                </Row>
                                              </>
                                            ) : (
                                              <Col md={6}>
                                                <Row>
                                                  <Col md={4}>
                                                    <Form.Label>
                                                      Pan Card No.
                                                      {/* <span className="text-danger">
                                                        *
                                                      </span> */}
                                                    </Form.Label>
                                                  </Col>
                                                  <Col md={8}>
                                                    <Form.Group>
                                                      <Form.Control
                                                        type="text"
                                                        placeholder="Pan Card No."
                                                        name="pan_no"
                                                        className="text-box"
                                                        id="pan_no"
                                                        onChange={handleChange}
                                                        value={
                                                          values.pan_no &&
                                                          values.pan_no.toUpperCase()
                                                        }
                                                        isValid={
                                                          touched.pan_no &&
                                                          !errors.pan_no
                                                        }
                                                        isInvalid={
                                                          !!errors.pan_no
                                                        }
                                                        maxLength={10}
                                                        //readOnly
                                                      />
                                                      <Form.Control.Feedback type="invalid">
                                                        {errors.pan_no}
                                                      </Form.Control.Feedback>
                                                    </Form.Group>
                                                  </Col>
                                                </Row>
                                              </Col>
                                            )}
                                          </Row>

                                          {values.isTaxation.value == true && (
                                            <>
                                              <Row className="mb-2">
                                                <Col md={2}>
                                                  <Form.Label>
                                                    GSTIN
                                                    <span className="text-danger">
                                                      *
                                                    </span>
                                                  </Form.Label>
                                                </Col>
                                                <Col md={3}>
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
                                                        touched.gstin &&
                                                        !errors.gstin
                                                      }
                                                      isInvalid={!!errors.gstin}
                                                      onBlur={(e) => {
                                                        e.preventDefault();

                                                        if (
                                                          values.gstin != "" &&
                                                          values.gstin !=
                                                            undefined
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
                                                <Col lg={2}>
                                                  {/* <Row>
                                                    <Col lg={4}> */}
                                                  <Form.Label>
                                                    Pan Card No.
                                                  </Form.Label>
                                                </Col>
                                                <Col lg={3}>
                                                  <Form.Group>
                                                    <Form.Control
                                                      type="text"
                                                      readOnly
                                                      placeholder="Pan Card No."
                                                      name="pan_no"
                                                      className="text-box"
                                                      id="pan_no"
                                                      onChange={handleChange}
                                                      value={
                                                        values.pan_no &&
                                                        values.pan_no.toUpperCase()
                                                      }
                                                      isValid={
                                                        touched.pan_no &&
                                                        !errors.pan_no
                                                      }
                                                      isInvalid={
                                                        !!errors.pan_no
                                                      }
                                                      maxLength={10}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                      {errors.pan_no}
                                                    </Form.Control.Feedback>
                                                  </Form.Group>
                                                  {/* </Col>
                                                  </Row> */}
                                                </Col>

                                                <Col
                                                  md={2}
                                                  className="mainbtn_create "
                                                >
                                                  <Button
                                                    className="rowPlusBtn mx-auto"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      if (
                                                        values.gstin != "" &&
                                                        values.gstin != null
                                                      ) {
                                                        let gstObj = {
                                                          gstin:
                                                            values.gstin != null
                                                              ? values.gstin
                                                              : "",
                                                          dateofregistartion:
                                                            values.dateofregistartion !=
                                                            null
                                                              ? values.dateofregistartion
                                                              : "",
                                                          pan_no:
                                                            values.pan_no !=
                                                            null
                                                              ? values.pan_no
                                                              : "",
                                                          index:
                                                            values.index !==
                                                            undefined
                                                              ? values.index
                                                              : gstList.length,
                                                          // registraion_type:
                                                          //   values.registraion_type !=
                                                          //   null
                                                          //     ? values.registraion_type
                                                          //     : "",
                                                        };
                                                        this.addGSTRow(
                                                          gstObj,
                                                          setFieldValue
                                                        );
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg: "Please Enter GST Details ",
                                                          is_button_show: false,
                                                        });
                                                      }
                                                    }}
                                                  >
                                                    {/* <img
                                              src={Add}
                                              alt=""
                                              className="Add_icon_style"
                                            /> */}
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
                                                  {/* <Button
                                        className="create-btn me-0 successbtn-style"
                                        onClick={(e) => {
                                          console.log(
                                            "handle Fetch GST called"
                                          );
                                          e.preventDefault();
                                          this.clearDeptDetails(setFieldValue);
                                        }}
                                      >
                                        CLEAR
                                      </Button> */}
                                                </Col>
                                              </Row>
                                              <Row className="mt-3  m-0">
                                                <Col md={12}>
                                                  {gstList.length > 0 && (
                                                    <div className="add-row-tbl-style">
                                                      <Table
                                                        hover
                                                        size="sm"
                                                        style={{
                                                          fontSize: "13px",
                                                        }}
                                                        //responsive
                                                      >
                                                        <thead>
                                                          <tr>
                                                            <th>Sr.</th>
                                                            <th>GST No.</th>
                                                            <th>
                                                              Registration Date
                                                            </th>
                                                            <th>PAN No.</th>
                                                            <th className="text-center">
                                                              -
                                                            </th>
                                                          </tr>
                                                        </thead>
                                                        <tbody>
                                                          {gstList.map(
                                                            (v, i) => {
                                                              return (
                                                                <tr
                                                                  onDoubleClick={(
                                                                    e
                                                                  ) => {
                                                                    e.preventDefault();
                                                                    console.log(
                                                                      "sneha",
                                                                      i,
                                                                      "v",
                                                                      v
                                                                    );
                                                                    let gstObj =
                                                                      {
                                                                        id: v.id,

                                                                        gstin:
                                                                          v.gstin,
                                                                        dateofregistartion:
                                                                          v.dateofregistartion,

                                                                        pan_no:
                                                                          v.pan_no,
                                                                        index:
                                                                          v.index,
                                                                      };
                                                                    this.handleFetchGstData(
                                                                      gstObj,
                                                                      setFieldValue
                                                                    );
                                                                  }}
                                                                >
                                                                  <td>
                                                                    {i + 1}
                                                                  </td>
                                                                  <td>
                                                                    {v.gstin.toUpperCase()}
                                                                  </td>
                                                                  <td>
                                                                    {/* {v.dateofregistartion !=
                                                          ""
                                                            ? moment(
                                                                v.dateofregistartion
                                                              ).format(
                                                                "DD/MM/YYYY"
                                                              )
                                                            : "NA"} */}
                                                                    {
                                                                      v.dateofregistartion
                                                                    }
                                                                  </td>
                                                                  <td>
                                                                    {v.pan_no}
                                                                  </td>
                                                                  <td className="text-center">
                                                                    <Button
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
                                                                        this.removeGstRow(
                                                                          i
                                                                        );
                                                                      }}
                                                                    >
                                                                      {/* <FontAwesomeIcon
                                                              icon={faTrash}
                                                            /> */}
                                                                      <FontAwesomeIcon
                                                                        icon={
                                                                          faMinus
                                                                        }
                                                                        className="minus-color"
                                                                      />
                                                                    </Button>
                                                                  </td>
                                                                </tr>
                                                              );
                                                            }
                                                          )}
                                                        </tbody>
                                                      </Table>
                                                    </div>
                                                  )}
                                                </Col>
                                              </Row>
                                            </>
                                          )}
                                        </Col>
                                      </Row>
                                    </Tab>
                                    <Tab
                                      eventKey="departmentDetails"
                                      title="Department Details"
                                    >
                                      <Row className="mb-2">
                                        <Col>
                                          <Form.Label className="Mail-title">
                                            Department :
                                          </Form.Label>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col md={12}>
                                          <Row className="mb-2">
                                            <Col md={2} className="pe-0">
                                              <Form.Label>
                                                Department Name
                                              </Form.Label>
                                            </Col>
                                            <Col md={3}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  placeholder="Department Name"
                                                  name="dept"
                                                  className="text-box"
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
                                            <Col md={2}>
                                              <Form.Label>
                                                Contact Person
                                              </Form.Label>
                                            </Col>
                                            <Col md={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="textarea"
                                                  placeholder="Contact Person"
                                                  name="contact_person"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={values.contact_person}
                                                  onKeyPress={(e) => {
                                                    OnlyAlphabets(e);
                                                  }}
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
                                          <Row className="mb-2">
                                            <Col md={2}>
                                              <Form.Label>
                                                Contact No.
                                              </Form.Label>
                                            </Col>
                                            <Col md={3}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="textarea"
                                                  placeholder="Contact No."
                                                  name="contact_no"
                                                  className="text-box"
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
                                            <Col md={2}>
                                              <Form.Label>Email</Form.Label>
                                            </Col>
                                            <Col md={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="textarea"
                                                  placeholder="Email"
                                                  name="email"
                                                  className="text-box"
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
                                                        values.index !==
                                                        undefined
                                                          ? values.index
                                                          : deptList.length,
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
                                                {/* <img
                                          src={Add}
                                          alt=""
                                          className="Add_icon_style"
                                        /> */}
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
                                      {/* <Button
                                        className="create-btn me-0 successbtn-style"
                                        onClick={(e) => {
                                          console.log(
                                            "handle Fetch GST called"
                                          );
                                          e.preventDefault();
                                          this.clearDeptDetails(setFieldValue);
                                        }}
                                      >
                                        CLEAR
                                      </Button> 
                                    </Col>
                                  </Row> */}
                                          {deptList.length > 0 && (
                                            <Row className="mt-3 m-0">
                                              <Col md={12}>
                                                <div className="add-row-tbl-style">
                                                  <Table
                                                    // bordered
                                                    hover
                                                    size="sm"
                                                    style={{ fontSize: "13px" }}
                                                    //responsive
                                                  >
                                                    <thead>
                                                      <tr>
                                                        <th>Sr.</th>
                                                        <th>Dept. Name</th>
                                                        <th>Contact Person</th>
                                                        <th>Contact No.</th>
                                                        <th colSpan={2}>
                                                          Email
                                                        </th>
                                                        {/* <th className="text-center">-</th> */}
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      {deptList.map((v, i) => {
                                                        return (
                                                          <tr
                                                            onDoubleClick={(
                                                              e
                                                            ) => {
                                                              e.preventDefault();
                                                              console.log(
                                                                "sid",
                                                                i,
                                                                "v",
                                                                v
                                                              );

                                                              let deptObj = {
                                                                dept: v.dept,

                                                                contact_no:
                                                                  v.contact_no,

                                                                contact_person:
                                                                  v.contact_person,
                                                                email: v.email,
                                                                index: v.index,
                                                              };
                                                              this.handleFetchDepartmentData(
                                                                deptObj,
                                                                setFieldValue
                                                              );
                                                            }}
                                                          >
                                                            <td>{i + 1}</td>
                                                            <td>{v.dept}</td>
                                                            <td>
                                                              {v.contact_person}
                                                            </td>
                                                            <td>
                                                              {v.contact_no}
                                                            </td>
                                                            <td>{v.email}</td>
                                                            <td className="text-end">
                                                              <Button
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
                                                                  this.removeDeptRow(
                                                                    i
                                                                  );
                                                                }}
                                                              >
                                                                {/* <FontAwesomeIcon
                                                          icon={faTrash}
                                                        /> */}
                                                                <FontAwesomeIcon
                                                                  icon={faMinus}
                                                                  className="minus-color"
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
                                          )}
                                        </Col>
                                      </Row>
                                    </Tab>
                                    <Tab
                                      eventKey="bankDetails"
                                      title="Bank Details"
                                    >
                                      <Row className="mb-2">
                                        <Col>
                                          <Form.Label className="Mail-title">
                                            Bank Account :
                                          </Form.Label>
                                        </Col>
                                      </Row>
                                      <Row className="mb-5">
                                        <Col md={12}>
                                          <Row className="mb-2">
                                            <Col md={2}>
                                              <Form.Label>
                                                Bank Name{" "}
                                              </Form.Label>
                                            </Col>
                                            <Col md={3}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
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
                                            <Col md={2}>
                                              <Form.Label>
                                                Account Number{" "}
                                              </Form.Label>
                                            </Col>
                                            <Col md={4}>
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
                                          <Row className="mb-2">
                                            <Col md={2}>
                                              <Form.Label>
                                                IFSC Code{" "}
                                              </Form.Label>
                                            </Col>
                                            <Col md={3}>
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
                                                  isInvalid={
                                                    !!errors.bank_ifsc_code
                                                  }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.bank_ifsc_code}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                              <Form.Label>Branch </Form.Label>
                                            </Col>
                                            <Col md={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  placeholder="Branch"
                                                  name="bank_branch"
                                                  onKeyPress={(e) => {
                                                    OnlyAlphabets(e);
                                                  }}
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
                                                    values.bank_name != null
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
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Please Submit All Bank Details ",
                                                      is_button_show: false,
                                                    });
                                                  }
                                                }}
                                              >
                                                {/* <img
                                          src={Add}
                                          alt=""
                                          className="Add_icon_style"
                                        /> */}
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
                                                    style={{ fontSize: "13px" }}
                                                    //responsive
                                                  >
                                                    <thead>
                                                      <tr>
                                                        <th>Sr.</th>
                                                        <th>Bank Name</th>
                                                        <th>Account Number</th>
                                                        <th>IFSC Code</th>
                                                        <th colSpan={2}>
                                                          Branch
                                                        </th>
                                                        {/* <th className="text-center">-</th> */}
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      {bankList.map((v, i) => {
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
                                                              let bankObj = {
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
                                                                index: v.index,
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
                                                              {v.bank_ifsc_code}
                                                            </td>
                                                            <td>
                                                              {v.bank_branch}
                                                            </td>
                                                            <td className="text-end">
                                                              <Button
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
                                                                <FontAwesomeIcon
                                                                  icon={faMinus}
                                                                  className="minus-color"
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
                                          )}
                                        </Col>
                                      </Row>
                                    </Tab>
                                    <Tab
                                      eventKey="AdditionalDetails"
                                      title="Additional Details"
                                    >
                                      <Row>
                                        <Col lg={2}>
                                          <Form.Label>Date of Birth</Form.Label>
                                        </Col>
                                        <Col lg={2}>
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
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Birth Date cann't be greater than Current Date",
                                                      is_button_show: true,
                                                    });
                                                    setFieldValue("dob", "");
                                                  }
                                                } else {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Invalid Date",
                                                    is_button_show: true,
                                                  });
                                                  setFieldValue("dob", "");
                                                }
                                              } else {
                                                setFieldValue("dob", "");
                                              }
                                            }}
                                          />
                                        </Col>
                                        <Col
                                          lg={2}
                                          className="for_padding for_padding_left pe-0"
                                        >
                                          <Form.Label>
                                            Date of Anniversary
                                          </Form.Label>
                                        </Col>
                                        <Col lg={2}>
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
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Anniversary Date cann't be greater than Current Date",
                                                      is_button_show: true,
                                                    });
                                                    setFieldValue("doa", "");
                                                  }
                                                } else {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Invalid Date",
                                                    is_button_show: true,
                                                  });
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
                                  </Tabs>
                                </Col>
                              </Row>
                              <Row className="mt-2">
                                <Col>
                                  <Tabs
                                    defaultActiveKey="shipping1"
                                    id="uncontrolled-tab-example"
                                    className="mb-2"
                                    style={{ background: "rgb(217, 240, 251)" }}

                                    // style={{ background: "#fff" }}
                                  >
                                    <Tab eventKey="shipping1" title="Shipping">
                                      <Row className="mb-2">
                                        <Col md={2}>
                                          <Form.Label>District</Form.Label>
                                        </Col>
                                        <Col md={3}>
                                          <Form.Group>
                                            <Form.Control
                                              type="text"
                                              placeholder="District"
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
                                            />
                                            <Form.Control.Feedback type="invalid">
                                              {errors.district}
                                            </Form.Control.Feedback>
                                          </Form.Group>
                                        </Col>
                                        <Col md={2} className="pe-0">
                                          <Form.Label>
                                            Shipping Address
                                          </Form.Label>
                                        </Col>
                                        <Col md={4}>
                                          <Form.Group>
                                            <Form.Control
                                              type="textarea"
                                              placeholder="Shipping Address"
                                              name="shipping_address"
                                              className="text-box"
                                              onChange={handleChange}
                                              value={values.shipping_address}
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
                                        <Col lg={1}>
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
                                                values.shipping_address != "" &&
                                                values.shipping_address != null
                                              ) {
                                                let shipObj = {
                                                  district: values.district,
                                                  shipping_address:
                                                    values.shipping_address,
                                                  index:
                                                    values.index !== undefined
                                                      ? values.index
                                                      : shippingList.length,
                                                };
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
                                            {/* <img
                                              src={Add}
                                              alt=""
                                              className="Add_icon_style"
                                            /> */}
                                            <FontAwesomeIcon
                                              icon={faPlus}
                                              className="plus-color"
                                            />
                                          </Button>
                                        </Col>
                                      </Row>

                                      {shippingList.length > 0 && (
                                        <Row className="mt-3  m-0">
                                          <Col md={12}>
                                            <div className="add-row-tbl-style">
                                              <Table
                                                hover
                                                size="sm"
                                                style={{ fontSize: "13px" }}
                                              >
                                                <thead>
                                                  <tr>
                                                    <th>Sr.</th>
                                                    <th>District</th>
                                                    <th>Shipping Address</th>
                                                    <th className="text-center">
                                                      Action
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {shippingList.map((v, i) => {
                                                    return (
                                                      <tr
                                                        onDoubleClick={(e) => {
                                                          e.preventDefault();
                                                          console.log(
                                                            "sid",
                                                            i,
                                                            "v",
                                                            v
                                                          );

                                                          let shipObj = {
                                                            district:
                                                              v.district,
                                                            shipping_address:
                                                              v.shipping_address,
                                                            index: v.index,
                                                          };
                                                          this.handleFetchShippingData(
                                                            shipObj,
                                                            setFieldValue
                                                          );
                                                        }}
                                                      >
                                                        <td>{i + 1}</td>
                                                        <td>{v.district}</td>
                                                        <td>
                                                          {v.shipping_address}
                                                        </td>
                                                        <td className="text-center">
                                                          <Button
                                                            style={{
                                                              marginTop:
                                                                "-12px",
                                                            }}
                                                            className="rowMinusBtn"
                                                            variant=""
                                                            type="button"
                                                            onClick={(e) => {
                                                              e.preventDefault();
                                                              this.removeShippingRow(
                                                                i
                                                              );
                                                            }}
                                                          >
                                                            <FontAwesomeIcon
                                                              icon={faMinus}
                                                              className="minus-color"
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
                                      )}
                                    </Tab>
                                    {/* <Tab eventKey="billing1" title="Biling">
                                      <Row className="mb-2">
                                        <Col md={2}>
                                          <Form.Label>District</Form.Label>
                                        </Col>
                                        <Col md={3}>
                                          <Form.Group>
                                            <Form.Control
                                              type="text"
                                              placeholder="District"
                                              name="b_district"
                                              className="text-box"
                                              onChange={handleChange}
                                              value={values.b_district}
                                              isValid={
                                                touched.b_district &&
                                                !errors.b_district
                                              }
                                              isInvalid={!!errors.b_district}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                              {errors.b_district}
                                            </Form.Control.Feedback>
                                          </Form.Group>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Label>
                                            Billing Address
                                          </Form.Label>
                                        </Col>
                                        <Col md={4}>
                                          <Form.Group>
                                            <Form.Control
                                              type="textarea"
                                              placeholder="Billing Address"
                                              name="billing_address"
                                              className="text-box"
                                              onChange={handleChange}
                                              value={values.billing_address}
                                              isValid={
                                                touched.billing_address &&
                                                !errors.billing_address
                                              }
                                              isInvalid={
                                                !!errors.billing_address
                                              }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                              {errors.billing_address}
                                            </Form.Control.Feedback>
                                          </Form.Group>
                                        </Col>
                                        <Col lg={1}>
                                          <Button
                                            className="rowPlusBtn"
                                            onClick={(e) => {
                                              e.preventDefault();

                                              if (
                                                values.b_district != "" &&
                                                values.b_district != null &&
                                                values.billing_address != "" &&
                                                values.billing_address != null
                                              ) {
                                                let billAddObj = {
                                                  b_district: values.b_district,
                                                  billing_address:
                                                    values.billing_address,
                                                  index:
                                                    values.index !== undefined
                                                      ? values.index
                                                      : billingList.length,
                                                };
                                                this.addBillingRow(
                                                  billAddObj,
                                                  setFieldValue
                                                );
                                              } else {
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg: "Please Enter Billing Details ",
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
                                     
                                      {billingList.length > 0 && (
                                        <Row className="mt-3 m-0">
                                          <Col md={12}>
                                            <div className="">
                                              <Table
                                                
                                                hover
                                                size="sm"
                                                style={{ fontSize: "13px" }}
                                                
                                              >
                                                <thead>
                                                  <tr>
                                                    <th>Sr.</th>
                                                    <th>District</th>
                                                    <th colSpan={2}>
                                                      Billing Address
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {billingList.map((v, i) => {
                                                    return (
                                                      <tr
                                                        onDoubleClick={(e) => {
                                                          e.preventDefault();
                                                          console.log(
                                                            "sid",
                                                            i,
                                                            "v",
                                                            v
                                                          );

                                                          let billAddObj = {
                                                            b_district:
                                                              v.b_district,
                                                            billing_address:
                                                              v.billing_address,
                                                            index: v.index,
                                                          };
                                                          this.handleFetchBillingData(
                                                            billAddObj,
                                                            setFieldValue
                                                          );
                                                        }}
                                                      >
                                                        <td>{i + 1}</td>
                                                        <td>{v.b_district}</td>
                                                        <td>
                                                          {v.billing_address}
                                                        </td>
                                                        <td className="text-end">
                                                          <Button
                                                            style={{
                                                              marginTop:
                                                                "-12px",
                                                            }}
                                                            className="rowMinusBtn"
                                                            variant=""
                                                            type="button"
                                                            onClick={(e) => {
                                                              e.preventDefault();
                                                              this.removeBillingRow(
                                                                i
                                                              );
                                                            }}
                                                          >
                                                             
                                                            <FontAwesomeIcon
                                                              icon={faMinus}
                                                              className="minus-color"
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
                                      )}
                                    </Tab> */}
                                    <Tab
                                      eventKey="creditDays"
                                      title="Credit Days"
                                    >
                                      <Row className="mb-2">
                                        <Col md={2}>
                                          <Form.Label className="mb-2">
                                            Credit In Days{" "}
                                          </Form.Label>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Group className="mb-2">
                                            <Form.Control
                                              type="text"
                                              placeholder="Credit In Days"
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
                                        {/* <Col md={4}> */}
                                        {parseInt(values.credit_days) > 0 ? (
                                          <>
                                            <Col md={2}>
                                              <Form.Label className="mb-2">
                                                Applicable From
                                              </Form.Label>{" "}
                                            </Col>
                                            <Col md={6}>
                                              <Form.Group className="mb-2">
                                                <Select
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
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                        {/* </Col> */}
                                        {/* </Row>
                                      <Row className="mb-2"> */}
                                        <Col md={2}>
                                          <Form.Label>
                                            Credit In Bills{" "}
                                          </Form.Label>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Group className="">
                                            <Form.Control
                                              type="text"
                                              placeholder="Credit In Bills"
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
                                        {/* </Row>
                                      <Row className="mb-2"> */}
                                        <Col md={2}>
                                          <Form.Label>
                                            Credit In Values{" "}
                                          </Form.Label>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Group className="">
                                            <Form.Control
                                              type="text"
                                              placeholder="Credit In Value"
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
                                    </Tab>
                                    <Tab eventKey="licence" title="Licences">
                                      <Row className="mb-2">
                                        <Col lg={2}>
                                          <Form.Label>Licence No.</Form.Label>
                                        </Col>
                                        <Col lg={2}>
                                          <Form.Group className="">
                                            <Form.Control
                                              type="text"
                                              placeholder="Licence No"
                                              className="text-box"
                                              name="licenseNo"
                                              id="licenseNo"
                                              onChange={handleChange}
                                              value={values.licenseNo}
                                            />
                                          </Form.Group>
                                        </Col>
                                        <Col
                                          lg={2}
                                          className="for_padding for_padding_left pe-0"
                                        >
                                          <Form.Label>
                                            Licence Expiry Date
                                          </Form.Label>
                                        </Col>
                                        <Col lg={2}>
                                          <MyTextDatePicker
                                            // style={{ borderRadius: "0" }}
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
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "First input manufacturing date",
                                                      is_button_show: true,
                                                    });
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
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Expiry date exceding current date",
                                                        is_button_show: true,
                                                      });
                                                      setFieldValue(
                                                        "license_expiry",
                                                        ""
                                                      );
                                                      this.batchdpRef.current.focus();
                                                    }
                                                  }
                                                } else {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Invalid Date",
                                                    is_button_show: true,
                                                  });
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
                                        <Col md={2}>
                                          <Form.Label>FSSAI No. </Form.Label>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Group className="">
                                            <Form.Control
                                              type="text"
                                              placeholder="FSSAI No."
                                              name="fssai"
                                              id="fssai"
                                              className="text-box"
                                              onChange={handleChange}
                                              value={values.fssai}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                              {errors.fssai}
                                            </Form.Control.Feedback>
                                          </Form.Group>
                                        </Col>

                                        <Col md={2}>
                                          <Form.Label className="lbl">
                                            FSSAI Expiry
                                          </Form.Label>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Group>
                                            <MyTextDatePicker
                                              // style={{ borderRadius: "0" }}
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
                                                      // this.checkInvoiceDateIsBetweenFYFun(
                                                      //   e.target.value
                                                      // );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Expiry date exceding current date",
                                                        is_button_show: true,
                                                      });
                                                      setFieldValue(
                                                        "license_expiry",
                                                        ""
                                                      );
                                                      this.batchdpRef.current.focus();
                                                    }
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Invalid Date",
                                                      is_button_show: true,
                                                    });

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
                                          </Form.Group>
                                        </Col>
                                      </Row>

                                      <Row className="mt-2 mb-2">
                                        <Col md={2}>
                                          <Form.Label>
                                            Drug License No.{" "}
                                          </Form.Label>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Group className="">
                                            <Form.Control
                                              type="text"
                                              placeholder="Drug License No."
                                              name="drug_license_no"
                                              id="drug_license_no"
                                              onChange={handleChange}
                                              className="text-box"
                                              value={values.drug_license_no}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                              {errors.drug_license_no}
                                            </Form.Control.Feedback>
                                          </Form.Group>
                                        </Col>

                                        <Col md={2}>
                                          <Form.Label className="lbl">
                                            Drug Expiry
                                          </Form.Label>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Group className="">
                                            {/* <Col sm={6}> */}

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
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Expiry date exceding current date",
                                                        is_button_show: true,
                                                      });
                                                      setFieldValue(
                                                        "drug_expiry",
                                                        ""
                                                      );
                                                      this.batchdpRef.current.focus();
                                                    }
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Invalid Date",
                                                      is_button_show: true,
                                                    });

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
                                          </Form.Group>
                                        </Col>
                                      </Row>
                                      <Row className="">
                                        <Col lg={2}>
                                          <Form.Label>
                                            Mfg. Licence No.
                                          </Form.Label>
                                        </Col>
                                        <Col lg={2}>
                                          <Form.Group className="">
                                            <Form.Control
                                              type="text"
                                              placeholder="Mfg. Licence No"
                                              name="mfg_license_no"
                                              id="mfg_license_no"
                                              onChange={handleChange}
                                              className="text-box"
                                              value={values.mfg_license_no}
                                            />
                                          </Form.Group>
                                        </Col>
                                        <Col lg={2}>
                                          <Form.Label>
                                            Mfg. Expiry Date
                                          </Form.Label>
                                        </Col>
                                        <Col lg={2}>
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
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Expiry date exceding current date",
                                                      is_button_show: true,
                                                    });
                                                    setFieldValue(
                                                      "mfg_expiry",
                                                      ""
                                                    );
                                                    this.batchdpRef.current.focus();
                                                  }
                                                } else {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Invalid Date",
                                                    is_button_show: true,
                                                  });

                                                  setFieldValue(
                                                    "mfg_expiry",
                                                    ""
                                                  );
                                                }
                                              } else {
                                                setFieldValue("mfg_expiry", "");
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

                          <Row className="btm-button-row">
                            <Col md="12" className="text-end">
                              <Button className="submit-btn" type="submit">
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn mx-2 me-2"
                                type="button"
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
                                            from: "ledgercreate",
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
                        {/* </div> */}
                      </>
                    )}
                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "sundry_debtors" && (
                      <>
                        {/* sundry debetor form start  */}
                        <div className=" form-style p-0">
                          {/* <div className="mt-2"> */}
                          <Row className="mx-0">
                            <Col md={6} className="column-height">
                              <Row className="my-3">
                                <Col>
                                  <Form.Label className="Mail-title">
                                    Mailling Details :
                                  </Form.Label>
                                </Col>
                              </Row>
                              <Row className="mb-2">
                                <Col md={2}>
                                  <Form.Label>Mailing Name </Form.Label>
                                </Col>
                                <Col md={10}>
                                  <Form.Group>
                                    <Form.Control
                                      autoFocus="true"
                                      type="text"
                                      placeholder="Mailing Name"
                                      name="mailing_name"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={values.mailing_name}
                                      onKeyPress={(e) => {
                                        OnlyAlphabets(e);
                                      }}
                                      isValid={
                                        touched.mailing_name &&
                                        !errors.mailing_name
                                      }
                                      isInvalid={!!errors.mailing_name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.mailing_name}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row className="mb-2">
                                <Col md={2}>
                                  <Form.Label>Address</Form.Label>
                                </Col>
                                <Col md={10}>
                                  <Form.Group className="">
                                    <Form.Control
                                      style={{ height: "58px", resize: "none" }}
                                      as="textarea"
                                      placeholder="Address"
                                      name="address"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={values.address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.address}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row className="mb-2">
                                {/* <Col lg={4}>
                                  <Row> */}
                                <Col lg={2} md={2}>
                                  <Form.Label>
                                    Pincode{" "}
                                    <span className="text-danger">*</span>{" "}
                                  </Form.Label>
                                </Col>

                                <Col lg={3}>
                                  <Form.Group className="">
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("countryId", v);
                                      }}
                                      name="countryId"
                                      // styles={customStyles}
                                      styles={ledger_select}
                                      options={countryOpt}
                                      value={values.countryId}
                                      invalid={errors.countryId ? true : false}
                                    />
                                    <span className="text-danger">
                                      {errors.countryId}
                                    </span>
                                  </Form.Group>
                                  {/* </Col>
                                  </Row> */}
                                </Col>
                                <Col md="2"></Col>
                                <Col lg={1} md={1} className="pe-0">
                                  <Form.Label>
                                    State <span className="text-danger">*</span>
                                  </Form.Label>
                                </Col>
                                <Col lg={3}>
                                  <Form.Group className="">
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("stateId", v);
                                      }}
                                      name="stateId"
                                      // styles={customStyles}
                                      styles={ledger_select}
                                      options={stateOpt}
                                      value={values.stateId}
                                      invalid={errors.stateId ? true : false}
                                      //styles={customStyles}
                                    />
                                    <span className="text-danger">
                                      {errors.stateId}
                                    </span>
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row className="mb-2">
                                <Col lg={2} md={2} sm={2} xs={2}>
                                  <Form.Label>
                                    City <span className="text-danger">*</span>{" "}
                                  </Form.Label>
                                </Col>
                                <Col md={3}>
                                  <Form.Group className="">
                                    <Form.Control
                                      type="text"
                                      placeholder="City"
                                      name="city"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={values.city}
                                      isValid={touched.city && !errors.city}
                                      isInvalid={!!errors.city}
                                      onKeyPress={(e) => {
                                        OnlyAlphabets(e);
                                      }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.city}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="2"></Col>
                                <Col lg={1} md={2}>
                                  <Form.Label>Pincode </Form.Label>
                                </Col>
                                <Col lg={3}>
                                  <Form.Group className="">
                                    <Form.Control
                                      type="text"
                                      placeholder="Pincode"
                                      name="pincode"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={values.pincode}
                                      onBlur={(e) => {
                                        // e.target.value != null &&
                                        // e.target.value != ""
                                        //   ? this.getStateCityByPincode(
                                        //       e.target.value
                                        //     )
                                        //   : "";
                                        if (
                                          e.target.value != null &&
                                          e.target.value != ""
                                        ) {
                                          this.getStateCityByPincode(
                                            e.target.value,
                                            setFieldValue
                                          );
                                        }
                                      }}
                                      onKeyPress={(e) => {
                                        OnlyEnterNumbers(e);
                                      }}
                                      isValid={
                                        touched.pincode && !errors.pincode
                                      }
                                      isInvalid={!!errors.pincode}
                                      maxLength={6}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.pincode}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col lg={1}>
                                  <Form.Label>
                                    Area <span className="text-danger">*</span>
                                  </Form.Label>
                                </Col>
                                <Col lg={3}>
                                  <Form.Group className="">
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("countryId", v);
                                      }}
                                      name="countryId"
                                      // styles={customStyles}
                                      styles={ledger_select}
                                      options={countryOpt}
                                      value={values.countryId}
                                      invalid={errors.countryId ? true : false}
                                    />
                                    <span className="text-danger">
                                      {errors.countryId}
                                    </span>
                                  </Form.Group>
                                  {/* </Col>
                                  </Row> */}
                                </Col>
                              </Row>

                              <Row className="mb-2">
                                <Col lg={2} md={2} sm={2} xs={2}>
                                  <Form.Label>
                                    City <span className="text-danger">*</span>{" "}
                                  </Form.Label>
                                </Col>
                                <Col md={3}>
                                  <Form.Group className="">
                                    <Form.Control
                                      type="text"
                                      placeholder="City"
                                      name="city"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={values.city}
                                      isValid={touched.city && !errors.city}
                                      isInvalid={!!errors.city}
                                      onKeyPress={(e) => {
                                        OnlyAlphabets(e);
                                      }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.city}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col lg={1} md={2} className="pe-0">
                                  <Form.Label>
                                    State <span className="text-danger">*</span>
                                  </Form.Label>
                                </Col>
                                <Col lg={3}>
                                  <Form.Group className="">
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("stateId", v);
                                      }}
                                      name="stateId"
                                      // styles={customStyles}
                                      styles={ledger_select}
                                      options={stateOpt}
                                      value={values.stateId}
                                      invalid={errors.stateId ? true : false}
                                      //styles={customStyles}
                                    />
                                    <span className="text-danger">
                                      {errors.stateId}
                                    </span>
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row className="mb-2">
                                <Col lg={2}>
                                  <Form.Label>
                                    Country{" "}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                </Col>

                                <Col lg={3}>
                                  <Form.Group className="">
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("countryId", v);
                                      }}
                                      name="countryId"
                                      // styles={customStyles}
                                      styles={ledger_select}
                                      options={countryOpt}
                                      value={values.countryId}
                                      invalid={errors.countryId ? true : false}
                                    />
                                    <span className="text-danger">
                                      {errors.countryId}
                                    </span>
                                  </Form.Group>
                                  {/* </Col>
                                  </Row> */}
                                </Col>
                              </Row>

                              <Row className="mb-2">
                                <Col md={2} className="for_padding">
                                  <Form.Label>Email ID </Form.Label>
                                </Col>
                                <Col md={5}>
                                  <Form.Group className="">
                                    <Form.Control
                                      type="email"
                                      placeholder="Email ID"
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
                                <Col
                                  md={1}
                                  className="for_padding for_padding_left"
                                >
                                  <Form.Label>Phone No. </Form.Label>
                                </Col>
                                <Col md={3}>
                                  <Form.Group className="">
                                    <Form.Control
                                      type="text"
                                      placeholder="Phone No."
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
                                      {errors.phone_no && errors.phone_no}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row className="mb-2">
                                <Col lg={2}>
                                  <Form.Label>Salesman</Form.Label>
                                </Col>
                                <Col lg={5}>
                                  <Form.Group className="">
                                    {/* <Form.Control
                                      type="text"
                                      placeholder="salesman"
                                      name="salesman"
                                      className="text-box"
                                      onChange={handleChange}
                                      value={values.salesman}
                                    /> */}
                                    <Select
                                      className="selectTo"
                                      components={{
                                        IndicatorSeparator: () => null,
                                      }}
                                      // styles={purchaseSelect}
                                      ////isClearable={true}
                                      options={salesmanLst}
                                      name="salesmanId"
                                      id="salesmanId"
                                      onChange={(v) => {
                                        setFieldValue("salesmanId", v);
                                      }}
                                      value={values.salesmanId}
                                      styles={ledger_select}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col lg={1}>
                                  <Form.Label>Area</Form.Label>
                                </Col>
                                <Col lg={3}>
                                  <Form.Group className="">
                                    <Select
                                      className="selectTo"
                                      components={{
                                        IndicatorSeparator: () => null,
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

                              <Row className="mb-2">
                                <Col lg={2}>
                                  <Form.Label>Route</Form.Label>
                                </Col>
                                <Col lg={5}>
                                  <Form.Group className="">
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
                                {/* {appConfig.key == "is_multi_rate" && appConfig.value == true ? ( */}
                                {isUserControl(
                                  "is_multi_rates",
                                  this.props.userControl
                                ) ? (
                                  <Row className="mt-2">
                                    <Col md={2}>
                                      <Form.Label>
                                        Select Sales Rate
                                        {/* <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span> */}
                                      </Form.Label>{" "}
                                    </Col>
                                    <Col md={3} className="ps-3">
                                      <Form.Group>
                                        <Select
                                          className="selectTo"
                                          id="salesrate"
                                          onChange={(e) => {
                                            setFieldValue("salesrate", e);
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
                              </Row>
                              <Row className="mb-2">
                                <Col lg={2} className="pe-0">
                                  <Form.Label>Trade Of Business</Form.Label>
                                </Col>
                                <Col lg={4}>
                                  <Form.Group className="mt-1 d-flex">
                                    <Form.Check
                                      type="radio"
                                      label="Retailer"
                                      className="pr-3"
                                      id="Retailer"
                                      name="tradeOfBusiness"
                                      value="retailer"
                                      checked={
                                        values.tradeOfBusiness == "retailer"
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
                                        values.tradeOfBusiness == "manufacturer"
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
                                        values.tradeOfBusiness == "distributor"
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row className="mt-3">
                                <Col md={2} className="pe-0">
                                  <Form.Label>Nature Of Business</Form.Label>
                                </Col>
                                <Col md={5}>
                                  <Form.Group>
                                    <Form.Control
                                      className="text-box"
                                      type="text"
                                      placeholder="Nature of business"
                                      name="natureOfBusiness"
                                      id="natureOfBusiness"
                                      onChange={handleChange}
                                      value={values.natureOfBusiness}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row className="mt-2"></Row>
                              <hr />
                            </Col>

                            <Col
                              className="column-height"
                              md={6}
                              style={{
                                borderLeft:
                                  "1px solid rgba(211, 212, 214, 0.5)",
                              }}
                            >
                              {/* <Row className="my-3">
                                <Col>
                                  <Form.Label className="Mail-title">
                                    Address :
                                  </Form.Label>
                                </Col>
                              </Row> */}
                              <Row className="mt-2">
                                <Col>
                                  <Tabs
                                    defaultActiveKey="TaxDetails"
                                    id="uncontrolled-tab-example"
                                    className="mb-2"
                                    style={{ background: "rgb(217, 240, 251)" }}

                                    // style={{ background: "#fff" }}
                                  >
                                    <Tab
                                      eventKey="TaxDetails"
                                      title="Tax Details"
                                    >
                                      <Row>
                                        <Col>
                                          <Form.Label className="Mail-title">
                                            Tax Details :
                                          </Form.Label>
                                        </Col>
                                      </Row>
                                      <Row className="mt-2">
                                        <Col>
                                          <Row>
                                            <Col md={4}>
                                              <Row className="mb-2">
                                                <Col md={6}>
                                                  <Form.Label>
                                                    Tax Applicable{" "}
                                                    {/* <span className="pt-1 pl-1 req_validation">
                                              *
                                            </span> */}
                                                  </Form.Label>{" "}
                                                </Col>
                                                <Col md={6}>
                                                  <Form.Group>
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
                                                      styles={ledger_select}
                                                      value={values.isTaxation}
                                                    />
                                                  </Form.Group>
                                                </Col>
                                              </Row>
                                            </Col>
                                            {values.isTaxation.value == true ? (
                                              <>
                                                <Row className="mb-2">
                                                  {/* <Col md={5}>
                                                  <Row> */}
                                                  <Col md={2} className="pe-0">
                                                    <Form.Label>
                                                      Registration Type
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Form.Label>
                                                  </Col>
                                                  <Col md={3}>
                                                    <Form.Group className="">
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
                                                        styles={ledger_select}
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
                                                  {/* </Row>
                                                 </Col> */}
                                                  <Col md={2} className="pe-0">
                                                    {/* <Row>
                                                      <Col lg={5}> */}
                                                    <Form.Label className="lbl">
                                                      Registration Date
                                                    </Form.Label>
                                                  </Col>
                                                  <Col
                                                    lg={3}
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
                                                    {/* </Col>
                                                    </Row> */}
                                                  </Col>
                                                  {/* <Col md={8}>
                                          <Form.Group className="mb-2">
                                            <Col sm={4}>
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
                                          </Form.Group>
                                        </Col> */}
                                                  {/* <Col md={2}>

                                        </Col> */}
                                                  {/* <Col md={2}>
                                       
                                        </Col> */}
                                                </Row>
                                                <Row>
                                                  <Col md={2} className="pe-0">
                                                    <Form.Label>
                                                      GSTIN
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Form.Label>
                                                  </Col>
                                                  <Col md={3}>
                                                    <Form.Group>
                                                      <Form.Control
                                                        type="text"
                                                        placeholder="GSTIN"
                                                        name="gstin"
                                                        className="text-box"
                                                        maxLength={15}
                                                        onChange={handleChange}
                                                        value={
                                                          values.gstin &&
                                                          values.gstin.toUpperCase()
                                                        }
                                                        isValid={
                                                          touched.gstin &&
                                                          !errors.gstin
                                                        }
                                                        isInvalid={
                                                          !!errors.gstin
                                                        }
                                                        onBlur={(e) => {
                                                          e.preventDefault();

                                                          if (
                                                            values.gstin !=
                                                              "" &&
                                                            values.gstin !=
                                                              undefined
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

                                                          //  alert("Field Value" + values.gstin)
                                                        }}
                                                      />
                                                      <Form.Control.Feedback type="invalid">
                                                        {errors.gstin}
                                                      </Form.Control.Feedback>
                                                    </Form.Group>
                                                  </Col>
                                                  {/* <Col lg={5}>
                                                  <Row> */}
                                                  <Col lg={2}>
                                                    <Form.Label>
                                                      Pan Card No.
                                                    </Form.Label>
                                                  </Col>
                                                  <Col
                                                    lg={3}
                                                    className="for_padding_left"
                                                  >
                                                    <Form.Group>
                                                      <Form.Control
                                                        type="text"
                                                        readOnly
                                                        placeholder="Pan Card No."
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
                                                        isInvalid={
                                                          !!errors.pan_no
                                                        }
                                                        maxLength={10}
                                                      />
                                                      <Form.Control.Feedback type="invalid">
                                                        {errors.pan_no}
                                                      </Form.Control.Feedback>
                                                    </Form.Group>
                                                  </Col>
                                                  {/* </Row> */}
                                                  {/* </Col> */}

                                                  <Col
                                                    md={2}
                                                    className="text-end p-0 d-flex"
                                                  >
                                                    <Button
                                                      className="rowPlusBtn mx-auto"
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        if (
                                                          values.gstin != "" &&
                                                          values.gstin != null
                                                        ) {
                                                          let gstObj = {
                                                            gstin:
                                                              values.gstin !=
                                                              null
                                                                ? values.gstin
                                                                : "",
                                                            dateofregistartion:
                                                              values.dateofregistartion !=
                                                              null
                                                                ? values.dateofregistartion
                                                                : "",
                                                            pan_no:
                                                              values.pan_no !=
                                                              null
                                                                ? values.pan_no
                                                                : "",
                                                            index:
                                                              values.index !==
                                                              undefined
                                                                ? values.index
                                                                : gstList.length,
                                                          };
                                                          this.addGSTRow(
                                                            gstObj,
                                                            setFieldValue
                                                          );
                                                        } else {
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg: "Please Enter GST Details ",
                                                            is_button_show: false,
                                                          });
                                                        }
                                                      }}
                                                    >
                                                      {/* <img
                                              src={Add}
                                              alt=""
                                              className="Add_icon_style"
                                            /> */}
                                                      <FontAwesomeIcon
                                                        icon={faPlus}
                                                        className="plus-color"
                                                      />
                                                    </Button>
                                                    {/* <Button
                                            className="create-btn me-0 successbtn-style me-3"
                                            onClick={(e) => {
                                              console.log(
                                                "handle Fetch GST called"
                                              );
                                              e.preventDefault();
                                              this.clearGSTData(setFieldValue);
                                            }}
                                          >
                                            CLEAR
                                          </Button> */}
                                                  </Col>
                                                </Row>
                                                <Row className="mt-4 mb-4 m-0">
                                                  <Col md={12}>
                                                    <Form.Control
                                                      type="text"
                                                      placeholder="index"
                                                      name="index"
                                                      className="text-box"
                                                      onChange={handleChange}
                                                      hidden
                                                      value={values.index}
                                                    />
                                                    {gstList.length > 0 && (
                                                      <div className="add-row-tbl-style">
                                                        <Table
                                                          // bordered
                                                          hover
                                                          size="sm"
                                                          className=""
                                                          //responsive
                                                          style={{
                                                            fontSize: "13px",
                                                          }}
                                                        >
                                                          <thead>
                                                            <tr>
                                                              <th>Sr.</th>
                                                              <th>GST No.</th>
                                                              <th>
                                                                Registration
                                                                Date
                                                              </th>
                                                              <th>PAN No.</th>
                                                              <th className="text-center">
                                                                Action
                                                              </th>
                                                            </tr>
                                                          </thead>
                                                          <tbody>
                                                            {gstList.map(
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
                                                                      let gstObj =
                                                                        {
                                                                          id: v.id,

                                                                          gstin:
                                                                            v.gstin,
                                                                          dateofregistartion:
                                                                            v.dateofregistartion,
                                                                          pan_no:
                                                                            v.pan_no,
                                                                          index:
                                                                            v.index,
                                                                        };
                                                                      this.handleFetchGstData(
                                                                        gstObj,
                                                                        setFieldValue
                                                                      );
                                                                    }}
                                                                  >
                                                                    <td>
                                                                      {i + 1}
                                                                    </td>
                                                                    <td>
                                                                      {v.gstin}
                                                                    </td>
                                                                    <td>
                                                                      {
                                                                        v.dateofregistartion
                                                                      }
                                                                    </td>
                                                                    <td>
                                                                      {v.pan_no}
                                                                    </td>
                                                                    <td className="text-center">
                                                                      <Button
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
                                                                          this.removeGstRow(
                                                                            i
                                                                          );
                                                                        }}
                                                                      >
                                                                        {/* <FontAwesomeIcon
                                                              icon={faTrash}
                                                            /> */}
                                                                        <FontAwesomeIcon
                                                                          icon={
                                                                            faMinus
                                                                          }
                                                                          className="minus-color"
                                                                        />
                                                                      </Button>
                                                                    </td>
                                                                  </tr>
                                                                );
                                                              }
                                                            )}
                                                          </tbody>
                                                        </Table>
                                                      </div>
                                                    )}
                                                  </Col>
                                                </Row>
                                              </>
                                            ) : (
                                              <Col md={6}>
                                                <Row>
                                                  <Col md={4}>
                                                    <Form.Label>
                                                      Pan Card No.
                                                      {/* <span className="text-danger">
                                                        *
                                                      </span> */}
                                                    </Form.Label>
                                                  </Col>
                                                  <Col md={8}>
                                                    <Form.Group>
                                                      <Form.Control
                                                        type="text"
                                                        placeholder="Pan Card No."
                                                        id="pan_no"
                                                        name="pan_no"
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
                                                        isInvalid={
                                                          !!errors.pan_no
                                                        }
                                                        maxLength={10}
                                                      />
                                                      <Form.Control.Feedback type="invalid">
                                                        {errors.pan_no}
                                                      </Form.Control.Feedback>
                                                    </Form.Group>
                                                  </Col>
                                                </Row>
                                              </Col>
                                            )}
                                          </Row>

                                          {values.isTaxation.value == true && (
                                            <>
                                              <Row>
                                                <Col md={2} className="pe-0">
                                                  <Form.Label>
                                                    GSTIN
                                                    <span className="text-danger">
                                                      *
                                                    </span>
                                                  </Form.Label>
                                                </Col>
                                                <Col md={3}>
                                                  <Form.Group>
                                                    <Form.Control
                                                      type="text"
                                                      placeholder="GSTIN"
                                                      name="gstin"
                                                      className="text-box"
                                                      maxLength={15}
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
                                                          values.gstin !=
                                                            undefined
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

                                                        //  alert("Field Value" + values.gstin)
                                                      }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                      {errors.gstin}
                                                    </Form.Control.Feedback>
                                                  </Form.Group>
                                                </Col>
                                                {/* <Col lg={5}>
                                                  <Row> */}
                                                <Col lg={2}>
                                                  <Form.Label>
                                                    Pan Card No.
                                                  </Form.Label>
                                                </Col>
                                                <Col
                                                  lg={3}
                                                  className="for_padding_left"
                                                >
                                                  <Form.Group>
                                                    <Form.Control
                                                      type="text"
                                                      readOnly
                                                      placeholder="Pan Card No."
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
                                                      isInvalid={
                                                        !!errors.pan_no
                                                      }
                                                      maxLength={10}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                      {errors.pan_no}
                                                    </Form.Control.Feedback>
                                                  </Form.Group>
                                                </Col>
                                                {/* </Row> */}
                                                {/* </Col> */}

                                                <Col
                                                  md={2}
                                                  className="text-end p-0 d-flex"
                                                >
                                                  <Button
                                                    className="rowPlusBtn mx-auto"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      if (
                                                        values.gstin != "" &&
                                                        values.gstin != null
                                                      ) {
                                                        let gstObj = {
                                                          gstin:
                                                            values.gstin != null
                                                              ? values.gstin
                                                              : "",
                                                          dateofregistartion:
                                                            values.dateofregistartion !=
                                                            null
                                                              ? values.dateofregistartion
                                                              : "",
                                                          pan_no:
                                                            values.pan_no !=
                                                            null
                                                              ? values.pan_no
                                                              : "",
                                                          index:
                                                            values.index !==
                                                            undefined
                                                              ? values.index
                                                              : gstList.length,
                                                        };
                                                        this.addGSTRow(
                                                          gstObj,
                                                          setFieldValue
                                                        );
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg: "Please Enter GST Details ",
                                                          is_button_show: false,
                                                        });
                                                      }
                                                    }}
                                                  >
                                                    {/* <img
                                              src={Add}
                                              alt=""
                                              className="Add_icon_style"
                                            /> */}
                                                    <FontAwesomeIcon
                                                      icon={faPlus}
                                                      className="plus-color"
                                                    />
                                                  </Button>
                                                  {/* <Button
                                            className="create-btn me-0 successbtn-style me-3"
                                            onClick={(e) => {
                                              console.log(
                                                "handle Fetch GST called"
                                              );
                                              e.preventDefault();
                                              this.clearGSTData(setFieldValue);
                                            }}
                                          >
                                            CLEAR
                                          </Button> */}
                                                </Col>
                                              </Row>
                                              <Row className="mt-4 mb-4 m-0">
                                                <Col md={12}>
                                                  <Form.Control
                                                    type="text"
                                                    placeholder="index"
                                                    name="index"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    hidden
                                                    value={values.index}
                                                  />
                                                  {gstList.length > 0 && (
                                                    <div className="add-row-tbl-style">
                                                      <Table
                                                        // bordered
                                                        hover
                                                        size="sm"
                                                        className=""
                                                        //responsive
                                                        style={{
                                                          fontSize: "13px",
                                                        }}
                                                      >
                                                        <thead>
                                                          <tr>
                                                            <th>Sr.</th>
                                                            <th>GST No.</th>
                                                            <th>
                                                              Registration Date
                                                            </th>
                                                            <th>PAN No.</th>
                                                            <th className="text-center">
                                                              Action
                                                            </th>
                                                          </tr>
                                                        </thead>
                                                        <tbody>
                                                          {gstList.map(
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
                                                                    let gstObj =
                                                                      {
                                                                        id: v.id,

                                                                        gstin:
                                                                          v.gstin,
                                                                        dateofregistartion:
                                                                          v.dateofregistartion,
                                                                        pan_no:
                                                                          v.pan_no,
                                                                        index:
                                                                          v.index,
                                                                      };
                                                                    this.handleFetchGstData(
                                                                      gstObj,
                                                                      setFieldValue
                                                                    );
                                                                  }}
                                                                >
                                                                  <td>
                                                                    {i + 1}
                                                                  </td>
                                                                  <td>
                                                                    {v.gstin}
                                                                  </td>
                                                                  <td>
                                                                    {
                                                                      v.dateofregistartion
                                                                    }
                                                                  </td>
                                                                  <td>
                                                                    {v.pan_no}
                                                                  </td>
                                                                  <td className="text-center">
                                                                    <Button
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
                                                                        this.removeGstRow(
                                                                          i
                                                                        );
                                                                      }}
                                                                    >
                                                                      {/* <FontAwesomeIcon
                                                              icon={faTrash}
                                                            /> */}
                                                                      <FontAwesomeIcon
                                                                        icon={
                                                                          faMinus
                                                                        }
                                                                        className="minus-color"
                                                                      />
                                                                    </Button>
                                                                  </td>
                                                                </tr>
                                                              );
                                                            }
                                                          )}
                                                        </tbody>
                                                      </Table>
                                                    </div>
                                                  )}
                                                </Col>
                                              </Row>
                                            </>
                                          )}
                                        </Col>
                                      </Row>
                                    </Tab>
                                    <Tab
                                      eventKey="DepartmentDetails"
                                      title="Department Details"
                                    >
                                      <Row>
                                        <Col>
                                          <Form.Label className="Mail-title">
                                            Department :
                                          </Form.Label>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col md={12}>
                                          <Row className="mt-2 mb-2">
                                            <Col md={2} className="pe-0">
                                              <Form.Label>
                                                Department Name
                                              </Form.Label>
                                            </Col>
                                            <Col md={3}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  placeholder="Department Name"
                                                  name="dept"
                                                  className="text-box"
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
                                            <Col md={2}>
                                              <Form.Label>
                                                Contact Person
                                              </Form.Label>
                                            </Col>
                                            <Col md={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="textarea"
                                                  className="text-box"
                                                  placeholder="Contact Person"
                                                  name="contact_person"
                                                  onChange={handleChange}
                                                  value={values.contact_person}
                                                  onKeyPress={(e) => {
                                                    OnlyAlphabets(e);
                                                  }}
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
                                          <Row className="mb-2">
                                            <Col md={2}>
                                              <Form.Label>
                                                Contact No.
                                              </Form.Label>
                                            </Col>
                                            <Col md={3}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="textarea"
                                                  placeholder="Contact No."
                                                  name="contact_no"
                                                  className="text-box"
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
                                            <Col md={2}>
                                              <Form.Label>
                                                Email.....
                                              </Form.Label>
                                            </Col>
                                            <Col md={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="email"
                                                  placeholder="Email"
                                                  name="email"
                                                  className="text-box"
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
                                                        values.index !==
                                                        undefined
                                                          ? values.index
                                                          : deptList.length,
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
                                                {/* <img
                                          src={Add}
                                          alt=""
                                          className="Add_icon_style"
                                        /> */}
                                                <FontAwesomeIcon
                                                  icon={faPlus}
                                                  className="plus-color"
                                                />
                                              </Button>
                                            </Col>
                                          </Row>
                                          <Row className="mb-2">
                                            {/* <Col md="3">
                                      <Button
                                        className="create-btn me-0 successbtn-style"
                                        onClick={(e) => {
                                          console.log(
                                            "handle Fetch GST called"
                                          );
                                          e.preventDefault();
                                          this.clearDeptDetails(setFieldValue);
                                        }}
                                      >
                                        CLEAR
                                      </Button>
                                    </Col> */}
                                          </Row>
                                          <Row className="mt-4 m-0 mb-2">
                                            <Col>
                                              {deptList.length > 0 && (
                                                <div className="add-row-tbl-style">
                                                  <Table
                                                    hover
                                                    size="sm"
                                                    style={{ fontSize: "13px" }}
                                                    //responsive
                                                  >
                                                    <thead>
                                                      <tr>
                                                        <th>Sr.</th>
                                                        <th>Dept. Name</th>
                                                        <th>Contact Person</th>
                                                        <th>Contact No.</th>
                                                        <th colSpan={2}>
                                                          Email
                                                        </th>
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      {deptList.map((v, i) => {
                                                        return (
                                                          <tr
                                                            onDoubleClick={(
                                                              e
                                                            ) => {
                                                              e.preventDefault();
                                                              console.log(
                                                                "sneha",
                                                                i,
                                                                "v",
                                                                v
                                                              );

                                                              let deptObj = {
                                                                dept: v.dept,

                                                                contact_no:
                                                                  v.contact_no,

                                                                contact_person:
                                                                  v.contact_person,
                                                                email: v.email,
                                                                index: v.index,
                                                              };
                                                              this.handleFetchDepartmentData(
                                                                deptObj,
                                                                setFieldValue
                                                              );
                                                            }}
                                                          >
                                                            <td>{i + 1}</td>
                                                            <td>{v.dept}</td>
                                                            <td>
                                                              {v.contact_person}
                                                            </td>
                                                            <td>
                                                              {v.contact_no}
                                                            </td>
                                                            <td>{v.email}</td>
                                                            <td className="text-end">
                                                              <Button
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
                                                                  this.removeDeptRow(
                                                                    i
                                                                  );
                                                                }}
                                                              >
                                                                {/* <FontAwesomeIcon
                                                          icon={faTrash}
                                                        /> */}
                                                                <FontAwesomeIcon
                                                                  icon={faMinus}
                                                                  className="minus-color"
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
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Tab>
                                    <Tab
                                      eventKey="AdditionalDetails"
                                      title="Additional Details"
                                    >
                                      <Row>
                                        <Col lg={2}>
                                          <Form.Label>Date of Birth</Form.Label>
                                        </Col>
                                        <Col lg={2}>
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
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Birth Date cann't be greater than Current Date",
                                                      is_button_show: true,
                                                    });
                                                    setFieldValue("dob", "");
                                                  }
                                                } else {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Invalid Date",
                                                    is_button_show: true,
                                                  });
                                                  setFieldValue("dob", "");
                                                }
                                              } else {
                                                setFieldValue("dob", "");
                                              }
                                            }}
                                          />
                                        </Col>

                                        <Col
                                          lg={2}
                                          className="for_padding for_padding_left pe-0"
                                        >
                                          <Form.Label>
                                            Date of Anniversary
                                          </Form.Label>
                                        </Col>
                                        <Col lg={2}>
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
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Anniversary Date cann't be greater than Current Date",
                                                      is_button_show: true,
                                                    });
                                                    setFieldValue("doa", "");
                                                  }
                                                } else {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Invalid Date",
                                                    is_button_show: true,
                                                  });
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
                                  </Tabs>
                                </Col>
                              </Row>
                              <Row className="mt-2">
                                <Col>
                                  <Tabs
                                    defaultActiveKey="shipping"
                                    id="uncontrolled-tab-example"
                                    className="mb-2"
                                    style={{ background: "rgb(217 240 251)" }}

                                    // style={{ background: "#fff" }}
                                  >
                                    <Tab eventKey="shipping" title="Shipping">
                                      <Row className="mb-2">
                                        <Col md={2}>
                                          <Form.Label>District</Form.Label>
                                        </Col>
                                        <Col md={3}>
                                          <Form.Group>
                                            <Form.Control
                                              type="text"
                                              placeholder="District"
                                              name="district"
                                              className="text-box"
                                              onChange={handleChange}
                                              value={values.district}
                                              isValid={
                                                touched.district &&
                                                !errors.district
                                              }
                                              onKeyPress={(e) => {
                                                OnlyAlphabets(e);
                                              }}
                                              isInvalid={!!errors.district}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                              {errors.district}
                                            </Form.Control.Feedback>
                                          </Form.Group>
                                        </Col>
                                        <Col md={2} className="pe-0">
                                          <Form.Label>
                                            Shipping Address
                                          </Form.Label>
                                        </Col>
                                        <Col md={4}>
                                          <Form.Group>
                                            <Form.Control
                                              type="textarea"
                                              placeholder="Shipping Address"
                                              name="shipping_address"
                                              className="text-box"
                                              onChange={handleChange}
                                              value={values.shipping_address}
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
                                        <Col lg={1}>
                                          <Button
                                            className="rowPlusBtn mx-auto"
                                            onClick={(e) => {
                                              e.preventDefault();

                                              if (
                                                values.district != "" &&
                                                values.district != null &&
                                                values.shipping_address != "" &&
                                                values.shipping_address != null
                                              ) {
                                                let shipObj = {
                                                  district: values.district,
                                                  shipping_address:
                                                    values.shipping_address,
                                                  index:
                                                    values.index !== undefined
                                                      ? values.index
                                                      : shippingList.length,
                                                };
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
                                            {/* <img
                                              src={Add}
                                              alt=""
                                              className="Add_icon_style"
                                            /> */}
                                            <FontAwesomeIcon
                                              icon={faPlus}
                                              className="plus-color"
                                            />
                                          </Button>
                                        </Col>
                                      </Row>
                                      <Row className="mb-2">
                                        {/* <Col md="4" className="">
                                          <Button
                                            className="create-btn me-0 successbtn-style"
                                            onClick={(e) => {
                                              console.log(
                                                "handle Fetch Shipbill called"
                                              );
                                              e.preventDefault();
                                              this.clearShippingBillingData(
                                                setFieldValue
                                              );
                                            }}
                                          >
                                            CLEAR
                                          </Button>
                                        </Col> */}
                                      </Row>
                                      {shippingList.length > 0 && (
                                        <Row className="mt-3  m-0">
                                          <Col md={12}>
                                            <div className="add-row-tbl-style">
                                              <Table
                                                hover
                                                size="sm"
                                                style={{ fontSize: "13px" }}
                                              >
                                                <thead>
                                                  <tr>
                                                    <th>Sr.</th>
                                                    <th>District</th>
                                                    <th>Shipping Address</th>
                                                    <th className="text-center">
                                                      Action
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {shippingList.map((v, i) => {
                                                    return (
                                                      <tr
                                                        onDoubleClick={(e) => {
                                                          e.preventDefault();
                                                          console.log(
                                                            "sid",
                                                            i,
                                                            "v",
                                                            v
                                                          );

                                                          let shipObj = {
                                                            district:
                                                              v.district,
                                                            shipping_address:
                                                              v.shipping_address,
                                                            index: v.index,
                                                          };
                                                          this.handleFetchShippingData(
                                                            shipObj,
                                                            setFieldValue
                                                          );
                                                        }}
                                                      >
                                                        <td>{i + 1}</td>
                                                        <td>{v.district}</td>
                                                        <td>
                                                          {v.shipping_address}
                                                        </td>
                                                        <td className="text-center">
                                                          <Button
                                                            style={{
                                                              marginTop:
                                                                "-12px",
                                                            }}
                                                            className="rowMinusBtn"
                                                            variant=""
                                                            type="button"
                                                            onClick={(e) => {
                                                              e.preventDefault();
                                                              this.removeShippingRow(
                                                                i
                                                              );
                                                            }}
                                                          >
                                                            {/* <FontAwesomeIcon
                                                              icon={faTrash}
                                                            /> */}
                                                            <FontAwesomeIcon
                                                              icon={faMinus}
                                                              className="minus-color"
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
                                      )}
                                    </Tab>
                                    <Tab
                                      eventKey="CreditDays"
                                      title="Credit Days"
                                    >
                                      <Row className="mb-2">
                                        <Col md={2}>
                                          <Form.Label className="mb-2">
                                            Credit In Days{" "}
                                          </Form.Label>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Group className="mb-2">
                                            <Form.Control
                                              type="text"
                                              placeholder="Credit In Days"
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
                                        {/* <Col md={5}> */}
                                        {parseInt(values.credit_days) > 0 ? (
                                          <>
                                            <Col md={2}>
                                              <Form.Label className="mb-2">
                                                Applicable From
                                              </Form.Label>{" "}
                                            </Col>
                                            <Col md={6}>
                                              <Form.Group className="mb-2">
                                                <Select
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
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                        {/* </Col> */}
                                        {/* </Row>
                                       <Row className="mb-2"> */}
                                        <Col md={2}>
                                          <Form.Label>
                                            Credit In Bills{" "}
                                          </Form.Label>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Group className="">
                                            <Form.Control
                                              type="text"
                                              placeholder="Credit In Bills"
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
                                        {/* </Row>
                                       <Row className="mb-2"> */}
                                        <Col md={2}>
                                          <Form.Label>
                                            Credit In Values{" "}
                                          </Form.Label>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Group className="">
                                            <Form.Control
                                              type="text"
                                              placeholder="Credit In Value"
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
                                    </Tab>
                                    <Tab eventKey="Licences" title="Licences">
                                      <Row className="mb-2">
                                        <Col lg={2}>
                                          <Form.Label>Licence No.</Form.Label>
                                        </Col>
                                        <Col lg={2}>
                                          <Form.Group className="">
                                            <Form.Control
                                              type="text"
                                              placeholder="Licence No"
                                              className="text-box"
                                              name="licenseNo"
                                              id="licenseNo"
                                              onChange={handleChange}
                                              value={values.licenseNo}
                                            />
                                          </Form.Group>
                                        </Col>
                                        <Col
                                          lg={2}
                                          className="for_padding for_padding_left pe-0"
                                        >
                                          <Form.Label>
                                            Licence Expiry Date
                                          </Form.Label>
                                        </Col>
                                        <Col lg={2}>
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
                                                  let mfgDate = new Date();
                                                  if (
                                                    mfgDate == "" ||
                                                    mfgDate == null ||
                                                    mfgDate == "Invalid Date"
                                                  ) {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "First input manufacturing date",
                                                      is_button_show: true,
                                                    });
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
                                                    if (expDate >= mfgDate) {
                                                      setFieldValue(
                                                        "license_expiry",
                                                        e.target.value
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Expiry date exceding current date",
                                                        is_button_show: true,
                                                      });
                                                      setFieldValue(
                                                        "license_expiry",
                                                        ""
                                                      );
                                                      this.batchdpRef.current.focus();
                                                    }
                                                  }
                                                } else {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Invalid Date",
                                                    is_button_show: true,
                                                  });

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
                                        <Col md={2}>
                                          <Form.Label>FSSAI No. </Form.Label>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Group className="">
                                            <Form.Control
                                              type="text"
                                              placeholder="FSSAI No."
                                              name="fssai"
                                              id="fssai"
                                              className="text-box"
                                              onChange={handleChange}
                                              value={values.fssai}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                              {errors.fssai}
                                            </Form.Control.Feedback>
                                          </Form.Group>
                                        </Col>

                                        <Col md={2}>
                                          <Form.Label className="lbl">
                                            FSSAI Expiry
                                          </Form.Label>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Group>
                                            <MyTextDatePicker
                                              // style={{ borderRadius: "0" }}
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
                                                      // this.checkInvoiceDateIsBetweenFYFun(
                                                      //   e.target.value
                                                      // );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Expiry date exceding current date",
                                                        is_button_show: true,
                                                      });
                                                      setFieldValue(
                                                        "fssai_expiry",
                                                        ""
                                                      );
                                                      this.batchdpRef.current.focus();
                                                    }
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Invalid Date",
                                                      is_button_show: true,
                                                    });

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
                                          </Form.Group>
                                        </Col>
                                      </Row>

                                      <Row className="mt-2 mb-2">
                                        <Col md={2}>
                                          <Form.Label>
                                            Drug License No.{" "}
                                          </Form.Label>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Group className="">
                                            <Form.Control
                                              type="text"
                                              placeholder="Drug License No."
                                              name="drug_license_no"
                                              id="drug_license_no"
                                              onChange={handleChange}
                                              className="text-box"
                                              value={values.drug_license_no}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                              {errors.drug_license_no}
                                            </Form.Control.Feedback>
                                          </Form.Group>
                                        </Col>

                                        <Col md={2}>
                                          <Form.Label className="lbl">
                                            Drug Expiry
                                          </Form.Label>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Group className="">
                                            {/* <Col sm={6}> */}

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
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Expiry date exceding current date",
                                                        is_button_show: true,
                                                      });
                                                      setFieldValue(
                                                        "drug_expiry",
                                                        ""
                                                      );
                                                      this.batchdpRef.current.focus();
                                                    }
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Invalid Date",
                                                      is_button_show: true,
                                                    });

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
                                          </Form.Group>
                                        </Col>
                                      </Row>
                                      <Row className="">
                                        <Col lg={2}>
                                          <Form.Label>
                                            Mfg. Licence No.
                                          </Form.Label>
                                        </Col>
                                        <Col lg={2}>
                                          <Form.Group className="">
                                            <Form.Control
                                              type="text"
                                              placeholder="Mfg. Licence No"
                                              name="mfg_license_no"
                                              id="mfg_license_no"
                                              onChange={handleChange}
                                              className="text-box"
                                              value={values.mfg_license_no}
                                            />
                                          </Form.Group>
                                        </Col>
                                        <Col lg={2}>
                                          <Form.Label>
                                            Mfg. Expiry Date
                                          </Form.Label>
                                        </Col>
                                        <Col lg={2}>
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
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Expiry date exceding current date",
                                                      is_button_show: true,
                                                    });
                                                    setFieldValue(
                                                      "mfg_expiry",
                                                      ""
                                                    );
                                                    this.batchdpRef.current.focus();
                                                  }
                                                } else {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Invalid Date",
                                                    is_button_show: true,
                                                  });

                                                  setFieldValue(
                                                    "mfg_expiry",
                                                    ""
                                                  );
                                                }
                                              } else {
                                                setFieldValue("mfg_expiry", "");
                                              }
                                            }}
                                          />
                                        </Col>
                                      </Row>
                                    </Tab>
                                  </Tabs>
                                </Col>
                              </Row>
                              <Row className="mt-2">
                                <Col>
                                  <Tabs
                                    defaultActiveKey="shipping"
                                    id="uncontrolled-tab-example"
                                    className="mb-2"
                                    style={{ background: "rgb(217 240 251)" }}

                                    // style={{ background: "#fff" }}
                                  >
                                    {/* <Tab eventKey="billing" title="Biling">
                                      <Row className="mb-2">
                                        <Col md={2}>
                                          <Form.Label>District</Form.Label>
                                        </Col>
                                        <Col md={3}>
                                          <Form.Group>
                                            <Form.Control
                                              type="text"
                                              placeholder="District"
                                              name="b_district"
                                              className="text-box"
                                              onChange={handleChange}
                                              value={values.b_district}
                                              isValid={
                                                touched.b_district &&
                                                !errors.b_district
                                              }
                                              isInvalid={!!errors.b_district}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                              {errors.b_district}
                                            </Form.Control.Feedback>
                                          </Form.Group>
                                        </Col>
                                        <Col md={2}>
                                          <Form.Label>
                                            Billing Address
                                          </Form.Label>
                                        </Col>
                                        <Col md={4}>
                                          <Form.Group>
                                            <Form.Control
                                              type="textarea"
                                              placeholder="Billing Address"
                                              name="billing_address"
                                              className="text-box"
                                              onChange={handleChange}
                                              value={values.billing_address}
                                              isValid={
                                                touched.billing_address &&
                                                !errors.billing_address
                                              }
                                              isInvalid={
                                                !!errors.billing_address
                                              }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                              {errors.billing_address}
                                            </Form.Control.Feedback>
                                          </Form.Group>
                                        </Col>
                                        <Col lg={1}>
                                          <Button
                                            className="rowPlusBtn"
                                            onClick={(e) => {
                                              e.preventDefault();

                                              if (
                                                values.b_district != "" &&
                                                values.b_district != null &&
                                                values.billing_address != "" &&
                                                values.billing_address != null
                                              ) {
                                                let billAddObj = {
                                                  b_district: values.b_district,
                                                  billing_address:
                                                    values.billing_address,
                                                  index:
                                                    values.index !== undefined
                                                      ? values.index
                                                      : billingList.length,
                                                };
                                                this.addBillingRow(
                                                  billAddObj,
                                                  setFieldValue
                                                );
                                              } else {
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg: "Please Enter Billing Details ",
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

                                      {billingList.length > 0 && (
                                        <Row className="mt-3 m-0">
                                          <Col md={12}>
                                            <div className="">
                                              <Table
                                                hover
                                                size="sm"
                                                style={{ fontSize: "13px" }}
                                              >
                                                <thead>
                                                  <tr>
                                                    <th>Sr.</th>
                                                    <th>District</th>
                                                    <th colSpan={2}>
                                                      Billing Address
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {billingList.map((v, i) => {
                                                    return (
                                                      <tr
                                                        onDoubleClick={(e) => {
                                                          e.preventDefault();
                                                          console.log(
                                                            "sid",
                                                            i,
                                                            "v",
                                                            v
                                                          );

                                                          let billAddObj = {
                                                            b_district:
                                                              v.b_district,
                                                            billing_address:
                                                              v.billing_address,
                                                            index: v.index,
                                                          };
                                                          this.handleFetchBillingData(
                                                            billAddObj,
                                                            setFieldValue
                                                          );
                                                        }}
                                                      >
                                                        <td>{i + 1}</td>
                                                        <td>{v.b_district}</td>
                                                        <td>
                                                          {v.billing_address}
                                                        </td>
                                                        <td className="text-end">
                                                          <Button
                                                            style={{
                                                              marginTop:
                                                                "-12px",
                                                            }}
                                                            className="rowMinusBtn"
                                                            variant=""
                                                            type="button"
                                                            onClick={(e) => {
                                                              e.preventDefault();
                                                              this.removeBillingRow(
                                                                i
                                                              );
                                                            }}
                                                          >
                                                             
                                                            <FontAwesomeIcon
                                                              icon={faMinus}
                                                              className="minus-color"
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
                                      )}
                                    </Tab> */}
                                  </Tabs>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="btm-button-row">
                            <Col md="12" className="text-end">
                              <Button className="submit-btn" type="submit">
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn mx-2 me-2"
                                type="button"
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
                                            from: "ledgercreate",
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
                        <Row>
                          <Col>
                            <h5 className="Mail-title ms-2">
                              Taxation Details
                            </h5>
                          </Col>
                        </Row>
                        <Row>
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
                                            maxLength={15}
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
                        <hr />
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
                                  value={values.bank_name}
                                  onKeyPress={(e) => {
                                    OnlyAlphabets(e);
                                  }}
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
                            <Col lg={3}>
                              <Row>
                                <Col lg={3}>
                                  <Form.Label>IFSC Code </Form.Label>
                                </Col>
                                <Col lg={8}>
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
                              </Row>
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
                                  onKeyPress={(e) => {
                                    OnlyAlphabets(e);
                                  }}
                                  className="text-box"
                                  onChange={handleChange}
                                  value={values.bank_branch}
                                  isValid={
                                    touched.bank_branch && !errors.bank_branch
                                  }
                                  isInvalid={!!errors.bank_branch}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.bank_branch}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            {/* <Col md={8} className="text-end"> */}
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
                                      };
                                      this.addBankRow(bankObj, setFieldValue);
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Please Submit All Bank Details ",
                                        is_button_show: false,
                                      });
                                    }
                                  }}
                                >
                                  ADD ROW
                                </Button>
                              </Col> */}
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
                                            <tr>
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
                                                    this.removeDeptRow(i);
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
                        <hr />
                        <Row className="btm-button-row">
                          <Col md="12" className="text-end">
                            <Button className="submit-btn" type="submit">
                              Submit
                            </Button>
                            <Button
                              variant="secondary cancel-btn mx-2 me-2"
                              type="button"
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
                                          from: "ledgercreate",
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
                            <Button className="submit-btn" type="submit">
                              Submit
                            </Button>
                            <Button
                              variant="secondary cancel-btn mx-2 me-2"
                              type="button"
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
                                          from: "ledgercreate",
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
                            <Button className="submit-btn" type="submit">
                              Submit
                            </Button>
                            <Button
                              variant="secondary cancel-btn mx-2 me-2"
                              type="button"
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
                                          from: "ledgercreate",
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
                            <Button className="submit-btn" type="submit">
                              Submit
                            </Button>
                            <Button
                              variant="secondary cancel-btn mx-2 me-2"
                              type="button"
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
                                          from: "ledgercreate",
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

                  {values.underId == "" && (
                    <Row
                      className="mx-0 btm-rows-btn"
                      style={{ position: "absolute", bottom: "0", right: "0" }}
                    >
                      <Col className="text-end">
                        <Button
                          variant="secondary cancel-btn mx-2 me-2"
                          type="button"
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
                                      from: "ledgercreate",
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
                  )}
                  {/* Assets end  */}
                </Form>
              )}
            </Formik>
          </div>
          <Modal
            show={show}
            size="lg"
            className="groupnewmodal mt-5 mainmodal"
            onHide={() => this.handleModal(false)}
            dialogClassName="modal-400w"
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup">
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Associate Group
              </Modal.Title>
              <CloseButton
                variant="white"
                className="float-end"
                onClick={this.handleClose}
                //  onClick={() => this.handelPurchaseacModalShow(false)}
              />
            </Modal.Header>
            <Modal.Body className=" p-2 p-invoice-modal">
              <Formik
                initialValues={initValue}
                enableReinitialize={true}
                validateOnChange={true}
                validateOnBlur={false}
                validationSchema={Yup.object().shape({
                  associates_group_name: Yup.string()
                    .trim()
                    .required("Account group name is required"),
                  underId: Yup.object().required("select Under"),
                  // bank_ifsc_code: Yup.string()
                  //   .trim()
                  //   .matches(ifsc_code_regex, "IFSC code is not valid"),
                  phone_no: Yup.string()
                    .trim()
                    .matches(MobileRegx, "Enter Valid Mobile No."),

                  pincode: Yup.string()
                    .trim()
                    .matches(pincodeReg, "pin code is not valid"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let requestData = new FormData();
                  requestData.append(
                    "associates_group_name",
                    values.associates_group_name
                  );
                  requestData.append(
                    "principle_id",
                    values.underId ? values.underId.principle_id : ""
                  );
                  requestData.append(
                    "sub_principle_id",
                    values.underId
                      ? values.underId.sub_principle_id
                        ? values.underId.sub_principle_id
                        : ""
                      : ""
                  );
                  requestData.append(
                    "under_prefix",
                    values.underId ? values.underId.under_prefix : ""
                  );
                  // requestData.append("underId");
                  if (values.associates_id == "") {
                    createAssociateGroup(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);
                          this.lstUnders();
                          this.handleModal(false);
                          resetForm();
                          this.setInitValue();
                          this.lstAssociateGroups();
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => {});
                  } else {
                    requestData.append("associates_id", values.associates_id);
                    updateAssociateGroup(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);
                          this.lstUnders();
                          this.handleModal(false);
                          resetForm();
                          this.setInitValue();
                          this.lstAssociateGroups();
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => {});
                  }
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  resetForm,
                  setFieldValue,
                }) => (
                  <Form onSubmit={handleSubmit} autoComplete="off">
                    <div className="institute-head company-from">
                      <Row>
                        <Col md="4">
                          <Form.Group className="">
                            <Form.Label>
                              Under Id{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>{" "}
                            </Form.Label>
                            <Select
                              ////isClearable={true}
                              styles={customStyles}
                              className="selectTo"
                              onChange={(v) => {
                                setFieldValue("underId", v);
                              }}
                              name="underId"
                              options={undervalue}
                              value={values.underId}
                              invalid={errors.underId ? true : false}
                            />
                            <span className="text-danger">
                              {errors.underId}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col md="5">
                          <Form.Group>
                            <Form.Label>
                              Associate Group Name{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Associate Group Name"
                              name="associates_group_name"
                              id="associates_group_name"
                              onChange={handleChange}
                              value={values.associates_group_name}
                              isValid={
                                touched.associates_group_name &&
                                !errors.associates_group_name
                              }
                              isInvalid={!!errors.associates_group_name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.associates_group_name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md="1">
                          <div>
                            <Form.Label style={{ color: "#fff" }}>
                              Blank
                              <br />
                            </Form.Label>
                          </div>
                          <Button className="submit-btn " type="submit">
                            {values.associates_id == "" ? "Submit" : "Update"}
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
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

export default connect(mapStateToProps, mapActionsToProps)(LedgerCreate);
