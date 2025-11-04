import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { utils } from "core/helper";
import { usersService } from "core/services";
import { Col, Form, Row, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";

const validationSchema = Yup.object().shape({
  family: Yup.object().shape({
    fatherName: Yup.string(),
    motherName: Yup.string(),
    fatherBusiness: Yup.string(),
    motherBusiness: Yup.string(),
    location: Yup.string(),
    nativePlace: Yup.string(),
    sibling: Yup.object().shape({
      noOfMale: Yup.string(),
      noOfFemale: Yup.string(),
      noOfMaleMarried: Yup.string(),
      noOfFemaleMarried: Yup.string(),
    }),
    familyType: Yup.string().nullable(),
    familyValue: Yup.string().nullable(),
    familyAffluence: Yup.string(),
  }),
});

const Family = (props) => {
  const { profile, profileID } = props;
  const commonData = useSelector((state) => state.common?.commonData);
  const [fatherBusiness, setFatherBusiness] = useState("");
  const [motherBusiness, setMotherBusiness] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const setFormValues = (family) => {    
    if (family && Object.keys(family).length > 0) {
      const {
        fatherName,
        motherName,
        motherBusiness,
        fatherBusiness,
        location,
        nativePlace,
        sibling,
        familyAffluence,
        familyType,
        familyValue,
      } = family;
      const { noOfMale, noOfFemale, noOfMaleMarried, noOfFemaleMarried } =
        sibling || {};
      setValue("family", {
        fatherName,
        motherName,
        fatherBusiness,
        motherBusiness,
        location,
        nativePlace,
        sibling: {
          noOfMale,
          noOfFemale,
          noOfMaleMarried,
          noOfFemaleMarried,
        },
        familyType: familyType?.toString(),
        familyValue: familyValue?.toString(),
        familyAffluence,
      });
      setFatherBusiness(fatherBusiness);
      setMotherBusiness(motherBusiness);
    }
  };

  useEffect(() => {
    setFormValues(profile?.family);
  }, [profile]);

  const payloadValCheck = (key) => {
    Object.keys(key).map((val) => {
      if (key[val] === undefined || key[val] === null || key[val] === "") {
        delete key[val];
      }
    });
  };

  const handleFatherOccupationChange = (e) => {
    const { value } = e.target;
    const regex = /^[A-Za-z\s]+$/;
    if (value === "" || regex.test(value)) {
      setValue("family.fatherBusiness", value);
      setFatherBusiness(value);
    }
  };

  const handleMotherOccupationChange = (e) => {
    const { value } = e.target;
    const regex = /^[A-Za-z\s]+$/;
    if (value === "" || regex.test(value)) {
      setValue("family.motherBusiness", value);
      setMotherBusiness(value);
    }
  };

  const onSubmit = async (values) => {
    payloadValCheck(values.family);
    const resp = await usersService.updateUser(
      { family: values.family },
      profileID
    );
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
    }
  };

  return (
    <Tab.Pane eventKey={"family"}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="form-group">
          <Col xl={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Father Name</Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Control
                  type="text"
                  {...register("family.fatherName")}
                  className="form-control"
                  placeholder="Father Name"
                />
              </Col>
            </Row>
          </Col>
          <Col xl={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Mother Name</Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Control
                  type="text"
                  {...register("family.motherName")}
                  className="form-control"
                  placeholder="Mother Name"
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Father Occupation</Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Control
                  {...register("family.fatherBusiness")}
                  type="text"
                  className="textboxhide"
                  maxLength="50"
                  placeholder="Fathers Occupation"
                  value={fatherBusiness}
                  onChange={handleFatherOccupationChange}
                />
              </Col>
            </Row>
          </Col>
          <Col xl={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Mother Occupation</Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Control
                  {...register("family.motherBusiness")}
                  type="text"
                  className="textboxhide"
                  maxLength="50"
                  placeholder="Mothers Occupation"
                  onChange={handleMotherOccupationChange}
                  value={motherBusiness}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Location</Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Control
                  type="text"
                  {...register("family.location")}
                  className="form-control"
                  placeholder="Family Location"
                />
              </Col>
            </Row>
          </Col>
          <Col xl={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Native Place</Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Control
                  type="text"
                  {...register("family.nativePlace")}
                  className="form-control"
                  placeholder="Native Place"
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Family Affluence</Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Select
                  className="form-control"
                  {...register("family.familyAffluence")}
                >
                  <option value="">Select</option>
                  {commonData &&
                    commonData.familyAffluence &&
                    commonData.familyAffluence.map((ele, ind) => (
                      <option value={ele.code} key={ind}>
                        {ele.label}
                      </option>
                    ))}
                </Form.Select>
              </Col>
            </Row>
          </Col>
          <Col xl={6} md={6} lg={8}>
            <Row>
              <Col xl={4}>
                <Form.Label>Family Type</Form.Label>
              </Col>
              <Col xl={8}>
                <div className="d-flex">
                  {commonData &&
                    commonData.familyType &&
                    commonData.familyType.map((ele, ind) => (
                      <Form.Check className="mx-1" key={ind}>
                        <Form.Check.Label>
                          <Form.Check.Input
                            type="radio"
                            name="FamilyType"
                            {...register("family.familyType")}
                            value={ele.code}
                          />
                          <i className="input-helper"></i> {ele.label}
                        </Form.Check.Label>
                      </Form.Check>
                    ))}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={12} md={6} lg={8}>
            <Row>
              <Col xl={2}>
                <Form.Label>Family Values</Form.Label>
              </Col>
              <Col xl={6}>
                <div className="d-flex">
                  {commonData &&
                    commonData.familyValue &&
                    commonData.familyValue.map((ele, ind) => (
                      <Form.Check className="mx-1" key={ind}>
                        <Form.Check.Label>
                          <Form.Check.Input
                            type="radio"
                            name="familyValues"
                            value={ele.code}
                            {...register("family.familyValue")}
                          />
                          <i className="input-helper"></i> {ele.label}
                        </Form.Check.Label>
                      </Form.Check>
                    ))}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xl={12} md={6} lg={8}>
            <Row>
              <Col xl={2}>
                <Form.Label>No of Siblings</Form.Label>
              </Col>
              <Col xl={10}>
                <Row>
                  <Col xl={6}>
                    <Row>
                      <Col xl={2} className="d-flex align-items-center">
                        <Form.Label>Male</Form.Label>
                      </Col>
                      <Col xl={5}>
                        <span>Not married</span>
                        <Form.Control
                          {...register("family.sibling.noOfMale")}
                          type="text"
                          className="form-control"
                          maxLength={2}
                          placeholder="Not married"
                        />
                      </Col>
                      <Col xl={5}>
                        <span>Married</span>
                        <Form.Control
                          {...register("family.sibling.noOfMaleMarried")}
                          type="text"
                          className="form-control"
                          maxLength={2}
                          placeholder="Married"
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={6}>
                    <Row>
                      <Col xl={2} className="d-flex align-items-center">
                        <Form.Label>Female</Form.Label>
                      </Col>
                      <Col xl={5}>
                        <span>Not married</span>
                        <Form.Control
                          {...register("family.sibling.noOfFemale")}
                          type="text"
                          className="form-control"
                          placeholder="Not Married"
                          maxLength={2}
                        />
                      </Col>
                      <Col xl={5}>
                        <span>Married</span>
                        <Form.Control
                          {...register("family.sibling.noOfFemaleMarried")}
                          type="text"
                          className="form-control"
                          placeholder="Married"
                          maxLength={2}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
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

export default Family;
