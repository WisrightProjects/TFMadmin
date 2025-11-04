import { Card, Col, Form, Row, Table } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ModalCommon from "components/modal";
import Actions from "components/actions";
import BreadCrumb from "components/common/breadcrumb";
import { masterService, commonService } from "core/services";
import { utils, CONST } from "core/helper";
import {
  PAYMENT_FILTER,
  PAYMENT_GET_BY_ID,
} from "core/services/apiURL.service";
import { useSelector } from "react-redux";
import { getFirstCaps } from "core/helper/utils";
import moment from "moment";

const Payments = () => {
  const commonData = useSelector((state) => state.common?.commonData);
  const [pageFor] = useState("Payment List");
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState(null);
  const toggleModal = () => setModalShow(!modalShow);
  const [spinner, setSpinner] = useState(true);

  const columns = [
    {
      name: "Order ID",
      selector: (row) => row.orderId,
    },
    {
      name: "Profile ID",
      selector: (row) => row.profile?.profileID,
    },
    {
      name: "Name",
      selector: (row) =>
        row.profile?.name ? row.profile?.name : row.user?.name,
    },
    {
      name: "Plan",
      selector: (row) => row.plan?.name,
    },
    {
      name: "Plan Price",
      selector: (row) => "₹" + row.plan?.price,
    },
    // {
    //   name: "Discount",
    //   selector: (row) => (row?.dicountedAmount ? row.dicountedAmount : "-"),
    // },
    {
      name: "Paid By",
      selector: (row) => (row.isMobile ? "Mobile" : "Web"),
    },
    {
      name: "Paid Amount",
      selector: (row) => "₹" + row?.amount,
    },
    {
      name: "Payment Date",
      selector: (row) => utils.formatDate(row.updatedAt),
    },
    {
      name: "Status",
      selector: (row) => {
        const { status } = row;
        const { paymentStatus } = commonData;
        const data = paymentStatus
          ? paymentStatus.find((ele) => ele.code === status)
          : {};
        let class_name = "";
        switch (data.code) {
          case 10:
            class_name = "btn-success";
            break;
          case 20:
            class_name = "btn-danger";
            break;
          case 30:
            class_name = "btn-primary";
            break;
          case 40:
            class_name = "btn-warning";
            break;
          case 50:
            class_name = "btn-secondary";
            break;
          default:
            class_name = "btn-warning";
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
      cell: (row) => <Actions viewOnClick={handleView} rowId={row._id} />,
      ignoreRowClick: true,
      grow: 1,
    },
  ];

  const {
    register: search,
    handleSubmit: searchHandleSubmit,
    reset: searchformReset,
    formState: { isSubmitting: searchIsSubmitting, isDirty },
  } = useForm();

  const onSubmitSearch = async (values) => {
    const { order_id, status, profileId, name } = values;
    if ((order_id || status || name) === "") {
      utils.showErrMsg("Atleast minimum field is required");
      return false;
    }

    const filterObj = {};
    if (name !== "") {
      filterObj.name = name;
    }
    if (profileId !== "") {
      filterObj.profileId = profileId;
    }
    if (status !== "") {
      filterObj.status = [Number(status)];
    }
    if (status === "All") {
      delete filterObj.status;
      setFilter({
        ...filter,
        filter: filterObj,
      });
    }
    setFilter({
      skip: 0,
      limit: 10,
      sortBy: '_id',
      sort: -1,
      filter: filterObj,
      search: order_id,
    });
  };

  const searchReset = () => {
    searchformReset();
    setFilter({
      ...filter,
      filter: {},
      search: "",
    });
  };

  const loadDataById = async (id) => {
    const resp = await masterService.getById(PAYMENT_GET_BY_ID + id);
    if (resp && resp.meta.code === 200) {
      return resp.data;
    }
    return false;
  };

  const handleView = async (id) => {
    const resp = await loadDataById(id);
    if (resp) {
      setModalTitle("View");
      toggleModal();
      setData(resp);
    }
  };

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    async function loadPaymentList(filter) {
      setSpinner(true);
      const resp = await commonService.filter(PAYMENT_FILTER, filter);
      if (resp && resp.meta.code === 200) {
        const { data, pagination } = resp;
        setTotalRows(pagination.totalCount);
        setDataSource(data);
        setSpinner(false);
      } else if (resp && resp.meta.code === 1021) {
        setSpinner(false);
        setDataSource([]);
      }
    }
    if (isComponentMounted) {
      loadPaymentList(filter);
    }
  }, [isComponentMounted, filter]);

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

  const getCommonDataVal = (key, value) => {
    const data = commonData[key]?.find((ele) => ele.code === value);
    return data ? data?.label : "";
  };

  return (
    <div>
      <BreadCrumb pageFor={pageFor} />
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <Form
                className="forms-sample"
                onSubmit={searchHandleSubmit(onSubmitSearch)}
              >
                <Row>
                  <Col md={43}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Order Id"
                        size="md"
                        {...search("order_id")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Profile ID"
                        size="md"
                        {...search("profileId")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="User Name"
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
                        {commonData?.paymentStatus?.map((ele, ind) => (
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
                      onClick={searchReset}
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
          modalTitle={modalTitle + " Payment"}
        >
          {modalTitle && modalTitle === "View" && data && (
            <Table className="borderless">
              <tbody>
                {/* <tr>
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
                </tr> */}
                <tr>
                  <h4>
                    <u>User Details</u>
                  </h4>
                </tr>
                <tr>
                  <td>
                    <h5>Name</h5>
                  </td>
                  <td>{getFirstCaps(data.user?.name)}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Email</h5>
                  </td>
                  <td>{data.user?.email}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Phone</h5>
                  </td>
                  <td>{data.user?.phone}</td>
                </tr>
                <tr>
                  <h4>
                    <u>Plan Details</u>
                  </h4>
                </tr>
                <tr>
                  <td>
                    <h5>Plan Name</h5>
                  </td>
                  <td>{data.plan?.name}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Plan Amount</h5>
                  </td>
                  <td>{data.plan?.price}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Discount Amount</h5>
                  </td>
                  <td>{data.plan?.discountValue}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Discount Type</h5>
                  </td>
                  <td>
                    {getCommonDataVal("discountType", data.plan?.discountType)}
                  </td>
                </tr>
                {data.trans_date &&
                  (data.status === 30 || data.status === 40) && (
                    <tr>
                      <td>
                        <h5>Transaction Date</h5>
                      </td>
                      <td>{data.trans_date}</td>
                    </tr>
                  )}
                <tr>
                  <td>
                    <h5>Total Amount</h5>
                  </td>
                  <td>{data.amount}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Payment Date</h5>
                  </td>
                  <td>{moment(data.updatedAt).format("DD-MM-YYYY hh:mm a")}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Payment Status</h5>
                  </td>
                  <td>{getCommonDataVal("paymentStatus", data.status)}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Payment Mode</h5>
                  </td>
                  <td>{data.paymentMode}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Order ID</h5>
                  </td>
                  <td>{data.orderId}</td>
                </tr>
                {(data.status === 30 || data.status === 40) && (
                  <tr>
                    <td>
                      <h5>Transaction ID</h5>
                    </td>
                    <td>{data.transactionId}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </ModalCommon>
      )}
    </div>
  );
};

export default Payments;
