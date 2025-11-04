import { Modal } from "react-bootstrap";

const ModalCommon = (props) => {
    const {show, size, handleClose, modalTitle, children, centered, scrollable} = props;
    return(
        <Modal scrollable={scrollable} centered={centered} size={size} show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>{modalTitle}</Modal.Title>
                <button type="button" onClick={handleClose} className="close">
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">Close</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>
    )
};

export default ModalCommon;