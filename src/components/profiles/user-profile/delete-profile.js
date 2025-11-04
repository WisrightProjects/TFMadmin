import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { utils } from "core/helper";
import { usersService } from "core/services";
import { Col, Form, Row, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PROFILES_PATH } from "pages/routes/routes";

const deleteSchema = Yup.object().shape({
  reason: Yup.string().nullable().required("Delete reason is required"),
  message: Yup.string().when("reason", {
    is: (val) => val === "50",
    then: Yup.string().label("Message").required(),
  }),
});

const DeleteProfile = (props) => {
  const commonData = useSelector((state) => state.common?.commonData);
  const { profile, profileID } = props;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(deleteSchema),
  });

  const deleteReasonVal = getValues("reason");

  const handleReasonChange = (e) => {
    const { value } = e.target;
    setValue("reason", value, { shouldValidate: true });
  };

  const onSubmit = async (values) => {
    const { reason, message } = values;
    const payload = {
      reason,
      message: reason === "50" ? message : undefined,
    };
    // return false;
    const resp = await usersService.deleteProfile(profileID, payload);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
      navigate(PROFILES_PATH);
    }
  };

  return (
    <Tab.Pane eventKey={"delete-profile"}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex justify-content-between">
          <h6>Delete Profile</h6>
        </div>
        <Row className="account-sec-edit-bg p-3">
          <Col md={12}>
            <p>Let us know why you wish to delete your profile?</p>
            <Row>
              <Col md={5} className="ml-5">
                {commonData?.deleteProfileReason?.map((ele, ind) => (
                  <div>
                    <Form.Check
                      type="radio"
                      key={ind}
                      value={ele.code}
                      {...register("reason")}
                      onChange={(e) => handleReasonChange(e)}
                    />
                    <label>{ele.label}</label>
                  </div>
                ))}
                {(deleteReasonVal === "50" || deleteReasonVal === "") && (
                  <Form.Control
                    as={"textarea"}
                    {...register("message")}
                    placeholder="Type a reason"
                  />
                )}
                <p className="text-danger text-start ">
                  {errors.reason?.message}
                </p>
                <p className="text-danger text-start ">
                  {errors.message?.message}
                </p>
              </Col>
            </Row>
          </Col>
          <button
            className="w-auto btn btn-sm btn-success ml-5"
            disabled={isSubmitting}
            type="submit"
          >
            Submit
          </button>
        </Row>
      </Form>
    </Tab.Pane>
  );
};

export default DeleteProfile;
