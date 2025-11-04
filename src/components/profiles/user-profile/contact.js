import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { CONST, utils } from "core/helper";
import { usersService } from "core/services";
import { Col, Form, Row, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";

const validationSchema = Yup.object().shape({
  contactDetails: Yup.object().shape({
    nameOfContact: Yup.string()
      .matches(CONST.NAME_REGEX, CONST.MSG.INVALID_NAME)
      // .min(3, CONST.MSG.MIN_CHAR)
      .max(25, CONST.MSG.MAX_CHAR),
    relationMember: Yup.string(),
    timeToCall: Yup.object().shape({
      fromTime: Yup.string(),
      fromValue: Yup.string(),
      toTime: Yup.string(),
      toValue: Yup.string(),
    }),
    contactDisplay: Yup.string().nullable(),
    contact: Yup.string(),
  }),
});

const Contact = (props) => {
  const { profile, profileID } = props;
  const [userMobileVal, setUserMobileVal] = useState("");
  const commonData = useSelector((state) => state.common?.commonData);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  
  useEffect(() => {
    setFormValues(profile?.contactDetails);
  }, [profile]);

  const setFormValues = (contactDetails) => {
    if (contactDetails) {
      const {
        nameOfContact,
        contact,
        relationMember,
        timeToCall,
        contactDisplay,
      } = contactDetails;

      setValue("contactDetails", {
        nameOfContact,
        contact,
        relationMember,
        contactDisplay: contactDisplay?.toString(),
        timeToCall,
      });
      setUserMobileVal(contact);
    }
  };

  const handleContactNumberChange = (e) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setUserMobileVal(e.target.value);
      setValue("contactDetails.contact", e.target.value);
    }
  };

  const payloadValCheck = (key) => {
    Object.keys(key).map((val) => {
      if (key[val] === undefined || key[val] === null || key[val] === "") {
        delete key[val];
      }
    });
  };

  const onContactSubmit = async (values) => {
    payloadValCheck(values.contactDetails);
    const resp = await usersService.updateUser(
      { contactDetails: values.contactDetails },
      profileID
    );
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
    }
  };

  return (
    <Tab.Pane eventKey={"contact"}>
      <Form onSubmit={handleSubmit(onContactSubmit)}>
        <Row className="form-group">
          <Col xl={3} md={3} lg={4}>
            <Form.Label>Name</Form.Label>
          </Col>
          <Col xl={6} md={6} lg={4}>
            <Form.Control
              type="text"
              {...register("contactDetails.nameOfContact")}
              maxLength={25}
            />
            <span className="text-danger">
              {errors?.contactDetails?.nameOfContact?.message}
            </span>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={3} md={3} lg={4}>
            <Form.Label>Relationship with member</Form.Label>
          </Col>
          <Col xl={6} md={6} lg={4}>
            <Form.Select
              {...register("contactDetails.relationMember")}
              className="form-control"
            >
              <option value="">Select</option>
              {commonData &&
                commonData?.relationMember &&
                commonData?.relationMember.map((ele, ind) => (
                  <option value={ele.code} key={ind}>
                    {ele.label}
                  </option>
                ))}
            </Form.Select>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={3} md={3} lg={4}>
            <Form.Label>Convenient time to call</Form.Label>
          </Col>
          <Col xl={6} md={6} lg={4}>
            <Row>
              <Col xl={3}>
                <Form.Select
                  {...register("contactDetails.timeToCall.fromTime")}
                  className="form-control"
                >
                  <option value="">Select</option>
                  {commonData &&
                    commonData.time &&
                    commonData.time.map((ele, ind) => (
                      <option value={ele.code} key={ind}>
                        {ele.label}
                      </option>
                    ))}
                </Form.Select>
              </Col>
              <Col xl={3}>
                <Form.Select
                  {...register("contactDetails.timeToCall.fromValue")}
                  className="form-control"
                >
                  <option value="">Select</option>
                  {commonData &&
                    commonData.timeType &&
                    commonData.timeType.map((ele, ind) => (
                      <option value={ele.code} key={ind}>
                        {ele.label}
                      </option>
                    ))}
                </Form.Select>
              </Col>
              <Col xl={3}>
                <Form.Select
                  {...register("contactDetails.timeToCall.toTime")}
                  className="form-control"
                >
                  <option value="">Select</option>
                  {commonData &&
                    commonData.time &&
                    commonData.time.map((ele, ind) => (
                      <option value={ele.code} key={ind}>
                        {ele.label}
                      </option>
                    ))}
                </Form.Select>
              </Col>
              <Col xl={3}>
                <Form.Select
                  {...register("contactDetails.timeToCall.toValue")}
                  className="form-control"
                >
                  <option value="">Select</option>
                  {commonData &&
                    commonData.timeType &&
                    commonData.timeType.map((ele, ind) => (
                      <option value={ele.code} key={ind}>
                        {ele.label}
                      </option>
                    ))}
                </Form.Select>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={3} md={3} lg={4}>
            <Form.Label>Contact</Form.Label>
          </Col>
          <Col xl={6} md={6} lg={4}>
            <Form.Control
              type="text"
              {...register("contactDetails.contact")}
              maxLength={10}
              pattern="[0-9]*"
              value={userMobileVal}
              onChange={handleContactNumberChange}
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={3} md={3} lg={4}>
            <Form.Label>Contact Display</Form.Label>
          </Col>
          <Col xl={6} md={6} lg={4}>
            {commonData &&
              commonData.contactDisplayType &&
              commonData.contactDisplayType.map((ele, ind) => (
                <Form.Check key={ind}>
                  <Form.Check.Label>
                    <Form.Check.Input
                      type="radio"
                      {...register("contactDetails.contactDisplay")}
                      value={ele.code}
                    />
                    <i className="input-helper"></i>
                    {ele.label}
                  </Form.Check.Label>
                </Form.Check>
              ))}
          </Col>
        </Row>
        <button
          disabled={isSubmitting}
          type="submit"
          className="btn btn-rounded btn-success"
        >
          Submit
        </button>
      </Form>
    </Tab.Pane>
  );
};

export default Contact;
