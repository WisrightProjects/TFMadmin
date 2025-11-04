import { Card, Col, Row } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { useEffect, useState } from "react";
import { masterService } from "core/services";
import Actions from "components/actions";
import { EDIT_PROFILE, IMAGE_APPROVALS_PATH } from "pages/routes/routes";
import BreadCrumb from "components/common/breadcrumb";
import { Form } from "react-bootstrap";
import { IMAGE_APPROVAL_FILTER, USER_URL } from "core/services/apiURL.service";
import { CONST, utils } from "core/helper";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const ImageApprovals = () => {
  const commonData = useSelector((state) => state?.common?.commonData);
  const columns = [
    {
      name: "Profile ID",
      selector: (row) => row.profileID,
    },

    {
      name: "Username",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Status",
      selector: (row) => {
        const { approvalStatus } = row;
        const { imageApprovalStatus } = commonData;
        const data = imageApprovalStatus
          ? imageApprovalStatus?.find((ele) => ele.code === approvalStatus)
          : {};
        let class_name = "";
        switch (data.code) {
          case 10:
            class_name = "btn-primary";
            break;
          case 20:
            class_name = "btn-success";
            break;
          case 30:
            class_name = "btn-danger";
            break;

          default:
            class_name = "btn-primary";
            break;
        }
        return (
          <span className={`badge ${class_name} badge-sm rounded`}>
            {data.label}
          </span>
        );
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <Actions
          viewUrl={EDIT_PROFILE + "/" + row.profileID + "?key=photos"}
          rowId={row.profileID}
        />
      ),
      ignoreRowClick: true,
      grow: 1,
    },
  ];

  const [pageFor] = useState("Image Approvals");
  const [dataSource, setDataSource] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [filter, setFilter] = useState({
    ...CONST.DEFAULT_ADV_FILTER,
  });

  const [spinner, setSpinner] = useState(true);

  const {
    register: search,
    handleSubmit: searchHandleSubmit,
    reset: searchFromReset,
    formState: { isSubmitting: searchIsSubmitting, isDirty },
  } = useForm();

  const searchReset = () => {
    searchFromReset();
    setFilter({
      ...filter,
      filter: {},
      search: "",
    });
  };

  const onSubmitSearch = async (values) => {
    const { email, name, profileID } = values;
    if ((email || profileID || name) === "") {
      utils.showErrMsg("Atleast minimum field is required");
      return false;
    }

    const filterObj = {};
    if (email !== "") {
      filterObj.email = email;
    }
    if (profileID !== "") {
      filterObj.profileID = profileID;
    }
    if (name !== "") {
      filterObj.name = name;
    }
    // if (status !== "") {
    //   filterObj.status = Number(status);
    // }
    // if (status === "All") {
    //   delete filterObj.status;
    //   setFilter({
    //     ...filter,
    //     filter: filterObj,
    //   });
    // }

    setFilter({
      ...filter,
      filter: filterObj,
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

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    const loadList = async (filter) => {
      setSpinner(true);
      const resp = await masterService.getAllPost(
        IMAGE_APPROVAL_FILTER,
        filter
      );
      if (resp && resp.meta.code === 200) {
        const { data, pagination } = resp;
        setTotalRows(data.length > 0 ? pagination.totalCount : 0);
        setDataSource(data.length > 0 ? data : []);
        setSpinner(false);
      } else {
        setDataSource([]);
        setSpinner(false);
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
              <Form
                className="forms-sample"
                onSubmit={searchHandleSubmit(onSubmitSearch)}
              >
                <Row>
                  <Col md={2}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Profile ID"
                        size="md"
                        {...search("profileID")}
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
                  {/* <Col md={2}>
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
                  </Col> */}
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
    </div>
  );
};

export default ImageApprovals;
