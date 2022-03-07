import React, { Suspense } from "react";
import { Routes } from "../routes";
import {useEffect} from "react";
import {Notifications as ChatNotifications} from "../components/Chat";
import {ToastContainer} from "react-toastify";
import {useHistory} from "react-router-dom";
import {TelegramRedirect} from "../components/TelegramRedirect";
import {isLogged, setUserInfo} from "../redux/slices/auth";
import {useDispatch, useSelector} from "react-redux";
import {SuccessModal} from "../modals/SuccessModal";
import {Channel} from "../components/Channel";
import {PAGE_RELOAD_INTERVAL_H} from "./constants";

declare global {
    interface Window { __STATE__: any; }
}

function ScrollToTop() {
    const history = useHistory();
    useEffect(() => {
        const unlisten = history.listen((location, action) => {
            action !== 'POP' && window.scrollTo(0, 0);
        });

        return () => unlisten();
    }, []);
    return null;
}

export function App() {
    const dispatch = useDispatch(),
          isAuth = useSelector(isLogged),
          onListenSocket = ({event}: any) => {
              if (event != 'user_blocked') return;
              dispatch(setUserInfo({status: 'blocked'}));
          };

    useEffect(() => {
        const rootEl = document.getElementById('root');
        rootEl && rootEl.classList.remove('preloader');

        setTimeout(() => window.location.reload(), PAGE_RELOAD_INTERVAL_H * 60 * 60 * 1000);
    }, []);

    return (
        <>
            {isAuth && <Channel name="RoomNotifications" onReceive={onListenSocket} />}
            <Suspense fallback={<div className="preloader" />}>
                <Routes>
                    <SuccessModal />
                    <TelegramRedirect />
                    <ScrollToTop />
                    <ToastContainer enableMultiContainer={true} limit={10} />
                    <ChatNotifications />
                </Routes>
            </Suspense>
        </>
    );
}