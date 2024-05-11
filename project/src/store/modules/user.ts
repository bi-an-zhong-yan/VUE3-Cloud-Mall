//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user';

import { UserState } from './types/type';
//引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token';
//引入路由(常量路由)
import { constantRoute,asnycRoute,anyRoute } from '@/router/routes';
//引入数据类型
import type { loginFormData, loginResponseData, userInfoReponseData } from "@/api/user/type";
//引入路由器
import router from '@/router';
//引入深拷贝组件
import cloneDeep from 'lodash/cloneDeep'
//用于过滤当前用户需要的路由
function filterAsyncRoute(asnycRoute:any,routes:any){
    return asnycRoute.filter((item:any)=>{
        if(routes.includes(item.name)){
            if(item.children && item.children.length>0){
                item.children=filterAsyncRoute(item.children,routes)
            }
            return true;
        }
    })
}
//创建用户小仓库
let useUserStore = defineStore('User', {
    //小仓库存储数据地方
    state: (): UserState => {
        return {
            token: GET_TOKEN(),//用户唯一标识token
            menuRoutes: constantRoute,//仓库存储生成菜单需要数组(路由)
            username: '',
            avatar: '',
            //检测是否包含某一个按钮
            buttons:[]
        }
    },
    //异步逻辑处理地方
    actions: {
        //用户登录的方法
        async userLogin(data: loginFormData) {
            //登录请求
            let result: loginResponseData = await reqLogin(data)
            //登录请求:成功200->token
            //登录请求：失败201->token
            if (result.code === 200) {
                //pinia仓库存储token
                //由于pinia存储是利用js对象
                this.token = (result.data as string)
                //本地存储持久化存储
                SET_TOKEN((result.data as string))
                //保证当前async函数返回成功的promise
                return 'ok';
            } else {
                return Promise.reject(new Error(result.data));
            }
        },
        //获取用户信息的方法
        async userInfo() {
            //获取用户信息，进行存储与仓库当中，比如头像和名字
            let result:userInfoReponseData = await reqUserInfo();
            //如果获取用户信息成功，存储一下用户信息
            if (result.code == 200) {
                this.username = result.data.name;
                this.avatar = result.data.avatar;
                this.buttons=result.data.buttons;
                //计算当前用户需要展示的异步路由
                let userAsyncRoute = filterAsyncRoute(cloneDeep(asnycRoute),result.data.routes)
                //菜单需要的数据整理完毕
                this.menuRoutes = [...constantRoute,...userAsyncRoute,anyRoute];
                //目前路由器管理的只有常量路由,用户计算完毕的异步路由，任意路由动态追加
                [...userAsyncRoute,anyRoute].forEach((route:any) => {
                    router.addRoute(route)
                })
                //打印有的全部的路由
                return 'ok';
            } else {
                return Promise.reject(new Error(result.message))
            }

        },
        //退出登录
        async userLogout() {
            let result: any = await reqLogout()
            //退出登录请求
            if (result.code == 200) {
                //目前没有退出登录的mock接口，(通知服务器本地用户唯一标识失败)
                this.token = ''
                this.username = ''
                this.avatar = ''
                REMOVE_TOKEN();
                //跳转至登录页面
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }


        }
    },
    //计算属性
    getters: {

    }
})
//对外暴露获取小仓库的方法
export default useUserStore;