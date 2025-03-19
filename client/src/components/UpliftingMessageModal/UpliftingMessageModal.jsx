import React from "react";
import PropTypes from "prop-types";
import "./UpliftingMessageModal.scss";

function UpliftingMessageModal({ isOpen, onClose, upliftingMessage }) {
  return (
    <>
      {isOpen && (
        <>
          {/* Modal Markup */}
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Uplifting Message</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>{upliftingMessage}</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onClose}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
}

UpliftingMessageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  upliftingMessage: PropTypes.string,
};

export default UpliftingMessageModal;
