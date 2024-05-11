//品牌管理模块的接口
import request from "@/utils/request"
//引入数据类型
import type {TradeMarkResponseData,Trademark} from "./type"
//品牌管理模块接口地址
enum API {
    //获取品牌接口
    TRADEMARK_URL = "/admin/product/baseTrademark/",
    //添加品牌请求地址
    ADDTRADEMARK_URL="/admin/product/baseTrademark/save",
    //修改已有品牌
    UPDATETRADEMARK_URL="/admin/product/baseTrademark/update",
    //删除已有品牌
    DELETE_URL="DELETE /admin/product/baseTrademark/remove/"
}
//获取已有品牌的接口方法
//page:获取第几页？(默认第一)
//limit：获取几个已有品牌的数据
export const reqHasTrademark = (page: number, limit: number) => request.get<any,TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)
//添加与修改已有品牌接口方法
export const reqAddOrUpdateTrademark=(data:Trademark)=>{
    //发送的请求有id，修改原有品牌数据
    if(data.id){
        return request.put<any>(API.UPDATETRADEMARK_URL,data)
    }else{
        //新增接口
        return request.post<any>(API.ADDTRADEMARK_URL,data)
    }
}
//删除已有品牌接口方法
export const reqDeleteTrademark=(id:number)=>{API.DELETE_URL+id}