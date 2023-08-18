import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../Stores";
import { CurrentUserViewModel } from "../ViewModels/CurrentUserViewModel";
import { BASE_PATH, routeConfig, RouterConfig } from "./Routes";

const notFoundComp = (<div><h1>404</h1><div><a href="/">back to home me</a></div></div>);

export default function RequiredAuth({ children, route }: { children: any, route: RouterConfig }) {
    const { userContext, sRequiredAuth } = useStore();
    const navigate = useNavigate();

    if (route.pattern == BASE_PATH && userContext == null) {
        return children;
    } else {
        if (route.allowAnonymous == true){
            return children;
        }
        else {
            if (userContext != null && CurrentUserViewModel.isHaveRoles(userContext, route.roles || [])) {
                return children;
            } else {
                sRequiredAuth.set_redirectPath(window.location.pathname);
                return routeConfig.InitPage.comp;
            }
        }
    }
}