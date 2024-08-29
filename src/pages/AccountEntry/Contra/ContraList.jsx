import React, { Component, useRef } from "react";
// import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
import moment from "moment";
import Swal from "sweetalert2";
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
  isWriteAuthorized,
  isReadAuthorized,
  getHeader,
  CustomDTHeader,
  WithUserPermission,
  isActionExist,
} from "@/helpers";
import Select from "react-select";
import {
  delete_contra,
  get_contra_list_by_company,
} from "@/services/api_function";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

class ContraList extends Component {
  constructor(props) {
    super(props);
    //get_sundry_debtors_indirect_incomes
    this.state = {
      contraList: [],
      contraData: [],
      currentIndex: 0,
      search: "",
      initValue: {
        associates_id: "",
        associates_group_name: "",
        underId: "",
      },
    };
  }

  pageReload = () => {
    this.componentDidMount();
  };

  componentDidMount() {
    // this.lstUnders();
    this.getCompanyList();
  }

  setInitValue = () => {
    let initValue = {
      associates_id: "",
      underId: "",
      associates_group_name: "",
    };

    this.setState({ initValue: initValue });
  };

  getCompanyList = () => {
    get_contra_list_by_company()
      .then((response) => {
        console.log("getCompanyList:", response);
        let res = response.data ? response.data : [];
        if (res.responseStatus == 200) {
          this.setState({ contraList: res.data, contraData: res.data });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleSearch = (vi) => {
    this.setState({ search: vi }, () => {
      let { contraData } = this.state;
      console.log("handleSearch:", { contraData });
      let contraData_F = contraData.filter(
        (v) =>
          (v.narration != null &&
            v.ledger_name != null &&
            v.contra_code != null &&
            v.narration.toLowerCase().includes(vi.toLowerCase())) ||
          v.ledger_name.toLowerCase().includes(vi.toLowerCase()) ||
          v.contra_code.toLowerCase().includes(vi.toLowerCase())
      );

      if (vi.length == 0) {
        this.setState({
          contraList: contraData,
        });
      } else {
        this.setState({
          contraList: contraData_F.length > 0 ? contraData_F : [],
        });
      }
    });
  };

  onEditModalShow = (status, data, rowIndex) => {
    if (status) {
      this.setState({ currentIndex: rowIndex });
      console.log("onEditmodalshow>>>", data);
      this.props.history.push("/master/contra-edit/" + data.id);
    } else {
      this.setState({ currentIndex: 0 });
    }
  };

  onDeleteModalShow = (id) => {
    // alert(id)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      // icon: "warning",
      customClass: "sweetclass",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (!result.isConfirmed) {
        return false;
      }

      let reqData = new FormData();
      reqData.append("id", id);
      console.log("id==>" + id)
      delete_contra(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            // toast.success("✔ " + response.data.message);
            this.componentDidMount();
          } else {
            // toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          // toast.error("✘ " + error);
        });
    });
  };

  render() {
    const { isLoading, initValue, contraList } = this.state;

    return (
      <div className="emp">
        <Card>
          <CardBody className="border-bottom p-2">
            <div
              style={{
                background: "#cee7f1",
                padding: "10px",
                paddingBottom: "0px",
                marginBottom: "10px",
              }}
            >
              <CardTitle className="text-dark">Contra</CardTitle>
              <Row>
                <Col md="3">
                  <div className="my-2 mx-3">
                    <input
                      style={{ marginBottom: "5px" }}
                      // name="my-search"
                      type="search"
                      // // value={searchText}
                      className="searchinput1"
                      // // onChange={(e) => setSearchText(e.target.value)}
                      // placeholder=" Search For"
                      // type="text"
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
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.history.push(`/contra-create`);
                    }}
                  >
                    Create New
                  </Button>
                </Col>
              </Row>
              {/* <Formik
                validateOnBlur={false}
                validateOnChange={false}
                enableReinitialize={true}
                initialValues={initValue}
                validationSchema={Yup.object().shape({
                  associates_group_name: Yup.string()
                    .trim()
                    .required("Ledger group name is required"),
                  underId: Yup.object()
                    .nullable()
                    .required("Select under type"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let requestData = new FormData();

                  requestData.append(
                    "associates_group_name",
                    values.associates_group_name
                  );

                  if (values.underId != null) {
                    requestData.append(
                      "principle_id",
                      values.underId ? values.underId.principle_id : ""
                    );
                  }

                  if (
                    values.underId != null &&
                    values.underId.sub_principle_id != ""
                  ) {
                    requestData.append(
                      "sub_principle_id",
                      values.underId
                        ? values.underId.sub_principle_id
                          ? values.underId.sub_principle_id
                          : ""
                        : ""
                    );
                  }

                  if (
                    values.underId != null &&
                    values.underId.under_prefix != ""
                  ) {
                    requestData.append(
                      "under_prefix",
                      values.underId ? values.underId.under_prefix : ""
                    );
                  }

                  if (
                    isActionExist(
                      "associate-group",
                      "create",
                      this.props.userPermissions
                    )
                  ) {
                    if (values.associates_id == "") {
                      createAssociateGroup(requestData)
                        .then((response) => {
                          let res = response.data;
                          if (res.responseStatus == 200) {
                            toast.success("✔ " + res.message);
                            resetForm();
                            this.pageReload();
                          } else if (res.responseStatus == 409) {
                            toast.error("✘ No Data Found", res.message);
                          } else {
                            toast.error("Error", res.message);
                          }
                        })
                        .catch((error) => {});
                    } else {
                      requestData.append("associates_id", values.associates_id);

                      updateAssociateGroup(requestData)
                        .then((response) => {
                          let res = response.data;
                          if (res.responseStatus == 200) {
                            toast.success(
                              "✔ Updated Successfully",
                              res.message
                            );
                            this.setInitValue();
                            this.pageReload();
                            resetForm();
                          } else {
                            toast.error("Error", res.message);
                          }
                        })
                        .catch((error) => {});
                    }
                  } else {
                    toast.error("Permission is denied");
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
                    <Row>
                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            Ledger Group <span className="text-danger">*</span>
                          </Label>
                          <Input
                            autoFocus={true}
                            type="text"
                            placeholder="Ledger Group"
                            name="associates_group_name"
                            id="associates_group_name"
                            value={values.associates_group_name}
                            onChange={handleChange}
                          />
                          <span className="text-danger">
                            {errors.associates_group_name}
                          </span>
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Label for="exampleDatetime">
                            Under<span className="text-danger">*</span>
                          </Label>
                          <Select
                            // placeholder="Investments"
                            ////isClearable={true}
                            styles={{
                              clearIndicator: ClearIndicatorStyles,
                            }}
                            onChange={(v) => {
                              setFieldValue("underId", v);
                            }}
                            name="underId"
                            id="underId"
                            options={underList}
                            value={values.underId}
                            invalid={errors.underId ? true : false}
                          />
                          <span className="text-danger errormsg">
                            {errors.underId}
                          </span>
                        </FormGroup>
                      </Col>

                      <Col md="4" style={{ textAlign: "end" }}></Col>
                      <Col md="4" style={{ textAlign: "end" }}>
                        <Button
                          type="submit"
                          className="mainbtn1 text-white mr-2 report-show-btn"
                        >
                          Submit
                        </Button>

                        <Button
                          className="mainbtn1 text-white mr-2 report-show-btn"
                          type="reset"
                          // onClick={() => {
                          //   taskRef.current.resetForm();
                          // }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              /> */}
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
                        <th>Contra No</th>
                        <th>Transaction Date</th>
                        <th>Ledger Name</th>
                        <th>Narration</th>
                        <th>Total Amt</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      {contraList.length > 0 ? (
                        contraList.map((v, i) => {
                          return (
                            <tr>
                              {/* <td style={{ width: "20%" }}>{i + 1}</td> */}
                              <td style={{ width: "20%" }}>{v.contra_code}</td>
                              <td style={{ width: "10%" }}>{v.transaction_dt}</td>
                              <td style={{ width: "20%" }}>{v.ledger_name}</td>
                              <td style={{ width: "20%" }}>{v.narration}</td>
                              <td style={{ width: "15%" }}>{v.total_amount}</td>
                              <td style={{ width: "15%" }}>
                                {/* {" "}
                                <img
                                  src={play}
                                  style={{
                                    // width: "12%",
                                    margin: "0px 10px 0px 3px",
                                    height: "35px",
                                  }}
                                  title="Delete"
                                  onClick={(e) => {
                                    if (
                                      isActionExist(
                                        "account-entry",
                                        "delete",
                                        this.props.userPermissions
                                      )
                                    )
                                      this.doPayrollProcess(v.id);
                                    else {
                                      toast.error("Permission is denied!");
                                    }
                                  }}
                                /> */}
                                {isActionExist(
                                  "contra",
                                  "edit",
                                  this.props.userPermissions
                                ) && (
                                    <Button
                                      title="EDIT"
                                      id="Tooltipedit"
                                      className="edityellowbtn"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.onEditModalShow(true, v, i);
                                      }}
                                    >
                                      <i className="fa fa-edit"></i>
                                    </Button>
                                  )}
                                {isActionExist(
                                  "contra",
                                  "delete",
                                  this.props.userPermissions
                                ) && (
                                    <Button
                                      title="DELETE"
                                      id="Tooltipdelete"
                                      className="deleteredbtn"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.onDeleteModalShow(v.id);
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
                        </tr>
                      )}
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

export default WithUserPermission(ContraList);
