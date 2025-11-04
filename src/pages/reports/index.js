import { Card, Col, Nav, Row, Tab } from "react-bootstrap";
import { useState } from "react";
import BreadCrumb from "components/common/breadcrumb";
import Payments from "components/reports/payments";
import Users from "components/reports/users";

const Reports = () => {

    const [eventKeyState, setEventKeyState] = useState("payments");

    return (
        <div>
            <BreadCrumb pageFor="Reports" listUrl="Reports" />
            <Row>
                <Col xl={12}>
                    <Tab.Container defaultActiveKey={"payments"}>
                        <Card>
                            <Card.Body>
                                <Row className="mb-3 tab-custom-pills-horizontal">
                                    <Col md={6}>
                                        <Nav variant="pills" className="border-0">
                                            <Nav.Item onClick={() => setEventKeyState("payments")}>
                                                <Nav.Link eventKey="payments">Payments</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item onClick={() => setEventKeyState("users")} >
                                                <Nav.Link eventKey="users">Users</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Col>
                                </Row>
                                {eventKeyState === "payments" ? (
                                    <Payments />
                                ) : (
                                    <Users />
                                )}
                            </Card.Body>
                        </Card>
                    </Tab.Container>
                </Col>
            </Row>
        </div>
    );
};

export default Reports;
