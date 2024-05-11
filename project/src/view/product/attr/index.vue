<template>
    <div>
        <!--三级分类全局组件-->
        <Category :scene="scene" />
        <!--控制下方卡片---->
        <el-card style="margin:10px 0">
            <div v-show="scene == 0">
                <el-button @click="addAttr" type="primary" size="default" icon="Plus"
                    :disabled="categoryStore.c3Id ? false : true">添加属性</el-button>
                <el-table border style="margin:10px 0px" :data="attrArr">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="{ row, $index }">
                            <el-tag style="margin:5px" v-for="(item, index) in row.attrValueList" :key="item.id">{{
                                item.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120px">
                        <!--代表已有属性对象-->
                        <template #="{ row, $index }">
                            <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
                            <el-popconfirm :title="`你确定删除${row.attrName}?`" @confirm="deleteAttr(row.id)">
                                <template #reference>
                                    <el-button type="primary" size="small" icon="Delete" color="red"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="scene == 1">
                <!--展示添加属性和修改属性的结构-->
                <el-form :inline="true">
                    <el-form-item label="属性名称">
                        <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="addAttrValue" type="primary" size="default" icon="Plus"
                    :disabled="attrParams.attrName ? false : true">添加属性值</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
                <el-table border style="margin:10px 0px" :data="attrParams.attrValueList">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="属性值名称">
                        <!--row即为当前属性值对象-->
                        <template #="{ row, $index }">
                            <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)"
                                size="small" placeholder="请输入属性值名称" v-model="row.valueName"></el-input>
                            <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性值操作">
                        <template #="{ row, $index }">
                            <el-button type="primary" size="small" icon="Delete" color="red"
                                @click="attrParams.attrValueList.splice($index, 1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" size="default" @click="save"
                    :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
            </div>
        </el-card>

    </div>
</template>

<script setup lang="ts">
//组合式API函数watch
import { watch, ref, reactive, nextTick,onBeforeUnmount } from 'vue';
//引入获取已有属性和属性值接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
//获取分类仓库
import useCateGoryStore from '@/store/modules/category';
import { ElMessage } from 'element-plus';

let categoryStore = useCateGoryStore();
//存储已有的属性和属性值
let attrArr = ref<Attr[]>([])
//定义卡片组件的内容切换的变量
let scene = ref<number>(0)//若为0，则显示table，若为1，则为添加和修改的属性结构
//收集新增的属性的数据
let attrParams = reactive<Attr>({
    attrName: "",//属性新增名字
    attrValueList: [//新增属性值数组
    ],
    categoryId: '',//代表哪一个三级分类ID
    categoryLevel: 3 //代表是三级分类
})
//准备一个数组：将来存储对应的组件实例el-input
let inputArr = ref<any>([])
watch(() => categoryStore.c3Id, () => {
    //清空上一次查询的属性与属性值
    attrArr.value = []
    //确保三级要有才能发请求
    if (!categoryStore.c3Id) return
    //获取分类id
    getAttr()
})
//获取已有的属性和属性值方法
const getAttr = async () => {
    const { c1Id, c2Id, c3Id } = categoryStore;
    //获取分类下已有的属性和属性值
    let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id);
    if (result.code == 200) {
        attrArr.value = result.data
    }
}
//添加属性按钮的回调
const addAttr = () => {
    //切换为添加与修改属性的结构
    scene.value = 1
    //每一次点击，清空一下数据，在开始收集
    Object.assign(attrParams, {
        attrName: "",//属性新增名字
        attrValueList: [//新增属性值数组
        ],
        categoryId: categoryStore.c3Id,//代表哪一个三级分类ID
        categoryLevel: 3 //代表是三级分类
    })
    // //点击按钮的时候收集三级Id
    // attrParams.categoryId = categoryStore.c3Id
}
//这是修改按钮的属性
const updateAttr = (row: Attr) => {
    //切换为添加与修改属性的结构
    scene.value = 1
    //将已有的属性对象赋值给atrparams对象即可
    //通过es6语法object.assign进行对象的合并
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)))

}
//取消按钮的回调
const cancel = () => {
    scene.value = 0
    getAttr()
}
//添加属性值按钮的回调
const addAttrValue = () => {
    //点击添加属性值按钮的时候，向数组添加一个属性值对象
    attrParams.attrValueList.push({
        valueName: '',
        flag: true//控制每一个属性编辑模式与切换模式的切换
    })
    //获取最后的el-input组件进行聚焦
    nextTick(() => {
        inputArr.value[attrParams.attrValueList.length - 1].focus()
    })
}
//保存按钮的回调
const save = async () => {
    //发请求
    let result: any = await reqAddOrUpdateAttr(attrParams);
    //添加|修改已有属性成功
    if (result.code == 200) {
        scene.value = 0
        ElMessage({
            type: 'success',
            message: attrParams.id ? '修改成功' : '添加成功'
        })
        //获取全部已有的属性和属性值
        getAttr()
    } else {
        ElMessage({
            type: 'error',
            message: attrParams.id ? '修改失败' : '添加失败'
        })
    }
}
//属性值表单元素失去焦点的回调
const toLook = (row: AttrValue, $index: number) => {
    //非法情况的判断
    if (row.valueName.trim() == '') {
        //删除对应属性值为空的元素
        attrParams.attrValueList.splice($index, 1)
        //弹出提示信息
        ElMessage({
            type: 'error',
            message: '属性值不能为空'
        })
        return;
    }
    //非法情况2,属性值不能相同
    let repeat = attrParams.attrValueList.find((item) => {
        //切记把当前失去焦点的属性值队形从当前数组扣除判断
        if (item != row) {
            return item.valueName === row.valueName
        }
    })
    if (repeat) {
        //将重复的属性值从数组里面干掉
        attrParams.attrValueList.splice($index, 1)
        ElMessage({
            type: 'error',
            message: '属性值不能重复'
        })
        return
    }
    //相应的属性值对象flag：变为false，展示div
    row.flag = false
}
//属性值div点击事件
const toEdit = (row: AttrValue, $index: number) => {
    //相应的属性值对象flag：变为true，展示input
    row.flag = true
    //nextTick：响应式数据发生变化，获取更新的dom
    nextTick(() => {
        inputArr.value[$index].focus()
    })
}
//删除某一个已有方法的回调

const deleteAttr = async (attrId: number) => {
    //发相应的删除已有的属性的请求
    let result: any = await reqRemoveAttr(attrId)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        //删除成功获取一下已有的属性和属性值
        getAttr()
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }

} 
//路由组件销毁的时候，仓库分类相关的数据清空
onBeforeUnmount(()=>{
    //清空仓库的数据
    categoryStore.$reset()
})
</script>

<style scoped></style>