import React from "react";
import {
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Row,
  Col,
  Spinner,
  Dropdown,
  Button,
  CardBody,
  Card,
} from "reactstrap";
import { Form, Formik } from "formik";
import Select from "react-select";
import { useState } from "react";
import FormBootstrap from "react-bootstrap/Form";

const LedgerCreate = () => {
  // const ledgType = [
  //   {
  //     value: 4,
  //     label1: "Jayalaxmi Jewellers",
  //   },
  //   {
  //     value: 5,
  //     label: "Jaylaxmi Silver",
  //   },
  // ];

  const [boolean, setBoolean] = useState({
    code: true,
    credit: false,
    gst: false,
    salesman: false,
    license: false,
    shiping_details: false,
    department: false,
    footer_btn: false,
  });
  const ledgType = [
    {
      value: 1,
      label1: "Fixed Assets",
      ledger_form_parameter_id: 4,
      ledger_form_parameter_slug: "assets",
      sub_principle_id: "",
      label: "Fixed Assets",
      unique_code: "FIAS",
      under_prefix: "P#1",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 2,
      label1: "Investments",
      ledger_form_parameter_id: 4,
      ledger_form_parameter_slug: "assets",
      sub_principle_id: "",
      label: "Investments",
      unique_code: "INVT",
      under_prefix: "P#2",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 3,
      label1: "Current Assets",
      ledger_form_parameter_id: 4,
      ledger_form_parameter_slug: "assets",
      sub_principle_id: "",
      label: "Current Assets",
      unique_code: "CUAS",
      under_prefix: "P#3",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 4,
      label1: "Capital A/c",
      ledger_form_parameter_id: 6,
      ledger_form_parameter_slug: "others",
      sub_principle_id: "",
      label: "Capital A/c",
      unique_code: "CPAC",
      under_prefix: "P#4",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 5,
      label1: "Loans (Liabilities)",
      ledger_form_parameter_id: 6,
      ledger_form_parameter_slug: "others",
      sub_principle_id: "",
      label: "Loans (Liabilities",
      unique_code: "LOAN",
      under_prefix: "P#5",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 6,
      label1: "Current Liabilities",
      ledger_form_parameter_id: 6,
      ledger_form_parameter_slug: "others",
      sub_principle_id: "",
      label: "Current Liabilities",
      unique_code: "CULS",
      under_prefix: "P#6",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 7,
      label1: "Sales Accounts",
      ledger_form_parameter_id: 6,
      ledger_form_parameter_slug: "others",
      sub_principle_id: "",
      label: "Sales Accounts",
      unique_code: "SLAC",
      under_prefix: "P#7",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 8,
      label1: "Direct Income",
      ledger_form_parameter_id: 6,
      ledger_form_parameter_slug: "others",
      sub_principle_id: "",
      label: "Direct Income",
      unique_code: "DIIC",
      under_prefix: "P#8",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 9,
      label1: "Indirect Income",
      ledger_form_parameter_id: 6,
      ledger_form_parameter_slug: "others",
      sub_principle_id: "",
      label: "Indirect Income",
      unique_code: "INIC",
      under_prefix: "P#9",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 10,
      label1: "Purchase Accounts",
      ledger_form_parameter_id: 6,
      ledger_form_parameter_slug: "others",
      sub_principle_id: "",
      label: "Purchase Accounts",
      unique_code: "PUAC",
      under_prefix: "P#10",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 11,
      label1: "Direct Expenses",
      ledger_form_parameter_id: 6,
      ledger_form_parameter_slug: "others",
      sub_principle_id: "",
      label: "Direct Expenses",
      unique_code: "DIEX",
      under_prefix: "P#11",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 12,
      label1: "Indirect expenses",
      ledger_form_parameter_id: 6,
      ledger_form_parameter_slug: "others",
      sub_principle_id: "",
      label: "Indirect expenses",
      unique_code: "INEX",
      under_prefix: "P#12",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 13,
      label1: "Current Assets",
      sub_principle_id: 1,
      label: "Sundry Debtors",
      ledger_form_parameter_id: 2,
      ledger_form_parameter_slug: "sundry_debtors",
      unique_code: "SUDR",
      under_prefix: "PG#1",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 14,
      label1: "Current Assets",
      sub_principle_id: 2,
      label: "Bank Accounts",
      ledger_form_parameter_id: 3,
      ledger_form_parameter_slug: "bank_account",
      unique_code: "BAAC",
      under_prefix: "PG#2",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 15,
      label1: "Current Assets",
      sub_principle_id: 3,
      label: "Cash-in-hand",
      ledger_form_parameter_id: 6,
      ledger_form_parameter_slug: "others",
      unique_code: "CAIH",
      under_prefix: "PG#3",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 16,
      label1: "Current Assets",
      sub_principle_id: 4,
      label: "Stock-in-hand",
      ledger_form_parameter_id: 6,
      ledger_form_parameter_slug: "others",
      unique_code: "STIH",
      under_prefix: "PG#4",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 17,
      label1: "Current Liabilities",
      sub_principle_id: 5,
      label: "Sundry Creditors",
      ledger_form_parameter_id: 1,
      ledger_form_parameter_slug: "sundry_creditors",
      unique_code: "SUCR",
      under_prefix: "PG#5",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 18,
      label1: "Current Liabilities",
      sub_principle_id: 6,
      label: "Duties & Taxes",
      ledger_form_parameter_id: 5,
      ledger_form_parameter_slug: "duties_taxes",
      unique_code: "DUTX",
      under_prefix: "PG#6",
      associates_id: "",
      associates_name: "",
    },
    {
      value: 19,
      label1: "Current Liabilities",
      sub_principle_id: 7,
      label: "Bank O/D",
      ledger_form_parameter_id: 6,
      ledger_form_parameter_slug: "others",
      unique_code: "BAOD",
      under_prefix: "PG#7",
      associates_id: "",
      associates_name: "",
    },
    {
      associates_id: 1,
      associates_name: "Hbb",
      value: 20,
      label1: "Current Assets",
      sub_principle_id: "",
      label: "Current Assets",
      ledger_form_parameter_id: 4,
      ledger_form_parameter_slug: "assets",
      under_prefix: "AG#1",
    },
    {
      associates_id: 2,
      associates_name: "qwerty",
      value: 21,
      label1: "Current Assets",
      sub_principle_id: "1",
      label: "Sundry Debtors",
      ledger_form_parameter_id: 2,
      ledger_form_parameter_slug: "sundry_debtors",
      under_prefix: "AG#2",
    },
    {
      associates_id: 3,
      associates_name: "qwerty",
      value: 22,
      label1: "Current Assets",
      sub_principle_id: "1",
      label: "Sundry Debtors",
      ledger_form_parameter_id: 2,
      ledger_form_parameter_slug: "sundry_debtors",
      under_prefix: "AG#3",
    },
  ];
  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize={true}
      // initialValues={{
      //   companyName:
      //     designationObject != null ? designationObject.companyName : "",
      //   description:
      //     designationObject != null ? designationObject.description : "",
      // }}
      // validationSchema={Yup.object().shape({
      //   companyName: Yup.string()
      //     .trim()
      //     .nullable()
      //     .required("Company name is required"),
      //   description: Yup.string()
      //     .trim()
      //     .nullable()
      //     .required("Description is required"),
      // })}
      // onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
      //   setStatus();
      //   settrue(true);
      //   let requestData = {
      //     id: designationObject.id,
      //     companyName: values.companyName,
      //     description: values.description,
      //   };

      //   updateCompany(requestData)
      //     .then((response) => {
      //       settrue(false);
      //       if (response.data.responseStatus === 200) {
      //         setSubmitting(false);
      //         toast.success("✔ " + response.data.message);
      //         resetForm();
      //         onEditModalShow(false);
      //         tableManager.current.asyncApi.resetRows();
      //       } else {
      //         setSubmitting(false);
      //         toast.error("✘ " + response.data.message);
      //       }
      //     })
      //     .catch((error) => {
      //       settrue(false);
      //       setSubmitting(false);
      //       toast.error("✘ " + error);
      //     });
      // }}
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
          <Card>
            <CardBody className="border-bottom p-2">
              <Row>
                <Col md="2">
                  <FormGroup>
                    <Label>Ledger Type</Label>
                    <Select
                      //isClearable
                      // isDisabled={isLoading}
                      // isLoading={isLoading}
                      // onChange={handleChange}
                      options={ledgType}
                      onChange={(v) => {
                        console.log(v);
                        // setFieldValue("ledgerId", v);
                      }}
                      name="ledgerId"
                      // value={values.ledgerId}
                    />
                    <FormFeedback>{errors.companyName}</FormFeedback>
                  </FormGroup>
                </Col>
                {boolean.code ? (
                  <Col md="3">
                    <FormGroup>
                      <Label>Code</Label>
                      <Input
                        type="text"
                        placeholder="Enter Code here"
                        name="code"
                        // onChange={handleChange}
                        // value={values.code}
                        // invalid={errors.code ? true : false}
                      />
                      <FormFeedback>{errors.code}</FormFeedback>
                    </FormGroup>
                  </Col>
                ) : null}
                <Col md="3">
                  <FormGroup>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      placeholder="Enter Company name"
                      name="companyName"
                      // onChange={handleChange}
                      // value={values.companyName}
                      // invalid={errors.companyName ? true : false}
                    />
                    <FormFeedback>{errors.companyName}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label>Opening Bal.</Label>
                    <Input
                      type="text"
                      placeholder="Enter Opening Bal"
                      name="openingBal"
                      // onChange={handleChange}
                      // value={values.openingBal}
                      // invalid={errors.openingBal ? true : false}
                    />
                    <FormFeedback>{errors.openingBal}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md="1">
                  <FormGroup>
                    <Label>Dr/Cr</Label>
                    <Select
                      //isClearable
                      // isDisabled={isLoading}
                      // isLoading={isLoading}
                      // onChange={handleChange}
                      // options={options}
                      // value={props.value}
                    />
                    <FormFeedback>{errors.companyName}</FormFeedback>
                  </FormGroup>
                </Col>
              </Row>

              {boolean.footer_btn ? (
                <ModalFooter className="p-2">
                  {false ? (
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
                      updating...
                    </Button>
                  ) : (
                    <Button type="submit" className="mainbtn1 text-white">
                      Submit
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
              ) : null}
            </CardBody>
            <CardBody className="border-bottom p-2">
              <Row>
                <Col md="3">
                  <FormGroup>
                    <Label>Registered Name</Label>
                    <Input
                      type="text"
                      placeholder="Enter Registered Name here"
                      name="regName"
                      // onChange={handleChange}
                      // value={values.regName}
                      // invalid={errors.regName ? true : false}
                    />
                    <FormFeedback>{errors.regName}</FormFeedback>
                    {/* <FormFeedback>{errors.companyName}</FormFeedback> */}
                  </FormGroup>
                </Col>

                <Col md="5">
                  <FormGroup>
                    <Label>Address</Label>
                    <Input
                      type="text"
                      placeholder="Enter Address"
                      name="address"
                      // onChange={handleChange}
                      // value={values.address}
                      // invalid={errors.address ? true : false}
                    />
                    <FormFeedback>{errors.address}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label>State.</Label>
                    <Select
                      //isClearable
                      // isDisabled={isLoading}
                      // isLoading={isLoading}
                      // onChange={handleChange}
                      // options={ledgType}
                      onChange={(v) => {
                        console.log(v);
                        // setFieldValue("ledgerId", v);
                      }}
                      name="ledgerId"
                      // value={values.ledgerId}
                    />
                    <FormFeedback>{errors.description}</FormFeedback>
                  </FormGroup>
                </Col>

                <Col md="1">
                  <FormGroup>
                    <Label>Pin</Label>
                    <Input
                      type="text"
                      placeholder="Enter Company name"
                      name="pin"
                      // onChange={handleChange}
                      // value={values.pin}
                      // invalid={errors.pin ? true : false}
                    />
                    <FormFeedback>{errors.pin}</FormFeedback>
                  </FormGroup>
                </Col>

                <Col md="2">
                  <FormGroup>
                    <Label>Phone</Label>
                    <Input
                      type="text"
                      placeholder="Enter Phone"
                      name="phone"
                      // onChange={handleChange}
                      // value={values.phone}
                      // invalid={errors.phone ? true : false}
                    />
                    <FormFeedback>{errors.phone}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label>WhatsApp</Label>
                    <Input
                      type="text"
                      placeholder="Enter WhatsApp"
                      name="whatsapp"
                      // onChange={handleChange}
                      // value={values.whatsapp}
                      // invalid={errors.whatsapp ? true : false}
                    />
                    <FormFeedback>{errors.whatsapp}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label>Email</Label>
                    <Input
                      type="text"
                      placeholder="Enter Email"
                      name="email"
                      // onChange={handleChange}
                      // value={values.email}
                      // invalid={errors.email ? true : false}
                    />
                    <FormFeedback>{errors.email}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label>Reg No</Label>
                    <Input
                      type="text"
                      placeholder="Enter Reg No"
                      name="regNo"
                      // onChange={handleChange}
                      // value={values.regNo}
                      // invalid={errors.regNo ? true : false}
                    />
                    <FormFeedback>{errors.regNo}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label>Reg Date</Label>
                    <Input
                      type="date"
                      placeholder="Enter Reg Date"
                      name="regDate"
                      // onChange={handleChange}
                      // value={values.regDate}
                      // invalid={errors.regDate ? true : false}
                    />
                    <FormFeedback>{errors.regDate}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md="2">
                  <FormGroup>
                    {/* <Label>Credit</Label> */}
                    <FormBootstrap.Check // prettier-ignore
                      type="switch"
                      id="custom-switch"
                      label="Credit"
                      onChange={(v) => {
                        console.log(v);
                        setBoolean({ ...boolean, credit: !boolean.credit });
                      }}
                    />
                    <FormFeedback>{errors.regDate}</FormFeedback>
                  </FormGroup>
                </Col>
                {boolean.credit ? (
                  <>
                    <Col md="1">
                      <FormGroup>
                        <Label>Days</Label>
                        <Input
                          type="text"
                          placeholder="Enter Days Here"
                          name="days"
                          // onChange={handleChange}
                          // value={values.days}
                          // invalid={errors.days ? true : false}
                        />
                      </FormGroup>
                      <FormFeedback>{errors.Days}</FormFeedback>
                    </Col>
                    <Col md="1">
                      <FormGroup>
                        <Label>Bills</Label>
                        <Input
                          type="text"
                          placeholder="Enter Bills Here"
                          name="bills"
                          // onChange={handleChange}
                          // value={values.bills}
                          // invalid={errors.bills ? true : false}
                        />
                      </FormGroup>
                      <FormFeedback>{errors.bills}</FormFeedback>
                    </Col>
                    <Col md="1">
                      <FormGroup>
                        <Label>Values</Label>
                        <Input
                          type="text"
                          placeholder="Enter Values Here"
                          name="values"
                          // onChange={handleChange}
                          // value={values.values}
                          // invalid={errors.values ? true : false}
                        />
                      </FormGroup>
                      <FormFeedback>{errors.bills}</FormFeedback>
                    </Col>
                  </>
                ) : null}

                <Col md="3">
                  <Label>Trade</Label>
                  <FormGroup>
                    <Row>
                      <FormBootstrap.Check
                        inline
                        label="Retailer"
                        name="trade"
                        type={`radio`}
                        id={`inline-${`radio`}-1`}
                      />
                      <FormBootstrap.Check
                        inline
                        label="Manufacturer"
                        name="trade"
                        type={`radio`}
                        id={`inline-${`radio`}-2`}
                      />
                      <FormBootstrap.Check
                        inline
                        label="Distributor"
                        name="trade"
                        type={`radio`}
                        id={`inline-${`radio`}-3`}
                      />
                    </Row>
                  </FormGroup>
                  <FormFeedback>{errors.bills}</FormFeedback>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label>Buiseness Nature</Label>
                    <Input
                      type="text"
                      placeholder="Buiseness Nature"
                      name="buisenessNature"
                      // onChange={handleChange}
                      // value={values.buisenessNature}
                      // invalid={errors.buisenessNature ? true : false}
                    />
                  </FormGroup>
                  <FormFeedback>{errors.bills}</FormFeedback>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <Col md="2">
                    <FormGroup>
                      {/* <Label>GST</Label> */}
                      <FormBootstrap.Check // prettier-ignore
                        type="switch"
                        id="custom-switch2"
                        label="GST"
                        onChange={(v) => {
                          console.log(v);
                          setBoolean({ ...boolean, gst: !boolean.gst });
                        }}
                      />
                      {/* <FormFeedback>{errors.regDate}</FormFeedback> */}
                    </FormGroup>
                  </Col>
                  {boolean.gst ? (
                    <>
                      <Col md="1">
                        <FormGroup>
                          <Label>Type</Label>
                          <Input
                            type="text"
                            placeholder="Enter Days Here"
                            name="days"
                            // onChange={handleChange}
                            // value={values.days}
                            // invalid={errors.days ? true : false}
                          />
                        </FormGroup>
                        <FormFeedback>{errors.Days}</FormFeedback>
                      </Col>
                      {/* <Col md="1">
                      <FormGroup>
                        <Label>Bills</Label>
                        <Input
                          type="text"
                          placeholder="Enter Bills Here"
                          name="bills"
                          // onChange={handleChange}
                          // value={values.bills}
                          // invalid={errors.bills ? true : false}
                        />
                      </FormGroup>
                      <FormFeedback>{errors.bills}</FormFeedback>
                    </Col>
                    <Col md="1">
                      <FormGroup>
                        <Label>Values</Label>
                        <Input
                          type="text"
                          placeholder="Enter Values Here"
                          name="values"
                          // onChange={handleChange}
                          // value={values.values}
                          // invalid={errors.values ? true : false}
                        />
                      </FormGroup>
                      <FormFeedback>{errors.bills}</FormFeedback>
                    </Col> */}
                    </>
                  ) : null}
                </Col>

<Col md="6">
                <Col md="3">
                  <Label>Trade</Label>
                  <FormGroup>
                    <Row>
                      <FormBootstrap.Check
                        inline
                        label="Retailer"
                        name="trade"
                        type={`radio`}
                        id={`inline-${`radio`}-1`}
                      />
                      <FormBootstrap.Check
                        inline
                        label="Manufacturer"
                        name="trade"
                        type={`radio`}
                        id={`inline-${`radio`}-2`}
                      />
                      <FormBootstrap.Check
                        inline
                        label="Distributor"
                        name="trade"
                        type={`radio`}
                        id={`inline-${`radio`}-3`}
                      />
                    </Row>
                  </FormGroup>
                  <FormFeedback>{errors.bills}</FormFeedback>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label>Buiseness Nature</Label>
                    <Input
                      type="text"
                      placeholder="Buiseness Nature"
                      name="buisenessNature"
                      // onChange={handleChange}
                      // value={values.buisenessNature}
                      // invalid={errors.buisenessNature ? true : false}
                    />
                  </FormGroup>
                  <FormFeedback>{errors.bills}</FormFeedback>
                </Col>
                </Col>
              </Row>

              {boolean.footer_btn ? (
                <ModalFooter className="p-2">
                  {false ? (
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
                      updating...
                    </Button>
                  ) : (
                    <Button type="submit" className="mainbtn1 text-white">
                      Submit
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
              ) : null}
            </CardBody>
          </Card>
        </Form>
      )}
    />
  );
};

export default LedgerCreate;
