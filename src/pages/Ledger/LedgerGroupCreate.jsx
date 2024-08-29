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
  getSelectValue,
} from "@/helpers";
import Select from "react-select";
import {
  getUnderList,
  createAssociateGroup,
  getAssociateGroups,
  delete_ledger_group,
  updateAssociateGroup,
} from "@/services/api_function";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import delete_icon from "@/assets/images/delete_icon3.png";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

class LedgerGroupCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      sumData: "",
      empEarningData: [],
      underList: [],
      associategroupslst: [],
      initValue: {
        associates_id: "",
        associates_group_name: "",
        underId: "",
      },
    };
  }

  // lstUnders = () => {
  //   getUnderList()
  //     .then((response) => {
  //       let res = response.data;
  //       if (res.responseStatus == 200) {
  //         console.log("underList : ", res);
  //         let result = res.responseObject;
  //         let opt1 = [];
  //         result.map(function (data) {
  //           opt1.push({
  //             value: data.principle_id,
  //             label: data.principle_name,
  //           });
  //         });
  //         this.setState({ underList: opt1 });
  //       } else {
  //         this.setState({ underList: [] });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // };

  pageReload = () => {
    this.componentDidMount();
  };
  handleKeyDown = (event) => {
    event.stopPropagation();

    const { rowVirtualizer, config, id } = this.tableManager.current;
    const { scrollToOffset, scrollToIndex } = rowVirtualizer;
    const { header } = config.additionalProps;
    const { currentScrollPosition, setcurrentscrollposition } = header;
    let scrollPosition = 0;
    switch (event.key) {
      case "ArrowUp":
        let elem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
        if (elem != undefined && elem != null) {
          let up_row_id = elem.getAttribute("data-row-id");
          let up_id = elem.getAttribute("data-row-index");
          let uprowIndex = parseInt(up_id) - 1;

          if (uprowIndex > 0) {
            document
              .querySelectorAll(`#${id} .rgt-row-focus`)
              .forEach((cell) => cell.classList.remove("rgt-row-focus"));

            document
              .querySelectorAll(`#${id} .rgt-row-${uprowIndex}`)
              .forEach((cell) => cell.classList.add("rgt-row-focus"));
            scrollToIndex(uprowIndex - 3);
          }
        }

        break;

      case "ArrowDown":
        let downelem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
        if (downelem != undefined && downelem != null) {
          let d_id = downelem.getAttribute("data-row-index");
          let rowIndex = parseInt(d_id) + 1;

          document
            .querySelectorAll(`#${id} .rgt-row-focus`)
            .forEach((cell) => cell.classList.remove("rgt-row-focus"));
          document // const customStyles = {
            //   control: (base) => ({
            //     ...base,
            //     height: 31,
            //     minHeight: 31,
            //     border: 'none',
            //     borderBottom: '1px solid #ccc',
            //     fontSize: '13px',
            //     //paddingBottom: "12px",
            //     boxShadow: 'none',
            //     //lineHeight: "20px",
            //   }),
            // };
            .querySelectorAll(`#${id} .rgt-row-${rowIndex}`)
            .forEach((cell) => cell.classList.add("rgt-row-focus"));
          scrollToIndex(rowIndex + 2);
        }
        break;
      case "e":
        if (id != undefined && id != null) {
          let downelem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
          if (downelem != undefined && downelem != null) {
            let d_index_id = downelem.getAttribute("data-row-index");
            let data_id = downelem.getAttribute("data-row-id");

            let rowIndex = parseInt(d_index_id) + 1;

            this.setUpdateValue(data_id);
          }
        }
        break;

      default:
        break;
    }
  };

  lstUnders = () => {
    getUnderList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          let Opt = data.map((v, i) => {
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
          this.setState({ underList: Opt });
        }
      })
      .catch((error) => {
        this.setState({ underList: [] });
      });
  };

  componentDidMount() {
    this.lstUnders();
    this.lstAssociateGroups();
  }

  setInitValue = () => {
    let initValue = {
      associates_id: "",
      underId: "",
      associates_group_name: "",
    };

    this.setState({ initValue: initValue });
  };

  lstAssociateGroups = () => {
    getAssociateGroups()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              associategroupslst: res.responseObject,
              orgData: res.responseObject,
            }
            // () => {
            //   this.associatesRef.current.setFieldValue("search", "");
            // }
          );
        }
      })
      .catch((error) => {});
  };

  handleSearch = (vi) => {
    this.setState({ search: vi }, () => {
      let { orgData } = this.state;
      console.log({ orgData });
      let orgData_F = orgData.filter(
        (v) =>
          (v.associates_name != null &&
            v.foundation_name != null &&
            v.principle_name != null &&
            v.subprinciple_name != null &&
            v.associates_name.toLowerCase().includes(vi.toLowerCase())) ||
          v.foundation_name.toLowerCase().includes(vi.toLowerCase()) ||
          v.principle_name.toLowerCase().includes(vi.toLowerCase()) ||
          v.subprinciple_name.toLowerCase().includes(vi.toLowerCase())
      );

      if (vi.length == 0) {
        this.setState({
          associategroupslst: orgData,
        });
      } else {
        this.setState({
          associategroupslst: orgData_F.length > 0 ? orgData_F : [],
        });
      }
    });
  };

  deleteledgergroup = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_ledger_group(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          toast.success("✔ " + res.message);
          // resetForm();
          // this.initRow();
          this.componentDidMount();
        } else {
          toast.error("✘ No Data Found" + res.message);
        }
      })
      .catch((error) => {
        this.setState({ associategroupslst: [] });
      });
  };
  setUpdateValue = (data) => {
    let { underList } = this.state;
    let underOptID;
    if (data.under_prefix_separator == "P") {
      underOptID = getSelectValue(underList, data.principle_id);
    } else if (data.under_prefix_separator == "PG") {
      underOptID = getSelectValue(
        underList,
        data.principle_id + "_" + data.sub_principle_id
      );
    } else if (data.under_prefix_separator == "AG") {
      underOptID = getSelectValue(
        underList,
        data.principle_id + "_" + data.sub_principle_id + "_" + data.under_id
      );
    }

    let initValue = {
      associates_id: data.associates_id,
      associates_group_name: data.associates_name,
      underId: underOptID,
    };
    this.setState({ initValue: initValue, opendiv: true });
  };

  render() {
    const {
      isLoading,
      itemData,
      mainData,
      empEarningData,
      sumData,
      underList,
      associategroupslst,
      initValue,
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
              <CardTitle className="text-dark">Ledger Group</CardTitle>

              <Formik
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
                // onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                //   this.setState({
                //     isLoading: true,
                //     sumData: "",
                //     empEarningData: [],
                //   });
                //   setStatus();
                //   let requestData = new FormData();
                //   requestData.append("associates_group_name", values.fromDate);
                //   if (values.underId != null) {
                //     requestData.append(
                //       "principle_id",
                //       values.underId ? values.underId.principle_id : ""
                //     );
                //   }

                //   if (
                //     values.underId != null &&
                //     values.underId.sub_principle_id != ""
                //   ) {
                //     requestData.append(
                //       "sub_principle_id",
                //       values.underId
                //         ? values.underId.sub_principle_id
                //           ? values.underId.sub_principle_id
                //           : ""
                //         : ""
                //     );
                //   }

                //   if (
                //     values.underId != null &&
                //     values.underId.under_prefix != ""
                //   ) {
                //     requestData.append(
                //       "under_prefix",
                //       values.underId ? values.underId.under_prefix : ""
                //     );
                //   }

                //   getEmployeeEarningReport(requestData)
                //     .then((response) => {
                //       var result = response.data;
                //       console.log("result.response", result.empEarningData);
                //       if (result.responseStatus == 200) {
                //         setSubmitting(false);
                //         this.setState({
                //           isLoading: false,
                //           empEarningData: result.empEarningData,
                //           sumData: result.sumData,
                //         });
                //         toast.success("✔ " + result.message);
                //       } else {
                //         setSubmitting(false);
                //         this.setState({
                //           isLoading: false,
                //           empEarningData: [],
                //           sumData: [],
                //         });
                //         toast.error("✘ No Data Found");
                //       }
                //     })
                //     .catch((error) => {
                //       setSubmitting(false);
                //       toast.error("✘ " + error);
                //     });
                // }}
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
                      "ledger-group",
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
                        {/*                       
                        {isLoading ? (
                          <Button
                            className="mainbtn1 text-white mr-2 report-show-btn"
                            type="button"
                            disabled={isSubmitting}
                          >
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            Loading...
                          </Button>
                        ) : (
                          isActionExist(
                            "emp-earning-report",
                            "view",
                            this.props.userPermissions
                          ) && ( */}
                        <Button
                          type="submit"
                          className="mainbtn1 text-white mr-2 report-show-btn"
                        >
                          Submit
                        </Button>

                        {/* )
                         )} */}
                        <Button
                          className="mainbtn1 text-white mr-2 report-show-btn"
                          type="reset"
                          // onClick={() => {
                          //   taskRef.current.resetForm();
                          // }}
                        >
                          Clear
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              />
            </div>

            {/* {empEarningData && empEarningData.length > 0 ? ( */}
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
                        <th>Ledger Group</th>
                        <th>Foundation</th>
                        <th>Principle</th>
                        <th>Sub Principle</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      {associategroupslst.length > 0 ? (
                        associategroupslst.map((v, i) => {
                          return (
                            <tr
                              onDoubleClick={(e) => {
                                e.preventDefault();
                                if (
                                  isActionExist(
                                    "ledger-group",
                                    "edit",
                                    this.props.userPermissions
                                  )
                                ) {
                                  this.setUpdateValue(v);
                                } else {
                                  toast.error("Permission is denied!");
                                }
                              }}
                            >
                              {/* <td style={{ width: "20%" }}>{i + 1}</td> */}
                              <td style={{ width: "20%" }}>
                                {v.associates_name}
                              </td>
                              <td style={{ width: "20%" }}>
                                {v.foundation_name}
                              </td>
                              <td style={{ width: "20%" }}>
                                {v.principle_name}
                              </td>
                              <td style={{ width: "20%" }}>
                                {v.subprinciple_name}
                              </td>
                              <td>
                                {" "}
                                <img
                                  src={delete_icon}
                                  style={{
                                    // width: "12%",
                                    margin: "0px 10px 0px 3px",
                                    height: "35px",
                                  }}
                                  title="Delete"
                                  onClick={(e) => {
                                    if (
                                      isActionExist(
                                        "ledger-group",
                                        "delete",
                                        this.props.userPermissions
                                      )
                                    )
                                      this.deleteledgergroup(v.associates_id);
                                    else {
                                      toast.error("Permission is denied!");
                                    }
                                  }}
                                />
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
            {/* )  */}
            {/* : (
              <Row>
                
                <Col md="12">
                  <div className="attendance-tbl">
                    <Table bordered size="sm" className="main-tbl-style">
                      <tr>
                        <td>No Data Exists</td>
                      </tr>
                    </Table>
                  </div>
                </Col>
              </Row>
            ) */}
            {/* } */}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default WithUserPermission(LedgerGroupCreate);
