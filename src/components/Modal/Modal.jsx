import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyledModal, StyledOverlay } from './Modal.styled';

export function Modal({ modalData, onClose }) {
    useEffect(() => {
        const onPressKeyEsc = e => {
            if (e.code === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keyup', onPressKeyEsc);
        return () => {
            window.removeEventListener('keyup', onPressKeyEsc);
        };
    }, [onClose]);

    const onCloseModal = e => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <StyledOverlay onClick={onCloseModal}>
            <StyledModal>
                <img src={modalData.largeImgSrc} alt={modalData.alt} />
            </StyledModal>
        </StyledOverlay>
    );
}

Modal.propTypes = {
    modalData: PropTypes.shape({
        largeImgSrc: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};
