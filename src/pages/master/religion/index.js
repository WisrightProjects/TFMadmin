import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ModalCommon from "components/modal";
import Actions from "components/actions";
import BreadCrumb from "components/common/breadcrumb";
import { masterService } from "core/services";
import { utils, CONST } from "core/helper";
import { RELIGION_URL } from "core/services/apiURL.service";
import Required from "components/common/required";

const validationSchema = Yup.object().shape({
  name: Yup.string().label("Religion name").required(),
});

const ReligionList = () => {
  const [pageFor] = useState("Religion List");
  const [modalTitle, setModalTitle] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState(null);
  const [spinner, setSpinner] = useState(true);

  const [modalShow, setModalShow] = useState(false);
  const toggleModal = () => setModalShow(!modalShow);

  const [reloadList, setReloadList] = useState(false);
  const toggleReloadList = () => setReloadList(!reloadList);

  const columns = [
    {
      name: "Religion Name",
      selector: (row) => row.name,
    },
    {
      name: "Last Updated",
      selector: (row) => utils.formatDate(row.updatedAt),
    },
    {
      name: "Is Deleted",
      selector: (row) => {
        const { isDeleted } = row;
        let class_name = isDeleted ? "btn-danger" : "btn-success";
        let label = isDeleted ? "Deleted" : "Active";
        return (
          <button type="button" className={`btn ${class_name} btn-sm`}>
            {label}
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
    const { name } = values;

    if (name === "") {
      utils.showErrMsg("Atleast minimum field is required");
      return false;
    }
    const filterObj = {};

    if (name !== "") {
      filterObj.name = name;
    }

    setFilter({
      ...filter,
      filter: filterObj,
    });
  };

  const createData = async (values) => {
    const resp = await masterService.create(RELIGION_URL, values);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_ADDED_SUCC);
      reset();
      toggleModal();
      toggleReloadList();
    }
  };

  const updateData = async (id, values) => {
    const resp = await masterService.update(RELIGION_URL + "/" + id, values);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_UPDATED_SUCC);
      reset();
      toggleModal();
      toggleReloadList();
    }
  };

  const loadDataById = async (id) => {
    const resp = await masterService.getById(RELIGION_URL + "/" + id);
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
      setValue("name", resp.name);
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
    const resp = await masterService.delete(RELIGION_URL + "/" + id);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_DELETED_SUCC);
      toggleReloadList();
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

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    const loadList = async (filter) => {
      setSpinner(true);
      const listUrl = RELIGION_URL + "/filter";
      const resp = await masterService.getAllPost(listUrl, filter);
      if (resp && resp.meta.code === 200) {
        const { data, pagination } = resp;
        setTotalRows(pagination.totalCount);
        setDataSource(data);
        setSpinner(false);
      } else {
        setDataSource([]);
      }
    };
    if (isComponentMounted) {
      loadList(filter);
    }
  }, [isComponentMounted, filter, reloadList]);

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
                        placeholder="Enter to search"
                        size="md"
                        {...search("name")}
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
          modalTitle={modalTitle + " Religion"}
        >
          {modalTitle && (modalTitle === "Add" || modalTitle === "Edit") && (
            <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
              <Form.Label>
                Religion Name <Required />
              </Form.Label>
              <Form.Group className="search-field form-group">
                <Form.Control
                  {...register("name")}
                  type="text"
                  placeholder="Religion Name"
                  className="h-auto"
                />
                <p className="text-danger text-start">{errors.name?.message}</p>
              </Form.Group>
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
                    <h5>Religion Name</h5>
                  </td>
                  <td>{data.name}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </ModalCommon>
      )}
    </div>
  );
};

export default ReligionList;
