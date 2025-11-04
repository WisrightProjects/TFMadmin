import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { useEffect, useState } from "react";
import { masterService } from "core/services";
import ModalCommon from "components/modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { utils, CONST } from "core/helper";
import Actions from "components/actions";
import BreadCrumb from "components/common/breadcrumb";
import {
  LANGUAGE_FILTER,
  LANGUAGE_GET_BY_ID,
  LANGUAGE_URL,
} from "core/services/apiURL.service";
import Required from "components/common/required";

const validationSchema = Yup.object().shape({
  name: Yup.string().label("Language name").required(),
});

const Language = () => {
  const columns = [
    {
      name: "Languages",
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
        editOnClick={handleEditLanguage}
        viewOnClick={handleViewLanguage}
        deleteOnClick={handleDeleteLanguage}
        rowId={row._id}
      />
    );
  };

  const [dataSource, setDataSource] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  const [viewLanguage, setViewLanguage] = useState({});
  const [isAddMode, setIsAddMode] = useState(true);
  const [languageId, setLanguageId] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_ADVANCE_ASYNC_LANG_FILTER });
  const [spinner, setSpinner] = useState(true);

  const [reloadList, setReloadList] = useState(false);
  const toggleReloadList = () => setReloadList(!reloadList);

  const handleModalShow = () => setModalShow(true);
  const handleModalClose = () => {
    setModalShow(false);
    reset();
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
    isAddMode ? createLanguage(values) : updateLanguage(languageId, values);
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

  const createLanguage = async (payload) => {
    const resp = await masterService.create(LANGUAGE_URL, payload);
    const { meta } = resp;
    if (meta.code === 200) {
      reset();
      handleModalClose();
      toggleReloadList();
      utils.showSuccessMsg(meta.message);
    } else {
      utils.showErrMsg(meta.message);
      return false;
    }
  };

  const updateLanguage = async (languageId, payload) => {
    const updateUrl = LANGUAGE_URL + "/" + languageId;
    const resp = await masterService.update(updateUrl, payload);
    const { meta } = resp;
    if (meta.code === 200) {
      reset();
      handleModalClose();
      toggleReloadList();
      utils.showSuccessMsg(meta.message);
    } else {
      utils.showErrMsg(meta.message);
      return false;
    }
  };

  const loadLanguage = async (id) => {
    const languageObj = dataSource.find((ele) => ele._id === id);
    const { name } = languageObj;
    setValue("name", name);
  };

  const handleAddLanguage = () => {
    handleModalShow();
    setModalTitle("Add Language");
  };

  const handleEditLanguage = (id) => {
    setModalTitle("Edit Language");
    handleModalShow();
    setIsAddMode(false);
    setLanguageId(id);
    loadLanguage(id);
  };

  const handleViewLanguage = async (id) => {
    setModalTitle("View Language");
    handleModalShow();
    const resp = await masterService.getById(LANGUAGE_GET_BY_ID + id);
    setViewLanguage(resp ? resp.data : {});
  };

  const handleDeleteLanguage = async (id) => {
    const resp = await masterService.delete(LANGUAGE_URL + "/" + id);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
      toggleReloadList();
    } else {
      utils.showErrMsg(resp.meta.message);
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
    const loadLanguageList = async (filter) => {
      setSpinner(true);
      const resp = await masterService.getAllPost(LANGUAGE_FILTER, filter);
      const { data: languages, pagination } = resp;
      if (resp && resp.meta.code === 200) {
        setTotalRows(pagination.totalCount);
        setDataSource(languages);
        setSpinner(false);
      } else {
        setDataSource([]);
      }
    };
    if (isComponentMounted) {
      loadLanguageList(filter);
    }
  }, [isComponentMounted, filter, reloadList]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

  return (
    <div>
      <BreadCrumb pageFor="Languages" listUrl="Languages" />
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
                    onClick={handleAddLanguage}
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
          handleClose={handleModalClose}
          size="md"
          modalTitle={modalTitle}
        >
          {modalTitle &&
            (modalTitle === "Add Language" ||
              modalTitle === "Edit Language") && (
              <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
                <Form.Label>Language Name  <Required /></Form.Label>
                <Form.Group className="search-field form-group">
                  <Form.Control
                    {...register("name")}
                    type="text"
                    placeholder="Language Name"
                    className="h-auto"
                  />
                  <p className="text-danger text-start">
                    {errors.name?.message}
                  </p>
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
          {modalTitle && modalTitle === "View Language" && viewLanguage && (
            <Table className="borderless">
              <tbody>
                <tr>
                  <td>
                    <h5>Language Name</h5>
                  </td>
                  <td>{viewLanguage.name}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </ModalCommon>
      )}
    </div>
  );
};

export default Language;
