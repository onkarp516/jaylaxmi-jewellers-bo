import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable, { defaultThemes } from "react-data-table-component";
import styled from "styled-components";
import { Button } from "reactstrap";
import { getHeader } from "@/helpers";

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
        columns={columns}
        columns={columns}
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const conditionalRowStyles = [
  {
    when: (row) => row.roleName != "",
    style: {
      width: "40%",
      // backgroundColor: "rgba(63, 195, 128, 0.9)",
      // color: "white",
      // "&:hover": {
      //   cursor: "pointer",
      // },
    },
  },
];

const customStyles = {
  header: {
    style: {
      minHeight: "56px",
    },
  },
  headRow: {
    style: {
      width: "40%",
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: defaultThemes.default.divider.default,
    },
  },
  headCells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
};

const Export = ({ onExport }) => (
  <Button onClick={(e) => onExport(e.target.value)}>Export</Button>
);

const FilterComponent = ({
  placeholder = "Filter Data",
  filterText,
  onFilter,
  onClear,
}) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder={placeholder}
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
      autoComplete="off"
    />
    <ClearButton
      type="button"
      onClick={onClear}
      style={{ background: "#07628e" }}
    >
      x
    </ClearButton>
  </>
);
const GetAdvanceDatatable = (props) => {
  // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
  function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }
  // console.log("props =>", props);
  const [filterText, setFilterText] = React.useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
    false
  );

  const loginData = localStorage.getItem("loginUser");

  const fetchUsers = (page) => {
    setLoading(true);
    axios({
      method: "GET",
      headers: getHeader(),
      url: `${props.actionUrl}?limit=${perPage}&start=${page}`,
    })
      .then((response) => {
        setData(response.data.data);
        setPerPage(perPage);
        setTotalRows(response.data.total);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // Export Button
  const actionsMemo = React.useMemo(
    () => <Export onExport={() => downloadCSV(data)} />,
    []
  );

  let filteredItems = data;
  if (filterText != "" && filterText != null) {
    let f_data = data.map((item) => {
      let res = Object.keys(item).some(function (k) {
        if (item[k] != null && filterText != null) {
          return item[k]
            .toString()
            .toLowerCase()
            .includes(filterText.toString().toLowerCase());
        }
      });
      if (res == true) {
        return item;
      }
    });
    filteredItems = f_data.filter((item) => item != undefined);
  }
  // console.log("FilteredItems", filteredItems);
  // console.log("data", data);
  // useEffect(() => {
  //   setSearchColumns(props.filterOption);
  // }, []);

  // console.log("data", data);
  // console.log("searchColumns", searchColumns);
  // function filteredItems(data1) {
  //   console.log({ data1, filterText });
  //   return data1.filter((row) => {
  //     console.log("row", row);
  //     searchColumns.some((column) =>
  //       row[column].toString().toLowerCase().includes(filterText.toLowerCase())
  //     );
  //   });
  // }
  // console.log("FilteredItems", filteredItems);
  const customStyles = {
    header: {
      style: {
        minHeight: "36px",
      },
      className: "fileterdiv",
    },
    headRow: {
      style: {
        //borderTopStyle: "solid",
        //borderTopWidth: "1px",
        background: "#f3f3f3",
        fontSize: "15px",
        margin: "9px",
        minHeight: "36px",
      },
    },
    headCells: {
      style: {
        "&:not(:last-of-type)": {
          //borderRightStyle: "solid",
          //borderRightWidth: "1px",
          fontSize: "15px",
          //height: "36px",
        },
      },
    },
    // cells: {
    //   style: {
    //     '&:not(:last-of-type)': {
    //       borderRightStyle: 'solid',
    //       borderRightWidth: '1px',
    //       borderRightColor: defaultThemes.default.divider.default,
    //       columns={columns}
    //       columns={columns}
    //       columns={columns}
    //     },
    //   },
    // },
  };
  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      } else {
        console.log("filterText", filterText);
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => {
          setFilterText(e.target.value);
          setSearchText(e.target.value);
        }}
        onClear={handleClear}
        filterText={filterText}
        placeholder={props.placeholder}
        onChange={(e) => {
          console.log(e);
        }}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const handlePageChange = (perPage) => {
    fetchUsers(perPage);
  };
  useEffect(() => {
    fetchUsers(currentPage);
  }, [perPage, currentPage]);
  const handlePerRowsChange = (newPerPage, page) => {
    console.log({ newPerPage, page });
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleSort = (column, sortDirection, event) => {
    console.log({ column, sortDirection, event });
    // event.preventDefault();
    setOrderBy({ column, sortDirection });
    // simulate server sort
    // setLoading(true);

    // // instead of setTimeout this is where you would handle your API call.
    // setTimeout(() => {
    //   setData(orderBy(items, column.selector, sortDirection));
    //   setLoading(false);
    // }, 100);
  };
  useEffect(() => {
    if (props.refresh == true) {
      fetchUsers(1);
      props.setRefresh(false);
    }
  }, [props]);
  useEffect(() => {
    fetchUsers(1);
  }, [searchText]);
  useEffect(() => {
    fetchUsers(1);
  }, [orderBy]);
  // // console.log("data===>", data);
  // console.log("props", props);
  return (
    <DataTable
      title={props.title}
      columns={props.columns}
      // customStyles={customStyles}
      // conditionalRowStyles={conditionalRowStyles}
      data={filteredItems}
      sort={false}
      // data={data}
      // sortServer={true}
      // onSort={(column, sortDirection, event) => {
      //   console.log("Test", { column, sortDirection, event });
      //   handleSort(column, sortDirection, event);
      // }}
      progressPending={loading}
      allowOverflow={true}
      actions={props.addBtn}
      // actions={actionsMemo}
      pagination
      paginationServer
      highlightOnHover
      paginationTotalRows={totalRows}
      selectableRows={false}
      onChangeRowsPerPage={handlePerRowsChange}
      onChangePage={handlePageChange}
      subHeader
      subHeaderComponent={subHeaderComponentMemo}
      persistTableHead
    />
  );
};
export default GetAdvanceDatatable;
