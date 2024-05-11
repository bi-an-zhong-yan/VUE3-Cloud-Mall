//引入仓库
import pinia from "@/store"
import useUserStore from "@/store/modules/user"
let useStore = useUserStore(pinia)
//暴露函数
export const isHasButton = (app:any)=>{
    //全局自定义指令,实现按钮权限
    app.directive('has',{
        //获取对应的用户的仓库

        //代表使用这个全局自定义指令的DOM|组件挂载的时候会执行一次
        mounted(el:any,options:any){
            //自定义指令右侧的数值：如果在用户信息的button数组中没有，则直接干掉DOM树
            if(useStore.buttons.includes(options.value)){
                el.parentNode.removeChild(el)
            }
        },
    })
}


