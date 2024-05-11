import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import SvgIcon from '@/components/SvgIcon/index.vue'
//svg插件需要配置代码
import 'virtual:svg-icons-register'
//引入自定义插件对象,注册整个项目的全局组件
import globalComponent from '@/components'
const app = createApp(App);
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//暗黑模式需要的组件样式
import 'element-plus/theme-chalk/dark/css-vars.css'
//引入模板的全局样式
import '@/styles/index.scss'
//引入配置的路由
import router from "./router";
//引入仓库
import pinia from './store'
app.use(ElementPlus, {
    locale: zhCn
})
app.component('SvgIcon', SvgIcon)
//安装自定义插件
app.use(globalComponent)
//注册模板路由
app.use(router)
//注册仓库
app.use(pinia)
//引入路由鉴权文件
import './permisstion'
//引入自定义指令文件
import { isHasButton } from "./directive/has";
isHasButton(app)
//将应用挂载到挂载点上
app.mount("#app")

