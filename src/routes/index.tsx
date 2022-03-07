import React from "react";
import { BrowserRouter as Router, Route as NativeRoute, Switch, useParams, useHistory, RouteProps } from "react-router-dom";
import {Home} from "../pages/Home";
import {AuthEmailLink} from "../pages/AuthEmailLink";
import {AuthLoginPassword} from "../pages/AuthLoginPassword";
import {ForgotPassword} from "../pages/ForgotPassword";
import {UserEdit} from "../pages/UserEdit";
import {PrivateRoute} from "./PrivateRoute";
import {OnlyPublicRoute} from "./OnlyPublicRoute";
import {NotFound} from "../pages/NotFound";
import {GameCreate} from "../pages/GameCreate";
import {Game} from "../pages/Game";
import {GameInvite} from "../pages/GameInvite";
import {GameSettings} from "../pages/GameSettings";
import {useSelector} from "react-redux";
import {getTempEmail, isLogged} from "../redux/slices/auth";
import {GameLanding} from "../pages/GameLanding";
import {AuthEmailSent} from "../pages/AuthEmailSent";
import {PlayerForm} from "../pages/PlayerForm";
import {WhoIsSanta} from "../pages/WhoIsSanta";
import {Recommendations} from "../pages/Recommendations";
import {Wishlist} from "../pages/Wishlist";
import {ShopFrame} from "../pages/ShopFrame";
import {Chat} from "../pages/Chat";
import {AuthRegister} from "../pages/AuthRegister";
import {NewPassword} from "../pages/NewPassword";
import {GameLayout} from "../layouts/GameLayout";
import {SimplePage} from "../layouts/SimplePage";
import {GamePurchasePRO} from "../pages/GamePurchasePRO";
import {Toss} from "../pages/Toss";
import {Blocked} from "../pages/Blocked";
import {BaseRoute as Route} from "./BaseRoute";
import {FastToss} from "../pages/FastToss";
import {isDevelopmentEnv} from "../helpers/utils";
import {AuthSetPassword} from "../pages/AuthSetPassword";

const URLS = {
    Home: '/',
    AuthLogin: '/login',
    AuthEmailSent: '/email_links/sent',
    AuthLoginPassword: '/users/sign_in',
    AuthRegister: '/signup',
    AuthSetPassword: '/set_password',
    ForgotPassword: '/forgot_password',
    NewPassword: '/users/password/edit',
    UserEditInfo: '/users/edit',
    UserSignOut: '/users/sign_out',
    GameCreate: '/games/new',
    Games: '/games',
    PlayableGames: '/playable_games',
    Shop: '/shop',
    ShopFrame: '/shop_frame',
    Wishlist: '/wishlist',
    PublicWishlist: '/wishlist/:userId',
    Blocked: '/email_confirm',
    FastToss: '/fast-toss',
    Game(sub: string | 'recommendations' | 'toss' | 'questionary' | 'settings' | 'purchase' | 'invite' | 'who_is_santa' = '', customGameId = '') {
        //@ts-ignore
        return URLS.Games + '/' + (customGameId || window.game_id) + (sub ? '/' + sub : '');
    },
    UserWishlist(userId) {
        return `${this.Wishlist}/${userId}/liked`
    },
    Privacy: 'https://mysanta.ru/privacy_policy',
    Terms: 'https://mysanta.ru/terms'
};

export { URLS }

interface LayoutGroup {
    Layout: React.FunctionComponent,
    BaseRouteComponent?: React.FunctionComponent,
    routes: Array<{ RouteComponent?: React.FunctionComponent } & any>
}

export function Routes({children}) {
    const isAuth = useSelector(isLogged),
          tempEmail = useSelector(getTempEmail);

    const layoutGroups = [
        {
            Layout: SimplePage,
            BaseRouteComponent: Route,
            routes: [
                { path: URLS.FastToss, component: FastToss, exact: true },
                { path: URLS.AuthSetPassword, component: AuthSetPassword, exact: true },
            ]
        },
        {
            Layout: SimplePage,
            BaseRouteComponent: OnlyPublicRoute,
            routes: [
                { path: URLS.AuthLogin, component: AuthEmailLink, exact: true },
                { path: URLS.AuthRegister, component: AuthRegister, exact: true },
                { path: URLS.AuthLoginPassword, component: AuthLoginPassword, exact: true },
                { path: URLS.ForgotPassword, component: ForgotPassword, exact: true },
                { path: URLS.NewPassword, component: NewPassword, exact: true },
                { path: URLS.AuthEmailSent, component: tempEmail ? AuthEmailSent : NotFound, exact: true },
            ]
        },
        {
            Layout: GameLayout,
            BaseRouteComponent: PrivateRoute,
            routes: [
                { path: URLS.Game('invite', ':id'), component: GameInvite },
                { path: URLS.Game('questionary', ':id'), component: PlayerForm },
                { path: URLS.Game('settings', ':id'), component: GameSettings },
                { path: URLS.Game('purchase', ':id'), component: GamePurchasePRO },
                { path: URLS.Game('who_is_santa', ':id'), component: WhoIsSanta },
                { path: URLS.Game('recommendations', ':id'), component: Recommendations },
                { path: URLS.Game('toss/:requestMode', ':id'), component: Toss },
                { path: URLS.Game('toss', ':id'), component: Toss },
                { path: URLS.Game('chat/:requestMode', ':id'), component: Chat },
                { path: URLS.Game('chat', ':id'), component: Chat },
                ...(isAuth ? [{ path: URLS.Game('', ':id'), component: Game }] : []),
            ]
        },
    ] as Array<LayoutGroup>;

    return (
        <Router>
            {children}
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path={`${URLS.Wishlist}/:userId/:mode`} component={Wishlist} />
                <Route path={[URLS.PublicWishlist, URLS.Wishlist, URLS.Shop]} component={Wishlist} />
                <Route path={URLS.ShopFrame} exact component={ShopFrame} />
                <PrivateRoute path={URLS.UserEditInfo} exact component={UserEdit} />
                <PrivateRoute path={URLS.GameCreate} exact component={GameCreate} />
                <PrivateRoute path={URLS.Blocked} routeComponent={NativeRoute} component={Blocked} />

                {layoutGroups.map(({Layout, BaseRouteComponent, routes}, i) => {
                    const RouteComponent = BaseRouteComponent || Route;
                    return (
                        <RouteComponent key={i} exact={routes.some(r => r.exact)} path={routes.map(r => r.path)}>
                            <Layout>
                                <Switch>
                                    {routes.map(({RouteComponent, ...route}: any, i: number) => {
                                        const Component = RouteComponent || Route;
                                        return <Component key={i} {...route} />;
                                    })}
                                </Switch>
                            </Layout>
                        </RouteComponent>
                    )
                })}
                {!isAuth && <Route path={URLS.Game('', ':id')} component={GameLanding} />}

                <NativeRoute component={() => <SimplePage><NotFound /></SimplePage>} />
            </Switch>
        </Router>
    );
}