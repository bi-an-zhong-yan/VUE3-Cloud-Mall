<template>
    <template v-for="(item) in menuList" :key="item.path">
        <!--没有子路由-->
        <template v-if="!item.children">
            <el-menu-item :index="item.path" v-if="!item.meta.hidden" @click="goRoute">
                <template #title>
                    <span>{{ item.meta.title }}</span>
                </template>
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
            </el-menu-item>
        </template>
        <!--有子路由，但只有一个-->
        <template v-if="item.children && item.children.length == 1">
            <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta.hidden" @click="goRoute">
                <template #title>
                    <span>{{ item.children[0].meta.title }}</span>
                </template>
                <el-icon>
                    <component :is="item.children[0].meta.icon"></component>
                </el-icon>
            </el-menu-item>
        </template>
        <!--有子路由，有很多个---->
        <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 1">
            <template #title>
                <el-icon color:red>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{ item.meta.title }}</span>
            </template>
            <Menu :menuList="item.children"></Menu>
        </el-sub-menu>
    </template>
</template>

<script setup lang="ts">
//获取父组件传递过来的全部的路由数据
import { useRouter } from 'vue-router';
defineProps(['menuList']);

//获取路由器对象
let $router = useRouter();
//点击菜单的回调
const goRoute = (vc:any) => {
    //路由跳转
    $router.push(vc.index)
}

</script>
<script  lang="ts">
export default {
    name: 'Menu'
}
</script>

<style scoped></style>