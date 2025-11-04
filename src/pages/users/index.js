import { Card, Col, Row } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { useEffect, useState } from "react";
import { userService } from "core/services";
import Actions from "components/actions";
import { VIEW_USER, ADD_USER, EDIT_USER } from "pages/routes/routes";
import BreadCrumb from "components/common/breadcrumb";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const Users = () => {

    const columns = [
        {
            name: 'Matri ID',
            selector: row => row.profileId,
        },
        {
            name: 'Name',
            selector: row => row.name,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'Plan',
            selector: row => 'Free',
        },
        {
            name: 'CreatedBy',
            selector: row => 'Staff',
        },
        {
            name: 'UpdatedBy',
            selector: row => 'Staff',
        },
        {
            name: 'Status',
            selector: row => row.status,
        },
        {
            name: 'Action',
            cell: (row) => getActions(row),
            ignoreRowClick: true,
            grow: 1,
        },
    ];

    const getActions = (row) => {
        return (
            <Actions
                viewUrl={VIEW_USER + "/" + row._id}
                editUrl={EDIT_USER + "/" + row._id}
                rowId={row._id}
            />
        )
    };

  

    const [users, setUsers] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [filter, setFilter] = useState({
        search: '',
        skip: 0,
        limit: 10
    });

    const loadUsers = async () => {
        const resp = await userService.users(filter);
        const { data: usersList, pagination } = resp.data;
        if (usersList.length > 0) {
            setTotalRows(pagination.totalCount);
            setUsers(usersList);
        }
    };

    const handlePageChange = (page) => {
        setFilter({
            ...filter,
            skip: (page > 1) ? ((page - 1) * perPage) : 0
        });
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setFilter({
            ...filter,
            skip: (page > 1) ? ((page - 1) * perPage) : 0,
            limit: newPerPage
        })
    };

    useEffect(() => {
        loadUsers();
    }, [filter]);

    return (
        <div>
            <BreadCrumb
                pageFor="Users"
                listUrl="Users"
            />
            <Row>
                <Col xl={12}>
                    <Card>
                        <Card.Body>
                            <Row className="m-2">
                                <Col md={6}>

                                </Col>
                                <Col md={6} className="ml-lg-auto d-flex pt-2 pt-md-0 align-items-stretch justify-content-end">
                                    <Link className="nav-link" to={ADD_USER}>
                                        <button className='btn btn-rounded btn-success' >+ Add</button>
                                    </Link>
                                </Col>
                            </Row>
                            <Form className="forms-sample">
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="form-group">
                                            <Form.Control type="text" placeholder="Enter Matimony Id" size="md" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="form-group">
                                            <Form.Control type="text" placeholder="Enter Username" size="md" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="form-group">
                                            <Form.Control type="text" placeholder="Enter Useremail" size="md" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="pb-2">
                                    <button type="submit" className="btn btn-gradient-primary mr-2">Search</button>
                                </div>
                            </Form>

                            <DataTableRemote
                                noHeader={true}
                                subHeader={false}
                                columns={columns}
                                data={users}
                                handlePageChange={handlePageChange}
                                handlePerRowsChange={handlePerRowsChange}
                                totalRows={totalRows}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
};

export default Users;