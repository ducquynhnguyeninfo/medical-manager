import { createContext, useContext, Context } from "react";
import { Store } from "./Store";
import {setAuthorizedStoreContext} from "./useAuthorizedStore";


export const store = new Store();
export const StoreContext = createContext(store);

// setAuthorizedStoreContext(StoreContext as Context<any>);

export function useStore() {
    return useContext(StoreContext);
}
