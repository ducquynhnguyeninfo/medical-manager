import { DataConstant } from "../Utils/DataConstant";

export class PagedData<T>  {
    Data: Array<T> = [];
    Page: number = 0;
    Size: number = DataConstant.PAGE_SIZE;
    Total: number = 0;
    PagingLink: string[] = []
    Select?: string = "ID,Title";
    Expand?: string = "";
    Filter?: string = "";
    Order?: string = "";
}