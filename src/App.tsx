import React, { Suspense } from "react";
import Routes from "./core/router";
import {useEffect} from "react";
import {ToastContainer} from "react-toastify";
import {useLocation} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, getToken } from "./redux/slices/auth";


function ScrollToTop() {
    const location = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0)    
    }, [location]);

    return null;
}

export function App() {
    const dispatch = useDispatch();
    const token = useSelector(getToken);

    useEffect(() => {
        token && dispatch(fetchUserInfo());
    }, [token]);

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