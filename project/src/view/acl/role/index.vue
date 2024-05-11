<template>
    <div>
        <el-card>
            <el-form :inline="true" class="form">
                <el-form-item label="职位搜索">
                    <el-input placeholder="请输入搜索的职位的关键字" v-model="keyword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" :disabled="keyword ? false : true" @click="search">搜索</el-button>
                    <el-button type="primary" size="small" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <el-button type="primary" size="default" icon="Plus" @click="addRole">添加职位</el-button>
            <el-table border style="margin: 10px 0px;" :data="allRole">
                <el-table-column type="index" align="center" label="#"></el-table-column>
                <el-table-column label="id" align="center" prop="id"></el-table-column>
                <el-table-column label="职位名称" align="center" show-overflow-tooltip prop="roleName"></el-table-column>
                <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
                <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
                <el-table-column label="操作" align="center" width="280px">
                    <template #="{ row, $index }">
                        <div>
                            <el-button type="primary" size="small" icon="User" @click="setPermisstion(row)">分配权限</el-button>
                            <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
                            <el-popconfirm :title="`你确定删除${row.roleName}吗？`" @confirm="remove(row.id)">
                                <template #reference>
                                    <el-button type="primary" size="small" icon="Delete">删除</el-button>
                                </template>
                            </el-popconfirm>

                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
                :background="true" layout=" prev, pager, next, jumper,->,sizes, total" :total="total"
                @current-change="getHasRole" @size-change="handler" />
        </el-card>
        <!--添加结构与更新的结构：对话框-->
        <el-dialog v-model="dialogVisite" :title="roleParams.id ? '更新职位' : '添加职位'">
            <el-form :model="roleParams" :rules="rules" ref="form">
                <el-form-item label="职位名称" prop="roleName">
                    <el-input placeholder="请你输入职位名称" v-model="roleParams.roleName"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisite = false">取消</el-button>
                    <el-button type="primary" @click="save">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!--抽屉组件:分配职位菜单权限和按钮权限-->
        <el-drawer v-model="drawer">
            <template #header>
                <h4>分配菜单与按钮权限</h4>
            </template>
            <template #default>
                <!--树形控件-->
                <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all
                    :default-checked-keys="selectArr" :props="defaultProps" />
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="drawer = false">取消</el-button>
                    <el-button type="primary" @click=handle>确定</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermisstion,reqRemoveRole } from '@/api/acl/role'
//ts数据类型
import type { RoleResopnseData, Records, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type'
//引入用户仓库
import useLayOutSettingStore from '@/store/modules/setting';
import { ElMessage } from 'element-plus';
//默认页码
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(5)
//职位总个数
let total = ref<number>(0)
//搜索职位的关键字
let keyword = ref<string>('')
//存储已有全部职位数据
let allRole = ref<Records>([])
//使用仓库
let settingStore = useLayOutSettingStore()
//控制对话框的显示与隐藏
let dialogVisite = ref<boolean>(false)
//获取form组件实例
let form = ref<any>()
//控制抽屉的显示和隐藏
let drawer = ref<boolean>(false)
//收集新增岗位的数据
let roleParams = reactive<RoleData>({
    roleName: '',
})
//准备数组，用来存储select四级（也就是四级勾上的选项）
let selectArr = ref<number[]>([])
//定义数组，存储用户权限的数据
let menuArr = ref<MenuList>([])
//获取tree组件实例
let tree = ref<any>();
//组件挂载完毕
onMounted(() => {
    getHasRole()
})
const getHasRole = async (pager = 1) => {
    pageNo.value = pager
    let result: RoleResopnseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
    if (result.code == 200) {
        total.value = result.data.total
        allRole.value = result.data.records
    }

}
const handler = () => {
    getHasRole();
}
//搜索按钮回调
const search = () => {
    getHasRole();
    keyword.value = ''
}
//重置按钮回调
const reset = () => {
    settingStore.refsh = !settingStore.refsh
}
//添加职位按钮回调
const addRole = () => {
    //对话框显示出来
    dialogVisite.value = true
    //清空数据
    Object.assign(roleParams, {
        roleName: '',
        id: 0
    })
    //清空上一次表单校验的错误的结果
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}
//修改职位按钮回调
const updateRole = (row: RoleData) => {
    //对话框显示出来
    dialogVisite.value = true
    //存储已有职位
    Object.assign(roleParams, row)
    //清空上一次表单校验的错误的结果
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}
//自定义校验规则的回调
const validatorRoleName = (rule: any, value: any, callback: any) => {
    if (value.trim().length >= 2) {
        callback()
    } else {
        callback(new Error('职位必须为两位以上'))
    }
}
//校验规则
const rules = {
    roleName: [
        { required: true, trigger: 'blur', validator: validatorRoleName }
    ]
}
//确定按钮的回调
const save = async () => {
    //表单校验的结果,结果没有通过，不应发请求
    await form.value.validate()
    //添加或更新职位
    let result = await reqAddOrUpdateRole(roleParams)
    if (result.code == 200) {
        //提示文字
        ElMessage({ type: 'success', message: roleParams.id ? '更新成功' : '添加成功' })
        //关闭对话框
        dialogVisite.value = false
        //再次请求数据
        getHasRole(roleParams.id ? pageNo.value : 1)
    }
}
//分配权限按钮的回调
//row代表已有职位的数据
const setPermisstion = async (row: RoleData) => {
    //抽屉显示出来
    drawer.value = true
    //收集当前分配权限的职位的数据
    Object.assign(roleParams, row)
    //根据职位获取权限的数据
    let result: MenuResponseData = await reqAllMenuList((roleParams.id as number))
    if (result.code == 200) {
        menuArr.value = result.data
        selectArr.value = filterSelectArr(menuArr.value, [])
    }

}
const filterSelectArr = (allData: any, initArr: any) => {
    allData.forEach((item: any) => {
        if (item.select && item.level == 4) {
            initArr.push(item.id)
        }
        if (item.children && item.children.length > 0) {
            filterSelectArr(item.children, initArr)
        }
    })
    return initArr
}
//删除按钮的回调
const remove=async(id:number)=>{
    let result:any = await reqRemoveRole(id)
    if(result.code==200){
        ElMessage({type:'success',message:'删除成功'})
        getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }else{
        ElMessage({type:'error',message:'删除失败,数据不可被删除'})
    }
}
//树形控件的测试
const defaultProps = {
    children: 'children',
    label: 'name',
}
//抽屉确定按钮的回调

const handle = async () => {
    //职位的ID
    const roleId = (roleParams.id as number)
    //选中节点的ID
    let arr = tree.value.getCheckedKeys()
    //半选的ID
    let arr1 = tree.value.getHalfCheckedKeys()
    let permisstionId = arr.concat(arr1)
    //下发相应的权限
    let result: any = await reqSetPermisstion(roleId, permisstionId)
    if (result.code == 200) {
        //抽屉关闭
        drawer.value = false
        //提示信息
        ElMessage({ type: 'success', message: '分配权限成功' })
        //页面刷新
        window.location.reload()
    }


}

</script>

<style scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
}
</style>