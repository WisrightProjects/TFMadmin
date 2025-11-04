import { Link } from "react-router-dom";

const BreadCrumb = (props) => {
    const { pageFor } = props;
    return (
        <div className="page-header">
            <h3 className="page-title">
                {pageFor}
            </h3>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {pageFor}
                    </li>
                </ol>
            </nav>
        </div>
    )
};

export default BreadCrumb;