import { DataConstant } from "../../Utils/DataConstant";

export class QueryOption {
    select?: string = "ID,Title";
    expand?: string = "";
    filter?: string = "";
    order?: string = "";
    page?: number = 0;
    size?: number = DataConstant.PAGE_SIZE
}