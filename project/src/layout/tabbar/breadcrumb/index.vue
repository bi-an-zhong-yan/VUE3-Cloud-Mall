<template>
    <!--顶部左侧静态-->
    <el-icon style="margin-right:10px" @click="changeIcon">
        <component :is="LayOutSettingStore.fold?'Fold':'Expand'"></component>
    </el-icon>
    <!--左侧面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">

        <!--动态展示路由名字与标题-->
        <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
            <!--展示图标-->
            <el-icon style="margin 0px 5px;vertical-align:top;">
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>

    </el-breadcrumb>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
//引入仓库的fold
import useLayOutSettingStore from '@/store/modules/setting';
//获取layout配置相关仓库
let LayOutSettingStore = useLayOutSettingStore();
const changeIcon = () => {
    LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>
<script  lang="ts">
export default {
    name: 'Breadcrumb'
}
</script>
<style scoped></style>