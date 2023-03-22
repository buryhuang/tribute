import React from 'react';
import PropTypes from 'prop-types';

export default function Modal(props) {
    const { isVisible, isLoading, isCloseable, title, maxWidth, onClose, children } = props;

    return (
        <div className={`${isVisible ? 'fixed' : 'hidden'} inset-0 z-40 bg-gray-800 bg-opacity-70 flex flex-row sm:justify-center sm:items-center`}>
            <div className={`max-w-none ${maxWidth} w-full bg-gray-50 dark:bg-[#010911] sm:rounded sm:m-4`}>

                {/* Header */}
                <div className="flex flex-row items-center sm:justify-between gap-5 sm:gap-3 text-gray-700 dark:text-gray-200 px-2 sm:px-4 py-2 sm:py-4 border-b-2 border-gray-200 dark:border-gray-800">
                    {/* Close Button for Mobile */}
                    <span
                        className={`${isCloseable ? 'inline-block sm:hidden' : 'hidden'} cursor-pointer transition hover:scale-125`}
                        onClick={onClose}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </span>

                    {/* Title */}
                    <h1 className="text-lg truncate font-semibold">{title}</h1>

                    {/* Close Button for Desktop */}
                    <span
                        className={`${isCloseable ? 'hidden sm:inline-block' : 'hidden'} cursor-pointer transition hover:scale-125`}
                        onClick={onClose}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </span>
                </div>

                {/* Body */}
                <div className={`${isLoading ? 'hidden' : ''} my-2 px-3 py-2 text-gray-800 dark:text-white`}>
                    {children}
                </div>

                {/* Loading State */}
                <div className={`${isLoading ? 'flex' : 'hidden'} flex-col justify-center items-center py-10`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-loader text-gray-700 dark:text-white animation animate-spin w-10 h-10" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <line x1="12" y1="6" x2="12" y2="3" />
                        <line x1="16.25" y1="7.75" x2="18.4" y2="5.6" />
                        <line x1="18" y1="12" x2="21" y2="12" />
                        <line x1="16.25" y1="16.25" x2="18.4" y2="18.4" />
                        <line x1="12" y1="18" x2="12" y2="21" />
                        <line x1="7.75" y1="16.25" x2="5.6" y2="18.4" />
                        <line x1="6" y1="12" x2="3" y2="12" />
                        <line x1="7.75" y1="7.75" x2="5.6" y2="5.6" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

// Props validations
Modal.propTypes = {
    isVisible: PropTypes.bool,
    isLoading: PropTypes.bool,
    isCloseable: PropTypes.bool,
    title: PropTypes.string,
    maxWidth: PropTypes.string,
    onClose: PropTypes.func,
}
Modal.defaultProps = {
    isVisible: false,
    isLoading: false,
    isCloseable: true,
    title: 'Modal',
    maxWidth: 'max-w-lg',
    onClose: _ => {},
}