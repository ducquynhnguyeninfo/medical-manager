import { ReactNode } from 'react';
import { createRouterState } from 'mobx-state-router';

import { toPairs } from "lodash-es";

import { Route } from 'react-router-dom';
import RequiredAuth from "./RequiredAuth";
import * as React from 'react';
import DanhSachThuoc from '../../Component/Danhsachthuoc/DanhSachThuoc';
import { Test } from '../../Component/Test/Index';
import { LoadingPageComponent } from '../../Component/LoadingPageComponent/Index';
import { Login } from '../../Component/Login/Login';

export const homeRoute = createRouterState("home");
export const notFound = createRouterState('notFound');

export const BASE_PATH = "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx";

export interface RouterConfig {
    pattern: string,
    comp: ReactNode,
    allowAnonymous?: boolean,
    confirmBeforeExit?: boolean,
    roles?: string[]
}

export const USER_ROLE = {
    USER: "USER"
}

export const routeConfig: {
    InitPage: RouterConfig,
    home: RouterConfig,
    test: RouterConfig,
    login: RouterConfig
} = {
    InitPage: { pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx", comp: (<LoadingPageComponent/>) },
    home: { pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx/Home", comp: (<DanhSachThuoc/>), allowAnonymous: false, roles: [USER_ROLE.USER] },
    test: { pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx/avasdf", comp: (<Test/>), allowAnonymous: false, roles: [USER_ROLE.USER] },
    login: {pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx/login", comp: (<Login />), allowAnonymous: true}
};

export const routers2 = toPairs(routeConfig).map(([name, value]) => {
    return (<Route key={name} path={value.pattern} element={<RequiredAuth route={value} children={value.comp} />} />
    )
})