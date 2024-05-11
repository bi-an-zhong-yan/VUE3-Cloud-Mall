<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
                    <h2>欢迎登录</h2>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input :prefix-icon="Lock" type="password" v-model="loginForm.password" show-password>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" class="login_btn" type="primary" size="default"
                            @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';
import { useRouter,useRoute } from 'vue-router';
//引入获取时间的函数
import { getTime } from '@/utils/time'
//引入用户相关仓库
import useUserStore from "@/store/modules/user"
import { ElNotification } from 'element-plus';
let useStore = useUserStore()
//获取el-from组件
let loginForms = ref()
//获取路由器
let $router = useRouter()
//获取路由对象
let $route=useRoute()
//定义变量控制按钮加载效果
let loading = ref(false)
//收集账号与密码的数据
let loginForm = reactive({ username: 'admin', password: 'atguigu123' })
//登录按钮回调
const login = async () => {
    //保障全部表单项校验同过，在发送请求
    await loginForms.value.validate()
    //登录按钮的加载效果：开始加载
    loading.value = true
    //点击登录按钮之后，通知仓库发送登录请求
    //请求成功->展示首页
    //失败->弹出登录失败信息
    try {
        //可以书写.then语法
        await useStore.userLogin(loginForm)
        //编程式路由导航跳转至数据首页
        //判断登录的时候，路由路径当中是否有query
        let redirect:any = $route.query.redirect
        $router.push({path:redirect||'/'})
        //登录成功提示信息
        ElNotification({
            type: 'success',
            message: '登录成功',
            title: `HI,${getTime()}好`
        });
        //登录成功，加载效果也消失
        loading.value = false
    } catch (error) {
        //登录失败，加载按钮消失
        loading.value = false
        ElNotification({
            type: 'error',
            message: (error as Error).message
        })
    }

}
//自定义规则调用函数
const validatorUserName = (rule: any, value: any, callback: any) => {
    //rule:是校验规则的对象
    //value:表单元素的文本内容
    //callback:校验是否通过，成功，调用函数，失败，返回错误信息
    if (value.length>=5) {
        callback()
    } else {
        callback(new Error("账号长度至少5位"))
    }
}
const validatorPassWord = (rule: any, value: any, callback: any) => {
    //rule:是校验规则的对象
    //value:表单元素的文本内容
    //callback:校验是否通过，成功，调用函数，失败，返回错误信息
    if (value.length>=6) {
        callback()
    } else {
        callback(new Error("密码长度至少6位"))
    }
}
//定义表单校验需要配置的对象
const rules = {
    //required:代表字段必须被校验
    //min:文本长度至少多少位
    //max:文本长度最多多少位
    //message:错误的提示信息
    //trigger：触发时机
    username: [
        //{required:true,min:5,max:10,message:'账号长度至少6位',trigger:'change'}
        { trigger: 'change', validator: validatorUserName }
    ],
    password: [
        //{required:true,min:6,max:16,message:'密码长度至少6位',trigger:'blur'}
        { trigger: 'change', validator: validatorPassWord }
    ]
}
</script>

<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;
}

.login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;

    h2 {
        margin: 20px 0px;
        color: azure;
        font-size: 20px;
    }
}

.login_btn {
    width: 100%;
}
</style>