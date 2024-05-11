//路由鉴权：项目当中路由能不能被被的权限的设置(某一个路由什么时候可以访问，什么时候不能访问)
import router from "./router";
import nprogress from "nprogress";
//引入进度条样式
import "nprogress/nprogress.css"
nprogress.configure({showSpinner:false})
//获取用户相关的小仓库的token数据，去判断用户是否登录成功
import useUserStore from "./store/modules/user";
import pinia from "./store";
//引入setting文件
import setting from "./setting";
let userStore = useUserStore(pinia)
//全局守卫：项目当中任意路由切换都会触发的钩子
//全局前置守卫

//访问某一个路由之前的守卫
router.beforeEach(async(to: any, from: any, next: any) => {

    //to:将要访问那个路由
    //from:你从哪个路由而来
    //next：路由的放行函数
    nprogress.start();
    //获取token，去判断用户是否登录
    let token = userStore.token
    //获取用户名字
    let username = userStore.username
    if(token){
        //登录成功便不能访问login，只能访问首页
        if(to.path=='/login'){
            next({path:'/'})
        }else{
            //登录成功,可以访问其余六个路由(登录页面除外)
            //有用户信息才能放行
            if(username){
            next()
        }else{
            //没有用户信息。在守卫这里发请求，等获取到用户信息之后在放行
            try {
                await userStore.userInfo()
                next({...to})
                //万一：刷新的时候是一部路由，有可能获取到用户信息，异步路由还没有加载完毕，出现空白效果

            } catch (error) {
                //token过期:获取不到用户信息了
                //用户手动修改本地token
                //退出登录->用户相关的数据清空
                await userStore.userLogout()
                next({path:'/login',query:{redirect:to.path}})
            } 
            

        }
        }
    }else{
        //用户未登录
        if(to.path=='/login'){
            next();
        }else{
            next({path:'/login',query:{redirect:to.path}})
        }
    }


})

//全局后置守卫
router.afterEach((to: any, from: any) => {
    document.title=`${setting.title} - ${to.meta.title}`
    //访问某一个路由之后的守卫
    nprogress.done();
})
//第一个问题：任意路由切换，实现进度条的业务 --nprogress
//第二个问题：路由鉴权限[路由组件访问权限的问题]
//全部路由组件：登录[404]任意路由[首页],数据大屏,权限管理(三个子路由),商品管理(四个子路由)

//用户未登录：可以访问login，其余不可访问(指向login)
//用户登录成功：不可访问login，其余可以访问
