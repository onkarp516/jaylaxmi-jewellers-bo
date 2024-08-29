import React, { Component } from "react";
import GridTable from "@nadavshaar/react-grid-table";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import {
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  InputGroup,
  FormFeedback,
  Row,
  Col,
  Spinner,
  Table,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import {
  getSelectValue,
  isWriteAuthorized,
  isReadAuthorized,
  CustomDTHeader,
  getHeader,
  WithUserPermission,
  isActionExist,
} from "@/helpers";
import { DTOperationParameterUrl } from "@/services/api";
import {
  listOfJobsForSelect,
  jobOperationList,
  listJobOperation,
  ActionList,
  createOperationParameter,
  findOperationParameter,
  updateOperationParameter,
  deleteOperationParameter,
  CheckingFrequencyList,
  InstrumentList,
  ControlMethodList,
} from "@/services/api_function";
import delete_ from "@/assets/images/delete_.png";

import axios from "axios";

const ActionsCellRender = ({
  tableManager,
  value,
  field,
  data,
  column,
  colIndex,
  rowIndex,
  props,
}) => {
  const { additionalProps } = tableManager.config;
  const { header } = additionalProps;
  const { currentIndex, onEditModalShow, onDeleteModalShow, userPermissions } =
    header;
  return (
    <>
      {currentIndex === rowIndex ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : (
        isActionExist("operation-parameter", "edit", userPermissions) && (
          <Button
            title="EDIT"
            id="Tooltipedit"
            className="edityellowbtn"
            onClick={(e) => {
              e.preventDefault();
              onEditModalShow(true, data.operationParameterId, rowIndex);
            }}
          >
            <i className="fa fa-edit"></i>
          </Button>
        )
      )}
      {isActionExist("operation-parameter", "delete", userPermissions) && (
        <Button
          title="DELETE"
          id="Tooltipdelete"
          className="deleteredbtn"
          onClick={(e) => {
            e.preventDefault();
            onDeleteModalShow(data.operationParameterId);
          }}
        >
          <i className="fa fa-trash"></i>
        </Button>
      )}
    </>
  );
};

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});
class OperationParameter extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.state = {
      refresh: true,
      addModalShow: false,
      editModalShow: false,
      isLoading: false,
      currentIndex: 0,
      operationParameterObject: "",
      jobOpts: [],
      jobOperationOpts: [],
      actionOpts: [],
      inspectionList: [],
      selectedJobName: "",
      selectedOperationName: "",
      operationOpts: [],
      frequencyOpt: [],
      instrumentOpt: [],
      controlOpt: [],

      selectedJobId: "",
      selectedOpId: "",
    };
  }
  setTableManager = (tm) => (this.tableManager.current = tm);
  addBtn = isWriteAuthorized("master", "designationPermission") &&
    isActionExist(
      "operation-parameter",
      "create",
      this.props.userPermissions
    ) && (
      <>
        <button
          title="CREATE"
          onClick={(e) => {
            e.preventDefault();
            this.onAddModalShow(true);
          }}
        >
          <i className="fa fa-plus"></i>
        </button>
      </>
    );

  onRowsRequest = async (requestData, tableManager) => {
    const { selectedJobName, selectedOperationName } = this.state;
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
      selectedJobName: selectedJobName,
      selectedOperationName: selectedOperationName,
    };

    const response = await axios({
      url: DTOperationParameterUrl(),
      method: "POST",
      headers: getHeader(),
      data: JSON.stringify(req),
    })
      .then((response) => response.data)
      .catch((e) => {
        console.log("e--->", e);
      });

    if (!response?.rows) return;

    return {
      rows: response.rows,
      totalRows: response.totalRows,
    };
  };

  onAddModalShow = (status) => {
    this.setState({ addModalShow: status, inspectionList: [] });
  };

  onEditModalShow = (status, id, rowIndex) => {
    if (status) {
      this.setState({ currentIndex: rowIndex });
      let reqData = {
        id: id,
      };
      findOperationParameter(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            let result = response.data.response;

            let jobId = result.jobId;
            let job_opt = getSelectValue(
              this.state.jobOpts,
              parseInt(result.jobId)
            );
            result.jobId = job_opt;

            let action_opt = getSelectValue(
              this.state.actionOpts,
              parseInt(result.actionId)
            );
            result.actionId = action_opt;
            result.instrumentUsed = getSelectValue(
              this.state.instrumentOpt,
              parseInt(result.instrumentUsedId)
            );

            result.checkingFrequency = getSelectValue(
              this.state.frequencyOpt,
              parseInt(result.checkingFrequencyId)
            );

            result.controlMethod = getSelectValue(
              this.state.controlOpt,
              parseInt(result.controlMethodId)
            );
            this.getJobOperationList(jobId, result);
          } else {
            this.setState({
              currentIndex: 0,
            });
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          console.log("errors", error);
        });
    } else {
      this.setState({ editModalShow: status, currentIndex: 0 });
    }
  };

  onDeleteModalShow = (id) => {
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
      deleteOperationParameter(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            toast.success("✔ " + response.data.message);

            this.tableManager.current.asyncApi.resetRows();
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          toast.error("✘ " + error);
        });
    });
  };

  getJobList = () => {
    listOfJobsForSelect()
      .then((response) => {
        let jobOpts =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.jobName,
            };
          });
        this.setState({ jobOpts: jobOpts });
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  getJobOperationList = (jobId, values = null) => {
    let reqData = {
      jobId: jobId,
    };
    listJobOperation(reqData)
      .then((response) => {
        let jobOperationOp =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.operationName,
            };
          });
        this.setState({ jobOperationOpts: jobOperationOp });

        if (values != null && values.jobOperationId) {
          let jobOperationOpt =
            values.jobOperationId != ""
              ? getSelectValue(jobOperationOp, values.jobOperationId)
              : "";

          values.jobOperationId = jobOperationOpt;
          this.setState({
            operationParameterObject: values,
            editModalShow: true,
            currentIndex: 0,
          });
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  frequencyListFun = () => {
    CheckingFrequencyList()
      .then((response) => {
        let freqOp =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.checkingFrequencyLabel,
            };
          });
        this.setState({ frequencyOpt: freqOp });
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  instrumentListFun = () => {
    InstrumentList()
      .then((response) => {
        let instrumentOp =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.name,
            };
          });
        this.setState({ instrumentOpt: instrumentOp });
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  controlListFun = () => {
    ControlMethodList()
      .then((response) => {
        let controlOp =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.controlMethodLabel,
            };
          });
        this.setState({ controlOpt: controlOp });
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  componentDidMount() {
    this.getJobList();
    this.getActionList();
    this.frequencyListFun();
    this.instrumentListFun();
    this.controlListFun();
  }

  getActionList = () => {
    ActionList()
      .then((response) => {
        let actionOpts =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.actionName,
            };
          });
        this.setState({ actionOpts: actionOpts });
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  addLineInpect = (
    specification,
    firstParameter,
    secondParameter,
    instrumentUsed,
    checkingFrequency,
    controlMethod,
    jobId,
    jobOperationId,
    setFieldValue
  ) => {
    const { inspectionList } = this.state;
    if (specification != "" && jobId != "" && jobOperationId != "") {
      let prod_data = {
        specification: specification,
        firstParameter: firstParameter,
        secondParameter: secondParameter,
        instrumentUsed: instrumentUsed,
        checkingFrequency: checkingFrequency,
        controlMethod: controlMethod,
        jobId: jobId,
        jobOperationId: jobOperationId,
      };
      let old_lst = inspectionList;
      let is_updated = false;
      let final_state = old_lst.map((item) => {
        if (
          item.firstParameter === prod_data.firstParameter &&
          item.secondParameter === prod_data.secondParameter
        ) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...inspectionList, prod_data];
      }
      this.setState({ inspectionList: final_state }, () => {
        setFieldValue("specification", "");
        setFieldValue("firstParameter", "");
        setFieldValue("secondParameter", "");
        setFieldValue("instrumentUsed", "");
        setFieldValue("checkingFrequency", "");
        setFieldValue("controlMethod", "");
      });
    }
  };

  removeLineInspect = (index) => {
    const { inspectionList } = this.state;
    const list = [...inspectionList];
    list.splice(index, 1);
    this.setState({ inspectionList: list });
  };

  render() {
    const columns = [
      {
        id: "job_name",
        field: "jobName",
        label: "Item Name",
        resizable: true,
      },
      {
        id: "job_operation_name",
        field: "jobOperationName",
        label: "Job Operation Name",
        resizable: true,
      },
      // {
      //   id: "action_name",
      //   field: "actionName",
      //   label: "Action Name",
      //   resizable: true,
      // },
      {
        id: "specification",
        field: "specification",
        label: "Specification",
        resizable: true,
      },
      {
        id: "first_parameter",
        field: "firstParameter",
        label: "First Parameter",
        resizable: true,
      },
      {
        id: "second_parameter",
        field: "secondParameter",
        label: "Second Parameter",
        resizable: true,
      },
      {
        id: "instrument_used",
        field: "instrumentUsed",
        label: "Instrument Used",
        resizable: true,
      },
      {
        id: "checking_frequency",
        field: "checkingFrequency",
        label: "Checking Frequency",
        resizable: true,
      },
      {
        id: "control_method",
        field: "controlMethod",
        label: "Control Method",
        resizable: true,
      },
      // {
      //   id: "created_at",
      //   label: "Created Date",
      //   cellRenderer: ({ data }) => {
      //     return (
      //       <div className="nightshift">
      //         {moment(data.createdAt).format("Do MMM YYYY")}
      //       </div>
      //     );
      //   },
      //   resizable: true,
      // },
      {
        id: "buttons",
        label: "Action",
        pinned: true,
        width: "100px",
        sortable: false,
        resizable: false,
        cellRenderer: ActionsCellRender,
      },
    ];

    const {
      jobOpts,
      jobOperationOpts,
      actionOpts,
      addModalShow,
      editModalShow,
      isLoading,
      operationParameterObject,
      currentIndex,
      inspectionList,
      operationOpts,
      selectedJobId,
      selectedOpId,
      frequencyOpt,
      instrumentOpt,
      controlOpt,
    } = this.state;

    const toggleJobData = (value) => {
      // console.log({ value });
      this.setState({
        selectedJobName: value != null ? value.label : "",
        selectedJobId: value,
        selectedOperationName: "",
        selectedOpId: "",
        jobOperationOpts: [],
      });
      this.tableManager.current.asyncApi.resetRows();
      if (value != null && value != "") {
        this.getJobOperationList(value.value);
      }
    };

    const toggleJobOperationData = (value) => {
      // console.log({ value });
      this.setState({
        selectedOperationName: value != null ? value.label : "",
        selectedOpId: value,
      });
      this.tableManager.current.asyncApi.resetRows();
    };
    let { userPermissions } = this.props;
    return (
      <div>
        {(isReadAuthorized("master", "designationPermission") ||
          isWriteAuthorized("master", "designationPermission")) && (
          <GridTable
            components={{ Header: CustomDTHeader }}
            columns={columns}
            onRowsRequest={this.onRowsRequest}
            onRowClick={(
              { rowIndex, data, column, isEdit, event },
              tableManager
            ) => !isEdit}
            minSearchChars={0}
            additionalProps={{
              header: {
                label: "Operation Parameters",
                addBtn: this.addBtn,
                currentIndex: currentIndex,
                onEditModalShow: this.onEditModalShow.bind(this),
                onDeleteModalShow: this.onDeleteModalShow.bind(this),
                jobId: selectedJobId,
                jobOpts: jobOpts,
                jobOpId: selectedOpId,
                jobOperationOpts: jobOperationOpts,
                toggleJobData: toggleJobData,
                toggleJobOperationData: toggleJobOperationData,
                userPermissions: userPermissions,
              },
            }}
            onLoad={this.setTableManager.bind(this)}
          />
        )}
        {/* Add Modal */}
        <Modal
          className="modal-xl p-2"
          isOpen={addModalShow}
          toggle={() => {
            this.onAddModalShow(false);
          }}
        >
          <ModalHeader
            className="p-2 modalheadernew"
            toggle={() => {
              this.onAddModalShow(false);
            }}
          >
            Create Operation Parameter
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
              jobId: "",
              jobOperationId: "",
              actionId: "",
              specification: "",
              firstParameter: "",
              secondParameter: "",
              instrumentUsed: "",
              checkingFrequency: "",
              controlMethod: "",
            }}
            validationSchema={Yup.object().shape({
              jobId: Yup.object().nullable().required("Select Item"),
              jobOperationId: Yup.object()
                .nullable()
                .required("Select job operation"),
              // actionId: Yup.object().nullable().required("Select action"),
              // specification: Yup.string()
              //   .trim()
              //   .nullable()
              //   .required("Specification is required"),
              // firstParameter: Yup.string()
              //   .trim()
              //   .nullable()
              //   .required("First parameter is required"),
              // secondParameter: Yup.string()
              //   .trim()
              //   .nullable()
              //   .required("Second parameter is required"),
              // instrumentUsed: Yup.string()
              //   .trim()
              //   .nullable()
              //   .required("Instrument is required"),
              // checkingFrequency: Yup.string()
              //   .trim()
              //   .nullable()
              //   .required("Checking Frequency is required"),
              // controlMethod: Yup.string()
              //   .trim()
              //   .nullable()
              //   .required("Control method is required"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              this.setState({ isLoading: true });
              let requestData = new FormData();

              if (inspectionList.length > 0) {
                let frows = inspectionList.map((v) => {
                  v["instrumentUsed"] = v["instrumentUsed"]["value"];
                  v["checkingFrequency"] = v["checkingFrequency"]["value"];
                  v["controlMethod"] = v["controlMethod"]["value"];
                  return v;
                });

                console.log({ frows });

                requestData.append("rows", JSON.stringify(inspectionList));
                requestData.append("jobId", values.jobId.value);
                requestData.append(
                  "jobOperationId",
                  values.jobOperationId.value
                );

                createOperationParameter(requestData)
                  .then((response) => {
                    this.setState({ isLoading: false });
                    if (response.data.responseStatus === 200) {
                      setSubmitting(false);
                      toast.success("✔ " + response.data.message);
                      resetForm();
                      this.onAddModalShow(false);

                      this.tableManager.current.asyncApi.resetRows();
                    } else {
                      setSubmitting(false);
                      toast.error("✘ " + response.data.message);
                    }
                  })
                  .catch((error) => {
                    this.setState({ isLoading: false });
                    setSubmitting(false);
                    toast.error("✘ " + error);
                  });
              } else {
                toast.error("✘ Please add inspection data");
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
              <Form autoComplete="off">
                <ModalBody>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label htmlFor="jobId"> Select Item </Label>
                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("jobId", v);
                            setFieldValue("jobOperationId", "");
                            if (v != null) {
                              this.getJobOperationList(v.value);
                            } else {
                              this.setState({ jobOperationOpts: [] });
                            }
                          }}
                          name="jobId"
                          options={jobOpts}
                          value={values.jobId}
                        />
                        <span className="text-danger">
                          {errors.jobId && errors.jobId}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label htmlFor="jobOperationId">
                          Select Operation{" "}
                        </Label>
                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("jobOperationId", v);
                          }}
                          name="jobOperationId"
                          options={jobOperationOpts}
                          value={values.jobOperationId}
                        />
                        <span className="text-danger">
                          {errors.jobOperationId && errors.jobOperationId}
                        </span>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="2">
                      <FormGroup>
                        <Label> Specification</Label>
                        <Input
                          type="text"
                          placeholder="Enter specification"
                          name="specification"
                          onChange={handleChange}
                          value={values.specification}
                          invalid={errors.specification ? true : false}
                        />
                        <FormFeedback>{errors.specification}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>First Parameter</Label>
                        <Input
                          type="text"
                          placeholder="Enter firstParameter"
                          name="firstParameter"
                          // onChange={handleChange}
                          onChange={(e) => {
                            // const re = /^[0-9\b]+$/;
                            const re = /^[0-9]+(?:[\d+(\.\d+]+?){0,1}$/;
                            if (
                              e.target.value === "" ||
                              re.test(e.target.value)
                            ) {
                              setFieldValue("firstParameter", e.target.value);
                            }
                          }}
                          value={values.firstParameter}
                          invalid={errors.firstParameter ? true : false}
                        />
                        <FormFeedback>{errors.firstParameter}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Second Parameter</Label>
                        <Input
                          type="text"
                          placeholder="Enter secondParameter"
                          name="secondParameter"
                          // onChange={handleChange}
                          onChange={(e) => {
                            // const re = /^[0-9\b]+$/;
                            const re = /^[0-9]+(?:[\d+(\.\d+]+?){0,1}$/;
                            if (
                              e.target.value === "" ||
                              re.test(e.target.value)
                            ) {
                              setFieldValue("secondParameter", e.target.value);
                            }
                          }}
                          value={values.secondParameter}
                          invalid={errors.secondParameter ? true : false}
                        />
                        <FormFeedback>{errors.secondParameter}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Instrument Used</Label>
                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("instrumentUsed", "");
                            if (v != null) {
                              setFieldValue("instrumentUsed", v);
                            }
                          }}
                          name="instrumentUsed"
                          options={instrumentOpt}
                          value={values.instrumentUsed}
                        />
                        {/* <Input
                          type="text"
                          placeholder="Enter instrumentUsed"
                          name="instrumentUsed"
                          onChange={handleChange}
                          value={values.instrumentUsed}
                          invalid={errors.instrumentUsed ? true : false}
                        /> */}
                        <FormFeedback>{errors.instrumentUsed}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Checking Frequency</Label>
                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("checkingFrequency", "");
                            if (v != null) {
                              setFieldValue("checkingFrequency", v);
                            }
                          }}
                          name="checkingFrequency"
                          options={frequencyOpt}
                          value={values.checkingFrequency}
                        />
                        {/* 
                        <Input
                          type="text"
                          placeholder="Enter checkingFrequency"
                          name="checkingFrequency"
                          onChange={handleChange}
                          value={values.checkingFrequency}
                          invalid={errors.checkingFrequency ? true : false}
                        /> */}
                        <FormFeedback>{errors.checkingFrequency}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Control Method</Label>
                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("controlMethod", "");
                            if (v != null) {
                              setFieldValue("controlMethod", v);
                            }
                          }}
                          name="controlMethod"
                          options={controlOpt}
                          value={values.controlMethod}
                        />
                        {/* <Input
                          type="text"
                          placeholder="Enter controlMethod"
                          name="controlMethod"
                          onChange={handleChange}
                          value={values.controlMethod}
                          invalid={errors.controlMethod ? true : false}
                        /> */}
                        <FormFeedback>{errors.controlMethod}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="2">
                      <Button
                        className="mainbtn1 addrowbtn1"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            values.jobId != "" &&
                            values.jobOperationId != "" &&
                            values.specification != "" &&
                            values.firstParameter != "" &&
                            values.secondParameter != "" &&
                            values.instrumentUsed != "" &&
                            values.checkingFrequency != "" &&
                            values.controlMethod != ""
                          ) {
                            this.addLineInpect(
                              values.specification,
                              values.firstParameter,
                              values.secondParameter,
                              values.instrumentUsed,
                              values.checkingFrequency,
                              values.controlMethod,
                              values.jobId,
                              values.jobOperationId,
                              setFieldValue
                            );
                          } else {
                            toast.error("✘ Please input all fields");
                          }
                        }}
                      >
                        Add Row
                      </Button>
                    </Col>
                  </Row>

                  {inspectionList && inspectionList.length > 0 && (
                    <div
                      className="institutetbl denomination-style"
                      style={{ height: "auto" }}
                    >
                      <Table hover size="sm" className="key table-style">
                        <thead>
                          <tr>
                            <th>Specification</th>
                            <th>Drawing Size</th>
                            <th>Instrument Used</th>
                            <th>Checking Freq.</th>
                            <th>Control Method</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inspectionList.map((v, key) => {
                            return (
                              <tr key={key} className="tablecursor">
                                <td>{v.specification}</td>
                                <td>
                                  {v.firstParameter + "/" + v.secondParameter}
                                </td>
                                <td>{v.instrumentUsed.label}</td>
                                <td>{v.checkingFrequency.label}</td>
                                <td>{v.controlMethod.label}</td>
                                <td>
                                  <Button
                                    className="icon"
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.removeLineInspect(key);
                                    }}
                                  >
                                    <img
                                      src={delete_}
                                      className="icon"
                                      style={{ width: "25px" }}
                                    ></img>
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter className="p-0">
                  {isLoading ? (
                    <Button
                      className="mainbtn1 text-white"
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
                      Creating...
                    </Button>
                  ) : (
                    <Button type="submit" className="mainbtn1 text-white">
                      Create
                    </Button>
                  )}

                  <Button
                    className="modalcancelbtn"
                    type="button"
                    onClick={() => {
                      this.onAddModalShow(null);
                    }}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </Form>
            )}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          className="modal-xl p-2"
          isOpen={editModalShow}
          toggle={() => {
            this.onEditModalShow(null);
          }}
        >
          <ModalHeader
            className="modalheadernew p-2"
            toggle={() => {
              this.onEditModalShow(null);
            }}
          >
            Update Operation Parameter
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={{
              jobId:
                operationParameterObject &&
                operationParameterObject.jobId != null
                  ? operationParameterObject.jobId
                  : "",
              jobOperationId:
                operationParameterObject &&
                operationParameterObject.jobOperationId != null
                  ? operationParameterObject.jobOperationId
                  : "",
              // actionId:
              //   operationParameterObject &&
              //   operationParameterObject.actionId != null
              //     ? operationParameterObject.actionId
              //     : "",
              specification:
                operationParameterObject &&
                operationParameterObject.specification != null
                  ? operationParameterObject.specification
                  : "",
              firstParameter:
                operationParameterObject &&
                operationParameterObject.firstParameter != null
                  ? operationParameterObject.firstParameter
                  : "",
              secondParameter:
                operationParameterObject &&
                operationParameterObject.secondParameter != null
                  ? operationParameterObject.secondParameter
                  : "",
              instrumentUsed:
                operationParameterObject &&
                operationParameterObject.instrumentUsed != null
                  ? operationParameterObject.instrumentUsed
                  : "",
              checkingFrequency:
                operationParameterObject &&
                operationParameterObject.checkingFrequency != null
                  ? operationParameterObject.checkingFrequency
                  : "",
              controlMethod:
                operationParameterObject &&
                operationParameterObject.controlMethod != null
                  ? operationParameterObject.controlMethod
                  : "",
            }}
            validationSchema={Yup.object().shape({
              jobId: Yup.object().nullable().required("Select Item"),
              jobOperationId: Yup.object()
                .nullable()
                .required("Select job operation"),
              // actionId: Yup.object().nullable().required("Select action"),
              specification: Yup.string()
                .trim()
                .nullable()
                .required("Specification is required"),
              firstParameter: Yup.string()
                .trim()
                .nullable()
                .required("First parameter is required"),
              secondParameter: Yup.string()
                .trim()
                .nullable()
                .required("Second parameter is required"),
              instrumentUsed: Yup.object()
                .nullable()
                .required("Instrument is required"),
              checkingFrequency: Yup.object()
                .nullable()
                .required("Checking Frequency is required"),
              controlMethod: Yup.object()
                .nullable()
                .required("Control method is required"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              this.setState({ isLoading: true });
              let requestData = new FormData();
              requestData.append(
                "id",
                operationParameterObject.operationParameterId
              );
              requestData.append("specification", values.specification);
              requestData.append("firstParameter", values.firstParameter);
              requestData.append("secondParameter", values.secondParameter);
              requestData.append("instrumentUsed", values.instrumentUsed.value);
              requestData.append(
                "checkingFrequency",
                values.checkingFrequency.value
              );
              requestData.append("controlMethod", values.controlMethod.value);
              requestData.append("jobOperationId", values.jobOperationId.value);
              // requestData.append("actionId", values.actionId.value);
              requestData.append("jobId", values.jobId.value);
              updateOperationParameter(requestData)
                .then((response) => {
                  this.setState({ isLoading: false });
                  if (response.data.responseStatus === 200) {
                    setSubmitting(false);
                    toast.success("✔ " + response.data.message);
                    resetForm();
                    this.onEditModalShow(false);

                    this.tableManager.current.asyncApi.resetRows();
                  } else {
                    setSubmitting(false);
                    toast.error("✘ " + response.data.message);
                  }
                })
                .catch((error) => {
                  this.setState({ isLoading: false });
                  setSubmitting(false);
                  toast.error("✘ " + error);
                });
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
              <Form autoComplete="off">
                <ModalBody>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label htmlFor="jobId"> Select Item </Label>
                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("jobId", v);
                            setFieldValue("jobOperationId", "");
                            if (v != null) {
                              this.getJobOperationList(v.value);
                            } else {
                              this.setState({ jobOperationOpts: [] });
                            }
                          }}
                          name="jobId"
                          options={jobOpts}
                          value={values.jobId}
                        />
                        <span className="text-danger">
                          {errors.jobId && errors.jobId}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label htmlFor="jobOperationId">
                          Select Operation{" "}
                        </Label>
                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("jobOperationId", v);
                          }}
                          name="jobOperationId"
                          options={jobOperationOpts}
                          value={values.jobOperationId}
                        />
                        <span className="text-danger">
                          {errors.jobOperationId && errors.jobOperationId}
                        </span>
                      </FormGroup>
                    </Col>
                    {/* <Col md="4">
                      <FormGroup>
                        <Label htmlFor="actionId"> Select Action </Label>
                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("actionId", v);
                          }}
                          name="actionId"
                          options={actionOpts}
                          value={values.actionId}
                        />
                        <span className="text-danger">
                          {errors.actionId && errors.actionId}
                        </span>
                      </FormGroup>
                    </Col> */}
                  </Row>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label> Specification</Label>
                        <Input
                          type="text"
                          placeholder="Enter specification"
                          name="specification"
                          onChange={handleChange}
                          value={values.specification}
                          invalid={errors.specification ? true : false}
                        />
                        <span className="text-danger">
                          {errors.specification}
                        </span>
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>First Parameter</Label>
                        <Input
                          type="text"
                          placeholder="Enter firstParameter"
                          name="firstParameter"
                          // onChange={handleChange}
                          onChange={(e) => {
                            // const re = /^[0-9\b]+$/;
                            const re = /^[0-9]+(?:[\d+(\.\d+]+?){0,1}$/;
                            if (
                              e.target.value === "" ||
                              re.test(e.target.value)
                            ) {
                              setFieldValue("firstParameter", e.target.value);
                            }
                          }}
                          value={values.firstParameter}
                          invalid={errors.firstParameter ? true : false}
                        />
                        <span className="text-danger">
                          {errors.firstParameter}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Second Parameter</Label>
                        <Input
                          type="text"
                          placeholder="Enter secondParameter"
                          name="secondParameter"
                          // onChange={handleChange}
                          onChange={(e) => {
                            // const re = /^[0-9\b]+$/;
                            const re = /^[0-9]+(?:[\d+(\.\d+]+?){0,1}$/;
                            if (
                              e.target.value === "" ||
                              re.test(e.target.value)
                            ) {
                              setFieldValue("secondParameter", e.target.value);
                            }
                          }}
                          value={values.secondParameter}
                          invalid={errors.secondParameter ? true : false}
                        />
                        <span className="text-danger">
                          {errors.secondParameter}
                        </span>
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>Instrument Used</Label>
                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("instrumentUsed", "");
                            if (v != null) {
                              setFieldValue("instrumentUsed", v);
                            }
                          }}
                          name="instrumentUsed"
                          options={instrumentOpt}
                          value={values.instrumentUsed}
                        />
                        <span className="text-danger">
                          {errors.instrumentUsed}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Checking Frequency</Label>
                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("checkingFrequency", "");
                            if (v != null) {
                              setFieldValue("checkingFrequency", v);
                            }
                          }}
                          name="checkingFrequency"
                          options={frequencyOpt}
                          value={values.checkingFrequency}
                        />
                        <span className="text-danger">
                          {errors.checkingFrequency}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Control Method</Label>
                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("controlMethod", "");
                            if (v != null) {
                              setFieldValue("controlMethod", v);
                            }
                          }}
                          name="controlMethod"
                          options={controlOpt}
                          value={values.controlMethod}
                        />
                        <span className="text-danger">
                          {errors.controlMethod}
                        </span>
                      </FormGroup>
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter className="p-2">
                  {isLoading ? (
                    <Button
                      className="mainbtn1 text-white"
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
                      Updating...
                    </Button>
                  ) : (
                    <Button type="submit" className="mainbtn1 text-white">
                      Update
                    </Button>
                  )}

                  <Button
                    className="mainbtn1 modalcancelbtn"
                    type="button"
                    onClick={() => {
                      this.onEditModalShow(null);
                    }}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </Form>
            )}
          />
        </Modal>
      </div>
    );
  }
}
export default WithUserPermission(OperationParameter);
