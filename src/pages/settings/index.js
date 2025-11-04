import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { commonService, usersService } from "core/services";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { utils } from "core/helper";
import { DASH_PATH } from "pages/routes/routes";
import Required from "components/common/required";

const PHONE_REGEX =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const validationSchema = Yup.object().shape({
  name: Yup.string().label("Site name").required(),
  metaTitle: Yup.string().label("Meta title").required(),
  metaDescription: Yup.string().label("Meta Description").required(),
  supportEmail: Yup.string().label("Support Email").required(),
  contactNo: Yup.string()
    .matches(PHONE_REGEX, "Contact Number is not valid")
    .label("Contact number")
    .required(),
  playStore: Yup.string().label("Play store url").required(),
  appStore: Yup.string().label("App store link").required(),
  social: Yup.object().shape({
    facebook: Yup.string().label("Facebook").required(),
    youtube: Yup.string().label("Youtube").required(),
    twitter: Yup.string().label("Twitter").required(),
    instagram: Yup.string().label("Instagram").required(),
  }),
});

const Settings = () => {
  const [val, setVal] = useState("");
  const navigate = useNavigate();
  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { errors, isSubmitting } = formState;

  const onSubmit = async (values) => {
    Object.keys(values).forEach(
      (ele) => values[ele] === "" && delete values[ele]
    );
    Object.keys(values.social).forEach(
      (ele) => values?.social[ele] === "" && delete values?.social[ele]
    );
    const resp = await usersService.updateSettings(values);
    if (resp && resp?.meta?.code === 200) {
      utils.showSuccessMsg(resp?.meta?.message);
      navigate(DASH_PATH);
    }
  };

  const setFormValues = (data) => {
    if (data) {
      const fields = [
        "name",
        "metaTitle",
        "metaDescription",
        "supportEmail",
        "contactNo",
        "facebook",
        "instagram",
        "twitter",
        "youtube",
        "officeAddress",
        "playStore",
        "appStore",
      ];
      fields.forEach((field) => {
        console.log("field", field);
        console.log("data", data);
        console.log("data[field]", data[field]);
        setValue(field, data[field], { shouldValidate: true });
      });
      setValue("social", {
        facebook: data.social?.facebook,
        instagram: data.social?.instagram,
        twitter: data.social?.twitter,
        youtube: data.social?.youtube,
      });
      setVal(data?.contactNo);
    }
  };

  const handleChange = (e) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setVal(e.target.value);
      setValue("contactNo", e.target.value);
    }
  };

  useEffect(() => {
    async function loadSettings() {
      const settings = await commonService.getSetting();
      setFormValues(settings?.data);
    }
    loadSettings();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">Settings</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Settings
            </li>
          </ol>
        </nav>
      </div>
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
                <Row>
                  <Col xl={6}>
                    <Form.Label>
                      Site Name <Required />
                    </Form.Label>
                    <Form.Group className="search-field form-group">
                      <Form.Control
                        {...register("name")}
                        type="text"
                        placeholder="Site Name"
                        className="h-auto"
                      />
                      <p className="text-danger text-start">
                        {errors.name?.message}
                      </p>
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Label>
                      Meta Title <Required />
                    </Form.Label>
                    <Form.Group className="search-field form-group">
                      <Form.Control
                        {...register("metaTitle")}
                        type="text"
                        placeholder="Meta Title"
                        className="h-auto"
                      />
                      <p className="text-danger text-start">
                        {errors.metaTitle?.message}
                      </p>
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Label>
                      Support Email <Required />
                    </Form.Label>
                    <Form.Group className="search-field form-group">
                      <Form.Control
                        {...register("supportEmail")}
                        type="email"
                        placeholder="Support Email"
                        className="h-auto"
                      />
                      <p className="text-danger text-start">
                        {errors.supportEmail?.message}
                      </p>
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Label>
                      Contact Number <Required />
                    </Form.Label>
                    <Form.Group className="search-field form-group">
                      <Form.Control
                        {...register("contactNo")}
                        type="text"
                        placeholder="Contact Number"
                        className="h-auto "
                        maxLength={10}
                        pattern="[0-9]*"
                        value={val}
                        onChange={handleChange}
                      />
                      <p className="text-danger text-start">
                        {errors.contactNo?.message}
                      </p>
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Label>Play Store</Form.Label>
                    <Form.Group className="search-field form-group">
                      <Form.Control
                        {...register("playStore")}
                        type="url"
                        placeholder="Play Store Url"
                        className="h-auto"
                      />
                      <p className="text-danger text-start">
                        {errors.playStore?.message}
                      </p>
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Label>App Store</Form.Label>
                    <Form.Group className="search-field form-group">
                      <Form.Control
                        {...register("appStore")}
                        type="url"
                        placeholder="App Store Url"
                        className="h-auto"
                      />
                      <p className="text-danger text-start">
                        {errors.appStore?.message}
                      </p>
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Label>Facebook</Form.Label>
                    <Form.Group className="search-field form-group">
                      <Form.Control
                        {...register("social.facebook")}
                        type="url"
                        placeholder="Facebook Url"
                        className="h-auto"
                      />
                      <p className="text-danger text-start">
                        {errors.social?.facebook?.message}
                      </p>
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Label>Instagram</Form.Label>
                    <Form.Group className="search-field form-group">
                      <Form.Control
                        {...register("social.instagram")}
                        type="url"
                        placeholder="Instagram Url"
                        className="h-auto"
                      />
                      <p className="text-danger text-start">
                        {errors.social?.instagram?.message}
                      </p>
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Label>Twitter</Form.Label>
                    <Form.Group className="search-field form-group">
                      <Form.Control
                        {...register("social.twitter")}
                        type="url"
                        placeholder="Whatsapp Url"
                        className="h-auto"
                      />
                      <p className="text-danger text-start">
                        {errors.social?.twitter?.message}
                      </p>
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Label>Youtube</Form.Label>
                    <Form.Group className="search-field form-group">
                      <Form.Control
                        {...register("social.youtube")}
                        type="url"
                        placeholder="Whatsapp Url"
                        className="h-auto"
                      />
                      <p className="text-danger text-start">
                        {errors.social?.youtube?.message}
                      </p>
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Label>
                      Office Address <Required />
                    </Form.Label>
                    <Form.Group className="search-field form-group">
                      <Form.Control
                        {...register("officeAddress")}
                        as="textarea"
                        placeholder="Office Address"
                        className="h-auto"
                        rows="15"
                      />
                      <p className="text-danger text-start">
                        {errors.officeAddress?.message}
                      </p>
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Label>
                      Meta Description <Required />
                    </Form.Label>
                    <Form.Group className="search-field form-group">
                      <Form.Control
                        {...register("metaDescription")}
                        as="textarea"
                        placeholder="Meta Description"
                        className="h-auto"
                        rows="15"
                      />
                      <p className="text-danger text-start">
                        {errors.metaDescription?.message}
                      </p>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-3">
                  <Button
                    disabled={isSubmitting}
                    className="btn btn-primary btn-sm font-weight-medium auth-form-btn"
                    type="submit"
                  >
                    Submit
                  </Button>
                  <Link to={DASH_PATH} className="btn btn-danger btn-sm">
                    Close
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
