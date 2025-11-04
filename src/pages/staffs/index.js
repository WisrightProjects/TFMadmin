import { Card, Col, Row, Button, Table } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { useEffect, useState } from "react";
import { commonService } from "core/services";
import Actions from "components/actions";
import { ADD_STAFF, EDIT_STAFF } from "pages/routes/routes";
import BreadCrumb from "components/common/breadcrumb";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { USER_URL } from "core/services/apiURL.service";
import { CONST, utils } from "core/helper";
import { connect } from "react-redux";
import ModalCommon from "components/modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  status: Yup.number().required("Status is required"),
});

const Staffs = (props) => {
  const { commonData } = props;

  const columns = [
    {
      name: "Staff ID",
      selector: (row) => row.userID,
    },
    {
      name: "Username",
      selector: (row) => row.name,
    },
    // {
    //   name: "Branch",
    //   selector: (row) => row.branch.name,
    // },
    {
      name: "Phone",
      selector: (row) => row.phone,
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
          ? userStatus?.find((ele) => ele.code === status)
          : {};
        let class_name = "";
        switch (data?.code) {
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
        return (
          <button
            type="button"
            onClick={() => handleStatusChange(row)}
            className={`btn ${class_name} btn-sm`}
          >
            {data?.label}
          </button>
        );
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <Actions
          viewOnClick={handleView}
          editUrl={EDIT_STAFF + "/" + row._id}
          rowId={row._id}
        />
      ),
      ignoreRowClick: true,
      grow: 1,
    },
  ];

  const [pageFor] = useState("Staff List");
  const [dataSource, setDataSource] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState({
    ...CONST.DEFAULT_ADV_FILTER,
    role: 20,
  });

  const [modalShow, setModalShow] = useState(false);
  const [user, setUser] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [spinner, setSpinner] = useState(true);

  const handleModalShow = () => setModalShow(true);
  const handleModalClose = () => setModalShow(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const {
    register: search,
    handleSubmit: searchHandleSubmit,
    reset: searchFromReset,
    formState: { isSubmitting: searchIsSubmitting, isDirty },
  } = useForm();

  const handleStatusChange = (user) => {
    setModalTitle("Change Account Status");
    setUser(user);
    setValue("status", user.status?.toString());
    handleModalShow();
  };

  const onSubmit = async (value) => {
    const statusChangeUrl = USER_URL + "/change-status/" + user.userID;
    const resp = await commonService.create(statusChangeUrl, value);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
      reset();
      handleModalClose();
      setFilter({
        ...filter,
        filter: {},
      });
    } else {
      utils.showErrMsg(resp.meta.message);
    }
  };

  const searchReset = () => {
    searchFromReset();
    setFilter({
      ...filter,
      filter: {},
      search: "",
    });
  };

  const onSubmitSearch = async (values) => {
    const { email, name, userID, status } = values;
    if ((email || userID || name || status) === "") {
      utils.showErrMsg("Atleast minimum field is required");
      return false;
    }

    const filterObj = {};
    if (email !== "") {
      filterObj.email = email;
    }
    if (userID !== "") {
      filterObj.userId = userID;
    }
    if (status !== "") {
      filterObj.status = Number(status);
    }
    if (status === "All") {
      delete filterObj.status;
      setFilter({
        ...filter,
        filter: filterObj,
      });
    }

    setFilter({
      ...filter,
      filter: filterObj,
      search: name,
    });
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

  const getCommonDataVal = (key, val) => {
    const resp =
      commonData && commonData[key]
        ? commonData[key]?.find((e) => e.code === val)
        : "";
    return resp ? resp?.label : "";
  };

  const loadData = async (staffId) => {
    const resp = await commonService.getById(USER_URL + "/" + staffId);
    if (resp && resp.meta.code === 200) {
      return resp?.data;
    }
  };

  const handleView = async (staffId) => {
    const resp = await loadData(staffId);
    if (resp) {
      setModalTitle("View Staff");
      handleModalShow();
      setData(resp);
    }
  };

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    const loadList = async (filter) => {
      setSpinner(true);
      const listUrl = USER_URL + "/filter";
      const resp = await commonService.loadStaff(listUrl, filter);
      if (resp && resp.meta.code === 200) {
        const { data, pagination } = resp;
        setTotalRows(data.length > 0 ? pagination.totalCount : 0);
        setDataSource(data.length > 0 ? data : []);
        setSpinner(false);
      } else {
        setDataSource([]);
      }
    };
    if (isComponentMounted) {
      loadList(filter);
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
                <Col md={6} />
                <Col
                  md={6}
                  className="ml-lg-auto d-flex pt-2 pt-md-0 align-items-stretch justify-content-end"
                >
                  <Link className="nav-link" to={ADD_STAFF}>
                    <button className="btn btn-rounded btn-success">
                      + Add
                    </button>
                  </Link>
                </Col>
              </Row>
              <Form
                className="forms-sample"
                onSubmit={searchHandleSubmit(onSubmitSearch)}
              >
                <Row>
                  <Col md={2}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Enter Staff Id"
                        size="md"
                        {...search("userID")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Enter Username"
                        size="md"
                        {...search("name")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Enter Useremail"
                        size="md"
                        {...search("email")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="form-group">
                      <Form.Select
                        className="form-control"
                        {...search("status")}
                      >
                        <option onClick={""}>All</option>
                        {commonData?.userStatus?.map((ele, ind) => (
                          <option key={ind} value={ele.code}>
                            {ele.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="pb-2">
                  <button
                    disabled={searchIsSubmitting}
                    type="submit"
                    className="btn btn-gradient-primary mr-2"
                  >
                    Search
                  </button>
                  {isDirty && (
                    <button
                      onClick={() => searchReset()}
                      className="btn btn-gradient-danger mr-2"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </Form>

              <DataTableRemote
                noHeader={true}
                subHeader={false}
                columns={columns}
                data={dataSource}
                handlePageChange={handlePageChange}
                handlePerRowsChange={handlePerRowsChange}
                totalRows={totalRows}
                progressPending={spinner}
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
          {modalTitle && modalTitle === "Change Account Status" && (
            <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
              <Form.Group className="search-field form-group">
                <div className="d-flex">
                  {commonData.userStatus &&
                    commonData.userStatus.map((ele, ind) => {
                      return (
                        <Form.Check className="mx-1" key={ind}>
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="status"
                              value={ele.code}
                              {...register("status")}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      );
                    })}
                </div>
                <p className="text-danger">{errors.status?.message}</p>
              </Form.Group>
              <div className="mt-3">
                <Button
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm font-weight-medium auth-form-btn"
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  className="btn btn-danger btn-sm"
                  onClick={handleModalClose}
                >
                  Close
                </Button>
              </div>
            </Form>
          )}
          {modalTitle && modalTitle === "View Staff" && data && (
            <Table className="borderless">
              <tbody>
                <tr>
                  <td>
                    <h5>Name</h5>
                  </td>
                  <td>{data?.name}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Email</h5>
                  </td>
                  <td>{data?.email}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Phone</h5>
                  </td>
                  <td>{data?.phone}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Branch </h5>
                  </td>
                  <td>{data?.branch?.name}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Status</h5>
                  </td>
                  <td>{getCommonDataVal("userStatus", data.status)}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Role</h5>
                  </td>
                  <td>{getCommonDataVal("staffRegisterRoles", data.role)}</td>
                </tr>
              </tbody>
            </Table>
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

export default connect(mapStateToProps, null)(Staffs);
