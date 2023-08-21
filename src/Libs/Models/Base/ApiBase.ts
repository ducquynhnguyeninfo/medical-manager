import $ from "jquery";
import { DataConstant } from "../../Utils/DataConstant";
import { ContextWebInformation } from "../../ViewModels/ContextWebInformation";
import { PagedData } from "../../ViewModels/PagedData";
import { TestViewModel } from "../../ViewModels/TestViewModel";
import { QueryOption } from "./QueryOption";

const headerGeneral = {
    'Content-Type': 'application/json;odata=verbose',
    "Accept": "application/json"
}

export class ApiBase {
    static BASE_URI = process.env.REACT_APP_BASE_URL || "";

    static async get<T>(url: string): Promise<[Error | undefined, T | undefined]> {
        try {
            let result = await $.ajax(
                {
                    url: url,
                    type: "GET",
                    contentType: "application/json;odata=verbose",
                    headers: headerGeneral
                });
            if (result.value != undefined)
                return [undefined, result.value as any as T]
            else
                return [undefined, result as any as T]
        } catch (ex) {
            if (ex instanceof Error)
                return [new Error(ex.message), undefined];
            else
                return [new Error("Lỗi không xác định khi lấy dữ liệu"), undefined];
        }

    }

    static async post<T>(url: string, body: object): Promise<[Error | undefined, T | undefined]> {
        try {
            let postHeader: any = { ...headerGeneral };

            if (url.endsWith("/_api/contextinfo") == false) {
                let [err, webContext] = await this.get_WebContextInfo();
                if (err != undefined || webContext == null)
                    throw new Error("Không thể lấy thông tin website");

                postHeader["X-RequestDigest"] = webContext.FormDigestValue;
            }

            let result = await $.ajax(
                {
                    url: url,
                    type: "POST",
                    contentType: "application/json;odata=verbose",
                    data: JSON.stringify(body),
                    headers: postHeader
                });

            if (result.value != null)
                return [undefined, result.value as any as T]
            else
                return [undefined, result as any as T]
        } catch (ex) {
            if (ex instanceof Error)
                return [new Error(ex.message), undefined];
            else
                return [new Error("Lỗi không xác định khi lấy dữ liệu"), undefined];
        }

    }

    static async delete<T>(url: string): Promise<[Error | undefined, T | undefined]> {
        try {
            let result = await $.ajax(
                {
                    url: url,
                    type: "DELETE",
                    contentType: "application/json;odata=verbose",
                    headers: headerGeneral
                });
            return [undefined, result.value as any as T]
        } catch (ex) {
            if (ex instanceof Error)
                return [new Error(ex.message), undefined];
            else
                return [new Error("Lỗi không xác định khi lấy dữ liệu"), undefined];
        }
    }

    static async get_WebContextInfo(): Promise<[Error | undefined, ContextWebInformation | undefined]> {
        let m_Url = ApiBase.BASE_URI + "/_api/contextinfo";
        return ApiBase.post<ContextWebInformation>(m_Url, {});
    }

    static async Count(listTitle: string): Promise<number> {
        var m_Url = ApiBase.BASE_URI + "/_api/web/lists/getByTitle('" + listTitle + "')/ItemCount";
        let [error, count] = await ApiBase.get<any>(m_Url);
        return count;
    }

    static getItemById<T>(url: string, listTitle: string, id: string, queryOption: QueryOption): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items(" + id + ")/";
        m_Url += "?$select=" + queryOption.select;
        m_Url += queryOption.expand != "" ? "&$expand=" + queryOption.expand : "";
        return ApiBase.get<T>(m_Url);
    }

    static async getItems<T>(url: string, listTitle: string, queryOption: QueryOption): Promise<PagedData<T>> {
        if (queryOption.page == null) queryOption.page = 0;
        if (queryOption.size == null) queryOption.size = DataConstant.PAGE_SIZE;

        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items/";
        m_Url += "?$select=" + (queryOption.select || "");
        m_Url += (queryOption.expand || "") != "" ? "&$expand=" + queryOption.expand : "";
        m_Url += (queryOption.filter || "") != "" ? "&$filter=" + queryOption.filter : "";
        m_Url += "&$orderby=ID";
        if (queryOption.page > 0)
            m_Url += "&$skiptoken=Paged%3dTRUE%26p_ID%3d" + (queryOption.page * queryOption.size)
        m_Url += "&$top=" + queryOption.size;

        let result = new PagedData<T>();
        result.Page = queryOption.page;
        result.Size = queryOption.size;

        let [error, data] = await ApiBase.get<Array<T>>(m_Url);
        if (error != undefined)
            return result;

        let total = await ApiBase.Count(listTitle);
        result.Data = data;
        result.Total = total;
        return result;
    }

    static getItemsNoAsync<T>(url: string, listTitle: string, queryOption: QueryOption): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items/";
        m_Url += "?$select=" + queryOption.select;
        m_Url += queryOption.expand != "" ? "&$expand=" + queryOption.expand : "";
        m_Url += queryOption.filter != "" ? "&$filter=" + queryOption.filter : "";
        m_Url += queryOption.order != "" ? "&$orderby=" + queryOption.order : "";
        m_Url += "&$top=99999";
        return ApiBase.get<T>(m_Url);
    }

    static addItem<T>(url: string, listTitle: string, item: any): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items";
        return ApiBase.post<T>(m_Url, item);
    }

    static addItemNoAsync<T>(url: string, listTitle: string, item: any): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items";
        return ApiBase.post<T>(m_Url, item);
    }

    static updateItem<T>(url: string, listTitle: string, item: any, itemId: string): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items(" + itemId + ")";
        return ApiBase.post<T>(m_Url, item);
    }

    static updateItemNoAsync<T>(url: string, listTitle: string, item: any, itemId: string): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items(" + itemId + ")";
        return ApiBase.post<T>(m_Url, item);
    }

    static deleteItem<T>(url: string, listTitle: string, itemId: string): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items(" + itemId + ")";
        return ApiBase.delete<T>(m_Url);
    }

    static deleteItemNoAsync<T>(url: string, listTitle: string, itemId: string): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items(" + itemId + ")";
        return ApiBase.delete<T>(m_Url);
    }
}