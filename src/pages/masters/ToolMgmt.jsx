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
import { DTToolMgmtUrl } from "@/services/api";
import {
  ActionList,
  createToolMgmt,
  findToolMgmt,
  updateToolMgmt,
  deleteToolMgmt,
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
        isActionExist("tool-mgmt", "edit", userPermissions) && (
          <Button
            title="EDIT"
            id="Tooltipedit"
            className="edityellowbtn"
            onClick={(e) => {
              e.preventDefault();
              onEditModalShow(true, data.toolManagementId, rowIndex);
            }}
          >
            <i className="fa fa-edit"></i>
          </Button>
        )
      )}
      {isActionExist("tool-mgmt", "delete", userPermissions) && (
        <Button
          title="DELETE"
          id="Tooltipdelete"
          className="deleteredbtn"
          onClick={(e) => {
            e.preventDefault();
            onDeleteModalShow(data.toolManagementId);
          }}
        >
          <i className="fa fa-trash"></i>
        </Button>
      )}
    </>
  );
};

class ToolMgmt extends Component {
  constructor(props) {
    super(props);

    this.tableManager = React.createRef(null);
    this.state = {
      refresh: true,
      addModalShow: false,
      editModalShow: false,
      isLoading: false,
      currentIndex: 0,
      toolMgmtObject: "",
      actionOpts: [],
    };
  }
  setTableManager = (tm) => (this.tableManager.current = tm);
  addBtn = isWriteAuthorized("master", "designationPermission") &&
    isActionExist("tool-mgmt", "create", this.props.userPermissions) && (
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
      url: DTToolMgmtUrl(),
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
    this.setState({ addModalShow: status });
  };

  onEditModalShow = (status, id, rowIndex) => {
    if (status) {
      this.setState({ currentIndex: rowIndex });
      let reqData = {
        id: id,
      };
      findToolMgmt(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            let result = response.data.response;
            let action_opt = getSelectValue(
              this.state.actionOpts,
              parseInt(result.actionId)
            );
            result.actionId = action_opt;

            this.setState({
              toolMgmtObject: result,
              currentIndex: 0,
              editModalShow: status,
            });
          } else {
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

      deleteToolMgmt(reqData)
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
        id: "block",
        field: "block",
        label: "Block",
        resizable: true,
      },
      {
        id: "offset_no",
        field: "offsetNo",
        label: "Offset No",
        resizable: true,
      },
      {
        id: "tool_holders",
        field: "toolHolders",
        label: "ToolHolders",
        sortable: true,
      },
      {
        id: "inserts",
        field: "inserts",
        label: "Inserts",
        resizable: true,
      },
      {
        id: "action_name",
        field: "actionName",
        label: "Action",
        resizable: true,
      },
      {
        id: "frequency",
        field: "frequency",
        label: "Frequency",
        resizable: true,
      },
      {
        id: "used_for",
        field: "usedFor",
        label: "Used For",
        resizable: true,
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
        cellRenderer: ActionsCellRender,
      },
    ];

    const {
      actionOpts,
      addModalShow,
      editModalShow,
      isLoading,
      toolMgmtObject,
      currentIndex,
    } = this.state;
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
                label: "Tool Mgmt",
                addBtn: this.addBtn,
                currentIndex: currentIndex,
                onEditModalShow: this.onEditModalShow.bind(this),
                onDeleteModalShow: this.onDeleteModalShow.bind(this),
                userPermissions: userPermissions,
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
            Create Tool Management
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
              block: "",
              offsetNo: "",
              toolHolders: "",
              inserts: "",
              actionId: "",
              frequency: "",
              usedFor: "",
            }}
            validationSchema={Yup.object().shape({
              block: Yup.string().trim().required("Block is required"),
              offsetNo: Yup.string().trim().required("Offset No is required"),
              toolHolders: Yup.string()
                .trim()
                .required("Tool Holders is required"),
              inserts: Yup.string().trim().required("Inserts is required"),
              actionId: Yup.object().nullable().required("Action is required"),
              frequency: Yup.string().trim().required("Frequency is required"),
              usedFor: Yup.string().trim().required("Used For is required"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              this.setState({ isLoading: true });
              let requestData = new FormData();
              requestData.append("block", values.block);
              requestData.append("offsetNo", values.offsetNo);
              requestData.append("toolHolders", values.toolHolders);
              requestData.append("inserts", values.inserts);
              requestData.append("actionId", values.actionId.value);
              requestData.append("frequency", values.frequency);
              requestData.append("usedFor", values.usedFor);
              createToolMgmt(requestData)
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
                        <Label>Block</Label>
                        <Input
                          type="text"
                          placeholder="Enter block"
                          name="block"
                          onChange={handleChange}
                          value={values.block}
                          invalid={errors.block ? true : false}
                        />
                        <FormFeedback>{errors.block}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Offset No</Label>
                        <Input
                          type="text"
                          placeholder="Enter offset no"
                          name="offsetNo"
                          onChange={handleChange}
                          value={values.offsetNo}
                          invalid={errors.offsetNo ? true : false}
                        />
                        <FormFeedback>{errors.offsetNo}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Tool Holders</Label>
                        <Input
                          type="text"
                          placeholder="Enter tool holders"
                          name="toolHolders"
                          onChange={handleChange}
                          value={values.toolHolders}
                          invalid={errors.toolHolders ? true : false}
                        />
                        <FormFeedback>{errors.toolHolders}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label htmlFor="jobId"> Select Action </Label>
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
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Inserts</Label>
                        <Input
                          type="text"
                          placeholder="Enter inserts"
                          name="inserts"
                          onChange={handleChange}
                          value={values.inserts}
                          invalid={errors.inserts ? true : false}
                        />
                        <FormFeedback>{errors.inserts}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Frequency</Label>
                        <Input
                          type="text"
                          placeholder="Enter frequency"
                          name="frequency"
                          onChange={handleChange}
                          value={values.frequency}
                          invalid={errors.frequency ? true : false}
                        />
                        <FormFeedback>{errors.frequency}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>Used For</Label>
                        <Input
                          type="text"
                          placeholder="Enter Used For"
                          name="usedFor"
                          onChange={handleChange}
                          value={values.usedFor}
                          invalid={errors.usedFor ? true : false}
                        />
                        <FormFeedback>{errors.usedFor}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
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
            Update Tool
          </ModalHeader>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={{
              block: toolMgmtObject != null ? toolMgmtObject.block : "",
              offsetNo: toolMgmtObject != null ? toolMgmtObject.offsetNo : "",
              toolHolders:
                toolMgmtObject != null ? toolMgmtObject.toolHolders : "",
              inserts: toolMgmtObject != null ? toolMgmtObject.inserts : "",
              actionId: toolMgmtObject != null ? toolMgmtObject.actionId : "",
              frequency: toolMgmtObject != null ? toolMgmtObject.frequency : "",
              usedFor: toolMgmtObject != null ? toolMgmtObject.usedFor : "",
            }}
            validationSchema={Yup.object().shape({
              block: Yup.string().trim().required("Block is required"),
              offsetNo: Yup.string().trim().required("Offset No is required"),
              toolHolders: Yup.string()
                .trim()
                .required("Tool Holders is required"),
              inserts: Yup.string().trim().required("Inserts is required"),
              actionId: Yup.object().nullable().required("Action is required"),
              frequency: Yup.string().trim().required("Frequency is required"),
              usedFor: Yup.string().trim().required("Used For is required"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              this.setState({ isLoading: true });
              let requestData = new FormData();
              requestData.append("id", toolMgmtObject.toolManagementId);
              requestData.append("block", values.block);
              requestData.append("offsetNo", values.offsetNo);
              requestData.append("toolHolders", values.toolHolders);
              requestData.append("inserts", values.inserts);
              requestData.append("actionId", values.actionId.value);
              requestData.append("frequency", values.frequency);
              requestData.append("usedFor", values.usedFor);
              updateToolMgmt(requestData)
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
                        <Label>Block</Label>
                        <Input
                          type="text"
                          placeholder="Enter block"
                          name="block"
                          onChange={handleChange}
                          value={values.block}
                          invalid={errors.block ? true : false}
                        />
                        <FormFeedback>{errors.block}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Offset No</Label>
                        <Input
                          type="text"
                          placeholder="Enter offset no"
                          name="offsetNo"
                          onChange={handleChange}
                          value={values.offsetNo}
                          invalid={errors.offsetNo ? true : false}
                        />
                        <FormFeedback>{errors.offsetNo}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Tool Holders</Label>
                        <Input
                          type="text"
                          placeholder="Enter tool holders"
                          name="toolHolders"
                          onChange={handleChange}
                          value={values.toolHolders}
                          invalid={errors.toolHolders ? true : false}
                        />
                        <FormFeedback>{errors.toolHolders}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label htmlFor="jobId"> Select Action </Label>
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
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Inserts</Label>
                        <Input
                          type="text"
                          placeholder="Enter inserts"
                          name="inserts"
                          onChange={handleChange}
                          value={values.inserts}
                          invalid={errors.inserts ? true : false}
                        />
                        <FormFeedback>{errors.inserts}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Frequency</Label>
                        <Input
                          type="text"
                          placeholder="Enter frequency"
                          name="frequency"
                          onChange={handleChange}
                          value={values.frequency}
                          invalid={errors.frequency ? true : false}
                        />
                        <FormFeedback>{errors.frequency}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>Used For</Label>
                        <Input
                          type="text"
                          placeholder="Enter Used For"
                          name="usedFor"
                          onChange={handleChange}
                          value={values.usedFor}
                          invalid={errors.usedFor ? true : false}
                        />
                        <FormFeedback>{errors.usedFor}</FormFeedback>
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
export default WithUserPermission(ToolMgmt);
