import React, { useState } from "react";
import AdvanceDatatable from "@/helpers/AdvanceDatatable";
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
import { Image } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import {
  SUPPORTED_FORMATS_IMG,
  isWriteAuthorized,
  isReadAuthorized,
} from "@/helpers";
import { DTOperationProcedureUrl } from "@/services/api";
import {
  createOperationProcedure,
  findOperationProcedure,
  updateOperationProcedure,
  deleteOperationProcedure,
  jobOperationList,
} from "@/services/api_function";
const ClearIndicator = (props) => {
  const {
    children = <CustomClearText />,
    getStyles,
    innerProps: { ref, ...restInnerProps },
  } = props;
  return (
    <div
      {...restInnerProps}
      ref={ref}
      style={getStyles("clearIndicator", props)}
    >
      <div style={{ padding: "0px 5px" }}>{children}</div>
    </div>
  );
};

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});
export default function OperationProcedure(props) {
  const [refresh, setRefresh] = useState(true);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [procedureObject, setProcedureObject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [machibeOpts, setMachineOpts] = useState([]);
  const [jobOperationOpts, setJobOperationOpts] = useState([]);
  const [parameterOpts, setParameterOpts] = useState([]);
  const [toolOpts, setToolOpts] = useState([]);

  const columns = [
    {
      name: "Name",
      selector: "jobName",
      sortable: false,
    },
    {
      name: "Created Date",
      selector: "createdAt",
      cell: (row) => moment(row.createdAt).format("Do MMM YYYY"),
      sortable: false,
    },
    {
      name: "Action",
      cell: (row) =>
        isWriteAuthorized("master", "designationPermission") && (
          <>
            <Button
              title="EDIT"
              id="Tooltipedit"
              className="edityellowbtn"
              onClick={() => {
                onEditModalShow(true, row.id);
              }}
            >
              <i className="fa fa-edit"></i>
            </Button>
            <Button
              title="DELETE"
              id="Tooltipdelete"
              className="deleteredbtn"
              onClick={() => {
                onDeleteModalShow(row.id);
              }}
            >
              <i className="fa fa-trash"></i>
            </Button>
          </>
        ),
      button: true,
    },
  ];

  const addBtn = isWriteAuthorized("master", "designationPermission") && (
    <>
      {" "}
      <IconButton
        id="TooltipExample"
        color="primary"
        title="CREATE"
        onClick={() => {
          onAddModalShow(true);
        }}
      >
        <AddIcon />
      </IconButton>
    </>
  );
  const onAddModalShow = (status) => {
    setAddModalShow(status);
  };

  const onEditModalShow = (status, id) => {
    if (status) {
      let reqData = {
        id: id,
      };
      findJob(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            setjobObject(response.data.response);
            setEditModalShow(status);
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          console.log("errors", error);
        });
    } else {
      setEditModalShow(status);
    }
  };

  const onDeleteModalShow = (id) => {
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

      deleteJob(reqData)
        .then((response) => {
          if (response.data.responseStatus == 200) {
            toast.success("✔ " + response.data.message);
            setRefresh(true);
          } else {
            toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          toast.error("✘ " + error);
        });
    });
  };
  const getMachineList = () => {
    listOfMachineForSelect()
      .then((response) => {
        let jobOpts =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.name,
            };
          });
        setMachineOpts(jobOpts);
      })
      .catch((error) => {
        console.log({ error });
      });
  };
  const getJobOperationList = () => {
    jobOperationList()
      .then((response) => {
        let jobOperationOpts =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.operationName,
            };
          });
        setJobOperationOpts(jobOperationOpts);
      })
      .catch((error) => {
        console.log({ error });
      });
  };
  const getParameterList = () => {
    ParameterList()
      .then((response) => {
        let jobOperationOpts =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.operationName,
            };
          });
        setParameterOpts(jobOperationOpts);
      })
      .catch((error) => {
        console.log({ error });
      });
  };
  const getToolList = () => {
    toolList()
      .then((response) => {
        let jobOperationOpts =
          response.data.response &&
          response.data.response.map(function (values) {
            return {
              value: values.id,
              label: values.operationName,
            };
          });
        setToolOpts(jobOperationOpts);
      })
      .catch((error) => {
        console.log({ error });
      });
  };
  useEffect(() => {
    getMachineList();
    getJobOperationList();
    getParameterList();
    getToolList();
  }, []);
  return (
    <div>
      {(isReadAuthorized("master", "designationPermission") ||
        isWriteAuthorized("master", "designationPermission")) && (
        <AdvanceDatatable
          title="Job"
          columns={columns}
          actionUrl={DTJobUrl()}
          addBtn={addBtn}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
      {/* Add Modal */}
      <Modal
        className="modal-lg p-2"
        isOpen={addModalShow}
        toggle={() => {
          onAddModalShow(false);
        }}
      >
        <ModalHeader
          className="p-2 modalheadernew"
          toggle={() => {
            onAddModalShow(false);
          }}
        >
          Create Procedure
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            jobOperationId: "",
            machineId: "",
            parameterId: "",
            toolId: "",
            prevJobOperation: "",
            nextJobOperation: "",
            custDrgNo: "",
            partName: "",
            partNumber: "",
            revNo: "",
            changeLevelDate: "",
            operationProcedure: "",
          }}
          validationSchema={Yup.object().shape({
            //jobName: Yup.string().trim().required("Job name is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = new FormData();
            requestData.append("jobOperationId", values.jobOperationId.value);
            requestData.append("machineId", values.machineId.value);
            requestData.append("parameterId", values.parameterId.value);
            requestData.append("toolId", values.toolId.value);
            requestData.append("prevJobOperation", values.prevJobOperation);
            requestData.append("nextJobOperation", values.nextJobOperation);
            requestData.append("custDrgNo", values.custDrgNo);
            requestData.append("partName", values.partName);
            requestData.append("partNumber", values.partNumber);
            requestData.append("revNo", values.revNo);
            requestData.append("changeLevelDate", values.changeLevelDate);
            requestData.append("operationProcedure", values.operationProcedure);

            createOperationProcedure(requestData)
              .then((response) => {
                setIsLoading(false);
                if (response.data.responseStatus === 200) {
                  setSubmitting(false);
                  toast.success("✔ " + response.data.message);
                  resetForm();
                  onAddModalShow(false);
                  setRefresh(true);
                } else {
                  setSubmitting(false);
                  toast.error("✘ " + response.data.message);
                }
              })
              .catch((error) => {
                setIsLoading(false);
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
                      <Label htmlFor="jobOperationId">
                        {" "}
                        Select JobOperation{" "}
                      </Label>

                      <Select
                        ////isClearable={true}
                        // closeMenuOnSelect={TramRounded}
                        // components={{ ClearIndicator }}
                        styles={{
                          clearIndicator: ClearIndicatorStyles,
                        }}
                        onChange={(v) => {
                          setFieldValue("jobOperationId", v);
                        }}
                        name="jobOperationId"
                        options={jobOpts}
                        value={values.jobOperationId}
                      />
                      <span className="text-danger">
                        {errors.jobOperationId &&
                          "Please select job operation."}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="machineId"> Select Machine </Label>

                      <Select
                        ////isClearable={true}
                        // closeMenuOnSelect={TramRounded}
                        // components={{ ClearIndicator }}
                        styles={{
                          clearIndicator: ClearIndicatorStyles,
                        }}
                        onChange={(v) => {
                          setFieldValue("machineId", v);
                        }}
                        name="machineId"
                        options={jobOpts}
                        value={values.machineId}
                      />
                      <span className="text-danger">
                        {errors.machineId && "Please select machine."}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="parameterId"> Select Parameter </Label>

                      <Select
                        ////isClearable={true}
                        // closeMenuOnSelect={TramRounded}
                        // components={{ ClearIndicator }}
                        styles={{
                          clearIndicator: ClearIndicatorStyles,
                        }}
                        onChange={(v) => {
                          setFieldValue("parameterId", v);
                        }}
                        name="parameterId"
                        options={jobOpts}
                        value={values.parameterId}
                      />
                      <span className="text-danger">
                        {errors.parameterId && "Please select parameter."}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="toolId"> Select Tool </Label>

                      <Select
                        ////isClearable={true}
                        // closeMenuOnSelect={TramRounded}
                        // components={{ ClearIndicator }}
                        styles={{
                          clearIndicator: ClearIndicatorStyles,
                        }}
                        onChange={(v) => {
                          setFieldValue("toolId", v);
                        }}
                        name="toolId"
                        options={jobOpts}
                        value={values.toolId}
                      />
                      <span className="text-danger">
                        {errors.toolId && "Please select tool."}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Previous Operation</Label>
                      <Input
                        type="text"
                        placeholder="Enter PrevJobOperation"
                        name="prevJobOperation"
                        onChange={handleChange}
                        value={values.prevJobOperation}
                        invalid={errors.prevJobOperation ? true : false}
                      />
                      <FormFeedback>{errors.prevJobOperation}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Next Operation</Label>
                      <Input
                        type="text"
                        placeholder="Enter nextJobOperation"
                        name="nextJobOperation"
                        onChange={handleChange}
                        value={values.nextJobOperation}
                        invalid={errors.nextJobOperation ? true : false}
                      />
                      <FormFeedback>{errors.nextJobOperation}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Cust DrgNo</Label>
                      <Input
                        type="text"
                        placeholder="Enter custDrgNo"
                        name="custDrgNo"
                        onChange={handleChange}
                        value={values.custDrgNo}
                        invalid={errors.custDrgNo ? true : false}
                      />
                      <FormFeedback>{errors.custDrgNo}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Next Operation</Label>
                      <Input
                        type="text"
                        placeholder="Enter nextJobOperation"
                        name="nextJobOperation"
                        onChange={handleChange}
                        value={values.nextJobOperation}
                        invalid={errors.nextJobOperation ? true : false}
                      />
                      <FormFeedback>{errors.nextJobOperation}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Part Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter partName"
                        name="partName"
                        onChange={handleChange}
                        value={values.partName}
                        invalid={errors.partName ? true : false}
                      />
                      <FormFeedback>{errors.partName}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Part Number</Label>
                      <Input
                        type="text"
                        placeholder="Enter partNumber"
                        name="partNumber"
                        onChange={handleChange}
                        value={values.partNumber}
                        invalid={errors.partNumber ? true : false}
                      />
                      <FormFeedback>{errors.partNumber}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>RevNo</Label>
                      <Input
                        type="text"
                        placeholder="Enter revNo"
                        name="revNo"
                        onChange={handleChange}
                        value={values.revNo}
                        invalid={errors.revNo ? true : false}
                      />
                      <FormFeedback>{errors.revNo}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Change Level Date</Label>
                      <Input
                        type="text"
                        placeholder="Enter changeLevelDate"
                        name="changeLevelDate"
                        onChange={handleChange}
                        value={values.changeLevelDate}
                        invalid={errors.changeLevelDate ? true : false}
                      />
                      <FormFeedback>{errors.changeLevelDate}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Operation Procedure</Label>
                      <Input
                        type="text"
                        placeholder="Enter operationProcedure"
                        name="operationProcedure"
                        onChange={handleChange}
                        value={values.operationProcedure}
                        invalid={errors.operationProcedure ? true : false}
                      />
                      <FormFeedback>{errors.operationProcedure}</FormFeedback>
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
                    Creating...
                  </Button>
                ) : (
                  <Button type="submit" className="mainbtn1 text-white">
                    Create
                  </Button>
                )}

                <Button
                  className="mainbtn1 modalcancelbtn"
                  type="button"
                  onClick={() => {
                    onAddModalShow(null);
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
          onEditModalShow(null);
        }}
      >
        <ModalHeader
          className="modalheadernew p-2"
          toggle={() => {
            onEditModalShow(null);
          }}
        >
          Update Job
        </ModalHeader>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize={true}
          initialValues={{
            jobName: jobObject != null ? jobObject.jobName : "",
          }}
          validationSchema={Yup.object().shape({
            jobName: Yup.string().trim().required("Job name is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            setIsLoading(true);
            let requestData = {
              id: jobObject.id,
              jobName: values.jobName,
            };

            updateJob(requestData)
              .then((response) => {
                setIsLoading(false);
                if (response.data.responseStatus === 200) {
                  setSubmitting(false);
                  toast.success("✔ " + response.data.message);
                  resetForm();
                  onEditModalShow(false);
                  setRefresh(true);
                } else {
                  setSubmitting(false);
                  toast.error("✘ " + response.data.message);
                }
              })
              .catch((error) => {
                setIsLoading(false);
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
                      <Label>Job Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter Job name"
                        name="jobName"
                        onChange={handleChange}
                        value={values.jobName}
                        invalid={errors.jobName ? true : false}
                      />
                      <FormFeedback>{errors.jobName}</FormFeedback>
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
                    onEditModalShow(null);
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
