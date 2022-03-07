import React from 'react';
import { Redirect } from 'react-router-dom';
import {useSelector} from "react-redux";
import {isLogged} from "../redux/slices/auth";
import {URLS} from "./index";
import {BaseRoute} from "./BaseRoute";

export function PrivateRoute({routeComponent, ...props}: any) {
    const isAuth = useSelector(isLogged),
          Component = routeComponent || BaseRoute;

    return isAuth ? <Component {...props} /> : <Redirect to={{ pathname: URLS.AuthLogin, state: { from: props.location }}} />;
}