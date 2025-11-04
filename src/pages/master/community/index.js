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
import {
  COMMUNITY_FILTER,
  COMMUNITY_URL,
  RELIGION_URL,
} from "core/services/apiURL.service";
import AsyncSelect from "react-select/async";
import Required from "components/common/required";

const validationSchema = Yup.object().shape({
  community: Yup.string().label("Community").required(),
  // parentCommunity: Yup.string().label('Sub community').required(),
  religion: Yup.string().label("Religion").required(),
});

const CommunityList = () => {
  const [pageFor] = useState("Community List");
  const [modalTitle, setModalTitle] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState(null);
  // const [communityList, setCommunityList] = useState([]);
  const [religion, setReligion] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const [modalShow, setModalShow] = useState(false);
  const toggleModal = () => {
    setModalShow(!modalShow);
    setSelectedCommunity(null);
  };

  const [reloadList, setReloadList] = useState(false);
  const toggleReloadList = () => setReloadList(!reloadList);

  const columns = [
    {
      name: "Community Name",
      selector: (row) => row.community,
    },
    {
      name: "Parent Community",
      selector: (row) =>
        row.parentCommunity ? row.parentCommunity?.community : " --- ",
    },
    {
      name: "Religion",
      selector: (row) => row.religion?.name,
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
      search: "",
      religionSearch: "",
    });
  };

  const onSubmitSearch = async (values) => {
    const { name, religionSearch } = values;

    if ((name || religionSearch) === "") {
      utils.showErrMsg("Atleast minimum field is required");
      return false;
    }
    setFilter({
      ...filter,
      search: name,
      religionSearch: religionSearch,
    });
  };

  const loadReligion = async () => {
    const listUrl = RELIGION_URL + "/filter";
    const payload = {
      skip: 0,
      limit: 25,
      sort: -1,
      sortBy: "updatedAt",
      filter: {},
    };
    const resp = await masterService.getAllPost(listUrl, payload);
    if (resp && resp.meta.code === 200 && resp.data.length > 0) {
      const { data } = resp;
      setReligion(data);
    }
  };

  const loadSubCommunityOptions = async (inputValue) =>
    new Promise(async (resolve) => {
      filter.search = inputValue;
      const resp = await masterService.getAllPost(COMMUNITY_FILTER, filter);
      let communityArr = [];
      if (resp && resp.meta.code === 200) {
        const { data: communityResp } = resp;
        communityArr = communityResp.map((ele) => ({
          label: ele.community,
          value: ele._id,
          ...ele,
        }));
      }
      resolve(communityArr);
    });

  const handleCommunityChange = (option) => {
    if (option) {
      setValue("parentCommunity", option._id, { shouldValidate: true });
      setSelectedCommunity({
        label: option?.community,
        value: option?._id,
      });
    } else {
      setValue("parentCommunity", "");
      setSelectedCommunity(null);
    }
  };

  // async function loadAllCommunity() {
  //   const listUrl = COMMUNITY_URL + "/filter";
  //   const payload = {
  //     skip: 0,
  //     limit: 25,
  //     filter: {},
  //   };
  //   const resp = await masterService.getAllPost(listUrl, payload);
  //   if (resp && resp.meta.code === 200 && resp.data.length > 0) {
  //     const { data } = resp;
  //     setCommunityList(data);
  //   }
  // }

  const createData = async (values) => {
    const { parentCommunity } = values;
    if (parentCommunity !== "") {
      values.parentCommunity = parentCommunity;
    } else {
      delete values.parentCommunity;
    }
    const resp = await masterService.create(COMMUNITY_URL, values);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_ADDED_SUCC);
      reset();
      toggleModal();
      toggleReloadList();
      setFilter({
        ...filter,
        filter: {},
      });
    }
  };

  const updateData = async (id, values) => {
    const { community, parentCommunity, religion } = values;
    const payload = {
      community: community ? community : undefined,
      parentCommunity: parentCommunity ? parentCommunity : null,
      religion: religion ? religion : undefined,
    };
    const resp = await masterService.update(COMMUNITY_URL + "/" + id, payload);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_UPDATED_SUCC);
      reset();
      toggleModal();
      toggleReloadList();
    } else {
      utils.showErrMsg(resp.meta.message);
    }
  };

  const loadDataById = async (id) => {
    const resp = await masterService.getById(COMMUNITY_URL + "/" + id);
    if (resp && resp.meta.code === 200) {
      return resp.data;
    }
    return false;
  };

  const handleAdd = () => {
    loadReligion();
    // loadAllCommunity();
    setModalTitle("Add");
    setData(null);
    reset();
    toggleModal();
  };

  const handleEdit = async (id) => {
    // loadAllCommunity();
    loadReligion();
    const resp = await loadDataById(id);
    if (resp) {
      setModalTitle("Edit");
      toggleModal();
      setData(resp);
      const { parentCommunity, community, religion } = resp;
      setValue("community", community, { shouldValidate: true });
      setValue("religion", religion?._id, { shouldValidate: true });
      if (parentCommunity) {
        setSelectedCommunity({
          label: parentCommunity?.community,
          value: parentCommunity?._id,
        });
        setValue("parentCommunity", parentCommunity?._id, {
          shouldValidate: true,
        });
      } else {
        setSelectedCommunity(null);
        setValue("parentCommunity", "");
      }
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
    const resp = await masterService.delete(COMMUNITY_URL + "/" + id);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_DELETED_SUCC);
      toggleReloadList();
    } else {
      utils.showErrMsg(resp.meta.message);
    }
  };

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    const loadList = async () => {
      setSpinner(true);
      const listUrl = COMMUNITY_URL + "/filter";
      const resp = await masterService.getAllPost(listUrl, filter);
      if (resp && resp.meta.code === 200) {
        const { data, pagination } = resp;
        setTotalRows(pagination.totalCount);
        setDataSource(data);
        setSpinner(false);
      }
    };
    if (isComponentMounted) {
      loadList(filter);
      loadReligion();
    }
  }, [filter, isComponentMounted, reloadList]);

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

  // const getCommunityName = (val) => {
  //   const resp = communityList.find((ele) => ele._id === val);
  //   return resp ? resp.community : "-";
  // };

  console.log("religions::", religion);

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
                        placeholder="Community"
                        size="md"
                        {...search("name")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <Form.Select
                        className="form-control"
                        {...search("religionSearch")}
                      >
                        <option value={""}>Select</option>
                        {religion.map((ele, ind) => (
                          <option key={ind} value={ele.name}>
                            {ele.name}
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
          modalTitle={modalTitle + " Community"}
        >
          {modalTitle && (modalTitle === "Add" || modalTitle === "Edit") && (
            <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
              <Form.Label>
                Religion <Required />
              </Form.Label>
              <Form.Group className="search-field form-group">
                <Form.Select {...register("religion")} className="form-control">
                  <option value="">Select</option>
                  {religion &&
                    religion.map((ele, ind) => (
                      <option key={ind} value={ele._id}>
                        {ele.name}
                      </option>
                    ))}
                </Form.Select>
                <p className="text-danger text-start">
                  {errors.religion?.message}
                </p>
              </Form.Group>
              <Form.Label>
                Community Name <Required />
              </Form.Label>
              <Form.Group className="search-field form-group">
                <Form.Control
                  {...register("community")}
                  type="text"
                  placeholder="Community Name"
                  className="h-auto"
                />
                <p className="text-danger text-start">
                  {errors.community?.message}
                </p>
              </Form.Group>
              <Form.Label>Sub Community Of</Form.Label>
              <Form.Group className="search-field form-group">
                <AsyncSelect
                  isClearable
                  defaultOptions
                  cacheOptions
                  loadOptions={loadSubCommunityOptions}
                  onChange={handleCommunityChange}
                  value={selectedCommunity}
                />
                {/* <Form.Select
                  {...register("parentCommunity")}
                  className="form-control"
                >
                  <option value="">Select</option>
                  {communityList &&
                    communityList.map((ele, ind) => (
                      <option key={ind} value={ele._id}>
                        {ele.community}
                      </option>
                    ))}
                </Form.Select> */}
                {/* <p className='text-danger text-start'>{errors.parentCommunity?.message}</p> */}
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
                    <h5>Community Name</h5>
                  </td>
                  <td>{data.community}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Sub Community</h5>
                  </td>
                  <td>
                    {data.parentCommunity
                      ? data.parentCommunity?.community
                      : " --- "}
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>Religion</h5>
                  </td>
                  <td>{data.religion?.name}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </ModalCommon>
      )}
    </div>
  );
};

export default CommunityList;
