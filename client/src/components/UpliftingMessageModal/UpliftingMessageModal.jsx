import React from "react";
import ReactModal from "react-modal";
import PropTypes from "prop-types";
import closeIcon from "../../assets/images/close-24px.svg";
import "./UpliftingMessageModal.scss";

ReactModal.setAppElement("#root");

function UpliftingMessageModal({ isOpen, onClose, upliftingMessage }) {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal"
            overlayClassName="modal-overlay"
        >
            <div className="modal__header">
                <img
                    src={closeIcon}
                    alt="close-icon"
                    className="modal__close-button"
                    aria-label="Close"
                    onClick={onClose}
                />
            </div>
            <div className="modal__body">
                <div className="modal__content">
                    <h1 className="uplifting-message__header">Uplifting Message:</h1>
                    <p className="uplifting-message__text">{upliftingMessage}</p>
                </div>
                <div className="modal__buttons">
                    <button
                        onClick={onClose} // Call onClose when the button is clicked
                        className="modal__button modal__button--confirm"
                    >
                        Ok
                    </button>
                </div>
            </div>
        </ReactModal>
    );
}

UpliftingMessageModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    upliftingMessage: PropTypes.string,
};

export default UpliftingMessageModal;