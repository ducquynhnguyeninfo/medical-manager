import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";
export class CurrentUserViewModel extends BaseEntitySharePointItem {
    Title: string = "";
    Email: string = "";
    Roles: string[] = [];

    static isHaveRoles(context: CurrentUserViewModel, requiredRoles: string[]) {
        if(context.Roles == null) {
            return false;
        }
        
        for(let i = 0; i < requiredRoles.length; i++) {
            if(context.Roles.indexOf(requiredRoles[i]) >= 0)
                return true;
        }
        return false;
    }
}