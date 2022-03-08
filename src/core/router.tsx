import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import {Home} from "../pages/Home";
import { SignIn } from "../pages/SignIn";
import {isLogged} from "../redux/slices/auth";

const URLS = {
    Home: '/',
    SignIn: '/sign_in',
};

function RequireAuth({ c }: { c: any }) {
    const isAuth = useSelector(isLogged);
    const location = useLocation();
  
  
    return isAuth ? c : <Navigate to={URLS.SignIn} state={{ from: location }} />;
}


export { URLS }

export default function({children}: any) {
    return (
        <Router>
            {children}
            <Routes>
                <Route path="/" element={<RequireAuth c={<Home />}/>} />
                <Route path={URLS.SignIn} element={<SignIn />} />
            </Routes>
        </Router>
    );
}