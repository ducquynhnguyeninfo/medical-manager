import { DataConstant } from "../../Utils/DataConstant";
import { PagedData } from "../../ViewModels/PagedData";

export class QueryOption<T> {
    select?: string = "ID,Title";
    expand?: string = "";
    filter?: string = "";
    order?: string = "";
    page?: number = 0;
    size?: number = DataConstant.PAGE_SIZE
    currentPageData: PagedData<T> | null = null;

    static getPagingText<T>(queryOption: QueryOption<T>) {
        if (queryOption.order == null || queryOption.order == "")
            return "";

        if (queryOption.currentPageData == null || queryOption.currentPageData.Data.length <= 0)
            return "";

        let lastItem = queryOption.currentPageData?.Data[queryOption.currentPageData?.Data.length - 1];

        let field = queryOption.order.split(' ')[0];
        let pagingString = `Paged=TRUE${QueryOption.getQuery(lastItem, "ID")}${QueryOption.getQuery(lastItem, field)}`
        return "&$skiptoken=" + encodeURIComponent(pagingString);
    }

    static getQuery<T>(lastItem: T | undefined, field: string) {
        if (lastItem === undefined)
            return "";

        let keys = Object.keys(lastItem as object);
        let values = Object.values(lastItem as object);
        let fieldIndex = keys.findIndex(e => e === field);

        if (fieldIndex >= 0) {
            if (field === "Created") {
                return "&p_" + field + "=" + values[fieldIndex].replaceAll("-", "").replaceAll("T", "%20").replaceAll(":", "%3a").replace("Z", "")
            }
            return "&p_" + field + "=" + values[fieldIndex];
        }
        return "";
    }
}