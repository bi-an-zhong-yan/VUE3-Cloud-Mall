//书写属性相关的api文件
//引入二次封装的axios
import request from "@/utils/request";
//引入定义的数据类型
import type { CategoryResponseData, AttrResponseData, Attr } from "./type";
//枚举接口
enum API {
    //获取一级分类的接口地址
    C1_URL = '/admin/product/getCategory1',
    //获取二级分类的接口地址
    C2_URL = '/admin/product/getCategory2/',
    //获取三级分类接口的地址
    C3_URL = '/admin/product/getCategory3/',
    //获取分类下已有的属性和属性值接口地址
    ATTR_URL = '/admin/product/attrInfoList/',
    //添加或修改已有的属性接口
    ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
    //删除已有的属性接口
    DELETEATTR_URL='/admin/product/deleteAttr/'
}
//获取一级接口分类的方法
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL);
//获取二级接口分类的方法
export const reqC2 = (category1Id: number | string) => request.get<any, CategoryResponseData>(API.C2_URL + category1Id);
//获取三级接口分类的方法
export const reqC3 = (category2Id: number | string) => request.get<any, CategoryResponseData>(API.C3_URL + category2Id);
//获取对应分类下已有的属性和属性值接口
export const reqAttr = (category1Id: string | number, category2Id: string | number, category3Id: string | number) => request.get<any, AttrResponseData>(API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`)
//新增或修改已有的属性接口
export const reqAddOrUpdateAttr = (data: Attr) => request.post<any, any>(API.ADDORUPDATEATTR_URL, data)
//删除属性接口
export const reqRemoveAttr = (attrId:number)=>request.delete<any,any>(API.DELETEATTR_URL+attrId)

