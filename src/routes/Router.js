import { TramOutlined } from "@material-ui/icons";
import React, { lazy } from "react";
import salaryReport from "../pages/other/SalaryReport";
import LedgerList from "../pages/Ledger/LedgerList";
import LedgerCreate from "../pages/Ledger/LedgerCreate";
import LedgerGroupCreate from "../pages/Ledger/LedgerGroupCreate";
import LedgerEdit from "../pages/Ledger/LedgerEdit";
import PayrollList from "../pages/AccountEntry/Payroll/PayrollList";
import LedgerListView from "../pages/Ledger/LedgerListView";
import ManualAttendanceList from "../pages/other/ManualAttendanceList";
import LateAttendance from "../pages/other/LateAttendance";
// import Allocations from "../pages/AccountEntry/Allocations";
// import PayrollList from "../pages/AccountEntry/Payroll/PayrollList;

/*--------------------------------------------------------------------------------*/
/*                                  Application                                    */
/*--------------------------------------------------------------------------------*/
const Dashboard = lazy(() => import("@/pages/dashboard/dashboard"));
//const Accordiondemo = lazy(() => import("@/pages/masters/Accordiondemo"));
const Institute = lazy(() => import("@/pages/masters/Institute"));
const Company = lazy(() => import("@/pages/masters/Company"));
const Inspection = lazy(() => import("@/pages/masters/Inspection"));
const Designation = lazy(() => import("@/pages/masters/Designation"));
const Shift = lazy(() => import("@/pages/masters/Shift"));
const EmpShift = lazy(() => import("@/pages/masters/EmpShift"));
const EmployeeShift = lazy(() => import("@/pages/masters/EmployeeShift"));
const EmpShiftList = lazy(() => import("@/pages/masters/EmpShiftList"));
const EmpShiftListTable = lazy(() =>
  import("@/pages/masters/EmpShiftListTable")
);
const PushMessage = lazy(() => import("@/pages/masters/PushMessage"));
const Document = lazy(() => import("@/pages/masters/Document"));
const Employee = lazy(() => import("@/pages/masters/Employee/Employee"));
const Machine = lazy(() => import("@/pages/masters/Machine"));
const Job = lazy(() => import("@/pages/masters/Job"));
const JobOperation = lazy(() => import("@/pages/masters/JobOperation"));
const Action = lazy(() => import("@/pages/masters/Action"));
const Instrument = lazy(() => import("@/pages/masters/Instrument"));
const ControlMethod = lazy(() => import("@/pages/masters/ControlMethod"));
const CheckingFrequency = lazy(() =>
  import("@/pages/masters/CheckingFrequency")
);
const ToolMgmt = lazy(() => import("@/pages/masters/ToolMgmt"));
const OperationParameter = lazy(() =>
  import("@/pages/masters/OperationParameter")
);
const WorkBreak = lazy(() => import("@/pages/masters/WorkBreak"));
const MasterPayhead = lazy(() => import("@/pages/masters/MasterPayhead"));
const Payhead = lazy(() => import("@/pages/masters/Payhead"));
const Allowance = lazy(() => import("@/pages/masters/Allowance"));
const Deduction = lazy(() => import("@/pages/masters/Deduction"));
const LeaveType = lazy(() => import("@/pages/masters/LeaveType"));
const LeaveTypeEmp = lazy(() => import("@/pages/masters/LeaveTypeEmp"));
const Site = lazy(() => import("@/pages/masters/Site"));

const EmployeeLeave = lazy(() => import("@/pages/other/EmployeeLeave"));
const EmployeeLeavenewpage = lazy(() =>
  import("@/pages/other/EmployeeLeavenewpage")
);
const AdvancePayment = lazy(() => import("@/pages/other/AdvancePayment"));
const Attendance1 = lazy(() => import("@/pages/other/Attendance1"));
const Attendance2 = lazy(() => import("@/pages/other/Attendance2"));
const ManualAttendance = lazy(() => import("@/pages/other/ManualAttendance"));
const Attendance = lazy(() => import("@/pages/other/Attendance"));
const TodayAbsenty = lazy(() => import("@/pages/other/TodayAbsenty"));
const AttendanceHistory = lazy(() => import("@/pages/other/AttendanceHistory"));
const EmpYearlyPresenty = lazy(() => import("@/pages/other/EmpYearlyPresenty"));
const InspectionReport = lazy(() => import("@/pages/other/InspectionReport"));
const FinalInspectionReport = lazy(() =>
  import("@/pages/other/FinalInspectionReport")
);
const RejectionReport = lazy(() => import("@/pages/other/RejectionReport"));
const EmpSalaryReport = lazy(() => import("@/pages/other/EmpSalaryReport"));
const EmpEarningReport = lazy(() => import("@/pages/other/EmpEarningReport"));
const EmpMonthlyPresenty = lazy(() =>
  import("@/pages/other/EmpMonthlyPresenty")
);
const EmpYearlyAbsent = lazy(() => import("@/pages/other/EmpYearlyAbsent"));
const EmpSalarySlip = lazy(() => import("@/pages/other/EmpSalarySlip"));
const MachineReport = lazy(() => import("@/pages/other/MachineReport"));
const ItemReport = lazy(() => import("@/pages/other/ItemReport"));
const EmpSalarySheet = lazy(() => import("@/pages/other/EmpSalarySheet"));
const RoleCreate = lazy(() => import("@/pages/users/RoleCreate"));
const UserCreate = lazy(() => import("@/pages/users/UserCreate"));
const ShowUsers = lazy(() => import("@/pages/users/ShowUsers"));
const ShowRoles = lazy(() => import("@/pages/users/ShowRoles"));

//Contra
const ContraList = lazy(() => import("@/pages/AccountEntry/Contra/ContraList"));
const CreateContra = lazy(() =>
  import("@/pages/AccountEntry/Contra/CreateContra")
);
const ContraEdit = lazy(() => import("@/pages/AccountEntry/Contra/ContraEdit"));
// Account Entry
//Journal
const JournalList = lazy(() =>
  import("@/pages/AccountEntry/Journal/JournalList")
);
const CreateJournal = lazy(() =>
  import("@/pages/AccountEntry/Journal/CreateJournal")
);

const JournalEdit = lazy(() =>
  import("@/pages/AccountEntry/Journal/JournalEdit")
);
//Receipt
const ReceiptList = lazy(() =>
  import("@/pages/AccountEntry/Receipt/ReceiptList")
);

const CreateReceipt = lazy(() =>
  import("@/pages/AccountEntry/Receipt/CreateReceipt")
);

const ReceiptEdit = lazy(() =>
  import("@/pages/AccountEntry/Receipt/ReceiptEdit")
);
//Payment
const PaymentList = lazy(() =>
  import("@/pages/AccountEntry/Payment/PaymentList")
);

const CreatePayment = lazy(() =>
  import("@/pages/AccountEntry/Payment/CreatePayment")
);

const PaymentEdit = lazy(() =>
  import("@/pages/AccountEntry/Payment/PaymentEdit")
);

//Allocations
const AllocationsList = lazy(() =>
  import("@/pages/AccountEntry/Allocations/AllocationsList")
);

const CreateAllocations = lazy(() =>
  import("@/pages/AccountEntry/Allocations/CreateAllocations")
);

const AllocationsEdit = lazy(() =>
  import("@/pages/AccountEntry/Allocations/AllocationsEdit")
);

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
    _child: [
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/master/inspection",
        name: "Inspection",
        icon: "mdi mdi-comment-processing-outline",
        component: Inspection,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/master/company",
        name: "Company",
        icon: "mdi mdi-comment-processing-outline",
        component: Company,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/master/ledger/ledger-list",
        name: "Ledger",
        icon: "mdi mdi-comment-processing-outline",
        component: LedgerList,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/master/ledger/ledger-create",
        name: "Ledger",
        icon: "mdi mdi-comment-processing-outline",
        component: LedgerCreate,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/master/ledger/ledger-group",
        name: "Ledger",
        icon: "mdi mdi-comment-processing-outline",
        component: LedgerGroupCreate,
      },
      
      // {
      //   permission:
      //     isSuperAdmin == true
      //       ? true
      //       : policies != undefined && policies.master != undefined
      //         ? childPermission(policies.master.designationPermission)
      //         : false,
      //   path: "/master/payroll",
      //   name: "Ledger",
      //   icon: "mdi mdi-comment-processing-outline",
      //   component: PayrollList,
      // },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/master/ledger/ledger-edit",
        name: "Ledger",
        icon: "mdi mdi-comment-processing-outline",
        component: LedgerEdit,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/master/ledger/ledger-view/:id",
        name: "Ledger",
        icon: "mdi mdi-comment-processing-outline",
        component: LedgerListView,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/master/institute",
        name: "Institute",
        icon: "mdi mdi-comment-processing-outline",
        component: Institute,
      },
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
        path: "/master/empShift",
        name: "EmpShift",
        icon: "mdi mdi-comment-processing-outline",
        component: EmpShift,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/master/employeeShift",
        name: "EmployeeShift",
        icon: "mdi mdi-comment-processing-outline",
        component: EmployeeShift,
      },

      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/master/empShiftList",
        name: "EmpShiftList",
        icon: "mdi mdi-comment-processing-outline",
        component: EmpShiftList,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/master/empShiftListtable",
        name: "EmpShiftList",
        icon: "mdi mdi-comment-processing-outline",
        component: EmpShiftListTable,
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
      // {
      //   permission:
      //     isSuperAdmin == true
      //       ? true
      //       : policies != undefined && policies.master != undefined
      //         ? childPermission(policies.master.designationPermission)
      //         : false,
      //   path: "/master/accordiondemo",
      //   name: "Accordiondemo",
      //   icon: "mdi mdi-comment-processing-outline",
      //   component: Accordiondemo,
      // },
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

        path: "/master/checkingFrequency",
        name: "Instrument",
        icon: "mdi mdi-comment-processing-outline",
        component: CheckingFrequency,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/master/controlMethod",
        name: "Instrument",
        icon: "mdi mdi-comment-processing-outline",
        component: ControlMethod,
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
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/master/site",
        name: "Tool Mgmt",
        icon: "mdi mdi-comment-processing-outline",
        component: Site,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/master/role",
        name: "Show Role",
        icon: "mdi mdi-comment-processing-outline",
        component: ShowRoles,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/master/role-create",
        name: "User Role",
        icon: "mdi mdi-comment-processing-outline",
        component: RoleCreate,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/master/users",
        name: "Show Users",
        icon: "mdi mdi-comment-processing-outline",
        component: ShowUsers,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/master/user-create",
        name: "User Creation",
        icon: "mdi mdi-comment-processing-outline",
        component: UserCreate,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/master/pushmessage",
        name: "User Creation",
        icon: "mdi mdi-comment-processing-outline",
        component: PushMessage,
      },
    ],
    get child() {
      return this._child;
    },
    set child(value) {
      this._child = value;
    },
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
        path: "/leaves/leaveTypeemp",
        name: "Leave Type",
        icon: "mdi mdi-comment-processing-outline",
        component: LeaveTypeEmp,
      },
      {
        permission: isSuperAdmin == true ? true : false,
        path: "/leaves/employeeLeaves",
        name: "Employee Leaves",
        icon: "mdi mdi-comment-processing-outline",
        component: EmployeeLeave,
      },
      {
        permission: isSuperAdmin == true ? true : false,
        path: "/leaves/employeeLeavenewpage",
        name: "Employee Leaves",
        icon: "mdi mdi-comment-processing-outline",
        component: EmployeeLeavenewpage,
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
    path: "/todayAbsenty",
    name: "TodayAbsenty",
    icon: "mdi mdi-gauge",
    component: TodayAbsenty,
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
        path: "/master/masterPayhead",
        name: "Pay heads",
        icon: "mdi mdi-comment-processing-outline",
        component: MasterPayhead,
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
        path: "/reports/attendanceHistory",
        name: "Daily Production",
        icon: "mdi mdi-comment-processing-outline",
        component: AttendanceHistory,
      },

      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/reports/salaryReport",
        name: "Daily Production",
        icon: "mdi mdi-comment-processing-outline",
        component: salaryReport,
      },

      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/empyearlypresenty",
        name: "Daily Production",
        icon: "mdi mdi-comment-processing-outline",
        component: EmpYearlyPresenty,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/empmonthlypresenty",
        name: "Daily Production",
        icon: "mdi mdi-comment-processing-outline",
        component: EmpMonthlyPresenty,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/inspectionReport",
        name: "Daily Production",
        icon: "mdi mdi-comment-processing-outline",
        component: InspectionReport,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/finalInspectionReport",
        name: "Daily Production",
        icon: "mdi mdi-comment-processing-outline",
        component: FinalInspectionReport,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/rejection-report",
        name: "Rejection Report",
        icon: "mdi mdi-comment-processing-outline",
        component: RejectionReport,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/emp-salary-report",
        name: "Employee Salary Report",
        icon: "mdi mdi-comment-processing-outline",
        component: EmpSalaryReport,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/emp-earning-report",
        name: "Employee earning Report",
        icon: "mdi mdi-comment-processing-outline",
        component: EmpEarningReport,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/empyearlyabsent",
        name: "Daily Production",
        icon: "mdi mdi-comment-processing-outline",
        component: EmpYearlyAbsent,
      },

      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/empsalaryslip",
        name: "Daily Production",
        icon: "mdi mdi-comment-processing-outline",
        component: EmpSalarySlip,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/empsalarysheet",
        name: "Daily Production",
        icon: "mdi mdi-comment-processing-outline",
        component: EmpSalarySheet,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/attendance1",
        name: "Daily Attendance",
        icon: "mdi mdi-comment-processing-outline",
        component: Attendance1,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/attendance2",
        name: "Daily Attendance",
        icon: "mdi mdi-comment-processing-outline",
        component: Attendance2,
      },

      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/ManualAttendanceList",
        name: "Manual Attendance",
        icon: "mdi mdi-comment-processing-outline",
        component: ManualAttendanceList,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/LateAttendance",
        name: "Late Attendance",
        icon: "mdi mdi-comment-processing-outline",
        component: LateAttendance,
      },
      

      
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/manualprocess",
        name: "Daily Production",
        icon: "mdi mdi-comment-processing-outline",
        component: ManualAttendance,
      },

      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/machineReport",
        name: "Daily Production",
        icon: "mdi mdi-comment-processing-outline",
        component: MachineReport,
      },

      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,
        path: "/itemReport",
        name: "Machine Wise Production",
        icon: "mdi mdi-comment-processing-outline",
        component: ItemReport,
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

      // {
      //   permission:
      //     isSuperAdmin == true
      //       ? true
      //       : policies != undefined && policies.master != undefined
      //       ? childPermission(policies.master.designationPermission)
      //       : false,

      //   path: "/contra-create",
      //   name: "Create Receipt",
      //   icon: "mdi mdi-comment-processing-outline",
      //   component: CreateContra,
      // },
      // {
      //   permission:
      //     isSuperAdmin == true
      //       ? true
      //       : policies != undefined && policies.master != undefined
      //       ? childPermission(policies.master.designationPermission)
      //       : false,

      //   path: "/contra-edit",
      //   name: "Edit Contra",
      //   icon: "mdi mdi-comment-processing-outline",
      //   component: ContraEdit,
      // },

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
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/contra",
        name: "Contra",
        icon: "mdi mdi-comment-processing-outline",
        component: ContraList,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/contra-create",
        name: "Create Contra",
        icon: "mdi mdi-comment-processing-outline",
        component: CreateContra,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/contra-edit",
        name: "Edit Contra",
        icon: "mdi mdi-comment-processing-outline",
        component: ContraEdit,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/receipt",
        name: "Receipt",
        icon: "mdi mdi-comment-processing-outline",
        component: ReceiptList,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/receipt-create",
        name: "Create Receipt",
        icon: "mdi mdi-comment-processing-outline",
        component: CreateReceipt,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/receipt-edit",
        name: "Edit Receipt",
        icon: "mdi mdi-comment-processing-outline",
        component: ReceiptEdit,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/payment",
        name: "Payment",
        icon: "mdi mdi-comment-processing-outline",
        component: PaymentList,

      },

      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/journal",
        name: "Journal",
        icon: "mdi mdi-comment-processing-outline",
        component: JournalList,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
            ? childPermission(policies.master.designationPermission)
            : false,

        path: "/payroll",
        name: "Payroll",
        icon: "mdi mdi-comment-processing-outline",
        component: PayrollList,
      },
      // {
      //   permission:
      //     isSuperAdmin == true
      //       ? true
      //       : policies != undefined && policies.master != undefined
      //       ? childPermission(policies.master.designationPermission)
      //       : false,

      //   path: "/allocations",
      //   name: "Allocations",
      //   icon: "mdi mdi-comment-processing-outline",
      //   component: Allocations,
      // },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/payment-create",
        name: "Create Payment",
        icon: "mdi mdi-comment-processing-outline",
        component: CreatePayment,
      },

      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/journal-create",
        name: "Create Journal",
        icon: "mdi mdi-comment-processing-outline",
        component: CreateJournal,

      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/payment-edit",
        name: "Edit Payment",
        icon: "mdi mdi-comment-processing-outline",
        component: PaymentEdit,
        path: "/journal-edit",
        name: "Edit Journal",
        icon: "mdi mdi-comment-processing-outline",
        component: JournalEdit,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/allocations",
        name: "Allocations",
        icon: "mdi mdi-comment-processing-outline",
        component: AllocationsList,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/allocations-create",
        name: "Create Allocations",
        icon: "mdi mdi-comment-processing-outline",
        component: CreateAllocations,
      },
      {
        permission:
          isSuperAdmin == true
            ? true
            : policies != undefined && policies.master != undefined
              ? childPermission(policies.master.designationPermission)
              : false,

        path: "/allocations-edit",
        name: "Edit Allocations",
        icon: "mdi mdi-comment-processing-outline",
        component: AllocationsEdit,
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
