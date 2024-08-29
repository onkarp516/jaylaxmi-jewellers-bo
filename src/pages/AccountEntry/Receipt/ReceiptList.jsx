import React, { Component, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
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
    deleteReceipt,
    getReceiptListByCompany,
} from "@/services/api_function";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const ClearIndicatorStyles = (base, state) => ({
    ...base,
    cursor: "pointer",
    color: state.isFocused ? "blue" : "black",
});

class ReceiptList extends Component {
    constructor(props) {
        super(props);
        //get_sundry_debtors_indirect_incomes
        this.state = {
            receiptList: [],
            receiptData: [],
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
        this.getReceiptList();
    }

    setInitValue = () => {
        let initValue = {
            associates_id: "",
            underId: "",
            associates_group_name: "",
        };

        this.setState({ initValue: initValue });
    };

    getReceiptList = () => {
        getReceiptListByCompany()
            .then((response) => {
                console.log("getReceiptList:", response);
                let res = response.data ? response.data : [];
                if (res.responseStatus == 200) {
                    this.setState({ receiptList: res.data, receiptData: res.data });
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    handleSearch = (vi) => {
        this.setState({ search: vi }, () => {
            let { receiptData } = this.state;
            console.log("handleSearch:", { receiptData });
            let receiptData_F = receiptData.filter(
                (v) =>
                    (v.narration != null &&
                        v.ledger_name != null &&
                        v.receipt_code != null &&
                        v.narration.toLowerCase().includes(vi.toLowerCase())) ||
                    v.ledger_name.toLowerCase().includes(vi.toLowerCase()) ||
                    v.receipt_code.toLowerCase().includes(vi.toLowerCase())
            );

            if (vi.length == 0) {
                this.setState({
                    receiptList: receiptData,
                });
            } else {
                this.setState({
                    receiptList: receiptData_F.length > 0 ? receiptData_F : [],
                });
            }
        });
    };

    onEditModalShow = (status, data, rowIndex) => {
        if (status) {
            this.setState({ currentIndex: rowIndex });
            this.props.history.push("/master/receipt-edit/" + data.id);
        } else {
            this.setState({ currentIndex: 0 });
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
            deleteReceipt(reqData)
                .then((response) => {
                    if (response.data.responseStatus == 200) {
                        toast.success("✔ " + response.data.message);
                        this.componentDidMount();
                    } else {
                        toast.error("✘ " + response.data.message);
                    }
                })
                .catch((error) => {
                    toast.error("✘ " + error);
                });
        });
    };

    render() {
        const { isLoading, initValue, receiptList } = this.state;

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
                            <CardTitle className="text-dark">Receipt</CardTitle>
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
                                            this.props.history.push(`/receipt-create`);
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
                                                <th>Receipt No</th>
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
                                            {receiptList.length > 0 ? (
                                                receiptList.map((v, i) => {
                                                    return (
                                                        <tr>
                                                            {/* <td style={{ width: "20%" }}>{i + 1}</td> */}
                                                            <td style={{ width: "20%" }}>{v.receipt_code}</td>
                                                            <td style={{ width: "10%" }}>
                                                                {v.transaction_dt}
                                                            </td>
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
                                                                    "receipt",
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
                                                                    "receipt",
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

export default WithUserPermission(ReceiptList);
