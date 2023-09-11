import { retry } from "async";
import { DataConstant } from "../../Utils/DataConstant";
import { PagedData } from "../../ViewModels/PagedData";

// export enum ComparisionOperator {
//       // string comparisions
//       start_with = 'startsWith($_$)'
// }

// export enum StringOperator extends ComparisionOperator{
//       // string comparisions
//       start_with = 'startsWith($_$)'
// }
export enum ComparisionOperator {
    
    // numeric comparisions
    n_less_equal = 'le',
    n_less_than = 'lt',
    n_greater_than = 'gt',
    n_greater_equal = 'ge',
    n_equals = 'eq',
    n_not_equals = 'ne',

    // string 
    s_equals = 'eq',
    s_not_equals = 'ne',
    s_starts_with = "startsWith($$field, '$$val')",
    s_substring_of = 'substringOf($$field)',


    // date and time
    dt_day = 'day($$field) eq $$val',
    dt_month = 'month($$field) eq $$val',
    dt_year = "year($$field) eq $$val",
    dt_hour = 'hour($$field) eq $$val',
    dt_minute = 'minute($$field) eq $$val',
    dt_second = 'second($$field) eq $$val',
    
}

export class FilterBuilder extends Object {
    private static readonly conjunc_and: string = 'and';
    private static readonly conjunc_or: string = 'or';
    
    filter: string = "";

    static beginWith(comparison: ConditionBuilder): FilterBuilder {
        let builder = new FilterBuilder();
        builder.filter = comparison.build();
        return builder;
    }
    
    constructor() {
        super();
    }

    // begin(comparation: ConditionBuilder): FilterBuilder {
    //     if (this.filter.trim().length > 0) {
    //         throw new Error("Filter has begun already!")
    //     }
    //     this.filter += `${comparation.build()}`;
    //     return this;
    // }
    
    and(comparation: ConditionBuilder): FilterBuilder {
        
        if (this.filter.trim().length === 0) {
            this.filter += `${comparation.build()}`;
        } else {

            this.filter += ` ${FilterBuilder.conjunc_and} ${comparation.build()}`;
        }
        return this;
    }
    
    or(comparation: ConditionBuilder): FilterBuilder {
        if (this.filter.trim().length === 0) {
            this.filter += `${comparation.build()}`;
        } else {

            this.filter += ` ${FilterBuilder.conjunc_or} ${comparation.build()}`;
        }
        return this;
    }

    build(): string {
        return this.filter;
    }
}
export class ConditionBuilder extends Object {
    field: string;
    operator: ComparisionOperator;
    value: string;
    constructor(field: string, operator: ComparisionOperator, value: string) {
        super();
        this.field = field;
        this.operator = operator;
        this.value = value;

    }
    build(): string {
        return `${this.field} ${this.operator} ${this.value}`;
    }

    toString(): string {
        return this.build();
    }
}

export class QueryOption<T> {
    select?: string = "ID,Title";
    expand?: string = "";
    filter?: string = "";
    order?: string = "";
    page?: number = 0;
    size?: number = DataConstant.PAGE_SIZE
    currentPageData: PagedData<T> | null = null;

    static getPagingText<T>(queryOption: QueryOption<T>) {
        if (queryOption.order == null || queryOption.order === "")
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


    static buildFilter(comparisonOperatorBuilder: FilterBuilder) {
        return comparisonOperatorBuilder.build();
    }

}