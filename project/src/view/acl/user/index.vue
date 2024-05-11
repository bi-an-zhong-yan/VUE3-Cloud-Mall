<template>
    <div>
        <el-card style="height: 80px;">
            <el-form :inline="true" class="form">
                <el-form-item label="用户名">
                    <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" :disabled="keyword?false:true" @click="serach">搜索</el-button>
                    <el-button type="primary" size="small" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin: 10px 0px;">
            <el-button type="primary" size="small" @click="addUser">添加用户</el-button>
            <el-button type="primary" size="small" :disabled="selectIdArr.length ? false : true"
                @click="deleteSelectUser">批量删除</el-button>
            <!--表格展示用户信息-->
            <el-table @selection-change="selectChange" style="margin: 10px 0px;" border :data=userArr>
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column label="#" align="center" type="index"></el-table-column>
                <el-table-column label="ID" align="center" prop="id"></el-table-column>
                <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
                <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="260px" align="center">
                    <template #="{ row, $index }">
                        <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
                        <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)"></el-button>
                        <el-popconfirm :title="`你确定删除${row.username}吗?`" width="251px" @confirm="removeUser(row.id)">
                            <template #reference>
                                <el-button type="primary" size="small" icon="Delete" color="red"></el-button>
                            </template>
                        </el-popconfirm>

                    </template>
                </el-table-column>
            </el-table>
            <!--分页器-->
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
                :background="true" layout=" prev, pager, next, jumper,->,sizes, total" :total="total"
                @current-change="getHasUser" @size-change="handler" />
        </el-card>
        <el-drawer v-model="drawer">
            <template #header>
                <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
            </template>
            <!--抽屉的身体部分-->
            <template #default>
                <el-form :model="userParams" :rules="rules" ref="formRef">
                    <el-form-item label="用户姓名" prop="username">
                        <el-input placeholder="请输入用户姓名" v-model="userParams.username"></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="name">
                        <el-input placeholder="请输入用户昵称" v-model="userParams.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
                        <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button type="primary" @click="save">确定</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </template>
        </el-drawer>
        <!--抽屉结构:用于进行职位的分配-->
        <el-drawer v-model="drawer1">
            <template #header>
                <h4>分配角色用户</h4>
            </template>
            <template #default>
                <el-form :model="userParams" :rules="rules" ref="formRef">
                    <el-form-item label="用户姓名">
                        <el-input v-model="userParams.username" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="职位列表">
                        <el-checkbox @change="handleCheckAllChange" v-model="checkAll"
                            :indeterminate="isIndeterminate">全选</el-checkbox>
                        <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">{{ role.roleName
                            }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="drawer1 = false">取消</el-button>
                    <el-button type="primary" @click="confirmClick">确定</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqSelectUser, reqDelUserRole, reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole } from '@/api/acl/user'
import type { SetRoleData, UserResponseData, Records, User, AllRoleResponseData, AllRole } from '@/api/acl/user/type';
import { ElMessage } from 'element-plus';
//引入用户仓库
import useLayOutSettingStore from '@/store/modules/setting';
//默认页码
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(5)
//用户总个数
let total = ref<number>(0)
//存储用户全部数据
let userArr = ref<Records>([])
//控制抽屉显示和隐藏
let drawer = ref<boolean>(false)
//控制分配角色抽屉的显示与隐藏
let drawer1 = ref<boolean>(false)
//存储全部职位的数据
let allRole = ref<AllRole>([])
//当前用户已有的职位
let userRole = ref<AllRole>([]);
//收集信息的响应式数据
let userParams = reactive<User>({
    username: '',
    name: '',
    password: ''
})
//获取form组件实例
let formRef = ref<any>()
//准备批量删除数据的数组存放ID
let selectIdArr = ref<User[]>([])
//定义响应式数据，收集用户输入进来的关键字
let keyword=ref<string|number>('')
//获取模板setting仓库
let settingStore=useLayOutSettingStore()
onMounted(() => {
    getHasUser()
})
const getHasUser = async (pager = 1) => {
    pageNo.value = pager
    let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value,keyword.value)
    if (result.code == 200) {
        total.value = result.data.total
        userArr.value = result.data.records
    }
}
//分页器下拉菜单自定义事件的回调
const handler = () => {
    getHasUser();
}
//添加用户按钮的回调
const addUser = () => {
    //抽屉显示出来
    drawer.value = true
    //清空按钮
    Object.assign(userParams, {
        username: '',
        name: '',
        password: '',
        id: 0
    })
    nextTick(() => {
        //清除上一次提示的信息
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('name')
        formRef.value.clearValidate('password')
    })
}
//分配用户按钮的回调
const updateUser = (row: User) => {
    //抽屉显示出来
    drawer.value = true
    //存储收集已有账号的信息
    Object.assign(userParams, row)
    nextTick(() => {
        //清除上一次提示的信息
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('name')
    })

}
//添加按钮事件的回调
const save = async () => {
    //点击保存按钮的时候，务必需要保证表单全部符合条件再去发请求
    await formRef.value.validate()
    //点击保存按钮：添加新的用户，更新已有用户账号的信息
    let result: any = await reqAddOrUpdateUser(userParams)
    if (result.code == 200) {
        drawer.value = false
        ElMessage({
            type: 'success',
            message: userParams.id ? '更新成功' : '添加成功'
        })
        getHasUser(userParams.id ? pageNo.value : 1)
        //浏览器自动刷新一次
        window.location.reload()
    } else {
        drawer.value = false
        ElMessage({
            type: 'error',
            message: userParams.id ? '更新失败' : '添加失败'
        })
    }
}
//取消按钮回调
const cancel = () => {
    drawer.value = false
}
//校验用户名字回调函数
const validatorUsername = (rule: any, value: any, callBack: any) => {
    //用户的昵称长度至少是五位
    if (value.trim().length >= 2) {
        callBack()
    } else {
        callBack(new Error('用户名字至少两位'))
    }
}
//校验用户昵称回调
const validatorname = (rule: any, value: any, callBack: any) => {
    //用户的昵称长度至少是五位
    if (value.trim().length >= 2) {
        callBack()
    } else {
        callBack(new Error('用户昵称至少两位'))
    }
}
const validatorPassword = (rule: any, value: any, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 6) {
        callBack();
    } else {
        callBack(new Error('用户密码至少六位'))
    }
}
//表单校验规则对象
const rules = {
    //用户名字
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    //用户昵称
    name: [{ required: true, trigger: 'blur', validator: validatorname }],
    //用户的密码
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
//这是分配角色的回调
const setRole = async (row: User) => {

    //存储已有用户的信息
    Object.assign(userParams, row)
    //发请求获取全部职位的数据
    let result: AllRoleResponseData = await reqAllRole((userParams.id as number))
    if (result.code == 200) {
        //存储全部职位
        allRole.value = result.data.allRolesList
        //存储当前用户已有的职位
        userRole.value = result.data.assignRoles
        //抽屉显示出来
        drawer1.value = true
    }

}
//收集顶部复选框的全部数值
const checkAll = ref<boolean>(false)
//控制顶部全部复选框不确定的样式
const isIndeterminate = ref<boolean>(true)
//顶部的全部复选框事件
const handleCheckAllChange = (val: boolean) => {
    //val:true(全选)|false(没有全选)
    userRole.value = val ? allRole.value : [];
    //不确定的样式(确定样式)
    isIndeterminate.value = false
}
//底部所有复选框changge事件
const handleCheckedCitiesChange = (value: string[]) => {
    //顶部复选框的勾选数据
    //代表:勾选上的项目个数与全部的职位个数相等，顶部的复选框勾选上
    checkAll.value = value.length === allRole.value.length;
    //不确定的样式
    isIndeterminate.value = value.length !== allRole.value.length
}
//抽屉底部确定按钮的回调
const confirmClick = async () => {
    //收集参数
    let data: SetRoleData = {
        userId: (userParams.id as number),
        roleIdList: userRole.value.map(item => {
            return (item.id as number)
        })
    }
    //分配用户职位
    let result: any = await reqSetUserRole(data)
    if (result.code == 200) {
        //提示信息
        ElMessage({ type: 'success', message: '分配成功' })
        //关闭抽屉
        drawer1.value = false
        //获取所有用户信息
        getHasUser(pageNo.value)
    }
}
//删除按钮的回调
const removeUser = async (id: number) => {
    let result: any = await reqDelUserRole(id)
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
    }
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
}
//批量删除按钮的回调
const selectChange = (value: any) => {
    selectIdArr.value = value
}
const deleteSelectUser = async () => {
    let idList: any = selectIdArr.value.map(item => {
        return item.id
    })
    //批量删除的请求
    let result: any = await reqSelectUser(idList)
    if(result.code==200){
        ElMessage({type:'success',message:'删除成功'})
    }
    getHasUser()
}
//搜索按钮的回调
const serach=()=>{
    //获取用户信息(根据关键字)
    getHasUser()
    //清空关键字
    keyword.value=''
}
//重置按钮的回调
const reset = ()=>{
    settingStore.refsh=!settingStore.refsh
}
</script>

<style scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>