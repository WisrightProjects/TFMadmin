import { Card, Col, Form, FormCheck, Nav, Row, Tab } from "react-bootstrap";
import BreadCrumb from "components/common/breadcrumb";
import { useFieldArray, useForm, Controller} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { useEffect, useState, Fragment } from "react";
import { localStorage } from "core/helper";
import { masterService, userService } from "core/services";
import { useParams } from "react-router-dom";

const validationSchema = Yup.object().shape({
    profileFor: Yup
        .string()
        .required("Profile for is required"),
    gender: Yup
        .string()
        .nullable()
        .required("Gender is required"),
    dateOfBirth: Yup
        .string()
        .required("Date of birth is required"),
    maritalStatus: Yup
        .string()
        .required("Marital status is required"),
    disability: Yup
        .string()
        .nullable()
        .required("Disability is required"),
    bloodGroup: Yup
        .string()
        .required("Blood Group is required"),
    height: Yup
        .string()
        .required("Height is required"),
    phone: Yup
        .string()
        .required("Phone is required")
});

const AddUser = () => {

    const {register, handleSubmit, setValue, control, formState, getValues} = useForm({
        defaultValues: {
            images: [{
                img: ''
            }]
        },
        resolver: yupResolver(validationSchema),
    });
    const {errors, isSubmitting} =  formState;
    const {fields, append, remove} = useFieldArray(
        {
            control,
            name: 'images'
        }
    );
    const { _id } = useParams();
    const isAddMode = !_id;

    const [commonData, setCommonData] = useState([]);
    const [degree, setDegree] = useState([]);
    const [collage, setCollage] = useState([]);
    const [profession, setProfession] = useState([]);
    const [filter] = useState({
        search: '', 
        skip: 0,
        limit: 100 
    });

    const loadUser = async() => {
        const resp = await userService.getuser(_id);
        const {data} = resp
        const fields = [
            'profileFor',
            'gender',
            'dateOfBirth',
            'maritalStatus',
            'disability',
            'bloodGroup',
            'height',
            'phone'
        ];
        fields.forEach(field => setValue(field, data[field]));
    };
   
    const loadAllDegree = async () => {
        const resp = await masterService.getAllDegree(filter);
        setDegree(resp.data)
    };

    const loadCollage = async () => {
        const resp = await masterService.getAllCollage(filter);
        setCollage(resp.data);
    };

    const loadProfession = async () => {
        const resp = await masterService.getAllProfession(filter);
        setProfession(resp.data);
    };

    const onSubmit = (values) => {
        isAddMode ? addUser(values) : editUser(values);
    };

    const addUser = (values) => {
    };

    const editUser = (values) => {
    };
    
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);

    const handleMaxDate = (e) => {
        const value = e.target.value;
        const date = new Date(value);
        if(date){
            setMinDate(date)
        }else{
            setMaxDate("2020-01-01");
        }
    };

    useEffect(()=>{
        if(_id){
            loadUser();
        }
        loadAllDegree();
        loadCollage();
        loadProfession();
    },[_id]);

    useEffect(() => {
        const commonResp = localStorage.getCommonData();
        return commonResp ? setCommonData(commonResp.masterData) : ""
    }, []);

    return (
        <>
            <BreadCrumb
                pageFor="Add User"
                listUrl="Add User"
            />
            <Card>
                <Card.Body>
                    <Tab.Container defaultActiveKey={"basic"} className="tab-custom-pills-horizontal">
                        <div className="tab-custom-pills-horizontal">
                            <Row>
                                <Col md={12}>
                                    <Nav variant="pills">
                                        <Nav.Item>
                                            <Nav.Link eventKey="basic">Basice Info</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="contact">Contact Details</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="education">Education</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="family">Family</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="photos">Photos</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="hobbies">Hobbies and Interests</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                                <Col md={12}>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="basic">
                                            <Form onSubmit={handleSubmit(onSubmit)}>
                                                <Row className="form-group">
                                                    <Col xl={6} md={6} lg={6}>
                                                        <Row>
                                                            <Col xl={6}>
                                                                <Form.Label>Profile created by</Form.Label>
                                                            </Col>
                                                            <Col xl={6}>
                                                                <Form.Select
                                                                    {...register("profileFor")}
                                                                    className="form-control"
                                                                >
                                                                    <option value=""> Select</option>
                                                                    <option value="Self">Self</option>
                                                                    <option value="Parent / Guardian">Parent / Guardian</option>
                                                                    <option value="Sibling">Sibling</option>
                                                                    <option value="Friend">Friend</option>
                                                                    <option value="Other">Other</option>
                                                                </Form.Select>
                                                                <p className="text-danger">{errors.profileFor?.message}</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xl={6} md={6} lg={6}>
                                                        <Row>
                                                            <Col xl={6}>
                                                                <Form.Label>Gender</Form.Label>
                                                            </Col>
                                                            <Col xl={6} lg={6}>
                                                                <div className="d-flex justify-content-between">
                                                                    <Form.Check>
                                                                        <Form.Check.Label>
                                                                            <Form.Check.Input
                                                                                type="radio"
                                                                                name="gender"
                                                                                {...register("gender")}
                                                                            />
                                                                            <i className="input-helper"></i>  Male
                                                                        </Form.Check.Label>
                                                                    </Form.Check>
                                                                    <Form.Check>
                                                                        <Form.Check.Label>
                                                                            <Form.Check.Input
                                                                                type="radio"
                                                                                name="gender"
                                                                                {...register("gender")}
                                                                            />
                                                                            <i className="input-helper"></i>  FeMale
                                                                        </Form.Check.Label>
                                                                    </Form.Check>
                                                                </div>
                                                                <p className="text-danger">{errors.gender?.message}</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row className="form-group">
                                                    <Col xl={6} md={6} lg={6}>
                                                        <Row>
                                                            <Col xl={6}>
                                                                <Form.Label className="label">Date of Birth </Form.Label>
                                                            </Col>
                                                            <Col xl={6}>
                                                                <Form.Control
                                                                    {...register("dateOfBirth")}
                                                                    type="date"
                                                                    onChange={handleMaxDate}
                                                                    // min={minDate} max={maxDate}
                                                                    min={new Date()} max={"2004-01-01"}
                                                                />
                                                                <p className="text-danger">{errors.dateOfBirth?.message}</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xl={6} md={6} lg={6}>
                                                        <Row>
                                                            <Col xl={6}>
                                                                <Form.Label>Marital status</Form.Label>
                                                            </Col>
                                                            <Col xl={6}>
                                                                <Form.Select
                                                                    {...register("maritalStatus")}
                                                                    className="form-control"
                                                                >
                                                                    <option value="">Select</option>
                                                                    {commonData && commonData.maritalStatus && commonData.maritalStatus.map((ele, ind) => (
                                                                        <option key={ind} value={ele.code}>{ele.label}</option>
                                                                    ))}
                                                                </Form.Select>
                                                                <p className="text-danger">{errors.maritalStatus?.message}</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row className="form-group">
                                                    <Col xl={6} md={6} lg={6}>
                                                        <Row>
                                                            <Col xl={6}>
                                                                <Form.Label>Any Disability?</Form.Label>
                                                            </Col>
                                                            <Col xl={6} lg={12}>
                                                                <div className="d-flex justify-content-between">
                                                                    <Form.Check>
                                                                        <Form.Check.Label>
                                                                            <Form.Check.Input
                                                                                type="radio"
                                                                                name="gender"
                                                                                {...register("disability")}
                                                                            />
                                                                            <i className="input-helper"></i>  None
                                                                        </Form.Check.Label>
                                                                    </Form.Check>
                                                                    <Form.Check>
                                                                        <Form.Check.Label>
                                                                            <Form.Check.Input
                                                                                type="radio"
                                                                                name="gender"
                                                                                {...register("disability")}
                                                                            />
                                                                            <i className="input-helper"></i>  Physical Disability
                                                                        </Form.Check.Label>
                                                                    </Form.Check>
                                                                </div>
                                                                <p className="text-danger">{errors.disability?.message}</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xl={6} md={6} lg={6}>
                                                        <Row>
                                                            <Col xl={6}>
                                                                <Form.Label>Blood Group</Form.Label>
                                                            </Col>
                                                            <Col xl={6}>
                                                                <Form.Select
                                                                    className="form-control"
                                                                    {...register("bloodGroup")}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {commonData && commonData.bloodGroup && commonData.bloodGroup.map((ele, ind) => (
                                                                        <option value={ele.code} key={ind}>{ele.label}</option>
                                                                    ))}
                                                                </Form.Select>
                                                                <p className="text-danger">{errors.bloodGroup?.message}</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row className="form-group">
                                                    <Col xl={6} md={6} lg={6}>
                                                        <Row>
                                                            <Col xl={6}>
                                                                <Form.Label>Height</Form.Label>
                                                            </Col>
                                                            <Col xl={6}>
                                                                <Form.Select
                                                                    {...register("height")}
                                                                    className="form-control"
                                                                >
                                                                    <option value="">Select</option>
                                                                    {commonData && commonData.heightTypes && commonData.heightTypes.map((ele, ind) => (
                                                                        <option key={ind} value={ele.code}>{ele.label}</option>
                                                                    ))}
                                                                </Form.Select>  
                                                                <p className="text-danger">{errors.height?.message}</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xl={6} md={6} lg={6}>
                                                        <Row>
                                                            <Col xl={6}>
                                                                <Form.Label>Phone</Form.Label>
                                                            </Col>
                                                            <Col xl={6}>
                                                                <Form.Control
                                                                    {...register("phone")}
                                                                    className="form-control"
                                                                    type="text"
                                                                    placeholder="Phone number"
                                                                />
                                                                <p className="text-danger">{errors.phone?.message}</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <button type="submit" className="btn btn-rounded btn-success">Submit</button>
                                            </Form>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="contact">
                                            <Row className="form-group">
                                                <Col xl={6} md={6} lg={4}>
                                                    <Row>
                                                        <Col xl={6}>
                                                            <Form.Label>Name</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <Form.Control
                                                                type="text"
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xl={6} md={6} lg={8}>
                                                    <Row>
                                                        <Col xl={6}>
                                                            <Form.Label>Relationship with member</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <Form.Select
                                                                {...register("relationship")}
                                                                className="form-control"
                                                            >
                                                                <option value="Self" selected="selected">Self</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className="form-group">
                                                <Col xl={12} md={6} lg={4}>
                                                    <Row>
                                                        <Col xl={3}>
                                                            <Form.Label>Convenient time to call</Form.Label>
                                                        </Col>
                                                        <Col xl={9}>
                                                            <Row>
                                                                <Col xl={6}>
                                                                    <Row>
                                                                        <Col xl={3}>
                                                                            <Form.Label className="mt-2">From</Form.Label>
                                                                        </Col>
                                                                        <Col xl={9}>
                                                                            <Form.Control
                                                                                type="time"
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col xl={6}>
                                                                    <Row>
                                                                        <Col xl={3}>
                                                                            <Form.Label className="mt-2">To</Form.Label>
                                                                        </Col>
                                                                        <Col xl={9}>
                                                                            <Form.Control
                                                                                type="time"
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={12} md={6} lg={8}>
                                                    <Row>
                                                        <Col xl={3}>
                                                            <Form.Label>Relationship with member</Form.Label>
                                                        </Col>
                                                        <Col xl={9}>
                                                            <Form.Check>
                                                                <Form.Check.Label>
                                                                    <Form.Check.Input
                                                                        type="radio"
                                                                        name="relationship"
                                                                    />
                                                                    <i className="input-helper"></i>
                                                                    Only Premium Members
                                                                </Form.Check.Label>
                                                            </Form.Check>
                                                            <Form.Check>
                                                                <Form.Check.Label>
                                                                    <Form.Check.Input
                                                                        type="radio"
                                                                        name="relationship"
                                                                    />
                                                                    <i className="input-helper"></i>
                                                                    Only Premium Members You like
                                                                </Form.Check.Label>
                                                            </Form.Check>   
                                                            <Form.Check>
                                                                <Form.Check.Label>
                                                                    <Form.Check.Input
                                                                        type="radio"
                                                                        name="relationship"
                                                                    />
                                                                    <i className="input-helper"></i>
                                                                    No one (Matches won't be able to call you)
                                                                </Form.Check.Label>
                                                            </Form.Check>   
                                                            <Form.Check>
                                                                <Form.Check.Label>
                                                                    <Form.Check.Input
                                                                        type="radio"
                                                                        name="relationship"
                                                                    />
                                                                    <i className="input-helper"></i>
                                                                    Only Visible to all your Matches (Expires with Membership) &#63;
                                                                </Form.Check.Label>
                                                            </Form.Check>   
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="education">
                                            <Row className="form-group">
                                                <Col xl={6}>
                                                    <Row>
                                                        <Col xl={6}>
                                                            <Form.Label>Highest Qualification</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <Form.Select
                                                                className="form-control"
                                                                {...register("qualification.degree")}
                                                            >
                                                                <option value="">Select</option>
                                                                {degree.map((ele, ind) => (
                                                                    <option value={ele._id} key={ind}>{ele.name}</option>
                                                                ))}
                                                            </Form.Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xl={6}>
                                                    <Row>
                                                        <Col xl={6}>
                                                            <Form.Label>Collage</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <Form.Select
                                                                className="form-control"
                                                                {...register("qualification.collage")}
                                                            >
                                                                <option value="">Select</option>
                                                                {collage.map((ele, ind) => (
                                                                    <option value={ele._id} key={ind}>{ele.name}</option>
                                                                ))}
                                                            </Form.Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className="form-group">
                                                <Col xl={6}>
                                                    <Row>
                                                        <Col xl={6}>
                                                            <Form.Label>Working With</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                        <Form.Select
                                                            className="form-control"
                                                            {...register("qualification.workWith")}
                                                        >
                                                            <option value="" label="Select">Select</option>
                                                            {commonData && commonData.workWithTypes &&
                                                                commonData.workWithTypes.map((ele, ind) => (
                                                                    <option value={ele.code} key={ind}>{ele.label}</option>
                                                                ))}
                                                        </Form.Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xl={6}>
                                                    <Row>
                                                        <Col xl={6}>
                                                            <Form.Label>Profession</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <Form.Select
                                                                className="form-control"
                                                                {...register("qualification.profession")}
                                                            >
                                                                <option value="">Select</option>
                                                                {profession.map((ele, ind) => (
                                                                    <option value={ele._id} key={ind}>{ele.name}</option>
                                                                ))}
                                                            </Form.Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={6}>
                                                    <Row>
                                                        <Col xl={6}>
                                                            <Form.Label>Employer Name</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <Form.Control
                                                                type="text"
                                                                className="form-control"
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xl={6}>
                                                    <Row>
                                                        <Col xl={6}>
                                                            <Form.Label>Annual Income</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <Form.Select
                                                                className="form-control"
                                                                {...register("qualification")}
                                                            >
                                                                <option value="">Select</option>
                                                                {commonData && commonData.yearlyIncome &&
                                                                    commonData.yearlyIncome.map((ele, ind) => (
                                                                        <option value={ele.code} key={ind}>{ele.label}</option>
                                                                    ))}
                                                            </Form.Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="family">
                                            <Row className="form-group">
                                                <Col xl={6}>
                                                    <Row>
                                                        <Col xl={6}>
                                                            <Form.Label>Father Name</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <Form.Control
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Father Name"
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xl={6}>
                                                    <Row>
                                                        <Col xl={6}>
                                                            <Form.Label>Mother Name</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <Form.Control
                                                                type="text"
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
                                                        <Col xl={6}>
                                                            <Form.Label>Father's Status</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                        <Form.Select
                                                            className="form-control"
                                                            {...register("family.fatherBusiness")}
                                                        >
                                                            <option value="" label="Select">Select</option>
                                                            {commonData && commonData.business && commonData.business.map((ele, ind) => (
                                                                <option value={ele.code} key={ind}>{ele.label}</option>
                                                            ))}
                                                        </Form.Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xl={6}>
                                                    <Row>
                                                        <Col xl={6}>
                                                            <Form.Label>Profession</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <Form.Select
                                                                className="form-control"
                                                                {...register("family.motherBusiness")}
                                                            >
                                                                <option value="">Select</option>
                                                                {commonData && commonData.business && commonData.business.map((ele, ind) => (
                                                                <option value={ele.code} key={ind}>{ele.label}</option>
                                                                ))}
                                                            </Form.Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className="form-group">
                                                <Col xl={6}>
                                                    <Row>
                                                        <Col xl={6}>
                                                            <Form.Label>Family Location</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <Form.Control
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Family Location"
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xl={6}>
                                                    <Row>
                                                        <Col xl={6}>
                                                            <Form.Label>Native Place</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <Form.Control
                                                                type="text"
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
                                                        <Col xl={6}>
                                                            <Form.Label>Family Affluence</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <Form.Select
                                                                className="form-control"
                                                                {...register("family.familyAffluence")}
                                                            >
                                                                <option value="">Select</option>
                                                                {commonData && commonData.familyAffluence &&
                                                                    commonData.familyAffluence.map((ele, ind) => (
                                                                        <option value={ele.code} key={ind}>{ele.label}</option>
                                                                    ))}
                                                            </Form.Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xl={6} md={6} lg={8}>
                                                    <Row>
                                                        <Col xl={6}>
                                                            <Form.Label>Family Type</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            <div className="d-flex">
                                                                <Form.Check>
                                                                    <Form.Check.Label>
                                                                        <Form.Check.Input
                                                                            type="radio"
                                                                            name="FamilyType"
                                                                        />
                                                                        <i className="input-helper"></i>  Joint
                                                                    </Form.Check.Label>
                                                                </Form.Check>
                                                                <Form.Check>
                                                                    <Form.Check.Label>
                                                                        <Form.Check.Input
                                                                            type="radio"
                                                                            name="FamilyType"
                                                                        />
                                                                        <i className="input-helper"></i>  Nuclear
                                                                    </Form.Check.Label>
                                                                </Form.Check>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className="form-group">
                                                <Col xl={12} md={6} lg={8}>
                                                    <Row>
                                                        <Col xl={3}>
                                                            <Form.Label>Family Values</Form.Label>
                                                        </Col>
                                                        <Col xl={9}>
                                                            <Row>
                                                                <Col xl={2}>
                                                                    <Form.Check>
                                                                        <Form.Check.Label>
                                                                            <Form.Check.Input
                                                                                type="radio"
                                                                                name="familyValues"
                                                                            />
                                                                            <i className="input-helper"></i>  Traditional
                                                                        </Form.Check.Label>
                                                                    </Form.Check>
                                                                </Col>
                                                                <Col xl={2}>
                                                                    <Form.Check>
                                                                        <Form.Check.Label>
                                                                            <Form.Check.Input
                                                                                type="radio"
                                                                                name="familyValues"
                                                                            />
                                                                            <i className="input-helper"></i>  Moderate
                                                                        </Form.Check.Label>
                                                                    </Form.Check>
                                                                </Col>
                                                                <Col xl={2}>
                                                                    <Form.Check>
                                                                        <Form.Check.Label>
                                                                            <Form.Check.Input
                                                                                type="radio"
                                                                                name="familyValues"
                                                                            />
                                                                            <i className="input-helper"></i>  Liberal
                                                                        </Form.Check.Label>
                                                                    </Form.Check>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={12} md={6} lg={8}>
                                                    <Row>
                                                        <Col xl={3}>
                                                            <Form.Label>No of Siblings</Form.Label>
                                                        </Col>
                                                        <Col xl={9}>
                                                            <Row>
                                                                <Col xl={3}>
                                                                    <Form.Control
                                                                        {...register("family.sibling.noOfMale")}
                                                                        type="text"
                                                                        className="form-control"
                                                                        maxlength="2"
                                                                    />
                                                                    <span>Not married</span>
                                                                </Col>
                                                                <Col xl={3}>
                                                                    <Form.Control
                                                                        {...register("family.sibling.noOfMaleMarried")}
                                                                        type="text"
                                                                        className="form-control"
                                                                        maxlength="2"
                                                                    />
                                                                    <span>Married</span>
                                                                </Col>
                                                                <Col xl={3}>
                                                                    <Form.Control
                                                                        {...register("family.sibling.noOfFemale")}
                                                                        type="text"
                                                                        className="form-control"
                                                                        maxlength="2"
                                                                    />
                                                                    <span>Not married</span>
                                                                </Col>
                                                                <Col xl={3}>
                                                                    <Form.Control
                                                                        {...register("family.sibling.noOfFemaleMarried")}
                                                                        type="text"
                                                                        className="form-control"
                                                                        maxlength="2"
                                                                    />
                                                                    <span>Married</span>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="photos">
                                            <Row className="form-group">
                                                <Col xl={6}>
                                                    <Row>
                                                        <Col xl={4}>
                                                            <Form.Label>Profile Image Upload</Form.Label>
                                                        </Col>
                                                        <Col xl={6}>
                                                            {fields.map((ele,ind)=>{
                                                                return(
                                                                    <Fragment>
                                                                        <Form.Control 
                                                                            {...register(`images.${ind}.img`)}
                                                                            name={`images[${ind}].img`}
                                                                            type="file"
                                                                            className="form-control"
                                                                        />
                                                                    </Fragment>
                                                                )
                                                            })}
                                                        </Col>
                                                        <Col xl={2}>
                                                           <div className="d-flex">
                                                           <button
                                                                type="button"
                                                                className="btn btn-rounded btn-success"
                                                                onClick={() => append({ img: ""})}
                                                            >
                                                                <i className="mdi mdi-plus-circle"></i>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-rounded btn-danger"
                                                                onClick={() => remove(1,1)}
                                                            >
                                                                <i className="mdi mdi-minus-circle"></i>
                                                            </button>
                                                           </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="hobbies">
                                            hobbies details
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </div>
                    </Tab.Container>
                </Card.Body>
            </Card>
        </>
    )
};

export default AddUser;