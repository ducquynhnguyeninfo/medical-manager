import { Context, useContext } from "react";
import { AuthorizedStore } from "./AuthorizedStore";

export let StoreContext: Context<AuthorizedStore> = null as any;

export function setAuthorizedStoreContext(context: Context<AuthorizedStore>) {
    StoreContext = context;
}

export function useAuthorizedStore() {
    if (StoreContext == null) throw new Error("required setBaseStoreContext");
    return useContext(StoreContext);
}
