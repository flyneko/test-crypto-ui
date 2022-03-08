import React, { Suspense } from "react";
import Routes from "./core/router";
import {useEffect} from "react";
import {ToastContainer} from "react-toastify";
import {useLocation} from "react-router-dom";


function ScrollToTop() {
    const location = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0)    
    }, [location]);

    return null;
}

export function App() {
    useEffect(() => {
        const rootEl = document.getElementById('root');
        rootEl && rootEl.classList.remove('preloader');
    }, []);

    return (
        <>
            <Suspense fallback={<div className="preloader" />}>
                <Routes>
                    <ScrollToTop />
                    <ToastContainer enableMultiContainer={true} limit={10} />
                </Routes>
            </Suspense>
        </>
    );
}