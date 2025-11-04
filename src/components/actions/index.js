import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Actions(props) {
  const {
    editOnClick,
    viewOnClick,
    deleteOnClick,
    rowId,
    viewUrl,
    editUrl,
    id,
    updateOnClick,
    downloadOnClick,
    revertOnClick,
  } = props;

  return (
    <div>
      {updateOnClick && (
        <OverlayTrigger overlay={<Tooltip>Update Plan</Tooltip>}>
          <button
            className="btn btn-inverse-info btn-rounded btn-icon"
            onClick={() => updateOnClick(rowId)}
          >
            <i className="mdi mdi-update"></i>
          </button>
        </OverlayTrigger>
      )}
      {editOnClick && (
        <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
          <button
            className="btn btn-inverse-info btn-rounded btn-icon"
            onClick={() => editOnClick(rowId)}
          >
            <i className="mdi mdi-pencil"></i>
          </button>
        </OverlayTrigger>
      )}
      {editUrl && (
        <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
          <Link
            className="btn btn-inverse-info btn-rounded btn-icon"
            to={editUrl}
          >
            <i style={{ lineHeight: "2.2" }} className="mdi mdi-pencil"></i>
          </Link>
        </OverlayTrigger>
      )}
      {viewOnClick && (
        <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
          <button
            className="btn btn-inverse-primary btn-rounded btn-icon"
            onClick={() => viewOnClick(rowId)}
          >
            <i className="mdi mdi-eye"></i>
          </button>
        </OverlayTrigger>
      )}
      {deleteOnClick && (
        <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
          <button
            className="btn btn-inverse-danger btn-rounded btn-icon"
            onClick={() => deleteOnClick(rowId, id)}
          >
            <i className="mdi mdi-delete"></i>
          </button>
        </OverlayTrigger>
      )}
      {viewUrl && (
        <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
          <Link
            className="btn btn-inverse-primary btn-rounded btn-icon"
            to={viewUrl}
          >
            <i style={{ lineHeight: "2.2" }} className="mdi mdi-eye"></i>
          </Link>
        </OverlayTrigger>
      )}
      {downloadOnClick && (
        <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
          <button
            className="btn btn-inverse-primary btn-rounded btn-icon"
            onClick={() => downloadOnClick(rowId)}
          >
            <i className="mdi mdi-download"></i>
          </button>
        </OverlayTrigger>
      )}
      {revertOnClick && (
        <OverlayTrigger overlay={<Tooltip>Revert Profile</Tooltip>}>
          <button
            className="btn btn-inverse-success btn-rounded btn-icon"
            onClick={() => revertOnClick(rowId)}
          >
            <i className="mdi mdi-restore"></i>
          </button>
        </OverlayTrigger>
      )}
    </div>
  );
}
