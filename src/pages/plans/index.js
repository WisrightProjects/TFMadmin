import { Card, Col, Row, Button } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { useEffect, useState } from "react";
import { commonService } from "core/services";
import Actions from "components/actions";
import { VIEW_PLAN, ADD_PLAN, EDIT_PLAN } from "pages/routes/routes";
import BreadCrumb from "components/common/breadcrumb";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PLAN_URL } from "core/services/apiURL.service";
import { CONST, utils } from "core/helper";
import { connect } from "react-redux";
import ModalCommon from "components/modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  status: Yup.number().required("Status is required"),
});

const Plans = (props) => {
  const { commonData } = props;

  const calculateDiscountAmount = (price, type, discountAmount) => {
    let discountWithPrice;
    if (type === 10) {
      discountWithPrice = price - discountAmount;
    } else {
      const value = (discountAmount / 100) * price;
      discountWithPrice = Math.round(price - value);
    }
    return "₹" + discountWithPrice;
  };

  const columns = [
    {
      name: "Plan ID",
      selector: (row) => row.planId,
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Price",
      selector: (row) => "₹" + row.price,
    },
    {
      name: "Validity",
      selector: (row) => row.validity,
    },
    {
      name: "Discount",
      selector: (row) => {
        const { price, discountType, discountValue } = row;
        return calculateDiscountAmount(price, discountType, discountValue);
      },
      // row.discountType === 10
      //   ? "₹" + row.discountValue
      //   : row.discountValue + " %",
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
        return (
          <button
            type="button"
            onClick={() => handleStatusChange(row)}
            className={`btn ${class_name} btn-sm`}
          >
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
        viewUrl={VIEW_PLAN + "/" + row._id}
        editUrl={EDIT_PLAN + "/" + row._id}
        rowId={row._id}
      />
    );
  };

  const [pageFor] = useState("Plan List");
  const [dataSource, setDataSource] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [spinner, setSpinner] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [plan, setPlan] = useState({});
  const [modalTitle, setModalTitle] = useState("");

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

  const handleStatusChange = (plan) => {
    setModalTitle("Change Plan Status");
    setPlan(plan);
    setValue("status", plan.status.toString());
    handleModalShow();
  };

  const onSubmit = async (value) => {
    const resp = await commonService.create(
      PLAN_URL + "/change-status/" + plan.planId,
      value
    );
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
      reset();
      handleModalClose();
      loadPlans(filter);
    }
  };

  const loadPlans = async (filter) => {
    setSpinner(true);
    const resp = await commonService.filter(PLAN_URL + "/filter", filter);
    if (resp && resp.meta.code === 200) {
      const { data, pagination } = resp;
      setTotalRows(pagination.totalCount);
      setDataSource(data);
      setSpinner(false);
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

  const [componentAttach, setComponentAttach] = useState(false);
  useEffect(() => {
    let mounted = true;
    const handleChange = async () => {
      if (mounted) {
        await loadPlans(filter);
      }
    };
    if (componentAttach) {
      handleChange();
    }
    return () => (mounted = false);
  }, [componentAttach, filter]);

  useEffect(() => {
    setComponentAttach(true);
  }, []);

  const {
    register: search,
    handleSubmit: searchHandleSubmit,
    reset: searchReset,
    formState: { isDirty },
  } = useForm();

  const handleSearchReset = () => {
    searchReset();
    setFilter({
      ...filter,
      search: "",
      filter: {},
    });
  };

  const onSubmitSearch = async (values) => {
    const { search, status, name } = values;
    if ((search || name || status) === "") {
      utils.showErrMsg("Minimum field is required");
      return false;
    }
    const filterObj = {};
    if (name !== "") {
      filterObj.name = name;
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
      search: search,
      filter: filterObj,
    });
  };

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
                  <Link className="nav-link" to={ADD_PLAN}>
                    <button className="btn btn-rounded btn-success">
                      + Add
                    </button>
                  </Link>
                </Col>
              </Row>
              <Form
                onSubmit={searchHandleSubmit(onSubmitSearch)}
                className="forms-sample"
              >
                <Row>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Enter Plan Id"
                        size="md"
                        {...search("search")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Enter Plan Name"
                        size="md"
                        {...search("name")}
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
                        {commonData?.planStatus?.map((ele, ind) => (
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
                    type="submit"
                    className="btn btn-gradient-primary mr-2"
                  >
                    Search
                  </button>
                  {isDirty && (
                    <button
                      onClick={handleSearchReset}
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
          {modalTitle && modalTitle === "Change Plan Status" && (
            <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
              <Form.Group className="search-field form-group">
                <div className="d-flex">
                  {commonData.planStatus &&
                    commonData.planStatus.map((ele, ind) => {
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

export default connect(mapStateToProps, null)(Plans);
