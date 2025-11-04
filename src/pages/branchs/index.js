import { Card, Col, Row } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { useEffect, useState } from "react";
import { commonService } from "core/services";
import Actions from "components/actions";
import { ADD_BRANCH, EDIT_BRANCH } from "pages/routes/routes";
import BreadCrumb from "components/common/breadcrumb";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BRANCH_URL } from "core/services/apiURL.service";
import { CONST, utils } from "core/helper";
import { connect } from "react-redux";
import ModalCommon from "components/modal";
import { useForm } from "react-hook-form";

const Branchs = (props) => {
  const { commonData } = props;
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle] = useState("View Branch");
  const [viewBranch, setViewBranch] = useState({});

  const columns = [
    {
      name: "Branch Name",
      selector: (row) => row.name,
    },
    {
      name: "Phone",
      selector: (row) => row.mobile,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Status",
      selector: (row) => {
        const { status } = row;
        const { userStatus } = commonData;
        const data = userStatus
          ? userStatus.find((ele) => ele.code === status)
          : {};
        let class_name = "";
        switch (data.code) {
          case 10:
            class_name = "btn-success";
            break;
          case 20:
            class_name = "btn-danger";
            break;

          default:
            class_name = "btn-primary";
            break;
        }
        // 'class_name::', class_name);
        return (
          <button type="button" className={`btn ${class_name} btn-sm`}>
            {data.label}
          </button>
        );
      },
    },
    {
      name: "Action",
      cell: (row) => getActions(row),
      ignoreRowClick: true,
      grow: 1,
    },
  ];

  const getActions = (row) => {
    return (
      <Actions
        editUrl={EDIT_BRANCH + "/" + row._id}
        viewOnClick={loadBranch}
        rowId={row._id}
      />
    );
  };

  const {
    register: search,
    handleSubmit: searchHandleSubmit,
    reset,
    formState: { isDirty },
  } = useForm();

  const [pageFor] = useState("Branch List");
  const [dataSource, setDataSource] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [spinner, setSpinner] = useState(true);

  const handleModalShow = () => setModalShow(true);
  const handleModalClose = () => setModalShow(false);

  const searchReset = () => {
    reset();
    setFilter({
      ...filter,
      filter: {},
    });
  };

  const loadBranch = async (branchId) => {
    handleModalShow();
    const resp = await commonService.getById(BRANCH_URL + "/" + branchId);
    if (resp && resp.meta.code === 200) {
      setViewBranch(resp.data);
    }
  };

  const handlePageChange = (page) => {
    setFilter({
      ...filter,
      skip: page > 1 ? (page - 1) * perPage : 0,
    });
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setFilter({
      ...filter,
      skip: page > 1 ? (page - 1) * perPage : 0,
      limit: newPerPage,
    });
  };

  const onSubmitSearch = async (values) => {
    const { email, name } = values;

    if (email === "" && name === "") {
      utils.showErrMsg("Atleast minimum field is required");
      return false;
    }

    const filterObj = {};

    if (email !== "") {
      filterObj.email = email;
    }

    if (name !== "") {
      filterObj.name = name;
    }

    setFilter({
      ...filter,
      filter: filterObj,
    });
  };

  const getCommonDataVal = (key, value) => {
    if (commonData) {
      const data =
        commonData && commonData[key]?.find((ele) => ele.code === value);
      return data ? data.label : "";
    }
  };

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    async function loadBranchs(filter) {
      setSpinner(true);
      const resp = await commonService.filter(BRANCH_URL + "/filter", filter);
      if (resp && resp.meta.code === 200) {
        const { data, pagination } = resp;
        setTotalRows(pagination.totalCount);
        setDataSource(data);
        setSpinner(false);
      }
    }
    if (isComponentMounted) {
      loadBranchs(filter);
    }
  }, [isComponentMounted, filter]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

  return (
    <div>
      <BreadCrumb pageFor={pageFor} />
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <Row className="m-2">
                <Col md={6}></Col>
                <Col
                  md={6}
                  className="ml-lg-auto d-flex pt-2 pt-md-0 align-items-stretch justify-content-end"
                >
                  <Link className="nav-link" to={ADD_BRANCH}>
                    <button className="btn btn-rounded btn-success">
                      + Add
                    </button>
                  </Link>
                </Col>
              </Row>
              <Row className="m-2">
                <Col md={12}>
                  <Form
                    className="forms-sample"
                    onSubmit={searchHandleSubmit(onSubmitSearch)}
                  >
                    <Row>
                      <Col md={4}>
                        <Form.Group className="form-group">
                          <Form.Control
                            type="text"
                            placeholder="Enter Branch Name"
                            size="md"
                            {...search("name")}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="form-group">
                          <Form.Control
                            type="text"
                            placeholder="Enter Branch Email"
                            size="md"
                            {...search("email")}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <div className="pb-2">
                          <button
                            type="submit"
                            className="btn btn-gradient-primary mr-2"
                          >
                            Search
                          </button>
                          {isDirty && (
                            <button
                              onClick={searchReset}
                              className="btn btn-gradient-danger mr-2"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
              <DataTableRemote
                noHeader={true}
                subHeader={false}
                columns={columns}
                data={dataSource}
                progressPending={spinner}
                handlePageChange={handlePageChange}
                handlePerRowsChange={handlePerRowsChange}
                totalRows={totalRows}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {modalShow && (
        <ModalCommon
          show={modalShow}
          handleClose={handleModalClose}
          size="md"
          modalTitle={modalTitle}
        >
          {modalTitle && modalTitle === "View Branch" && (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Label</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <h5 className="text-bold">Name</h5>
                    </td>
                    <td>{viewBranch.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="text-bold">Email</h5>
                    </td>
                    <td>{viewBranch.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="text-bold">Mobile</h5>
                    </td>
                    <td>{viewBranch.mobile}</td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="text-bold">Place</h5>
                    </td>
                    <td>{viewBranch.place}</td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="text-bold">Address</h5>
                    </td>
                    <td>{viewBranch.address}</td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="text-bold">Pincode</h5>
                    </td>
                    <td>{viewBranch.pincode}</td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="text-bold">Status</h5>
                    </td>
                    <td>
                      {" "}
                      {getCommonDataVal("userStatus", viewBranch.status)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </ModalCommon>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    commonData: state?.common?.commonData,
  };
};

export default connect(mapStateToProps, null)(Branchs);
