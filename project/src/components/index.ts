import SvgIcon from './SvgIcon/index.vue';
import type { App, Component } from 'vue';
import Category from './Category/index.vue'
//引入element-plus里面全部的图表组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
//全局对象
// const allGloablComponent:any ={SvgIcon,Category}
const components: { [name: string]: Component } = { SvgIcon,Category };
export default {
    install(app: App) {
        Object.keys(components).forEach((key: string) => {
            app.component(key, components[key]);
        });
        //将element-plus提供的图标注册为全局组件
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
    }
}