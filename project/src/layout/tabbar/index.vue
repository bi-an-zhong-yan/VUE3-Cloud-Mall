<template>
    <div class="tabbar">
        <div class="tabbar_left">
            <breadcrumb/>
        </div>
        <div class="tabbar_right">
            <setting/>
        </div>
    </div>
</template>

<script setup lang="ts">
//--左侧面包屑--
import breadcrumb from './breadcrumb/index.vue'
//右侧菜单
import setting from './setting/index.vue'
</script>
<script  lang="ts">
export default {
    name: 'Tabbar'
}
</script>
<style scoped lang="scss">
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    //background-image:linear-gradient(to right,white,black,white);
}

.tabbar_left {
    display: flex;
    align-items: center;
    margin-right: 20px
}

.tabbar_right {
    display: flex;
    align-items: center;
}
</style>