import request from "@/utils/request";
import { PermisstionResponsedata } from "./type";
//枚举地址
enum API{
    //获取全部菜单与按钮的标识
    ALLPERMISSTION_URL='/admin/acl/permission',
    //给某一集新增菜单
    ADDMENU_URL='/admin/acl/permission/save',
    //更新已有的菜单
    UPDATEMENU_URL='/admin/acl/permission/update',
    //删除菜单
    REMOVEMENU_URL='/admin/acl/permission/remove/'
}
//获取菜单数据
export const reqAllPermisstion=()=> request.get<any,PermisstionResponsedata>(API.ALLPERMISSTION_URL)
//添加与更新菜单的方法
export const reqAddOrUpdateMenu=(data:MenuParams)=>{
    if(data.id){
        return request.put<any,any>(API.UPDATEMENU_URL,data)
    }else{
        return request.post<any,any>(API.ADDMENU_URL,data)
    }
}
//删除已有的菜单的接口
export const reqRemoveMenu=(id:number)=>request.delete(API.REMOVEMENU_URL+id)