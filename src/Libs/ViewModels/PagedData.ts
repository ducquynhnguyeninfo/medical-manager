import { DataConstant } from "../Utils/DataConstant";

export class PagedData<T>  {
    Data: Array<T> | undefined;
    Page: number = 0;
    Size: number = DataConstant.PAGE_SIZE;
    Total: number = 0;
}