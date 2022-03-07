import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {useSelector} from "react-redux";
import {getAuthUser} from "../redux/slices/auth";
import {URLS} from "./index";

export function BaseRoute(props: any) {
    const authUser = useSelector(getAuthUser);

    return authUser.status == 'blocked' ? <Redirect to={URLS.Blocked} /> : <Route {...props} />;
}