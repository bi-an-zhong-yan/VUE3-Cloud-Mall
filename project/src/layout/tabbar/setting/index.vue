<template>
    <!--顶部右侧静态-->
    <el-button size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
    <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
    <!--泡泡确认框-->
    <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
        <!--放置表单组件-->
        <el-form>
            <el-form-item label="主题颜色">
                <el-color-picker @change="setColor" size="small" v-model="color" show-alpha :predefine="predefineColors" />
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item label="暗黑模式">
                <el-switch @change="changeDark" v-model="dark" size="small" inline-prompt active-icon="Moon" inactive-icon="Sunny" />
            </el-form-item>
        </el-form>
        <template #reference>
            <el-button size="small" icon="Setting" circle></el-button>
        </template>
    </el-popover>
    <img :src="userStore.avatar" style="width:24px;height:24px;margin:0px 10px;border-radius: 50%;">
    <!--下拉菜单-->
    <el-dropdown trigger="click">
        <span class="el-dropdown-link">
            {{ userStore.username }}
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
//引入路由
import { useRouter, useRoute } from 'vue-router'
//获取用户相关的小仓库
import useUserStore from '@/store/modules/user';
//获取骨架的小仓库
import useLayOutSettingStore from '@/store/modules/setting';
let layOutSettingStore = useLayOutSettingStore();
//用户小仓库对应数据
let userStore = useUserStore();
//获取路由器对象
let $router = useRouter()
//获取路由器对象
let $route = useRoute()
//收集开关数据
let dark = ref<boolean>(false)
const updateRefsh = () => {
    layOutSettingStore.refsh = !layOutSettingStore.refsh
}
const fullScreen = () => {
    //一个属性，可以判断是否是全屏的模式
    let full = document.fullscreenElement
    //切换为全屏
    if (!full) {
        //利用根节点的方法requestFullscreen，实现全屏模式
        document.documentElement.requestFullscreen();
    } else {
        //退出全屏模式
        document.exitFullscreen()
    }

}
const logout = async () => {
    //第一件事：向服务器发送请求[退出登录接口]
    //第二件事：仓库里面关于用户的数据要进行清空[token|username|avatar]
    await userStore.userLogout();
    //第三件事：跳转到登录页面
    $router.push({ path: '/login', query: { redirect: $route.path } })
}
//颜色组件需要的数据=============================================
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
//switch开关的change回调 进行暗黑模式的切换
const changeDark=()=>{
    //获取HTML根节点
    let html=document.documentElement
    //判断HTML标签是否有类名标签
    dark.value?html.className='dark':html.className=''
}
//主题颜色的设置
const setColor = ()=>{
   //通知js修改根节点的样式对象的属性与属性值
   const html = document.documentElement;
   html.style.setProperty('--el-color-primary',color.value);
}
</script>
<script  lang="ts">
export default {
    name: 'Setting'
}
</script>
<style scoped></style>