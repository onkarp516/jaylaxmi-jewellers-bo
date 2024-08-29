import React, { Component } from "react";
import rlogo from "@/assets/images/r-logo.png";
import { NavLink } from "react-router-dom";
import { WithUserPermission } from "../../../helpers/WithUserPermission";
import { isParentExist, isActionExist, isSuperuser } from "@/helpers";

class CustomNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log("inside customNav : ", this.props);
    return (
      <nav>
        <a href="#." class="mobile-menu-trigger ">
          {/* <img src={rlogo} alt="logo"></img> */}
          <i className="fa fa-bars"></i>
        </a>
        <ul className="menu menu-bar">
          <li className="logoimg">
            <NavLink to="/dashboard" className="menu-link menu-list-link">
              {/* <img src={rlogo} alt="logo"></img> */}

              <span className="hide-menu">DASHBOARD</span>
            </NavLink>
          </li>
          {/* {ThemeRoutes.map((prop, key) => {
                return (
                  <li key={key}>
                    <a
                      href={`${
                        prop.child && prop.child.length > 0 ? "#." : prop.path
                      }`}
                      aria-haspopup="true"
                    >
                      {prop.name}{" "}
                    </a>
                    {prop.child && (
                      <ul
                        class="mega-menu mega-menu--multiLevel"
                        key={key + 456}
                      >
                        {prop.child.map((v1, k1) => {
                          console.log("prop.child ", v1);
                          return (
                            <li key={k1 + 234}>
                              <a
                                href={`${
                                  prop.child.subchild &&
                                  prop.child.subchild.length > 0
                                    ? "#."
                                    : v1.path
                                }`}
                                class="menu-link menu-list-link"
                                aria-haspopup="true"
                              >
                                {v1.name}
                              </a>
                              {prop.child.subchild && (
                                <ul class="menu menu-list" key={k1 + 456}>
                                  {prop.child.map((v12, k12) => {
                                    return (
                                      <li key={k12 + 234}>
                                        <a
                                          href={v12.path}
                                          class="menu-link menu-list-link"
                                        >
                                          {v12.name}
                                        </a>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })} */}
          {/* </ul> */}
          {/* <ul class="menu menu-bar"> */}
          {/* <li className="logoimg">
                <a href="#.">
                  {" "}
                  <img src={rlogo} alt="logo"></img>
                </a>
              </li> */}
          {isSuperuser() && (
            <li>
              <a href="#." class="menu-link menu-bar-link" aria-haspopup="true">
                Master
              </a>
              <ul class="mega-menu mega-menu--multiLevel">
                <li>
                  <NavLink
                    to="/master/institute"
                    className="menu-link menu-list-link"
                  >
                    <span className="hide-menu">Institute Creation</span>
                  </NavLink>
                </li>
              </ul>
            </li>
          )}
          {isParentExist("master", this.props.userPermissions) && (
            <li>
              <a href="#." class="menu-link menu-bar-link" aria-haspopup="true">
                Master
              </a>
              <ul class="mega-menu mega-menu--multiLevel">
                {isParentExist(
                  "employee-manage",
                  this.props.userPermissions
                ) && (
                    <li>
                      <a
                        href="#."
                        class="menu-link mega-menu-link"
                        aria-haspopup="true"
                      >
                        Employee Manage
                      </a>
                      <ul class="menu menu-list">
                        {isActionExist(
                          "company",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/company"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Company</span>
                              </NavLink>
                            </li>
                          )}
                        {isActionExist(
                          "site",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/site"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Site</span>
                              </NavLink>
                            </li>
                          )}
                        {isActionExist(
                          "designation",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/designation"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Designation</span>
                              </NavLink>
                            </li>
                          )}
                        {isActionExist(
                          "shift",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/shift"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Shift</span>
                              </NavLink>
                            </li>
                          )}
                        {isActionExist(
                          "document",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/document"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Document</span>
                              </NavLink>
                            </li>
                          )}
                        {isActionExist(
                          "employee",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/employeeList"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Employee</span>
                              </NavLink>
                            </li>
                          )}
                        {/* <li>
                    <NavLink
                      to="/master/empShift"
                      className="menu-link menu-list-link"
                    >
                      <span className="hide-menu">EmpShift</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/master/employeeShift"
                      className="menu-link menu-list-link"
                    >
                      <span className="hide-menu">EmployeeShift</span>
                    </NavLink>
                  </li> */}
                        {isActionExist(
                          "shift-assign-to-employee",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/empShiftList"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">
                                  Shift Assign to Employee
                                </span>
                              </NavLink>
                            </li>
                          )}
                        {/* <li>
                    <NavLink
                      to="/master/empShiftListtable"
                      className="menu-link menu-list-link"
                    >
                      <span className="hide-menu">
                        Employee Shift List Table
                      </span>
                    </NavLink>
                  </li> */}
                      </ul>
                    </li>
                  )}
                {isParentExist(
                  "ledgers",
                  this.props.userPermissions
                ) && (
                    <li>
                      <a
                        href="#."
                        class="menu-link mega-menu-link"
                        aria-haspopup="true"
                      >
                        Ledgers
                      </a>
                      <ul class="menu menu-list">
                        {isActionExist(
                          "ledger-list",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/ledger/ledger-list"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Ledger List</span>
                              </NavLink>
                            </li>
                          )}
                        {isActionExist(
                          "ledger-group",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/ledger/ledger-group"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Ledger Group</span>
                              </NavLink>
                            </li>
                          )}

                        {/* <li>
                    <NavLink
                      to="/master/empShift"
                      className="menu-link menu-list-link"
                    >
                      <span className="hide-menu">EmpShift</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/master/employeeShift"
                      className="menu-link menu-list-link"
                    >
                      <span className="hide-menu">EmployeeShift</span>
                    </NavLink>
                  </li> */}

                        {/* <li>
                    <NavLink
                      to="/master/empShiftListtable"
                      className="menu-link menu-list-link"
                    >
                      <span className="hide-menu">
                        Employee Shift List Table
                      </span>
                    </NavLink>
                  </li> */}
                      </ul>
                    </li>
                  )}
                {isParentExist(
                  "salary-configuration",
                  this.props.userPermissions
                ) && (
                    <li>
                      <a
                        href="#."
                        class="menu-link mega-menu-link"
                        aria-haspopup="true"
                      >
                        Salary Configuration
                      </a>
                      <ul class="menu menu-list">
                        {/* <li>
                    <NavLink
                      to="/master/masterPayhead"
                      className="menu-link menu-list-link"
                    >
                      <span className="hide-menu">Master Payhead</span>
                    </NavLink>
                  </li> */}
                        {isActionExist(
                          "payhead",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/payhead"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Payhead</span>
                              </NavLink>
                            </li>
                          )}
                        {/* {isActionExist(
                          "allowance",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/allowance"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Allowance</span>
                              </NavLink>
                            </li>
                          )} */}
                        {isActionExist(
                          "deduction",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/deduction"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu"> Deduction </span>
                              </NavLink>
                            </li>
                          )}
                      </ul>
                    </li>
                  )}
                {isParentExist(
                  "job-management",
                  this.props.userPermissions
                ) && (
                    <li>
                      <a
                        href="#."
                        class="menu-link mega-menu-link"
                        aria-haspopup="true"
                      >
                        Jobs Management
                      </a>
                      <ul class="menu menu-list">
                        {isActionExist(
                          "machine",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/machine"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Machine</span>
                              </NavLink>
                            </li>
                          )}
                        {isActionExist(
                          "item-creation",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/job"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Item Creation</span>
                              </NavLink>
                            </li>
                          )}
                        {isActionExist(
                          "operation",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/jobOperation"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Operation </span>
                              </NavLink>
                            </li>
                          )}
                        {/* <li>
                    <NavLink
                      to="/master/inspection"
                      className="menu-link menu-list-link"
                    >
                      <span className="hide-menu">Inspection</span>
                    </NavLink>
                  </li> */}
                        {isActionExist(
                          "operation-parameter",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/operationParameter"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">
                                  Operation Parameter
                                </span>
                              </NavLink>
                            </li>
                          )}
                        {isActionExist(
                          "work-break",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/break"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Work Break</span>
                              </NavLink>
                            </li>
                          )}
                        {isActionExist(
                          "instrument",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/instrument"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Instrument</span>
                              </NavLink>
                            </li>
                          )}
                        {isActionExist(
                          "checking-frequency",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/checkingFrequency"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">
                                  Checking Frequency
                                </span>
                              </NavLink>
                            </li>
                          )}
                        {isActionExist(
                          "control-method",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/controlMethod"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Control Method</span>
                              </NavLink>
                            </li>
                          )}
                        {isActionExist(
                          "action",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/action"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Action</span>
                              </NavLink>
                            </li>
                          )}
                        {isActionExist(
                          "tool-mgmt",
                          "view",
                          this.props.userPermissions
                        ) && (
                            <li>
                              <NavLink
                                to="/master/toolMgmt"
                                className="menu-link menu-list-link"
                              >
                                <span className="hide-menu">Tool Mgmt</span>
                              </NavLink>
                            </li>
                          )}
                      </ul>
                    </li>
                  )}
                {isParentExist("users", this.props.userPermissions) && (
                  <li>
                    <a
                      href="#."
                      class="menu-link mega-menu-link"
                      aria-haspopup="true"
                    >
                      Users
                    </a>
                    <ul class="menu menu-list">
                      {isActionExist(
                        "user-role",
                        "view",
                        this.props.userPermissions
                      ) && (
                          <li>
                            <NavLink
                              to="/master/role"
                              className="menu-link menu-list-link"
                            >
                              <span className="hide-menu">User Role</span>
                            </NavLink>
                          </li>
                        )}
                      {isActionExist(
                        "user-creation",
                        "view",
                        this.props.userPermissions
                      ) && (
                          <li>
                            <NavLink
                              to="/master/users"
                              className="menu-link menu-list-link"
                            >
                              <span className="hide-menu">User Creation</span>
                            </NavLink>
                          </li>
                        )}

                      {isActionExist(
                        "push-message",
                        "view",
                        this.props.userPermissions
                      ) && (
                          <li>
                            <NavLink
                              to="/master/pushmessage"
                              className="menu-link menu-list-link"
                            >
                              <span className="hide-menu">Push Message</span>
                            </NavLink>
                          </li>
                        )}
                    </ul>
                  </li>
                )}
              </ul>
            </li>
          )}
          {isParentExist("leave-configuration", this.props.userPermissions) && (
            <li>
              <a href="#." class="menu-link menu-bar-link" aria-haspopup="true">
                Leave Configuration
              </a>
              <ul class="mega-menu mega-menu--multiLevel">
                {isActionExist(
                  "leave-type",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/leaves/leaveType"
                        className="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Leave Type</span>
                      </NavLink>
                    </li>
                  )}
                {isActionExist(
                  "employee-leaves",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/leaves/employeeLeaves"
                        className="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Employee Leaves</span>
                      </NavLink>
                    </li>
                  )}
                {/* <li>
                <NavLink
                  to="/leaves/leaveTypeemp"
                  className="menu-link mega-menu-link"
                >
                  <span className="hide-menu">Leave Type Emp</span>
                </NavLink>
              </li> */}
                {/* <li>
                <NavLink
                  to="/leaves/employeeLeavenewpage"
                  className="menu-link mega-menu-link"
                >
                  <span className="hide-menu">Employee Leaves New</span>
                </NavLink>
              </li> */}
              </ul>
            </li>
          )}

          {isParentExist("account-entry", this.props.userPermissions) && (
            <li>
              <a href="#." class="menu-link menu-bar-link" aria-haspopup="true">
                Account Entry
              </a>
              <ul class="mega-menu mega-menu--multiLevel">
                {isActionExist(
                  "receipt",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/receipt"
                        className="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Receipt</span>
                      </NavLink>
                    </li>
                  )}
                {isActionExist(
                  "payment",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/payment"
                        className="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Payment</span>
                      </NavLink>
                    </li>
                  )}

                {isActionExist(
                  "contra",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/contra"
                        className="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Contra</span>
                      </NavLink>
                    </li>
                  )}

                {isActionExist(
                  "journal",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/journal"
                        className="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Journal</span>
                      </NavLink>
                    </li>
                  )}

                {isActionExist(
                  "payroll",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink to="/payroll" class="menu-link mega-menu-link">
                        <span className="hide-menu">Payroll</span>
                      </NavLink>
                    </li>
                  )}
                {/* {isActionExist(
                  "payroll",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink to="/allocations" class="menu-link mega-menu-link">
                        <span className="hide-menu">Allocations</span>
                      </NavLink>
                    </li>
                  )} */}
                {/* <li>
                <NavLink
                  to="/leaves/leaveTypeemp"
                  className="menu-link mega-menu-link"
                >
                  <span className="hide-menu">Leave Type Emp</span>
                </NavLink>
              </li> */}
                {/* <li>
                <NavLink
                  to="/leaves/employeeLeavenewpage"
                  className="menu-link mega-menu-link"
                >
                  <span className="hide-menu">Employee Leaves New</span>
                </NavLink>
              </li> */}
              </ul>
            </li>
          )}

          {isParentExist("advance-payments", this.props.userPermissions) && (
            <li>
              <NavLink
                to="/advancePayments"
                className="menu-link menu-bar-link"
                aria-haspopup="false"
              >
                <span className="hide-menu">Advance Payments</span>
              </NavLink>
            </li>
          )}
          {/* <li>
            <NavLink
              to="/attendance"
              className="menu-link menu-bar-link"
              aria-haspopup="false"
            >
              <span className="hide-menu">Attendance</span>
            </NavLink>
          </li> */}
          {isParentExist("attendance", this.props.userPermissions) && (
            <li>
              <a href="#." class="menu-link menu-bar-link" aria-haspopup="true">
                Attendance
              </a>
              <ul class="mega-menu mega-menu--multiLevel">
                {isActionExist(
                  "today-s",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/attendance2"
                        className="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Today's</span>
                      </NavLink>
                    </li>
                  )}

                {isActionExist(
                  "manual-attendance",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/ManualAttendanceList"
                        className="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Manual Attendance</span>
                      </NavLink>
                    </li>
                  )}

                {isActionExist(
                  "late-attendance",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/LateAttendance"
                        className="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Late Attendance</span>
                      </NavLink>
                    </li>
                  )}


                {isActionExist(
                  "manual-process",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/manualprocess"
                        className="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Manual Process</span>
                      </NavLink>
                    </li>
                  )}
                {/* <li>
                <NavLink
                  to="/attendanceHistory"
                  className="menu-link mega-menu-link"
                >
                  <span className="hide-menu">History</span>
                </NavLink>
              </li> */}
                {isActionExist(
                  "yearly-presenty",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/EmpYearlyPresenty"
                        class="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Yearly Presenty</span>
                      </NavLink>
                    </li>
                  )}
                {isActionExist(
                  "monthly-presenty",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/empmonthlypresenty"
                        class="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Monthly Presenty</span>
                      </NavLink>
                    </li>
                  )}
                {isActionExist(
                  "yearly-absent",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/EmpYearlyAbsent"
                        class="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Yearly Absent</span>
                      </NavLink>
                    </li>
                  )}
                {isActionExist(
                  "emp-salary-slip",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/empsalaryslip"
                        class="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Emp Salary Slip</span>
                      </NavLink>
                    </li>
                  )}
              </ul>
            </li>
          )}

          {isParentExist("reports", this.props.userPermissions) && (
            <li>
              <a href="#." class="menu-link menu-bar-link" aria-haspopup="true">
                Reports
              </a>
              <ul class="mega-menu mega-menu--multiLevel">
                
                {isActionExist(
                  "salary-reports",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/reports/salaryReport"
                        className="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Salary Reports</span>
                      </NavLink>
                    </li>
                  )}

              </ul>
            </li>
          )}
          {/* {isParentExist("reports", this.props.userPermissions) && (
            <li>
              <a href="#." class="menu-link menu-bar-link" aria-haspopup="true">
                Reports
              </a>
              <ul class="mega-menu mega-menu--multiLevel">
                {isActionExist(
                  "employee-attendance-history",
                  "view",
                  this.props.userPermissions
                ) && (
                    <>
                      <li>
                        <NavLink
                          to="/attendanceHistory"
                          class="menu-link mega-menu-link"
                        >
                          <span className="hide-menu">
                            Employee Attendance History
                          </span>
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to="/salaryReport"
                          class="menu-link mega-menu-link"
                        >
                          <span className="hide-menu">
                            Salary Reports
                          </span>
                        </NavLink>
                      </li>

                    </>

                  )}

                {isActionExist(
                  "machine-wise-production",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/machineReport"
                        class="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Machine Wise Production</span>
                      </NavLink>
                    </li>
                  )}
                {isActionExist(
                  "item-wise-production",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink to="/itemReport" class="menu-link mega-menu-link">
                        <span className="hide-menu">Item Wise Production</span>
                      </NavLink>
                    </li>
                  )}
                {isActionExist(
                  "employee-salary-sheet",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/empsalarysheet"
                        class="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Employee Salary Sheet</span>
                      </NavLink>
                    </li>
                  )}
                {isActionExist(
                  "line-inspection-report",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/inspectionReport"
                        class="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Line Inspection Report</span>
                      </NavLink>
                    </li>
                  )}
                {isActionExist(
                  "final-inspection-report",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/finalInspectionReport"
                        class="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Final Inspection Report</span>
                      </NavLink>
                    </li>
                  )}
                {isActionExist(
                  "rejection-report",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/rejection-report"
                        class="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Rejection Report</span>
                      </NavLink>
                    </li>
                  )}
                {isActionExist(
                  "emp-salary-report",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/emp-salary-report"
                        class="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Employee Salary Report</span>
                      </NavLink>
                    </li>
                  )}
                {isActionExist(
                  "emp-earning-report",
                  "view",
                  this.props.userPermissions
                ) && (
                    <li>
                      <NavLink
                        to="/emp-earning-report"
                        class="menu-link mega-menu-link"
                      >
                        <span className="hide-menu">Employee Earning Report</span>
                      </NavLink>
                    </li>
                  )}
              </ul>
            </li>
          )} */}
          {/* <li>
            <NavLink to="#." class="menu-link menu-bar-link">
              <span className="hide-menu"> Salary Slip</span>
            </NavLink>
          </li> */}
        </ul>
      </nav>
    );
  }
}

export default WithUserPermission(CustomNav);
