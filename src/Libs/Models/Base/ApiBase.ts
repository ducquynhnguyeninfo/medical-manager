import $ from "jquery";
import { TestViewModel } from "../../ViewModels/TestViewModel";

const headerGeneral = {
    'Content-Type': 'application/json',
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
            let result = await $.ajax(
                {
                    url: url,
                    type: "POST",
                    contentType: "application/json;odata=verbose",
                    data: JSON.stringify(body),
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

    static getItemById<T>(url: string, listTitle: string, select: string, expand: string, id: string): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items(" + id + ")/";
        m_Url += "?$select=" + select;
        m_Url += expand != "" ? "&$expand=" + expand : "";
        return ApiBase.get<T>(m_Url);
    }

    static async getItems<T>(url: string, listTitle: string, select: string, expand: string, filter: string, order: string): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items/";
        m_Url += "?$select=" + select;
        m_Url += expand != "" ? "&$expand=" + expand : "";
        m_Url += filter != "" ? "&$filter=" + filter : "";
        m_Url += order != "" ? "&$orderby=" + order : "";
        m_Url += "&$top=99999";

        let result = await ApiBase.get<T>(m_Url);
        return result;
    }

    static getItemsNoAsync<T>(url: string, listTitle: string, select: string, expand: string, filter: string, order: string): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items/";
        m_Url += "?$select=" + select;
        m_Url += expand != "" ? "&$expand=" + expand : "";
        m_Url += filter != "" ? "&$filter=" + filter : "";
        m_Url += order != "" ? "&$orderby=" + order : "";
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