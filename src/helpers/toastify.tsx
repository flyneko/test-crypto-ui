import {toast, Flip, ToastOptions} from 'react-toastify';
import React from "react";
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    pauseOnFocusLoss: false,
    draggable: true,
    transition: Flip,
} as ToastOptions;

const toastify = {
    call(msg, type) {
        toast[type](<div dangerouslySetInnerHTML={{ __html: msg }} />, defaultOptions);
    },
    error(msg: any) {
        this.call(msg, 'error');
    },
    success(msg: any) {
        this.call(msg, 'success');
    }
}

export { toastify, defaultOptions }