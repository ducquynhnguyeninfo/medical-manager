import { createContext, useContext } from "react";
import { Store } from "./Store";


export const store = new Store();
export const StoreContext = createContext(store);

// setAuthorizedStoreContext(StoreContext as Context<any>);

export function useStore() {
    return useContext(StoreContext);
}
