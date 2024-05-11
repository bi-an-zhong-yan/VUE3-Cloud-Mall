<template>
    <div>
        <!--三级分类-->
        <Category :scene="scene" />
        <el-card style="margin: 10px 0px;">
            <!--v-if,v-show:都可是实现显示和隐藏-->
            <div v-show="scene == 0">
                <el-button @click="addSpu" type="primary" size="default" icon="Plus"
                    :disabled="!categoryStore.c3Id ? true : false">添加SPU</el-button>
                <!--展示已有SPU数据-->
                <el-table style="margin: 10px 0px;" border :data="records">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="SPU名称" prop="spuName"></el-table-column>
                    <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作">
                        <!--row是已有的spu对象-->
                        <template #="{ row, $index }">
                            <el-button type="primary" size="small" icon="Plus" title="添加sku"
                                @click="addSku(row)"></el-button>
                            <el-button type="primary" size="small" icon="Edit" title="修改spu"
                                @click="updateSpu(row)"></el-button>
                            <el-button type="primary" size="small" icon="View" title="查看sku列表"
                                @click="findSku(row)"></el-button>
                            <el-popconfirm title="确定删除吗？" width="200px" @confirm="deleteSpu(row)">
                                <template #reference>
                                    <el-button type="primary" size="small" icon="Delete" color="red" title="删除已有SPU"></el-button>
                                </template>
                            </el-popconfirm>
                            
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                    :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
                    @current-change="getHasSpu" @size-change="changeSize" />
            </div>
            <!--添加SPU|修改SPU子组件-->
            <SpuForm ref="Spu" v-show="scene == 1" @changeScene="changeScene" />
            <!--添加SKU子组件-->
            <SkuForm ref="Sku" v-show="scene == 2" @changeScene="changeScene" />
            <!--dialog对话框：展示已有的sku数据-->
            <el-dialog title="sku列表" v-model="show">
                <el-table border :data="skuArr">
                    <el-table-column label="sku名字" prop="skuName"></el-table-column>
                    <el-table-column label="sku价格" prop="price"></el-table-column>
                    <el-table-column label="sku重量" prop="weight"></el-table-column>
                    <el-table-column label="sku图片">
                        <template #="{ row, $index }">
                            <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import useCateGoryStore from '@/store/modules/category';
import type { HasSpuResponseData, Records, SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type'

import { ref, watch,onBeforeUnmount } from 'vue'
import { reqHasSpu, reqSkuList,reqRemoveSpu } from '@/api/product/spu/index'
//引入相应的子组件
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { ElMessage } from 'element-plus';
let categoryStore = useCateGoryStore()
//场景的数据
let scene = ref<number>(0)//0 显示已有SPU 1：添加或者修改已有SPU 2：添加SKU的结构
//分页器默认页码
let pageNo = ref<number>(1)
//每页展示几条数据
let pageSize = ref<number>(3)
//存储已有的spu数据
let records = ref<Records>([])
//存储已有spu总个数
let total = ref<number>(0)
//获取子组件实例SpuForm
let Spu = ref<any>()
//获取子组件实例SkuForm
let Sku = ref<any>()
//存储全部SKU的数据
let skuArr = ref<SkuData[]>([])
//控制对话框的显示与隐藏
let show = ref<boolean>(false)
//监听三级分类ID的变化
watch(() => categoryStore.c3Id, () => {
    //要有三级分类id才可以发请求
    if (!categoryStore.c3Id) return
    getHasSpu()
})

//此方法执行，可以获取某一个三级分类下全部已有的SPU
const getHasSpu = async (pager = 1) => {
    //修改当前页码
    pageNo.value = pager
    let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
    if (result.code == 200) {
        records.value = result.data.records
        total.value = result.data.total
    }
}
//分页器的下拉菜单发生变化的时候触发
const changeSize = () => {
    getHasSpu()
}
const addSpu = () => {
    //切换为场景1：添加与修改SPU结构
    scene.value = 1
    //使用子组件的实例
    Spu.value.initAddSpu(categoryStore.c3Id)
}
//子组件spuform绑定自定义事件：目前让子组件通知父组件切换场景为0
const changeScene = (obj: any) => {
    //子组件spuform点击取消，变为场景0：展示已有的spu
    scene.value = obj.flag
    //再次获取所有SPU
    if (obj.params == 'update') {
        //更新留在当前页，添加留在当前页
        getHasSpu(pageNo.value)
    } else {
        getHasSpu()
    }

}
//修改已有的SPU的按钮的回调
const updateSpu = (row: SpuData) => {
    scene.value = 1
    //调用子组件实例方法，获取完整spu的数据
    Spu.value.initHasSpuData(row)
}
//添加SKU按钮的回调
const addSku = (row: SpuData) => {
    //点击切换按钮，将场景切换为2
    scene.value = 2;
    Sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
//查看sku列表的数据
const findSku = async (row: SpuData) => {
    let result: SkuInfoData = await reqSkuList((row.id as number))
    if (result.code == 200) {
        skuArr.value = result.data
    }
    //显示对话框 
    show.value = true
}
//删除已有的SPU属性
const deleteSpu = async(row:SpuData)=>{
    let result:any = await reqRemoveSpu((row.id as number))
    console.log(result);
    
    if(result.code==200){
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        //获取剩余的SPU已有的数据
        getHasSpu()
    }else{
        ElMessage({
            type:'error',
            message:'删除失败'
        })
    }
}
//清空仓库关于分类的数据
onBeforeUnmount(()=>{
    categoryStore.$reset()
})
</script>

<style scoped></style>