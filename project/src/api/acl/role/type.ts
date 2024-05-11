export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
//职位数据类型
export interface RoleData {
    "id"?: number,
    "createTime"?: string,
    "updateTime"?: string,
    "roleName": string,
    "remark"?: null
}
//全部职位的数组的ts类型
export type Records = RoleData[]
//全部职位数据相应的ts类型
export interface RoleResopnseData extends ResponseData {
    data: {
        records: Records,
        "total": number,
        "size": number,
        "current": number,
        "orders": [],
        "optimizeCountSql": boolean,
        "hitCount": boolean,
        "countId": null,
        "maxLimit": null,
        "searchCount": boolean,
        "pages": number
    }
}
export interface MenuData {
    "id": number,
    "createTime": string,
    "updateTime": string,
    "pid": number,
    "name": string,
    "code":string,
    "toCode": string,
    "type": number,
    "status": null,
    "level": number,
    "children": MenuList,
    "select": boolean
}
export type MenuList=MenuData[]
//菜单权限与按钮权限数据的ts类型
export interface MenuResponseData extends ResponseData{
    data:MenuList
}