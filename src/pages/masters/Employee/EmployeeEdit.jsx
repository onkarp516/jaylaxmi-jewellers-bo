import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Form,
  Button,
  Row,
  Col,
  Spinner,
} from "reactstrap";

import { Tab, Tabs } from "react-bootstrap";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import Step4 from "./Steps/Step4";
import Step5 from "./Steps/Step5";
import {
  findEmployee,
  updateEmployee,
  listOfDesignation,
  listOfShifts,
  listOfDocument,
  listOfCompany,
  listOfSites,
} from "@/services/api_function";
import { getSelectValue } from "@/helpers";
import * as Yup from "yup";
import { Formik } from "formik";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import LayoutCustom from "@/pages/layout/LayoutCustom";
import ArrowBackIosSharpIcon from "@material-ui/icons/ArrowBackIosSharp";
import LayoutSpinner from "@/components/spinner/LayoutSpinner";
import moment from "moment";

let wagesOpt = [
  // { value: "pcs", label: "PCS basis" },
  // { value: "point", label: "Point basis" },
  { value: "hr", label: "Hr. basis" },
  { value: "day", label: "Day basis" },
];

let weeklyOffOpt = [
  { value: "SUN", label: "SUNDAY" },
  { value: "MON", label: "MONDAY" },
  { value: "TUE", label: "TUESDAY" },
  { value: "WED", label: "WEDNESDAY" },
  { value: "THU", label: "THURSDAY" },
  { value: "FRI", label: "FRIDAY" },
  { value: "SAT", label: "SATURDAY" },
];

export default function EmployeeEdit(props) {
  const editFrm = useRef(null);
  const [step, setStep] = useState(1);
  const [is_loading, setIs_loading] = useState(false);
  const [editDataFetch, setEditDataFetch] = useState(false);
  const [editApiCall, setEditApiCall] = useState(false);
  const [init_val, setinit_val] = useState({
    // step 1
    // fullName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    fullAddress: "",
    mobileNumber: "",
    dob: "",
    age: "0",
    religion: "NA",
    cast: "NA",
    reasonToJoin: "NA",
    marriageStatus: "",
    height: "NA",
    weight: "NA",
    bloodGroup: "NA",
    gender: "",
    isSpecks: false,
    isDisability: "false",
    disabilityDetails: "NA",
    isInjured: "false",
    injureDetails: "NA",
    policeCaseDetails: "NA",
    hobbies: "NA",
    f_fullName: "NA",
    f_age: "NA",
    f_relation: "NA",
    f_education: "NA",
    f_business: "NA",
    f_incomePerMonth: "NA",

    // step 2
    e_designationName: "NA",
    e_schoolName: "NA",
    e_year: "NA",
    e_grade: "NA",
    e_percentage: "NA",
    e_mainSubject: "NA",

    d_documentId: "",
    d_imagePath: "",

    // step 3
    isExperienceEmployee: "false",
    canWeContactPreviousCompany: false,
    ee_companyName: "NA",
    ee_duration: "NA",
    ee_designationName: "NA",
    ee_incomePerMonth: "NA",
    ee_reasonToResign: "NA",

    r_name: "NA",
    r_address: "NA",
    r_business: "NA",
    r_mobileNumber: "NA",
    r_knownFromWhen: "NA",

    // step 4
    companyId: "",
    designationId: "",
    shiftId: "",
    siteId: "",
    expectedSalary: 0,
    wagesPerDay: 0,
    employeeWagesType: "",
    weeklyOffDay: "",
    doj: "",
    readyToWorkInThreeShift: false,
    readyToWorkInMonths: "",
    bankName: "",
    branchName: "",
    accountNo: "",
    ifscCode: "",
    pfNumber: "",
    esiNumber: "",
    panNumber: "",

    // step5
    s_id: "",
    s_effectiveDate: "",
    s_salary: "",
    employeeHavePf: false,
    employeeHaveEsi: false,
    employeeHaveProfTax: false,
    showSalarySheet: false,
    employerPf: 0,
    employeePf: 0,
    employerEsi: 0,
    employeeEsi: 0,
    wagesOptions: [],
  });
  const [designation_op, setDesignation_op] = useState([]);
  const [shift_op, setShift_op] = useState([]);
  const [document_op, setDocument_op] = useState([]);
  const [company_op, setCompany_op] = useState([]);
  const [sitesOpt, setSitesOp] = useState([]);
  const [wagesOptions, setWagesOptions] = useState([]);

  const [oldDocumentList, setOldDocumentList] = useState([]);
  const [oldDocRemoveList, setOldDocRemoveList] = useState([]);

  const [salaryList, setSalaryList] = useState([]);
  const [oldSalaryList, setOldSalaryList] = useState([]);

  const [educationlist, setEducationList] = useState([]);
  const [documentlist, setDocumentList] = useState([]);
  const [experiencelist, setExperienceList] = useState([]);
  const [referencelist, setReferenceList] = useState([]);
  const [familylist, setFamilyList] = useState([]);

  const VALIDATION = {
    1: Yup.object().shape({
      firstName: Yup.string()
        .trim()
        .nullable()
        .required("First name is required"),
      middleName: Yup.string()
        .trim()
        .nullable()
        .required("Middle name is required"),
      lastName: Yup.string()
        .trim()
        .nullable()
        .required("Last name is required"),
      // fullName: Yup.string()
      //   .trim()
      //   .nullable()
      //   .required("Full name is required"),
      fullAddress: Yup.string()
        .trim()
        .nullable()
        .required("Address is required"),
      mobileNumber: Yup.string()
        .trim()
        .nullable()
        .required("Mobile No. is required"),
      gender: Yup.string().trim().nullable().required("Gender is required"),
      dob: Yup.string().trim().nullable().required("DOB is required"),
      age: Yup.string().trim().nullable().required("Age Required"),
      religion: Yup.string().trim().nullable().required("Religion is required"),
      cast: Yup.string().trim().nullable().required("Cast is required"),
      reasonToJoin: Yup.string()
        .trim()
        .nullable()
        .required("Reason is required"),
      marriageStatus: Yup.string()
        .trim()
        .nullable()
        .required("Marital status is required"),
      // height: Yup.string().trim().nullable().required("Required"),
      // weight: Yup.string().trim().nullable().required("Weight is required"),
      // bloodGroup: Yup.string()
      //   .trim()
      //   .nullable()
      //   .required("Blood group is required"),
      isSpecks: Yup.string()
        .trim()
        .nullable()
        .required("Is Specs Field is required"),
      isDisability: Yup.string()
        .trim()
        .nullable()
        .required("Is Disability Field is required"),
      disabilityDetails: Yup.string().when("isDisability", {
        is: (value) => value && value === "true",
        then: Yup.string()
          .trim()
          .nullable()
          .required("Disability Issue required"),
      }),
      isInjured: Yup.string()
        .trim()
        .nullable()
        .required("Is Injured Field is required"),
      injureDetails: Yup.string().when("isInjured", {
        is: (value) => value && value == "true",
        then: Yup.string()
          .trim()
          .nullable()
          .required("Injured Details required"),
      }),
      hobbies: Yup.string().trim().nullable().required("Hobbie is required"),
      policeCaseDetails: Yup.string()
        .trim()
        .nullable()
        .required("Police Details is required"),
    }),
    2: Yup.object().shape({}),
    3: Yup.object().shape({}),
    4: Yup.object().shape({
      companyId: Yup.object().nullable().required("Select Company"),
      employeeWagesType: Yup.object()
        .nullable()
        .required("Select Employee Wages Type"),
      weeklyOffDay: Yup.object()
        .nullable()
        .required("Select Employee weekly off day"),
      designationId: Yup.object().nullable().required("Select Designation"),
      shiftId: Yup.object().nullable(),
      siteId: Yup.object().nullable().required("Select Site"),
      expectedSalary: Yup.string()
        .trim()
        .nullable()
        .required("Expected salary is required"),
      // wagesPerDay: Yup.string()
      //   .trim()
      //   .nullable()
      //   .required("Per day wages is required"),
      doj: Yup.string().trim().nullable().required("DOJ is required"),
      readyToWorkInThreeShift: Yup.string()
        .trim()
        .nullable()
        .required("Ready to work in 3 shifts Field is required"),
      readyToWorkInMonths: Yup.string()
        .trim()
        .nullable()
        .required("Ready to work in months Field is required"),
      bankName: Yup.string()
        .trim()
        .nullable()
        .required("Bank name is required"),
      branchName: Yup.string()
        .trim()
        .nullable()
        .required("Branch name is required"),
      accountNo: Yup.string()
        .trim()
        .nullable()
        .required("Account No. is required"),
      ifscCode: Yup.string()
        .trim()
        .nullable()
        .required("IFSC code is required"),
      pfNumber: Yup.string().trim().nullable().required("PF No. is required"),
      esiNumber: Yup.string().trim().nullable().required("ESI No. is required"),
      panNumber: Yup.string().trim().nullable().required("PAN No. is required"),
    }),
    5: Yup.object().shape({
      firstName: Yup.string()
        .trim()
        .nullable()
        .required("First name is required"),
      middleName: Yup.string()
        .trim()
        .nullable()
        .required("Middle name is required"),
      lastName: Yup.string()
        .trim()
        .nullable()
        .required("Last name is required"),
      // fullName: Yup.string()
      //   .trim()
      //   .nullable()
      //   .required("Full name is required"),
      fullAddress: Yup.string()
        .trim()
        .nullable()
        .required("Address is required"),
      mobileNumber: Yup.string()
        .trim()
        .nullable()
        .required("Mobile No. is required"),
      gender: Yup.string().trim().nullable().required("Gender is required"),
      dob: Yup.string().trim().nullable().required("DOB is required"),
      age: Yup.string().trim().nullable().required("Required"),
      religion: Yup.string().trim().nullable().required("Religion is required"),
      cast: Yup.string().trim().nullable().required("Cast is required"),
      reasonToJoin: Yup.string()
        .trim()
        .nullable()
        .required("Reason is required"),
      marriageStatus: Yup.string()
        .trim()
        .nullable()
        .required("Marital status is required"),
      isSpecks: Yup.string().trim().nullable().required("Field is required"),
      isDisability: Yup.string()
        .trim()
        .nullable()
        .required("Field is required"),
      disabilityDetails: Yup.string().when("isDisability", {
        is: (value) => value && value === "true",
        then: Yup.string()
          .trim()
          .nullable()
          .required("Disability Issue required"),
      }),
      isInjured: Yup.string().trim().nullable().required("Field is required"),
      injureDetails: Yup.string().when("isInjured", {
        is: (value) => value && value == "true",
        then: Yup.string()
          .trim()
          .nullable()
          .required("Injured Details required"),
      }),
      hobbies: Yup.string().trim().nullable().required("Hobbie is required"),
      policeCaseDetails: Yup.string()
        .trim()
        .nullable()
        .required("Details is required"),
      companyId: Yup.object().nullable().required("Select Employee Type"),
      employeeWagesType: Yup.object()
        .nullable()
        .required("Select Employee Wages Type"),
      weeklyOffDay: Yup.object()
        .nullable()
        .required("Select Employee weekly off day"),
      designationId: Yup.object().nullable().required("Select Designation"),
      shiftId: Yup.object().nullable(),
      siteId: Yup.object().nullable().required("Select Site"),
      expectedSalary: Yup.string()
        .trim()
        .nullable()
        .required("Expected salary is required"),
      // wagesPerDay: Yup.string()
      //   .trim()
      //   .nullable()
      //   .required("Per day wages is required"),
      doj: Yup.string().trim().nullable().required("DOJ is required"),
      readyToWorkInThreeShift: Yup.string()
        .trim()
        .nullable()
        .required("Field is required"),
      readyToWorkInMonths: Yup.string()
        .trim()
        .nullable()
        .required("Field is required"),
      bankName: Yup.string()
        .trim()
        .nullable()
        .required("Bank name is required"),
      branchName: Yup.string()
        .trim()
        .nullable()
        .required("Branch name is required"),
      accountNo: Yup.string()
        .trim()
        .nullable()
        .required("Account No. is required"),
      ifscCode: Yup.string()
        .trim()
        .nullable()
        .required("IFSC code is required"),
      pfNumber: Yup.string().trim().nullable().required("PF No. is required"),
      esiNumber: Yup.string().trim().nullable().required("ESI No. is required"),
      panNumber: Yup.string().trim().nullable().required("PAN No. is required"),
    }),
  };

  const getCompanyOptions = () => {
    listOfCompany()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt = result.map(function (data) {
            return {
              value: data.id,
              label: data.companyName,
            };
          });
          setCompany_op(opt);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const goToNextPage = (values) => {
    setinit_val(values);
    setStep(step + 1);
  };

  const getAge = (dateString) => {
    console.log({ dateString });
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    console.log({ age });
    return age;
  };

  const addEducationList = (education, setFieldValue) => {
    let {
      e_designationName,
      e_schoolName,
      e_year,
      e_grade,
      e_percentage,
      e_mainSubject,
    } = education;
    if (e_designationName != "" && e_schoolName != "") {
      let prod_data = {
        designationName: e_designationName,
        schoolName: e_schoolName,
        year: e_year,
        grade: e_grade,
        percentage: e_percentage,
        mainSubject: e_mainSubject,
      };

      let old_lst = educationlist;
      let is_updated = false;
      let final_state;
      final_state = old_lst.map((item) => {
        if (item.schoolName === prod_data.schoolName) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...educationlist, prod_data];
      }
      setEducationList(final_state);
      setFieldValue("e_designationName", "");
      setFieldValue("e_schoolName", "");
      setFieldValue("e_year", "");
      setFieldValue("e_grade", "");
      setFieldValue("e_percentage", "");
      setFieldValue("e_mainSubject", "");
    }
  };
  // handle click event of the Remove button
  const removeEducationList = (index) => {
    const list = [...educationlist];
    list.splice(index, 1);
    setEducationList(list);
  };
  const addFamilyList = (family, setFieldValue) => {
    let {
      f_fullName,
      f_age,
      f_relation,
      f_education,
      f_business,
      f_incomePerMonth,
    } = family;
    if (f_fullName != "" && f_relation != " ") {
      let prod_data = {
        fullName: f_fullName,
        age: f_age,
        relation: f_relation,
        education: f_education,
        business: f_business,
        incomePerMonth: f_incomePerMonth,
      };

      let old_lst = familylist;
      let is_updated = false;
      let final_state;
      final_state = old_lst.map((item) => {
        if (item.fullName === prod_data.fullName) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...familylist, prod_data];
      }
      setFamilyList(final_state);
      setFieldValue("f_fullName", "");
      setFieldValue("f_age", "");
      setFieldValue("f_relation", "");
      setFieldValue("f_education", "");
      setFieldValue("f_business", "");
      setFieldValue("f_incomePerMonth", "");
    }
  };
  // handle click event of the Remove button
  const removeFamilyList = (index) => {
    const list = [...familylist];
    list.splice(index, 1);
    setFamilyList(list);
  };
  const addDocumentList = (document, setFieldValue) => {
    //debugger;
    let { d_documentId, d_imagePath } = document;
    if (d_documentId != "" && d_imagePath != "") {
      let prod_data = {
        d_documentId: d_documentId,
        imagePath: d_imagePath,
      };

      let old_lst = documentlist;
      let is_updated = false;
      let final_state;
      final_state = old_lst.map((item) => {
        if (item.d_documentId.value === prod_data.d_documentId.value) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...documentlist, prod_data];
      }
      setDocumentList(final_state);
      setFieldValue("d_documentId", "");
      setFieldValue("d_imagePath", "");
    }
  };
  // handle click event of the Remove button
  const removeDocumentList = (index) => {
    const list = [...documentlist];
    list.splice(index, 1);
    setDocumentList(list);
  };

  const addExperienceList = (experience, setFieldValue) => {
    // debugger;
    let {
      ee_companyName,
      ee_duration,
      ee_designationName,
      ee_incomePerMonth,
      ee_reasonToResign,
    } = experience;
    if (ee_companyName != "" && ee_duration != "") {
      let prod_data = {
        companyName: ee_companyName,
        duration: ee_duration,
        designationName: ee_designationName,
        incomePerMonth: ee_incomePerMonth,
        reasonToResign: ee_reasonToResign,
      };
      let old_lst = experiencelist;
      let is_updated = false;
      let final_state;
      final_state = old_lst.map((item) => {
        if (item.companyName === prod_data.companyName) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...experiencelist, prod_data];
      }
      setExperienceList(final_state);
      setFieldValue("ee_companyName", "");
      setFieldValue("ee_duration", "");
      setFieldValue("ee_designationName", "");
      setFieldValue("ee_incomePerMonth", "");
      setFieldValue("ee_reasonToResign", "");
    }
  };
  // handle click event of the Remove button
  const removeExperienceList = (index) => {
    const list = [...experiencelist];
    list.splice(index, 1);
    setExperienceList(list);
  };

  const addReferenceList = (reference, setFieldValue) => {
    //debugger;
    let { r_name, r_address, r_business, r_mobileNumber, r_knownFromWhen } =
      reference;
    if (r_name != "" && r_address != "") {
      let prod_data = {
        name: r_name,
        address: r_address,
        business: r_business,
        mobileNumber: r_mobileNumber,
        knownFromWhen: r_knownFromWhen,
      };

      let old_lst = referencelist;
      let is_updated = false;
      let final_state;
      final_state = old_lst.map((item) => {
        if (item.address === prod_data.address) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...referencelist, prod_data];
      }
      setReferenceList(final_state);
      setFieldValue("r_name", "");
      setFieldValue("r_address", "");
      setFieldValue("r_business", "");
      setFieldValue("r_mobileNumber", "");
      setFieldValue("r_knownFromWhen", "");
    }
  };
  // handle click event of the Remove button
  const removeReferenceList = (index) => {
    const list = [...referencelist];
    list.splice(index, 1);
    setReferenceList(list);
  };

  const getDocumentOptions = () => {
    listOfDocument()
      .then((response) => {
        // console.log("doc response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt = result.map(function (data) {
            return {
              value: data.id,
              label: data.documentName,
              required: data.isRequired,
            };
          });
          setDocument_op(opt);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getDesignationOptions = () => {
    listOfDesignation()
      .then((response) => {
        // console.log("desig response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt = result.map(function (data) {
            return {
              value: data.id,
              label: data.name + "(" + data.code + ")",
            };
          });
          setDesignation_op(opt);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getShiftOptions = () => {
    listOfShifts()
      .then((response) => {
        // console.log("shift response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt = result.map(function (data) {
            return {
              value: data.id,
              label: data.name,
            };
          });
          setShift_op(opt);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getSiteOptions = () => {
    listOfSites()
      .then((response) => {
        // console.log("shift response", response.data);
        let res = response.data;
        if (res.responseStatus == 200) {
          let result = res.response;
          let opt = result.map(function (data) {
            return {
              value: data.id,
              label: data.siteName,
            };
          });
          setSitesOp(opt);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const removeOldDocument = (index) => {
    const list = [...oldDocumentList];
    let splist = list.splice(index, 1);
    setOldDocRemoveList([...oldDocRemoveList, ...splist]);
    setOldDocumentList(list);
  };

  const addSalaryList = (salaryData, setFieldValue) => {
    let { s_id, s_effectiveDate, s_salary } = salaryData;
    console.log({ salaryData });
    if (s_effectiveDate != "" && s_salary != "") {
      let prod_data = {
        s_id: s_id,
        s_effectiveDate: s_effectiveDate,
        s_salary: s_salary,
      };

      let old_lst = salaryList;
      let is_updated = false;
      let final_state;
      final_state = old_lst.map((item) => {
        if (prod_data.s_id != "") {
          if (item.s_id === prod_data.s_id) {
            is_updated = true;
            const updatedItem = prod_data;
            return updatedItem;
          }
        } else {
          if (
            JSON.stringify(item.s_effectiveDate) ===
            JSON.stringify(prod_data.s_effectiveDate)
          ) {
            is_updated = true;
            const updatedItem = prod_data;
            return updatedItem;
          }
        }

        return item;
      });
      if (is_updated == false) {
        final_state = [...salaryList, prod_data];
      }
      console.log({ final_state });
      setSalaryList(final_state);
      setFieldValue("s_id", "");
      setFieldValue("s_effectiveDate", "");
      setFieldValue("s_salary", "");
    }
  };

  const editSalaryList = (key, salaryData, setFieldValue) => {
    let { s_id, s_effectiveDate, s_salary } = salaryData;
    if (s_effectiveDate != "" && s_salary != "") {
      setFieldValue("s_id", s_id);
      setFieldValue("s_effectiveDate", new Date(s_effectiveDate));
      setFieldValue("s_salary", s_salary);
    }
  };

  // handle click event of the Remove button
  const removeSalaryList = (index) => {
    const list = [...salaryList];
    let splist = list.splice(index, 1);

    setOldSalaryList([...oldSalaryList, ...splist]);
    setSalaryList(list);
  };

  useEffect(() => {
    getDesignationOptions();
    getShiftOptions();
    getDocumentOptions();
    getCompanyOptions();
    getSiteOptions();
  }, []);

  useLayoutEffect(() => {
    console.log({ company_op });
    if (
      designation_op.length > 0 &&
      shift_op.length > 0 &&
      company_op.length > 0 &&
      sitesOpt.length > 0
      // document_op.length > 0 &&
    ) {
      setEditDataFetch(true);
      if (editDataFetch != true) {
        setEditApiCall(true);
        let reqData = {
          id: props.match.params.id,
        };
        findEmployee(reqData)
          .then((response) => {
            setEditApiCall(false);
            let res = response.data;
            // console.log("res ", res);
            if (res.responseStatus == 200) {
              console.log("Edit Data", res.response);
              let response_data = res.response;
              console.log("response_data ", response_data);

              let empFamilylist = response_data.employeeFamily.map((v) => {
                return {
                  id: v.id,
                  fullName: v.fullName,

                  age: v.age,
                  relation: v.relation,
                  education: v.education,
                  business: v.business,
                  incomePerMonth: v.incomePerMonth,
                };
              });
              setFamilyList(empFamilylist);

              let documentlist = response_data.employeeDocuments.map((v) => {
                let opt = getSelectValue(document_op, parseInt(v.document.id));
                // console.log("opt", opt);
                return {
                  id: v.id,
                  d_documentId: opt,
                  imagePath: v.imagePath,
                };
              });
              // setDocumentList(documentlist);
              setOldDocumentList(documentlist);

              let empEducationlist = response_data.employeeEducation.map(
                (v) => {
                  return {
                    id: v.id,
                    designationName: v.designationName,
                    schoolName: v.schoolName,
                    year: v.year,
                    grade: v.grade,
                    percentage: v.percentage,
                    mainSubject: v.mainSubject,
                  };
                }
              );
              setEducationList(empEducationlist);

              let empExperiencelist =
                response_data.employeeExperienceDetails.map((v) => {
                  return {
                    id: v.id,
                    companyName: v.companyName,
                    duration: v.duration,
                    designationName: v.designationName,
                    incomePerMonth: v.incomePerMonth,
                    reasonToResign: v.reasonToResign,
                  };
                });
              setExperienceList(empExperiencelist);

              let empReferencelist = response_data.employeeReferences.map(
                (v) => {
                  return {
                    id: v.id,
                    name: v.name,
                    address: v.address,
                    business: v.business,
                    mobileNumber: v.mobileNumber,
                    knownFromWhen: v.knownFromWhen,
                  };
                }
              );
              setReferenceList(empReferencelist);

              let empSalaryList = response_data.employeeSalaryList.map((v) => {
                return {
                  s_id: v.id,
                  s_effectiveDate: v.effectiveDate,
                  s_salary: v.salary,
                };
              });
              setSalaryList(empSalaryList);

              let wages_opt = getSelectValue(
                wagesOpt,
                response_data.employeeWagesType
              );

              let weekly_off_opt = getSelectValue(
                weeklyOffOpt,
                response_data.weeklyOffDay
              );

              let desig_opt = "";
              if (response_data.designation != null) {
                desig_opt = getSelectValue(
                  designation_op,
                  parseInt(response_data.designation.id)
                );
              }
              let shift_opt = "";
              if (response_data.shift != null) {
                shift_opt = getSelectValue(
                  shift_op,
                  parseInt(response_data.shift.id)
                );
              }

              let companyOpt = "";
              if (response_data.company != null) {
                companyOpt = getSelectValue(
                  company_op,
                  parseInt(response_data.company.id)
                );
              }

              let siteOpt = "";
              if (response_data.site != null) {
                siteOpt = getSelectValue(
                  sitesOpt,
                  parseInt(response_data.site.id)
                );
              }

              response_data.dob = new Date(response_data.dob);
              response_data.doj = new Date(response_data.doj);
              response_data.age = getAge(response_data.dob);
              response_data.isDisability =
                response_data.isDisability == true ? "true" : "false";
              response_data.isInjured =
                response_data.isInjured == true ? "true" : "false";
              response_data.isExperienceEmployee =
                response_data.isExperienceEmployee == true ? "true" : "false";
              response_data.fullAddress = response_data.address;
              response_data.designationId = desig_opt;
              response_data.shiftId = shift_opt;
              response_data.companyId = companyOpt;
              response_data.siteId = siteOpt;
              response_data.employeeWagesType = wages_opt;
              response_data.weeklyOffDay = weekly_off_opt;

              let opts =
                response_data.wagesOptions != null
                  ? response_data.wagesOptions
                  : [];
              console.log({ opts }, typeof opts);
              opts = opts.length > 0 ? opts.split(",") : [];
              console.log({ opts }, typeof opts);
              response_data.wagesOptions = opts;
              response_data.employeeHavePf =
                response_data.employeeHavePf == true ? true : false;
              // response_data.employerPf =
              //   response_data.employerPf != null ? response_data.employerPf : 0;
              response_data.employeePf =
                response_data.employeePf != null ? response_data.employeePf : 0;
              response_data.employeeHaveEsi =
                response_data.employeeHaveEsi == true ? true : false;
              // response_data.employerEsi =
              //   response_data.employerEsi != null
              //     ? response_data.employerEsi
              //     : 0;
              response_data.employeeEsi =
                response_data.employeeEsi != null
                  ? response_data.employeeEsi
                  : 0;
              response_data.employeeHaveProfTax =
                response_data.employeeHaveProfTax == true ? true : false;
              response_data.showSalarySheet =
                response_data.showSalarySheet == true ? true : false;

              response_data.s_id = "";
              response_data.s_effectiveDate = "";
              response_data.s_salary = "";
              console.log({ response_data });
              setinit_val(response_data);
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
      }
      // console.log({ editDataFetch });
    }
  });

  return editApiCall ? (
    <LayoutSpinner />
  ) : (
    <LayoutCustom>
      <div>
        <Card className="p-2">
          <CardBody className="border-bottom p-2">
            <CardTitle className="mb-0">
              <Button
                title="Back"
                //outline
                style={{
                  border: "none",
                  boxShadow: "unset",
                  background: "transparent",
                  color: "#000",
                }}
                className="pl-0"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  props.history.push("/master/employeeList");
                }}
              >
                <ArrowBackIosSharpIcon />
              </Button>
              Employee Edit
            </CardTitle>
          </CardBody>
          <CardBody className="p-2">
            <Formik
              enableReinitialize={true}
              innerRef={editFrm}
              initialValues={init_val}
              validationSchema={VALIDATION[step]}
              onSubmit={(values, bug) => {
                if (step < 5) {
                  goToNextPage(values);
                } else if (step == 5) {
                  console.log({ values });
                  // debugger;

                  if (salaryList && salaryList.length > 0) {
                    setIs_loading(true);
                    let req_doc = document_op.filter((v) => {
                      return v.required == true;
                    });

                    let doc_req = [];
                    documentlist.map((v) => {
                      if (v.d_documentId.required == true) {
                        doc_req.push(v.d_documentId);
                      }
                    });

                    oldDocumentList.map((v) => {
                      if (v.d_documentId.required == true) {
                        if (!doc_req.includes(v.d_documentId)) {
                          doc_req.push(v.d_documentId);
                        }
                      }
                    });
                    if (req_doc.length == doc_req.length) {
                      if (
                        Object.entries(req_doc).toString() ===
                        Object.entries(doc_req).toString()
                      ) {
                        let keys = Object.keys(init_val);
                        let requestData = new FormData();
                        keys.map((v) => {
                          console.log("v ->" + v + " values[v] =>" + values[v]);
                          if (
                            values[v] != "" &&
                            v != "companyId" &&
                            v != "employeeWagesType" &&
                            v != "weeklyOffDay" &&
                            v != "designationId" &&
                            v != "shiftId" &&
                            v != "siteId" &&
                            v != "dob" &&
                            v != "doj"
                          ) {
                            // console.log(values[v]);
                            requestData.append(v, values[v]);
                          }
                        });

                        requestData.append(
                          "dob",
                          moment(values.dob).format("YYYY-MM-DD")
                        );
                        requestData.append(
                          "doj",
                          moment(values.doj).format("YYYY-MM-DD")
                        );
                        requestData.append(
                          "employeePf",
                          values.employeePf != null ? values.employeePf : 0
                        );
                        // requestData.append(
                        //   "employerEsi",
                        //   values.employerEsi != null ? values.employerEsi : 0
                        // );
                        requestData.append(
                          "employeeEsi",
                          values.employeeEsi != null ? values.employeeEsi : 0
                        );

                        requestData.append("companyId", values.companyId.value);
                        requestData.append(
                          "employeeWagesType",
                          values.employeeWagesType.value
                        );
                        requestData.append(
                          "weeklyOffDay",
                          values.weeklyOffDay.value
                        );
                        requestData.append(
                          "designationId",
                          values.designationId.value
                        );
                        requestData.append("siteId", values.siteId.value);

                        if (values.shiftId != null) {
                          requestData.append("shiftId", values.shiftId.value);
                        } else {
                          requestData.append("shiftId", "");
                        }
                        requestData.append(
                          "family",
                          JSON.stringify(familylist)
                        );
                        requestData.append(
                          "education",
                          JSON.stringify(educationlist)
                        );
                        requestData.append(
                          "experience",
                          JSON.stringify(experiencelist)
                        );
                        requestData.append(
                          "reference",
                          JSON.stringify(referencelist)
                        );
                        requestData.append(
                          "document",
                          JSON.stringify(documentlist)
                        );
                        requestData.append(
                          "oldDocumentList",
                          JSON.stringify(oldDocumentList)
                        );
                        console.log("salaryList ", salaryList);
                        let sList = salaryList.map((obj) => {
                          return {
                            id: obj.s_id,
                            effectiveDate: moment(obj.s_effectiveDate).format(
                              "yyyy-MM-DD"
                            ),
                            salary: obj.s_salary,
                          };
                        });

                        requestData.append("salaryList", JSON.stringify(sList));
                        requestData.append("imageLength", documentlist.length);
                        for (let i = 0; i < documentlist.length; i++) {
                          requestData.append(
                            `document${i}`,
                            documentlist[i]["imagePath"]
                          );
                        }

                        let olddocremove = oldDocRemoveList.map((v) => {
                          return { empDocumentId: v.id };
                        });

                        let oldsalremove = [];
                        oldSalaryList.map((v) => {
                          if (v.s_id != "" && v.s_id != null) {
                            oldsalremove.push({ empSalId: v.s_id });
                          }
                        });

                        console.log({ oldsalremove });

                        requestData.append(
                          "oldDocRemoveList",
                          JSON.stringify(olddocremove)
                        );
                        requestData.append(
                          "oldsalremoveList",
                          JSON.stringify(oldsalremove)
                        );

                        for (var pair of requestData.entries()) {
                          console.log(pair[0] + "=>" + pair[1]);
                        }

                        updateEmployee(requestData)
                          .then((response) => {
                            setIs_loading(false);
                            let res = response.data;
                            // console.log("response", res);
                            if (res.responseStatus == 200) {
                              if (res.exist == true) {
                                toast.error(
                                  "✘ Employee mobile already registered! use another mobile no."
                                );
                              } else {
                                toast.success(
                                  "✔ Employee data updated successfully!"
                                );
                                setTimeout(function () {
                                  props.history.push("/master/employeeList");
                                }, 1000);
                              }
                            } else {
                              toast.error("✘ " + res.message);
                            }
                          })
                          .catch((error) => {
                            console.log("error", error);
                            toast.error("✘ Something went wrong!");
                          });
                      }
                    } else {
                      setIs_loading(false);
                      toast.error("✘ Check the required documents");
                    }
                  } else {
                    setIs_loading(false);
                    toast.error("✘ Please submit employee salary data");
                  }
                }
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
                <Form className="empcreate-pg" onSubmit={handleSubmit}>
                  {/* {JSON.stringify(values, undefined, 2)} */}
                  {/* {JSON.stringify(errors, undefined, 2)} */}
                  <Tabs
                    className="emptab mt-0"
                    id="controlled-tab-example"
                    activeKey={step}
                    onSelect={(k) => {
                      setStep(parseInt(k));
                    }}
                  >
                    <Tab eventKey="1" title="Personal Info">
                      <Step1
                        handleChange={handleChange}
                        setFieldValue={setFieldValue}
                        values={values}
                        errors={errors}
                        is_edit={false}
                        familylist={familylist}
                        addFamilyList={addFamilyList}
                        removeFamilyList={removeFamilyList}
                      />
                    </Tab>
                    <Tab eventKey="2" title="Education Info">
                      <Step2
                        setFieldValue={setFieldValue}
                        handleChange={handleChange}
                        values={values}
                        errors={errors}
                        is_edit={false}
                        document_op={document_op}
                        educationlist={educationlist}
                        addEducationList={addEducationList}
                        removeEducationList={removeEducationList}
                        addDocumentList={addDocumentList}
                        documentlist={documentlist}
                        removeDocumentList={removeDocumentList}
                        removeOldDocument={removeOldDocument}
                        oldDocumentList={oldDocumentList}
                        oldDocRemoveList={oldDocRemoveList}
                      />
                    </Tab>
                    <Tab eventKey="3" title=" Experience Info">
                      <Step3
                        setFieldValue={setFieldValue}
                        handleChange={handleChange}
                        values={values}
                        errors={errors}
                        is_edit={false}
                        document_op={document_op}
                        experiencelist={experiencelist}
                        addExperienceList={addExperienceList}
                        removeExperienceList={removeExperienceList}
                        referencelist={referencelist}
                        addReferenceList={addReferenceList}
                        removeReferenceList={removeReferenceList}
                      />
                    </Tab>
                    <Tab eventKey="4" title="Other Info">
                      <Step4
                        setFieldValue={setFieldValue}
                        handleChange={handleChange}
                        values={values}
                        errors={errors}
                        is_edit={false}
                        designation_op={designation_op}
                        shift_op={shift_op}
                        company_op={company_op}
                        sitesOpt={sitesOpt}
                        wagesOpt={wagesOpt}
                        weeklyOffOpt={weeklyOffOpt}
                      />
                    </Tab>
                    <Tab eventKey="5" title="PAYROLL INFO">
                      <Step5
                        setFieldValue={setFieldValue}
                        handleChange={handleChange}
                        values={values}
                        errors={errors}
                        is_edit={false}
                        wagesOpt={wagesOpt}
                        wagesOptions={wagesOptions}
                        setWagesOptions={setWagesOptions}
                        salaryList={salaryList}
                        addSalaryList={addSalaryList}
                        editSalaryList={editSalaryList}
                        removeSalaryList={removeSalaryList}
                        oldSalaryList={oldSalaryList}
                      />
                    </Tab>
                  </Tabs>
                  <Row>
                    <Col md="12">
                      {step == 5 && Object.keys(errors).length > 0 ? (
                        <>
                          <div className="text-center mb-2"></div>
                          <div className={"alert alert-danger"}>
                            {/* {JSON.stringify(errors)} */}
                            Please fill-up below fields
                            {/* <br /> */}
                            {Object.values(errors).map((v) => {
                              return <p>{v}</p>;
                              // return <p>{errors[v]}</p>;
                            })}
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      {step != 1 && (
                        <>
                          <Button
                            className="mainbtn2 mr-4 btn"
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              if (step != 1) {
                                setStep(step - 1);
                              }
                            }}
                          >
                            Back
                          </Button>
                        </>
                      )}
                      {step != 5 && (
                        <Button type="submit" className="mainbtn1 text-white">
                          Next
                        </Button>
                      )}
                      {step == 5 &&
                        (is_loading ? (
                          <>
                            <Button
                              type="button"
                              className="mainbtn1 text-white"
                              disabled={true}
                            >
                              <Spinner size="sm" color="secondary" />
                              <span>Loading</span>
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="button"
                            className="mainbtn1 text-white"
                            onClick={(e) => {
                              e.preventDefault();
                              submitForm();
                            }}
                          >
                            Submit
                          </Button>
                        ))}
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      </div>
    </LayoutCustom>
  );
}
