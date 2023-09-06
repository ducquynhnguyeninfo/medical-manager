import { ReactNode } from 'react';
import { createRouterState } from 'mobx-state-router';

import { toPairs } from "lodash-es";

import { Route } from 'react-router-dom';
import RequiredAuth from "./RequiredAuth";
import DanhSachThuoc from '../../Component/Danhsachthuoc/DanhSachThuoc';
import { Test } from '../../Component/Test/Index';
import { LoadingPageComponent } from '../../Component/LoadingPageComponent/Index';
import { Login } from '../../Component/Login/Login';
import { InputOutputMedicineList } from '../../Component/InputOutputMedicine/InputOutputMedicineList';
import { InputMedicine } from '../../Component/InputOutputMedicine/InputMedicine/Index';
import { OutputMedicine } from '../../Component/InputOutputMedicine/OutputMedicine/Index';
import { AppointmentList } from '../../Component/Appointment/AppointmentList';
import { AddAppointment } from '../../Component/Appointment/AddAppointment/Index';
import { ReportPatientComponent } from '../../Component/ReportPatient';
import { ReportMedicineComponent } from '../../Component/ReportMedicine';

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
    login: RouterConfig,
    NhapXuatThuoc: RouterConfig,
    NhapThuoc: RouterConfig,
    XuatThuoc: RouterConfig,
    Appointment: RouterConfig,
    AddAppointment: RouterConfig,
    MedicineReport: RouterConfig,
    PatientReport: RouterConfig,
} = {
    InitPage: { pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx", comp: (<LoadingPageComponent/>) },
    home: { pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx/Home", comp: (<DanhSachThuoc/>), allowAnonymous: false, roles: [USER_ROLE.USER] },
    test: { pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx/avasdf", comp: (<Test/>), allowAnonymous: false, roles: [USER_ROLE.USER] },
    login: {pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx/login", comp: (<Login />), allowAnonymous: true},
    NhapXuatThuoc: { pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx/nhap-xuat-thuoc", comp: (<InputOutputMedicineList/>), allowAnonymous: false, roles: [USER_ROLE.USER] },
    NhapThuoc: { pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx/nhap-xuat-thuoc/nhap/:ticketID", comp: (<InputMedicine/>), allowAnonymous: false, roles: [USER_ROLE.USER] },
    XuatThuoc: { pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx/nhap-xuat-thuoc/xuat/:ticketID", comp: (<OutputMedicine/>), allowAnonymous: false, roles: [USER_ROLE.USER] },
    Appointment: { pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx/kham-benh", comp: (<AppointmentList/>), allowAnonymous: false, roles: [USER_ROLE.USER] },
    AddAppointment: { pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx/kham-benh/:appointmentID", comp: (<AddAppointment/>), allowAnonymous: false, roles: [USER_ROLE.USER] },
    
    MedicineReport: { pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx/report-medicine", comp: (<ReportMedicineComponent/>), allowAnonymous: false, roles: [USER_ROLE.USER] },
    PatientReport: { pattern: "/sites/e-form-test/quanlythuoc/SitePages/Admin.aspx/report-patient", comp: (<ReportPatientComponent/>), allowAnonymous: false, roles: [USER_ROLE.USER] },
};

export const routers2 = toPairs(routeConfig).map(([name, value]) => {
    return (<Route key={name} path={value.pattern} element={<RequiredAuth route={value} children={value.comp} />} />
    )
})