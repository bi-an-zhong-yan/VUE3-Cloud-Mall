<template>
    <!--路由组件出口位置-->
    <div>
        <router-view v-slot="{ Component }">
            <transition name="fade">
                <!--渲染layout一级路由的子路由-->
                <component :is="Component" v-if="flag"/>
            </transition>
        </router-view>
    </div>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting';
import { watch,ref,nextTick } from 'vue';
let layOutSettingStore=useLayOutSettingStore();

//控制当前组件是否销毁重建
let flag = ref(true);

//监听仓库的内部的数据是否发生变化，发生变化，点击过刷新按钮
watch(()=>layOutSettingStore.refsh,()=>{
//点击刷新按钮之后
flag.value=false
nextTick(()=>{
    flag.value=true
})
})
</script>

<style scoped>
.fade-enter-from{
    opacity:0;
    transfrom:scale(0)
}
.fade-enter-active{
    transition:all 1s
}
.fade-enter-to{
    opacity:1;
    transfrom:scale(1)
}
</style>