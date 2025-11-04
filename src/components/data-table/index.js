// Reference from : https://react-data-table-component.netlify.app/?path=/docs/getting-started-coc--page
// https://jbetancur.github.io/react-data-table-component/?path=/docs/custom-styles-compact-grid--compact-grid

import React, { useMemo, Fragment } from "react";
import styled from "styled-components";
import DataTable from "react-data-table-component";
import { Button, Spinner } from "react-bootstrap";

// import FixedHeaderStory from 'react-data-table-component';
// import { Link } from 'react-router-dom';
// import Reference from 'yup/lib/Reference';
// import Checkbox from '@material-ui/core/Checkbox';

// import ArrowDownward from '@material-ui/icons/ArrowDownward';

// const sortIcon = "^";//<ArrowDownward />;
// const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

function convertArrayOfObjectsToCSV(array) {
  let result;
  const columnDelimiter = ",";
  const lineDelimiter = "\n";
  // const ConvertDate = date =>  new Intl.DateTimeFormat('en-US').format(new Date(date));
  const keys = Object.keys(array[0]);

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

function downloadCSV(title, array) {
  const link = document.createElement("a");
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv == null) return;

  const filename = title.toLowerCase() + ".csv";

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", filename);
  link.click();
}

const Export = ({ onExport }) => (
  <button onClick={(e) => onExport(e.target.value)}>Export</button>
);

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
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <div className="input-group mb-3">
    <TextField
      type="text"
      placeholder="Filter By Name"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <div className="input-group-append">
      <ClearButton type="button" className="p-0" onClick={onClear}>
        X
      </ClearButton>
    </div>
  </div>
);

const customStyles = {
  rows: {
    style: {
      minHeight: "72px", // override the row height
    },
  },
  headCells: {
    style: {
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
    },
  },
};

function DataTableRemote(props) {
  const {
    title,
    // filterKey,
    // filterKeyArr,
    addLink,
    noHeader = true,
    subHeader = true,
    data,
    progressPending,
    columns,
    exportLink,
    exportFunc,
    downloadFuntion,
    totalRows,
    handlePerRowsChange,
    handlePageChange,
  } = props;

  const actionsMemo = useMemo(() => {
    return (
      <Fragment>
        {addLink && (
          <button className="btn btn-rounded btn-success" onClick={addLink}>
            + Add
          </button>
        )}
        {exportLink && <Export onExport={() => downloadCSV(title, data)} />}
        {exportFunc && (
          <button onClick={downloadFuntion}>Export Exception</button>
        )}
      </Fragment>
    );
  }, [data, addLink, downloadFuntion, exportFunc, exportLink, title]);

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);


  const SpinnerComponant = () => {
    return (
      <div className="spinner_wrapper">
        <Spinner animation="border" />
      </div>
    );
  };

  return (
    <div>
      <DataTable
        className="table table-striped table-bordered align-middle mb-0 text-nowrap"
        title={title}
        noHeader={noHeader}
        responsive
        pagination
        paginationRowsPerPageOptions={[2, 5, 10, 25, 50, 100]}
        paginationResetDefaultPage={resetPaginationToggle}
        highlightOnHover
        pointerOnHover
        progressPending={progressPending}
        actions={actionsMemo}
        dense
        data={data}
        columns={columns}
        customStyles={customStyles}
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        subHeader={subHeader}
        subHeaderComponent={subHeaderComponentMemo}
        progressComponent={<SpinnerComponant />}
      />
    </div>
  );
}

export default DataTableRemote;
