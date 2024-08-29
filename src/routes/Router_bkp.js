import { TramOutlined } from "@material-ui/icons";
import React, { lazy } from "react";
/*--------------------------------------------------------------------------------*/
/*                                  Application                                    */
/*--------------------------------------------------------------------------------*/
const Dashboard = lazy(() => import("@/pages/dashboard/dashboard"));
const Designation = lazy(() => import("@/pages/masters/Designation"));
const Shift = lazy(() => import("@/pages/masters/Shift"));
const Document = lazy(() => import("@/pages/masters/Document"));
const Employee = lazy(() => import("@/pages/masters/Employee/Employee"));
const Machine = lazy(() => import("@/pages/masters/Machine"));
const Job = lazy(() => import("@/pages/masters/Job"));
const JobOperation = lazy(() => import("@/pages/masters/JobOperation"));
const Action = lazy(() => import("@/pages/masters/Action"));
const Instrument = lazy(() => import("@/pages/masters/Instrument"));
const ToolMgmt = lazy(() => import("@/pages/masters/ToolMgmt"));
const OperationParameter = lazy(() =>
  import("@/pages/masters/OperationParameter")
);
const WorkBreak = lazy(() => import("@/pages/masters/WorkBreak"));
const Payhead = lazy(() => import("@/pages/masters/Payhead"));
const Allowance = lazy(() => import("@/pages/masters/Allowance"));
const Deduction = lazy(() => import("@/pages/masters/Deduction"));
const LeaveType = lazy(() => import("@/pages/masters/LeaveType"));
const EmployeeLeave = lazy(() => import("@/pages/other/EmployeeLeave"));
const AdvancePayment = lazy(() => import("@/pages/other/AdvancePayment"));
const Attendance = lazy(() => import("@/pages/other/Attendance"));

const secureData = JSON.parse(localStorage.getItem("loginUser"));
const isSuperAdmin = secureData != null ? secureData.isSuperAdmin : false;
console.log({ isSuperAdmin });
// console.log({ secureData });

let policies = secureData != null ? secureData.user_permission : undefined;
// console.log({ policies });

const parentPermission = (policies) => {
  let flag = false;
  if (policies != undefined) {
    Object.values(policies).some((permission) => {
      if (permission == "read" || permission == "write") {
        flag = true;
        return flag;
      }
    });
  }
  return flag;
};
const childPermission = (permission) => {
  if (permission != undefined) {
    if (permission == "read" || permission == "write") {
      return true;
    }
  }
  return false;
};

let ThemeRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "mdi mdi-gauge",
    component: Dashboard,
  },
  {
    parentPermission:
      isSuperAdmin == true
        ? true
        : policies != undefined
        ? parentPermission(policies.master)
        : false,
    collapse: true,
    path: "/master",
    name: "Master",
    icon: "mdi mdi-google-circles-extended",
    child: [
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/designation",
        name: "Designation",
        icon: "mdi mdi-comment-processing-outline",
        component: Designation,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/shift",
        name: "Shift",
        icon: "mdi mdi-comment-processing-outline",
        component: Shift,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/document",
        name: "Document",
        icon: "mdi mdi-comment-processing-outline",
        component: Document,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/employeeList",
        name: "Employee",
        icon: "mdi mdi-comment-processing-outline",
        component: Employee,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,

        path: "/master/machine",
        name: "Machine",
        icon: "mdi mdi-comment-processing-outline",
        component: Machine,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/action",
        name: "Action",
        icon: "mdi mdi-comment-processing-outline",
        component: Action,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,

        path: "/master/job",
        name: "Job",
        icon: "mdi mdi-comment-processing-outline",
        component: Job,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,

        path: "/master/jobOperation",
        name: "Job Operation",
        icon: "mdi mdi-comment-processing-outline",
        component: JobOperation,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,

        path: "/master/break",
        name: "Break",
        icon: "mdi mdi-comment-processing-outline",
        component: WorkBreak,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,

        path: "/master/operationParameter",
        name: "Operation Parameter",
        icon: "mdi mdi-comment-processing-outline",
        component: OperationParameter,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,

        path: "/master/instrument",
        name: "Instrument",
        icon: "mdi mdi-comment-processing-outline",
        component: Instrument,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,

        path: "/master/toolMgmt",
        name: "Tool Mgmt",
        icon: "mdi mdi-comment-processing-outline",
        component: ToolMgmt,
      },
    ],
  },
  {
    parentPermission: isSuperAdmin == true ? true : false,
    collapse: true,
    path: "/leaves",
    name: "Leave Configuration",
    icon: "mdi mdi-equal-box",
    child: [
      {
        permission: isSuperAdmin == true ? true : false,
        path: "/leaves/leaveType",
        name: "Leave Type",
        icon: "mdi mdi-comment-processing-outline",
        component: LeaveType,
      },
      {
        permission: isSuperAdmin == true ? true : false,
        path: "/leaves/employeeLeaves",
        name: "Employee Leaves",
        icon: "mdi mdi-comment-processing-outline",
        component: EmployeeLeave,
      },
    ],
  },
  {
    path: "/advancePayments",
    name: "Advance Payments",
    icon: "mdi mdi-gauge",
    component: AdvancePayment,
  },
  {
    path: "/attendance",
    name: "Attendance",
    icon: "mdi mdi-gauge",
    component: Attendance,
  },
  {
    parentPermission:
      isSuperAdmin == true
        ? true
        : policies != undefined
        ? parentPermission(policies.master)
        : false,
    collapse: true,
    path: "/master",
    name: "Salary Configuration",
    icon: "mdi mdi-equal-box",
    child: [
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/payhead",
        name: "Pay heads",
        icon: "mdi mdi-comment-processing-outline",
        component: Payhead,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/allowance",
        name: "Allowance",
        icon: "mdi mdi-comment-processing-outline",
        component: Allowance,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/deduction",
        name: "Deduction",
        icon: "mdi mdi-comment-processing-outline",
        component: Deduction,
      },
    ],
  },
  {
    parentPermission:
      isSuperAdmin == true
        ? true
        : policies != undefined
        ? parentPermission(policies.master)
        : false,
    collapse: true,
    path: "/master",
    name: "Authorization",
    icon: "mdi mdi-checkbox-multiple-marked-outline",
    child: [
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/designation",
        name: "Work",
        icon: "mdi mdi-comment-processing-outline",
        component: Designation,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/shift",
        name: "Productivity",
        icon: "mdi mdi-comment-processing-outline",
        component: Shift,
      },
    ],
  },
  {
    parentPermission:
      isSuperAdmin == true
        ? true
        : policies != undefined
        ? parentPermission(policies.master)
        : false,
    collapse: true,
    path: "/master",
    name: "Reports",
    icon: "mdi mdi-trending-up",
    child: [
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/designation",
        name: "Daily Production",
        icon: "mdi mdi-comment-processing-outline",
        component: Designation,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/shift",
        name: "Machine Wise Production",
        icon: "mdi mdi-comment-processing-outline",
        component: Shift,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/shift",
        name: "Salary ",
        icon: "mdi mdi-comment-processing-outline",
        component: Shift,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/shift",
        name: "Daily Attendance",
        icon: "mdi mdi-comment-processing-outline",
        component: Shift,
      },
    ],
  },
  {
    parentPermission:
      isSuperAdmin == true
        ? true
        : policies != undefined
        ? parentPermission(policies.master)
        : false,
    collapse: true,
    path: "/master",
    name: "Salary Slip",
    icon: "mdi mdi-note-text",
    child: [
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/designation",
        name: "Work",
        icon: "mdi mdi-comment-processing-outline",
        component: Designation,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,
        path: "/master/shift",
        name: "Productivity",
        icon: "mdi mdi-comment-processing-outline",
        component: Shift,
      },
    ],
  },
  {
    collapse: true,
    path: "/forms",
    name: "Forms",
    state: "openApps",
    icon: "mdi mdi-clipboard-text",
    extra: "",
    child: [
      {
        collapse: true,
        name: "Form Layouts",
        cstate: "formlayoutPages",
        icon: "mdi mdi-arrange-bring-forward",
        subchild: [
          {
            path: "/forms/form-layouts/form-inputs",
            name: "Form Inputs",
            icon: "mdi mdi-priority-low",
            component: Shift,
          },
        ],
      },
      {
        collapse: true,
        name: "Form Pickers",
        cstate: "formpickerPages",
        icon: "mdi mdi-pencil-box-outline",
        subchild: [
          {
            path: "/forms/form-pickersTdatetimepicker",
            name: "Date Pickers",
            icon: "mdi mdi-calendar-clock",
            component: Designation,
          },
        ],
      },
      {
        path: "/forms/form-validation",
        name: "Form Validation",
        icon: "mdi mdi-alert-box",
        component: Designation,
      },
    ],
  },
];
export { ThemeRoutes };
