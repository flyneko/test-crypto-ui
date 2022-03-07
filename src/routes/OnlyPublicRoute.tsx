import React from 'react';
import { Redirect } from 'react-router-dom';
import {useSelector} from "react-redux";
import {isLogged, isJustLogged} from "../redux/slices/auth";
import {URLS} from "./index";
import {BaseRoute} from "./BaseRoute";

export function OnlyPublicRoute(props: any) {
    const isAuth = useSelector(isLogged);
    const isJustLogin = useSelector(isJustLogged);

    return  !isAuth || isJustLogin? <BaseRoute {...props} /> : <Redirect to={URLS.Home} />;
}