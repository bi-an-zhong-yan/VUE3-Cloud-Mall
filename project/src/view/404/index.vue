<template>
    <div class="box">
        <img src="../../assets/images/error_images/404.gif" alt="" @click="goHome">
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
//获取路由信息
let $router = useRouter();
const goHome=()=>{
    $router.push('/home')
}
</script>

<style scoped lang="scss">
.box{
    width: 100vw;
    height:100vh;
    display:flex;
    justify-content: center;
    img{
        width: 100%;
        height:100%
    }
}
</style>