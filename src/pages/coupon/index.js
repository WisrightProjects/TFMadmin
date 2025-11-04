import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ModalCommon from "components/modal";
import Actions from "components/actions";
import BreadCrumb from "components/common/breadcrumb";
import { masterService, commonService } from "core/services";
import { utils, CONST } from "core/helper";
import {
  COUPON_URL,
  COUPON_CREATE,
  COUPON_DELETE,
  COUPON_GET_BY_ID,
  COUPON_UPDATE,
} from "core/services/apiURL.service";
import moment from "moment";
import { useSelector } from "react-redux";
import Required from "components/common/required";

const validationSchema = Yup.object().shape({
  startAt: Yup.string().required("Start date is required"),
  expiresAt: Yup.string().required("End date is required"),
  amount: Yup.number()
    .moreThan(0)
    .typeError("Amount is required")
    .required("Amount is required"),
});

const Coupon = () => {
  const commonData = useSelector((state) => state.common?.commonData);
  const [pageFor] = useState("Coupon List");
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState(null);
  const toggleModal = () => setModalShow(!modalShow);
  const [reloadCouponList, setReloadCouponList] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const toggleCouponList = () => setReloadCouponList(!reloadCouponList);

  const columns = [
    {
      name: "Coupon Code",
      selector: (row) => row.couponCode,
    },
    {
      name: "Coupon Amount",
      selector: (row) =>`₹${row.amount}` 
    },
    {
      name: "Start Date",
      selector: (row) => utils.formatDate(row.startAt),
    },
    {
      name: "End Date",
      selector: (row) => utils.formatDate(row.expiresAt),
    },
    {
      name: "Created By",
      selector: (row) => row.user.name,
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
            // onClick={() => handleStatusChange(row)}
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
        editOnClick={handleEdit}
        viewOnClick={handleView}
        deleteOnClick={handleDelete}
        rowId={row._id}
      />
    );
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (values) => {
    data ? updateData(data._id, values) : createData(values);
  };

  const {
    register: search,
    handleSubmit: searchHandleSubmit,
    reset: searchFormReset,
    formState: { isSubmitting: searchIsSubmitting, isDirty },
  } = useForm();

  const searchReset = () => {
    searchFormReset();
    setFilter({
      ...filter,
      filter: {},
    });
  };

  const onSubmitSearch = async (values) => {
    const { createdUser, couponCode } = values;

    if (createdUser === "" && couponCode === "") {
      utils.showErrMsg("Atleast minimum field is required");
      return false;
    }

    const filterObj = {};

    if (couponCode !== "") {
      filterObj.couponCode = couponCode;
    }
    setFilter({
      ...filter,
      filter: filterObj,
      search: createdUser,
    });
  };

  const createData = async (values) => {
    const data = { ...values };
    const { startAt, expiresAt, amount } = data;
    const payload = {
      startAt,
      expiresAt,
      amount: amount.toString(),
    };
    const resp = await masterService.create(COUPON_CREATE, payload);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_ADDED_SUCC);
      reset();
      toggleModal();
      toggleCouponList();
    }
  };

  const updateData = async (id, values) => {
    const { expiresAt } = values;
    const resp = await masterService.update(COUPON_UPDATE + id, { expiresAt });
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_UPDATED_SUCC);
      reset();
      toggleModal();
      toggleCouponList();
    }
  };

  const loadDataById = async (id) => {
    const resp = await masterService.getById(COUPON_GET_BY_ID + id);
    if (resp && resp.meta.code === 200) {
      return resp.data;
    }
    return false;
  };

  const handleAdd = () => {
    setModalTitle("Add");
    setData(null);
    reset();
    toggleModal();
  };

  const handleEdit = async (id) => {
    const resp = await loadDataById(id);
    if (resp) {
      setModalTitle("Edit");
      toggleModal();
      setData(resp);
      setValue("startAt", utils.formatDate(resp.startAt));
      setValue("expiresAt", utils.formatDate(resp.expiresAt));
      setValue("amount", resp.amount);
    }
  };

  const handleView = async (id) => {
    const resp = await loadDataById(id);
    if (resp) {
      setModalTitle("View");
      toggleModal();
      setData(resp);
    }
  };

  const handleDelete = async (id) => {
    const resp = await masterService.delete(COUPON_DELETE + id);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_DELETED_SUCC);
      toggleCouponList();
    }
  };

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    async function loadCouponList(filter) {
      setSpinner(true);
      const resp = await commonService.couponFilter(
        COUPON_URL + "/filter",
        filter
      );
      if (resp && resp.meta.code === 200) {
        const { data, pagination } = resp;
        setTotalRows(pagination.totalCount);
        setDataSource(data);
        setSpinner(false);
      } else {
        setDataSource([]);
      }
    }
    if (isComponentMounted) {
      loadCouponList(filter);
    }
  }, [isComponentMounted, filter, reloadCouponList]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

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

  const [startAt, setStartAt] = useState();
  const getCommonDataVal = (key, value) => {
    const data =
      commonData && commonData[key]?.find((ele) => ele.code === value);
    return data ? data.label : "";
  };

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
                  <button
                    onClick={handleAdd}
                    className="btn btn-rounded btn-success"
                  >
                    + Add
                  </button>
                </Col>
              </Row>
              <Form
                className="forms-sample"
                onSubmit={searchHandleSubmit(onSubmitSearch)}
              >
                <Row>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Created By"
                        size="md"
                        {...search("createdUser")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Coupon Code"
                        size="md"
                        {...search("couponCode")}
                      />
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
                totalRows={totalRows}
                handlePageChange={handlePageChange}
                handlePerRowsChange={handlePerRowsChange}
                progressPending={spinner}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {modalShow && (
        <ModalCommon
          show={modalShow}
          handleClose={toggleModal}
          size="md"
          modalTitle={modalTitle + " Coupon"}
        >
          {modalTitle && (modalTitle === "Add" || modalTitle === "Edit") && (
            <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
              <Row>
                <Col md={6}>
                  <Row>
                    <Col md={12}>
                      <Form.Label>Start Date  <Required /></Form.Label>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="search-field form-group">
                        {data ? (
                          <Form.Control
                            {...register("startAt")}
                            type="date"
                            className="h-auto"
                            disabled
                          />
                        ) : (
                          <Form.Control
                            {...register("startAt")}
                            type="date"
                            className="h-auto"
                            min={moment().format("YYYY-MM-DD")}
                            onChange={(e) => {
                              setStartAt(e.target.value);
                            }}
                          />
                        )}
                        <p className="text-danger text-start">
                          {errors.startAt?.message}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
                <Col md={6}>
                  <Row>
                    <Col md={12}>
                      <Form.Label>End Date  <Required /></Form.Label>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="search-field form-group">
                        {data ? (
                          <Form.Control
                            {...register("expiresAt")}
                            type="date"
                            className="h-auto"
                            min={moment().format("YYYY-MM-DD")}
                          />
                        ) : (
                          <Form.Control
                            {...register("expiresAt")}
                            type="date"
                            className="h-auto"
                            min={startAt}
                          />
                        )}
                        <p className="text-danger text-start">
                          {errors.expiresAt?.message}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Row>
                    <Col md={12}>
                      <Form.Label>Amount  <Required /></Form.Label>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="search-field form-group">
                        {data ? (
                          <Form.Control
                            {...register("amount")}
                            type="text"
                            placeholder="Amount"
                            className="h-auto"
                            disabled
                          />
                        ) : (
                          <Form.Control
                            {...register("amount")}
                            type="number"
                            placeholder="Amount"
                            className="custome_num_input h-auto"
                            pattern="\d*"
                          />
                        )}
                        <p className="text-danger text-start">
                          {errors.amount?.message}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div className="mt-3">
                <Button
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm font-weight-medium auth-form-btn"
                  type="submit"
                >
                  Submit
                </Button>
                <Button className="btn btn-danger btn-sm" onClick={toggleModal}>
                  Close
                </Button>
              </div>
            </Form>
          )}
          {modalTitle && modalTitle === "View" && data && (
            <Table className="borderless">
              <tbody>
                <tr>
                  <td>
                    <h5>Start Date</h5>
                  </td>
                  <td>{utils.formatDate(data.startAt)}</td>
                </tr>
                <tr>
                  <td>
                    <h5>End Date</h5>
                  </td>
                  <td>{utils.formatDate(data.expiresAt)}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Coupon code</h5>
                  </td>
                  <td>{data?.couponCode}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Amount</h5>
                  </td>
                  <td>{data.amount}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Status</h5>
                  </td>
                  <td>{getCommonDataVal("userStatus", data.status)}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </ModalCommon>
      )}
    </div>
  );
};

export default Coupon;
