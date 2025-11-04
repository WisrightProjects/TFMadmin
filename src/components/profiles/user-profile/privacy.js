import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { utils } from "core/helper";
import { usersService } from "core/services";
import { Col, Form, Row, Tab } from "react-bootstrap";
import { useEffect } from "react";

const validateSchema = Yup.object().shape({
  privacyOption: Yup.object().shape({
    displayName: Yup.string(),
    phone: Yup.string().nullable(),
    email: Yup.string().nullable(),
    photo: Yup.string().nullable(),
    dateOfBirth: Yup.string().nullable(),
    annuelIncome: Yup.string().nullable(),
    visitorSetting: Yup.string().nullable(),
    profilePrivacy: Yup.string().nullable(),
  }),
});

const Privacy = (props) => {
  const { profile, profileID } = props;
  const commonData = useSelector((state) => state.common?.commonData);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(validateSchema),
  });

  const setFormValues = (privacy) => {
    if (privacy) {
      const {
        annuelIncome,
        displayName,
        phone,
        photo,
        email,
        dateOfBirth,
        visitorSetting,
        profilePrivacy,
      } = privacy;
      setValue("privacyOption", {
        annuelIncome: annuelIncome?.toString(),
        displayName: displayName,
        phone: phone?.toString(),
        email: email?.toString(),
        photo: photo?.toString(),
        dateOfBirth: dateOfBirth?.toString(),
        visitorSetting: visitorSetting?.toString(),
        profilePrivacy: profilePrivacy?.toString(),
      });
    }
  };

  useEffect(() => {
    setFormValues(profile?.privacyOption);
  }, [profile]);

  const payloadValCheck = (key) => {
    Object.keys(key).map((val) => {
      if (key[val] === undefined || key[val] === null || key[val] === "") {
        delete key[val];
      }
    });
  };

  const onSubmit = async (values) => {
    // return false
    payloadValCheck(values.privacyOption);
    const resp = await usersService.updateUser(
      { privacyOption: values.privacyOption },
      profileID
    );
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
    }
  };

  return (
    <Tab.Pane eventKey={"privacy"}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="form-group">
          <Col xl={2} md={3} lg={4}>
            <Form.Label>Display Name</Form.Label>
          </Col>
          <Col xl={6} md={6} lg={4}>
            <Form.Control
              type="text"
              {...register("privacyOption.displayName")}
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={2} md={3} lg={4}>
            <Form.Label>Phone</Form.Label>
          </Col>
          <Col xl={6} md={6} lg={4}>
            {commonData &&
              commonData.contactDisplayType &&
              commonData.contactDisplayType.map((ele, ind) => (
                <Form.Check key={ind}>
                  <Form.Check.Label>
                    <Form.Check.Input
                      type="radio"
                      {...register("privacyOption.phone")}
                      value={ele.code}
                    />
                    <i className="input-helper"></i>
                    {ele.label}
                  </Form.Check.Label>
                </Form.Check>
              ))}
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={2} md={3} lg={4}>
            <Form.Label>Email</Form.Label>
          </Col>
          <Col xl={6} md={6} lg={4}>
            {commonData &&
              commonData.privacyEmailSetting &&
              commonData.privacyEmailSetting.map((ele, ind) => (
                <Form.Check key={ind}>
                  <Form.Check.Label>
                    <Form.Check.Input
                      type="radio"
                      {...register("privacyOption.email")}
                      value={ele.code}
                    />
                    <i className="input-helper"></i>
                    {ele.label}
                  </Form.Check.Label>
                </Form.Check>
              ))}
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={2} md={3} lg={4}>
            <Form.Label>Photo</Form.Label>
          </Col>
          <Col xl={6} md={6} lg={4}>
            {commonData &&
              commonData.privacyPhotoSetting &&
              commonData.privacyPhotoSetting.map((ele, ind) => (
                <Form.Check key={ind}>
                  <Form.Check.Label>
                    <Form.Check.Input
                      type="radio"
                      {...register("privacyOption.photo")}
                      value={ele.code}
                    />
                    <i className="input-helper"></i>
                    {ele.label}
                  </Form.Check.Label>
                </Form.Check>
              ))}
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={2} md={3} lg={4}>
            <Form.Label>Date Of Birth</Form.Label>
          </Col>
          <Col xl={6} md={6} lg={4}>
            {commonData &&
              commonData.dateOfBirth &&
              commonData.dateOfBirth.map((ele, ind) => (
                <Form.Check key={ind}>
                  <Form.Check.Label>
                    <Form.Check.Input
                      type="radio"
                      {...register("privacyOption.dateOfBirth")}
                      value={ele.code}
                    />
                    <i className="input-helper"></i>
                    {ele.label}
                  </Form.Check.Label>
                </Form.Check>
              ))}
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={2} md={3} lg={4}>
            <Form.Label>Annual Income</Form.Label>
          </Col>
          <Col xl={6} md={6} lg={4}>
            {commonData &&
              commonData.annuelIncome &&
              commonData.annuelIncome.map((ele, ind) => (
                <Form.Check key={ind}>
                  <Form.Check.Label>
                    <Form.Check.Input
                      type="radio"
                      {...register("privacyOption.annuelIncome")}
                      value={ele.code}
                    />
                    <i className="input-helper"></i>
                    {ele.label}
                  </Form.Check.Label>
                </Form.Check>
              ))}
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={2} md={3} lg={4}>
            <Form.Label>Visitor Setting</Form.Label>
          </Col>
          <Col xl={6} md={6} lg={4}>
            {commonData &&
              commonData.visitorSetting &&
              commonData.visitorSetting.map((ele, ind) => (
                <Form.Check key={ind}>
                  <Form.Check.Label>
                    <Form.Check.Input
                      type="radio"
                      {...register("privacyOption.visitorSetting")}
                      value={ele.code}
                    />
                    <i className="input-helper"></i>
                    {ele.label}
                  </Form.Check.Label>
                </Form.Check>
              ))}
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={2} md={3} lg={4}>
            <Form.Label>Profile Privacy</Form.Label>
          </Col>
          <Col xl={6} md={6} lg={4}>
            {commonData &&
              commonData.profilePrivacy &&
              commonData.profilePrivacy.map((ele, ind) => (
                <Form.Check key={ind}>
                  <Form.Check.Label>
                    <Form.Check.Input
                      type="radio"
                      {...register("privacyOption.profilePrivacy")}
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

export default Privacy;
