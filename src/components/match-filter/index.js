import React, { Fragment, useEffect, useState } from "react";
import { Accordion, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { masterService } from "core/services";
import { connect } from "react-redux";
import {
    LANGUAGE_FILTER,
    COUNTRY_PATH,
    STATE_PATH,
    COMMUNITY_URL,
} from "core/services/apiURL.service";
import { CONST } from "core/helper";
import AccordionHeaderCustom from "components/common/accordian-header";

const photoSettingInitial = [
    {
        code: 10,
        label: `Proctected Photos`,
    },
    {
        code: 20,
        label: `Visble to all`,
    },
];

const isAllNew = [{ value: "0", label: "All" }];

const filterSchema = Yup.object().shape(
    {
        distance: Yup.string().label("Distance"),
        photoSetting: Yup.array().of(Yup.string()).min(0).label("Photo Setting"),
        recentlyJoined: Yup.string().label("recentlyJoined"),
        activeMembers: Yup.string().label("activeMembers"),
        maritalStatus: Yup.array().of(Yup.string()).min(0).label("Marital Status"),
        annualIncome: Yup.array().of(Yup.string()).min(0).label("annualIncome"),
        communities: Yup.array().of(Yup.string()).min(0).label("communities"),
        languages: Yup.array().of(Yup.string()).min(0).label("languages"),
        countries: Yup.array().of(Yup.string()).min(0).label("countries"),
        states: Yup.array().of(Yup.string()).min(0).label("states"),
    },
    []
);

const MatchFilter = (props) => {
    const { commonData, onFilterSubmit = { onFilterSubmit }, isDistanceRange } = props;

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            distance: "0",
            photoSetting: ["0"],
            recentlyJoined: "0",
            activeMembers: "0",
            maritalStatus: ["0"],
            annualIncome: ["0"],
            communities: ["0"],
            languages: ["0"],
            countries: ["0"],
            states: ["0"],
        },
        resolver: yupResolver(filterSchema),
        mode: "onChange",
    });

    const onSubmit = (data) => {
        const dataNew = { ...data };
        const payload = {};

        if (dataNew.distance[0] && dataNew.distance[0] !== "0") {
            payload.distance = Number(dataNew.distance);
        }
        if (dataNew.photoSetting[0] && dataNew.photoSetting[0] !== "0") {
            payload.photoSetting = dataNew.photoSetting.map((ele) => Number(ele));
        }
        if (dataNew.recentlyJoined !== "0") {
            payload.recentlyJoined = Number(dataNew.recentlyJoined);
        }
        if (dataNew.activeMembers !== "0") {
            payload.activeMembers = Number(dataNew.activeMembers);
        }
        if (dataNew.maritalStatus[0] && dataNew.maritalStatus[0] !== "0") {
            payload.maritalStatus = dataNew.maritalStatus.map((ele) => Number(ele));
        }
        if (dataNew.communities[0] && dataNew.communities[0] !== "0") {
            payload.community = dataNew.communities.map((ele) => ele);
        }
        if (dataNew.languages[0] && dataNew.languages[0] !== "0") {
            payload.language = dataNew.languages.map((ele) => ele);
        }
        if (dataNew.annualIncome[0] && dataNew.annualIncome[0] !== "0") {
            payload.qualification = {
                annualIncome: dataNew.annualIncome.map((ele) => Number(ele)),
            };
        }
        if (
            (dataNew.countries[0] && dataNew.countries[0] !== "0") ||
            (dataNew.states[0] && dataNew.states[0] !== "0")
        ) {
            payload.location = {};

            if (dataNew.countries[0] && dataNew.countries[0] !== "0") {
                payload.location.country = dataNew.countries.map((ele) => ele);
            }

            if (dataNew.states[0] && dataNew.states[0] !== "0") {
                payload.location.state = dataNew.states.map((ele) => ele);
            }
        }
        onFilterSubmit(payload);
    };

    useEffect(() => {
        const subscription = watch(handleSubmit(onSubmit));
        return () => subscription.unsubscribe();
    }, [handleSubmit, watch]);

    const [filter] = useState({ ...CONST.DEFAULT_ADV_FILTER });

    const [distanceRange, setDistanceRange] = useState([...isAllNew]);
    const [photoSetting, setPhotoSetting] = useState([...isAllNew]);
    const [maritalStatus, setMaritalStatus] = useState([...isAllNew]);
    const [recentlyJoined, setRecentlyJoined] = useState([...isAllNew]);
    const [activeMembers, setActiveMembers] = useState([...isAllNew]);
    const [annualIncome, setAnnualIncome] = useState([...isAllNew]);
    const [communities, setCommunities] = useState([...isAllNew]);
    const [languages, setLanguages] = useState([...isAllNew]);
    const [countries, setCountries] = useState([...isAllNew]);
    const [states, setStates] = useState([...isAllNew]);

    const getSelectBoxFormatArr = (data, { label, value }) => {
        const arr = [];
        data.map((ele) => arr.push({ label: ele[label], value: ele[value] }));
        return arr;
    };

    const formatDistanceRange = () => {
        const commonDistanceRange = commonData?.distanceRange?.map((ele) => ({
            label: ele.label,
            value: ele.code,
        }));
        if (commonDistanceRange) {
            const distanceNew = [...commonDistanceRange];
            const setDistanceRangeArr = [...distanceRange, ...distanceNew]
            setDistanceRange(setDistanceRangeArr);
        }
    };

    const formatMaritalStatus = () => {
        const commonMaritalStatus = commonData?.maritalStatus?.map((ele) => ({
            label: ele.label,
            value: ele.code,
        }));
        if (commonMaritalStatus) {
            const setMartialStatusArr = [...maritalStatus, ...commonMaritalStatus];
            setMaritalStatus(setMartialStatusArr);
        }
    };

    const formatAnnualIncome = () => {
        const commonAnnualIncome = commonData?.yearlyIncome?.map((ele) => ({
            label: ele.label,
            value: ele.code,
        }));
        if (commonAnnualIncome) {
            const setAnnualIncomeArr = [...annualIncome, ...commonAnnualIncome];
            setAnnualIncome(setAnnualIncomeArr);
        }
    };

    const formatPhotoSetting = () => {
        const commonPhotoSetting = photoSettingInitial.map((ele) => ({
            label: ele.label,
            value: ele.code,
        }));
        if (commonPhotoSetting) {
            const setPhotoSettingArr = [...photoSetting, ...commonPhotoSetting];
            setPhotoSetting(setPhotoSettingArr);
        }
    };

    const formatRecentlyJoined = () => {
        const commonRecentlyJoined = commonData?.dateRangeFilters?.map((ele) => ({
            label: ele.label,
            value: ele.code,
        }));
        if (commonRecentlyJoined) {
            const commonRecentlyJoinedNew = [...commonRecentlyJoined];
            const setRecentlyJoinedArr = [...recentlyJoined, ...commonRecentlyJoinedNew];
            setRecentlyJoined(setRecentlyJoinedArr);
        }
    };

    const formatActiveMembers = () => {
        const commonActiveMembers = commonData?.dateRangeFilters?.map((ele) => ({
            label: ele.label,
            value: ele.code,
        }));
        if (commonActiveMembers) {
            const commonActiveMembersNew = [...commonActiveMembers];
            const setActiveMembersArr = [...activeMembers, ...commonActiveMembersNew];
            setActiveMembers(setActiveMembersArr);
        }
    };

    const getCommunity = async (filter) => {
        const resp = await masterService.getAllPost(COMMUNITY_URL + "/filter", filter);
        if (resp && resp.meta.code === 200) {
            const updateDataArr = getSelectBoxFormatArr(resp.data, {
                label: "community",
                value: "_id",
            });
            setCommunities([...communities, ...updateDataArr]);
        }
    };

    const getLanguage = async (filter) => {
        const resp = await masterService.getAllPost(LANGUAGE_FILTER, filter);
        if (resp && resp.meta.code === 200) {
            const updateDataArr = getSelectBoxFormatArr(resp.data, { label: "name", value: "_id" });
            setLanguages([...languages, ...updateDataArr]);
        }
    };

    const loadCountries = async (filter) => {
        const resp = await masterService.getAllPost(COUNTRY_PATH + "/filter", filter);
        if (resp && resp.meta.code === 200) {
            const updateDataArr = getSelectBoxFormatArr(resp.data, { label: "name", value: "_id" });
            setCountries([...countries, ...updateDataArr]);
        }
    };

    const loadStates = async (filter) => {
        const resp = await masterService.getAllPost(STATE_PATH + "/filter", filter);
        if (resp && resp.meta.code === 200) {
            const updateDataArr = getSelectBoxFormatArr(resp.data, { label: "name", value: "_id" });
            setStates([...states, ...updateDataArr]);
        }
    };

    const checkboxOnChange = (eve, fieldName) => {
        const { value, checked } = eve.target;
        let previousArr = getValues(fieldName);
        if (checked) {
            if (value !== "0") {
                if (previousArr[0] === "0") {
                    previousArr.splice(0, 1);
                }
                previousArr.push(value);
            } else {
                previousArr = [value];
            }
        } else {
            const preInd = previousArr.findIndex((ele) => ele === value);
            previousArr.splice(preInd, 1);
            if (previousArr.length === 0) {
                previousArr = ["0"];
            }
        }

        setValue(fieldName, previousArr);
    };

    useEffect(() => {
        if (commonData) {
            formatDistanceRange();
            formatRecentlyJoined();
            formatMaritalStatus();
            formatAnnualIncome();
            formatPhotoSetting();
            formatActiveMembers();
            getCommunity({ ...filter });
            getLanguage({ ...filter });
            loadCountries({ ...filter });
            loadStates({ ...filter });
        }
    }, [commonData]);

    return (
        <Fragment>
            <Accordion defaultActiveKey={'photo-settings'} className="accordion-solid-header" alwaysOpen>
                <h4>Refine Search</h4>
                {isDistanceRange && (
                    <Accordion.Item className="card" eventKey="distance">
                        <div className="card-header">
                            <AccordionHeaderCustom
                                eventKey="Distance Range"
                                headerTitle="Distance Range"
                            />
                        </div>
                        <Accordion.Body>
                            <Form>
                                {distanceRange.map((ele, ind) => (
                                    <Form.Check key={ind}>
                                        <Form.Check.Label>
                                            <Form.Check.Input
                                                {...register(`distance`)}
                                                type="radio"
                                                value={ele.code}
                                                name="distance"
                                                onChange={async (e) => checkboxOnChange(e, "distance")}
                                            />
                                            <i className="input-helper"></i> {ele.label}
                                        </Form.Check.Label>
                                    </Form.Check>
                                ))}
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                )}
                <Accordion.Item className="card" eventKey="photo-settings">
                    <div className="card-header">
                        <AccordionHeaderCustom
                            eventKey="photo-settings"
                            headerTitle="Photo Settings"
                        />
                    </div>
                    <Accordion.Body>
                        <Form>
                            {photoSetting.map((ele, ind) => (
                                <Form.Check key={ind}>
                                    <Form.Check.Label>
                                        <Form.Check.Input
                                            {...register(`photoSetting`)}
                                            type="checkbox"
                                            value={ele.code}
                                            name="photoSetting"
                                            onChange={async (e) => checkboxOnChange(e, "photoSetting")}
                                        />
                                        <i className="input-helper"></i> {ele.label}
                                    </Form.Check.Label>
                                </Form.Check>
                            ))}
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item className="card" eventKey="recently-joined">
                    <div className="card-header">
                        <AccordionHeaderCustom
                            eventKey="recently-joined"
                            headerTitle="Recently Joined"
                        />
                    </div>
                    <Accordion.Body>
                        <Form>
                            {recentlyJoined.map((ele, ind) => (
                                <Form.Check key={ind}>
                                    <Form.Check.Label>
                                        <Form.Check.Input
                                            {...register(`recentlyJoined`)}
                                            type="radio"
                                            value={ele.code}
                                            name="recentlyJoined"
                                            onChange={async (e) => checkboxOnChange(e, "recentlyJoined")}
                                        />
                                        <i className="input-helper"></i> {ele.label}
                                    </Form.Check.Label>
                                </Form.Check>
                            ))}
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item className="card" eventKey="active-members">
                    <div className="card-header">
                        <AccordionHeaderCustom
                            eventKey="active-members"
                            headerTitle="Active Members"
                        />
                    </div>
                    <Accordion.Body>
                        <Form>
                            {activeMembers.map((ele, ind) => (
                                <Form.Check key={ind}>
                                    <Form.Check.Label>
                                        <Form.Check.Input
                                            {...register(`activeMembers`)}
                                            type="radio"
                                            value={ele.code}
                                            name="activeMembers"
                                            onChange={async (e) => checkboxOnChange(e, "activeMembers")}
                                        />
                                        <i className="input-helper"></i> {ele.label}
                                    </Form.Check.Label>
                                </Form.Check>
                            ))}
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item className="card" eventKey="marital-status">
                    <div className="card-header">
                        <AccordionHeaderCustom
                            eventKey="marital-status"
                            headerTitle="Marital Status"
                        />
                    </div>
                    <Accordion.Body>
                        <Form>
                            {maritalStatus.map((ele, ind) => (
                                <Form.Check key={ind}>
                                    <Form.Check.Label>
                                        <Form.Check.Input
                                            {...register(`maritalStatus`)}
                                            type="checkbox"
                                            value={ele.code}
                                            name="maritalStatus"
                                            onChange={async (e) => checkboxOnChange(e, "maritalStatus")}
                                        />
                                        <i className="input-helper"></i> {ele.label}
                                    </Form.Check.Label>
                                </Form.Check>
                            ))}
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item className="card" eventKey="annual-income">
                    <div className="card-header">
                        <AccordionHeaderCustom
                            eventKey="annual-income"
                            headerTitle="Annual Income"
                        />
                    </div>
                    <Accordion.Body>
                        <Form>
                            {annualIncome.map((ele, ind) => (
                                <Form.Check key={ind}>
                                    <Form.Check.Label>
                                        <Form.Check.Input
                                            {...register(`annualIncome`)}
                                            type="checkbox"
                                            value={ele.code}
                                            name="annualIncome"
                                            onChange={async (e) => checkboxOnChange(e, "annualIncome")}
                                        />
                                        <i className="input-helper"></i> {ele.label}
                                    </Form.Check.Label>
                                </Form.Check>
                            ))}
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item className="card" eventKey="community">
                    <div className="card-header">
                        <AccordionHeaderCustom
                            eventKey="community"
                            headerTitle="Community"
                        />
                    </div>
                    <Accordion.Body className="match-filter">
                        <Form>
                            {communities.map((ele, ind) => (
                                <Form.Check key={ind}>
                                    <Form.Check.Label>
                                        <Form.Check.Input
                                            {...register(`communities`)}
                                            type="checkbox"
                                            value={ele.code}
                                            name="communities"
                                            onChange={async (e) => checkboxOnChange(e, "communities")}
                                        />
                                        <i className="input-helper"></i> {ele.label}
                                    </Form.Check.Label>
                                </Form.Check>
                            ))}
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item className="card" eventKey="mother-tongue">
                    <div className="card-header">
                        <AccordionHeaderCustom
                            eventKey="mother-tongue"
                            headerTitle="Mother Tongue"
                        />
                    </div>
                    <Accordion.Body className="match-filter">
                        <Form>
                            {languages.map((ele, ind) => (
                                <Form.Check key={ind}>
                                    <Form.Check.Label>
                                        <Form.Check.Input
                                            {...register(`languages`)}
                                            type="checkbox"
                                            value={ele.value}
                                            name="motherTounge"
                                            onChange={async (e) => checkboxOnChange(e, "languages")}
                                        />
                                        <i className="input-helper"></i> {ele.label}
                                    </Form.Check.Label>
                                </Form.Check>
                            ))}
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item className="card" eventKey="country-living">
                    <div className="card-header">
                        <AccordionHeaderCustom
                            eventKey="country-living"
                            headerTitle="Country Living"
                        />
                    </div>
                    <Accordion.Body>
                        <Form>
                            {countries.map((ele, ind) => (
                                <Form.Check key={ind}>
                                    <Form.Check.Label>
                                        <Form.Check.Input
                                            {...register(`countries`)}
                                            type="checkbox"
                                            value={ele.value}
                                            name="countries"
                                            onChange={async (e) => checkboxOnChange(e, "countries")}
                                        />
                                        <i className="input-helper"></i> {ele.label}
                                    </Form.Check.Label>
                                </Form.Check>
                            ))}
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item className="card" eventKey="state-living">
                    <div className="card-header">
                        <AccordionHeaderCustom
                            eventKey="state-living"
                            headerTitle="State Living"
                        />
                    </div>
                    <Accordion.Body className="state-filter">
                        <Form>
                            {states.map((ele, ind) => (
                                <Form.Check key={ind}>
                                    <Form.Check.Label>
                                        <Form.Check.Input
                                            {...register(`states`)}
                                            type="checkbox"
                                            value={ele.value}
                                            name="states"
                                            onChange={async (e) => checkboxOnChange(e, "states")}
                                        />
                                        <i className="input-helper"></i> {ele.label}
                                    </Form.Check.Label>
                                </Form.Check>
                            ))}
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Fragment >
    );
};

const mapStateToProps = (state) => {
    return {
        commonData: state?.common?.commonData,
        token: state.account?.token,
        authUser: state.account?.authUser,
    };
};

export default connect(mapStateToProps, null)(MatchFilter);
