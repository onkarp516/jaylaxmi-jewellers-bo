import React, { Component, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import moment from "moment";
import LayoutCustom from "@/pages/layout/LayoutCustom";
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
    checkInvoiceDateIsBetweenFYFun,
    getSelectValue,
} from "@/helpers";
import Select from "react-select";
import {
    getCashACBankAccountDetails,
    get_last_record_contra,
    get_contra_by_id,
    update_contra,
} from "@/services/api_function";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const ClearIndicatorStyles = (base, state) => ({
    ...base,
    cursor: "pointer",
    color: state.isFocused ? "blue" : "black",
});

const drcrtype = [
    { value: "dr", label: "dr" },
    { value: "cr", label: "cr" },
];

const typeOpts = [
    { label: "Dr", value: "dr", type: "dr" },
    { label: "Cr", value: "cr", type: "cr" },
];

class ContraEdit extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.invoiceDateRef = React.createRef();
        this.state = {
            contraEditData: "",
            isEditDataSet: false,
            isLoading: false,
            show: false,
            invoice_data: "",
            amtledgershow: false,
            onaccountmodal: false,
            billadjusmentmodalshow: false,
            billadjusmentDebitmodalshow: false,
            bankledgershow: false,
            isDisabled: false,
            bankchequeshow: false,
            isAllCheckeddebit: false,
            sundryindirect: [],
            cashAcbankLst: [],
            purchaseAccLst: [],
            supplierNameLst: [],
            supplierCodeLst: [],
            selectedBillsdebit: [],
            selectedBillsCredit: [],
            billLst: [],
            billLstSc: [],
            selectedBills: [],
            accountLst: [],
            invoiceedit: false,
            adjusmentbillmodal: false,
            createproductmodal: false,
            pendingordermodal: false,
            pendingorderprdctsmodalshow: false,
            productLst: [],
            unitLst: [],
            rows: [],
            serialnopopupwindow: false,

            serialnoshowindex: -1,
            serialnoarray: [],
            lstDisLedger: [],
            additionalCharges: [],
            lstAdditionalLedger: [],
            additionalChargesTotal: 0,
            taxcal: { igst: [], cgst: [], sgst: [] },
            isAllChecked: false,
            selectedProductDetails: [],
            selectedPendingOrder: [],
            purchasePendingOrderLst: [],
            selectedPendingChallan: [],
            initVal: {
                voucher_contra_sr_no: 1,
                voucher_contra_no: 1,
                transaction_dt: "",
            },

            voucher_edit: false,

            rows: [],
            sundryCreditorLst: [],
            cashAccLedgerLst: [],
            lstSundryCreditorsPayment: [],

            index: 0,
            crshow: false,
            onaccountcashaccmodal: false,
            bankaccmodal: false,
        };
    }
    handleClose = () => {
        this.setState({ show: false });
    };

    getTotalDebitAmt = () => {
        let { rows } = this.state;
        let debitamt = 0;
        rows.map((v) => {
            if (v.type.value == "dr") {
                debitamt = parseFloat(debitamt) + parseFloat(v["debit"]);
            }
        });

        return isNaN(debitamt) ? 0 : debitamt;
    };
    getTotalCreditAmt = () => {
        let { rows } = this.state;
        let creditamt = 0;
        rows.map((v) => {
            if (v.type.value == "cr") {
                creditamt = parseFloat(creditamt) + parseFloat(v["credit"]);
            }
        });

        return isNaN(creditamt) ? 0 : creditamt;
    };

    initRows = (len = 10) => {
        let { rows } = this.state;
        for (let index = 0; index < len; index++) {
            let innerrow = {
                type: "",
                paid_amt: "",
            };
            if (index == 0) {
                // innerrow["type"] = "cr";
                // innerrow["type"] = getSelectValue(typeOpts, "dr");
            }
            rows.push(innerrow);
        }
        this.setState({ rows: rows });
    };

    setElementValue = (element, index) => {
        let elementCheck = this.state.rows.find((v, i) => {
            return i == index;
        });
        return elementCheck ? elementCheck[element] : "";
    };
    getElementObject = (index) => {
        let elementCheck = this.state.rows.find((v, i) => {
            return i == index;
        });
        return elementCheck ? elementCheck : "";
    };

    handleClear = (index) => {
        const { rows } = this.state;
        let frows = [...rows];
        let data = {
            type: "",
            paid_amt: "",
            perticulars: "",
            credit: "",
            debit: "",
            bank_payment_type: "",
            bank_payment_no: "",
        };
        frows[index] = data;
        this.setState({ rows: frows }, () => { });
    };

    get_last_record_contraFun = () => {
        get_last_record_contra()
            .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                    let lastRow = res.response;
                    let initVal = {
                        voucher_contra_sr_no: res.count,
                        voucher_contra_no: res.contraNo,
                        transaction_dt: moment().format("YYYY-MM-DD"),
                    };
                    this.setState({ initVal: initVal });
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    lstgetcashAcbankaccount = () => {
        getCashACBankAccountDetails()
            .then((response) => {
                let res = response.data ? response.data : [];
                let resLst = [];

                if (res.responseStatus == 200) {
                    if (res.list.length > 0) {
                        res.list.map((v) => {
                            let innerrow = {
                                id: v.id,
                                type: v.type,
                                value: v.id,
                                label: v.name,
                                billids: [],
                            };
                            resLst.push(innerrow);
                        });
                    }
                    this.setState({ cashAcbankLst: resLst });
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    componentDidMount() {
        this.get_last_record_contraFun();
        this.lstgetcashAcbankaccount();
        this.setState({ contraEditData: this.props.match.params.id });
        this.initRows();
        // const { prop_data } = this.props.block;
        // console.log("prop_data==---->", prop_data);
        // this.setState({ contraEditData: prop_data });
    }

    componentDidUpdate() {
        const { isEditDataSet, contraEditData, cashAcbankLst } = this.state;
        console.log("contraEditData ", contraEditData);

        if (
            isEditDataSet == false &&
            contraEditData != "" &&
            cashAcbankLst.length > 0
            //   contraEditData.id != ""
        ) {
            this.setContraEditData();
        }
    }

    handleChangeArrayElement = (element, value, index) => {
        let debitBal = 0;
        let creditBal = 0;

        let { rows } = this.state;
        let debitamt = 0;
        let creditamt = 0;
        let frows = rows.map((v, i) => {
            if (v["type"] == "dr") {
                debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
                // bal = parseFloat(bal);
                if (v["debit"] != "" && !isNaN(v["debit"])) {
                    debitBal = debitBal + parseFloat(v["debit"]);
                }
            } else if (v["type"] == "cr") {
                if (v["credit"] != "" && !isNaN(v["credit"])) {
                    creditBal = creditBal + parseFloat(v["credit"]);
                }
            }
            if (i == index) {
                if (element == "debit") {
                    v["paid_amt"] = value;
                } else if (element == "credit") {
                    v["paid_amt"] = value;
                }

                v[element] = value;
                return v;
            } else {
                return v;
            }
        });

        let lastCrBal = debitBal - creditBal;

        if (element == "perticulars") {
            let obj = frows.find((v, i) => i == index);
            frows = rows.map((vi, ii) => {
                if (ii == index && vi.type == "cr") {
                    vi["credit"] = lastCrBal;
                } else if (ii == index && vi.type == "dr") {
                    vi["debit"] = lastCrBal;
                }
                return vi;
            });

            if (obj.perticulars.type == "others") {
            } else if (obj.perticulars.type == "bank_account") {
                this.setState({ bankaccmodal: true });
            }
        }

        this.setState({ rows: frows, index: index });
    };

    setContraEditData = () => {
        // const { id } = this.state.contraEditData;
        let formData = new FormData();
        formData.append("contra_id", this.state.contraEditData);
        get_contra_by_id(formData)
            .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                    let { contra_details } = res;
                    const {
                        purchaseAccLst,
                        supplierNameLst,
                        supplierCodeLst,
                        lstAdditionalLedger,
                        lstDisLedger,
                        receiptEditData,
                        sundryCreditorLst,
                        cashAcbankLst,
                    } = this.state;

                    console.log("cashAcbankLst", cashAcbankLst);
                    this.myRef.current.setFieldValue(
                        "voucher_contra_sr_no",
                        res.contra_sr_no
                    );

                    this.myRef.current.setFieldValue("voucher_contra_no", res.contra_no);
                    this.myRef.current.setFieldValue(
                        "transaction_dt",
                        moment(res.tranx_date).format("DD-MM-YYYY")
                    );
                    this.myRef.current.setFieldValue("total_amt", res.total_amt);

                    this.myRef.current.setFieldValue("narration", res.narrations);

                    // let initInvoiceData = {
                    //   type: perticulars.type,
                    //   ledger_type: perticulars.ledger_type,
                    //   ledger_name: perticulars.ledger_name,
                    //   paid_amt: perticulars.paid_amt,
                    //   bank_payment_no: perticulars.bank_payment_no,
                    //   bank_payment_type: perticulars.bank_payment_type,
                    // };

                    console.log("contra_details", contra_details);
                    let initRowData = [];

                    if (contra_details.length > 0) {
                        contra_details.map((v) => {
                            console.log("==='''vvvv", v);
                            let per = "";
                            if (v.type == "cr") {
                                per = getSelectValue(cashAcbankLst, v.ledger_id);
                            }
                            if (v.type == "dr") {
                                per = getSelectValue(cashAcbankLst, v.ledger_id);
                            }
                            console.log("per", per);

                            let inner_data = {
                                details_id: v.details_id != 0 ? v.details_id : 0,
                                type: v.type != null ? getSelectValue(typeOpts, v.type) : "",

                                perticulars: per,
                                paid_amt: v.type == "cr" ? v.cr : v.dr,
                                bank_payment_no:
                                    v.paymentTranxNo != null ? v.paymentTranxNo : "",
                                bank_payment_type:
                                    v.bank_payment_type != null ? v.bank_payment_type : "",
                                debit: v.type == "dr" ? v.paid_amt : "",
                                credit: v.type == "cr" ? v.paid_amt : "",
                                narration: "",
                            };
                            // let innerrow = {
                            //   type: "",
                            //   perticulars: "",
                            //   paid_amt: "",
                            //   bank_payment_type: "",
                            //   bank_payment_no: "",
                            //   debit: "",
                            //   credit: "",
                            //   narration: "",
                            // };
                            initRowData.push(inner_data);
                        });
                    }
                    console.log("Edit Row ==>", initRowData);

                    this.setState(
                        {
                            rows: initRowData,
                            isEditDataSet: true,
                        },
                        () => {
                            const { rows } = this.state;
                            console.log("rows in edit data", rows);
                            if (this.state.rows.length != 10) {
                                this.initRows(10 - this.state.rows.length);
                            }
                        }
                    );
                }
            })
            .catch((error) => { });
    };

    render() {
        const { isLoading, initVal, rows, cashAcbankLst, isEditDataSet } =
            this.state;
        console.log("inside render:", initVal, rows);
        return (
            <LayoutCustom>
                <div className="emp">
                    <Card>
                        <CardBody className="border-bottom p-2">
                            <div>
                                <Formik
                                    validateOnBlur={false}
                                    enableReinitialize={true}
                                    validateOnChange={false}
                                    initialValues={initVal}
                                    innerRef={this.myRef}
                                    validationSchema={Yup.object().shape({
                                        // voucher_contra_sr_no: Yup.string()
                                        //   .trim()
                                        //   .required("Receipt  no is required"),
                                        //   transaction_dt: Yup.string().required(
                                        //   "Transaction date is required"
                                        // ),
                                        // voucher_contra_no: Yup.string().required().value,
                                    })}
                                    onSubmit={(values, { resetForm, setSubmitting }) => {
                                        console.log("Contra edit onSubmit", rows);
                                        if (
                                            this.getTotalDebitAmt() == this.getTotalCreditAmt() &&
                                            this.getTotalCreditAmt() > 0 &&
                                            this.getTotalDebitAmt() > 0
                                        ) {
                                            let requestData = new FormData();
                                            this.setState({
                                                invoice_data: values,
                                            });

                                            let frow = rows.filter((v) => v.type != "");

                                            frow = frow.map((v, i) => {
                                                let perObj = {
                                                    id: v.perticulars.id,
                                                    type: v.perticulars.type,
                                                    label: v.perticulars.label,
                                                };
                                                if (v["debit"] != "" && v["type"]["value"] == "dr") {
                                                    v["paid_amt"] = v.debit;
                                                }
                                                if (v["credit"] != "" && v["type"]["value"] == "cr") {
                                                    v["paid_amt"] = v.credit;
                                                }

                                                if (
                                                    v.perticulars &&
                                                    v.perticulars.type == "bank_account"
                                                ) {
                                                    return {
                                                        type: v.type,
                                                        paid_amt: v.paid_amt,
                                                        details_id: v.details_id != "" ? v.details_id : 0,
                                                        bank_payment_type: v.bank_payment_type.value,
                                                        bank_payment_no: v.bank_payment_no,
                                                        perticulars: perObj,
                                                    };
                                                } else {
                                                    return {
                                                        type: v.type,
                                                        details_id: v.details_id != "" ? v.details_id : 0,
                                                        // paid_amt: v.paid_amt,
                                                        paid_amt: v.paid_amt,
                                                        perticulars: perObj,
                                                    };
                                                }
                                            });

                                            let formData = new FormData();

                                            if (values.narration != null && values.narration != "")
                                                formData.append("narration", values.narration);
                                            formData.append("rows", JSON.stringify(frow));
                                            formData.append(
                                                "transaction_dt",
                                                moment(values.transaction_dt).format("YYYY-MM-DD")
                                            );
                                            formData.append(
                                                "voucher_contra_sr_no",
                                                values.voucher_contra_sr_no
                                            );
                                            let total_amt = this.getTotalDebitAmt();
                                            formData.append("total_amt", total_amt);
                                            formData.append(
                                                "voucher_contra_no",
                                                values.voucher_contra_no
                                            );
                                            formData.append("contra_id", values.voucher_contra_sr_no);
                                            update_contra(formData)
                                                .then((response) => {
                                                    let res = response.data;

                                                    if (res.responseStatus == 200) {
                                                        toast.success("✔" + res.message);
                                                        this.props.history.push("/contra");
                                                        resetForm();
                                                        if ("ledgerId" in this.state.source != "") {
                                                            eventBus.dispatch("page_change", {
                                                                from: "tranx_contra_edit",
                                                                to: "ledgerdetails",
                                                                prop_data: this.state.source["ledgerId"],

                                                                isNewTab: false,
                                                            });
                                                            // this.setState({ source: "" });
                                                        } else {
                                                            // setSubmitting(false);
                                                            toast.error("✘ " + res.message);
                                                        }

                                                        // eventBus.dispatch("page_change", {
                                                        //   from: "tranx_contra",
                                                        //   to: "tranx_contra_List",
                                                        //   isNewTab: false,
                                                        // });
                                                    } else {
                                                        setSubmitting(false);
                                                        if (response.responseStatus == 401) {
                                                            toast.error("✘" + response.message);
                                                        } else {
                                                            toast.error(
                                                                "Server Error! Please Check Your Connectivity"
                                                            );
                                                            console.log(
                                                                "Server Error! Please Check Your Connectivity"
                                                            );
                                                        }
                                                    }
                                                })
                                                .catch((error) => {
                                                    console.log("error", error);
                                                });
                                        } else {
                                            toast.error(" Please Select check credit & debit Amount");
                                            console.log(
                                                "please select check credit and debit amount"
                                            );
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
                                            <div
                                                className="institute-head p-2"
                                                style={{
                                                    background: "#cee7f1",
                                                    padding: "10px",
                                                    paddingBottom: "0px",
                                                    marginBottom: "5px",
                                                }}
                                            >
                                                <CardTitle>Edit Contra</CardTitle>
                                                <Row>
                                                    <Col md="2">
                                                        <FormGroup>
                                                            <Label for="exampleDatetime">
                                                                Voucher Sr. No. :
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                name="voucher_contra_sr_no"
                                                                id="voucher_contra_sr_no"
                                                                onChange={handleChange}
                                                                value={values.voucher_contra_sr_no}
                                                                // isValid={
                                                                //   touched.voucher_contra_sr_no && !errors.voucher_contra_sr_no
                                                                // }
                                                                // isInvalid={!!errors.voucher_contra_sr_no}
                                                                readOnly={true}
                                                            />
                                                            <span className="text-danger">
                                                                {errors.voucher_contra_sr_no}
                                                            </span>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="2">
                                                        <FormGroup>
                                                            <Label for="exampleDatetime">Voucher No.:</Label>
                                                            <Input
                                                                type="text"
                                                                readOnly={true}
                                                                placeholder="1234"
                                                                value={values.voucher_contra_no}
                                                                className="tnx-pur-inv-text-box mb-0"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="2">
                                                        <FormGroup>
                                                            <Label for="exampleDatetime">
                                                                Transaction Date :
                                                            </Label>
                                                            <MyDatePicker
                                                                innerRef={(input) => {
                                                                    this.invoiceDateRef.current = input;
                                                                }}
                                                                autoComplete="off"
                                                                readOnly={true}
                                                                className="datepic form-control"
                                                                name="transaction_dt"
                                                                placeholderText="dd/MM/yyyy"
                                                                id="transaction_dt"
                                                                dateFormat="dd/MM/yyyy"
                                                                // onChange={handleChange}
                                                                value={values.transaction_dt}
                                                                // selected={values.transaction_dt}
                                                                // maxDate={new Date()}
                                                                onChange={(e) => {
                                                                    console.log("e.target.value ", e);
                                                                    if (e != null && e != "") {
                                                                        console.log(
                                                                            "warn:: isValid",
                                                                            moment(e, "DD-MM-YYYY").isValid()
                                                                        );
                                                                        if (
                                                                            moment(e, "DD-MM-YYYY").isValid() == true
                                                                        ) {
                                                                            setFieldValue("transaction_dt", e);
                                                                            checkInvoiceDateIsBetweenFYFun(
                                                                                e,
                                                                                setFieldValue
                                                                            );
                                                                        }
                                                                    } else {
                                                                        this.invoiceDateRef.current.focus();
                                                                        setFieldValue("transaction_dt", "");
                                                                    }
                                                                }}
                                                            />
                                                            <span className="text-danger">
                                                                {errors.transaction_dt}
                                                            </span>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div
                                                className="tbl-body-style-new"
                                            // style={{ maxHeight: "67vh", height: "67vh" }}
                                            >
                                                <Table size="sm" className="tbl-font mt-2 mb-2">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: "10%", textAlign: "center" }}>
                                                                Type
                                                            </th>
                                                            <th style={{ width: "70%", textAlign: "center" }}>
                                                                Particulars
                                                            </th>
                                                            <th style={{ width: "10%", textAlign: "center" }}>
                                                                Debit &nbsp;
                                                            </th>
                                                            <th
                                                                style={{ width: "10%", textAlign: "center" }}
                                                                className="pl-4"
                                                            >
                                                                Credit &nbsp;
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody style={{ borderTop: "2px solid transparent" }}>
                                                        {rows.length > 0 &&
                                                            rows.map((vi, ii) => {
                                                                return (
                                                                    <tr className="entryrow">
                                                                        <td
                                                                            style={{
                                                                                width: "10%",
                                                                            }}
                                                                        >
                                                                            <FormGroup>
                                                                                <Select
                                                                                    //isClearable={true}
                                                                                    required
                                                                                    // onChange={(v) => {
                                                                                    //   this.handleChangeArrayElement(
                                                                                    //     "type",
                                                                                    //     v,
                                                                                    //     ii
                                                                                    //   );
                                                                                    // }}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value != "") {
                                                                                            this.handleChangeArrayElement(
                                                                                                "type",
                                                                                                e.target.value,
                                                                                                ii
                                                                                            );
                                                                                        } else {
                                                                                            this.handleClear(ii);
                                                                                        }
                                                                                    }}
                                                                                    value={this.setElementValue(
                                                                                        "type",
                                                                                        ii
                                                                                    )}
                                                                                    placeholder="select type"
                                                                                    options={typeOpts}
                                                                                ></Select>
                                                                            </FormGroup>
                                                                        </td>

                                                                        <td
                                                                            style={{
                                                                                width: "70%",
                                                                                background: "#f5f5f5",
                                                                            }}
                                                                        >
                                                                            <FormGroup>
                                                                                <Select
                                                                                    className="selectTo"
                                                                                    components={{
                                                                                        DropdownIndicator: () => null,
                                                                                        IndicatorSeparator: () => null,
                                                                                    }}
                                                                                    placeholder=""
                                                                                    //isClearable
                                                                                    options={cashAcbankLst}
                                                                                    theme={(theme) => ({
                                                                                        ...theme,
                                                                                        height: "26px",
                                                                                        borderRadius: "5px",
                                                                                    })}
                                                                                    // onChange={(v, triggeredAction) => {
                                                                                    //   console.log({ triggeredAction });
                                                                                    //   console.log(
                                                                                    //     "In a Particular On Change.!",
                                                                                    //     v
                                                                                    //   );
                                                                                    //   if (v == null) {
                                                                                    //     // Clear happened
                                                                                    //     console.log("clear index=>", ii);
                                                                                    //     this.handleClearPayment(ii);
                                                                                    //   } else {
                                                                                    //     this.handleChangeArrayElement(
                                                                                    //       "perticulars",
                                                                                    //       v,
                                                                                    //       ii
                                                                                    //     );
                                                                                    //   }
                                                                                    // }}
                                                                                    // value={this.setElementValue(
                                                                                    //   "perticulars",
                                                                                    //   ii
                                                                                    // )}
                                                                                    onChange={(v) => {
                                                                                        if (v != null) {
                                                                                            this.handleChangeArrayElement(
                                                                                                "perticulars",
                                                                                                v,
                                                                                                ii
                                                                                            );
                                                                                        } else {
                                                                                            this.handleClear(ii);
                                                                                        }
                                                                                    }}
                                                                                    value={this.setElementValue(
                                                                                        "perticulars",
                                                                                        ii
                                                                                    )}
                                                                                />
                                                                            </FormGroup>
                                                                        </td>

                                                                        <td
                                                                            style={{
                                                                                width: "10%",
                                                                            }}
                                                                        >
                                                                            <FormGroup>
                                                                                <Input
                                                                                    type="text"
                                                                                    onChange={(e) => {
                                                                                        let v = e.target.value;
                                                                                        this.handleChangeArrayElement(
                                                                                            "debit",
                                                                                            v,
                                                                                            ii
                                                                                        );
                                                                                    }}
                                                                                    style={{ textAlign: "center" }}
                                                                                    value={this.setElementValue(
                                                                                        "debit",
                                                                                        ii
                                                                                    )}
                                                                                    readOnly={
                                                                                        this.setElementValue("type", ii) ==
                                                                                            "dr"
                                                                                            ? false
                                                                                            : true
                                                                                    }
                                                                                />
                                                                            </FormGroup>
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                width: "10%",
                                                                            }}
                                                                        >
                                                                            <FormGroup>
                                                                                <Input
                                                                                    type="text"
                                                                                    onChange={(e) => {
                                                                                        let v = e.target.value;
                                                                                        this.handleChangeArrayElement(
                                                                                            "credit",
                                                                                            v,
                                                                                            ii
                                                                                        );
                                                                                    }}
                                                                                    style={{ textAlign: "center" }}
                                                                                    value={this.setElementValue(
                                                                                        "credit",
                                                                                        ii
                                                                                    )}
                                                                                    readOnly={
                                                                                        this.setElementValue("type", ii) ==
                                                                                            "cr"
                                                                                            ? false
                                                                                            : true
                                                                                    }
                                                                                />
                                                                            </FormGroup>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                    </tbody>
                                                    <thead>
                                                        <tr style={{ background: "#DDE2ED" }}>
                                                            <td
                                                                className="pr-2 qtotalqty"
                                                                style={{ width: "10%" }}
                                                            >
                                                                {" "}
                                                                Total
                                                            </td>
                                                            <td style={{ width: "70%" }}></td>
                                                            <td
                                                                style={{
                                                                    width: "10 %",
                                                                }}
                                                            >
                                                                <FormGroup>
                                                                    <Input
                                                                        style={{
                                                                            textAlign: "center",
                                                                            // width: "8%",
                                                                            background: "transparent",
                                                                            border: "none",
                                                                        }}
                                                                        type="text"
                                                                        placeholder=""
                                                                        value={this.getTotalDebitAmt()}
                                                                        readonly
                                                                    />
                                                                </FormGroup>
                                                            </td>
                                                            <td style={{ width: "10%" }}>
                                                                {" "}
                                                                <FormGroup>
                                                                    <Input
                                                                        style={{
                                                                            textAlign: "center",
                                                                            //width: '8%',
                                                                            background: "transparent",
                                                                            border: "none",
                                                                        }}
                                                                        type="text"
                                                                        placeholder=""
                                                                        value={this.getTotalCreditAmt()}
                                                                        readonly
                                                                    />
                                                                </FormGroup>
                                                            </td>
                                                            {/* <td></td> */}
                                                        </tr>
                                                    </thead>
                                                </Table>
                                            </div>
                                            <Row className="mb-2">
                                                <Col sm={9}>
                                                    <Row className="mt-2">
                                                        <Col sm={1}>
                                                            <Label className="text-label">Narration:</Label>
                                                        </Col>
                                                        <Col sm={10}>
                                                            <FormGroup>
                                                                <Input
                                                                    type="textarea"
                                                                    placeholder="Enter Narration"
                                                                    style={{ height: "72px", resize: "none" }}
                                                                    className="text-box"
                                                                    id="narration"
                                                                    onChange={handleChange}
                                                                    // rows={5}
                                                                    // cols={25}
                                                                    name="narration"
                                                                    value={values.narration}
                                                                />
                                                            </FormGroup>
                                                            {/* <Form.Control
                              as="textarea"
                              resize="none"
                              placeholder="Enter Narration"
                              style={{ height: "72px" }}
                              className="text-box"
                              id="narration"
                              onChange={handleChange}
                              name="narration"
                              value={values.narration}
                            /> */}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className="py-1">
                                                <Col className="text-end">
                                                    <Button
                                                        type="submit"
                                                        className="successbtn-style me-2"
                                                    >
                                                        Update
                                                    </Button>

                                                    <Button
                                                        className="cancel-btn"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.props.history.push("/contra");
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    )}
                                />
                            </div>

                            {/* {empSalaryData && empSalaryData.length > 0 ? (
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
                          <th className="th-style" style={{ zIndex: 99 }}></th> 
                          <th>Employee Name</th>
                          <th>Hour Wise Salary</th>
                          <th>Piece Wise Salary</th>
                          <th>Day Wise Salary</th>
                          <th>Point Wise Salary</th>
                        </tr>
                      </thead>
                      <tbody
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {empSalaryData.map((v, i) => {
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
                        })}
                        <tr>
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
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            ) : (
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
            )} */}
                        </CardBody>
                    </Card>
                </div>
            </LayoutCustom>
        );
    }
}

export default WithUserPermission(ContraEdit);
