import clsx from "clsx";
import PropTypes from "prop-types";

const Modal = (props) => {
    const { title, description, closeTxt, okTxt, visible, onVisible, onOk } =
        props;

    return (
        <div
            className={clsx("modal fade bg-[rgba(0,0,0,0.5)]", {
                "show block": visible,
            })}
            tabIndex="-1"
            onClick={onVisible}
        >
            <div className="modal-dialog">
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            onClick={onVisible}
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p>{description}</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={onVisible}
                        >
                            {closeTxt}
                        </button>
                        <button
                            onClick={onOk}
                            type="button"
                            className="btn btn-primary"
                        >
                            {okTxt}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    closeTxt: PropTypes.string,
    okTxt: PropTypes.string,
    visible: PropTypes.bool,
    onVisible: PropTypes.func,
    onOk: PropTypes.func,
};

export default Modal;
