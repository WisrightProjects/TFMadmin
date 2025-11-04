import { Card, Col, Form, Row, Table } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Actions from "components/actions";
import BreadCrumb from "components/common/breadcrumb";
import { commonService } from "core/services";
import { utils, CONST } from "core/helper";
import { OLD_SITE_USERS_FILTER } from "core/services/apiURL.service";
import { useSelector } from "react-redux";
import moment from "moment";
import { OLD_SITE_USERS_PATH_BY_ID } from "pages/routes/routes";

const OldSiteUsers = () => {
  const commonData = useSelector((state) => state?.common?.commonData);
  const [pageFor] = useState("Old Users");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_OLD_SITE_FILTER });
  const [dataSource, setDataSource] = useState([]);
  const [spinner, setSpinner] = useState(true);

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <Actions
          viewUrl={OLD_SITE_USERS_PATH_BY_ID + "/" + row._id}
          rowId={row._id}
        />
      ),
      ignoreRowClick: true,
      grow: 1,
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
    },
    {
      name: "Date Of Birth",
      selector: (row) => row.dob,
    },
    {
      name: "Matri ID",
      selector: (row) => row.matriid,
    },
    {
      name: "Login ID",
      selector: (row) => row.loginid,
    },
    {
      name: "Marital Status",
      selector: (row) => row.maritalstatus,
    },
    {
      name: "Email",
      selector: (row) => row.email1,
    },
    {
      name: "Email - 2",
      selector: (row) => (row.email2 ? row.email2 : " - "),
    },
    {
      name: "Mobile",
      selector: (row) => (row.mobile1 ? row.mobile1 : " - "),
    },
    {
      name: "Mobile - 2",
      selector: (row) => (row.mobile2 ? row.mobile2 : " - "),
    },
    {
      name: "Mobile - 3",
      selector: (row) => (row.mobile3 ? row.mobile3 : " - "),
    },
    {
      name: "Caste",
      selector: (row) => row.caste,
    },
    {
      name: "Religion",
      selector: (row) => row.religion,
    },
    {
      name: "Mother Tounge",
      selector: (row) => row.mothertongue,
    },
    {
      name: "Native",
      selector: (row) => row.native,
    },
    {
      name: "Denomination",
      selector: (row) => row.denomination,
    },
    {
      name: "Complexion",
      selector: (row) => row.complexion,
    },
    {
      name: "Height",
      selector: (row) => (row.height ? row.height : " - "),
    },
    {
      name: "Weight",
      selector: (row) => (row.weight ? row.weight : " - "),
    },
    {
      name: "Physical Status",
      selector: (row) => (row.physicalstatus ? row.physicalstatus : " - "),
    },
    {
      name: "Physical Details",
      selector: (row) => (row.physicaldetails ? row.physicaldetails : " - "),
    },
    {
      name: "Education",
      selector: (row) => (row.education ? row.education : " - "),
    },
    {
      name: "Occupation",
      selector: (row) => (row.occupation ? row.occupation : " - "),
    },
    {
      name: "Income",
      selector: (row) => (row.income ? row.income : " - "),
    },
    {
      name: "Organization",
      selector: (row) => (row.organization ? row.organization : " - "),
    },
    {
      name: "Organi Place",
      selector: (row) => (row.organiplace ? row.organiplace : " - "),
    },
    {
      name: "Organi Phone",
      selector: (row) => (row.organiphone ? row.organiphone : " - "),
    },
    {
      name: "Eat Habit",
      selector: (row) => (row.eathabit ? row.eathabit : " - "),
    },
    {
      name: "Smoke Habit",
      selector: (row) => (row.smokehabit ? row.smokehabit : " - "),
    },
    {
      name: "Drink Habit",
      selector: (row) => (row.drinkhabit ? row.drinkhabit : " - "),
    },
    {
      name: "Interest",
      selector: (row) => (row.interest ? row.interest : " - "),
    },
    {
      name: "Hobbies",
      selector: (row) => (row.hobbies ? row.hobbies : " - "),
    },
    {
      name: "About",
      selector: (row) => (row.about ? row.about : " - "),
    },
    {
      name: "Wear Jewels",
      selector: (row) => (row.wearjewels ? row.wearjewels : " - "),
    },
    {
      name: "Father Name",
      selector: (row) => (row.fathername ? row.fathername : " - "),
    },
    {
      name: "Father Occupation",
      selector: (row) => (row.fatheroccupation ? row.fatheroccupation : " - "),
    },
    {
      name: "Father Status",
      selector: (row) => (row.fatherstatus ? row.fatherstatus : " - "),
    },
    {
      name: "Mother Name",
      selector: (row) => (row.mothername ? row.mothername : " - "),
    },
    {
      name: "Mother Occupation",
      selector: (row) => (row.motheroccupation ? row.motheroccupation : " - "),
    },
    {
      name: "Mother Status",
      selector: (row) => (row.motherstatus ? row.motherstatus : " - "),
    },
    {
      name: "Brother Married",
      selector: (row) => (row.brothermarried ? row.brothermarried : " - "),
    },
    {
      name: "Brother Un-married",
      selector: (row) => (row.brotherunmarried ? row.brotherunmarried : " - "),
    },
    {
      name: "Sister Married",
      selector: (row) => (row.sistermarried ? row.sistermarried : " - "),
    },
    {
      name: "Sister Un-married",
      selector: (row) => (row.sisterunmarried ? row.sisterunmarried : " - "),
    },
    {
      name: "Family Status",
      selector: (row) => (row.familystatus ? row.familystatus : " - "),
    },
    {
      name: "Family Type",
      selector: (row) => (row.familytype ? row.familytype : " - "),
    },
    {
      name: "Intercaste Status",
      selector: (row) => (row.intercastestatus ? row.intercastestatus : " - "),
    },
    {
      name: "Intercaste Expectation",
      selector: (row) =>
        row.intercasteexpectation ? row.intercasteexpectation : " - ",
    },
    {
      name: "Intercaste Exclude",
      selector: (row) =>
        row.intercasteexclude ? row.intercasteexclude : " - ",
    },
    {
      name: "Inter Religion",
      selector: (row) => (row.interreligion ? row.interreligion : " - "),
    },
    {
      name: "Inter Denomination",
      selector: (row) =>
        row.interdenomination ? row.interdenomination : " - ",
    },
    {
      name: "Interdenom Expecatation",
      selector: (row) =>
        row.interdenomexpectation ? row.interdenomexpectation : " - ",
    },
    {
      name: "Interdenom Exclude",
      selector: (row) =>
        row.interdenomexclude ? row.interdenomexclude : " - ",
    },
    {
      name: "Age From",
      selector: (row) => (row.agefrom ? row.agefrom : " - "),
    },
    {
      name: "Age To",
      selector: (row) => (row.ageto ? row.ageto : " - "),
    },
    {
      name: "Height From",
      selector: (row) => (row.heightfrom ? row.heightfrom : " - "),
    },
    {
      name: "Height To",
      selector: (row) => (row.heightto ? row.heightto : " - "),
    },
    {
      name: "Parter Qualification",
      selector: (row) =>
        row.parterqualification ? row.parterqualification : " - ",
    },
    {
      name: "Parter Occupation",
      selector: (row) =>
        row.partneroccupation ? row.partneroccupation : " - ",
    },
    {
      name: "Parter Religion",
      selector: (row) => (row.partnerregion ? row.partnerregion : " - "),
    },
    {
      name: "Parter Wear Jewels",
      selector: (row) => (row.partnerwearjewel ? row.partnerwearjewel : " - "),
    },
    {
      name: "Parter Complexion",
      selector: (row) =>
        row.partnercomplexion ? row.partnercomplexion : " - ",
    },
    {
      name: "Parter Language",
      selector: (row) => (row.partnerlanguage ? row.partnerlanguage : " - "),
    },
    {
      name: "Special Expectation",
      selector: (row) =>
        row.specialexpectation ? row.specialexpectation : " - ",
    },
    {
      name: "Willtomarry",
      selector: (row) => (row.willtomarry ? row.willtomarry : " - "),
    },
    {
      name: "Show Photo",
      selector: (row) => (row.showphoto ? row.showphoto : " - "),
    },
    {
      name: "Profile Picture",
      selector: (row) => (row.profilepic ? row.profilepic : " - "),
    },
    {
      name: "Birth Certificate",
      selector: (row) => (row.birthcertificate ? row.birthcertificate : " - "),
    },
    {
      name: "Address Proof",
      selector: (row) => (row.addressproof ? row.addressproof : " - "),
    },
    {
      name: "Death Certificate",
      selector: (row) => (row.deathcertificate ? row.deathcertificate : " - "),
    },
    {
      name: "Divorce Certificate",
      selector: (row) =>
        row.divorcecertificate ? row.divorcecertificate : " - ",
    },
    {
      name: "Education Certificate",
      selector: (row) => (row.educertificate ? row.educertificate : " - "),
    },
    {
      name: "Video File",
      selector: (row) => (row.videofile ? row.videofile : " - "),
    },
    {
      name: "Audio File",
      selector: (row) => (row.audiofile ? row.audiofile : " - "),
    },
    {
      name: "Branch Name",
      selector: (row) => (row.branchname ? row.branchname : " - "),
    },
    {
      name: "Branch ID",
      selector: (row) => (row.branchid ? row.branchid : " - "),
    },
    {
      name: "Paymode",
      selector: (row) => (row.paymode ? row.paymode : " - "),
    },
    {
      name: "Created By",
      selector: (row) => (row.createdby ? row.createdby : " - "),
    },
    {
      name: "Modified By",
      selector: (row) => (row.modifyby ? row.modifyby : " - "),
    },
    {
      name: "MV Code",
      selector: (row) => (row.mvcode ? row.mvcode : " - "),
    },
    {
      name: "EV Code",
      selector: (row) => (row.evcode ? row.evcode : " - "),
    },
    {
      name: "M verify",
      selector: (row) => (row.mverify ? row.mverify : " - "),
    },
    {
      name: "E verify",
      selector: (row) => (row.everify ? row.everify : " - "),
    },
    {
      name: "Api Login",
      selector: (row) => (row.apilogin ? row.apilogin : " - "),
    },
    {
      name: "Pass Reset Code",
      selector: (row) => (row.passresetcode ? row.passresetcode : " - "),
    },
    {
      name: "Last Login",
      selector: (row) => (row.lastlogin ? formatDate(row.lastlogin) : " - "),
    },
    {
      name: "Profile Status",
      selector: (row) => (row.profilestatus ? row.profilestatus : " - "),
    },
    {
      name: "Last Tip",
      selector: (row) => (row.lastip ? row.lastip : " - "),
    },
    {
      name: "IP",
      selector: (row) => (row.ip ? row.ip : " - "),
    },
    {
      name: "Client",
      selector: (row) => (row.client ? row.client : " - "),
    },
    {
      name: "Last Client",
      selector: (row) => (row.lastclient ? row.lastclient : " - "),
    },
    {
      name: "Edit On Client",
      selector: (row) => (row.editon ? formatDate(row.editon) : " - "),
    },
    {
      name: "Edit IP",
      selector: (row) => (row.editip ? row.editip : " - "),
    },
    {
      name: "Edit Client",
      selector: (row) => (row.editclient ? row.editclient : " - "),
    },
    {
      name: "Active Plan",
      selector: (row) => (row.activeplan ? row.activeplan : " - "),
    },
    {
      name: "Total Contacts",
      selector: (row) => (row.totalcontacts ? row.totalcontacts : " - "),
    },
    {
      name: "Viewed Contacts",
      selector: (row) => (row.viewedcontacts ? row.viewedcontacts : " - "),
    },
    {
      name: "Expire On",
      selector: (row) => (row.expireon ? formatDate(row.expireon) : " - "),
    },
    {
      name: "Register Form",
      selector: (row) => (row.registerfrom ? row.registerfrom : " - "),
    },
    {
      name: "Status",
      selector: (row) => (row.status ? row.status : " - "),
    },
    {
      name: "Created At",
      selector: (row) =>
        row.createdAt ? moment(row.createdAt).format() : " - ",
    },
    {
      name: "Updated At",
      selector: (row) =>
        row.updatedAt ? moment(row.updatedAt).format() : " - ",
    },
    {
      name: "Address",
      selector: (row) => (row.address ? row.address : " - "),
    },
    {
      name: "City",
      selector: (row) => (row.city ? row.city : " - "),
    },
    {
      name: "State",
      selector: (row) => (row.state ? row.state : " - "),
    },
    {
      name: "Country",
      selector: (row) => (row.country ? row.country : " - "),
    },
    {
      name: "Pincode",
      selector: (row) => (row.pincode ? row.pincode : " - "),
    },
    {
      name: "Mobile Code",
      selector: (row) => (row.mobcode ? row.mobcode : " - "),
    },
  ];

  const formatDate = (date) => {
    // console.log("date::", date);
    const [lastDate, month, year] = date?.split("/");
    // console.log("lastDate::", lastDate);
    // console.log("time::", month);
    // console.log("year::", year.split(" "));
    // const [yearSplit] = year?.split(" ");
    // console.log("yearSplit::", yearSplit);
    const getFormatDate = [lastDate, month, year]?.join("/");
    // console.log("getFormatDate::", getFormatDate);
    return getFormatDate;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm();

  const onSubmitSearch = async (values) => {
    const { key, value } = values;
    if (key === "") {
      utils.showErrMsg("Select the dropdown field");
      return false;
    }
    if (value === "") {
      utils.showErrMsg("Please enter the value");
      return false;
    }
    const search = {};
    if (key !== "") {
      search.key = key;
    }
    if (value !== "") {
      search.value = value;
    }

    setFilter({
      ...filter,
      search: search,
    });
  };

  const searchReset = () => {
    reset();
    setFilter({ ...filter, search: undefined });
  };

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    async function loadPaymentList(filter) {
      setSpinner(true);
      const resp = await commonService.filter(OLD_SITE_USERS_FILTER, filter);
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
                    <Form.Select className="form-control" {...register("key")}>
                      <option value={""}>Select</option>
                      {commonData?.oldSiteUsersKeys?.map((ele, ind) => (
                        <option key={ind} value={ele.code}>
                          {ele.code}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Enter value"
                        size="md"
                        {...register("value")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
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
                  </Col>
                </Row>
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
    </div>
  );
};

export default OldSiteUsers;
