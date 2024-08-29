import React, { Component, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
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
  getSelectValue,
  LoadingComponent,
  eventBus,
} from "@/helpers";
import Select from "react-select";
// import { getLedgers, delete_ledger } from "@/services/api_function";
// import { getLedgers } from "@/services/api_function";
import { getLedgers } from "@/services/api_function";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import delete_icon from "@/assets/images/delete_icon3.png";
import LedgerEdit from "./LedgerEdit";
import { delete_ledger } from "../../services/api_function/ledger.service";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

class LedgerList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      lstLedger: [],
      lstLedgerFiltered: [],
      isLedgerFilterd: true,
      showloader: false,
      orgData: [],
      totalDr: 0,
      totalCr: 0,
      search: "",
    };
  }

  pageReload = () => {
    this.componentDidMount();
  };

  getlstLedger = () => {
    // this.setState({ showloader: true });
    getLedgers()
      .then((response) => {
        console.log(response);
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              lstLedger: res.responseList,
              orgData: res.responseList,
              showloader: false,
              search: "",
            },
            () => {
              this.getFilterLstLedger();
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  getFilterLstLedger = () => {
    let { isLedgerFilterd, lstLedger } = this.state;

    if (lstLedger.length > 0) {
      let filterLst = lstLedger;
      if (isLedgerFilterd) {
        filterLst = filterLst.filter(
          (v) => v.dr > 0 || v.cr > 0 || v.rdr > 0 || v.rcr > 0
        );
      }
      this.setState({ lstLedgerFiltered: filterLst });
    }
  };

  componentDidMount() {
    this.getlstLedger();
  }

  handleSearch = (vi) => {
    console.log({ vi });
    this.setState({ search: vi }, () => {
      let { orgData } = this.state;
      console.log({ orgData });
      let orgData_F = orgData.filter(
        (v) =>
          (v.foundations_name != null &&
            v.principle_name != null &&
            v.subprinciple_name != null &&
            v.ledger_name != null &&
            v.dr != null &&
            v.cr != null &&
            v.foundations_name.toLowerCase().includes(vi.toLowerCase())) ||
          v.principle_name.toLowerCase().includes(vi.toLowerCase()) ||
          v.subprinciple_name.toLowerCase().includes(vi.toLowerCase()) ||
          v.ledger_name.toLowerCase().includes(vi.toLowerCase()) ||
          v.dr.toString().includes(vi) ||
          v.cr.toString().includes(vi)
      );
      if (vi.length == 0) {
        this.setState({
          lstLedger: orgData,
        });
      } else {
        this.setState({
          lstLedger: orgData_F.length > 0 ? orgData_F : [],
        });
      }
    });
  };

  deleteledger = (id) => {
    // let formData = new FormData();
    // formData.append("id", id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      // icon: "warning",
      customClass: "sweetclass",
      showgitButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (!result.isConfirmed) {
        return false;
      }

      // let reqData = {
      //   id: id,
      // };
      let formData = new FormData();
      formData.append("id", id);
      delete_ledger(formData)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            toast.success("✔ " + res.message);
            this.getlstLedger();

            resetForm();
            this.initRow();
            this.componentDidMount();
          } else {
            toast.error("✘ No Data Found" + res.message);
          }
        })
        .catch((error) => {
          this.setState({ lstLedger: [] });
        });
    });
  };

  onViewShow = (status, data, rowIndex) => {
    if (status) {
      this.setState({ currentIndex: rowIndex });
      this.props.history.push("/master/ledger/ledger-view/" + data.id);
    } else {
      this.setState({ currentIndex: 0 });
    }
  };

  render() {
    const {
      isLoading,
      itemData,
      mainData,
      empEarningData,
      sumData,
      lstLedger,
      associategroupslst,
      initValue,
      showloader,
      lstLedgerFiltered,
      isLedgerFilterd,
      totalDr,
      totalCr,
      search,
    } = this.state;

    return (
      <div className="emp">
        <Card>
          <CardBody className="border-bottom p-2">
            <div
              style={{
                background: "#cee7f1",
                padding: "10px",
                paddingBottom: "0px",
                marginBottom: "5px",
              }}
            >
              <CardTitle className="text-dark">Ledger</CardTitle>
              <Row className="py-2">
                <Col md="3">
                  <div className="">
                    <Input
                      type="search"
                      className="searchinput1"
                      name="Search"
                      id="Search"
                      onChange={(e) => {
                        let v = e.target.value;
                        console.log({ v });
                        this.handleSearch(v);
                      }}
                      placeholder="Search"
                    />
                  </div>
                </Col>
                <Col md="9" style={{ textAlign: "end" }}>
                  <Button
                    className="mainbtn1 text-white report-show-btn"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.history.push(`/master/ledger/ledger-create`);
                    }}
                  >
                    Create New
                  </Button>
                </Col>
              </Row>
            </div>
            <Row>
              <Col md="12">
                <div className="attendance-tbl">
                  <Table bordered size="sm" className="main-tbl-style">
                    <thead
                      style={{
                        backgroundColor: "#F6F5F7",
                      }}
                      className="datastyle-head"
                    >
                      <tr>
                        {/* <th className="th-style" style={{ zIndex: 99 }}></th> */}
                        <th>Ledger Name</th>
                        <th>Foundation</th>
                        <th>Principle</th>
                        <th>Sub Principle</th>
                        <th>Debit</th>
                        <th>Credit</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {lstLedger.length > 0 ? (
                        lstLedger.map((v, i) => {
                          return (
                            <tr
                              onDoubleClick={(e) => {
                                e.preventDefault();
                                console.log("click", v);
                                this.props.history.push({
                                  pathname: "/master/ledger/ledger-edit/",
                                  state: { id: v.id },
                                });
                              }}
                            >
                              {/* <td style={{ width: "20%" }}>{i + 1}</td> */}
                              <td style={{ width: "20%" }}>{v.ledger_name}</td>
                              <td style={{ width: "20%" }}>
                                {v.foundations_name}
                              </td>
                              <td style={{ width: "20%" }}>
                                {v.principle_name}
                              </td>
                              <td style={{ width: "20%" }}>
                                {v.subprinciple_name}
                              </td>
                              <td style={{ width: "10%" }}>{v.dr}</td>
                              <td style={{ width: "10%" }}>{v.cr}</td>
                              <td style={{ width: "10%" }}>
                                {isActionExist(
                                  "ledger-list",
                                  "view",
                                  this.props.userPermissions
                                ) && (
                                  <Button
                                    title="view"
                                    id="Tooltipedit"
                                    className="edityellowbtn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.onViewShow(true, v, i);
                                    }}
                                  >
                                    <i
                                      className="fa fa-eye"
                                      style={{ color: "green" }}
                                    />
                                  </Button>
                                )}
                                {isActionExist(
                                  "ledger-list",
                                  "delete",
                                  this.props.userPermissions
                                ) && (
                                  <Button
                                    title="DELETE"
                                    id="Tooltipdelete"
                                    className="deleteredbtn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.deleteledger(v.id);
                                    }}
                                  >
                                    <i className="fa fa-trash"></i>
                                  </Button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center">
                            No Data Found
                          </td>
                          {showloader == true && LoadingComponent(showloader)}
                        </tr>
                      )}
                      {/* {empEarningData.map((v, i) => {
                          return (
                            <>
                              <tr>
                                <td>{v.employeeName}</td>
                                <td>{parseFloat(v.hourSalary).toFixed(2)}</td>
                                <td>{parseFloat(v.pieceSalary).toFixed(2)}</td>
                                <td>{parseFloat(v.daySalary).toFixed(2)}</td>
                                <td>{parseFloat(v.pointSalary).toFixed(2)}</td>
                              </tr>
                            </>
                          );
                        })} */}
                      {/* <tr>
                          <td style={{ fontWeight: "bold" }}>TOTAL</td>
                          <td style={{ fontWeight: "bold" }}>
                            {parseFloat(sumData.hourSum).toFixed(2)}
                          </td>
                          <td style={{ fontWeight: "bold" }}>
                            {parseFloat(sumData.pieceSum).toFixed(2)}
                          </td>
                          <td style={{ fontWeight: "bold" }}>
                            {parseFloat(sumData.daySum).toFixed(2)}
                          </td>
                          <td style={{ fontWeight: "bold" }}>
                            {parseFloat(sumData.pointSum).toFixed(2)}
                          </td>
                        </tr> */}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default WithUserPermission(LedgerList);
