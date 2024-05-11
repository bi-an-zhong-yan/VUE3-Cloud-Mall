//统一管理项目用户相关接口
import request from "@/utils/request";
import type { loginFormData,loginResponseData,userInfoReponseData } from "./type";
//项目用户相关的请求地址
enum API{
    //登录的接口
    LOGIN_URL="/admin/acl/index/login",
    //获取用户信息的接口
    USERINFO_URL="/admin/acl/index/info",
    //登出接口
    LOGOUT_URL="/admin/acl/index/logout"
    //获取管理
}
//登录接口
export const reqLogin =(data:loginFormData)=>request.post<any,loginResponseData>(API.LOGIN_URL,data)
//获取用户信息
export const reqUserInfo =()=>request.get<any,userInfoReponseData>(API.USERINFO_URL)
//退出登录
export const reqLogout =()=>request.post<any,any>(API.LOGOUT_URL)