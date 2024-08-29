import React, { Component } from "react";
import GridTable from "@nadavshaar/react-grid-table";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import { IconButton } from "@material-ui/core";
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
import delete_ from "@/assets/images/delete_.png";
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
} from "@/helpers";
import { DTLineInspectionUrl } from "@/services/api";
import {
  ActionList,
  createLineInspection,
  findLineInspection,
  updateLineInspection,
  deleteLineInspection,
  listOfJobsForSelect,
  listJobOperation,
} from "@/services/api_function";
import Select from "react-select";
import axios from "axios";

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

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
  const { currentIndex, onEditModalShow, onDeleteModalShow } = header;
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
        <Button
          title="EDIT"
          id="Tooltipedit"
          className="edityellowbtn"
          onClick={(e) => {
            e.preventDefault();
            onEditModalShow(true, data.id, rowIndex);
          }}
        >
          <i className="fa fa-edit"></i>
        </Button>
      )}

      <Button
        title="DELETE"
        id="Tooltipdelete"
        className="deleteredbtn"
        onClick={(e) => {
          e.preventDefault();
          onDeleteModalShow(data.id);
        }}
      >
        <i className="fa fa-trash"></i>
      </Button>
    </>
  );
};

class Inspection extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.state = {
      refresh: true,
      addModalShow: false,
      editModalShow: false,
      isLoading: false,
      currentIndex: 0,
      lineInspectionObject: "",
      actionOpts: [],
      jobOperationOpts: [],
      jobOpts: [],
      inspectionList: [],
      initVal: {
        drawingSize: "",
        jobId: "",
        jobOperationId: "",
      },
    };
  }

  setInitVal = () => {
    let initVal = {
      drawingSize: "",
      jobId: "",
      jobOperationId: "",
    };
    this.setState({ initVal: initVal });
  };
  setTableManager = (tm) => (this.tableManager.current = tm);
  addBtn = isWriteAuthorized("master", "designationPermission") && (
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
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
    };

    const response = await axios({
      url: DTLineInspectionUrl(),
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
      let reqData = new FormData();
      reqData.append("id", id);
      findLineInspection(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            let result = response.data.response;

            let jobId = result.jobId;
            let job_opt = getSelectValue(
              this.state.jobOpts,
              parseInt(result.jobId)
            );
            result.jobId = job_opt;

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
      this.setState({
        currentIndex: 0,
        editModalShow: status,
      });
    }
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
        this.setState({ jobOperationOpts: jobOperationOp }, () => {
          if (values != null && values.jobOperationId) {
            let jobOperationOpt =
              values.jobOperationId != ""
                ? getSelectValue(jobOperationOp, values.jobOperationId)
                : "";

            values.jobOperationId = jobOperationOpt;
            this.setState({
              lineInspectionObject: values,
              editModalShow: true,
              currentIndex: 0,
            });
          }
        });
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  addLineInpect = (drawingSize, jobId, jobOperationId, setFieldValue) => {
    const { inspectionList } = this.state;
    if (drawingSize != "" && jobId != "" && jobOperationId != "") {
      let prod_data = {
        drawingSize: drawingSize,
        jobId: jobId,
        jobOperationId: jobOperationId,
      };
      let old_lst = inspectionList;
      let is_updated = false;
      let final_state = old_lst.map((item) => {
        if (item.drawingSize === prod_data.drawingSize) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...inspectionList, prod_data];
      }
      this.setState({ inspectionList: final_state });
      setFieldValue("drawingSize", "");
    }
  };

  removeLineInspect = (index) => {
    const { inspectionList } = this.state;
    const list = [...inspectionList];
    list.splice(index, 1);
    this.setState({ inspectionList: list });
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
      deleteLineInspection(reqData)
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

  componentDidMount() {
    this.getActionList();
    this.getJobList();
    this.setInitVal();
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

  render() {
    const columns = [
      {
        id: "job_name",
        field: "jobName",
        label: "Job Name",
        resizable: true,
      },
      {
        id: "operation_name",
        field: "operationName",
        label: "Job Operation",
        resizable: true,
      },
      {
        id: "drawing_size",
        field: "drawingSize",
        label: "Drawing Size",
        resizable: true,
      },
      {
        id: "created_at",
        field: "createdAt",
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
        cellRenderer: ActionsCellRender,
      },
    ];

    const {
      actionOpts,
      addModalShow,
      editModalShow,
      isLoading,
      lineInspectionObject,
      currentIndex,
      jobOpts,
      jobOperationOpts,
      setFieldValue,
      inspectionList,
      initVal,
    } = this.state;

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
                label: "Inspection",
                addBtn: this.addBtn,
                currentIndex: currentIndex,
                onEditModalShow: this.onEditModalShow.bind(this),
                onDeleteModalShow: this.onDeleteModalShow.bind(this),
              },
            }}
            onLoad={this.setTableManager.bind(this)}
          />
        )}

        {/* Add Modal */}
        <Modal
          className="modal-lg p-2"
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
            Create Line Inspection
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{ initVal }}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              this.setState({ isLoading: true });

              let requestData = new FormData();

              requestData.append("rows", JSON.stringify(inspectionList));
              requestData.append("jobId", values.jobId.value);
              requestData.append("jobOperationId", values.jobOperationId.value);

              createLineInspection(requestData)
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
                    <Col md="4">
                      <FormGroup>
                        <Label>Drawing Size</Label>
                        <Input
                          type="text"
                          placeholder="Enter Drawing Size"
                          name="drawingSize"
                          onChange={handleChange}
                          value={values.drawingSize}
                          invalid={errors.drawingSize ? true : false}
                        />
                        <FormFeedback>{errors.drawingSize}</FormFeedback>
                      </FormGroup>
                    </Col>

                    <Button
                      className="mainbtn1 addrowbtn1"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          values.drawingSize != "" &&
                          values.jobId != "" &&
                          values.jobOperationId != ""
                        ) {
                          this.addLineInpect(
                            values.drawingSize,
                            values.jobId,
                            values.jobOperationId,
                            setFieldValue
                          );
                        } else {
                          toast.error("✘ Error");
                        }
                      }}
                    >
                      Add Row
                    </Button>
                  </Row>

                  {inspectionList && inspectionList.length > 0 && (
                    <div
                      className="institutetbl denomination-style"
                      style={{ height: "auto" }}
                    >
                      <Table hover size="sm" className="key table-style">
                        <thead>
                          <tr>
                            <th>Drawing Size</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inspectionList.map((v, key) => {
                            return (
                              <tr key={key} className="tablecursor">
                                <td>{v.drawingSize}</td>
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
                  {/* {JSON.stringify(inspectionList)} */}
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
          className="modal-lg p-2"
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
            Update Line Inspection
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={{
              drawingSize:
                lineInspectionObject != null
                  ? lineInspectionObject.drawingSize
                  : "",
              jobId:
                lineInspectionObject != null ? lineInspectionObject.jobId : "",
              jobOperationId:
                lineInspectionObject != null
                  ? lineInspectionObject.jobOperationId
                  : "",
            }}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              console.log("values", values);
              setStatus();
              this.setState({ isLoading: true });
              let requestData = new FormData();
              requestData.append("id", lineInspectionObject.id);
              // requestData.append("rows", JSON.stringify(inspectionList));
              requestData.append("drawingSize", values.drawingSize);
              requestData.append("jobId", values.jobId.value);
              requestData.append("jobOperationId", values.jobOperationId.value);
              updateLineInspection(requestData)
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
                  </Row>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>Drawing Size</Label>
                        <Input
                          type="text"
                          placeholder="Enter Drawing Size"
                          name="drawingSize"
                          onChange={handleChange}
                          value={values.drawingSize}
                          invalid={errors.drawingSize ? true : false}
                        />
                        <FormFeedback>{errors.drawingSize}</FormFeedback>
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
export default Inspection;
