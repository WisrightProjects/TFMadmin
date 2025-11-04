import { Card } from "react-bootstrap";
import BreadCrumb from "components/common/breadcrumb";
import { Fragment } from "react";

export default function ImageApproval() {

    return (
        <Fragment>
            <BreadCrumb
                pageFor="Waiting For Image Approval"
                listUrl="Waiting For Image Approval"
            />
            <Card>
                <Card.Body>
                    Image Approval List
                </Card.Body>
            </Card>
        </Fragment>
    )
};