//小仓库，关于layout相关配置仓库
import { defineStore } from "pinia";

let useLayOutSettingStore = defineStore('SettingStore',{
    state:()=>{
        return {
            fold:false,//用于控制菜单折叠和收起
            refsh:false,//用于控制刷新效果
        }
    }
})
export default useLayOutSettingStore