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
import { MyDatePicker } from "@/helpers";
import * as Yup from "yup";
import moment from "moment";
import {
  getSelectValue,
  isWriteAuthorized,
  isReadAuthorized,
  getHeader,
  CustomDTHeader,
  SUPPORTED_FORMATS_PDF,
  WithUserPermission,
  isActionExist,
} from "@/helpers";
import { DTJobOperationUrl } from "@/services/api";
import {
  createNewJobOperation,
  listOfJobsForSelect,
  findJobOperation,
  updateJobOperation,
  deleteJobOperation,
  deleteProcedureSheet,
  deleteDrawingSheet,
} from "@/services/api_function";

import axios from "axios";

const ActionsCellRender = ({
  tableManager,
  value,
  field,
  data,
  column,
  colIndex,
  rowIndex,
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
        <>
          {isActionExist("operation", "edit", userPermissions) && (
            <Button
              title="EDIT"
              id="Tooltipedit"
              className="edityellowbtn"
              onClick={(e) => {
                e.preventDefault();
                onEditModalShow(true, data.jobOperationId, rowIndex);
              }}
            >
              <i className="fa fa-edit"></i>
            </Button>
          )}
          {isActionExist("operation", "delete", userPermissions) && (
            <Button
              title="DELETE"
              id="Tooltipdelete"
              className="deleteredbtn"
              onClick={(e) => {
                e.preventDefault();
                onDeleteModalShow(data.jobOperationId);
              }}
            >
              <i className="fa fa-trash"></i>
            </Button>
          )}
        </>
      )}
    </>
  );
};

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

class jobOperation extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.updateformRef = React.createRef(null);
    this.state = {
      refresh: true,
      addModalShow: false,
      editModalShow: false,
      isLoading: false,
      currentIndex: 0,
      jobOperationObject: "",
      jobOpts: [],
      jobOperationList: [],
      oldJobOperationList: [],
      tbl_show: false,
      initVal: {
        jobId: "",
        operationName: "",
        operationNo: "",
        detailId: "",
        cycleTime: "",
        pcsRate: "",
        averagePerShift: "",
        pointPerJob: "",
        operationDiameterType: "",
        operationBreakInMin: "0",
        jobDocument: "",
        procedureSheet: "",
      },
      selectedJobName: "",
      selectedJobId: "",
    };
  }

  setInitValue = (values) => {
    console.log("initVal values", values);
    let initVal = {
      jobId: values.jobId,
      operationName: values.operationName,
      operationNo: values.operationNo,
      jobDocument: values.obDocument,
      procedureSheet: values.procedureSheet,
      cycleTime: "",
      pcsRate: "",
      averagePerShift: "",
      pointPerJob: "",
      operationDiameterType: "",
      operationBreakInMin: "",
    };
    this.setState({ initVal: initVal });
  };

  setTableManager = (tm) => (this.tableManager.current = tm);

  addBtn = isWriteAuthorized("master", "designationPermission") &&
    isActionExist("operation", "create", this.props.userPermissions) && (
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

  addEditJobOperation = (opearations, setFieldValue) => {
    let { jobOperationList } = this.state;
    let {
      detailId,
      effectiveDate,
      cycleTime,
      pcsRate,
      averagePerShift,
      pointPerJob,
      operationBreakInMin,
    } = opearations;
    if (effectiveDate != "" && cycleTime != "") {
      let prod_data = {
        detailId: detailId,
        effectiveDate: effectiveDate,
        cycleTime: cycleTime,
        pcsRate: pcsRate,
        averagePerShift: averagePerShift,
        pointPerJob: pointPerJob,
        operationBreakInMin: operationBreakInMin,
      };
      let old_lst = jobOperationList;
      let is_updated = false;
      let final_state;
      final_state = old_lst.map((item) => {
        if (prod_data.detailId != "") {
          if (item.detailId === prod_data.detailId) {
            is_updated = true;
            const updatedItem = prod_data;
            return updatedItem;
          }
        } else {
          if (
            JSON.stringify(item.effectiveDate) ===
            JSON.stringify(prod_data.effectiveDate)
          ) {
            is_updated = true;
            const updatedItem = prod_data;
            return updatedItem;
          }
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...jobOperationList, prod_data];
      }

      this.setState({ jobOperationList: final_state }, () => {
        setFieldValue("detailId", "");
        setFieldValue("effectiveDate", "");
        setFieldValue("cycleTime", "");
        setFieldValue("pcsRate", "");
        setFieldValue("averagePerShift", "");
        setFieldValue("pointPerJob", "");
        setFieldValue("operationBreakInMin", "");
      });
    } else {
      toast.error("✘ Please Fill The Details ");
    }
  };

  addJobOperation = (opearations, setFieldValue) => {
    let { jobOperationList } = this.state;
    let {
      detailId,
      effectiveDate,
      cycleTime,
      pcsRate,
      averagePerShift,
      pointPerJob,
      operationBreakInMin,
    } = opearations;
    if (effectiveDate != "" && cycleTime != "") {
      let prod_data = {
        detailId: detailId,
        effectiveDate: effectiveDate,
        cycleTime: cycleTime,
        pcsRate: pcsRate,
        averagePerShift: averagePerShift,
        pointPerJob: pointPerJob,
        operationBreakInMin: operationBreakInMin,
      };
      let old_lst = jobOperationList;
      let is_updated = false;
      let final_state = old_lst.map((item) => {
        if (
          moment(item.effectiveDate).format("YYYY-MM-DD") ===
          moment(prod_data.effectiveDate).format("YYYY-MM-DD")
        ) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...jobOperationList, prod_data];
      }

      this.setState({ jobOperationList: final_state }, () => {
        setFieldValue("detailId", "");
        setFieldValue("effectiveDate", "");
        setFieldValue("cycleTime", "");
        setFieldValue("pcsRate", "");
        setFieldValue("averagePerShift", "");
        setFieldValue("pointPerJob", "");
        setFieldValue("operationBreakInMin", "");
      });
    } else {
      toast.error("✘ Please Fill The Details ");
    }
  };

  editJobOperationList = (key, operations, setFieldValue) => {
    let {
      detailId,
      effectiveDate,
      cycleTime,
      operationBreakInMin,
      averagePerShift,
      pcsRate,
      pointPerJob,
    } = operations;

    if (
      effectiveDate != undefined &&
      cycleTime != undefined &&
      operationBreakInMin != undefined &&
      averagePerShift != undefined &&
      pcsRate != undefined &&
      pointPerJob != undefined
    ) {
      // console.log("okay -------------------------->>", operations);
      setFieldValue("detailId", detailId);
      setFieldValue(
        "effectiveDate",
        typeof effectiveDate === Date ? effectiveDate : new Date(effectiveDate)
      );
      setFieldValue("cycleTime", cycleTime);
      setFieldValue("operationBreakInMin", operationBreakInMin);
      setFieldValue("averagePerShift", averagePerShift);
      setFieldValue("pcsRate", pcsRate);
      setFieldValue("pointPerJob", pointPerJob);
    } else {
      console.log(" not okay -------------------------->>", operations);
    }
  };

  removeJobOperationList = (index) => {
    const { jobOperationList } = this.state;
    const list = [...jobOperationList];
    let jList = list.splice(index, 1);
    this.setState({
      oldJobOperationList: [...jList],
      jobOperationList: list,
    });
  };

  onRowsRequest = async (requestData, tableManager) => {
    const { selectedJobName } = this.state;
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
      selectedJobName: selectedJobName,
    };
    const response = await axios({
      url: DTJobOperationUrl(),
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
    this.setState({ addModalShow: status }, () => {
      if (status == false) {
        this.setState({
          jobOperationList: [],
          initVal: {
            jobId: "",
            operationName: "",
            operationNo: "",
            detailId: "",
            cycleTime: "",
            pcsRate: "",
            averagePerShift: "",
            pointPerJob: "",
            operationDiameterType: "",
            operationBreakInMin: "0",
            jobDocument: "",
            procedureSheet: "",
          },
        });
      }
    });
  };

  onEditModalShow = (status, id, rowIndex) => {
    let { jobOpts, initVal } = this.state;
    console.log({ jobOpts });
    if (status) {
      this.setState({ currentIndex: rowIndex });
      let requestData = {
        jobOperationId: id,
      };
      findJobOperation(requestData)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            let result = res.response;
            console.log("result", result);

            initVal["jobId"] = result.jobId
              ? getSelectValue(jobOpts, result.jobId)
              : "";
            initVal["operationName"] = result.jobOperationName
              ? result.jobOperationName
              : "";
            initVal["operationNo"] = result.jobOperationNo
              ? result.jobOperationNo
              : "";
            initVal["oldjobDocument"] = result.jobOperationImagePath;
            initVal["oldprocedureSheet"] = result.procedureSheet;

            let lst_operations = result.operationDetailsList.map((v, i) => {
              let prod_data = {
                detailId: v.id,
                effectiveDate: v.effectiveDate,
                cycleTime: v.cycleTime,
                pcsRate: v.pcsRate,
                averagePerShift: v.averagePerShift,
                pointPerJob: v.pointPerJob,
                operationBreakInMin: v.operationBreakInMin,
              };
              return prod_data;
            });

            console.log({ initVal });
            this.setState({
              initVal: initVal,
              jobOperationObject: result,
              currentIndex: 0,
              editModalShow: status,
              jobOperationList: lst_operations,
            });
          } else {
            this.setState({
              currentIndex: 0,
            });
            toast.error("✘ " + res.message);
          }
        })
        .catch((error) => {
          console.log("errors", error);
        });
    } else {
      this.setState({
        jobOperationList: [],
        currentIndex: 0,
        editModalShow: status,
        initVal: {
          jobId: "",
          operationName: "",
          operationNo: "",
          detailId: "",
          cycleTime: "",
          pcsRate: "",
          averagePerShift: "",
          pointPerJob: "",
          operationDiameterType: "",
          operationBreakInMin: "0",
          jobDocument: "",
          procedureSheet: "",
        },
      });
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
      let reqData = {
        id: id,
      };

      deleteJobOperation(reqData)
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

  deleteProcedureSheetFun = (id) => {
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
      let reqData = {
        id: id,
      };

      deleteProcedureSheet(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            toast.success("✔ " + response.data.message);
            this.onEditModalShow(false);
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

  deleteDrawingSheetFun = (id) => {
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
      let reqData = {
        id: id,
      };

      deleteDrawingSheet(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            toast.success("✔ " + response.data.message);
            this.onEditModalShow(false);
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

  listOfJobsForSelectFun = () => {
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

  componentDidMount() {
    this.listOfJobsForSelectFun();
  }

  render() {
    const columns = [
      {
        id: "job_name",
        field: "jobName",
        label: "Item Name",
        resizable: true,
      },
      {
        id: "operation_no",
        field: "operationNo",
        label: "Operation No",
        resizable: true,
      },
      {
        id: "operation_name",
        field: "operationName",
        label: "Operation Name",
        resizable: true,
      },
      // {
      //   id: "cycle_time",
      //   field: "cycleTime",
      //   label: "Cycle Time",
      //   resizable: true,
      // },
      // {
      //   id: "pcs_rate",
      //   field: "pcsRate",
      //   label: "PCS Rate",
      //   resizable: true,
      // },
      // {
      //   id: "average_per_shift",
      //   field: "averagePerShift",
      //   label: "Average Per Shift",
      //   resizable: true,
      // },
      // {
      //   id: "point_per_job",
      //   field: "pointPerJob",
      //   label: "Point Per Job",
      //   resizable: true,
      // },
      {
        id: "operation_image_path",
        label: "Drawing & Process Sheet",
        resizable: true,
        cellRenderer: ({ data }) => {
          if (data.operationImagePath != null) {
            return (
              <>
                <a href={data.operationImagePath} target="_blank">
                  View Drawing & Process Sheet
                </a>
              </>
            );
          }
        },
      },
      {
        id: "procedure_sheet",
        label: "Procedure Sheet",
        resizable: true,
        cellRenderer: ({ data }) => {
          if (data.procedureSheet != null) {
            return (
              <>
                <a href={data.procedureSheet} target="_blank">
                  View Procedure Sheet
                </a>
              </>
            );
          }
        },
      },
      {
        id: "created_at",
        label: "Created Date",
        cellRenderer: ({ data }) => {
          return (
            <div className="nightshift">
              {moment(data.createdAt).format("Do MMM YYYY")}
            </div>
          );
        },
        resizable: true,
      },
      {
        id: "buttons",
        label: "Action",
        pinned: true,
        width: "100px",
        sortable: false,
        resizable: false,
        // cellRenderer: (objProps) => {
        //   return <ActionsCellRender {...objProps} />;
        // },
        cellRenderer: ActionsCellRender,
      },
    ];

    const toggleJobData = (value) => {
      // console.log({ value });
      this.setState({
        selectedJobName: value != null ? value.label : "",
        selectedJobId: value,
      });
      this.tableManager.current.asyncApi.resetRows();
    };

    let {
      jobOpts,
      addModalShow,
      editModalShow,
      isLoading,
      jobOperationObject,
      currentIndex,
      tbl_show,
      jobOperationList,
      oldJobOperationList,
      initVal,
      selectedJobId,
    } = this.state;
    let { userPermissions } = this.props;

    return (
      <div className="emp">
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
                label: "Job Operations",
                addBtn: this.addBtn,
                currentIndex: currentIndex,
                onEditModalShow: this.onEditModalShow.bind(this),
                onDeleteModalShow: this.onDeleteModalShow.bind(this),
                jobId: selectedJobId,
                jobOpts: jobOpts,
                toggleJobData: toggleJobData,
                userPermissions: userPermissions,
              },
            }}
            onLoad={this.setTableManager.bind(this)}
          />
        )}
        {/* Add Modal */}
        <Modal
          className="p-2"
          size="xl"
          style={{
            maxWidth: "fit-content",
          }}
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
            Create Operation
          </ModalHeader>
          <Formik
            enableReinitialize={true}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={initVal}
            validationSchema={Yup.object().shape({
              jobId: Yup.object().nullable().required("Select Item"),
              operationName: Yup.string()
                .trim()
                .nullable()
                .required("Operation name is required"),
              operationNo: Yup.string()
                .trim()
                .nullable()
                .required("Operation no. is required"),
              jobDocument: Yup.lazy((v) => {
                if (v != undefined) {
                  return Yup.mixed()
                    .test(
                      "fileType",
                      "Upload JPG,JPEG,PNG,PDF with MAX. 5MB sizes",
                      (value) => SUPPORTED_FORMATS_PDF.includes(value.type)
                    )
                    .test(
                      "fileSize",
                      "File size should be less than 5MB",
                      (v) => {
                        const size = 1024 * 1024 * 5;
                        return v && v.size <= size;
                      }
                    );
                }
                return Yup.mixed().notRequired("Upload JPG,JPEG,PNG,PDF");
              }),
              procedureSheet: Yup.lazy((v) => {
                if (v != undefined) {
                  return Yup.mixed()
                    .test(
                      "fileType",
                      "Upload JPG,JPEG,PNG,PDF with MAX. 5MB sizes",
                      (value) => SUPPORTED_FORMATS_PDF.includes(value.type)
                    )
                    .test(
                      "fileSize",
                      "File size should be less than 5MB",
                      (v) => {
                        const size = 1024 * 1024 * 5;
                        return v && v.size <= size;
                      }
                    );
                }
                return Yup.mixed().notRequired("Upload JPG,JPEG,PNG,PDF");
              }),
            })}
            onSubmit={(values, { resetForm, setSubmitting }) => {
              console.warn("values :", values);
              setSubmitting(false);

              let { jobOperationList } = this.state;
              let form_data = new FormData();
              console.log(
                "jobOperationList :",
                JSON.stringify(jobOperationList)
              );
              let final_jobOperationList = jobOperationList.map((v) => {
                let obj = {
                  cycleTime: v.cycleTime,
                  pcsRate: v.pcsRate,
                  averagePerShift: v.averagePerShift,
                  pointPerJob: v.pointPerJob,
                  operationBreakInMin: v.operationBreakInMin,
                  effectiveDate: moment(v.effectiveDate).format("YYYY-MM-DD"),
                };
                return obj;
              });
              console.log("JOBOPe", jobOperationList);
              form_data.append(
                "jobOperationList",
                JSON.stringify(final_jobOperationList)
              );
              form_data.append("jobId", values.jobId ? values.jobId.value : "");
              form_data.append("operationName", values.operationName);
              form_data.append("operationNo", values.operationNo);

              form_data.append(`document`, values.jobDocument);
              form_data.append(`procedureSheet`, values.procedureSheet);

              createNewJobOperation(form_data)
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

              resetForm();
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
                  {/* {JSON.stringify(values)} */}
                  <Row>
                    <Col md="2">
                      <FormGroup>
                        <Label htmlFor="jobId"> Select Item </Label>
                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("jobId", v);
                          }}
                          name="jobId"
                          options={jobOpts}
                          value={values.jobId}
                        />
                        <span className="text-danger">{errors.jobId}</span>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Operation Name</Label>
                        <Input
                          type="text"
                          placeholder="Enter operation name"
                          name="operationName"
                          onChange={handleChange}
                          value={values.operationName}
                          invalid={errors.operationName ? true : false}
                        />
                        <FormFeedback>{errors.operationName}</FormFeedback>
                      </FormGroup>
                    </Col>

                    <Col md="2">
                      <FormGroup>
                        <Label>Operation No</Label>
                        <Input
                          type="text"
                          placeholder="Enter operation no"
                          name="operationNo"
                          onChange={handleChange}
                          value={values.operationNo}
                          invalid={errors.operationNo ? true : false}
                        />
                        <FormFeedback>{errors.operationNo}</FormFeedback>
                      </FormGroup>
                    </Col>

                    <Col md="2">
                      <FormGroup>
                        <Label htmlFor="employeeType">
                          Upload Drawing/Sheet
                        </Label>
                        <InputGroup className="z-index_0">
                          <div className="custom-file">
                            <Input
                              type="file"
                              name="jobDocument"
                              accept="image/*,application/pdf"
                              multiple="false"
                              className="custom-file-input"
                              onClick={(e) => {
                                e.target.value = null;
                              }}
                              onChange={(e) => {
                                e.preventDefault();
                                setFieldValue("jobDocument", e.target.files[0]);
                              }}
                            />
                            <label
                              className="custom-file-label"
                              htmlFor="jobDocument"
                            >
                              {/* ? truncateString(values.jobDocument.name, 20) */}
                              {values.jobDocument
                                ? "FILE SELECTED"
                                : "Upload Drawing/Sheet"}
                            </label>
                          </div>
                        </InputGroup>
                        <span className="text-danger">
                          {errors.jobDocument}
                        </span>
                      </FormGroup>
                    </Col>

                    <Col md="2">
                      <FormGroup>
                        <Label htmlFor="employeeType">
                          Upload Procedure Sheet
                        </Label>
                        <InputGroup className="z-index_0">
                          <div className="custom-file">
                            <Input
                              accept="image/*,application/pdf"
                              multiple="false"
                              type="file"
                              name="procedureSheet"
                              className="custom-file-input"
                              onClick={(e) => {
                                e.target.value = null;
                              }}
                              onChange={(e) => {
                                e.preventDefault();
                                setFieldValue(
                                  "procedureSheet",
                                  e.target.files[0]
                                );
                              }}
                            />
                            <label
                              className="custom-file-label"
                              htmlFor="procedureSheet"
                            >
                              {/* ? truncateString(values.procedureSheet.name, 20) */}
                              {values.procedureSheet
                                ? "FILE SELECTED"
                                : "Upload Procedure Sheet"}
                            </label>
                          </div>
                        </InputGroup>
                        <span className="text-danger">
                          {errors.procedureSheet}
                        </span>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="2">
                      <Label className="formlabelsize">Effected Date</Label>
                      <MyDatePicker
                        className="datepic form-control"
                        // styles={customStyles}
                        id="effectiveDate"
                        name="effectiveDate"
                        placeholderText="dd/MM/yyyy"
                        onChange={(date) => {
                          setFieldValue("effectiveDate", date);
                        }}
                        dateFormat="dd/MM/yyyy"
                        value={values.effectiveDate}
                        selected={values.effectiveDate}
                      />
                    </Col>

                    <Col md="2">
                      <FormGroup>
                        <Label>Cycle Time</Label>
                        <Input
                          type="text"
                          placeholder="Enter cycle time"
                          name="cycleTime"
                          // onChange={handleChange}
                          onChange={(e) => {
                            let cTime = e.target.value;
                            console.log({ cTime });
                            if (
                              cTime != undefined &&
                              cTime != null &&
                              cTime != ""
                            ) {
                              let avgPerShift =
                                (480 - parseInt(values.operationBreakInMin)) /
                                parseFloat(cTime);
                              let pointPerJob = 100 / avgPerShift;

                              setFieldValue("cycleTime", cTime);
                              setFieldValue("averagePerShift", avgPerShift);
                              setFieldValue("pointPerJob", pointPerJob);
                            } else {
                              setFieldValue("cycleTime", cTime);
                              setFieldValue("averagePerShift", "");
                              setFieldValue("pointPerJob", "");
                            }
                          }}
                          value={values.cycleTime}
                          invalid={errors.cycleTime ? true : false}
                        />
                        <FormFeedback>{errors.cycleTime}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Break Time (Min.)</Label>
                        <Input
                          type="text"
                          placeholder="Enter break time in minutes"
                          name="operationBreakInMin"
                          // onChange={handleChange}
                          onChange={(e) => {
                            let operationBreakInMin = e.target.value;
                            console.log({ operationBreakInMin });
                            if (
                              operationBreakInMin != undefined &&
                              operationBreakInMin != null &&
                              operationBreakInMin != ""
                            ) {
                              let avgPerShift =
                                (480 - parseInt(operationBreakInMin)) /
                                parseFloat(values.cycleTime);
                              let pointPerJob = 100 / avgPerShift;

                              setFieldValue(
                                "operationBreakInMin",
                                operationBreakInMin
                              );
                              setFieldValue("averagePerShift", avgPerShift);
                              setFieldValue("pointPerJob", pointPerJob);
                            } else {
                              setFieldValue(
                                "operationBreakInMin",
                                operationBreakInMin
                              );
                              setFieldValue("averagePerShift", "");
                              setFieldValue("pointPerJob", "");
                            }
                          }}
                          value={values.operationBreakInMin}
                          invalid={errors.operationBreakInMin ? true : false}
                        />
                        <FormFeedback>
                          {errors.operationBreakInMin}
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Average Shift</Label>
                        <Input
                          readOnly={true}
                          type="text"
                          placeholder="Enter average per shift"
                          name="averagePerShift"
                          onChange={handleChange}
                          value={values.averagePerShift}
                          invalid={errors.averagePerShift ? true : false}
                        />
                        <FormFeedback>{errors.averagePerShift}</FormFeedback>
                      </FormGroup>
                    </Col>

                    <Col md="1">
                      <FormGroup>
                        <Label>PCS Rate</Label>
                        <Input
                          type="text"
                          placeholder="Enter pcs rate"
                          name="pcsRate"
                          onChange={handleChange}
                          value={values.pcsRate}
                          invalid={errors.pcsRate ? true : false}
                          // readOnly={true}
                        />
                        <FormFeedback>{errors.pcsRate}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="1">
                      <FormGroup>
                        <Label>Point Job</Label>
                        <Input
                          type="text"
                          placeholder="Enter point per job"
                          name="pointPerJob"
                          onChange={handleChange}
                          value={values.pointPerJob}
                          invalid={errors.pointPerJob ? true : false}
                        />
                        <FormFeedback>{errors.pointPerJob}</FormFeedback>
                      </FormGroup>
                    </Col>

                    <Button
                      className="mainbtn1 modalcancelbtn"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        this.addJobOperation(values, setFieldValue);
                      }}
                    >
                      Add Row
                    </Button>
                  </Row>
                  {/* {JSON.stringify(jobOperationList)} */}

                  {jobOperationList.length > 0 && (
                    <Row className="mb-4 emp">
                      <Col md="12">
                        <Table bordered hover>
                          <thead style={{ background: "#f5f5f5" }}>
                            <tr>
                              <th> Effective Date</th>
                              <th>Cycle Time</th>
                              <th> Break Time(Min)</th>
                              <th> Average Shift</th>
                              <th>PCS Rate</th>
                              <th> Point Job</th>
                              <th> Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {jobOperationList &&
                              jobOperationList.map((v, key) => (
                                <tr>
                                  <td>
                                    {moment(v.effectiveDate).format(
                                      "DD MMM yyyy"
                                    )}
                                  </td>
                                  <td>{v.cycleTime}</td>
                                  <td>{v.operationBreakInMin}</td>

                                  <td>{v.averagePerShift}</td>
                                  <td>{v.pcsRate}</td>
                                  <td>{v.pointPerJob}</td>

                                  <td>
                                    {" "}
                                    <Button
                                      style={{ minWidth: "35px" }}
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.editJobOperationList(
                                          key,
                                          v,
                                          setFieldValue
                                        );
                                      }}
                                    >
                                      <i className="fa fa-edit"></i>
                                    </Button>
                                    <Button
                                      style={{ minWidth: "35px" }}
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.removeJobOperationList(key);
                                      }}
                                    >
                                      <i className="fa fa-trash"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  )}
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
                      Creating...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="mainbtn1 text-white"
                      // onClick={() => {
                      //   this.createOperation();
                      // }}
                    >
                      Create
                    </Button>
                  )}

                  <Button
                    className="modalcancelbtn"
                    type="button"
                    onClick={() => {
                      this.onAddModalShow(false);
                      this.setState({ tbl_show: false });
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
          className="p-2"
          // size="xl"
          style={{
            maxWidth: "fit-content",
          }}
          isOpen={editModalShow}
          toggle={() => {
            this.onEditModalShow(false);
          }}
        >
          <ModalHeader
            className="modalheadernew p-2"
            toggle={() => {
              this.onEditModalShow(false);
            }}
          >
            Update Operation
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            // innerRef={this.updateformRef}
            initialValues={initVal}
            validationSchema={Yup.object().shape({
              jobId: Yup.object().nullable().required("Select Item"),
              operationName: Yup.string()
                .trim()
                .nullable()
                .required("Operation name is required"),
              operationNo: Yup.string()
                .trim()
                .nullable()
                .required("Operation no is required"),

              jobDocument: Yup.lazy((v) => {
                if (v != undefined) {
                  return Yup.mixed()
                    .test(
                      "fileType",
                      "Upload JPG,JPEG,PNG,PDF with MAX. 5MB sizes",
                      (value) => SUPPORTED_FORMATS_PDF.includes(value.type)
                    )
                    .test(
                      "fileSize",
                      "File size should be less than 5MB",
                      (v) => {
                        const size = 1024 * 1024 * 5;
                        return v && v.size <= size;
                      }
                    );
                }
                return Yup.mixed().notRequired("Upload JPG,JPEG,PNG,PDF");
              }),
              procedureSheet: Yup.lazy((v) => {
                if (v != undefined) {
                  return Yup.mixed()
                    .test(
                      "fileType",
                      "Upload JPG,JPEG,PNG,PDF with MAX. 5MB sizes",
                      (value) => SUPPORTED_FORMATS_PDF.includes(value.type)
                    )
                    .test(
                      "fileSize",
                      "File size should be less than 5MB",
                      (v) => {
                        const size = 1024 * 1024 * 5;
                        return v && v.size <= size;
                      }
                    );
                }
                return Yup.mixed().notRequired("Upload JPG,JPEG,PNG,PDF");
              }),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              this.setState({ isLoading: true });
              let { jobOperationList } = this.state;
              let requestData = new FormData();

              console.log(
                "jobOperationList :",
                JSON.stringify(jobOperationList)
              );
              let final_jobOperationList = jobOperationList.map((v) => {
                let obj = {
                  id: v.detailId,
                  cycleTime: v.cycleTime,
                  pcsRate: v.pcsRate,
                  averagePerShift: v.averagePerShift,
                  pointPerJob: v.pointPerJob,
                  operationBreakInMin: v.operationBreakInMin,
                  effectiveDate: moment(v.effectiveDate).format("YYYY-MM-DD"),
                };
                return obj;
              });
              console.log("JOBOPe", jobOperationList);
              requestData.append(
                "jobOperationList",
                JSON.stringify(final_jobOperationList)
              );

              requestData.append("jobId", values.jobId.value);
              requestData.append("jobOperationName", values.operationName);
              requestData.append("jobOperationNo", values.operationNo);

              requestData.append(
                "jobOperationId",
                jobOperationObject.jobOperationId
              );
              requestData.append("jobOperationImagePath", values.jobDocument);
              requestData.append("procedureSheet", values.procedureSheet);

              let oldOperationRemove = [];
              oldJobOperationList.map((v) => {
                if (v.detailId != "" && v.detailId != null) {
                  oldOperationRemove.push({ operationDetailsId: v.detailId });
                }
              });

              requestData.append(
                "oldoperationremovelist",
                JSON.stringify(oldOperationRemove)
              );
              updateJobOperation(requestData)
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
                  {/* {JSON.stringify(values)} */}
                  {/* <pre>{JSON.stringify(initVal)}</pre> */}
                  <Row>
                    <Col md="2">
                      <FormGroup>
                        <Label htmlFor="jobId"> Select Item </Label>

                        <Select
                          ////isClearable={true}
                          styles={{
                            clearIndicator: ClearIndicatorStyles,
                          }}
                          onChange={(v) => {
                            setFieldValue("jobId", v);
                          }}
                          name="jobId"
                          options={jobOpts}
                          value={values.jobId}
                        />
                        <span className="text-danger">{errors.jobId}</span>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Operation Name</Label>
                        <Input
                          type="text"
                          placeholder="Enter operation name"
                          name="operationName"
                          onChange={handleChange}
                          value={values.operationName}
                          invalid={errors.operationName ? true : false}
                        />
                        <FormFeedback>{errors.operationName}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Operation No.</Label>
                        <Input
                          type="text"
                          placeholder="Enter operation no"
                          name="operationNo"
                          onChange={handleChange}
                          value={values.operationNo}
                          invalid={errors.operationNo ? true : false}
                        />
                        <FormFeedback>{errors.operationNo}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label htmlFor="employeeType">
                          Upload Drawing / Sheet
                        </Label>
                        <InputGroup className="z-index_0">
                          <div className="custom-file">
                            <Input
                              type="file"
                              accept="image/*,application/pdf"
                              name="jobDocument"
                              className="custom-file-input"
                              onChange={(e) => {
                                setFieldValue("jobDocument", e.target.files[0]);
                              }}
                            />
                            <label
                              className="custom-file-label"
                              htmlFor="jobDocument"
                            >
                              {values.jobDocument
                                ? "FILE SELECTED"
                                : "Upload Drawing / Sheet"}
                            </label>
                          </div>
                        </InputGroup>
                        <span className="text-danger">
                          {errors.jobDocument}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label htmlFor="employeeType">
                          Upload Procedure Sheet
                        </Label>
                        <InputGroup className="z-index_0">
                          <div className="custom-file">
                            <Input
                              type="file"
                              accept="image/*,application/pdf"
                              name="procedureSheet"
                              className="custom-file-input"
                              onChange={(e) => {
                                setFieldValue(
                                  "procedureSheet",
                                  e.target.files[0]
                                );
                              }}
                            />
                            <label
                              className="custom-file-label"
                              htmlFor="procedureSheet"
                            >
                              {values.procedureSheet
                                ? "FILE SELECTED"
                                : "Upload Procedure Sheet"}
                            </label>
                          </div>
                        </InputGroup>
                        <span className="text-danger">
                          {errors.procedureSheet}
                        </span>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>Old Drawing Sheet</Label>
                        <br />
                        {values.oldjobDocument != "" ? (
                          <>
                            <a href={values.oldjobDocument} target="_blank">
                              View Drawing Sheet
                            </a>

                            <Button
                              style={{ minWidth: "35px" }}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                this.deleteDrawingSheetFun(
                                  jobOperationObject.jobOperationId
                                );
                              }}
                            >
                              <i className="fa fa-trash"></i>
                            </Button>
                          </>
                        ) : (
                          "Not Uploaded"
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Old Procedure Sheet</Label>
                        <br />
                        {values.oldprocedureSheet != "" ? (
                          <>
                            <a href={values.oldprocedureSheet} target="_blank">
                              View Procedure Sheet
                            </a>

                            <Button
                              style={{ minWidth: "35px" }}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                this.deleteProcedureSheetFun(
                                  jobOperationObject.jobOperationId
                                );
                              }}
                            >
                              <i className="fa fa-trash"></i>
                            </Button>
                          </>
                        ) : (
                          "Not Uploaded"
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="2">
                      <Label className="formlabelsize">Effected Date</Label>
                      <MyDatePicker
                        className="datepic form-control"
                        name="effectiveDate"
                        placeholderText="dd/MM/yyyy"
                        id="effectiveDate"
                        selected={values.effectiveDate}
                        onChange={(date) => {
                          setFieldValue("effectiveDate", date);
                        }}
                        dateFormat="dd/MM/yyyy"
                        value={values.effectiveDate}
                        // minDate={new Date()}
                      />
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Cycle Time</Label>
                        <Input
                          type="text"
                          placeholder="Enter cycle time"
                          name="cycleTime"
                          id="cycleTime"
                          // onChange={handleChange}
                          onChange={(e) => {
                            let cTime = e.target.value;
                            console.log({ cTime });
                            if (
                              cTime != undefined &&
                              cTime != null &&
                              cTime != ""
                            ) {
                              let avgPerShift =
                                (480 - parseInt(values.operationBreakInMin)) /
                                parseFloat(cTime);
                              let pointPerJob = 100 / avgPerShift;

                              setFieldValue("cycleTime", cTime);
                              setFieldValue("averagePerShift", avgPerShift);
                              setFieldValue("pointPerJob", pointPerJob);
                            } else {
                              setFieldValue("cycleTime", cTime);
                              setFieldValue("averagePerShift", "");
                              setFieldValue("pointPerJob", "");
                            }
                          }}
                          value={values.cycleTime}
                          invalid={errors.cycleTime ? true : false}
                        />
                        <FormFeedback>{errors.cycleTime}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Break Time (Min.)</Label>
                        <Input
                          type="text"
                          placeholder="Enter break time in minutes"
                          name="operationBreakInMin"
                          id="operationBreakInMin"
                          // onChange={handleChange}
                          onChange={(e) => {
                            let operationBreakInMin = e.target.value;
                            console.log({ operationBreakInMin });
                            if (
                              operationBreakInMin != undefined &&
                              operationBreakInMin != null &&
                              operationBreakInMin != ""
                            ) {
                              let avgPerShift =
                                (480 - parseInt(operationBreakInMin)) /
                                parseFloat(values.cycleTime);
                              let pointPerJob = 100 / avgPerShift;

                              setFieldValue(
                                "operationBreakInMin",
                                operationBreakInMin
                              );
                              setFieldValue("averagePerShift", avgPerShift);
                              setFieldValue("pointPerJob", pointPerJob);
                            } else {
                              setFieldValue(
                                "operationBreakInMin",
                                operationBreakInMin
                              );
                              setFieldValue("averagePerShift", "");
                              setFieldValue("pointPerJob", "");
                            }
                          }}
                          value={values.operationBreakInMin}
                          invalid={errors.operationBreakInMin ? true : false}
                        />
                        <FormFeedback>
                          {errors.operationBreakInMin}
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Average Shift</Label>
                        <Input
                          readOnly={true}
                          type="text"
                          placeholder="Enter average per shift"
                          name="averagePerShift"
                          id="averagePerShift"
                          onChange={handleChange}
                          value={values.averagePerShift}
                          invalid={errors.averagePerShift ? true : false}
                        />
                        <FormFeedback>{errors.averagePerShift}</FormFeedback>
                      </FormGroup>
                    </Col>

                    <Col md="1">
                      <FormGroup>
                        <Label>PCS Rate</Label>
                        <Input
                          type="text"
                          placeholder="Enter pcs rate"
                          name="pcsRate"
                          id="pcsRate"
                          onChange={handleChange}
                          value={values.pcsRate}
                          invalid={errors.pcsRate ? true : false}
                          // readOnly={true}
                        />
                        <FormFeedback>{errors.pcsRate}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label>Point Job</Label>
                        <Input
                          readOnly={true}
                          type="text"
                          placeholder="Enter point per job"
                          name="pointPerJob"
                          id="pointPerJob"
                          onChange={handleChange}
                          value={values.pointPerJob}
                          invalid={errors.pointPerJob ? true : false}
                        />
                        <FormFeedback>{errors.pointPerJob}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Button
                      className="mainbtn1 modalcancelbtn"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        this.addEditJobOperation(values, setFieldValue);
                      }}
                    >
                      Add Row
                    </Button>
                  </Row>
                  {/* <Row>{JSON.stringify(jobOperationList)}</Row> */}
                  {jobOperationList.length > 0 && (
                    <Row className="mb-4 emp">
                      <Col md="12">
                        <Table bordered hover>
                          <thead style={{ background: "#f5f5f5" }}>
                            <tr>
                              <th> Effective Date</th>
                              <th>Cycle Time</th>
                              <th> Break Time(Min)</th>
                              <th> Average Shift</th>
                              <th>PCS Rate</th>
                              <th> Point Job</th>
                              <th> Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {jobOperationList &&
                              jobOperationList.map((v, key) => (
                                <tr>
                                  <td>
                                    {moment(v.effectiveDate).format(
                                      "DD MMM yyyy"
                                    )}
                                  </td>
                                  <td>{v.cycleTime}</td>
                                  <td>{v.operationBreakInMin}</td>

                                  <td>
                                    {parseFloat(v.averagePerShift).toFixed(2)}
                                  </td>
                                  <td>{v.pcsRate}</td>
                                  <td>
                                    {parseFloat(v.pointPerJob).toFixed(2)}
                                  </td>

                                  <td>
                                    {" "}
                                    <Button
                                      style={{ minWidth: "35px" }}
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        console.log({ v });
                                        this.editJobOperationList(
                                          key,
                                          v,
                                          setFieldValue
                                        );
                                      }}
                                    >
                                      <i className="fa fa-edit"></i>
                                    </Button>
                                    <Button
                                      style={{ minWidth: "35px" }}
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.removeJobOperationList(key);
                                      }}
                                    >
                                      <i className="fa fa-trash"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  )}
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
                      this.onEditModalShow(false);
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
export default WithUserPermission(jobOperation);
