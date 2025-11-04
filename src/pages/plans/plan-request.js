
import { Card } from "react-bootstrap";
import BreadCrumb from "components/common/breadcrumb";
import { Fragment } from "react";

export default function PlanRequest() {

    return (
        <Fragment>
            <BreadCrumb
                pageFor="Plan Request"
                listUrl="Plan Request"
            />
            <Card>
                <Card.Body>
                    Plan Request
                </Card.Body>
            </Card>
        </Fragment>
    )
};