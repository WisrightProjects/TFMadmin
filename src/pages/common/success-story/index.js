import { Card, Col, Form, Row } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { useEffect, useState } from "react";
import { commonService, masterService } from "core/services";
import ModalCommon from "components/modal";
import { useForm } from "react-hook-form";
import { CONST, utils } from "core/helper";
import Actions from "components/actions";
import BreadCrumb from "components/common/breadcrumb";
import { SUCCESS_STORY_FILTER } from "core/services/apiURL.service";
import moment from "moment";

const SuccessStory = () => {
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Partner Name",
      selector: (row) => row.partnerName,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Partner Email",
      selector: (row) => row.partnerEmail,
    },
    // {
    //   name: "Question",
    //   selector: (row) => row.question,
    //   format: (row) => {
    //     const length = row.question.length;
    //     return length < 40
    //       ? row.question.slice(0, 40)
    //       : row.question.slice(0, 40) + "...";
    //   },
    // },
    // {
    //   name: "Answer",
    //   selector: (row) => row.answer,
    //   format: (row) => {
    //     const length = row.answer.length;
    //     return (
    //       <Fragment>
    //         {/* {length < 40 ? row.answer.slice(0, 40) : row.answer.slice(0, 40) + "..."} */}
    //         <span dangerouslySetInnerHTML={{ __html: row.answer }}></span>
    //       </Fragment>
    //     );
    //   },
    // },
    {
      name: "Action",
      cell: (row) => getActions(row),
      ignoreRowClick: true,
      grow: 1,
    },
  ];

  const getActions = (row) => {
    return <Actions viewOnClick={handleViewSuccessStory} rowId={row._id} />;
  };

  const [successStories, setSuccessStories] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [spinner, setSpinner] = useState(true);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });

  const { register, handleSubmit, formState, reset, setValue } = useForm();
  const { isDirty, isSubmitting } = formState;

  const loadSuccessStory = async (id) => {
    const resp = await commonService.getSuccessStory(id);
    if (resp && resp?.meta?.code === 200) {
      return resp.data;
    }
    return false;
  };

  const handleModalShow = () => setModalShow(true);

  const handleModalClose = () => {
    setModalShow(false);
    reset();
  };

  const handleViewSuccessStory = async (id) => {
    const data = await loadSuccessStory(id);
    if (data) {
      setData(data);
      setModalTitle("View Story");
      handleModalShow();
      const fields = ["question"];
      fields.forEach((field) => setValue(field, data[field]));
    }
    // const resp = await commonService.getFaq(id);
    // setViewFaq(resp ? resp.data : {});
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

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    const loadAll = async () => {
      setSpinner(true);
      const resp = await masterService.getAllPost(SUCCESS_STORY_FILTER, filter);
      if (resp && resp?.meta?.code === 200) {
        const { data: faq_s, pagination } = resp;
        setTotalRows(pagination.totalCount);
        setSuccessStories(faq_s);
        setSpinner(false);
      }
    };
    const handleChange = async () => {
      await loadAll(filter);
    };
    if (isComponentMounted) {
      handleChange();
    }
  }, [isComponentMounted, filter]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

  const onSubmitSearch = async (values) => {
    const { email, name } = values;
    if ((email || name) === "") {
      utils.showErrMsg("Minimum field is required");
      return false;
    }
    const filterObj = {};
    if (name !== "") {
      filterObj.name = name;
    }
    if (email !== "") {
      filterObj.email = email;
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

  return (
    <div>
      <BreadCrumb pageFor="Success stories" listUrl="Success stories" />
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <Form
                className="forms-sample"
                onSubmit={handleSubmit(onSubmitSearch)}
              >
                <Row>
                  <Col md={3}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Enter Name"
                        size="md"
                        {...register("name")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Email"
                        size="md"
                        {...register("email")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <div className="pb-2 d-flex justify-content-start">
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
                          type="reset"
                          className="btn btn-gradient-danger mr-2"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </Col>
                </Row>
              </Form>
              <DataTableRemote
                title="Success Stories"
                noHeader={true}
                subHeader={false}
                columns={columns}
                data={successStories}
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
          {modalTitle && modalTitle === "View Story" && data && (
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
                    <td>{data.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="text-bold">Partner Name</h5>
                    </td>
                    <td>{data.partnerName}</td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="text-bold">Email</h5>
                    </td>
                    <td>{data.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="text-bold">Partner Email</h5>
                    </td>
                    <td>{data.partnerEmail}</td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="text-bold">First Meet Date</h5>
                    </td>
                    <td>{moment(data.firstMeetDate).format("DD-mm-yyyy")}</td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="text-bold">Wedding Date</h5>
                    </td>
                    <td>{moment(data.weddingDate).format("DD-mm-yyyy")}</td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="text-bold">Content</h5>
                    </td>
                    <td>{data.content}</td>
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

export default SuccessStory;
