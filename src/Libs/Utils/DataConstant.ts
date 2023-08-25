import React from "react";
import { useLocation } from "react-router-dom";

export class DataConstant {
    static PAGE_SIZE = 10;
    static CONTAINER_PADDING = "20px";
    static SPACE_BETWEEN_TITLE_CONTENT = "20px";
}

export function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }