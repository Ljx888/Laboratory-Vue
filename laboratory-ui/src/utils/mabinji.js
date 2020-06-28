
export function addDateRange(params, dateRange) {
    var search = params;
    search.beginTime = "";
    search.endTime = "";
    if (null != dateRange && '' != dateRange) {
        search.beginTime = this.dateRange[0];
        search.endTime = this.dateRange[1];
    }
    return search;
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}
