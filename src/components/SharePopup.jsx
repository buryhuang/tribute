import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

export default function SharePopup({ link, shortLink, disabled, shareButtonClass }) {
    const [isVisible, setVisibility] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [modifiedLink, setModifiedLink] = useState(null);

    useEffect(() => setModifiedLink(`${shortLink !== null ? shortLink : window.location.origin + '/' + link}`) /* `` */, []);

    return(
        <>
            <div className="actions">

                {/* Share Button */}
                <span
                    className={`contents ${disabled ? 'pointer-events-none opacity-60' : ''}`}
                    onClick={_ => setVisibility(true)}
                >
                    <button
                        type="button"
                        className={`btn-primary ${shareButtonClass}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                    </button>
                </span>
            </div>

            {/* Share Dialog */}
            <div className={`fixed z-50 inset-0 overflow-y-auto transition duration-150 ease-in-out ${isVisible ? '' : 'hidden'}`}>
                <div className="flex items-center justify-center min-h-screen text-center">
                    <div
                        className="fixed inset-0 transition-opacity"
                        aria-hidden="true"
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    </div>

                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    {/* Modal */}
                    <div
                        className="inline-block rounded-md text-left overflow-hidden  transform transition-all align-middle mx-2 xs:mx-0 w-full xs:w-3/4 sm:max-w-lg"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-headline"
                    >
                        <div className="bg-white dark:bg-darkTopNavBg p-4">
                            <div className="sm:flex sm:items-start">
                                <div className="text-left w-full">

                                    {/* Popup title and close button */}
                                    <span className="header flex flex-row justify-between items-center">
                                        <h3 className="text-xl leading-6 font-medium text-dark-700 dark:text-dark-200">Share</h3>
                                        <button onClick={_ => setVisibility(false)}>
                                            <svg className="w-6 h-6 text-dark-700 dark:text-dark-300 scale-90 hover:scale-100 transition-transform duration-75" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>

                                    {/* Social links */}
                                    <div className="flex flex-row justify-between items-center mt-7">
                                        <a
                                            href={`https://www.facebook.com/sharer.php?u=${modifiedLink}`}
                                            target="_blank"
                                            className="rounded-full inline-flex justify-center items-center p-2 sm:p-3"
                                            style={{ backgroundColor: '#3b5998' }}
                                            rel="noreferrer"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="none" fill="#fff" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
                                            </svg>
                                        </a>
                                        <a
                                            href={`https://twitter.com/intent/tweet?text=${modifiedLink}`}
                                            target="_blank"
                                            className="rounded-full inline-flex justify-center items-center p-2 sm:p-3"
                                            style={{ backgroundColor: '#1da1f2'}}
                                            rel="noreferrer"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="none" fill="#fff" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z" />
                                            </svg>
                                        </a>
                                        <a
                                            href={`whatsapp://send?text=${modifiedLink}" data-action="share/whatsapp/share`}
                                            target="_blank"
                                            className="rounded-full inline-flex justify-center items-center p-2 sm:p-3"
                                            style={{ backgroundColor: '#24cd63'}}
                                            rel="noreferrer"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                                                <path d="M9 10a0.5 .5 0 0 0 1 0v-1a0.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a0.5 .5 0 0 0 0 -1h-1a0.5 .5 0 0 0 0 1" />
                                            </svg>
                                        </a>
                                        <a
                                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${modifiedLink}`}
                                            target="_blank"
                                            className="rounded-full inline-flex justify-center items-center p-2 sm:p-3"
                                            style={{ backgroundColor: '#0077b5'}}
                                            rel="noreferrer"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <rect x="4" y="4" width="16" height="16" rx="2" />
                                                <line x1="8" y1="11" x2="8" y2="16" />
                                                <line x1="8" y1="8" x2="8" y2="8.01" />
                                                <line x1="12" y1="16" x2="12" y2="11" />
                                                <path d="M16 16v-3a2 2 0 0 0 -4 0" />
                                            </svg>
                                        </a>
                                    </div>

                                    {/* Link to copy */}
                                    <div className="rounded-sm border border-dark-500 mt-7 py-2 px-3 flex flex-row justify-between items-center">
                                        <span className="truncate w-full select-all">{modifiedLink}</span>

                                        <span
                                            className="ml-2"
                                            title="Copy URL"
                                            onClick={_ => {
                                                navigator.clipboard.writeText(modifiedLink)
                                                setIsCopied(true);
                                                setTimeout(() => {
                                                    setIsCopied(false);
                                                }, 2000);
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-dark-500 hover:text-dark-600 cursor-pointer ${isCopied ? 'hidden' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>

                                            <svg x-show="isCopied" xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-green-500 ${isCopied ? '' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Props checking
SharePopup.propTypes = {
    link: PropTypes.string,
    shortLink: PropTypes.string,
    disabled: PropTypes.bool,
    shareButtonClass: PropTypes.string,
}

// Default Props
SharePopup.defaultProps = {
    link: '',
    shortLink: '',
    disabled: false,
    shareButtonClass: '',
}