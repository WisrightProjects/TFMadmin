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
  OLD_PAYMENT_FILTER,
  OLD_PAYMENT_GET_BY_ID,
} from "core/services/apiURL.service";
import moment from "moment";

const OldPayments = () => {
  const [pageFor] = useState("Previous Payments List");
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
      name: "Reciept Id",
      selector: (row) => row.receiptid,
    },
    {
      name: "Plan",
      selector: (row) => row.planname,
    },
    {
      name: "Profile ID",
      selector: (row) => row.loginid,
    },
    {
      name: "Paid By",
      selector: (row) => (row.isMobile ? "Mobile" : "Web"),
    },
    {
      name: "Paid Amount",
      selector: (row) => "₹" + row.amount,
    },
    {
      name: "Payment Date",
      selector: (row) => row.createdAt,
    },
    {
      name: "Action",
      cell: (row) => <Actions viewOnClick={handleView} rowId={row._id} />,
      ignoreRowClick: true,
      grow: 1,
    },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm();

  const onSubmitSearch = async (values) => {
    const { profileId, receiptId, paymentDate } = values;
    if ((profileId || paymentDate || receiptId) === "") {
      utils.showErrMsg("Atleast minimum field is required");
      return false;
    }
    const filterObj = {};
    if (receiptId !== "") {
      filterObj.receiptId = receiptId;
    }
    if (paymentDate !== "") {
      filterObj.paymentDate = paymentDate;
    }
    if (profileId !== "") {
      filterObj.profileId = profileId;
    }

    setFilter({
      ...filter,
      filter: filterObj,
    });
  };

  const searchReset = () => {
    reset();
    setFilter({
      ...filter,
      filter: {},
    });
  };

  const loadDataById = async (id) => {
    const resp = await masterService.getById(OLD_PAYMENT_GET_BY_ID + id);
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
      const resp = await commonService.filter(OLD_PAYMENT_FILTER, filter);
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

  // console.log("trans on::", data.transon);

  return (
    <div>
      <BreadCrumb pageFor={pageFor} />
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <Form
                className="forms-sample"
                onSubmit={handleSubmit(onSubmitSearch)}
              >
                <Row>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Profile ID"
                        size="md"
                        {...register("profileId")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Enter Receipt Id"
                        size="md"
                        {...register("receiptId")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="date"
                        size="md"
                        {...register("paymentDate")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="pb-2">
                  <button
                    disabled={isSubmitting}
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
          modalTitle={modalTitle + " Old Payment"}
          scrollable={true}
        >
          {modalTitle && modalTitle === "View" && data && (
            <Table className="borderless">
              <tbody>
                <tr>
                  <td>
                    <h5>Profile ID</h5>
                  </td>
                  <td>{data?.loginid}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Plan Name</h5>
                  </td>
                  <td>{data?.planname}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Transaction Date</h5>
                  </td>
                  <td>
                    {data.transon ? utils.formatDate(data.transon) : " --- "}
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>Expire Date</h5>
                  </td>
                  <td>{utils.formatDate(data.expireon)}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Amount</h5>
                  </td>
                  <td>{data.amount}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Validity</h5>
                  </td>
                  <td>{data.validity}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </ModalCommon>
      )}
    </div>
  );
};

export default OldPayments;
