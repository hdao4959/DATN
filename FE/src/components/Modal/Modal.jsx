import clsx from "clsx";
import PropTypes from "prop-types";

const Modal = (props) => {
    const {
        title,
        description,
        closeTxt,
        okTxt,
        visible,
        onVisible,
        onOk,
        children,
    } = props;

    return (
        <div
            className={clsx("modal fade bg-[rgba(0,0,0,0.5)]", {
                "show block": visible,
            })}
            tabIndex="-1"
            onClick={() => onVisible(false)}
        >
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            onClick={() => onVisible(false)}
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {description ? <p>{description}</p> : children}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => onVisible(false)}
                        >
                            {closeTxt}
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onOk}
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
    children: PropTypes.node,
};

Modal.defaultProps = {
    title: "Modal Title",
    description: "",
    closeTxt: "Close",
    okTxt: "OK",
    visible: false,
    onVisible: () => {},
    onOk: () => {},
};

export default Modal;
