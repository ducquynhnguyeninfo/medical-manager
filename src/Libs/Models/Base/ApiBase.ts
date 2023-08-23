import $ from "jquery";
import { DataConstant } from "../../Utils/DataConstant";
import { BaseEntitySharePointItem } from "../../ViewModels/BaseEntitySharePointItem";
import { ContextWebInformation } from "../../ViewModels/ContextWebInformation";
import { PagedData } from "../../ViewModels/PagedData";
import { QueryOption } from "./QueryOption";

const headerGeneral = {
    'Content-Type': 'application/json;odata=verbose',
    "Accept": "application/json"
}

export class ApiBase {
    static BASE_URI = process.env.REACT_APP_BASE_URL || "";

    static async get(url: string): Promise<[Error | undefined, any | undefined]> {
        try {
            let result = await $.ajax(
                {
                    url: url,
                    type: "GET",
                    contentType: "application/json;odata=verbose",
                    headers: headerGeneral
                });
            if (result.value != undefined)
                return [undefined, result.value]
            else
                return [undefined, result]
        } catch (ex) {
            if (ex instanceof Error)
                return [new Error(ex.message), undefined];
            else
                return [new Error("Lỗi không xác định khi lấy dữ liệu"), undefined];
        }

    }

    static async post<T>(url: string, body: BaseEntitySharePointItem): Promise<[Error | undefined, T | undefined]> {
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

    static async put<T>(url: string, body: BaseEntitySharePointItem): Promise<[Error | undefined, T | undefined]> {
        try {
            let postHeader: any = { ...headerGeneral };

            if (url.endsWith("/_api/contextinfo") == false) {
                let [err, webContext] = await this.get_WebContextInfo();
                if (err != undefined || webContext == null)
                    throw new Error("Không thể lấy thông tin website");

                postHeader["X-RequestDigest"] = webContext.FormDigestValue;
                postHeader["If-Match"] = "*";
                postHeader["X-HTTP-Method"] = "MERGE"
            }
            let result = await $.ajax(
                {
                    url: url,
                    type: "POST",
                    contentType: "application/json;odata=verbose",
                    data: JSON.stringify(body),
                    headers: postHeader
                });

            if (result != null && result.value != null)
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

    static async delete<T>(url: string, item: BaseEntitySharePointItem): Promise<[Error | undefined, T | undefined]> {
        try {
            let postHeader: any = { ...headerGeneral };

            if (url.endsWith("/_api/contextinfo") == false) {
                let [err, webContext] = await this.get_WebContextInfo();
                if (err != undefined || webContext == null)
                    throw new Error("Không thể lấy thông tin website");

                postHeader["X-RequestDigest"] = webContext.FormDigestValue;
                postHeader["If-Match"] = item["odata.etag"];
            }

            let result = await $.ajax(
                {
                    url: url,
                    type: "DELETE",
                    contentType: "application/json;odata=verbose",
                    headers: postHeader
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
        return ApiBase.post<ContextWebInformation>(m_Url, new BaseEntitySharePointItem());
    }

    static async Count(listTitle: string): Promise<number> {
        var m_Url = ApiBase.BASE_URI + "/_api/web/lists/getByTitle('" + listTitle + "')/ItemCount";
        let [, count] = await ApiBase.get(m_Url);
        if (count != undefined)
            return count as number;
        else return 0;
    }

    static getItemById<T>(url: string, listTitle: string, id: string, queryOption: QueryOption<T>): Promise<[Error | undefined, object | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items(" + id + ")/";
        m_Url += "?$select=" + queryOption.select;
        m_Url += queryOption.expand != "" ? "&$expand=" + queryOption.expand : "";
        return ApiBase.get(m_Url);
    }

    static async getItems(url: string, listTitle: string, queryOption: QueryOption<any>): Promise<PagedData<any>> {
        if (queryOption.page == null) queryOption.page = 0;
        if (queryOption.size == null) queryOption.size = DataConstant.PAGE_SIZE;

        //reset paging when parameter change
        if (queryOption.currentPageData !== null && ((queryOption.size != queryOption.currentPageData.Size)
            || (queryOption.currentPageData.Select != queryOption.select)
            || (queryOption.currentPageData.Expand != queryOption.expand)
            || (queryOption.currentPageData.Filter != queryOption.filter)
            || (queryOption.currentPageData.Order != queryOption.order)
        )) {
            queryOption.currentPageData = null
            queryOption.page = 0;
        }

        let m_Url = "";
        if (queryOption.currentPageData == null || (queryOption.page >= queryOption.currentPageData?.PagingLink.length)) {
            //create link for next page
            m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items/";
            m_Url += "?$select=" + (queryOption.select || "");
            m_Url += (queryOption.expand || "") != "" ? "&$expand=" + queryOption.expand : "";
            m_Url += (queryOption.filter || "") != "" ? "&$filter=" + queryOption.filter : "";
            m_Url += queryOption.order != undefined ? "&$orderby=" + queryOption.order : "";
            m_Url += QueryOption.getPagingText(queryOption);
            m_Url += "&$top=" + queryOption.size;
        } else {
            //privious page
            m_Url = queryOption.currentPageData.PagingLink[queryOption.page];
        }


        let result = new PagedData<any>();
        result.Page = queryOption.page;
        result.Size = queryOption.size;
        result.Expand = queryOption.expand;
        result.Filter = queryOption.filter;
        result.Order = queryOption.order;
        result.Select = queryOption.select;
        //lưu lại link vào bảng paging link để có thể quay lại trang trước đó
        if (queryOption.currentPageData == null || (queryOption.page >= queryOption.currentPageData.PagingLink.length)) {
            //next page
            if (queryOption.currentPageData == null) {
                //khởi tạo mảng ban đầu
                result.PagingLink = [];
            } else {
                //copy lại paging link trước đó

                result.PagingLink = queryOption.currentPageData.PagingLink;

            }
            //thêm mới link hiện tại
            if (result.PagingLink.length <= queryOption.page) {
                result.PagingLink.push(m_Url);
            }
        } else {
            //privious page
            result.PagingLink = queryOption.currentPageData.PagingLink;
            result.PagingLink.slice(queryOption.page);
        }

        let [error, data] = await ApiBase.get(m_Url);
        if (error != undefined)
            return result;

        let total = await ApiBase.Count(listTitle);
        result.Data = data || [];
        result.Total = total;
        return result;
    }

    static getItemsNoAsync<T>(url: string, listTitle: string, queryOption: QueryOption<T>): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items/";
        m_Url += "?$select=" + queryOption.select;
        m_Url += queryOption.expand != "" ? "&$expand=" + queryOption.expand : "";
        m_Url += queryOption.filter != "" ? "&$filter=" + queryOption.filter : "";
        m_Url += queryOption.order != "" ? "&$orderby=" + queryOption.order : "";
        m_Url += "&$top=99999";
        return ApiBase.get(m_Url);
    }

    static addItem<T>(url: string, listTitle: string, item: any): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items";
        return ApiBase.post<T>(m_Url, item);
    }

    static addItemNoAsync<T>(url: string, listTitle: string, item: any): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items";
        return ApiBase.post<T>(m_Url, item);
    }

    static updateItem<T>(url: string, listTitle: string, item: BaseEntitySharePointItem): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items(" + item.ID + ")";
        return ApiBase.put<T>(m_Url, item);
    }

    static updateItemNoAsync<T>(url: string, listTitle: string, item: BaseEntitySharePointItem): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items(" + item.ID + ")";
        return ApiBase.put<T>(m_Url, item);
    }

    static deleteItem<T>(url: string, listTitle: string, item: BaseEntitySharePointItem): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items(" + item.ID + ")";
        return ApiBase.delete<T>(m_Url, item);
    }

    static deleteItemNoAsync<T>(url: string, listTitle: string, item: BaseEntitySharePointItem): Promise<[Error | undefined, T | undefined]> {
        var m_Url = url + "/_api/web/lists/getByTitle('" + listTitle + "')/items(" + item.ID + ")";
        return ApiBase.delete<T>(m_Url, item);
    }
}