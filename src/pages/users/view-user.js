import { localStorage } from "core/helper";
import { userService } from "core/services";
import { useEffect, useState } from "react";
import { Card, Col, Nav, Row, Tab } from "react-bootstrap";
import { useParams } from "react-router-dom";
import BreadCrumb from "components/common/breadcrumb";

const ViewUser = () => {
    const { _id } = useParams();
    const [viewUser, setViewUser] = useState({});
    const [commonData, setCommonData] = useState(null);

    const loadUser = async () => {
        const resp = await userService.getuser(_id);
        setViewUser(resp.data);
    };

    useEffect(() => {
        loadUser();
    }, [_id]);

    const getCommonDataVal = (key, value) => {
        if (commonData === null) {
            return false
        }
        const data = commonData[key].find(ele => ele.code === value);
        return data ? data.label : false;
    };

    useEffect(() => {
        setTimeout(() => {
            const commonResp = localStorage.getCommonData();
            return commonResp ? setCommonData(commonResp.masterData) : null;
        }, 1000);
    }, []);

    return (
        <>
            <BreadCrumb
                pageFor="View User"
                listUrl="View User"
            />
            <Card>
                <Card.Body>
                    <Tab.Container defaultActiveKey={"basic"} className="tab-pills-horizontal">
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
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Label</th>
                                                            <th>Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td><h5 className="text-bold">Name</h5></td>
                                                            <td>{viewUser.name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><h5 className="text-bold">Profile Id</h5></td>
                                                            <td>{viewUser.profileId}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><h5 className="text-bold">Email</h5></td>
                                                            <td>{viewUser.email}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><h5 className="text-bold">Phone</h5></td>
                                                            <td>{viewUser.phone}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><h5 className="text-bold">Gender</h5></td>
                                                            <td>{commonData !== null && viewUser &&
                                                                getCommonDataVal("gender", viewUser.gender)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="contact">
                                            contact details
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="education">
                                            education details
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="family">
                                            family details
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="photos">
                                            photos details
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

export default ViewUser;